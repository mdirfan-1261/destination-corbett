
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const API_URL = `${API_BASE}/api`;

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Paid", value: "paid" },
];

function getAdminToken() {
  if (typeof window === "undefined") return "";

  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("destin_admin_token") ||
    ""
  );
}

async function apiRequest(path, options = {}) {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "Admin authentication token nahi mila. Dobara admin login karein."
    );
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Backend se valid response nahi mila.");
  }

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message || `Request failed (${response.status}).`
    );
  }

  return result;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

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

function formatBookingType(value) {
  if (!value) return "—";

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatStatus(status) {
  const labels = {
    pending: "Pending approval",
    approved: "Approved",
    rejected: "Rejected",
    paid: "Paid",
    cancelled: "Cancelled",
  };

  return labels[status] || status || "Unknown";
}

function getStatusClasses(status) {
  const styles = {
    pending: "bg-amber-50 text-amber-800 ring-amber-200",
    approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-800 ring-rose-200",
    paid: "bg-blue-50 text-blue-800 ring-blue-200",
    cancelled: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return styles[status] || "bg-slate-100 text-slate-700 ring-slate-200";
}

function StatCard({ title, value, description, icon: Icon, tone }) {
  const tones = {
    orange: "bg-orange-50 text-[#B96928]",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-[#E8E3D9] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-[#172033]">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            tones[tone] || tones.orange
          }`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function AdminCommissionApprovalsPage() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState("");
  const [rejectingCommission, setRejectingCommission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadCommissions = useCallback(async (isRefresh = false) => {
    setError("");
    setNotice("");

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await apiRequest("/commissions");
      const records = result?.data?.commissions;

      if (!Array.isArray(records)) {
        throw new Error("Backend response mein commission records nahi mile.");
      }

      setCommissions(records);
    } catch (err) {
      setError(err.message || "Commissions load nahi ho sake.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCommissions();
  }, [loadCommissions]);

  const summary = useMemo(() => {
    const amountFor = (status) =>
      commissions
        .filter((item) => item.status === status)
        .reduce(
          (sum, item) => sum + Number(item.totalCommission || 0),
          0
        );

    return {
      total: commissions.length,
      pendingCount: commissions.filter(
        (item) => item.status === "pending"
      ).length,
      pendingAmount: amountFor("pending"),
      approvedAmount: amountFor("approved"),
      paidAmount: amountFor("paid"),
      rejectedCount: commissions.filter(
        (item) => item.status === "rejected"
      ).length,
    };
  }, [commissions]);

  const visibleCommissions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return commissions.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;

      if (!term) return true;

      const agent = item.agentId || {};

      const searchable = [
        item.bookingReference,
        item.bookingType,
        item.status,
        agent.name,
        agent.email,
        agent.businessName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [commissions, filter, search]);

  async function handleApprove(commission) {
    const commissionId = commission?._id;

    if (!commissionId || actionId) return;

    const confirmed = window.confirm(
      `Approve ${formatMoney(commission.totalCommission)} commission for ${
        commission.agentId?.name || "this agent"
      }?\n\nBooking: ${commission.bookingReference || "—"}`
    );

    if (!confirmed) return;

    setActionId(commissionId);
    setError("");
    setNotice("");

    try {
      const result = await apiRequest(
        `/commissions/${commissionId}/approve`,
        { method: "PATCH" }
      );

      const updatedCommission = result?.data?.commission;

      setCommissions((current) =>
        current.map((item) =>
          item._id === commissionId
            ? updatedCommission || { ...item, status: "approved" }
            : item
        )
      );

      setNotice(result?.message || "Commission approved successfully.");
    } catch (err) {
      setError(err.message || "Commission approve nahi ho saki.");
      await loadCommissions(true);
    } finally {
      setActionId("");
    }
  }

  function openRejectDialog(commission) {
    setRejectingCommission(commission);
    setRejectionReason("");
    setError("");
    setNotice("");
  }

  async function handleReject(event) {
    event.preventDefault();

    const commissionId = rejectingCommission?._id;
    const reason = rejectionReason.trim();

    if (!commissionId || actionId) return;

    if (!reason) {
      setError("Commission reject karne ke liye reason zaroori hai.");
      return;
    }

    if (reason.length > 1000) {
      setError("Reason 1000 characters se zyada nahi ho sakta.");
      return;
    }

    setActionId(commissionId);
    setError("");
    setNotice("");

    try {
      const result = await apiRequest(
        `/commissions/${commissionId}/reject`,
        {
          method: "PATCH",
          body: JSON.stringify({ reason }),
        }
      );

      const updatedCommission = result?.data?.commission;

      setCommissions((current) =>
        current.map((item) =>
          item._id === commissionId
            ? updatedCommission || {
                ...item,
                status: "rejected",
                rejectionReason: reason,
              }
            : item
        )
      );

      setRejectingCommission(null);
      setRejectionReason("");
      setNotice(result?.message || "Commission rejected successfully.");
    } catch (err) {
      setError(err.message || "Commission reject nahi ho saki.");
      await loadCommissions(true);
    } finally {
      setActionId("");
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B96928]">
              <ShieldCheck size={15} />
              Agent Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Commission Approvals
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review agent commissions and approve or reject pending records.
              Approval does not mark a commission as paid.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadCommissions(true)}
            disabled={loading || refreshing || Boolean(actionId)}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-[#DCD5C8] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] transition hover:bg-[#FAF8F4] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Pending approvals"
            value={summary.pendingCount}
            description={`${formatMoney(summary.pendingAmount)} awaiting review`}
            icon={Clock3}
            tone="orange"
          />

          <StatCard
            title="Approved commission"
            value={formatMoney(summary.approvedAmount)}
            description="Approved, not necessarily paid"
            icon={CheckCircle2}
            tone="green"
          />

          <StatCard
            title="Commission paid"
            value={formatMoney(summary.paidAmount)}
            description="Records with paid status"
            icon={Wallet}
            tone="blue"
          />

          <StatCard
            title="Rejected records"
            value={summary.rejectedCount}
            description={`${summary.total} total commission records`}
            icon={XCircle}
            tone="red"
          />
        </div>

        {/* Notifications */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 rounded-lg p-1 hover:bg-rose-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">{notice}</div>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
              className="shrink-0 rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Table section */}
        <section className="overflow-hidden rounded-2xl border border-[#E8E3D9] bg-white shadow-sm">
          <div className="border-b border-[#EEE9E0] p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#172033]">
                  Commission records
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {visibleCommissions.length} record
                  {visibleCommissions.length === 1 ? "" : "s"} shown
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search agent or booking..."
                  className="min-h-11 w-full rounded-xl border border-[#E3DED4] bg-[#FCFBF9] py-2.5 pl-10 pr-3 text-sm text-[#172033] outline-none transition placeholder:text-slate-400 focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((item) => {
                const active = filter === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[#18352A] text-white"
                        : "border border-[#E8E3D9] bg-white text-slate-600 hover:bg-[#F8F6F1]"
                    }`}
                  >
                    {item.label}
                    {item.value === "pending" && (
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {summary.pendingCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <RefreshCw size={26} className="animate-spin text-[#B96928]" />
              <p className="mt-4 text-sm font-semibold text-[#172033]">
                Loading commission records...
              </p>
            </div>
          ) : commissions.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5F0] text-slate-500">
                <Activity size={25} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#172033]">
                No commission records yet
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Commissions generated for eligible agent bookings will appear
                here.
              </p>
            </div>
          ) : visibleCommissions.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
              <Search size={25} className="text-slate-400" />
              <h3 className="mt-3 text-base font-bold text-[#172033]">
                No matching records
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Search text ya status filter change karke dekhein.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-4 text-sm font-bold text-[#B96928] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="bg-[#FAF8F4]">
                    <tr className="border-b border-[#EEE9E0] text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-4 font-semibold">Agent</th>
                      <th className="px-5 py-4 font-semibold">Booking</th>
                      <th className="px-5 py-4 font-semibold">Booking amount</th>
                      <th className="px-5 py-4 font-semibold">Commission</th>
                      <th className="px-5 py-4 font-semibold">Created</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0ECE5]">
                    {visibleCommissions.map((item) => {
                      const agent = item.agentId || {};
                      const isBusy = actionId === item._id;

                      return (
                        <tr key={item._id} className="align-top hover:bg-[#FCFBF9]">
                          <td className="px-5 py-5">
                            <p className="font-semibold text-[#172033]">
                              {agent.name || agent.businessName || "Unknown agent"}
                            </p>
                            {agent.businessName && agent.name && (
                              <p className="mt-1 text-xs text-slate-500">
                                {agent.businessName}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-slate-500">
                              {agent.email || "No email available"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-semibold text-[#172033]">
                              {item.bookingReference || "—"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatBookingType(item.bookingType)}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-semibold text-[#172033]">
                              {formatMoney(item.bookingAmount)}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-bold text-[#18352A]">
                              {formatMoney(item.totalCommission)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.commissionType === "percentage"
                                ? `${Number(item.percentageRate || 0)}% rate`
                                : item.commissionType === "fixed"
                                  ? "Fixed commission"
                                  : item.commissionType === "both"
                                    ? `${Number(item.percentageRate || 0)}% + fixed`
                                    : "Commission"}
                            </p>
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-600">
                            {formatDate(item.createdAt)}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {formatStatus(item.status)}
                            </span>
                            {item.status === "rejected" && item.rejectionReason && (
                              <p
                                className="mt-2 max-w-48 text-xs leading-5 text-rose-700"
                                title={item.rejectionReason}
                              >
                                Reason: {item.rejectionReason}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-5">
                            {item.status === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  disabled={Boolean(actionId)}
                                  onClick={() => handleApprove(item)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#18352A] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#244A3B] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isBusy ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                  ) : (
                                    <Check size={14} />
                                  )}
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  disabled={Boolean(actionId)}
                                  onClick={() => openRejectDialog(item)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <p className="text-right text-xs text-slate-400">
                                No action available
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet cards */}
              <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 lg:hidden">
                {visibleCommissions.map((item) => {
                  const agent = item.agentId || {};
                  const isBusy = actionId === item._id;

                  return (
                    <article
                      key={item._id}
                      className="rounded-xl border border-[#E8E3D9] bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-words font-bold text-[#172033]">
                            {agent.name || agent.businessName || "Unknown agent"}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {agent.email || "No email available"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {formatStatus(item.status)}
                        </span>
                      </div>

                      <div className="mt-4 rounded-xl bg-[#F8F6F1] p-3">
                        <p className="break-all text-sm font-bold text-[#172033]">
                          {item.bookingReference || "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatBookingType(item.bookingType)} ·{" "}
                          {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500">Booking amount</p>
                          <p className="mt-1 font-semibold text-[#172033]">
                            {formatMoney(item.bookingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Commission</p>
                          <p className="mt-1 text-lg font-bold text-[#18352A]">
                            {formatMoney(item.totalCommission)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.commissionType === "percentage"
                              ? `${Number(item.percentageRate || 0)}% rate`
                              : item.commissionType === "fixed"
                                ? "Fixed commission"
                                : `${Number(item.percentageRate || 0)}% + fixed`}
                          </p>
                        </div>
                      </div>

                      {item.status === "rejected" && item.rejectionReason && (
                        <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs leading-5 text-rose-800">
                          <strong>Rejection reason:</strong>{" "}
                          {item.rejectionReason}
                        </div>
                      )}

                      {item.status === "pending" && (
                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#EEE9E0] pt-4">
                          <button
                            type="button"
                            disabled={Boolean(actionId)}
                            onClick={() => handleApprove(item)}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#18352A] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#244A3B] disabled:opacity-50"
                          >
                            {isBusy ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={Boolean(actionId)}
                            onClick={() => openRejectDialog(item)}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <div className="mt-4 flex items-start gap-2 px-1 text-xs leading-5 text-slate-500">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p>
            Commission figures are read from backend records. Approving a
            commission changes its status to Approved; it does not process
            payment or mark it as Paid.
          </p>
        </div>
      </div>

      {/* Reject confirmation dialog */}
      {rejectingCommission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !actionId
            ) {
              setRejectingCommission(null);
              setRejectionReason("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-commission-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-[#E8E3D9] bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                  <XCircle size={22} />
                </div>
                <div>
                  <h2
                    id="reject-commission-title"
                    className="text-lg font-bold text-[#172033]"
                  >
                    Reject commission
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add a reason for the rejection.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={Boolean(actionId)}
                onClick={() => {
                  setRejectingCommission(null);
                  setRejectionReason("");
                  setError("");
                }}
                aria-label="Close rejection dialog"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-[#F8F6F1] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Booking reference
              </p>
              <p className="mt-1 break-all text-sm font-bold text-[#172033]">
                {rejectingCommission.bookingReference || "—"}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600">
                  {rejectingCommission.agentId?.name || "Unknown agent"}
                </span>
                <span className="shrink-0 font-bold text-[#172033]">
                  {formatMoney(rejectingCommission.totalCommission)}
                </span>
              </div>
            </div>

            <form onSubmit={handleReject} className="mt-5">
              <label
                htmlFor="rejection-reason"
                className="mb-2 block text-sm font-semibold text-[#172033]"
              >
                Rejection reason <span className="text-rose-600">*</span>
              </label>

              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Explain why this commission is being rejected..."
                rows={4}
                maxLength={1000}
                required
                autoFocus
                className="w-full resize-y rounded-xl border border-[#E3DED4] bg-white p-3 text-sm text-[#172033] outline-none placeholder:text-slate-400 focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>Required before rejection</span>
                <span>{rejectionReason.length}/1000</span>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={Boolean(actionId)}
                  onClick={() => {
                    setRejectingCommission(null);
                    setRejectionReason("");
                    setError("");
                  }}
                  className="min-h-11 rounded-xl border border-[#E3DED4] px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={Boolean(actionId) || !rejectionReason.trim()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionId ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Confirm rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
