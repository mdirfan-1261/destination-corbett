const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");
const supported = /\.(jpe?g|png)$/i;
const skippedDirs = new Set(["node_modules", ".next"]);

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skippedDirs.has(entry.name) || entry.name === "optimized") continue;
      await walk(fullPath);
      continue;
    }

    if (!supported.test(entry.name)) continue;

    const outputPath = fullPath.replace(/\.(jpe?g|png)$/i, ".webp");

    try {
      await sharp(fullPath)
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(outputPath);

      const before = fs.statSync(fullPath).size / 1024 / 1024;
      const after = fs.statSync(outputPath).size / 1024 / 1024;

      console.log(
        `${path.relative(publicDir, fullPath)}: ${before.toFixed(2)} MB -> ${after.toFixed(2)} MB`
      );
    } catch (error) {
      console.error(`FAILED: ${fullPath}`, error.message);
    }
  }
}

walk(publicDir)
  .then(() => console.log("All image copies generated. Original files preserved."))
  .catch((error) => {
    console.error("Optimization failed:", error);
    process.exitCode = 1;
  });
