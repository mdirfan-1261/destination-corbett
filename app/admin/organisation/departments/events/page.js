"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  UploadCloud,
  Edit2,
  CheckCircle2,
  RefreshCw,
  Link as LinkIcon,
  Eye,
  Building2,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";

// Guarantee hits Express backend on port 5000 on localhost
const API_BASE =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
        /\/+$/,
        ""
      );

// 6 Default Corbett Events
const DEFAULT_EVENTS = [
  {
    _id: "corporate-meetings",
    slug: "corporate-meetings",
    title: "Corporate Meetings",
    category: "Corporate",
    description:
      "Professional meeting spaces and hospitality for focused business gatherings.",
    href: "/events/meetings",
    image: "/images/events/optimized/corporate-meetings.webp",
  },
  {
    _id: "conferences",
    slug: "conferences",
    title: "Conferences",
    category: "Conference",
    description:
      "Venue, accommodation, food and coordination for your conference.",
    href: "/events/conferences",
    image: "/images/events/optimized/conferences.webp",
  },
  {
    _id: "team-outings",
    slug: "team-outings",
    title: "Team Outings",
    category: "Outing",
    description:
      "Bring your team together with memorable outings and Corbett experiences.",
    href: "/events/team-outings",
    image: "/images/events/optimized/team-outings.webp",
  },
  {
    _id: "corporate-retreats",
    slug: "corporate-retreats",
    title: "Corporate Retreats",
    category: "Retreat",
    description:
      "Combine productive sessions with comfortable stays and nature.",
    href: "/events/retreats",
    image: "/images/events/optimized/corporate-retreats.webp",
  },
  {
    _id: "dealer-meets",
    slug: "dealer-meets",
    title: "Dealer Meets",
    category: "Dealer Meet",
    description:
      "Plan dealer meets with stays, hospitality and coordinated arrangements.",
    href: "/events/dealer-meets",
    image: "/images/events/optimized/dealer-meets.webp",
  },
  {
    _id: "event-production",
    slug: "event-production",
    title: "Event Production",
    category: "Production",
    description:
      "Stage, sound, lighting, LED, branding and production support.",
    href: "/event-production",
    image: "/images/events/optimized/event-production1.webp",
  },
];

export default function AdminOrganisationEventsPage() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [toast, setToast] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  const fileInputRef = useRef(null);
  const [currentUploadId, setCurrentUploadId] = useState(null);

  // Fetch events from backend database (Port 5000)
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/events`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setEvents(data.data);
      }
    } catch (err) {
      console.warn("Using default event cards fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const triggerFileUpload = (eventId) => {
    setCurrentUploadId(eventId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Safe Cloudinary Upload to Port 5000
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadId) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingFor(currentUploadId);

      const res = await fetch(`${API_BASE}/api/events/upload`, {
        method: "POST",
        body: formData,
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error("Upload endpoint returned invalid response.");
      }

      if (res.ok && data.success && data.url) {
        await saveFieldUpdate(currentUploadId, { image: data.url });
        showToast("Image uploaded and saved successfully!");
      } else {
        showToast("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      showToast("Upload error: " + err.message);
    } finally {
      setUploadingFor(null);
    }
  };

  // Save updates to MongoDB
  const saveFieldUpdate = async (eventId, patchData) => {
    setEvents((prev) =>
      prev.map((item) =>
        item._id === eventId || item.slug === eventId
          ? { ...item, ...patchData }
          : item
      )
    );

    try {
      await fetch(`${API_BASE}/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#172033] font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-[#0B3B32] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 size={18} className="text-[#E0924F]" />
          <span>{toast}</span>
        </div>
      )}

      {/* TOP BREADCRUMB */}
      <div className="border-b border-[#172033]/10 bg-white/60 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-gray-500">
          <Link href="/admin" className="hover:text-[#B96928] transition">
            Admin
          </Link>
          <ChevronRight size={13} />
          <Link
            href="/admin/organisation"
            className="hover:text-[#B96928] transition"
          >
            Organisation
          </Link>
          <ChevronRight size={13} />
          <Link
            href="/admin/organisation/departments"
            className="hover:text-[#B96928] transition"
          >
            Departments
          </Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-[#0B3B32]">Events Management</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* BANNER HEADER */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0B3B32] p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E0924F] backdrop-blur">
                <Building2 size={13} />
                Events Department
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Events Department Management
              </h1>
              <p className="mt-1 text-xs text-white/80 sm:text-sm max-w-2xl">
                Manage, edit, publish, and update all corporate events, retreats, conferences, and event production services.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={fetchEvents}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh Data
              </button>

              <Link
                href="/events"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#9D5721]"
              >
                <Eye size={14} />
                View Public Page
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* EVENTS GRID */}
        <div className="mt-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-[#172033]">
              Active Event Categories ({events.length})
            </h2>
            <span className="text-xs text-gray-500">
              Click &quot;Upload Image&quot; to change cover photo or &quot;Edit Details&quot; to update content
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const isUploading =
                uploadingFor === event._id || uploadingFor === event.slug;

              return (
                <div
                  key={event.slug || event._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#172033]/[0.08] bg-white shadow-sm transition duration-300 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={event.image || "/images/placeholder.webp"}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                      unoptimized={
                        event.image?.startsWith("http") ||
                        event.image?.startsWith("blob:")
                      }
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      {event.category || "Event"}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-bold leading-tight">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
                      {event.description}
                    </p>

                    <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() =>
                            triggerFileUpload(event.slug || event._id)
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0B3B32] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#072922] disabled:opacity-50"
                        >
                          <UploadCloud
                            size={14}
                            className={isUploading ? "animate-bounce" : ""}
                          />
                          {isUploading ? "Uploading..." : "Upload Image"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newUrl = prompt(
                              `Enter Image URL for "${event.title}":`,
                              event.image
                            );
                            if (newUrl && newUrl.trim() !== "") {
                              saveFieldUpdate(event.slug || event._id, {
                                image: newUrl.trim(),
                              });
                              showToast("Image URL updated successfully!");
                            }
                          }}
                          title="Paste Image URL"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 hover:text-[#0B3B32]"
                        >
                          <LinkIcon size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingEvent(event)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-1.5 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        <Edit2 size={12} />
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#172033]">
                Edit Event Details
              </h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Event Title
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#B96928]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#B96928]"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveFieldUpdate(editingEvent.slug || editingEvent._id, {
                    title: editingEvent.title,
                    description: editingEvent.description,
                  });
                  setEditingEvent(null);
                  showToast("Event details saved successfully!");
                }}
                className="rounded-xl bg-[#0B3B32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#072922]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}