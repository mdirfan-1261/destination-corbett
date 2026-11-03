"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Video as VideoIcon,
  Plus,
  Play,
  Pencil,
  Trash2,
  Globe,
  EyeOff,
  Search,
  RefreshCw,
  X,
  Sparkles,
  Clock,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "wildlife", label: "Wildlife" },
  { value: "safari", label: "Safari Experience" },
  { value: "resorts", label: "Resorts & Stays" },
  { value: "activities", label: "Adventure & Activities" },
  { value: "general", label: "General" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  videoType: "direct", // "direct" for recorded mp4 upload, "youtube" for link
  videoUrl: "",
  thumbnailUrl: "",
  duration: "",
  category: "safari",
  isFeatured: false,
  publicationStatus: "published",
  order: 0,
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toast, setToast] = useState("");

  const fileInputRef = useRef(null);

  const [formModal, setFormModal] = useState({ isOpen: false, isEdit: false, id: null });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [previewVideo, setPreviewVideo] = useState(null);

  function getAuthHeader() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }

  async function loadVideos() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/videos/admin/all`, {
        headers: { ...getAuthHeader() },
      });
      const data = await res.json();
      if (data.success) {
        setVideos(data.data || []);
      } else {
        showToast(data.message || "Failed to load videos.");
      }
    } catch {
      showToast("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
  }, []);

  function handleOpenAdd() {
    setFormData(EMPTY_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormModal({ isOpen: true, isEdit: false, id: null });
  }

  function handleOpenEdit(video) {
    setFormData({
      title: video.title || "",
      description: video.description || "",
      videoType: video.videoType || "youtube",
      videoUrl: video.videoUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      duration: video.duration || "",
      category: video.category || "general",
      isFeatured: Boolean(video.isFeatured),
      publicationStatus: video.publicationStatus || "published",
      order: Number(video.order) || 0,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormModal({ isOpen: true, isEdit: true, id: video._id });
  }

  // Handle Local Recorded Video File Upload
  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      showToast("File size too large. Max limit is 100MB.");
      return;
    }

    setUploading(true);
    const bodyData = new FormData();
    bodyData.append("video", file);

    try {
      const res = await fetch(`${API_BASE}/api/videos/upload-file`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
        },
        body: bodyData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: data.videoUrl || "",
          thumbnailUrl: data.thumbnailUrl || "",
          duration: data.duration || prev.duration || "",
          videoType: "direct",
        }));
        showToast("Video uploaded to Cloudinary successfully!");
      } else {
        showToast(data.message || "Video upload failed.");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error during video upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveVideo(e) {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.videoUrl?.trim()) {
      showToast("Title and Video URL are required.");
      return;
    }

    setSaving(true);
    try {
      const isEdit = formModal.isEdit;
      const url = isEdit
        ? `${API_BASE}/api/videos/admin/${formModal.id}`
        : `${API_BASE}/api/videos/admin`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        showToast(isEdit ? "Video updated successfully." : "Video added successfully.");
        setFormModal({ isOpen: false, isEdit: false, id: null });
        await loadVideos();
      } else {
        showToast(result.message || "Failed to save video.");
      }
    } catch {
      showToast("Server error while saving video.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(video) {
    const nextStatus = video.publicationStatus === "published" ? "unpublished" : "published";
    try {
      const res = await fetch(`${API_BASE}/api/videos/admin/${video._id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ publicationStatus: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) =>
          prev.map((v) => (v._id === video._id ? { ...v, publicationStatus: nextStatus } : v))
        );
        showToast(`Video ${nextStatus === "published" ? "published" : "unpublished"} successfully.`);
      } else {
        showToast(data.message || "Failed to update status.");
      }
    } catch {
      showToast("Failed to update status.");
    }
  }

  async function handleDelete(video) {
    const confirmed = window.confirm(`Are you sure you want to delete "${video.title}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/api/videos/admin/${video._id}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) => prev.filter((v) => v._id !== video._id));
        showToast("Video deleted successfully.");
      } else {
        showToast(data.message || "Failed to delete video.");
      }
    } catch {
      showToast("Failed to delete video.");
    }
  }

  const filteredVideos = useMemo(() => {
    return videos.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [videos, selectedCategory, search]);

  const totalPublished = videos.filter((v) => v.publicationStatus === "published").length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B96928] text-white">
                <VideoIcon size={20} />
              </div>
              <h1 className="text-2xl font-black text-gray-900">Videos Management</h1>
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Upload recorded video files or embed YouTube links to publish on the website.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadVideos}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-100"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#B96928] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#A65C23]"
            >
              <Plus size={16} />
              Add New Video
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold text-gray-500">Total Videos</span>
            <p className="mt-1 text-2xl font-black text-gray-900">{videos.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <span className="text-xs font-semibold text-emerald-700">Published Live</span>
            <p className="mt-1 text-2xl font-black text-emerald-800">{totalPublished}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold text-gray-500">Unpublished / Draft</span>
            <p className="mt-1 text-2xl font-black text-gray-700">
              {videos.length - totalPublished}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
            <span className="text-xs font-semibold text-amber-700">Featured</span>
            <p className="mt-1 text-2xl font-black text-amber-800">
              {videos.filter((v) => v.isFeatured).length}
            </p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos by title or description..."
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs text-gray-800 outline-none focus:border-[#B96928] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  selectedCategory === cat.value
                    ? "bg-[#172033] text-white"
                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* VIDEOS LIST */}
        <div className="mt-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B96928]/20 border-t-[#B96928]" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <VideoIcon size={36} className="mx-auto text-gray-300" />
              <h3 className="mt-3 text-base font-bold text-gray-800">No videos found</h3>
              <p className="mt-1 text-xs text-gray-500">
                Click 'Add New Video' above to upload your first recorded video.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => {
                const isPub = video.publicationStatus === "published";
                const thumb =
                  video.thumbnailUrl ||
                  (video.youtubeVideoId
                    ? `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`
                    : "/stay/resort-hero.webp");

                return (
                  <article
                    key={video._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                      <Image
                        src={thumb}
                        alt={video.title || "Video"}
                        fill
                        unoptimized
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />

                      <button
                        type="button"
                        onClick={() => setPreviewVideo(video)}
                        title="Click to preview video"
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-80 transition hover:bg-black/50 hover:opacity-100"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-xl transition hover:scale-110 hover:bg-white">
                          <Play size={20} className="ml-1 fill-current text-[#B96928]" />
                        </div>
                      </button>

                      <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                        <span className="rounded-lg bg-black/75 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur">
                          {video.category}
                        </span>
                        {video.videoType === "direct" && (
                          <span className="rounded-lg bg-indigo-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
                            File Upload
                          </span>
                        )}
                        {video.isFeatured && (
                          <span className="inline-flex items-center gap-0.5 rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow">
                            <Sparkles size={10} /> Featured
                          </span>
                        )}
                      </div>

                      {video.duration && (
                        <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                          <Clock size={10} />
                          {video.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-extrabold text-gray-900">
                          {video.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                            isPub
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isPub ? "Published" : "Draft"}
                        </span>
                      </div>

                      {video.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
                          {video.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(video)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                            isPub
                              ? "border border-red-200 text-red-600 hover:bg-red-50"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                        >
                          {isPub ? <EyeOff size={13} /> : <Globe size={13} />}
                          {isPub ? "Unpublish" : "Publish"}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(video)}
                            title="Edit"
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(video)}
                            title="Delete"
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* ADD / EDIT VIDEO MODAL WITH FILE UPLOAD                        */}
      {/* ============================================================== */}
      {formModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-black text-gray-900">
                {formModal.isEdit ? "Edit Video" : "Add New Video"}
              </h2>
              <button
                type="button"
                onClick={() => setFormModal({ isOpen: false, isEdit: false, id: null })}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* TAB SELECTOR: RECORDED FILE vs YOUTUBE */}
            <div className="mt-4 flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, videoType: "direct" }))}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  formData.videoType === "direct"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <UploadCloud size={14} className="text-[#B96928]" />
                Upload Recorded Video (.mp4)
              </button>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, videoType: "youtube" }))}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  formData.videoType === "youtube"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LinkIcon size={14} className="text-[#B96928]" />
                YouTube Link
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tiger Sighting Recorded in Dhikala"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#B96928]"
                />
              </div>

            {/* OPTION 1: DIRECT FILE UPLOAD */}
{formData.videoType === "direct" ? (
  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4">
    <label className="mb-1 block text-xs font-bold text-gray-700">
      Choose Recorded Video File (.mp4, .mov, max 100MB) *
    </label>
    <input
      key="direct-file-input"
      ref={fileInputRef}
      type="file"
      accept="video/mp4,video/quicktime,video/webm"
      disabled={uploading}
      onChange={handleFileUpload}
      className="w-full text-xs text-gray-600 file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#B96928] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white file:shadow-sm hover:file:bg-[#A65C23] disabled:opacity-50"
    />

    {uploading && (
      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#B96928]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#B96928]/30 border-t-[#B96928]" />
        Uploading recorded video to Cloudinary... Please wait.
      </div>
    )}

    {formData.videoUrl && !uploading && (
      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={14} />
        Video ready! URL: <span className="font-mono text-[11px] truncate max-w-xs">{formData.videoUrl}</span>
      </div>
    )}
  </div>
) : (
  /* OPTION 2: YOUTUBE LINK */
  <div>
    <label className="mb-1 block text-xs font-bold text-gray-700">YouTube URL *</label>
    <input
      key="youtube-url-input"
      type="url"
      placeholder="https://www.youtube.com/watch?v=..."
      value={formData.videoUrl || ""}
      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#B96928]"
    />
    <p className="mt-1 text-[11px] text-gray-500">
      Paste YouTube link. The thumbnail and duration will be auto-handled.
    </p>
  </div>
)}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Category</label>
                  <select
                    value={formData.category || "safari"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-800 outline-none focus:border-[#B96928]"
                  >
                    <option value="safari">Safari Experience</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="resorts">Resorts & Stays</option>
                    <option value="activities">Adventure & Activities</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Duration (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1:45"
                    value={formData.duration || ""}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#B96928]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of the video..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#B96928]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isFeatured)}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded text-[#B96928]"
                  />
                  Featured Video
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.publicationStatus === "published"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publicationStatus: e.target.checked ? "published" : "unpublished",
                      })
                    }
                    className="h-4 w-4 rounded text-[#B96928]"
                  />
                  Publish Immediately
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setFormModal({ isOpen: false, isEdit: false, id: null })}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-[#B96928] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#A65C23] disabled:opacity-50"
                >
                  {saving ? "Saving..." : formModal.isEdit ? "Update Video" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW PLAYER (LIGHTBOX) */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewVideo(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={18} />
            </button>

            <div className="aspect-video w-full bg-black">
              {previewVideo.videoType === "youtube" && previewVideo.youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${previewVideo.youtubeVideoId}?autoplay=1`}
                  title={previewVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <video
                  src={previewVideo.videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="bg-gray-900 p-4 text-white">
              <h3 className="text-sm font-bold">{previewVideo.title}</h3>
              {previewVideo.description && (
                <p className="mt-1 text-xs text-gray-400">{previewVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}