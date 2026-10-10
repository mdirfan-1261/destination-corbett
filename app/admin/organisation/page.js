"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  CalendarCheck,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  BriefcaseBusiness,
  Users,
  UserRound,
  Package,
  Clock,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { date: "Sep 10", revenue: 14500 },
  { date: "Sep 12", revenue: 18000 },
  { date: "Sep 14", revenue: 16200 },
  { date: "Sep 16", revenue: 22400 },
  { date: "Sep 18", revenue: 19800 },
  { date: "Sep 20", revenue: 25800 },
  { date: "Sep 22", revenue: 23000 },
  { date: "Sep 24", revenue: 29200 },
  { date: "Sep 26", revenue: 24600 },
  { date: "Sep 28", revenue: 31800 },
  { date: "Sep 30", revenue: 27400 },
  { date: "Oct 02", revenue: 35600 },
  { date: "Oct 04", revenue: 31000 },
  { date: "Oct 06", revenue: 38500 },
  { date: "Oct 09", revenue: 286400 },
];

const departments = [
  {
    name: "Safari",
    bookings: 38,
    revenue: 105000,
    percentage: 36.7,
    color: "#B96928",
  },
  {
    name: "Stay",
    bookings: 34,
    revenue: 92000,
    percentage: 32.1,
    color: "#243B53",
  },
  {
    name: "Events",
    bookings: 16,
    revenue: 48400,
    percentage: 16.9,
    color: "#638B8A",
  },
  {
    name: "Weddings",
    bookings: 8,
    revenue: 28000,
    percentage: 9.8,
    color: "#C7A56B",
  },
  {
    name: "Packages",
    bookings: 12,
    revenue: 13000,
    percentage: 4.5,
    color: "#A6A6A6",
  },
];

const initialBookings = [
  {
    id: "DC-1048",
    customer: "Aarav Sharma",
    service: "Jeep Safari",
    department: "Safari",
    date: "09 Oct 2026",
    amount: 5500,
    status: "Confirmed",
  },
  {
    id: "DC-1047",
    customer: "Priya Verma",
    service: "Nature Retreat",
    department: "Stay",
    date: "10 Oct 2026",
    amount: 7497,
    status: "Pending",
  },
  {
    id: "DC-1046",
    customer: "Rohan Mehta",
    service: "Corporate Event",
    department: "Events",
    date: "11 Oct 2026",
    amount: 24000,
    status: "Confirmed",
  },
  {
    id: "DC-1045",
    customer: "Ananya Singh",
    service: "Wedding Enquiry",
    department: "Weddings",
    date: "12 Oct 2026",
    amount: 18000,
    status: "Pending",
  },
  {
    id: "DC-1044",
    customer: "Kabir Malhotra",
    service: "Family Package",
    department: "Packages",
    date: "13 Oct 2026",
    amount: 12999,
    status: "Confirmed",
  },
  {
    id: "DC-1043",
    customer: "Meera Gupta",
    service: "Canter Safari",
    department: "Safari",
    date: "14 Oct 2026",
    amount: 3000,
    status: "Pending",
  },
];

const roleDistribution = [
  {
    name: "Super Admin",
    count: 1,
    color: "#B96928",
    icon: ShieldCheck,
  },
  {
    name: "Admin",
    count: 5,
    color: "#243B53",
    icon: BriefcaseBusiness,
  },
  {
    name: "Manager",
    count: 8,
    color: "#638B8A",
    icon: Users,
  },
  {
    name: "Staff",
    count: 18,
    color: "#C7A56B",
    icon: UserRound,
  },
];

const statusDistribution = [
  { name: "Confirmed", value: 3, color: "#2F855A" },
  { name: "Pending", value: 3, color: "#D69E2E" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

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
  trend,
  trendLabel,
  iconColor = "#B96928",
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
          style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        {trend === "up" ? (
          <TrendingUp size={14} className="text-green-600" />
        ) : trend === "down" ? (
          <TrendingDown size={14} className="text-red-500" />
        ) : null}

        {trendLabel && (
          <span
            className={
              trend === "down"
                ? "font-semibold text-red-500"
                : "font-semibold text-green-600"
            }
          >
            {trendLabel}
          </span>
        )}

        <span className="text-gray-500">{subtitle}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const confirmed = status === "Confirmed";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        confirmed
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          confirmed ? "bg-green-600" : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

export default function OrganisationDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const filteredBookings = initialBookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.id.toLowerCase().includes(searchText) ||
      booking.customer.toLowerCase().includes(searchText) ||
      booking.service.toLowerCase().includes(searchText) ||
      booking.department.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "All" ||
      booking.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const exportBookings = () => {
    const headers = [
      "Booking ID",
      "Customer",
      "Service",
      "Department",
      "Date",
      "Amount",
      "Status",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.customer,
      booking.service,
      booking.department,
      booking.date,
      booking.amount,
      booking.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "destination-corbett-bookings.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto min-w-0 max-w-[1600px] space-y-5 p-4 sm:p-6">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B96928]">
            Organisation
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            Organisation Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of revenue, bookings, departments and team.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 sm:self-auto">
          <CalendarCheck size={15} className="text-[#B96928]" />
          <span>October 2026</span>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(286400)}
          subtitle="vs previous period"
          icon={IndianRupee}
          trend="up"
          trendLabel="+12.8%"
          iconColor="#B96928"
        />

        <StatCard
          title="Total Bookings"
          value="108"
          subtitle="across all departments"
          icon={CalendarCheck}
          trend="up"
          trendLabel="+8.4%"
          iconColor="#243B53"
        />

        <StatCard
          title="Confirmed Bookings"
          value="3 / 6"
          subtitle="in recent bookings"
          icon={CheckCircle2}
          trend="up"
          trendLabel="50%"
          iconColor="#2F855A"
        />

        <StatCard
          title="Average Booking Value"
          value={formatCurrency(2652)}
          subtitle="per booking"
          icon={IndianRupee}
          trend="down"
          trendLabel="-2.1%"
          iconColor="#638B8A"
        />
      </section>

      {/* Revenue and department performance */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue chart */}
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionTitle
            title="Revenue Performance"
            subtitle="Revenue trend across the selected period"
            action={
              <span className="shrink-0 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-[#B96928]">
                Oct 2026
              </span>
            }
          />

          <div className="h-[190px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#B96928"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="#B96928"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#EEF0F3"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#8A8F98" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />

                <YAxis
                  tick={{ fontSize: 10, fill: "#8A8F98" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `₹${Math.round(value / 1000)}k`
                      : `₹${value}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                    fontSize: "12px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B96928"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 4, fill: "#B96928" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
            <TrendingUp size={14} className="text-green-600" />
            Revenue overview for the selected reporting period
          </div>
        </div>

        {/* Department performance */}
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionTitle
            title="Department Performance"
            subtitle="Revenue contribution by department"
            action={
              <span className="shrink-0 text-xs font-semibold text-gray-500">
                5 departments
              </span>
            }
          />

          <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
            <div className="relative mx-auto h-[150px] w-full max-w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departments}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={43}
                    outerRadius={65}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {departments.map((department) => (
                      <Cell
                        key={department.name}
                        fill={department.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Revenue",
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
                <span className="text-[10px] text-gray-500">Total</span>
                <span className="text-sm font-bold text-[#172033]">
                  ₹2.86L
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {departments.map((department) => (
                <div key={department.name}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: department.color }}
                      />
                      <span className="truncate text-xs font-semibold text-gray-700">
                        {department.name}
                      </span>
                    </div>

                    <span className="shrink-0 text-xs font-semibold text-[#172033]">
                      {department.percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${department.percentage}%`,
                        backgroundColor: department.color,
                      }}
                    />
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-gray-500">
                    <span>{department.bookings} bookings</span>
                    <span>{formatCurrency(department.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent bookings */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <SectionTitle
            title="Recent Bookings"
            subtitle="Latest booking activity across departments"
            action={
              <Link
                href="/admin/enquiries"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#B96928] hover:underline"
              >
                View all
                <ArrowUpRight size={14} />
              </Link>
            }
          />

          <button
            type="button"
            onClick={exportBookings}
            className="mb-4 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#B96928] hover:text-[#B96928] sm:mb-4"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-1">
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
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-[#B96928]"
          >
            <option value="All">All Departments</option>
            <option value="Safari">Safari</option>
            <option value="Stay">Stay</option>
            <option value="Events">Events</option>
            <option value="Weddings">Weddings</option>
            <option value="Packages">Packages</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-[#B96928]"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Responsive table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-y border-gray-100 bg-gray-50/70">
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Booking ID
                </th>
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Service
                </th>
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Department
                </th>
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 transition hover:bg-gray-50/70"
                >
                  <td className="whitespace-nowrap px-3 py-3.5 text-xs font-semibold text-[#B96928]">
                    {booking.id}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <span className="text-xs font-semibold text-[#172033]">
                      {booking.customer}
                    </span>
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
                    {booking.date}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5 text-xs font-semibold text-[#172033]">
                    {formatCurrency(booking.amount)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm text-gray-500"
                  >
                    No bookings found. Try changing the search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-col justify-between gap-2 text-xs text-gray-500 sm:flex-row sm:items-center">
          <span>
            Showing {filteredBookings.length} of {initialBookings.length} recent
            bookings
          </span>
          <span>Sample dashboard data</span>
        </div>
      </section>

      {/* Team and booking status */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Role distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionTitle
            title="Team & Role Distribution"
            subtitle="Users distributed across organisation roles"
            action={
              <Link
                href="/admin/administration"
                className="text-xs font-semibold text-[#B96928] hover:underline"
              >
                Manage team
              </Link>
            }
          />

          <div className="mb-5 flex items-center gap-3 rounded-lg bg-[#F7F5F0] p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#B96928] shadow-sm">
              <Users size={21} />
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Team Members</p>
              <p className="text-xl font-bold text-[#172033]">32</p>
            </div>

            <div className="ml-auto text-right">
              <p className="text-xs font-semibold text-green-600">
                Active team
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                Across all roles
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {roleDistribution.map((role) => {
              const RoleIcon = role.icon;

              return (
                <div key={role.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <RoleIcon
                        size={15}
                        style={{ color: role.color }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {role.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#172033]">
                      {role.count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(role.count / 32) * 100}%`,
                        backgroundColor: role.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking status */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionTitle
            title="Booking Status"
            subtitle="Status breakdown of recent bookings"
          />

          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <div className="relative mx-auto h-[190px] w-full max-w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={53}
                    outerRadius={78}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {statusDistribution.map((status) => (
                      <Cell
                        key={status.name}
                        fill={status.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [value, "Bookings"]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#172033]">6</span>
                <span className="text-[10px] text-gray-500">Recent</span>
              </div>
            </div>

            <div className="space-y-3">
              {statusDistribution.map((status) => (
                <div
                  key={status.name}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-xs font-medium text-gray-600">
                        {status.name}
                      </span>
                    </div>

                    <span className="text-lg font-bold text-[#172033]">
                      {status.value}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(status.value / 6) * 100}%`,
                        backgroundColor: status.color,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-[10px] text-gray-500">
                    {Math.round((status.value / 6) * 100)}% of recent bookings
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            <Clock size={15} className="shrink-0 text-[#B96928]" />
            Status summary is based on the six sample bookings shown above.
          </div>
        </div>
      </section>

      {/* Department summary */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <SectionTitle
          title="Department Summary"
          subtitle="Bookings and revenue contribution by department"
        />

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
                    style={{ backgroundColor: department.color }}
                  />
                  <h3 className="text-sm font-semibold text-[#172033]">
                    {department.name}
                  </h3>
                </div>

                <Package size={15} className="text-gray-400" />
              </div>

              <p className="mt-4 text-lg font-bold text-[#172033]">
                {formatCurrency(department.revenue)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {department.bookings} bookings
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${department.percentage}%`,
                    backgroundColor: department.color,
                  }}
                />
              </div>

              <p className="mt-2 text-[11px] font-semibold text-gray-500">
                {department.percentage}% of total revenue
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col justify-between gap-2 border-t border-gray-200 py-3 text-xs text-gray-500 sm:flex-row sm:items-center">
        <p>Destination Corbett · Organisation Overview</p>
        <p>Dashboard data shown for UI demonstration</p>
      </footer>
    </main>
  );
}