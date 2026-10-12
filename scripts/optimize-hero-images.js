
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(process.cwd(), "public/images/hero");
const outputDir = path.join(inputDir, "optimized");

async function optimizeImages() {
  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(inputDir).filter(
    (file) => /\.(jpg|jpeg|png)$/i.test(file)
  );

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      outputDir,
      `${path.parse(file).name}.webp`
    );

    await sharp(inputPath)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(outputPath);

    const before = fs.statSync(inputPath).size / 1024 / 1024;
    const after = fs.statSync(outputPath).size / 1024 / 1024;

    console.log(
      `${file}: ${before.toFixed(2)} MB -> ${after.toFixed(2)} MB`
    );
  }

  console.log("Image optimization complete.");
}

optimizeImages().catch((error) => {
  console.error("Optimization failed:", error);
  process.exitCode = 1;
});
