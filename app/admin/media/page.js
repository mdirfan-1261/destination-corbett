
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  UploadCloud,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  LoaderCircle,
  FolderOpen,
  X,
  FileImage,
  CheckCircle2,
  RefreshCw,
  Search,
  Images,
  Link2,
  HardDrive,
  CalendarDays,
} from "lucide-react";

import { optimizeImage } from "@/lib/imageOptimizer";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const FOLDERS = [
  { value: "all", label: "All Images" },
  { value: "safari", label: "Safari" },
  { value: "stay", label: "Stay" },
  { value: "packages", label: "Packages" },
  { value: "events", label: "Events" },
  { value: "weddings", label: "Weddings" },
];

const UPLOAD_FOLDERS = FOLDERS.filter(
  (item) => item.value !== "all"
);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes = 0) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getImageName(assetId = "") {
  return assetId.split("/").pop() || "Untitled image";
}

function getFolderLabel(value = "") {
  return (
    FOLDERS.find((item) => item.value === value)?.label ||
    value ||
    "Other"
  );
}

async function copyText(value) {
  if (!value) {
    throw new Error("Nothing to copy.");
  }

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Copy failed. Please copy the URL manually.");
  }
}

export default function MediaPage() {
  const fileInputRef = useRef(null);
  const previewObjectUrlRef = useRef("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [folder, setFolder] = useState("safari");
  const [galleryFolder, setGalleryFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [images, setImages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return "";

    return localStorage.getItem("adminToken") || "";
  }, []);

  // ================= FETCH GALLERY =================

  const fetchImages = useCallback(
    async ({
      selectedFolder = galleryFolder,
      cursor = "",
      append = false,
      silent = false,
    } = {}) => {
      const token = getToken();

      if (!token) {
        setError("Admin session not found. Please log in again.");
        setIsLoadingGallery(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
        return;
      }

      if (!append && !silent) {
        setIsLoadingGallery(true);
      }

      try {
        const params = new URLSearchParams({
          folder: selectedFolder,
          limit: "30",
        });

        if (cursor) {
          params.set("next_cursor", cursor);
        }

        const response = await fetch(
          `${API_URL}/api/images?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json().catch(() => ({}));

if (response.status === 401) {
  throw new Error(
    "Your session has expired. Please log in again."
  );
}

if (response.status === 403) {
  throw new Error(
    "You do not have permission to view the media gallery."
  );
}

if (!response.ok || !result.success) {
  throw new Error(
    result.message || "Failed to load the gallery."
  );
}

        const fetchedImages = Array.isArray(result.data)
          ? result.data
          : [];

        setImages((previous) =>
          append
            ? [...previous, ...fetchedImages]
            : fetchedImages
        );

        setNextCursor(result.pagination?.nextCursor || null);
        setError("");
      } catch (err) {
        console.error("Media gallery error:", err);

        setError(
          err.message ||
            err.message ||
  "Failed to load images. Please check the backend connection."
        );

        if (!append) {
          setImages([]);
          setNextCursor(null);
        }
      } finally {
        setIsLoadingGallery(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [galleryFolder, getToken]
  );

  useEffect(() => {
    fetchImages({ selectedFolder: galleryFolder });
  }, [galleryFolder, fetchImages]);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  // ================= FILE SELECTION =================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");
    setUploadedImage(null);

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, WebP, and AVIF images are allowed."
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = objectUrl;

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const clearSelection = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = "";
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setUploadedImage(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ================= UPLOAD IMAGE =================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Admin session not found. Please log in again.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const optimizedFile = await optimizeImage(selectedFile);
      const formData = new FormData();

      formData.append("image", optimizedFile);
      formData.append("folder", folder);

      const response = await fetch(
        `${API_URL}/api/images/upload`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      if (response.status === 403) {
        throw new Error(
          " You do not have permission to upload images."
        );
      }

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(
          result.message || "Failed to upload the image."
        );
      }

      setUploadedImage({
        ...result.data,
        folder,
      });

      setGalleryFolder(folder);

      const savedBytes = result.data.bytes || optimizedFile.size;
      const originalBytes = selectedFile.size;

      if (savedBytes < originalBytes) {
        const reduction = Math.round(
          ((originalBytes - savedBytes) / originalBytes) * 100
        );

        setSuccess(
          `Image upload ho gayi! ${
            reduction > 0 ? `${reduction}% size reduction.` : ""
          }`
        );
      } else {
        setSuccess("Image uploaded successfully.");
      }

      await fetchImages({
        selectedFolder: folder,
        silent: true,
      });
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  // ================= COPY IMAGE DATA =================

  const handleCopy = async (value, key) => {
    try {
      await copyText(value);

      setCopiedField(key);
      setSuccess("Copied successfully!");

      window.setTimeout(() => {
        setCopiedField((current) =>
          current === key ? "" : current
        );
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to copy.");
    }
  };

  // ================= REFRESH GALLERY =================

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError("");

    await fetchImages({
      selectedFolder: galleryFolder,
      silent: true,
    });
  };

  // ================= LOAD MORE IMAGES =================

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);

    await fetchImages({
      selectedFolder: galleryFolder,
      cursor: nextCursor,
      append: true,
      silent: true,
    });
  };

  // ================= DELETE IMAGE =================

  const handleDeleteImage = async (image) => {
    if (!image?.publicId) {
      setError(
  "Cloudinary public ID not found for this image. Please check the backend list response."
);
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete "${getImageName(
        image.publicId
      )}" from Cloudinary? This action cannot be undone.`
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setError("Admin session not found. Please log in again.");
      return;
    }

    const imageKey = image.assetId || image.publicId;

    setDeletingImageId(imageKey);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/images/delete`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            publicId: image.publicId,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error(
  "You do not have permission to delete this image."
);
        
      }

      if (response.status === 403) {
        throw new Error(
          "Image delete karne ki permission nahi hai."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete the image."
        );
      }

      setImages((previous) =>
        previous.filter(
          (item) =>
            item.publicId !== image.publicId
        )
      );

      setSuccess(
  "Image deleted successfully from Cloudinary."
);
    } catch (err) {
      console.error("Delete image error:", err);

      setError(
  err.message || "Failed to delete the image."

      );
    } finally {
      setDeletingImageId("");
    }
  };

  // ================= SEARCH / FILTER =================

  const filteredImages = images.filter((image) => {
    const searchableText = [
      image.assetId,
      image.publicId,
      image.url,
      image.folder,
      image.format,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      searchQuery.trim().toLowerCase()
    );
  });

  const totalBytes = images.reduce(
    (total, image) => total + (image.bytes || 0),
    0
  );

  const displayedFolderLabel = getFolderLabel(galleryFolder);

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* PAGE HEADER */}

        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B96928]">
              <Images size={15} />
              Content Management
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Media Library
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Upload images once, then reuse their URLs across your
              Destination Corbett pages.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoadingGallery}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-[#B96928] hover:text-[#B96928] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh Gallery
          </button>
        </header>

        {/* FEEDBACK */}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle
              className="mt-0.5 shrink-0"
              size={19}
            />

            <span className="min-w-0 flex-1">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && !error && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
          >
            <CheckCircle2
              size={19}
              className="shrink-0"
            />

            <span className="flex-1">{success}</span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">
                Loaded Images
              </span>

              <div className="rounded-xl bg-orange-50 p-2.5 text-[#B96928]">
                <Images size={19} />
              </div>
            </div>

            <div className="mt-3 text-3xl font-black">
              {isLoadingGallery ? "—" : images.length}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {displayedFolderLabel} folder view
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">
                Loaded Storage
              </span>

              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                <HardDrive size={19} />
              </div>
            </div>

            <div className="mt-3 text-3xl font-black">
              {isLoadingGallery ? "—" : formatBytes(totalBytes)}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Total size of currently loaded images
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">
                Image Folders
              </span>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                <FolderOpen size={19} />
              </div>
            </div>

            <div className="mt-3 text-3xl font-black">
              {UPLOAD_FOLDERS.length}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Safari, Stay, Packages, Events and Weddings
            </p>
          </div>
        </section>

        {/* UPLOAD PANEL */}

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#B96928]/10 p-3 text-[#B96928]">
                <ImagePlus size={22} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold">
                  Upload New Image
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a folder and upload an optimized image to Cloudinary.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_0.9fr]">

            {/* FILE PICKER */}

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[230px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-5 py-8 text-center transition hover:border-[#B96928] hover:bg-orange-50/40"
                >
                  <div className="mb-4 rounded-2xl bg-white p-4 text-[#B96928] shadow-sm">
                    <UploadCloud size={30} />
                  </div>

                  <span className="text-base font-extrabold">
                    Choose an image
                  </span>

                  <span className="mt-2 text-sm text-slate-500">
                    JPG, PNG, WebP or AVIF
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    Maximum file size: 10 MB
                  </span>

                  <span className="mt-4 rounded-lg bg-[#B96928] px-4 py-2 text-sm font-bold text-white">
                    Browse Files
                  </span>
                </button>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="relative flex min-h-[230px] items-center justify-center bg-slate-100 p-4">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Selected upload preview"
                        className="max-h-[280px] max-w-full rounded-xl object-contain"
                      />
                    )}

                    <button
                      type="button"
                      onClick={clearSelection}
                      aria-label="Remove selected image"
                      className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:text-red-600"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <FileImage
                        className="mt-1 shrink-0 text-[#B96928]"
                        size={20}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Original size: {formatBytes(selectedFile.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 text-xs font-bold text-[#B96928] hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* UPLOAD SETTINGS */}

            <div className="flex flex-col">
              <label
                htmlFor="upload-folder"
                className="mb-2 text-sm font-bold text-slate-700"
              >
                Destination Folder
              </label>

              <select
                id="upload-folder"
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10"
              >
                {UPLOAD_FOLDERS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/70 p-4">
                <div className="flex gap-3">
                  <FolderOpen
                    className="mt-0.5 shrink-0 text-[#B96928]"
                    size={19}
                  />

                  <div>
                    <p className="text-sm font-bold text-[#172033]">
                      Where will this image go?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      The image will be stored in the selected Cloudinary
                      folder. You can copy its URL from the gallery and
                      use it in your page content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#9E5722] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={18} />
                      Upload Image
                    </>
                  )}
                </button>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    disabled={isUploading}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X size={17} />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* UPLOAD SUCCESS RESULT */}

        {uploadedImage?.url && (
          <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50/70 px-5 py-4 sm:px-6">
              <CheckCircle2
                className="shrink-0 text-emerald-700"
                size={21}
              />

              <div>
                <h2 className="font-extrabold text-emerald-900">
                  Upload Complete
                </h2>

                <p className="mt-0.5 text-xs text-emerald-800">
                  Your image is stored in Cloudinary.
                </p>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:p-6">
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={uploadedImage.url}
                  alt="Uploaded image"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="break-words text-sm font-extrabold">
                  {getImageName(
                    uploadedImage.assetId || uploadedImage.publicId
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Folder: {getFolderLabel(folder)}
                </p>

                <label className="mb-2 mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Image URL
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    value={uploadedImage.url}
                    aria-label="Uploaded image URL"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-700 outline-none"
                    onFocus={(event) => event.target.select()}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(uploadedImage.url, "uploaded-url")
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#172033] px-4 text-sm font-bold text-white hover:bg-slate-700"
                  >
                    {copiedField === "uploaded-url" ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                    Copy URL
                  </button>

                  <a
                    href={uploadedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink size={16} />
                    Open
                  </a>
                </div>

                {uploadedImage.assetId && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="max-w-full break-all rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                      {uploadedImage.assetId}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(uploadedImage.assetId, "uploaded-id")
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B96928] hover:underline"
                    >
                      {copiedField === "uploaded-id" ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                      Copy Asset ID
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* GALLERY */}

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#172033] p-3 text-white">
                  <Images size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold">
                    Your Image Gallery
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Browse existing images and reuse their URLs.
                  </p>
                </div>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search images..."
                  aria-label="Search images"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#B96928] focus:bg-white"
                />
              </div>
            </div>

            {/* FOLDER FILTERS — DELETE BUTTON IS NOT HERE */}

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {FOLDERS.map((item) => {
                const isActive = galleryFolder === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setGalleryFolder(item.value);
                      setSearchQuery("");
                    }}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      isActive
                        ? "bg-[#172033] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#B96928] hover:text-[#B96928]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {isLoadingGallery ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <LoaderCircle
                  size={32}
                  className="animate-spin text-[#B96928]"
                />

                <p className="mt-4 text-sm font-bold">
                  Loading image gallery...
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Fetching images from Cloudinary
                </p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 text-center">
                <div className="rounded-2xl bg-white p-4 text-slate-400 shadow-sm">
                  <FileImage size={29} />
                </div>

                <h3 className="mt-4 text-base font-extrabold">
                  {searchQuery
                    ? "No matching images"
                    : "No images found"}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {searchQuery
                    ? "Try another search term or clear the search."
                    : "Upload an image above, or choose another folder to view its images."}
                </p>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm font-bold text-[#B96928] hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-700">
                    {filteredImages.length}{" "}
                    {filteredImages.length === 1 ? "image" : "images"} shown
                  </p>

                  <p className="text-xs text-slate-500">
                    Select Copy URL to reuse an image
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredImages.map((image) => {
                    const imageKey =
                      image.assetId || image.publicId || image.url;

                    const imageName =
                      image.assetId ||
                      image.publicId ||
                      "Untitled image";

                    const isDeleting =
                      deletingImageId === imageKey;

                    return (
                      <article
                        key={imageKey}
                        className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                      >
                        {/* IMAGE PREVIEW */}

                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open full image"
                          className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-100"
                        >
                          <img
                            src={image.url}
                            alt={getImageName(imageName)}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />

                          <span className="absolute right-3 top-3 rounded-lg bg-black/65 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                            {image.format || "Image"}
                          </span>

                          <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 shadow-sm">
                            {getFolderLabel(image.folder)}
                          </span>
                        </a>

                        {/* IMAGE INFO */}

                        <div className="p-4">
                          <h3
                            title={getImageName(imageName)}
                            className="truncate text-sm font-extrabold text-[#172033]"
                          >
                            {getImageName(imageName)}
                          </h3>

                          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
                            {image.width && image.height && (
                              <span>
                                {image.width} × {image.height}
                              </span>
                            )}

                            <span>{formatBytes(image.bytes)}</span>
                          </div>

                          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                            <CalendarDays size={14} />
                            {formatDate(image.createdAt)}
                          </div>

                          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  image.url,
                                  `gallery-${imageKey}`
                                )
                              }
                              className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-2 py-2 text-xs font-extrabold text-white transition hover:bg-[#9E5722]"
                            >
                              {copiedField === `gallery-${imageKey}` ? (
                                <Check size={15} />
                              ) : (
                                <Copy size={15} />
                              )}
                              Copy URL
                            </button>

                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open image in new tab"
                              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                              <ExternalLink size={15} />
                              Open
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                image.assetId || image.publicId,
                                `asset-${imageKey}`
                              )
                            }
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-[#B96928]"
                          >
                            {copiedField === `asset-${imageKey}` ? (
                              <Check size={14} />
                            ) : (
                              <Link2 size={14} />
                            )}
                            Copy Asset ID
                          </button>

                          {/* DELETE IMAGE BUTTON — INSIDE EACH CARD */}

                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image)}
                            disabled={
                              isDeleting || Boolean(deletingImageId)
                            }
                            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting ? (
                              <>
                                <LoaderCircle
                                  size={15}
                                  className="animate-spin"
                                />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <X size={15} />
                                Delete Image
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {nextCursor && !searchQuery && (
                  <div className="mt-7 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold transition hover:border-[#B96928] hover:text-[#B96928] disabled:opacity-60"
                    >
                      {isLoadingMore ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                          Loading...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} />
                          Load More Images
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* HOW TO USE */}

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-[#B96928]">
              <Link2 size={21} />
            </div>

            <div>
              <h2 className="font-extrabold">
                How to reuse an image
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Copy the image URL from this gallery and paste it into the
                image URL field of the relevant content form. Then save
                that content to update the page.
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Uploading an image stores the file. To display it on a
                public page, that page or content record must also save
                and use the image URL.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
