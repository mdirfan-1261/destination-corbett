
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Wallet,
  AlertCircle,
  ReceiptText,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "").replace(/\/api$/, "");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
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

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    approved: "bg-blue-50 text-blue-700 ring-blue-200",
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  const value = String(status || "pending").toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
        styles[value] || "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {value}
    </span>
  );
}

function SummaryCard({ title, value, description, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-[#E8E3D9] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-[#172033]">
            {formatCurrency(value)}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function AgentCommissionsPage() {
  const [commissions, setCommissions] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    totalCommission: 0,
    pendingCommission: 0,
    paidCommission: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchCommissions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = localStorage.getItem("agentToken");

      if (!token) {
        throw new Error("Your agent session is missing. Please log in again.");
      }

      if (!API_BASE) {
        throw new Error("API URL is not configured. Please check your frontend environment settings.");
      }

      const response = await fetch(`${API_BASE}/api/commissions/agent`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error("Your session is invalid or has expired. Please log in again.");
      }

      if (response.status === 403) {
        throw new Error("You do not have permission to view these commissions.");
      }

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Unable to load your commissions.");
      }

      const data = result?.data || {};

      setCommissions(Array.isArray(data.commissions) ? data.commissions : []);
      setSummary({
        total: Number(data.summary?.total || 0),
        totalCommission: Number(data.summary?.totalCommission || 0),
        pendingCommission: Number(data.summary?.pendingCommission || 0),
        paidCommission: Number(data.summary?.paidCommission || 0),
      });
    } catch (err) {
      setError(err.message || "Something went wrong while loading commissions.");
      setCommissions([]);
      setSummary({
        total: 0,
        totalCommission: 0,
        pendingCommission: 0,
        paidCommission: 0,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-2xl bg-[#172033] p-5 text-white sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D8A36B]">
              Earnings & payouts
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              My Commissions
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Track the commission earned on your eligible bookings and check each record’s payment status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchCommissions(true)}
            disabled={loading || refreshing}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Could not load commissions</p>
            <p className="mt-1 break-words leading-5">{error}</p>
            <button
              type="button"
              onClick={() => fetchCommissions()}
              className="mt-3 font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total commission"
          value={summary.totalCommission}
          description={`${summary.total} commission record${summary.total === 1 ? "" : "s"} in your account`}
          icon={Wallet}
          accent="bg-orange-50 text-[#B96928]"
        />
        <SummaryCard
          title="Pending commission"
          value={summary.pendingCommission}
          description="Awaiting the next processing step"
          icon={Clock3}
          accent="bg-amber-50 text-amber-700"
        />
        <SummaryCard
          title="Paid commission"
          value={summary.paidCommission}
          description="Recorded as paid by the system"
          icon={CheckCircle2}
          accent="bg-emerald-50 text-emerald-700"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E8E3D9] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#EEE9E0] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#172033]">
              Commission history
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Booking-wise breakdown of your commission.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#F7F5F0] px-3 py-2 text-xs font-semibold text-slate-600">
            <ReceiptText size={15} />
            {commissions.length} records
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-500">
            <RefreshCw size={18} className="animate-spin" />
            Loading your commission history…
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Fix the connection or session issue to view your records.
          </div>
        ) : commissions.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5F0] text-[#B96928]">
              <Banknote size={26} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#172033]">
              No commission records yet
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Commission records will appear here when they have been generated for your eligible bookings.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#FAF9F6] text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Booking</th>
                    <th className="px-5 py-4 font-semibold">Booking type</th>
                    <th className="px-5 py-4 font-semibold">Booking amount</th>
                    <th className="px-5 py-4 font-semibold">Rate</th>
                    <th className="px-5 py-4 font-semibold">Commission</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEE9E0]">
                  {commissions.map((item) => (
                    <tr key={item._id} className="transition hover:bg-[#FCFBF8]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#172033]">
                          {item.bookingReference || "Booking"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.bookingId?._id || (typeof item.bookingId === "string" ? item.bookingId : "")}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm capitalize text-slate-600">
                        {String(item.bookingType || "—").replace(/-/g, " ")}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {formatCurrency(item.bookingAmount)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.commissionType === "fixed"
                          ? formatCurrency(item.fixedAmount)
                          : item.commissionType === "both"
                            ? `${Number(item.percentageRate || 0)}% + ${formatCurrency(item.fixedAmount)}`
                            : `${Number(item.percentageRate || 0)}%`}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#172033]">
                        {formatCurrency(item.totalCommission)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#EEE9E0] md:hidden">
              {commissions.map((item) => (
                <article key={item._id} className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-[#172033]">
                        {item.bookingReference || "Booking"}
                      </p>
                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {String(item.bookingType || "—").replace(/-/g, " ")}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Booking amount</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatCurrency(item.bookingAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Commission rate</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {item.commissionType === "fixed"
                          ? formatCurrency(item.fixedAmount)
                          : item.commissionType === "both"
                            ? `${Number(item.percentageRate || 0)}% + ${formatCurrency(item.fixedAmount)}`
                            : `${Number(item.percentageRate || 0)}%`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3 border-t border-dashed border-[#E8E3D9] pt-3">
                    <div>
                      <p className="text-xs text-slate-500">Commission amount</p>
                      <p className="mt-1 text-lg font-bold text-[#B96928]">
                        {formatCurrency(item.totalCommission)}
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Commission rates are managed by the administrator. Displayed amounts and statuses reflect the records returned by the server.
      </p>
    </div>
  );
}
