
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  CalendarCheck,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  BriefcaseBusiness,
  Users,
  UserRound,
  Package,
  Clock,
  RefreshCw,
  Building2,
  AlertCircle,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const COLORS = {
  orange: "#B96928",
  navy: "#243B53",
  teal: "#638B8A",
  gold: "#C7A56B",
  green: "#2F855A",
  red: "#C53030",
  gray: "#A6A6A6",
  pending: "#D69E2E",
};

const DEPARTMENT_COLORS = [
  COLORS.orange,
  COLORS.navy,
  COLORS.teal,
  COLORS.gold,
  COLORS.gray,
  "#805AD5",
  "#3182CE",
];

const RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "365d", label: "Last 12 months" },
];

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

function normalizeStatus(value) {
  const status = String(value || "").toLowerCase().trim();

  if (["confirmed", "approved", "complete", "completed"].includes(status)) {
    return "Confirmed";
  }

  if (["cancelled", "canceled", "rejected"].includes(status)) {
    return "Cancelled";
  }

  if (["pending", "requested", "processing"].includes(status)) {
    return "Pending";
  }

  return status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";
}

function normalizeDepartment(value) {
  const department = String(value || "").trim().toLowerCase();

  const names = {
    safari: "Safari",
    hotel: "Stay",
    stay: "Stay",
    resort: "Stay",
    resorts: "Stay",
    event: "Events",
    events: "Events",
    wedding: "Weddings",
    weddings: "Weddings",
    package: "Packages",
    packages: "Packages",
  };

  return names[department] ||
    (department
      ? department.charAt(0).toUpperCase() + department.slice(1)
      : "Unassigned");
}

function getBookingId(booking) {
  return (
    booking?.bookingReference ||
    booking?.reference ||
    booking?.bookingId ||
    booking?._id ||
    "—"
  );
}

function getCustomerName(booking) {
  return (
    booking?.name ||
    booking?.customerName ||
    booking?.fullName ||
    booking?.guestName ||
    "Customer name unavailable"
  );
}

function getBookingDate(booking) {
  return (
    booking?.checkIn ||
    booking?.date ||
    booking?.createdAt ||
    booking?.bookingDate ||
    null
  );
}

function getBookingService(booking) {
  return (
    booking?.serviceName ||
    booking?.packageName ||
    booking?.resortName ||
    booking?.safariType ||
    booking?.type ||
    "Booking"
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-[#172033] sm:text-base">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = COLORS.orange,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            {title}
          </p>

          <h3 className="mt-2 truncate text-xl font-bold text-[#172033] sm:text-2xl">
            {value}
          </h3>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${iconColor}15`,
            color: iconColor,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  const dots = {
    Confirmed: "bg-green-600",
    Pending: "bg-amber-500",
    Cancelled: "bg-red-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dots[status] || "bg-gray-500"
        }`}
      />
      {status}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}

export default function OrganisationDashboard() {
  const [range, setRange] = useState("30d");
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const fetchOverview = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("adminToken")
            : null;

        if (!token) {
  throw new Error(
    "Admin login session not found. Please log in again."
  );
}

        const response = await fetch(
          `${API_URL}/api/organisation/overview?range=${encodeURIComponent(
            range
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error("The backend did not return a valid JSON response.");
        }

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please log in to the admin panel again."
          );
        }

        if (response.status === 403) {
          throw new Error(
  "Access denied. Super Admin permission is required to access Organization Management."
);
        }

        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message || `Request failed (${response.status}).`
          );
        }

        if (!result?.data) {
  throw new Error("Overview data was not found in the backend response.");
}

setOverview(result.data);
} catch (err) {
  setError(
    err?.message ||
      "Failed to load the overview. Please check the backend connection."
  );

      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [range]
  );

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const summary = overview?.summary || {};

  const bookings = useMemo(() => {
    const rows = Array.isArray(overview?.recentBookings)
      ? overview.recentBookings
      : [];

    return rows.map((booking, index) => ({
      ...booking,
      id: getBookingId(booking),
      customer: getCustomerName(booking),
      service: getBookingService(booking),
      department: normalizeDepartment(booking?.group || booking?.type),
      date: getBookingDate(booking),
      status: normalizeStatus(booking?.status),
      rowKey: String(booking?._id || getBookingId(booking) || index),
    }));
  }, [overview]);

  const departments = useMemo(() => {
    const rows = Array.isArray(overview?.departmentDistribution)
      ? overview.departmentDistribution
      : [];

    return rows.map((department, index) => ({
      name: department?.name || "Unassigned",
      members: Number(department?.members) || 0,
      color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length],
    }));
  }, [overview]);

  const bookingTypes = useMemo(() => {
    const rows = Array.isArray(overview?.bookingsByType)
      ? overview.bookingsByType
      : [];

    return rows.map((item, index) => ({
      name: normalizeDepartment(item?.type),
      count: Number(item?.count) || 0,
      color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length],
    }));
  }, [overview]);

  const statusDistribution = useMemo(() => {
    const counts = {};

    bookings.forEach((booking) => {
      counts[booking.status] = (counts[booking.status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color:
        name === "Confirmed"
          ? COLORS.green
          : name === "Pending"
            ? COLORS.pending
            : name === "Cancelled"
              ? COLORS.red
              : COLORS.gray,
    }));
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch = [
        booking.id,
        booking.customer,
        booking.service,
        booking.department,
        booking.status,
        booking.email,
        booking.phone,
      ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        booking.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [bookings, search, statusFilter, departmentFilter]);

  const departmentOptions = useMemo(() => {
    return [
      ...new Set([
        ...departments.map((department) => department.name),
        ...bookings.map((booking) => booking.department),
      ]),
    ].filter(Boolean);
  }, [departments, bookings]);

  const exportBookings = () => {
    const headers = [
      "Booking ID",
      "Customer",
      "Email",
      "Phone",
      "Service",
      "Department",
      "Date",
      "Status",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.customer,
      booking.email || "",
      booking.phone || "",
      booking.service,
      booking.department,
      formatDate(booking.date),
      booking.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `destination-corbett-bookings-${range}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const hasOverview = Boolean(overview);

  const reportLabel =
    RANGE_OPTIONS.find((option) => option.value === range)?.label ||
    "Selected period";

  return (
    <main className="mx-auto min-w-0 max-w-[1600px] space-y-5 p-4 sm:p-6">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B96928]">
            Organisation
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            Organisation Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Live overview of bookings, departments, enquiries and team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <CalendarCheck size={15} className="text-[#B96928]" />

            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              aria-label="Select reporting period"
              className="max-w-[150px] bg-transparent text-xs font-semibold text-gray-700 outline-none"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchOverview({ silent: hasOverview })}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B96928] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#99551F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={refreshing || loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </section>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-semibold text-red-800">
                "Dashboard data failed to load."
              </p>
              <p className="mt-1 break-words text-xs text-red-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchOverview()}
            className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {/* Initial loading */}
      {loading && !hasOverview ? (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[120px] animate-pulse rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="h-3 w-28 rounded bg-gray-200" />
              <div className="mt-5 h-7 w-20 rounded bg-gray-200" />
              <div className="mt-3 h-3 w-36 rounded bg-gray-100" />
            </div>
          ))}
        </section>
      ) : hasOverview ? (
        <>
          {/* KPI cards */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Team Members"
              value={formatNumber(summary.totalMembers)}
              subtitle="Members across the organisation"
              icon={Users}
              iconColor={COLORS.orange}
            />

            <StatCard
              title="Total Bookings"
              value={formatNumber(summary.totalBookings)}
              subtitle={reportLabel}
              icon={CalendarCheck}
              iconColor={COLORS.navy}
            />

            <StatCard
              title="Confirmed Bookings"
              value={formatNumber(summary.confirmedBookings)}
              subtitle="Confirmed in the selected period"
              icon={CheckCircle2}
              iconColor={COLORS.green}
            />

            <StatCard
              title="Total Enquiries"
              value={formatNumber(summary.totalEnquiries)}
              subtitle={reportLabel}
              icon={Activity}
              iconColor={COLORS.teal}
            />
          </section>

          {/* Team and booking overview */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Team status */}
            <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle
                title="Team Overview"
                subtitle="Current member and department summary"
                action={
                  <Link
                    href="/admin/administration"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#B96928] hover:underline"
                  >
                    Manage team <ArrowUpRight size={14} />
                  </Link>
                }
              />

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#F7F5F0] p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-medium">Active members</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#172033]">
                    {formatNumber(summary.activeMembers)}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <UserRound size={16} />
                    <span className="text-xs font-medium">
                      Inactive members
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#172033]">
                    {formatNumber(summary.inactiveMembers)}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[#B96928]">
                    <Building2 size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Total departments
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#172033]">
                      {formatNumber(summary.totalDepartments)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="mt-1 text-lg font-bold text-green-700">
                    {formatNumber(summary.activeDepartments)}
                  </p>
                </div>
              </div>

              <SectionTitle
                title="Members by Department"
                subtitle="Member distribution from the backend"
              />

              {departments.length > 0 ? (
                <div className="space-y-4">
                  {departments.map((department) => {
                    const totalMembers =
                      Number(summary.totalMembers) || 0;

                    const percentage =
                      totalMembers > 0
                        ? Math.min(
                            100,
                            (department.members / totalMembers) * 100
                          )
                        : 0;

                    return (
                      <div key={department.name}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor: department.color,
                              }}
                            />
                            <span className="truncate text-xs font-semibold text-gray-700">
                              {department.name}
                            </span>
                          </div>

                          <span className="text-xs font-bold text-[#172033]">
                            {formatNumber(department.members)}
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: department.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="Department-wise member data available nahi hai." />
              )}
            </div>

            {/* Booking status */}
            <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle
                title="Booking Status"
                subtitle={`Booking counts for ${reportLabel.toLowerCase()}`}
              />

              <div className="mb-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[11px] text-gray-500">Pending</p>
                  <p className="mt-1 text-xl font-bold text-amber-600">
                    {formatNumber(summary.pendingBookings)}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[11px] text-gray-500">Confirmed</p>
                  <p className="mt-1 text-xl font-bold text-green-700">
                    {formatNumber(summary.confirmedBookings)}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[11px] text-gray-500">Cancelled</p>
                  <p className="mt-1 text-xl font-bold text-red-600">
                    {formatNumber(summary.cancelledBookings)}
                  </p>
                </div>
              </div>

              <SectionTitle
                title="Bookings by Type"
                subtitle="Breakdown returned by the overview API"
              />

              {bookingTypes.length > 0 ? (
                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[170px_minmax(0,1fr)]">
                  <div className="relative mx-auto h-[175px] w-full max-w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bookingTypes}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {bookingTypes.map((item) => (
                            <Cell
                              key={item.name}
                              fill={item.color}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(value) => [
                            formatNumber(value),
                            "Bookings",
                          ]}
                          contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #E5E7EB",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[#172033]">
                        {formatNumber(
                          bookingTypes.reduce(
                            (total, item) => total + item.count,
                            0
                          )
                        )}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        By type
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {bookingTypes.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="truncate text-xs font-medium text-gray-700">
                            {item.name}
                          </span>
                        </div>

                        <span className="text-sm font-bold text-[#172033]">
                          {formatNumber(item.count)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState message="Booking type breakdown available nahi hai." />
              )}

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                <Clock
                  size={15}
                  className="mt-0.5 shrink-0 text-[#B96928]"
                />
                <span>
                  "Counts are retrieved from the backend response. 
                   No estimated revenue or fabricated percentages are being used."
                </span>
              </div>
            </div>
          </section>

          {/* Recent bookings */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <SectionTitle
                  title="Recent Bookings"
                  subtitle="Latest booking records returned by the backend"
                  action={
                    <Link
                      href="/admin/enquiries"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#B96928] hover:underline"
                    >
                      View all <ArrowUpRight size={14} />
                    </Link>
                  }
                />
              </div>

              <button
                type="button"
                onClick={exportBookings}
                disabled={filteredBookings.length === 0}
                className="mb-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#B96928] hover:text-[#B96928] disabled:cursor-not-allowed disabled:opacity-50 sm:mb-4"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>

            {/* Search and filters */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search booking or customer..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#B96928] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(event.target.value)
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-[#B96928]"
                aria-label="Filter by department"
              >
                <option value="All">All Departments</option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-[#B96928]"
                aria-label="Filter by booking status"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50/70">
                    {[
                      "Booking ID",
                      "Customer",
                      "Service",
                      "Department",
                      "Date",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.rowKey}
                      className="border-b border-gray-100 transition hover:bg-gray-50/70"
                    >
                      <td className="whitespace-nowrap px-3 py-3.5 text-xs font-semibold text-[#B96928]">
                        {booking.id}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5">
                        <div className="text-xs font-semibold text-[#172033]">
                          {booking.customer}
                        </div>
                        {booking.email && (
                          <div className="mt-1 text-[10px] text-gray-500">
                            {booking.email}
                          </div>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-xs text-gray-600">
                        {booking.service}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                          {booking.department}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-xs text-gray-500">
                        {formatDate(booking.date)}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}

                  {filteredBookings.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-10 text-center text-sm text-gray-500"
                      >
                        {bookings.length === 0
  ? "No recent bookings found for the selected period."
  : "No bookings found. Please change your search or filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-col justify-between gap-2 text-xs text-gray-500 sm:flex-row sm:items-center">
              <span>
                Showing {formatNumber(filteredBookings.length)} of{" "}
                {formatNumber(bookings.length)} returned bookings
              </span>
              <span>{reportLabel}</span>
            </div>
          </section>

          {/* Department summary */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle
              title="Department Summary"
              subtitle="Member counts returned by the organisation overview API"
            />

            {departments.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {departments.map((department) => (
                  <div
                    key={department.name}
                    className="rounded-xl border border-gray-100 p-4 transition hover:border-gray-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: department.color,
                          }}
                        />
                        <h3 className="text-sm font-semibold text-[#172033]">
                          {department.name}
                        </h3>
                      </div>

                      <Package size={15} className="text-gray-400" />
                    </div>

                    <p className="mt-4 text-2xl font-bold text-[#172033]">
                      {formatNumber(department.members)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Assigned members
                    </p>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${
                            Number(summary.totalMembers) > 0
                              ? Math.min(
                                  100,
                                  (department.members /
                                    Number(summary.totalMembers)) *
                                    100
                                )
                              : 0
                          }%`,
                          backgroundColor: department.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Department summary available nahi hai." />
            )}
          </section>

          {/* Footer */}
          <footer className="flex flex-col justify-between gap-2 border-t border-gray-200 py-3 text-xs text-gray-500 sm:flex-row sm:items-center">
            <p>Destination Corbett · Organisation Overview</p>
            <p>Data source: Organisation Overview API</p>
          </footer>
        </>
      ) : !error ? (
        <EmptyState message="Overview data is not available." />
      ) : null}
    </main>
  );
}
