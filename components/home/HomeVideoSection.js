"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, Sparkles } from "lucide-react";

export default function HomeVideoSection() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/videos?limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVideos(data.data.slice(0, 3)); // Sirf top 3 latest videos
        }
      })
      .catch(() => {});
  }, []);

  if (videos.length === 0) return null; // Agar koi video published nahi hai to hide rahega

  return (
    <section className="bg-[#0B3B32] py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300">
              <Sparkles size={12} /> Corbett in Motion
            </span>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Real Safari & Wildlife Moments
            </h2>
            <p className="mt-1 text-xs text-white/70 sm:text-sm">
              Watch real footage of tigers, elephants, and peaceful resort stays.
            </p>
          </div>

          <Link
            href="/videos"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#B96928] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#A65C23]"
          >
            Explore All Videos <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 VIDEO CARDS */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const thumb =
              video.thumbnailUrl ||
              (video.youtubeVideoId
                ? `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`
                : "/stay/resort-hero.webp");

            return (
              <Link
                key={video._id}
                href="/videos"
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#B96928]/40"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <Image
                    src={thumb}
                    alt={video.title}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B96928] text-white shadow-xl transition group-hover:scale-110">
                      <Play size={18} className="ml-1 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {video.category}
                  </span>
                  <h3 className="mt-1 line-clamp-1 text-sm font-bold text-white group-hover:text-amber-300">
                    {video.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}