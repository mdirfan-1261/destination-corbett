"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const CATEGORIES = [
  { value: "all", label: "All Videos" },
  { value: "safari", label: "🚙 Safari Experiences" },
  { value: "wildlife", label: "🐅 Wildlife Sightings" },
  { value: "resorts", label: "🏨 Resorts & Stays" },
  { value: "activities", label: "🛶 Adventure & Activities" },
  { value: "general", label: "Jim Corbett Views" },
];


export default function PublicVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function fetchPublicVideos() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/videos`, {
          cache: "no-store",
        });
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

  // Filter videos
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      if (selectedCategory !== "all" && video.category !== selectedCategory) {
        return false;
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
  }, [videos, selectedCategory, search]);

  const featuredVideo = useMemo(() => {
    return videos.find((v) => v.isFeatured) || videos[0] || null;
  }, [videos]);

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      {/* BREADCRUMB */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 text-xs sm:px-6 md:px-8">
        <div className="flex items-center gap-2 text-gray-500">
          <Link href="/" className="hover:text-[#B96928]">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="font-bold text-[#172033]">Jim Corbett Video Gallery</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-4 pt-4 sm:px-6 md:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#0B3B32] p-6 text-white shadow-lg sm:p-10 lg:p-12">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur">
              <Sparkles size={13} /> Visual Corbett Experience
            </span>
            <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Jim Corbett in Motion
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm md:text-base">
              Experience the thrill of Bengal tiger sightings, deep jungle safaris, and luxury resort tours through authentic video footage.
            </p>
          </div>

          {/* Background overlay design */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#B96928]/20 blur-3xl" />
        </div>
      </section>

      {/* FEATURED VIDEO BANNER (Agar featured video ho) */}
      {featuredVideo && !search && selectedCategory === "all" && (
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
                  onClick={() => setActiveVideo(featuredVideo)}
                  title="Play Featured Video"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/50"
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

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(featuredVideo)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0B3B32] px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#07251F]"
                  >
                    <Play size={14} className="fill-current" /> Watch Video
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
            {/* Category Pills */}
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
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

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs text-gray-800 outline-none focus:border-[#B96928]"
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
                <h3 className="mt-3 text-base font-bold text-gray-800">No videos available</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {search
                    ? "No video matched your search query."
                    : "Published videos will appear here soon."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => {
                  const thumb =
                    video.thumbnailUrl ||
                    (video.youtubeVideoId
                      ? `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`
                      : "/stay/resort-hero.webp");

                  return (
                    <article
                      key={video._id}
                      onClick={() => setActiveVideo(video)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                        <Image
                          src={thumb}
                          alt={video.title}
                          fill
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        {/* Centered Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-90 transition group-hover:bg-black/40 group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#0B3B32] shadow-xl transition group-hover:scale-110 group-hover:bg-white">
                            <Play size={20} className="ml-1 fill-current" />
                          </div>
                        </div>

                        {/* Top Badges */}
                        <span className="absolute left-2.5 top-2.5 rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                          {video.category}
                        </span>

                        {video.duration && (
                          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                            <Clock size={10} />
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[#B96928]">
                          {video.title}
                        </h3>

                        {video.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {video.description}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-3 text-[11px] font-bold text-[#0B3B32]">
                          <span>Watch Now →</span>
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
      {/* VIDEO POPUP PLAYER MODAL (LIGHTBOX)                            */}
      {/* ============================================================== */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-white hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="aspect-video w-full bg-black">
              {activeVideo.videoType === "youtube" && activeVideo.youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeVideoId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="bg-[#172033] p-4 text-white sm:p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                {activeVideo.category}
              </span>
              <h2 className="mt-1 text-base font-extrabold sm:text-lg">
                {activeVideo.title}
              </h2>
              {activeVideo.description && (
                <p className="mt-1 text-xs text-gray-300">
                  {activeVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}