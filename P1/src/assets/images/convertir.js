// convertir.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// === Configuración ===
const inputDir = "."; // 📂 Carpeta actual
const outputDir = "./webp"; // 📁 Carpeta de salida
const especiales = ["mblanc.jpg", "plim.jpg", "avellanas.png"]; // imágenes con varios tamaños

// === Crear carpeta de salida si no existe ===
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// === Función para procesar una imagen ===
const procesarImagen = (inputPath, file, tamaños) => {
  const baseName = path.parse(file).name;

  tamaños.forEach(({ width, height }) => {
    const outputPath = path.join(outputDir, `${baseName}-${width}x${height}.webp`);

    sharp(inputPath)
      .resize(Math.round(width), Math.round(height), { fit: "cover" })
      .webp({ quality: 100 })
      .toFile(outputPath)
      .then(() => console.log(`✅ ${outputPath} creado`))
      .catch((err) => console.error(`❌ Error con ${file}:`, err));
  });
};

// === Leer y procesar imágenes ===
fs.readdirSync(inputDir)
  .filter((file) => /\.(jpe?g|png)$/i.test(file))
  .forEach((file) => {
    const inputPath = path.join(inputDir, file);

    if (especiales.includes(file)) {
      console.log(`🎯 Imagen especial: ${file}`);
      procesarImagen(inputPath, file, [
        { width: 353.6, height: 353.6 },
        { width: 442, height: 442 },
        { width: 410, height: 410 },
      ]);
    } else {
      console.log(`🟢 Imagen normal: ${file}`);
      procesarImagen(inputPath, file, [{ width: 150, height: 150 }]);
    }
  });

console.log("🚀 Conversión iniciada...");
