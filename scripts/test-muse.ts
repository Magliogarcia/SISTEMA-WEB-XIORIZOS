/**
 * Script de prueba controlada para el modelo Meta: Muse Image vía OpenRouter
 * Ejecución segura con límite de llamadas y verificación de costos.
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const MUSE_CONFIG = {
  modelId: "meta/muse-image",
  maxSide: 1024,
  jpegQuality: 85,
  costPerCallUsd: 0.01,
  timeoutMs: 60_000,
  testTones: [
    {
      name: "Rubio Ceniza",
      hex: "#C2B280",
      description: "Tono claro frío equilibrado para hebras onduladas y rizadas",
    },
    {
      name: "Castaño Chocolate",
      hex: "#4A2E18",
      description: "Tono cálido profundo con reflejos naturales",
    },
  ],
};

// Cargar variables de entorno desde .env.local sin librerías externas
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvLocal();

interface TestResult {
  photoFile: string;
  colorName: string;
  colorHex: string;
  latencyMs: number;
  cached: boolean;
  success: boolean;
  error?: string;
  outputPath?: string;
  comparisonPath?: string;
}

async function runProbe() {
  console.log("===============================================================");
  console.log(" 🧪 PROBE CONTROLADO: Meta: Muse Image vía OpenRouter");
  console.log("===============================================================\n");

  const fixturesDir = path.join(process.cwd(), "tests", "fixtures", "muse");

  if (!fs.existsSync(fixturesDir)) {
    console.error(`❌ La carpeta de fixtures no existe: ${fixturesDir}`);
    process.exit(1);
  }

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const photoFiles = fs
    .readdirSync(fixturesDir)
    .filter((f) => validExtensions.includes(path.extname(f).toLowerCase()));

  const colors = MUSE_CONFIG.testTones;
  const numPhotos = photoFiles.length;
  const numColors = colors.length;
  const totalCalls = numPhotos * numColors;
  const costPerCall = MUSE_CONFIG.costPerCallUsd;
  const estimatedCost = (totalCalls * costPerCall).toFixed(2);

  console.log(`📁 Fotos encontradas en tests/fixtures/muse/: ${numPhotos}`);
  photoFiles.forEach((file, idx) => console.log(`   ${idx + 1}. ${file}`));
  console.log(`🎨 Tonos a evaluar: ${numColors}`);
  colors.forEach((c) => console.log(`   • ${c.name} (${c.hex})`));
  console.log(`\n📊 Total de llamadas planificadas: ${totalCalls} (${numPhotos} fotos × ${numColors} colores)`);
  console.log(`💰 Costo estimado máximo: $${estimatedCost} USD (${totalCalls} × $${costPerCall})\n`);

  if (numPhotos === 0) {
    console.log("⚠️ AVISO: Aún no has colocado fotos en tests/fixtures/muse/.");
    console.log("   Coloca 3 fotos en esa carpeta:");
    console.log("   1. Una de cabello liso");
    console.log("   2. Una de cabello rizado");
    console.log("   3. Una con fondo complejo o luz fuerte");
    console.log("   (Todas deben ser personas con consentimiento otorgado).");
    console.log("\n🛑 Ejecución detenida con costo $0.00.");
    process.exit(0);
  }

  // Comprobar la confirmación explícita
  const isConfirmed = process.env.CONFIRM === "yes";

  if (!isConfirmed) {
    console.log("🛑 EJECUCIÓN DETENIDA (Costo: $0.00)");
    console.log("   Para proteger tu saldo, este script NO ejecuta llamadas reales sin confirmación.");
    console.log("   Para autorizar las llamadas al modelo, ejecuta el comando con CONFIRM=yes:");
    console.log("\n   PowerShell:");
    console.log('   $env:CONFIRM="yes"; npm run test:muse');
    console.log("\n   CMD / Bash:");
    console.log("   CONFIRM=yes npm run test:muse\n");
    process.exit(0);
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("❌ ERROR: OPENROUTER_API_KEY no encontrada en .env.local.");
    process.exit(1);
  }

  console.log("🚀 Confirmación recibida (CONFIRM=yes). Iniciando prueba controlada...\n");

  const dateFolder = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outputDir = path.join(process.cwd(), "tests", "output", "muse", dateFolder);
  fs.mkdirSync(outputDir, { recursive: true });

  const results: TestResult[] = [];
  let successfulCalls = 0;

  for (let i = 0; i < photoFiles.length; i++) {
    const photoFile = photoFiles[i];
    const photoPath = path.join(fixturesDir, photoFile);
    const photoBaseName = path.parse(photoFile).name;

    // Copiar foto original al directorio de salida
    const destOriginal = path.join(outputDir, `${photoBaseName}_original${path.extname(photoFile)}`);
    fs.copyFileSync(photoPath, destOriginal);

    for (let j = 0; j < colors.length; j++) {
      const tone = colors[j];
      const testIndex = i * colors.length + j + 1;
      console.log(`[${testIndex}/${totalCalls}] Procesando ${photoFile} con tono ${tone.name} (${tone.hex})...`);

      const startTime = Date.now();
      try {
        // Optimizar imagen local con sharp
        const inputBuffer = fs.readFileSync(photoPath);
        const resizedBuffer = await sharp(inputBuffer)
          .rotate()
          .resize({
            width: MUSE_CONFIG.maxSide,
            height: MUSE_CONFIG.maxSide,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: MUSE_CONFIG.jpegQuality })
          .toBuffer();

        const inputBase64 = resizedBuffer.toString("base64");
        const promptText = `Edit this photo. Change ONLY the hair color to ${tone.name} (${tone.hex}). Keep the exact same hairstyle, curl pattern, volume and texture, with natural highlights and shadows. Do not change the face, skin, eyes, expression, clothing, background, lighting, or framing. Photorealistic result with the same composition.`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), MUSE_CONFIG.timeoutMs);

        let res: Response;
        try {
          res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://xiorizos.com",
              "X-Title": "Xiorizos Curl Salon Probe",
            },
            body: JSON.stringify({
              model: MUSE_CONFIG.modelId,
              modalities: ["image", "text"],
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: promptText },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${inputBase64}` } },
                  ],
                },
              ],
            }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
        }

        const latencyMs = Date.now() - startTime;

        if (!res.ok) {
          const errText = await res.text();
          console.error(`   ❌ Error HTTP ${res.status}: ${errText.slice(0, 180)}`);
          results.push({
            photoFile,
            colorName: tone.name,
            colorHex: tone.hex,
            latencyMs,
            cached: false,
            success: false,
            error: `HTTP ${res.status}: ${errText.slice(0, 150)}`,
          });
          continue;
        }

        const data = await res.json();
        const message = data?.choices?.[0]?.message;

        let outputBase64: string | null = null;
        if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
          const rawUrl = message.images[0]?.image_url?.url || message.images[0]?.url || "";
          if (rawUrl.startsWith("data:")) {
            outputBase64 = rawUrl.replace(/^data:[^;]+;base64,/, "");
          } else if (rawUrl.startsWith("http")) {
            const dl = await fetch(rawUrl);
            const dlBuf = await dl.arrayBuffer();
            outputBase64 = Buffer.from(dlBuf).toString("base64");
          }
        } else if (typeof message?.content === "string") {
          const match = message.content.match(/data:image\/[a-zA-Z]+;base64,([A-Za-z0-9+/=]+)/);
          if (match) outputBase64 = match[1];
        }

        if (!outputBase64) {
          console.error("   ❌ Respuesta sin imagen generada.");
          results.push({
            photoFile,
            colorName: tone.name,
            colorHex: tone.hex,
            latencyMs,
            cached: false,
            success: false,
            error: "El modelo no retornó ninguna imagen en su respuesta.",
          });
          continue;
        }

        successfulCalls += 1;
        const toneSafeName = tone.name.toLowerCase().replace(/\s+/g, "_");
        const outImgFile = `${photoBaseName}_${toneSafeName}.jpg`;
        const outImgPath = path.join(outputDir, outImgFile);
        const outBuffer = Buffer.from(outputBase64, "base64");
        fs.writeFileSync(outImgPath, outBuffer);

        // Crear imagen lado a lado (Side-by-Side)
        const sideBySideFile = `${photoBaseName}_vs_${toneSafeName}.jpg`;
        const sideBySidePath = path.join(outputDir, sideBySideFile);

        const metaOrig = await sharp(resizedBuffer).metadata();
        const metaOut = await sharp(outBuffer).metadata();

        const height = Math.min(metaOrig.height || 800, metaOut.height || 800);
        const img1Resized = await sharp(resizedBuffer).resize({ height }).toBuffer();
        const img2Resized = await sharp(outBuffer).resize({ height }).toBuffer();

        const m1 = await sharp(img1Resized).metadata();
        const m2 = await sharp(img2Resized).metadata();

        const totalWidth = (m1.width || 400) + (m2.width || 400);

        await sharp({
          create: {
            width: totalWidth,
            height,
            channels: 3,
            background: { r: 18, g: 18, b: 18 },
          },
        })
          .composite([
            { input: img1Resized, left: 0, top: 0 },
            { input: img2Resized, left: m1.width || 400, top: 0 },
          ])
          .jpeg({ quality: 90 })
          .toFile(sideBySidePath);

        console.log(`   ✅ Éxito en ${latencyMs}ms | Guardado en: ${outImgFile}`);

        results.push({
          photoFile,
          colorName: tone.name,
          colorHex: tone.hex,
          latencyMs,
          cached: false,
          success: true,
          outputPath: outImgFile,
          comparisonPath: sideBySideFile,
        });
      } catch (err: unknown) {
        const error = err as Error;
        console.error(`   ❌ Excepción: ${error.message}`);
        results.push({
          photoFile,
          colorName: tone.name,
          colorHex: tone.hex,
          latencyMs: Date.now() - startTime,
          cached: false,
          success: false,
          error: error.message,
        });
      }
    }
  }

  // Generar reporte en Markdown
  const reportPath = path.join(outputDir, "report.md");
  let md = `# Reporte de Probe: Meta: Muse Image (OpenRouter)\n\n`;
  md += `**Fecha:** ${new Date().toLocaleString("es-VE")}\n`;
  md += `**Modelo:** \`${MUSE_CONFIG.modelId}\`\n`;
  md += `**Llamadas exitosas:** ${successfulCalls} de ${totalCalls}\n`;
  md += `**Costo real incurrido:** $${(successfulCalls * costPerCall).toFixed(2)} USD\n\n`;

  md += `## Tabla de Resultados\n\n`;
  md += `| Foto Original | Tono Solicitado | Hex | Latencia | Estado | Resultado | Comparativa Lado a Lado |\n`;
  md += `|---|---|---|---|---|---|---|\n`;

  for (const r of results) {
    const estado = r.success ? "✅ Éxito" : `❌ Error: ${r.error}`;
    const resImg = r.outputPath ? `\`${r.outputPath}\`` : "N/A";
    const compImg = r.comparisonPath ? `\`${r.comparisonPath}\`` : "N/A";
    md += `| ${r.photoFile} | ${r.colorName} | \`${r.colorHex}\` | ${r.latencyMs} ms | ${estado} | ${resImg} | ${compImg} |\n`;
  }

  md += `\n## Checklist Manual de Calidad (Por Resultado)\n\n`;
  for (const r of results) {
    if (!r.success) continue;
    md += `### ${r.photoFile} → ${r.colorName} (${r.colorHex})\n`;
    md += `- [ ] El color se acerca al hex indicado (${r.colorHex})\n`;
    md += `- [ ] El rostro es idéntico (sin alteraciones en piel, facciones ni ojos)\n`;
    md += `- [ ] El fondo no cambió\n`;
    md += `- [ ] Los rizos se conservan (patrón de curvatura, volumen y definición natural)\n`;
    md += `- [ ] Sin artefactos (sin manos extrañas, bordes borrosos ni texto indeseado)\n\n`;
  }

  md += `## Conclusión y Diagnóstico del Especialista\n\n`;
  md += `_Completar después de la inspección visual de las imágenes generadas._\n`;

  fs.writeFileSync(reportPath, md, "utf-8");

  console.log("\n===============================================================");
  console.log(`📋 Reporte generado con éxito en:`);
  console.log(`   ${reportPath}`);
  console.log(`💰 Costo real de la prueba: $${(successfulCalls * costPerCall).toFixed(2)} USD`);
  console.log("===============================================================\n");
}

runProbe().catch((err) => {
  console.error("Error fatal en runProbe:", err);
  process.exit(1);
});

