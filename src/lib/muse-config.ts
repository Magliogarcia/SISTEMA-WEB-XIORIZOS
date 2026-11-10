/**
 * Configuración centralizada para el modelo de colorimetría con IA (Meta: Muse Image vía OpenRouter)
 */

export const MUSE_CONFIG = {
  // ID exacto del modelo en OpenRouter
  modelId: "meta/muse-image",

  // Dimensiones y optimización de imagen
  maxSide: 1024,
  jpegQuality: 85,
  maxFileSizeMb: 5,
  maxFileSizeBytes: 5 * 1024 * 1024,

  // Límites y control de costos
  dailyLimitDefault: 10,
  maxConcurrentPerIp: 1,
  timeoutMs: 60_000, // 60 segundos
  costPerCallUsd: 0.01,

  // Tonos de prueba estandarizados
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
} as const;

export type MuseTone = (typeof MUSE_CONFIG.testTones)[number];

