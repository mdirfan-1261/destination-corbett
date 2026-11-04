"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Video as VideoIcon,
  Plus,
  Play,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  ExternalLink,
  Share2,
  ChevronUp,
  ChevronDown,
  Eye,
  Heart,
  MessageCircle,
  ShieldAlert,
  Copy,
  Check,
  Smartphone,
  Film,
  TrendingUp,
  BarChart3,
  Award,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function extractYouTubeId(url = "") {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : "";
}

const EMPTY_FORM = {
  title: "",
  description: "",
  videoType: "direct",
  videoUrl: "",
  thumbnailUrl: "",
  customThumbnailUrl: "",
  duration: "",
  category: "safari",
  isFeatured: false,
  publicationStatus: "published",
  order: 0,
};

export default function AdminVideosPage() {
  const [activeTab, setActiveTab] = useState("videos"); // "videos" | "analytics" | "comments" | "moderation"
  const [videos, setVideos] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [dailyData, setDailyData] = useState({
    todayViews: 0,
    yesterdayViews: 0,
    trend: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingCustomThumb, setUploadingCustomThumb] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const videoFileInputRef = useRef(null);
  const customThumbInputRef = useRef(null);

  // Modals
  const [formModal, setFormModal] = useState({ isOpen: false, isEdit: false, id: null });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [broadcastVideo, setBroadcastVideo] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Quick Video Comments Modal
  const [inspectCommentsFor, setInspectCommentsFor] = useState(null);
  const [videoCommentsList, setVideoCommentsList] = useState([]);

  function getAuthHeader() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  // 1. Load All Videos
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

  // 2. Load Reports
  async function loadReports() {
    try {
      const res = await fetch(`${API_BASE}/api/videos/admin/reports`, {
        headers: { ...getAuthHeader() },
      });
      const data = await res.json();
      if (data.success) {
        setReports(data.data || []);
      }
    } catch {}
  }

  // 3. Load All Comments
  async function loadAllComments() {
    try {
      const res = await fetch(`${API_BASE}/api/videos/admin/all-comments`, {
        headers: { ...getAuthHeader() },
      });
      const data = await res.json();
      if (data.success) {
        setAllComments(data.data || []);
      }
    } catch {}
  }

  // 4. Load Daily Analytics (Today vs Yesterday + 7-Day Trend)
  async function loadDailyAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/api/videos/admin/daily-analytics`, {
        headers: { ...getAuthHeader() },
      });
      const data = await res.json();
      if (data.success) {
        setDailyData(data);
      }
    } catch {}
  }

  useEffect(() => {
    loadVideos();
    loadReports();
    loadAllComments();
    loadDailyAnalytics();
  }, []);

  async function handleOpenVideoComments(video) {
    setInspectCommentsFor(video);
    setVideoCommentsList([]);
    try {
      const res = await fetch(`${API_BASE}/api/videos/${video._id}/comments`);
      const data = await res.json();
      if (data.success) {
        setVideoCommentsList(data.data || []);
      }
    } catch {}
  }

  async function handleDeleteComment(commentId, videoId) {
    const ok = window.confirm("Are you sure you want to delete this comment?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/videos/admin/comments/${commentId}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Comment deleted.");
        setAllComments((prev) => prev.filter((c) => c._id !== commentId));
        setVideoCommentsList((prev) => prev.filter((c) => c._id !== commentId));
        if (videoId) {
          setVideos((prev) =>
            prev.map((v) =>
              v._id === videoId
                ? { ...v, commentsCount: Math.max(0, (v.commentsCount || 0) - 1) }
                : v
            )
          );
        }
      } else {
        showToast(data.message || "Failed to delete comment.");
      }
    } catch {
      showToast("Server error deleting comment.");
    }
  }

  function handleOpenAdd() {
    setFormData(EMPTY_FORM);
    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    if (customThumbInputRef.current) customThumbInputRef.current.value = "";
    setFormModal({ isOpen: true, isEdit: false, id: null });
  }

  function handleOpenEdit(video) {
    setFormData({
      title: video.title || "",
      description: video.description || "",
      videoType: video.videoType || "youtube",
      videoUrl: video.videoUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      customThumbnailUrl: video.thumbnailUrl || "",
      duration: video.duration || "",
      category: video.category || "general",
      isFeatured: Boolean(video.isFeatured),
      publicationStatus: video.publicationStatus || "published",
      order: Number(video.order) || 0,
    });
    setFormModal({ isOpen: true, isEdit: true, id: video._id });
  }

  const ytAutoThumbnail = useMemo(() => {
    if (formData.videoType === "youtube" && formData.videoUrl) {
      const id = extractYouTubeId(formData.videoUrl);
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    return "";
  }, [formData.videoType, formData.videoUrl]);

  async function handleVideoFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      showToast("Video size too large. Max limit is 100MB.");
      return;
    }

    setUploadingVideo(true);
    const bodyData = new FormData();
    bodyData.append("video", file);

    try {
      const res = await fetch(`${API_BASE}/api/videos/upload-file`, {
        method: "POST",
        headers: { ...getAuthHeader() },
        body: bodyData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl || prev.thumbnailUrl,
          duration: data.duration || "0:30",
          videoType: "direct",
        }));
        showToast("✓ Video uploaded successfully!");
      } else {
        showToast(data.message || "Failed to upload video file.");
      }
    } catch {
      showToast("Server error during video upload.");
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handleCustomThumbnailUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCustomThumb(true);
    const bodyData = new FormData();
    bodyData.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/api/upload/image`, {
        method: "POST",
        headers: { ...getAuthHeader() },
        body: bodyData,
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          customThumbnailUrl: data.imageUrl,
          thumbnailUrl: data.imageUrl,
        }));
        showToast("Custom thumbnail uploaded!");
      } else {
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          customThumbnailUrl: localUrl,
          thumbnailUrl: localUrl,
        }));
        showToast("Thumbnail attached.");
      }
    } catch {
      showToast("Thumbnail attached.");
    } finally {
      setUploadingCustomThumb(false);
    }
  }

  async function handleSaveVideo(e) {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.videoUrl?.trim()) {
      showToast("Title and Video URL / File are required.");
      return;
    }

    setSaving(true);
    try {
      const finalThumb =
        formData.customThumbnailUrl ||
        ytAutoThumbnail ||
        formData.thumbnailUrl ||
        "/stay/resort-hero.webp";

      const payload = {
        ...formData,
        thumbnailUrl: finalThumb,
      };

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
        body: JSON.stringify(payload),
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
        showToast(`Video ${nextStatus === "published" ? "activated" : "deactivated"} successfully.`);
      } else {
        showToast(data.message || "Failed to update status.");
      }
    } catch {
      showToast("Failed to update status.");
    }
  }

  async function handleMoveOrder(index, direction) {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const newVideos = [...videos];
    const temp = newVideos[index];
    newVideos[index] = newVideos[targetIndex];
    newVideos[targetIndex] = temp;

    setVideos(newVideos);

    try {
      await fetch(`${API_BASE}/api/videos/admin/${newVideos[index]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ order: index }),
      });
      await fetch(`${API_BASE}/api/videos/admin/${newVideos[targetIndex]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ order: targetIndex }),
      });
    } catch {}
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

  function handleCopyBroadcastText(video) {
    const publicUrl = `https://destinationcorbett.com/videos?v=${video._id}`;
    const text = `🌿 Watch our latest Jim Corbett experience: "${video.title}"\n🎬 Watch here: ${publicUrl}\n#JimCorbett #Wildlife #Safari`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  }

  const filteredVideos = useMemo(() => {
    return videos.filter((item) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.videoUrl?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [videos, search]);

  const totalViews = useMemo(() => videos.reduce((acc, v) => acc + (v.viewsCount || 0), 0), [videos]);
  const totalLikes = useMemo(() => videos.reduce((acc, v) => acc + (v.likesCount || 0), 0), [videos]);
  const totalComments = useMemo(() => videos.reduce((acc, v) => acc + (v.commentsCount || 0), 0), [videos]);
  const totalShares = useMemo(() => videos.reduce((acc, v) => acc + (v.sharesCount || 0), 0), [videos]);

  const topViewedVideos = useMemo(() => {
    return [...videos].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5);
  }, [videos]);

  const topLikedVideos = useMemo(() => {
    return [...videos].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 5);
  }, [videos]);

  // Max views in 7-day trend for chart scaling
  const maxTrendViews = useMemo(() => {
    const viewsList = dailyData.trend.map((t) => t.views || 0);
    return Math.max(...viewsList, 5); // minimum scale of 5
  }, [dailyData]);

  const activeCount = videos.filter((v) => v.publicationStatus === "published").length;
  const maxSlots = 10;
  const slotsLeft = Math.max(0, maxSlots - activeCount);

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-4 py-3 text-xs font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <VideoIcon size={18} />
              </div>
              <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                Videos & Social Engagement Manager
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Manage YouTube videos, Reels, visitor comments, likes, and daily analytics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadVideos();
              loadAllComments();
              loadReports();
              loadDailyAnalytics();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {/* REAL-TIME ENGAGEMENT KPI OVERVIEW CARDS */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold">Total Views</span>
              <Eye size={16} className="text-indigo-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-gray-900">{totalViews}</p>
            <span className="text-[10px] text-gray-400">Total website plays</span>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold">Total Likes</span>
              <Heart size={16} className="text-red-500 fill-red-500" />
            </div>
            <p className="mt-2 text-2xl font-black text-gray-900">{totalLikes}</p>
            <span className="text-[10px] text-gray-400">Visitor reactions</span>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold">Total Comments</span>
              <MessageCircle size={16} className="text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-black text-gray-900">{totalComments}</p>
            <span className="text-[10px] text-gray-400">Community discussions</span>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold">Total Shares</span>
              <Share2 size={16} className="text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-black text-gray-900">{totalShares}</p>
            <span className="text-[10px] text-gray-400">WhatsApp / FB reach</span>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "videos"
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Film size={14} />
            All Videos ({videos.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("analytics");
              loadDailyAnalytics();
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "analytics"
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <BarChart3 size={14} />
            Analytics & Daily Graph
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("comments");
              loadAllComments();
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "comments"
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MessageCircle size={14} />
            Comments Manager ({allComments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("moderation")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "moderation"
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ShieldAlert size={14} />
            Reported Queue
            {reports.length > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] text-white">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: ALL VIDEOS LIST                                         */}
        {/* ============================================================== */}
        {activeTab === "videos" && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  <span className="font-extrabold text-gray-900">{videos.length}</span> Total
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
                  <span className="font-extrabold text-emerald-900">{activeCount}</span> Active
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  <span className="font-extrabold text-gray-900">{slotsLeft}</span> Slots left
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-48 sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Plus size={15} />
                  Add Video / Reel
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="flex h-48 items-center justify-center rounded-2xl border border-gray-200 bg-white">
                  <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-600/20 border-t-indigo-600" />
                </div>
              ) : filteredVideos.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                  <VideoIcon size={36} className="mx-auto text-gray-300" />
                  <h3 className="mt-2 text-sm font-bold text-gray-800">No videos found</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Click '+ Add Video / Reel' to publish your first content.</p>
                </div>
              ) : (
                filteredVideos.map((video, idx) => {
                  const isActive = video.publicationStatus === "published";
                  const isFile = video.videoType === "direct";
                  const ytId = video.youtubeVideoId || extractYouTubeId(video.videoUrl);
                  const thumb =
                    video.thumbnailUrl ||
                    (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/stay/resort-hero.webp");

                  return (
                    <div
                      key={video._id}
                      className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-sm transition hover:shadow-md sm:flex-nowrap"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          onClick={() => setPreviewVideo(video)}
                          className="relative h-16 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-900 shadow-sm"
                        >
                          <Image
                            src={thumb}
                            alt={video.title}
                            fill
                            unoptimized
                            className="object-cover transition group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                            <Play size={16} className="fill-white text-white" />
                          </div>
                          {isFile && (
                            <span className="absolute bottom-1 left-1 rounded bg-indigo-600 px-1 py-0.2 text-[9px] font-bold text-white">
                              Gallery
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-gray-900">
                            {video.title}
                          </h3>

                          {video.videoUrl && (
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-indigo-600 hover:underline"
                            >
                              <ExternalLink size={12} className="shrink-0" />
                              <span className="truncate">{video.videoUrl}</span>
                            </a>
                          )}

                          <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <Eye size={12} className="text-gray-400" />
                              {video.viewsCount || 0} views
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <Heart size={12} className="text-red-400" />
                              {video.likesCount || 0} likes
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenVideoComments(video)}
                              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                            >
                              <MessageCircle size={12} />
                              {video.commentsCount || 0} comments (Manage)
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>

                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(idx, "up")}
                            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === filteredVideos.length - 1}
                            onClick={() => handleMoveOrder(idx, "down")}
                            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTogglePublish(video)}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                          {isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setBroadcastVideo(video)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:border-indigo-500 hover:text-indigo-600"
                          title="Broadcast on Social Media"
                        >
                          <Share2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(video)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(video)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ANALYTICS & DAILY GRAPH (TODAY vs YESTERDAY + 7-DAY BAR)*/}
        {/* ============================================================== */}
        {activeTab === "analytics" && (
          <div className="mt-4 space-y-5">
            {/* 1. DAILY GRAPH CARD */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Calendar size={18} />
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">
                      Daily Views & Engagement Trend
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Day-by-day video plays for the last 7 days
                    </p>
                  </div>
                </div>

                {/* Today vs Yesterday Stats Badges */}
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-1.5 text-center">
                    <span className="text-[10px] font-bold uppercase text-indigo-600">
                      Today 
                    </span>
                    <p className="text-base font-black text-indigo-950">
                      {dailyData.todayViews || 0} views
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      Yesterday 
                    </span>
                    <p className="text-base font-black text-gray-800">
                      {dailyData.yesterdayViews || 0} views
                    </p>
                  </div>
                </div>
              </div>

              {/* 7-DAY VISUAL BAR CHART */}
              <div className="mt-6">
                <div className="flex h-44 items-end justify-between gap-2 sm:gap-4 border-b border-gray-100 px-2 pb-2">
                  {dailyData.trend.map((t, idx) => {
                    const views = t.views || 0;
                    const percent = Math.max(8, Math.round((views / maxTrendViews) * 100));
                    const isToday = idx === dailyData.trend.length - 1;

                    return (
                      <div
                        key={t.date}
                        className="group relative flex flex-1 flex-col items-center h-full justify-end"
                      >
                        {/* Hover Tooltip */}
                        <div className="pointer-events-none absolute -top-8 hidden rounded-lg bg-gray-900 px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block z-10 whitespace-nowrap">
                          {views} views ({t.date})
                        </div>

                        {/* Bar */}
                        <span className="mb-1 text-[11px] font-bold text-gray-600">
                          {views}
                        </span>
                        <div
                          style={{ height: `${percent}%` }}
                          className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ${
                            isToday
                              ? "bg-gradient-to-t from-indigo-700 to-indigo-500 shadow-md"
                              : "bg-gray-200 hover:bg-indigo-300"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Date Labels */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 pt-2 text-center">
                  {dailyData.trend.map((t, idx) => {
                    const isToday = idx === dailyData.trend.length - 1;
                    return (
                      <div key={t.date} className="flex-1 text-[11px]">
                        <span
                          className={`block font-bold ${
                            isToday ? "text-indigo-600" : "text-gray-500"
                          }`}
                        >
                          {t.day}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {t.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. LEADERBOARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Top Most Viewed Videos */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b pb-3 text-indigo-700">
                  <Award size={18} />
                  <h3 className="font-bold text-sm text-gray-900">
                    Top 5 Most Viewed Videos
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  {topViewedVideos.length === 0 ? (
                    <p className="text-xs text-gray-400">No view data yet.</p>
                  ) : (
                    topViewedVideos.map((v, i) => {
                      const maxView = topViewedVideos[0]?.viewsCount || 1;
                      const percent = Math.min(100, Math.round(((v.viewsCount || 0) / maxView) * 100));

                      return (
                        <div key={v._id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-800 truncate max-w-[240px]">
                              #{i + 1} {v.title}
                            </span>
                            <span className="font-mono font-bold text-indigo-600">
                              {v.viewsCount || 0} views
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Top Most Liked Videos */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b pb-3 text-red-600">
                  <Heart size={18} className="fill-red-500" />
                  <h3 className="font-bold text-sm text-gray-900">
                    Top 5 Most Liked Videos
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  {topLikedVideos.length === 0 ? (
                    <p className="text-xs text-gray-400">No likes data yet.</p>
                  ) : (
                    topLikedVideos.map((v, i) => {
                      const maxLikes = topLikedVideos[0]?.likesCount || 1;
                      const percent = Math.min(100, Math.round(((v.likesCount || 0) / maxLikes) * 100));

                      return (
                        <div key={v._id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-800 truncate max-w-[240px]">
                              #{i + 1} {v.title}
                            </span>
                            <span className="font-mono font-bold text-red-600">
                              {v.likesCount || 0} likes
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-red-500 transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: COMMENTS MANAGER                                        */}
        {/* ============================================================== */}
        {activeTab === "comments" && (
          <div className="mt-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Live Comments Management
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Monitor, review, and delete any spam or abusive comments across all videos.
                  </p>
                </div>
                <span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {allComments.length} Total Comments
                </span>
              </div>

              {allComments.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No comments posted yet.
                </div>
              ) : (
                <div className="mt-4 divide-y divide-gray-100">
                  {allComments.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-start justify-between gap-4 py-3.5 hover:bg-gray-50/50 rounded-xl px-2"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={
                            c.userAvatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                          }
                          alt="Avatar"
                          className="h-9 w-9 rounded-full object-cover border border-gray-200 shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-gray-900">
                              {c.userName}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-700">
                            {c.text}
                          </p>
                          {c.videoId?.title && (
                            <span className="mt-1 inline-block text-[10px] text-indigo-600 font-semibold">
                              On: {c.videoId.title}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteComment(c._id, c.videoId?._id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 shrink-0"
                        title="Delete Comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: REPORTED QUEUE                                          */}
        {/* ============================================================== */}
        {activeTab === "moderation" && (
          <div className="mt-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                Reported Content Queue
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Review videos flagged by visitors as inappropriate or spam.
              </p>

              {reports.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-gray-400">
                  ✓ No reported videos. Everything is clean!
                </div>
              ) : (
                <div className="mt-4 divide-y divide-gray-100">
                  {reports.map((rep) => (
                    <div
                      key={rep._id}
                      className="flex items-center justify-between py-3.5"
                    >
                      <div>
                        <span className="inline-block rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                          {rep.reason}
                        </span>
                        <h4 className="mt-1 text-xs font-bold text-gray-900">
                          Video: {rep.videoId?.title || "Video"}
                        </h4>
                        {rep.notes && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            Note: "{rep.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewVideo(rep.videoId)}
                          className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Review Video
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(rep.videoId)}
                          className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                        >
                          Delete Video
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* QUICK VIDEO COMMENTS MODAL */}
      {inspectCommentsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Comments for: {inspectCommentsFor.title}
                </h3>
                <span className="text-[11px] text-gray-500">
                  {videoCommentsList.length} comments posted
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectCommentsFor(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {videoCommentsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No comments on this video yet.
                </div>
              ) : (
                videoCommentsList.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{c.userName}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-700">{c.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(c._id, inspectCommentsFor._id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Delete Comment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT VIDEO MODAL */}
      {formModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <VideoIcon size={16} />
                </div>
                <h2 className="text-base font-black text-gray-900">
                  {formModal.isEdit ? "Edit Video / Reel" : "Add Video / Reel"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFormModal({ isOpen: false, isEdit: false, id: null })}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, videoType: "direct" }))}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  formData.videoType === "direct"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Smartphone size={14} />
                Upload Reel / Gallery File
              </button>

              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, videoType: "youtube" }))}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  formData.videoType === "youtube"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LinkIcon size={14} />
                YouTube Link
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Video / Reel Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Bengal Tiger in Dhikala Zone"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-indigo-600"
                />
              </div>

              {formData.videoType === "direct" ? (
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">
                    Select Video from Gallery / Device (.mp4, .mov) *
                  </label>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4 transition hover:border-indigo-500 hover:bg-indigo-50/70"
                  >
                    {uploadingVideo ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
                        <span className="mt-2 text-xs font-bold text-indigo-700">
                          Uploading video to Cloudinary... Please wait.
                        </span>
                      </div>
                    ) : formData.videoUrl ? (
                      <div className="flex flex-col items-center text-center">
                        <CheckCircle2 size={32} className="text-emerald-600" />
                        <span className="mt-1.5 text-xs font-bold text-gray-900">
                          Video Ready!
                        </span>
                        <span className="mt-0.5 max-w-xs truncate text-[11px] text-gray-500">
                          {formData.videoUrl}
                        </span>
                        <span className="mt-2 inline-block rounded-lg bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white">
                          Click to Replace Video
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm group-hover:scale-110 transition">
                          <UploadCloud size={22} />
                        </div>
                        <span className="mt-2 text-xs font-bold text-gray-800">
                          Click to Choose Video from Phone / Gallery
                        </span>
                        <span className="mt-0.5 text-[11px] text-gray-500">
                          MP4, MOV, WebM · Max 100MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">
                    YouTube URL *
                  </label>
                  <div className="relative flex items-center rounded-xl border border-indigo-200 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-600">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded bg-red-600 text-white">
                      <Play size={10} className="ml-0.5 fill-white" />
                    </div>
                    <input
                      type="url"
                      required
                      placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                      value={formData.videoUrl || ""}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full text-xs text-gray-800 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {formData.videoType === "youtube" ? "YT Auto-Thumbnail" : "Auto Poster"}
                  </span>
                  <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-sm">
                    {ytAutoThumbnail || formData.thumbnailUrl ? (
                      <Image
                        src={ytAutoThumbnail || formData.thumbnailUrl}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="p-3 text-center text-[10px] text-gray-400">
                        Auto thumbnail will show here
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Custom Thumbnail
                  </span>
                  <input
                    ref={customThumbInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomThumbnailUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => customThumbInputRef.current?.click()}
                    className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 transition hover:border-indigo-400 hover:bg-indigo-50/20"
                  >
                    {formData.customThumbnailUrl ? (
                      <Image
                        src={formData.customThumbnailUrl}
                        alt="Custom Thumbnail"
                        fill
                        unoptimized
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <UploadCloud size={18} className="mx-auto text-gray-400 group-hover:text-indigo-600" />
                        <span className="mt-1 block text-[10px] font-bold text-gray-600">
                          {uploadingCustomThumb ? "Uploading..." : "Click to upload"}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="mt-1 block text-[9px] text-gray-400">
                    JPG, PNG, WEBP · max 5 MB
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Category</label>
                  <select
                    value={formData.category || "safari"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-indigo-600"
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
                    placeholder="e.g. 0:45"
                    value={formData.duration || ""}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-indigo-600"
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
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setFormModal({ isOpen: false, isEdit: false, id: null })}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingVideo}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Check size={14} />
                  {saving ? "Saving..." : formModal.isEdit ? "Update Video" : "Publish Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-CLICK BROADCAST MODAL */}
      {broadcastVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setBroadcastVideo(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Share2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  Broadcast to Social Media
                </h3>
                <p className="line-clamp-1 text-xs text-gray-500">
                  {broadcastVideo.title}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-600">
              Publish or share this video directly to your official company social accounts:
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🌿 *New Corbett Video Released!* \n"${broadcastVideo.title}"\n👉 Watch here: https://destinationcorbett.com/videos?v=${broadcastVideo._id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 transition hover:bg-emerald-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </div>
                <span className="mt-1 text-[11px] font-bold text-emerald-900">WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://destinationcorbett.com/videos?v=${broadcastVideo._id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50/50 p-3 transition hover:bg-blue-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="mt-1 text-[11px] font-bold text-blue-900">Facebook</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Watch "${broadcastVideo.title}" on Destination Corbett:`
                )}&url=${encodeURIComponent(
                  `https://destinationcorbett.com/videos?v=${broadcastVideo._id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:bg-gray-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="mt-1 text-[11px] font-bold text-gray-900">X / Twitter</span>
              </a>
            </div>

            <div className="mt-4 pt-2">
              <button
                type="button"
                onClick={() => handleCopyBroadcastText(broadcastVideo)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
              >
                {copySuccess ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    Copied Promotional Text!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy Promotional Caption & Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW PLAYER */}
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
                  src={`https://www.youtube.com/embed/${previewVideo.youtubeVideoId}?autoplay=1&mute=0`}
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