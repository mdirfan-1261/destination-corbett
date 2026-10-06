const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const folders = [
  "public/images/services",
  "public/stay",
  "public/mice",
];

async function convertFolder(folder) {
  const fullPath = path.join(process.cwd(), folder);

  if (!fs.existsSync(fullPath)) {
    console.log(`Folder not found: ${folder}`);
    return;
  }

  const files = fs.readdirSync(fullPath);

  for (const file of files) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) {
      continue;
    }

    const input = path.join(fullPath, file);
    const output = path.join(
      fullPath,
      `${path.basename(file, path.extname(file))}.webp`
    );

    try {
      await sharp(input)
       .resize({
  width: 1000,
  height: 1000,
  fit: "inside",
  withoutEnlargement: true,
})
        .webp({
          quality: 75,
        })
        .toFile(output);

      const inputSize = fs.statSync(input).size / 1024 / 1024;
      const outputSize = fs.statSync(output).size / 1024 / 1024;

      console.log(
        `${file}: ${inputSize.toFixed(2)} MB → ${path.basename(
          output
        )}: ${outputSize.toFixed(2)} MB`
      );
    } catch (error) {
      console.error(`Failed: ${file}`, error.message);
    }
  }
}

async function main() {
  for (const folder of folders) {
    await convertFolder(folder);
  }

  console.log("\nImage resize + WebP conversion complete.");
}

main();