const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(process.cwd(), "public", "images", "events");
const outputDir = path.join(inputDir, "optimized");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs
  .readdirSync(inputDir)
  .filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

async function optimizeImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    const outputPath = path.join(outputDir, outputName);

    await sharp(inputPath)
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .webp({
        quality: 78,
      })
      .toFile(outputPath);

    console.log(`Optimized: ${file} -> ${outputName}`);
  }

  console.log("\nDone! All Events images optimized.");
}

optimizeImages().catch((error) => {
  console.error(error);
  process.exit(1);
});