"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgePercent,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const API_URL = `${API_BASE}/api`;

const BOOKING_TYPES = [
  { value: "stay", label: "Stay / Resort" },
  { value: "safari", label: "Safari" },
  { value: "package", label: "Tour Packages" },
  { value: "event", label: "Events" },
  { value: "conference", label: "Conference" },
  { value: "corporate-meeting", label: "Corporate Meeting" },
  { value: "wedding", label: "Wedding" },
];

const EMPTY_FORM = {
  agentId: "",
  commissionType: "percentage",
  percentageRate: "10",
  fixedAmount: "0",
  applicableBookingTypes: [],
  effectiveFrom: "",
  effectiveTo: "",
  status: "active",
  notes: "",
};

function getLocalDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toDateTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return getLocalDateTimeValue(date);
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

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getAgentId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
}

function getAgentName(agent) {
  if (!agent) return "Unknown agent";

  if (typeof agent === "string") {
    return "Agent ID: " + agent;
  }

  return (
    agent.businessName ||
    agent.name ||
    agent.fullName ||
    agent.email ||
    "Unnamed agent"
  );
}

function getAgentEmail(agent) {
  if (!agent || typeof agent === "string") return "";
  return agent.email || "";
}

function getResponseMessage(result, fallback) {
  return result?.message || result?.error || fallback;
}

function getRulesFromResponse(result) {
  if (Array.isArray(result?.data?.rules)) return result.data.rules;
  if (Array.isArray(result?.rules)) return result.rules;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function getAgentsFromResponse(result) {
  if (Array.isArray(result?.data?.agents)) return result.data.agents;
  if (Array.isArray(result?.data?.items)) return result.data.items;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.agents)) return result.agents;
  return [];
}

function getRulePayload(form) {
  return {
    agentId: form.agentId,
    commissionType: form.commissionType,
    percentageRate:
      form.commissionType === "fixed" ? 0 : Number(form.percentageRate),
    fixedAmount:
      form.commissionType === "percentage" ? 0 : Number(form.fixedAmount),
    applicableBookingTypes: form.applicableBookingTypes,
    effectiveFrom: form.effectiveFrom
      ? new Date(form.effectiveFrom).toISOString()
      : new Date().toISOString(),
    effectiveTo: form.effectiveTo
      ? new Date(form.effectiveTo).toISOString()
      : null,
    status: form.status,
    notes: form.notes.trim(),
  };
}

function validateForm(form) {
  if (!form.agentId) return "Please select an agent.";

  if (
    ["percentage", "both"].includes(form.commissionType) &&
    (!Number.isFinite(Number(form.percentageRate)) ||
      Number(form.percentageRate) <= 0 ||
      Number(form.percentageRate) > 100)
  ) {
    return "Percentage rate must be greater than 0 and no more than 100.";
  }

  if (
    ["fixed", "both"].includes(form.commissionType) &&
    (!Number.isFinite(Number(form.fixedAmount)) ||
      Number(form.fixedAmount) <= 0)
  ) {
    return "Fixed commission amount must be greater than 0.";
  }

  if (form.effectiveTo && form.effectiveFrom) {
    if (
      new Date(form.effectiveTo).getTime() <
      new Date(form.effectiveFrom).getTime()
    ) {
      return "Effective To cannot be earlier than Effective From.";
    }
  }

  return "";
}

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function CommissionTypeBadge({ type }) {
  const label =
    type === "both"
      ? "Percentage + Fixed"
      : type === "fixed"
        ? "Fixed"
        : "Percentage";

  return (
    <span className="inline-flex rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-bold text-[#99501F]">
      {label}
    </span>
  );
}

export default function AgentCommissionSettingsPage() {
  const [rules, setRules] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    effectiveFrom: getLocalDateTimeValue(),
  });

  const [formError, setFormError] = useState("");

  
const getToken = useCallback(() => {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("destin_admin_token") ||
    ""
  );
}, []);

  const apiRequest = useCallback(
    async (path, options = {}) => {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin login session nahi mila. Please admin account se dobara login karein."
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
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result?.success === false) {
        throw new Error(
          getResponseMessage(
            result,
            `Request failed (${response.status}). Please try again.`
          )
        );
      }

      return result;
    },
    [getToken]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const [rulesResult, agentsResult] = await Promise.all([
        apiRequest("/commissions/rules"),
        apiRequest("/admin/agents?status=approved&page=1&limit=100"),
      ]);

      setRules(getRulesFromResponse(rulesResult));
      setAgents(getAgentsFromResponse(agentsResult));
    } catch (error) {
      setPageError(
        error?.message ||
          "Commission settings load nahi ho payi. Backend connection check karein."
      );
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRules = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rules.filter((rule) => {
      const agent = rule.agentId;
      const searchableText = [
        getAgentName(agent),
        getAgentEmail(agent),
        rule.notes,
        rule.commissionType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesStatus =
        statusFilter === "all" || rule.status === statusFilter;
      const matchesType =
        typeFilter === "all" || rule.commissionType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rules, search, statusFilter, typeFilter]);

  const summary = useMemo(() => {
    return {
      total: rules.length,
      active: rules.filter((rule) => rule.status === "active").length,
      inactive: rules.filter((rule) => rule.status === "inactive").length,
      agents: new Set(rules.map((rule) => getAgentId(rule.agentId)).filter(Boolean))
        .size,
    };
  }, [rules]);

  function openCreateModal() {
    setEditingRule(null);
    setForm({
      ...EMPTY_FORM,
      effectiveFrom: getLocalDateTimeValue(),
    });
    setFormError("");
    setPageMessage("");
    setModalOpen(true);
  }

  function openEditModal(rule) {
    const agentId = getAgentId(rule.agentId);

    setEditingRule(rule);
    setForm({
      agentId,
      commissionType: rule.commissionType || "percentage",
      percentageRate: String(rule.percentageRate ?? 0),
      fixedAmount: String(rule.fixedAmount ?? 0),
      applicableBookingTypes: Array.isArray(rule.applicableBookingTypes)
        ? rule.applicableBookingTypes
        : [],
      effectiveFrom: toDateTimeInput(rule.effectiveFrom),
      effectiveTo: toDateTimeInput(rule.effectiveTo),
      status: rule.status || "active",
      notes: rule.notes || "",
    });
    setFormError("");
    setPageMessage("");
    setModalOpen(true);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleBookingType(value) {
    setForm((current) => {
      const selected = current.applicableBookingTypes.includes(value);

      return {
        ...current,
        applicableBookingTypes: selected
          ? current.applicableBookingTypes.filter((item) => item !== value)
          : [...current.applicableBookingTypes, value],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setPageMessage("");

    const validationMessage = validateForm(form);

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setSaving(true);

    try {
      const payload = getRulePayload(form);
      const isEditing = Boolean(editingRule?._id);
      const path = isEditing
        ? `/commissions/rules/${editingRule._id}`
        : "/commissions/rules";

      const result = await apiRequest(path, {
        method: isEditing ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      setPageMessage(
        getResponseMessage(
          result,
          isEditing
            ? "Commission rule updated successfully."
            : "Commission rule created successfully."
        )
      );

      await loadData();
    } catch (error) {
      setFormError(error?.message || "Unable to save commission rule.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRuleStatus(rule) {
    const nextStatus = rule.status === "active" ? "inactive" : "active";
    const confirmed = window.confirm(
      `${nextStatus === "active" ? "Activate" : "Deactivate"} this commission rule?`
    );

    if (!confirmed) return;

    setPageError("");
    setPageMessage("");

    try {
      const result = await apiRequest(`/commissions/rules/${rule._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      setPageMessage(
        getResponseMessage(
          result,
          `Commission rule ${nextStatus === "active" ? "activated" : "deactivated"}.`
        )
      );

      await loadData();
    } catch (error) {
      setPageError(error?.message || "Unable to update commission status.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-5 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* BREADCRUMB */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href="/admin/agents"
            className="inline-flex items-center gap-1.5 transition hover:text-[#B96928]"
          >
            <ArrowLeft size={15} />
            Agent Management
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#172033]">
            Commission Settings
          </span>
        </div>

        {/* HEADER */}
        <section className="overflow-hidden rounded-2xl border border-[#E8E3D9] bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#18352A] text-white shadow-sm">
                <BadgePercent size={25} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#B96928]">
                  AGENT MANAGEMENT
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-[#172033] sm:text-3xl">
                  Commission Settings
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Set and manage commission rules for approved agents. Changes
                  are saved through the backend.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#9F5722]"
              >
                <Plus size={17} />
                Create Rule
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-2 border-t border-slate-100 bg-[#FCFBF8] px-5 py-3 text-xs leading-5 text-slate-600 sm:px-7">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#18352A]" />
            <p>
              Commission rules define the rates. They do not themselves confirm
              a booking or mark a commission as paid.
            </p>
          </div>
        </section>

        {/* ALERTS */}
        {pageError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <CircleAlert size={19} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">Unable to complete the request</p>
              <p className="mt-1 break-words">{pageError}</p>
            </div>
            <button
              type="button"
              onClick={() => setPageError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {pageMessage && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <Check size={18} className="mt-0.5 shrink-0" />
            <p className="break-words">{pageMessage}</p>
            <button
              type="button"
              onClick={() => setPageMessage("")}
              aria-label="Dismiss message"
              className="ml-auto rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Settings2}
            label="Total rules"
            value={summary.total}
            loading={loading}
          />
          <SummaryCard
            icon={Check}
            label="Active rules"
            value={summary.active}
            loading={loading}
            accent="green"
          />
          <SummaryCard
            icon={Clock3}
            label="Inactive rules"
            value={summary.inactive}
            loading={loading}
            accent="gray"
          />
          <SummaryCard
            icon={Users}
            label="Agents with rules"
            value={summary.agents}
            loading={loading}
            accent="orange"
          />
        </section>

        {/* RULES TABLE */}
        <section className="overflow-hidden rounded-2xl border border-[#E8E3D9] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#172033]">
                Commission Rules
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review each agent&apos;s rate, applicability and effective dates.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_180px_190px]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search agent or notes..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#B96928] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">All commission types</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                  <option value="both">Percentage + Fixed</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
              <Loader2 size={28} className="animate-spin text-[#B96928]" />
              <p className="text-sm font-semibold text-slate-600">
                Loading commission rules...
              </p>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5F0] text-[#B96928]">
                <Wallet size={25} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-[#172033]">
                {rules.length === 0
                  ? "No commission rules yet"
                  : "No matching rules"}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {rules.length === 0
                  ? "Create a commission rule for an approved agent to get started."
                  : "Try changing your search or filters."}
              </p>
              {rules.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#9F5722]"
                >
                  <Plus size={16} />
                  Create first rule
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-[#FCFBF8] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-extrabold">Agent</th>
                      <th className="px-5 py-4 font-extrabold">Rule type</th>
                      <th className="px-5 py-4 font-extrabold">Rate</th>
                      <th className="px-5 py-4 font-extrabold">Applies to</th>
                      <th className="px-5 py-4 font-extrabold">Effective from</th>
                      <th className="px-5 py-4 font-extrabold">Status</th>
                      <th className="px-5 py-4 text-right font-extrabold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRules.map((rule) => (
                      <tr
                        key={rule._id}
                        className="transition hover:bg-[#FCFBF8]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-[#172033]">
                            {getAgentName(rule.agentId)}
                          </p>
                          {getAgentEmail(rule.agentId) && (
                            <p className="mt-1 text-xs text-slate-500">
                              {getAgentEmail(rule.agentId)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <CommissionTypeBadge type={rule.commissionType} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1 font-semibold text-slate-700">
                            {["percentage", "both"].includes(
                              rule.commissionType
                            ) && (
                              <p>{Number(rule.percentageRate || 0)}%</p>
                            )}
                            {["fixed", "both"].includes(
                              rule.commissionType
                            ) && <p>{formatCurrency(rule.fixedAmount)}</p>}
                          </div>
                        </td>

                        <td className="max-w-56 px-5 py-4 text-slate-600">
                          {Array.isArray(rule.applicableBookingTypes) &&
                          rule.applicableBookingTypes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {rule.applicableBookingTypes.map((type) => (
                                <span
                                  key={type}
                                  className="rounded-md bg-slate-100 px-2 py-1 text-xs"
                                >
                                  {BOOKING_TYPES.find(
                                    (item) => item.value === type
                                  )?.label || type}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">
                              All booking types
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <p>{formatDate(rule.effectiveFrom)}</p>
                          {rule.effectiveTo && (
                            <p className="mt-1 text-xs text-slate-400">
                              Until {formatDate(rule.effectiveTo)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={rule.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(rule)}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:border-[#B96928] hover:text-[#B96928]"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleRuleStatus(rule)}
                              className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                                rule.status === "active"
                                  ? "border-red-200 text-red-700 hover:bg-red-50"
                                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {rule.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET CARDS */}
              <div className="grid gap-3 p-4 sm:p-5 lg:hidden">
                {filteredRules.map((rule) => (
                  <article
                    key={rule._id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-extrabold text-[#172033]">
                          {getAgentName(rule.agentId)}
                        </h3>
                        {getAgentEmail(rule.agentId) && (
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {getAgentEmail(rule.agentId)}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={rule.status} />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <CommissionTypeBadge type={rule.commissionType} />
                      {["percentage", "both"].includes(
                        rule.commissionType
                      ) && (
                        <span className="text-sm font-extrabold text-[#18352A]">
                          {Number(rule.percentageRate || 0)}%
                        </span>
                      )}
                      {["fixed", "both"].includes(rule.commissionType) && (
                        <span className="text-sm font-extrabold text-[#18352A]">
                          {formatCurrency(rule.fixedAmount)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Effective from</p>
                        <p className="mt-1 font-semibold">
                          {formatDate(rule.effectiveFrom)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Effective to</p>
                        <p className="mt-1 font-semibold">
                          {formatDate(rule.effectiveTo)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs leading-5 text-slate-600">
                      <span className="font-bold">Applies to: </span>
                      {rule.applicableBookingTypes?.length
                        ? rule.applicableBookingTypes
                            .map(
                              (type) =>
                                BOOKING_TYPES.find(
                                  (item) => item.value === type
                                )?.label || type
                            )
                            .join(", ")
                        : "All booking types"}
                    </div>

                    {rule.notes && (
                      <p className="mt-3 rounded-lg bg-[#FCFBF8] p-3 text-xs leading-5 text-slate-600">
                        {rule.notes}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(rule)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:border-[#B96928] hover:text-[#B96928]"
                      >
                        <Pencil size={15} />
                        Edit rule
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleRuleStatus(rule)}
                        className={`min-h-10 flex-1 rounded-lg border px-3 text-sm font-bold ${
                          rule.status === "active"
                            ? "border-red-200 text-red-700 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {rule.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                Showing {filteredRules.length} of {rules.length} rules
              </div>
            </>
          )}
        </section>

        {/* MODAL */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !saving) {
                setModalOpen(false);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="commission-modal-title"
              className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#B96928]">
                    AGENT COMMISSION
                  </p>
                  <h2
                    id="commission-modal-title"
                    className="mt-1 text-xl font-black text-[#172033]"
                  >
                    {editingRule ? "Edit commission rule" : "Create commission rule"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Set the agent, rate and applicable booking types.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => !saving && setModalOpen(false)}
                  disabled={saving}
                  aria-label="Close form"
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6"
              >
                {formError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                  >
                    <CircleAlert size={17} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Agent" required>
                    <select
                      required
                      value={form.agentId}
                      onChange={(event) =>
                        updateField("agentId", event.target.value)
                      }
                      className="form-input"
                    >
                      <option value="">Select an approved agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {getAgentName(agent)}
                          {agent.email ? ` — ${agent.email}` : ""}
                        </option>
                      ))}
                    </select>
                    {agents.length === 0 && (
                      <p className="mt-2 text-xs leading-5 text-amber-700">
                        No approved agents were returned by the backend. Check
                        the agent API and approval status.
                      </p>
                    )}
                  </FormField>

                  <FormField label="Commission type" required>
                    <select
                      value={form.commissionType}
                      onChange={(event) =>
                        updateField("commissionType", event.target.value)
                      }
                      className="form-input"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed amount</option>
                      <option value="both">Percentage + fixed</option>
                    </select>
                  </FormField>

                  {["percentage", "both"].includes(form.commissionType) && (
                    <FormField label="Percentage rate (%)" required>
                      <div className="relative">
                        <input
                          required
                          type="number"
                          min="0.01"
                          max="100"
                          step="0.01"
                          value={form.percentageRate}
                          onChange={(event) =>
                            updateField("percentageRate", event.target.value)
                          }
                          className="form-input pr-10"
                          placeholder="e.g. 10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          %
                        </span>
                      </div>
                    </FormField>
                  )}

                  {["fixed", "both"].includes(form.commissionType) && (
                    <FormField label="Fixed amount (INR)" required>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          required
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={form.fixedAmount}
                          onChange={(event) =>
                            updateField("fixedAmount", event.target.value)
                          }
                          className="form-input pl-8"
                          placeholder="e.g. 500"
                        />
                      </div>
                    </FormField>
                  )}

                  <FormField label="Effective from" required>
                    <input
                      required
                      type="datetime-local"
                      value={form.effectiveFrom}
                      onChange={(event) =>
                        updateField("effectiveFrom", event.target.value)
                      }
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Effective to (optional)">
                    <input
                      type="datetime-local"
                      value={form.effectiveTo}
                      min={form.effectiveFrom || undefined}
                      onChange={(event) =>
                        updateField("effectiveTo", event.target.value)
                      }
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Rule status" required>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value)
                      }
                      className="form-input"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </FormField>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-extrabold text-[#172033]">
                      Applicable booking types
                    </h3>
                    <span className="text-xs text-slate-500">
                      Leave all unchecked to apply to all types
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {BOOKING_TYPES.map((type) => {
                      const checked = form.applicableBookingTypes.includes(
                        type.value
                      );

                      return (
                        <label
                          key={type.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                            checked
                              ? "border-[#B96928] bg-orange-50 text-[#884619]"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBookingType(type.value)}
                            className="h-4 w-4 accent-[#B96928]"
                          />
                          <span className="font-semibold">{type.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <FormField label="Internal notes (optional)">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={form.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    className="form-input min-h-24 resize-y"
                    placeholder="Reason for this rate, agreement reference, or other internal notes"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.notes.length}/1000
                  </p>
                </FormField>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={saving}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || agents.length === 0}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#9F5722] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Save size={17} />
                    )}
                    {saving
                      ? "Saving..."
                      : editingRule
                        ? "Save changes"
                        : "Create rule"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>

      <style jsx>{`
        .form-input {
          display: block;
          width: 100%;
          min-height: 44px;
          border: 1px solid #dbe1e8;
          border-radius: 10px;
          background: #fff;
          padding: 10px 12px;
          color: #172033;
          font-size: 14px;
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .form-input:focus {
          border-color: #b96928;
          box-shadow: 0 0 0 3px rgb(185 105 40 / 12%);
        }

        .form-input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </main>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  loading,
  accent = "dark",
}) {
  const accentClasses = {
    dark: "bg-[#18352A] text-white",
    green: "bg-emerald-50 text-emerald-700",
    gray: "bg-slate-100 text-slate-600",
    orange: "bg-orange-50 text-[#B96928]",
  };

  return (
    <article className="rounded-2xl border border-[#E8E3D9] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            accentClasses[accent] || accentClasses.dark
          }`}
        >
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-14 animate-pulse rounded-md bg-slate-100" />
        ) : (
          <p className="text-3xl font-black tracking-tight text-[#172033]">
            {value}
          </p>
        )}
      </div>
    </article>
  );
}