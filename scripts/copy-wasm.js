/**
 * Script para garantizar que los archivos WebAssembly de MediaPipe
 * estén siempre presentes en public/wasm para la colorimetría offline.
 */
const fs = require("fs");
const path = require("path");

const sourceDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "@mediapipe",
  "tasks-vision",
  "wasm"
);

const targetDir = path.join(__dirname, "..", "public", "wasm");

function copyWasmFiles() {
  if (!fs.existsSync(sourceDir)) {
    console.log(
      "[copy-wasm] node_modules/@mediapipe/tasks-vision/wasm no encontrado todavía."
    );
    return;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceDir);
  let copied = 0;

  for (const file of files) {
    const src = path.join(sourceDir, file);
    const dest = path.join(targetDir, file);

    const srcStat = fs.statSync(src);
    let needCopy = true;

    if (fs.existsSync(dest)) {
      const destStat = fs.statSync(dest);
      if (destStat.size === srcStat.size) {
        needCopy = false;
      }
    }

    if (needCopy) {
      fs.copyFileSync(src, dest);
      copied++;
    }
  }

  if (copied > 0) {
    console.log(`[copy-wasm] Se copiaron ${copied} archivo(s) WASM a public/wasm`);
  } else {
    console.log("[copy-wasm] Archivos WASM de MediaPipe al día en public/wasm");
  }
}

copyWasmFiles();

