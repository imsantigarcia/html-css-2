/**
 * convertir.js
 * 
 * Convierte imágenes JPG/PNG a formato WebP en varios tamaños.
 * Todas las imágenes generan una versión 289x289.
 * Las imágenes “especiales” generan además versiones más grandes.
 * 
 * Requiere: npm install sharp
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// === Configuración ===
const inputDir = "."; // 📂 Carpeta de entrada (donde están tus imágenes originales)
const outputDir = "./webp"; // 📁 Carpeta de salida
const especiales = ["mblanc.jpg", "plim.jpg", "avellanas.png"]; // imágenes con varios tamaños

// === Crear carpeta de salida si no existe ===
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Carpeta creada: ${outputDir}`);
}

// === Función para procesar una imagen ===
const procesarImagen = (inputPath, file, tamaños) => {
  const baseName = path.parse(file).name;

  tamaños.forEach(({ width, height }) => {
    const outputPath = path.join(outputDir, `${baseName}-${width}x${height}.webp`);

    sharp(inputPath)
      .resize(Math.round(width), Math.round(height), { fit: "cover" })
      .webp({ quality: 80 }) // 🔧 calidad optimizada (80%)
      .toFile(outputPath)
      .then(() => console.log(`✅ ${outputPath} creado`))
      .catch((err) => console.error(`❌ Error con ${file}:`, err));
  });
};

// === Leer y procesar imágenes ===
fs.readdirSync(inputDir)
  .filter((file) => /\.(jpe?g|png)$/i.test(file)) // solo imágenes jpg/png
  .forEach((file) => {
    const inputPath = path.join(inputDir, file);

    // Tamaños comunes para todas las imágenes
    const tamañosComunes = [{ width: 289, height: 289 }];

    if (especiales.includes(file)) {
      console.log(`🎯 Imagen especial: ${file}`);
      procesarImagen(inputPath, file, [
        ...tamañosComunes,
        { width: 354, height: 354 },
        { width: 410, height: 410 },
        { width: 442, height: 442 },
      ]);
    } else {
      console.log(`🟢 Imagen normal: ${file}`);
      procesarImagen(inputPath, file, tamañosComunes);
    }
  });

console.log("🚀 Conversión iniciada...");
