/**
 * Hair Recolor Engine using Google MediaPipe Hair Segmenter
 * Runs 100% client-side in the browser via WebAssembly.
 * 0 API cost, instant execution, preserves curl textures and highlights.
 */

import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";

let segmenterInstance: ImageSegmenter | null = null;
let isInitializing = false;
let initPromise: Promise<ImageSegmenter> | null = null;

export async function getHairSegmenter(): Promise<ImageSegmenter> {
  if (segmenterInstance) return segmenterInstance;
  if (initPromise) return initPromise;

  isInitializing = true;
  initPromise = (async () => {
    try {
      // Intentar cargar wasm desde /wasm local, fallback a CDN oficial
      let wasmPath = "/wasm";
      let vision;
      try {
        vision = await FilesetResolver.forVisionTasks(wasmPath);
      } catch {
        wasmPath = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
        vision = await FilesetResolver.forVisionTasks(wasmPath);
      }

      const segmenter = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/hair_segmenter.tflite",
          delegate: "GPU",
        },
        outputCategoryMask: true,
        outputConfidenceMasks: true,
        runningMode: "IMAGE",
      });

      segmenterInstance = segmenter;
      return segmenter;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

export interface RecolorOptions {
  hexColor: string; // Ej: "#C2410C" (Rojo), "#5C3A21" (Castaño), "#18181B" (Negro)
  toneName: string; // "Castaño" | "Negro" | "Rojo"
  intensity: number; // 10 a 100
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Procesa una imagen HTMLImageElement, detecta la máscara del cabello
 * y genera una nueva imagen DataURL con el color aplicado sobre los rizos.
 */
export async function recolorHair(
  imgElement: HTMLImageElement,
  options: RecolorOptions
): Promise<string> {
  const segmenter = await getHairSegmenter();

  // Ejecutar segmentación de cabello
  const segmentationResult = segmenter.segment(imgElement);

  // Obtener máscara de confianza o de categoría
  // En hair_segmenter.tflite:
  // - Si hay confidenceMasks: índice 1 es cabello (o índice 0 según el modelo)
  // - Si hay categoryMask: valor > 0 es cabello
  const width = imgElement.naturalWidth || imgElement.width;
  const height = imgElement.naturalHeight || imgElement.height;

  let hairMask: Float32Array | null = null;

  if (segmentationResult.confidenceMasks && segmentationResult.confidenceMasks.length > 0) {
    // Si hay 2 máscaras (0: background, 1: hair), la 1 es cabello
    const maskObj = segmentationResult.confidenceMasks.length > 1
      ? segmentationResult.confidenceMasks[1]
      : segmentationResult.confidenceMasks[0];
    hairMask = maskObj.getAsFloat32Array();
  } else if (segmentationResult.categoryMask) {
    const uint8 = segmentationResult.categoryMask.getAsUint8Array();
    hairMask = new Float32Array(uint8.length);
    for (let i = 0; i < uint8.length; i++) {
      hairMask[i] = uint8[i] > 0 ? 1.0 : 0.0;
    }
  }

  if (!hairMask) {
    throw new Error("No se pudo obtener la máscara de cabello");
  }

  // Preparar canvas offscreen para procesar píxeles
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("No se pudo crear el contexto 2D");

  // Dibujar la imagen original
  ctx.drawImage(imgElement, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const targetRgb = hexToRgb(options.hexColor);
  const intensityFactor = Math.max(0.2, Math.min(1.0, options.intensity / 100));
  const tone = options.toneName.toLowerCase();

  // Recorrer píxel por píxel con la máscara
  const totalPixels = width * height;
  for (let i = 0; i < totalPixels; i++) {
    const confidence = hairMask[i];
    // Ignorar si no es cabello (umbral suave para bordes de rizos)
    if (confidence <= 0.08) continue;

    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Luminosidad original de la hebra (0 a 1)
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const blendAlpha = Math.min(1, confidence * intensityFactor);

    let newR = r;
    let newG = g;
    let newB = b;

    if (tone.includes("rubio")) {
      // Rubio Miel / Dorado: aclara con reflejo dorado brillante sobre el rizo
      const highlightBoost = Math.pow(lum, 0.65);
      const tintedR = Math.min(255, targetRgb.r * 0.9 + lum * 90);
      const tintedG = Math.min(255, targetRgb.g * 0.85 + lum * 75);
      const tintedB = Math.min(255, targetRgb.b * 0.65 + lum * 35);

      newR = r * (1 - blendAlpha) + (tintedR * highlightBoost + r * 0.2) * blendAlpha;
      newG = g * (1 - blendAlpha) + (tintedG * highlightBoost + g * 0.2) * blendAlpha;
      newB = b * (1 - blendAlpha) + (tintedB * highlightBoost + b * 0.15) * blendAlpha;
    } else if (tone.includes("borgoña") || tone.includes("vino")) {
      // Borgoña / Vino Tinto: tono profundo ciruela/vino con reflejo rojizo elegante
      const highlightBoost = Math.pow(lum, 0.8);
      const tintedR = Math.min(255, targetRgb.r * 1.1 + lum * 90);
      const tintedG = Math.min(255, targetRgb.g * 0.7 + lum * 20);
      const tintedB = Math.min(255, targetRgb.b * 1.0 + lum * 45);

      newR = r * (1 - blendAlpha) + (tintedR * highlightBoost) * blendAlpha;
      newG = g * (1 - blendAlpha) + (tintedG * highlightBoost) * blendAlpha;
      newB = b * (1 - blendAlpha) + (tintedB * highlightBoost) * blendAlpha;
    } else if (tone.includes("chocolate")) {
      // Chocolate Profundo: castaño oscuro sedoso con matiz café intenso
      const highlightBoost = Math.pow(lum, 0.9);
      const tintedR = Math.min(255, targetRgb.r * 0.8 + lum * 80);
      const tintedG = Math.min(255, targetRgb.g * 0.75 + lum * 55);
      const tintedB = Math.min(255, targetRgb.b * 0.7 + lum * 40);

      newR = r * (1 - blendAlpha) + (tintedR * highlightBoost) * blendAlpha;
      newG = g * (1 - blendAlpha) + (tintedG * highlightBoost) * blendAlpha;
      newB = b * (1 - blendAlpha) + (tintedB * highlightBoost) * blendAlpha;
    } else if (tone.includes("rojo") || tone.includes("cobrizo")) {
      // Rojo / Cobrizo botánico para rizos:
      const highlightBoost = Math.pow(lum, 0.7);
      const tintedR = Math.min(255, targetRgb.r * 0.75 + lum * 140);
      const tintedG = Math.min(255, targetRgb.g * 0.6 + lum * 50);
      const tintedB = Math.min(255, targetRgb.b * 0.5 + lum * 20);

      newR = r * (1 - blendAlpha) + (tintedR * highlightBoost + r * 0.15) * blendAlpha;
      newG = g * (1 - blendAlpha) + (tintedG * highlightBoost + g * 0.15) * blendAlpha;
      newB = b * (1 - blendAlpha) + (tintedB * highlightBoost + b * 0.15) * blendAlpha;
    } else if (tone.includes("castaño") || tone.includes("castano")) {
      // Castaño botánico: cálido, chocolate con reflejos miel
      const highlightBoost = Math.pow(lum, 0.85);
      const tintedR = Math.min(255, targetRgb.r * 0.85 + lum * 110);
      const tintedG = Math.min(255, targetRgb.g * 0.85 + lum * 80);
      const tintedB = Math.min(255, targetRgb.b * 0.85 + lum * 50);

      newR = r * (1 - blendAlpha) + (tintedR * highlightBoost) * blendAlpha;
      newG = g * (1 - blendAlpha) + (tintedG * highlightBoost) * blendAlpha;
      newB = b * (1 - blendAlpha) + (tintedB * highlightBoost) * blendAlpha;
    } else if (tone.includes("negro")) {
      // Negro profundo natural: profundiza sombras sin aplanar el rizo (mantiene brillo especular)
      const depthFactor = 0.35 + lum * 0.55;
      const tintedR = Math.min(255, targetRgb.r + (r * 0.3 * depthFactor));
      const tintedG = Math.min(255, targetRgb.g + (g * 0.3 * depthFactor));
      const tintedB = Math.min(255, targetRgb.b + (b * 0.35 * depthFactor));

      newR = r * (1 - blendAlpha) + tintedR * blendAlpha;
      newG = g * (1 - blendAlpha) + tintedG * blendAlpha;
      newB = b * (1 - blendAlpha) + tintedB * blendAlpha;
    } else {
      // Modo genérico colorimetría
      const tintedR = (r * 0.4) + (targetRgb.r * 0.6 * lum * 1.5);
      const tintedG = (g * 0.4) + (targetRgb.g * 0.6 * lum * 1.5);
      const tintedB = (b * 0.4) + (targetRgb.b * 0.6 * lum * 1.5);

      newR = r * (1 - blendAlpha) + tintedR * blendAlpha;
      newG = g * (1 - blendAlpha) + tintedG * blendAlpha;
      newB = b * (1 - blendAlpha) + tintedB * blendAlpha;
    }

    data[p] = Math.max(0, Math.min(255, Math.round(newR)));
    data[p + 1] = Math.max(0, Math.min(255, Math.round(newG)));
    data[p + 2] = Math.max(0, Math.min(255, Math.round(newB)));
  }

  // Escribir píxeles procesados de vuelta al canvas
  ctx.putImageData(imgData, 0, 0);

  // Retornar Data URL en formato JPEG de alta calidad
  return canvas.toDataURL("image/jpeg", 0.95);
}

