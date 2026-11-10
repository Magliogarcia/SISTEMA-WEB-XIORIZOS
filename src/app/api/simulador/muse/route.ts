import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { MUSE_CONFIG } from "@/lib/muse-config";

// Interfaz para elementos en caché
interface CachedResult {
  imageBase64: string;
  mimeType: string;
  usage?: Record<string, unknown>;
  createdAt: number;
}

// 1. Caché en memoria (máximo 200 entradas LRU simple)
const memoryCache = new Map<string, CachedResult>();
const MAX_MEMORY_CACHE = 200;

// Carpeta local para persistencia temporal de caché
const CACHE_DIR = path.join(process.cwd(), "tmp", "muse-cache");

// 2. Control de concurrencia y límite diario por IP en memoria
// NOTA: Este contador vive en memoria RAM del servidor y se reinicia si el proceso de Next.js se reinicia.
interface IpRateLimit {
  count: number;
  dateStr: string; // YYYY-MM-DD
  activeRequests: number;
}
const ipLimits = new Map<string, IpRateLimit>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const maxDaily = Number(process.env.MUSE_DAILY_LIMIT) || MUSE_CONFIG.dailyLimitDefault;
  const today = new Date().toISOString().slice(0, 10);

  let record = ipLimits.get(ip);
  if (!record || record.dateStr !== today) {
    record = { count: 0, dateStr: today, activeRequests: 0 };
    ipLimits.set(ip, record);
  }

  // Máximo 1 solicitud concurrente por IP
  if (record.activeRequests >= MUSE_CONFIG.maxConcurrentPerIp) {
    return {
      allowed: false,
      reason: "Ya tienes una solicitud de simulación procesándose. Por favor espera a que termine.",
    };
  }

  // Límite diario por IP
  if (record.count >= maxDaily) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${maxDaily} generaciones de IA por día para tu conexión.`,
    };
  }

  return { allowed: true };
}

function trackRequestStart(ip: string) {
  const record = ipLimits.get(ip);
  if (record) {
    record.activeRequests += 1;
  }
}

function trackRequestEnd(ip: string, incrementCount: boolean) {
  const record = ipLimits.get(ip);
  if (record) {
    record.activeRequests = Math.max(0, record.activeRequests - 1);
    if (incrementCount) {
      record.count += 1;
    }
  }
}

function getFromDiskCache(hash: string): CachedResult | null {
  try {
    const filePath = path.join(CACHE_DIR, `${hash}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return data as CachedResult;
    }
  } catch (err) {
    console.error("Error reading muse disk cache:", err);
  }
  return null;
}

function saveToDiskCache(hash: string, result: CachedResult) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const filePath = path.join(CACHE_DIR, `${hash}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result), "utf-8");
  } catch (err) {
    console.error("Error writing muse disk cache:", err);
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  const clientIp = getClientIp(req);

  // 1. Verificación del interruptor de activación
  if (process.env.MUSE_ENABLED !== "true") {
    return NextResponse.json(
      {
        error:
          "El servicio de simulación con IA Meta: Muse Image no está activo en este momento (MUSE_ENABLED !== 'true').",
      },
      { status: 503 }
    );
  }

  // 2. Control de concurrencia y cuota diaria
  const limitCheck = checkRateLimit(clientIp);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: limitCheck.reason },
      { status: 429 }
    );
  }

  // 3. Validación de API Key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY no está configurada en el servidor." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Formato inválido. Se espera multipart/form-data." },
      { status: 400 }
    );
  }

  const imageEntry = formData.get("image");
  const colorName = formData.get("colorName")?.toString().trim();
  const colorHex = formData.get("colorHex")?.toString().trim();

  // Validación manual de campos
  if (!imageEntry || !(imageEntry instanceof Blob)) {
    return NextResponse.json(
      { error: "Se requiere un archivo de imagen en el campo 'image'." },
      { status: 400 }
    );
  }

  if (imageEntry.size > MUSE_CONFIG.maxFileSizeBytes) {
    return NextResponse.json(
      { error: `La imagen excede el peso máximo permitido (${MUSE_CONFIG.maxFileSizeMb} MB).` },
      { status: 400 }
    );
  }

  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimes.includes(imageEntry.type)) {
    return NextResponse.json(
      { error: "Formato de imagen no soportado. Se aceptan únicamente JPEG, PNG y WebP." },
      { status: 400 }
    );
  }

  if (!colorName || colorName.length > 50) {
    return NextResponse.json(
      { error: "El nombre del color es obligatorio y debe tener como máximo 50 caracteres." },
      { status: 400 }
    );
  }

  const hexRegex = /^#([0-9A-Fa-f]{6})$/;
  if (!colorHex || !hexRegex.test(colorHex)) {
    return NextResponse.json(
      { error: "El colorHex debe tener formato hexadecimal válido (#RRGGBB)." },
      { status: 400 }
    );
  }

  trackRequestStart(clientIp);

  try {
    // 4. Redimensionamiento con Sharp
    const arrayBuffer = await imageEntry.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const resizedBuffer = await sharp(inputBuffer)
      .rotate() // Respeta orientación EXIF
      .resize({
        width: MUSE_CONFIG.maxSide,
        height: MUSE_CONFIG.maxSide,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: MUSE_CONFIG.jpegQuality })
      .toBuffer();

    // 5. Cálculo de hash sha256 para caché
    const hash = crypto
      .createHash("sha256")
      .update(resizedBuffer)
      .update(colorHex.toUpperCase())
      .digest("hex");

    // Comprobar memoria
    const cachedMemory = memoryCache.get(hash);
    if (cachedMemory) {
      const latencyMs = Date.now() - startTime;
      console.log(
        `[Muse-API] model=${MUSE_CONFIG.modelId} latency=${latencyMs}ms cached=true size=${cachedMemory.imageBase64.length}b`
      );
      trackRequestEnd(clientIp, false);
      return NextResponse.json({
        imageBase64: cachedMemory.imageBase64,
        mimeType: cachedMemory.mimeType,
        cached: true,
        latencyMs,
        usage: cachedMemory.usage,
      });
    }

    // Comprobar disco
    const cachedDisk = getFromDiskCache(hash);
    if (cachedDisk) {
      memoryCache.set(hash, cachedDisk);
      const latencyMs = Date.now() - startTime;
      console.log(
        `[Muse-API] model=${MUSE_CONFIG.modelId} latency=${latencyMs}ms cached=true size=${cachedDisk.imageBase64.length}b`
      );
      trackRequestEnd(clientIp, false);
      return NextResponse.json({
        imageBase64: cachedDisk.imageBase64,
        mimeType: cachedDisk.mimeType,
        cached: true,
        latencyMs,
        usage: cachedDisk.usage,
      });
    }

    // 6. Preparar petición a OpenRouter
    const inputBase64 = resizedBuffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${inputBase64}`;

    const promptText = `Edit this photo. Change ONLY the hair color to ${colorName} (${colorHex}). Keep the exact same hairstyle, curl pattern, volume and texture, with natural highlights and shadows. Do not change the face, skin, eyes, expression, clothing, background, lighting, or framing. Photorealistic result with the same composition.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), MUSE_CONFIG.timeoutMs);

    let openRouterRes: Response;
    try {
      openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://xiorizos.com",
          "X-Title": "Xiorizos Curl Salon",
        },
        body: JSON.stringify({
          model: MUSE_CONFIG.modelId,
          modalities: ["image", "text"],
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: promptText,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: dataUrl,
                  },
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!openRouterRes.ok) {
      const errorText = await openRouterRes.text();
      trackRequestEnd(clientIp, false);
      console.error(
        `[Muse-API Error] status=${openRouterRes.status} body=${errorText.slice(0, 300)}`
      );
      return NextResponse.json(
        {
          error: `Error de OpenRouter (${openRouterRes.status}): ${errorText.slice(0, 200)}`,
        },
        { status: 502 }
      );
    }

    const openRouterData = await openRouterRes.json();
    const message = openRouterData?.choices?.[0]?.message;

    // 7. Extraer la imagen generada
    let outputImageBase64: string | null = null;
    let outputMimeType = "image/jpeg";

    if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
      const imgObj = message.images[0];
      const rawUrl: string = imgObj?.image_url?.url || imgObj?.url || "";
      if (rawUrl.startsWith("data:")) {
        const matches = rawUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          outputMimeType = matches[1];
          outputImageBase64 = matches[2];
        } else {
          outputImageBase64 = rawUrl.replace(/^data:[^;]+;base64,/, "");
        }
      } else if (rawUrl.startsWith("http")) {
        // Si OpenRouter devuelve una URL temporal, descargarla a buffer
        const dlRes = await fetch(rawUrl);
        if (dlRes.ok) {
          const dlBuf = await dlRes.arrayBuffer();
          outputImageBase64 = Buffer.from(dlBuf).toString("base64");
          outputMimeType = dlRes.headers.get("content-type") || "image/jpeg";
        }
      }
    } else if (typeof message?.content === "string") {
      const match = message.content.match(/data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=]+)/);
      if (match) {
        outputMimeType = `image/${match[1]}`;
        outputImageBase64 = match[2];
      }
    }

    if (!outputImageBase64) {
      trackRequestEnd(clientIp, false);
      console.error("[Muse-API] OpenRouter no retornó imagen en el mensaje");
      return NextResponse.json(
        {
          error:
            "El modelo procesó la solicitud pero no retornó una imagen válida en su respuesta.",
          rawSnippet: JSON.stringify(message || {}).slice(0, 300),
        },
        { status: 502 }
      );
    }

    // 8. Guardar en caché
    const cacheItem: CachedResult = {
      imageBase64: outputImageBase64,
      mimeType: outputMimeType,
      usage: openRouterData?.usage,
      createdAt: Date.now(),
    };

    if (memoryCache.size >= MAX_MEMORY_CACHE) {
      const firstKey = memoryCache.keys().next().value;
      if (firstKey) memoryCache.delete(firstKey);
    }
    memoryCache.set(hash, cacheItem);
    saveToDiskCache(hash, cacheItem);

    // Incrementar contador de IP exitoso
    trackRequestEnd(clientIp, true);

    const latencyMs = Date.now() - startTime;
    // Log estricto: modelo, latencia, cached, tamaño de salida. NUNCA el base64 ni la foto.
    console.log(
      `[Muse-API] model=${MUSE_CONFIG.modelId} latency=${latencyMs}ms cached=false size=${outputImageBase64.length}b`
    );

    return NextResponse.json({
      imageBase64: outputImageBase64,
      mimeType: outputMimeType,
      cached: false,
      latencyMs,
      usage: openRouterData?.usage,
    });
  } catch (error: unknown) {
    trackRequestEnd(clientIp, false);
    const err = error as Error;
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Tiempo de espera agotado al conectar con OpenRouter (60 s)." },
        { status: 504 }
      );
    }
    console.error("[Muse-API Error]", err.message);
    return NextResponse.json(
      { error: `Error procesando la imagen: ${err.message}` },
      { status: 500 }
    );
  }
}

