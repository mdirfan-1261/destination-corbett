"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  X,
  Clock,
  Sparkles,
  Search,
  Video as VideoIcon,
  ChevronRight,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Flag,
  Copy,
  Check,
  Eye,
  ThumbsUp,
  Trash2,
  Pencil,
  MoreVertical,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const CATEGORIES = [
  { value: "all", label: "All Videos" },
  { value: "trending", label: "🔥 Trending" },
  { value: "saved", label: "🔖 Saved Videos" }, // ✅ User ki saved videos dekhne ke liye tab
  { value: "safari", label: "🚙 Safari Experiences" },
  { value: "wildlife", label: "🐅 Wildlife Sightings" },
  { value: "resorts", label: "🏨 Resorts & Stays" },
  { value: "activities", label: "🛶 Adventure & Activities" },
  { value: "general", label: "Jim Corbett Views" },
];

const POPULAR_HASHTAGS = [
  "JimCorbett",
  "TigerSighting",
  "DhikalaZone",
  "JungleSafari",
  "CorbettResorts",
  "WildlifePhotography",
];

// Helper: Extract YouTube Video ID
function extractYouTubeId(url = "", fallbackId = "") {
  if (fallbackId) return fallbackId;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : "";
}

export default function PublicVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [search, setSearch] = useState("");

  // Dynamic Site Origin for Testing & Production
  const [currentOrigin, setCurrentOrigin] = useState("");

  // ACTIVE VIDEO LIGHTBOX
  const [activeVideo, setActiveVideo] = useState(null);

  // Prevents infinite loop on deep linking
  const hasAutoOpenedRef = useRef(false);

  // Interaction States (Permanent LocalStorage Sync)
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [shareVideo, setShareVideo] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [reportVideo, setReportVideo] = useState(null);
  const [reportReason, setReportReason] = useState("inappropriate");
  const [reportNotes, setReportNotes] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Comments State
  const [commentsList, setCommentsList] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [myCommentIds, setMyCommentIds] = useState([]);

  // YouTube Style Edit/Delete Menu State
  const [openMenuCommentId, setOpenMenuCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // ✅ 1. PERMANENT SAVED & LIKED RESTORE FROM LOCALSTORAGE
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);

      try {
        // Load Saved Videos (Permanent Bookmark)
        const storedSaved = JSON.parse(localStorage.getItem("corbett_saved_videos") || "{}");
        setSavedMap(storedSaved);

        // Load Liked Videos
        const storedLiked = JSON.parse(localStorage.getItem("corbett_liked_videos") || "{}");
        setLikedMap(storedLiked);

        // Load User Comments
        const savedComments = JSON.parse(localStorage.getItem("myVideoCommentIds") || "[]");
        setMyCommentIds(savedComments);
      } catch (e) {
        console.error("Storage load error:", e);
      }
    }
  }, []);

  // 2. Fetch Videos
  useEffect(() => {
    async function fetchPublicVideos() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/videos`, { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setVideos(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load videos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicVideos();
  }, []);

  // 3. Play Video & Record Unique View (+ Sync Browser URL)
  const handleOpenVideo = (video) => {
    if (!video) return;
    setActiveVideo({
      ...video,
      viewsCount: (video.viewsCount || 0) + 1,
    });

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/videos?v=${video._id}`);
    }

    try {
      fetch(`${API_BASE}/api/videos/${video._id}/view`, { method: "POST" });
    } catch (e) {}
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    setOpenMenuCommentId(null);
    setEditingCommentId(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/videos");
    }
  };

  // 4. DEEP LINKING: Auto-open video if '?v=<videoId>' is in URL
  useEffect(() => {
    if (videos.length > 0 && !hasAutoOpenedRef.current && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const vId = urlParams.get("v");
      if (vId) {
        const targetVideo = videos.find((v) => v._id === vId);
        if (targetVideo) {
          hasAutoOpenedRef.current = true;
          handleOpenVideo(targetVideo);
        }
      }
    }
  }, [videos]);

  // 5. Fetch comments when video opens
  useEffect(() => {
    if (!activeVideo?._id) {
      setCommentsList([]);
      setNewCommentText("");
      setIsCommentFocused(false);
      setOpenMenuCommentId(null);
      setEditingCommentId(null);
      return;
    }

    async function fetchComments() {
      setLoadingComments(true);
      try {
        const res = await fetch(`${API_BASE}/api/videos/${activeVideo._id}/comments`);
        const data = await res.json();
        if (data.success) {
          setCommentsList(data.data || []);
        }
      } catch (err) {
        console.error("Comments error:", err);
      } finally {
        setLoadingComments(false);
      }
    }

    fetchComments();
  }, [activeVideo?._id]);

  // 6. Toggle Like (Saved Permanently)
  const handleToggleLike = async (e, videoId) => {
    e?.stopPropagation();
    const isCurrentlyLiked = likedMap[videoId];
    const newLiked = !isCurrentlyLiked;

    setLikedMap((prev) => {
      const updated = { ...prev, [videoId]: newLiked };
      if (typeof window !== "undefined") {
        localStorage.setItem("corbett_liked_videos", JSON.stringify(updated));
      }
      return updated;
    });

    setVideos((prev) =>
      prev.map((v) => {
        if (v._id === videoId) {
          const currentLikes = v.likesCount || 0;
          return {
            ...v,
            likesCount: newLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
          };
        }
        return v;
      })
    );

    if (activeVideo && activeVideo._id === videoId) {
      setActiveVideo((prev) => ({
        ...prev,
        likesCount: newLiked
          ? (prev.likesCount || 0) + 1
          : Math.max(0, (prev.likesCount || 0) - 1),
      }));
    }

    try {
      await fetch(`${API_BASE}/api/videos/${videoId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (err) {
      console.error("Like toggle failed", err);
    }
  };

  // ✅ 7. PERMANENT TOGGLE SAVE / BOOKMARK
  const handleToggleSave = (e, videoId) => {
    e?.stopPropagation();
    setSavedMap((prev) => {
      const newStatus = !prev[videoId];
      const updated = { ...prev, [videoId]: newStatus };
      if (typeof window !== "undefined") {
        localStorage.setItem("corbett_saved_videos", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // 8. Post Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeVideo) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/videos/${activeVideo._id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: newCommentText.trim(),
            userName: commentAuthor.trim() || "Corbett Explorer",
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setCommentsList((prev) => [data.data, ...prev]);
        setNewCommentText("");
        setIsCommentFocused(false);

        if (data.data?._id) {
          const updated = [data.data._id, ...myCommentIds];
          setMyCommentIds(updated);
          if (typeof window !== "undefined") {
            localStorage.setItem("myVideoCommentIds", JSON.stringify(updated));
          }
        }

        setVideos((prev) =>
          prev.map((v) =>
            v._id === activeVideo._id
              ? { ...v, commentsCount: (v.commentsCount || 0) + 1 }
              : v
          )
        );
        setActiveVideo((prev) => ({
          ...prev,
          commentsCount: (prev.commentsCount || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // 9. Edit Comment
  const handleSaveEditComment = async (commentId) => {
    if (!editingText.trim()) return;

    setCommentsList((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, text: editingText.trim() } : c))
    );
    setEditingCommentId(null);
    setOpenMenuCommentId(null);

    try {
      await fetch(
        `${API_BASE}/api/videos/${activeVideo?._id}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editingText.trim() }),
        }
      );
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  // 10. Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setCommentsList((prev) => prev.filter((c) => c._id !== commentId));
    setVideos((prev) =>
      prev.map((v) =>
        v._id === activeVideo?._id
          ? { ...v, commentsCount: Math.max(0, (v.commentsCount || 0) - 1) }
          : v
      )
    );
    if (activeVideo) {
      setActiveVideo((prev) => ({
        ...prev,
        commentsCount: Math.max(0, (prev.commentsCount || 0) - 1),
      }));
    }

    const updated = myCommentIds.filter((id) => id !== commentId);
    setMyCommentIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("myVideoCommentIds", JSON.stringify(updated));
    }
    setOpenMenuCommentId(null);

    try {
      await fetch(
        `${API_BASE}/api/videos/${activeVideo?._id}/comments/${commentId}`,
        { method: "DELETE" }
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // 11. Dynamic Share Actions
  const handleTriggerShare = (e, video) => {
    e?.stopPropagation();
    setShareVideo(video);
    setCopySuccess(false);

    try {
      fetch(`${API_BASE}/api/videos/${video._id}/share`, { method: "POST" });
      setVideos((prev) =>
        prev.map((v) =>
          v._id === video._id
            ? { ...v, sharesCount: (v.sharesCount || 0) + 1 }
            : v
        )
      );
    } catch (e) {}
  };

  // ✅ Exact Admin URL Format for Facebook/WhatsApp/Socials
  const getVideoShareUrl = (video) => {
    if (!video?._id) return "";
    return `https://destination-corbett.vercel.app/videos?v=${video._id}`;
  };

  // ✅ Exact Admin Promotional Text + Link
  const handleCopyLink = () => {
    if (!shareVideo) return;
    const publicUrl = getVideoShareUrl(shareVideo);
    const text = `🌿 Watch our latest Jim Corbett experience: "${shareVideo.title}"\n🎬 Watch here: ${publicUrl}\n#JimCorbett #Wildlife #Safari`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (!shareVideo) return;
    const url = getVideoShareUrl(shareVideo);
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareVideo.title,
          text: `Check out this amazing Corbett video: ${shareVideo.title}`,
          url,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  // 12. Submit Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportVideo) return;
    try {
      await fetch(`${API_BASE}/api/videos/${reportVideo._id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reportReason,
          notes: reportNotes,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportSubmitted(false);
        setReportVideo(null);
        setReportNotes("");
      }, 2000);
    } catch (err) {
      console.error("Failed to report video", err);
    }
  };

  // ✅ Filter videos (Includes "saved" category filter)
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      if (selectedCategory === "saved") {
        // Sirf wahi video jiska savedMap true ho
        if (!savedMap[video._id]) return false;
      } else if (selectedCategory === "trending") {
        if (!video.isTrending && (video.viewsCount || 0) < 5) return false;
      } else if (
        selectedCategory !== "all" &&
        video.category !== selectedCategory
      ) {
        return false;
      }

      if (selectedHashtag) {
        const tags = video.hashtags || [];
        const match = tags.some(
          (t) => t.toLowerCase() === selectedHashtag.toLowerCase()
        );
        if (!match) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          video.title?.toLowerCase().includes(q) ||
          video.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [videos, selectedCategory, selectedHashtag, search, savedMap]);

  const featuredVideo = useMemo(() => {
    return videos.find((v) => v.isFeatured) || videos[0] || null;
  }, [videos]);

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      {/* BREADCRUMB */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 text-xs sm:px-6 md:px-8">
        <div className="flex items-center gap-2 text-gray-500">
          <Link href="/" className="hover:text-[#B96928] outline-none">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="font-bold text-[#172033]">
            Jim Corbett Video Gallery
          </span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-4 pt-4 sm:px-6 md:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#0B3B32] p-6 text-white shadow-lg sm:p-10 lg:p-12">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur">
              <Sparkles size={13} /> Corbett Video Stories
            </span>
            <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Jim Corbett in Motion
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm md:text-base">
              Experience the thrill of Bengal tiger sightings, deep jungle
              safaris, and luxury resort tours. Watch, like, comment, and share!
            </p>

            {/* Popular Hashtags */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] font-semibold text-white/60">
                Trending Tags:
              </span>
              {POPULAR_HASHTAGS.map((tag) => {
                const active = selectedHashtag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedHashtag(active ? "" : tag)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition outline-none focus:outline-none focus:ring-0 ${
                      active
                        ? "bg-amber-400 font-bold text-black"
                        : "bg-white/15 text-white/90 hover:bg-white/25"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#B96928]/20 blur-3xl" />
        </div>
      </section>

      {/* FEATURED SPOTLIGHT */}
      {featuredVideo && !search && selectedCategory === "all" && !selectedHashtag && (
        <section className="px-4 pt-6 sm:px-6 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md lg:grid lg:grid-cols-12">
              <div className="relative aspect-video w-full bg-black lg:col-span-7">
                <Image
                  src={
                    featuredVideo.thumbnailUrl ||
                    (featuredVideo.youtubeVideoId
                      ? `https://img.youtube.com/vi/${featuredVideo.youtubeVideoId}/hqdefault.jpg`
                      : "/stay/resort-hero.webp")
                  }
                  alt={featuredVideo.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={() => handleOpenVideo(featuredVideo)}
                  title="Play Featured Video"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/50 outline-none focus:outline-none"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B96928] text-white shadow-2xl transition hover:scale-110">
                    <Play size={26} className="ml-1 fill-current" />
                  </div>
                </button>

                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                  <Sparkles size={12} /> Featured Story
                </span>
              </div>

              <div className="flex flex-col justify-center p-6 lg:col-span-5 lg:p-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B96928]">
                  {featuredVideo.category}
                </span>
                <h2 className="mt-1 text-xl font-black text-gray-900 sm:text-2xl">
                  {featuredVideo.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                  {featuredVideo.description ||
                    "Watch this breathtaking experience captured inside the heart of Jim Corbett National Park."}
                </p>

                {/* Social Stats */}
                <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Eye size={14} className="text-gray-400" />
                    {featuredVideo.viewsCount || 0} views
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart size={14} className="text-red-500 fill-red-500" />
                    {featuredVideo.likesCount || 0} likes
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle size={14} className="text-blue-500" />
                    {featuredVideo.commentsCount || 0} comments
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenVideo(featuredVideo)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0B3B32] px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#07251F] outline-none focus:outline-none"
                  >
                    <Play size={14} className="fill-current" /> Watch Video
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleTriggerShare(e, featuredVideo)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 outline-none focus:outline-none"
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTER TABS & SEARCH */}
      <section className="px-4 pt-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition outline-none focus:outline-none focus:ring-0 ${
                      active
                        ? "bg-[#0B3B32] text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search videos, wildlife, safari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ outline: "none", boxShadow: "none" }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs text-gray-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus:border-[#B96928]"
              />
            </div>
          </div>

          {/* VIDEO GRID */}
          <div className="mt-6 pb-16">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B3B32]/20 border-t-[#0B3B32]" />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <VideoIcon size={40} className="mx-auto text-gray-300" />
                <h3 className="mt-3 text-base font-bold text-gray-800">
                  {selectedCategory === "saved"
                    ? "No saved videos yet"
                    : "No videos found"}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedCategory === "saved"
                    ? "Click the bookmark ribbon 🔖 on any video to save it here permanently!"
                    : search
                    ? "Try searching for a different keyword or category."
                    : "Videos will appear here once published by admin."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => {
                  const ytId = extractYouTubeId(video.videoUrl, video.youtubeVideoId);
                  const thumb =
                    video.thumbnailUrl ||
                    (ytId
                      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                      : "/stay/resort-hero.webp");

                  const isLiked = Boolean(likedMap[video._id]);
                  const isSaved = Boolean(savedMap[video._id]);

                  return (
                    <article
                      key={video._id}
                      onClick={() => handleOpenVideo(video)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl outline-none"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                        <Image
                          src={thumb}
                          alt={video.title}
                          fill
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-90 transition group-hover:bg-black/40 group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#0B3B32] shadow-xl transition group-hover:scale-110 group-hover:bg-white">
                            <Play size={20} className="ml-1 fill-current" />
                          </div>
                        </div>

                        <span className="absolute left-2.5 top-2.5 rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                          {video.category}
                        </span>

                        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                          <Eye size={11} /> {video.viewsCount || 0}
                        </span>

                        {video.duration && (
                          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                            <Clock size={10} />
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[#B96928]">
                          {video.title}
                        </h3>

                        {video.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {video.description}
                          </p>
                        )}

                        {video.hashtags && video.hashtags.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {video.hashtags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-semibold text-[#B96928]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* SOCIAL ACTION BAR */}
                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-gray-600">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => handleToggleLike(e, video._id)}
                              className={`inline-flex items-center gap-1 text-xs font-semibold transition hover:scale-110 outline-none focus:outline-none ${
                                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                              }`}
                            >
                              <Heart
                                size={15}
                                className={isLiked ? "fill-red-500" : ""}
                              />
                              <span>{video.likesCount || 0}</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenVideo(video);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition hover:text-blue-600 outline-none focus:outline-none"
                            >
                              <MessageCircle size={15} />
                              <span>{video.commentsCount || 0}</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleTriggerShare(e, video)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition hover:text-green-600 outline-none focus:outline-none"
                              title="Share Video"
                            >
                              <Share2 size={15} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* ✅ Permanent Save/Bookmark Button */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleSave(e, video._id)}
                              className={`p-1 transition hover:scale-110 outline-none focus:outline-none ${
                                isSaved
                                  ? "text-amber-500"
                                  : "text-gray-400 hover:text-amber-500"
                              }`}
                              title={isSaved ? "Saved" : "Save video"}
                            >
                              <Bookmark
                                size={16}
                                className={isSaved ? "fill-amber-500" : ""}
                              />
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
      </section>

      {/* ============================================================== */}
      {/* EXACT YOUTUBE STYLE MODAL                                      */}
      {/* ============================================================== */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0f172a] shadow-2xl border border-white/10 text-white my-auto">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleCloseVideo}
              className="sticky top-3 float-right mr-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-white hover:text-black outline-none focus:outline-none"
            >
              <X size={18} />
            </button>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              {(() => {
                const ytId = extractYouTubeId(activeVideo.videoUrl, activeVideo.youtubeVideoId);
                if (ytId) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=1&enablejsapi=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; volume"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  );
                }
                return (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  />
                );
              })()}
            </div>

            {/* Video Metadata Row */}
            <div className="p-4 sm:p-6 space-y-4">
              <h1 className="text-base sm:text-xl font-black text-white leading-snug">
                {activeVideo.title}
              </h1>

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      activeVideo.authorAvatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    }
                    alt="Channel"
                    className="h-10 w-10 rounded-full object-cover border border-amber-400"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {activeVideo.authorName || "Destination Corbett"}
                      <span className="text-[10px] rounded bg-white/10 px-1 py-0.5 text-gray-300">
                        Official
                      </span>
                    </h3>
                    <span className="text-[11px] text-gray-400">
                      Jim Corbett Wildlife & Stay
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(null, activeVideo._id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition outline-none focus:outline-none ${
                      likedMap[activeVideo._id]
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    <ThumbsUp
                      size={15}
                      className={likedMap[activeVideo._id] ? "fill-red-400" : ""}
                    />
                    <span>{activeVideo.likesCount || 0}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleTriggerShare(e, activeVideo)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-bold text-white transition outline-none focus:outline-none"
                  >
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>

                  {/* ✅ Modal Save Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleSave(e, activeVideo._id)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition outline-none focus:outline-none ${
                      savedMap[activeVideo._id]
                        ? "text-amber-400 bg-amber-400/20"
                        : "bg-white/10 hover:bg-white/15 text-gray-300"
                    }`}
                    title={savedMap[activeVideo._id] ? "Saved" : "Save video"}
                  >
                    <Bookmark
                      size={16}
                      className={savedMap[activeVideo._id] ? "fill-amber-400" : ""}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportVideo(activeVideo)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 text-gray-400 hover:text-red-400 outline-none focus:outline-none"
                    title="Report"
                  >
                    <Flag size={14} />
                  </button>
                </div>
              </div>

              {/* Description Card */}
              <div className="rounded-2xl bg-white/5 p-4 text-xs text-gray-300 leading-relaxed space-y-1">
                <div className="flex items-center gap-3 font-bold text-white text-[11px] pb-1">
                  <span>{activeVideo.viewsCount || 0} views</span>
                  <span>·</span>
                  <span className="text-amber-400 uppercase tracking-wider">
                    {activeVideo.category}
                  </span>
                </div>
                <p>
                  {activeVideo.description ||
                    "Experience Jim Corbett National Park through authentic visual stories and wildlife moments."}
                </p>
              </div>

              {/* CLEAN COMMENTS SECTION */}
              <div className="pt-4 space-y-5 pb-16">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-extrabold text-white">
                    {commentsList.length} Comment{commentsList.length === 1 ? "" : "s"}
                  </h3>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                    alt="User"
                    className="h-10 w-10 rounded-full object-cover border border-white/20 mt-1 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    {isCommentFocused && (
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        style={{ outline: "none", boxShadow: "none" }}
                        className="w-full sm:w-56 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white placeholder-gray-400 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                      />
                    )}

                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newCommentText}
                      onFocus={() => setIsCommentFocused(true)}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      style={{ outline: "none", boxShadow: "none" }}
                      className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white py-1.5 text-sm text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition"
                    />

                    {isCommentFocused && (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewCommentText("");
                            setIsCommentFocused(false);
                          }}
                          className="rounded-full px-4 py-1.5 text-xs font-bold text-gray-300 hover:bg-white/10 outline-none focus:outline-none"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingComment || !newCommentText.trim()}
                          className={`rounded-full px-5 py-1.5 text-xs font-bold transition shadow outline-none focus:outline-none ${
                            newCommentText.trim()
                              ? "bg-amber-400 text-black hover:bg-amber-300 cursor-pointer"
                              : "bg-white/15 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {submittingComment ? "Posting..." : "Comment"}
                        </button>
                      </div>
                    )}
                  </div>
                </form>

                {/* Clean YouTube Comments List */}
                <div className="space-y-4 pt-2">
                  {loadingComments ? (
                    <div className="flex h-20 items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                    </div>
                  ) : commentsList.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">
                      No comments yet. Be the first to comment!
                    </div>
                  ) : (
                    commentsList.map((c) => {
                      const isMyComment = myCommentIds.includes(c._id);
                      const isEditing = editingCommentId === c._id;
                      const isMenuOpen = openMenuCommentId === c._id;

                      return (
                        <div
                          key={c._id}
                          className="group/c relative flex items-start justify-between gap-3 rounded-xl p-2 hover:bg-white/5 transition"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <img
                              src={
                                c.userAvatar ||
                                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                              }
                              alt={c.userName}
                              className="h-9 w-9 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  @{c.userName?.replace(/\s+/g, "").toLowerCase() || "guest"}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              {isEditing ? (
                                <div className="mt-2 space-y-2">
                                  <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    style={{ outline: "none", boxShadow: "none" }}
                                    className="w-full bg-transparent border-0 border-b border-amber-400 py-1 text-sm text-white outline-none focus:outline-none focus:ring-0"
                                    autoFocus
                                  />
                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingText("");
                                      }}
                                      className="rounded-full px-3 py-1 text-xs font-bold text-gray-400 hover:text-white outline-none"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEditComment(c._id)}
                                      disabled={!editingText.trim()}
                                      className="rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-black hover:bg-amber-300 outline-none"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-1 text-sm text-gray-200 leading-relaxed break-words">
                                  {c.text}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* YouTube Style 3-Dots Action Menu */}
                          {isMyComment && !isEditing && (
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenuCommentId(isMenuOpen ? null : c._id)
                                }
                                title="Comment options"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition outline-none focus:outline-none"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-8 z-30 w-32 rounded-xl bg-[#1e293b] border border-white/15 p-1 shadow-2xl text-white">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCommentId(c._id);
                                      setEditingText(c.text);
                                      setOpenMenuCommentId(null);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-white/10 transition outline-none"
                                  >
                                    <Pencil size={14} className="text-gray-400" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(c._id)}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition outline-none"
                                  >
                                    <Trash2 size={14} className="text-red-400" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {shareVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShareVideo(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 outline-none focus:outline-none"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-extrabold text-gray-900">
              Share this Corbett Video
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-gray-500">
              {shareVideo.title}
            </p>

            <div className="mt-6 grid grid-cols-4 gap-3 text-center">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🌿 *New Corbett Video Released!* \n"${shareVideo.title}"\n👉 Watch here: ${getVideoShareUrl(
                    shareVideo
                  )}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-1.5 outline-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow transition group-hover:scale-110">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700">WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  getVideoShareUrl(shareVideo)
                )}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-1.5 outline-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow transition group-hover:scale-110">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700">Facebook</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Watch "${shareVideo.title}" on Destination Corbett:`
                )}&url=${encodeURIComponent(getVideoShareUrl(shareVideo))}` }
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-1.5 outline-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow transition group-hover:scale-110">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700">X / Twitter</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  getVideoShareUrl(shareVideo)
                )}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-1.5 outline-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A66C2] text-white shadow transition group-hover:scale-110">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700">LinkedIn</span>
              </a>
            </div>

            <div className="mt-6">
              <span className="text-[11px] font-bold text-gray-500">
                Or copy video link:
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5">
                <input
                  type="text"
                  readOnly
                  value={getVideoShareUrl(shareVideo)}
                  className="flex-1 bg-transparent px-2 text-xs text-gray-600 outline-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#0B3B32] px-3 py-1.5 text-xs font-bold text-white shadow transition hover:bg-[#07251F] outline-none focus:outline-none"
                >
                  {copySuccess ? (
                    <>
                      <Check size={13} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 outline-none focus:outline-none"
              >
                More Share Options...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setReportVideo(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 outline-none focus:outline-none"
            >
              <X size={18} />
            </button>

            <h3 className="text-sm font-extrabold text-gray-900">Report Video</h3>
            <p className="mt-1 line-clamp-1 text-xs text-gray-500">
              {reportVideo.title}
            </p>

            {reportSubmitted ? (
              <div className="py-6 text-center text-xs font-bold text-green-600">
                ✓ Report submitted. Thank you for keeping our community safe.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="mt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:outline-none"
                  >
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="spam">Spam or Misleading</option>
                    <option value="violence">Violence or Danger</option>
                    <option value="copyright">Copyright Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700">
                    Additional Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly explain the issue..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportVideo(null)}
                    className="rounded-xl px-3 py-1.5 text-xs font-bold text-gray-500 outline-none focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 outline-none focus:outline-none"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}