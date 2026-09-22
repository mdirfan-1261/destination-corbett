"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Trees,
  CalendarDays,
  Clock3,
  ArrowUpRight,
  MapPin,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  // Dynamic dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // FETCH DASHBOARD FUNCTION (REUSABLE FOR SYNC)
  const fetchDashboard = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setSyncing(true);

    try {
      // GET ENQUIRY STATS
      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statsData = await statsResponse.json().catch(() => ({}));

      // GET ALL ENQUIRIES
      const enquiriesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const enquiriesData = await enquiriesResponse.json().catch(() => ({}));

      setDashboardData({
        stats: statsData.stats,
        recentEnquiries: enquiriesData.enquiries || [],
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [router]);

  /* Dynamic enquiries - TOP 5 RECENT ONLY */
  const enquiries = (dashboardData?.recentEnquiries || []).slice(0, 5);

  /* Dynamic stats */
  const stats = [
    {
      title: "Total Enquiries",
      value: dashboardData?.stats?.total ?? 0,
      change: "Live",
      icon: Mail,
    },
    {
      title: "Pending",
      value: dashboardData?.stats?.pending ?? 0,
      change: "Live",
      icon: Clock3,
    },
    {
      title: "Contacted",
      value: dashboardData?.stats?.contacted ?? 0,
      change: "Live",
      icon: Mail,
    },
    {
      title: "Confirmed",
      value: dashboardData?.stats?.confirmed ?? 0,
      change: "Live",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-w-0 bg-[#F8FAFC]">
      {/* COMPACT CONTAINER */}
      <div className="mx-auto max-w-[1200px] px-3 py-3 sm:px-4 lg:px-5 lg:py-4">

        {/* Mobile title */}
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
              Corbett Dashboard
            </p>
            <h2 className="mt-0.5 text-base font-bold text-[#1E293B]">
              Overview
            </h2>
          </div>

          {/* Mobile Sync Button */}
          <button
            type="button"
            onClick={fetchDashboard}
            disabled={syncing}
            className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-semibold text-[#1E293B] shadow-xs active:scale-95"
          >
            <RefreshCw size={13} className={`text-[#315D42] ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync"}</span>
          </button>
        </div>

        {/* ================= COMPACT HERO WITH SYNC BUTTON ================= */}
        <div className="relative mb-3 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white/70 bg-cover bg-center p-3.5 shadow-xs sm:mb-4 sm:p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E8F1EB]/95 via-[#F1F6F3]/90 to-[#FFF7EC]/80" />
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#789262]/20 blur-2xl" />
          <div className="absolute -bottom-16 right-16 h-28 w-28 rounded-full bg-[#C87532]/15 blur-2xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[#315D42]">
                <Trees size={14} />
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#315D42]">Overview</span>
              </div>

              <h2 className="max-w-xl text-base font-bold tracking-tight text-[#1E293B] sm:text-lg lg:text-xl">
                Welcome to your
                <span className="text-[#B96F2D]"> Corbett Dashboard</span>
              </h2>

              <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-[#64748B]">
                Manage safari enquiries, stays, events and guest experiences from one place.
              </p>
            </div>

            {/* DESKTOP SYNC BUTTON */}
            <button
              type="button"
              onClick={fetchDashboard}
              disabled={syncing}
              className="hidden sm:flex items-center gap-1.5 shrink-0 rounded-lg border border-[#315D42]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#315D42] shadow-xs hover:bg-[#EEF3EC] transition active:scale-95 disabled:opacity-60"
              title="Sync Latest Data"
            >
              <RefreshCw size={14} className={`text-[#315D42] ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Data"}</span>
            </button>
          </div>
        </div>

        {/* ================= COMPACT STATS ================= */}
        <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 md:grid-cols-4 md:gap-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-xl border border-[#E2E8F0] bg-white/80 p-2.5 shadow-xs backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF3EC] text-[#315D42]">
                    <Icon size={14} />
                  </div>

                  <span className="flex items-center gap-0.5 text-[9.5px] font-semibold text-[#56703D]">
                    <ArrowUpRight size={11} />
                    {item.change}
                  </span>
                </div>

                <p className="mt-2 text-base font-bold text-[#1E293B] sm:text-xl">
                  {loading ? "..." : item.value}
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-[#64748B]">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= COMPACT CHART AREA ================= */}
        <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">

          {/* LINE GRAPH */}
          <div className="min-w-0 rounded-xl border border-[#E2E8F0] bg-white/80 p-3 shadow-xs backdrop-blur-xl sm:p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                  Enquiries
                </p>

                <h3 className="mt-0.5 text-xs font-bold text-[#1E293B] sm:text-sm">
                  Enquiries Overview
                </h3>
              </div>

              <div className="rounded-lg bg-[#EEF3EC] px-2 py-0.5 text-[9.5px] font-semibold text-[#315D42]">
                Last 6 Months
              </div>
            </div>

            <div className="relative h-32 sm:h-36">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1, 2, 3, 4, 5].map((line) => (
                  <div
                    key={line}
                    className="border-t border-dashed border-[#E2E8F0]"
                  />
                ))}
              </div>

              <svg
                viewBox="0 0 600 250"
                className="absolute inset-0 h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="forestGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#315D42"
                      stopOpacity="0.18"
                    />
                    <stop
                      offset="100%"
                      stopColor="#315D42"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 205 L100 170 L200 185 L300 115 L400 135 L500 72 L600 35 L600 250 L0 250 Z"
                  fill="url(#forestGradient)"
                />

                <polyline
                  points="0,205 100,170 200,185 300,115 400,135 500,72 600,35"
                  fill="none"
                  stroke="#315D42"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {[
                  [0, 205],
                  [100, 170],
                  [200, 185],
                  [300, 115],
                  [400, 135],
                  [500, 72],
                  [600, 35],
                ].map(([x, y], index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#C87532"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
            </div>

            <div className="mt-2 grid grid-cols-7 text-center text-[9px] font-semibold text-[#94A3B8]">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>

          {/* DONUT GRAPH */}
          <div className="min-w-0 rounded-xl border border-[#E2E8F0] bg-white/80 p-3 shadow-xs backdrop-blur-xl sm:p-4">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Enquiry Mix
              </p>

              <h3 className="mt-0.5 text-xs font-bold text-[#1E293B] sm:text-sm">
                Enquiry Types
              </h3>
            </div>

            <div className="mt-2 flex flex-col items-center">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      "conic-gradient(#315D42 0deg 180deg, #C87532 180deg 298deg, #789262 298deg 360deg)",
                  }}
                />

                <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-[#F8FAFC] sm:inset-3">
                  <span className="text-base font-bold text-[#1E293B] sm:text-lg">
                    {loading
                      ? "..."
                      : dashboardData?.stats?.total ?? 0}
                  </span>

                  <span className="text-[9px] text-[#64748B]">
                    Enquiries
                  </span>
                </div>
              </div>

              <div className="mt-3 w-full space-y-1.5">
                <Legend
                  color="#315D42"
                  title="Pending"
                  value={dashboardData?.stats?.pending ?? 0}
                  percentage=""
                />

                <Legend
                  color="#C87532"
                  title="Contacted"
                  value={dashboardData?.stats?.contacted ?? 0}
                  percentage=""
                />

                <Legend
                  color="#789262"
                  title="Confirmed"
                  value={dashboardData?.stats?.confirmed ?? 0}
                  percentage=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= COMPACT RECENT ENQUIRIES (TOP 5 ONLY) ================= */}
        <div className="mt-3 rounded-xl border border-[#E2E8F0] bg-white/80 p-3 shadow-xs backdrop-blur-xl sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Guest Requests
              </p>

              <h3 className="mt-0.5 text-xs font-bold text-[#1E293B] sm:text-sm">
                Recent Enquiries (Top 5)
              </h3>
            </div>

            <button
              onClick={() => router.push("/admin/enquiries")}
              className="shrink-0 rounded-lg bg-[#315D42] px-2.5 py-1 text-[9.5px] font-bold text-white transition hover:bg-[#244B34]"
            >
              View All
            </button>
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto rounded-lg border border-[#E2E8F0] md:block">
            <div className="grid min-w-[500px] grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr] bg-[#F1F5F9] px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-wide text-[#64748B]">
              <span>Guest</span>
              <span>Type</span>
              <span>Location</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {loading ? (
              <div className="px-3 py-5 text-center text-xs text-[#64748B]">
                Loading enquiries...
              </div>
            ) : enquiries.length === 0 ? (
              <div className="px-3 py-5 text-center text-xs text-[#64748B]">
                No enquiries found.
              </div>
            ) : (
              enquiries.map((item) => (
                <div
                  key={item._id}
                  className="grid min-w-[500px] grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr] items-center border-t border-[#E8EDF2] px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-[#1E293B]">
                    {item.name}
                  </span>

                  <span className="text-[#64748B]">
                    {item.hotel ? "Hotel" : "Enquiry"}
                  </span>

                  <span className="flex items-center gap-1 text-[#64748B]">
                    <MapPin size={11} />
                    {item.hotel || "Jim Corbett"}
                  </span>

                  <span className="flex items-center gap-1 text-[#64748B]">
                    <Clock3 size={11} />
                    {formatDate(item.createdAt)}
                  </span>

                  <Status status={formatStatus(item.status)} />
                </div>
              ))
            )}
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {loading ? (
              <div className="py-5 text-center text-xs text-[#64748B]">
                Loading enquiries...
              </div>
            ) : enquiries.length === 0 ? (
              <div className="py-5 text-center text-xs text-[#64748B]">
                No enquiries found.
              </div>
            ) : (
              enquiries.map((item) => (
                <div
                  key={item._id}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#1E293B]">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-[9.5px] text-[#64748B]">
                        {item.hotel ? "Hotel" : "Enquiry"}
                      </p>
                    </div>

                    <Status status={formatStatus(item.status)} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-[9.5px] text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} />
                      {item.hotel || "Jim Corbett"}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={10} />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= LEGEND ================= */

function Legend({ color, title, value, percentage }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium text-[#1E293B]">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-[#1E293B]">
          {value}
        </span>

        {percentage && (
          <span className="text-[9.5px] text-[#94A3B8]">
            {percentage}
          </span>
        )}
      </div>
    </div>
  );
}

/* ================= STATUS ================= */

function Status({ status }) {
  const styles = {
    New: "bg-[#E8F2E5] text-[#416334]",
    Pending: "bg-[#FFF3DD] text-[#946323]",
    Contacted: "bg-[#EEF2ED] text-[#53634A]",
    Confirmed: "bg-[#E4F1E6] text-[#35613B]",
    Cancelled: "bg-[#F9E5E5] text-[#8A3D3D]",
  };

  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ================= HELPERS ================= */

function formatStatus(status) {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}