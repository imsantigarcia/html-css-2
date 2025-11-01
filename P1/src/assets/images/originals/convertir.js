/**
 * convertir.js
 *
 * Convierte todas las imágenes JPG/PNG a formato WebP en varios tamaños,
 * manteniendo la relación de aspecto original.
 *
 * Requiere: npm install sharp
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// === Configuración ===
const inputDir = "."; // 📂 Carpeta de entrada
const outputDir = "./webp"; // 📁 Carpeta de salida
const tamaños = [1920, 1280, 1024, 720, 480, 320, 289]; // anchos deseados

// === Crear carpeta de salida si no existe ===
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Carpeta creada: ${outputDir}`);
}

// === Función para procesar una imagen ===
const procesarImagen = (inputPath, file) => {
  const baseName = path.parse(file).name;

  tamaños.forEach((width) => {
    const outputPath = path.join(outputDir, `${baseName}-${width}w.webp`);

    sharp(inputPath)
      .resize({ width, withoutEnlargement: true }) // mantiene proporción y no agranda
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`✅ ${outputPath} creado`))
      .catch((err) => console.error(`❌ Error con ${file}:`, err));
  });
};

// === Leer y procesar todas las imágenes ===
fs.readdirSync(inputDir)
  .filter((file) => /\.(jpe?g|png)$/i.test(file))
  .forEach((file) => {
    const inputPath = path.join(inputDir, file);
    console.log(`🖼️ Procesando: ${file}`);
    procesarImagen(inputPath, file);
  });

console.log("🚀 Conversión iniciada...");
