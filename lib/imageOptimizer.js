
const DEFAULT_OPTIONS = {
  maxWidth: 1920,
  maxHeight: 1920,
  targetBytes: 450 * 1024,
  initialQuality: 0.88,
  minQuality: 0.55,
};

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          "Image could not be opened. Please select a supported JPG, PNG or WebP image."
        )
      );
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image optimization failed."));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}

export async function optimizeImage(file, options = {}) {
  if (!(file instanceof File)) {
    throw new Error("Please select a valid image.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, WebP and AVIF images are supported.");
  }

  const settings = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const image = await loadImage(file);

  const scale = Math.min(
    1,
    settings.maxWidth / image.naturalWidth,
    settings.maxHeight / image.naturalHeight
  );

  const width = Math.max(
    1,
    Math.round(image.naturalWidth * scale)
  );

  const height = Math.max(
    1,
    Math.round(image.naturalHeight * scale)
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Your browser cannot optimize this image.");
  }

  context.drawImage(image, 0, 0, width, height);

  // WebP output is generally smaller for website photos.
  let quality = settings.initialQuality;
  let blob = await canvasToBlob(canvas, "image/webp", quality);

  while (
    blob.size > settings.targetBytes &&
    quality > settings.minQuality
  ) {
    quality = Math.max(
      settings.minQuality,
      quality - 0.08
    );

    blob = await canvasToBlob(
      canvas,
      "image/webp",
      quality
    );
  }

  // Keep the original if conversion makes it larger
  // and no resizing was needed.
  if (blob.size >= file.size && scale === 1) {
    return file;
  }

  const baseName =
    file.name.replace(/\.[^.]+$/, "") || "image";

  return new File(
    [blob],
    `${baseName}.webp`,
    {
      type: "image/webp",
      lastModified: Date.now(),
    }
  );
}
