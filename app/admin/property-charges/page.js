"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const API_URL = `${API_BASE}/api`;

const EMPTY_FORM = {
  listingFeeEnabled: false,
  listingFeeAmount: "0",
  listingFeeNotes: "",
  bookingChargeType: "none",
  percentageRate: "0",
  fixedAmount: "0",
  status: "active",
  notes: "",
};

function getMessage(result, fallback) {
  return result?.message || result?.error || fallback;
}

function getId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
}

function getPropertyName(property) {
  if (!property || typeof property === "string") {
    return "Property";
  }

  return property.name || "Unnamed property";
}

function getPropertyOwner(property) {
  if (!property || typeof property === "string") {
    return null;
  }

  return property.agentId || null;
}

function getOwnerName(owner) {
  if (!owner) return "Owner information unavailable";

  if (typeof owner === "string") {
    return `Owner ID: ${owner}`;
  }

  return (
    owner.businessName ||
    owner.name ||
    owner.email ||
    "Unnamed owner"
  );
}

function getOwnerEmail(owner) {
  if (!owner || typeof owner === "string") return "";
  return owner.email || "";
}

function getArray(result, keys = []) {
  for (const key of keys) {
    if (Array.isArray(result?.data?.[key])) {
      return result.data[key];
    }

    if (Array.isArray(result?.[key])) {
      return result[key];
    }
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return [];
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

function getBookingChargeLabel(type) {
  const labels = {
    none: "No booking charge",
    percentage: "Percentage",
    fixed: "Fixed amount",
    both: "Percentage + fixed",
  };

  return labels[type] || "Not configured";
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

function SummaryCard({ icon: Icon, label, value, loading, accent = "dark" }) {
  const colors = {
    dark: "bg-[#18352A] text-white",
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-[#B96928]",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="rounded-2xl border border-[#E8E3D9] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            colors[accent]
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

export default function PropertyChargesPage() {
  const [properties, setProperties] = useState([]);
  const [rules, setRules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pageError, setPageError] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("adminToken") || "";
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
          getMessage(
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
      const [rulesResult, propertiesResult] = await Promise.all([
        apiRequest("/admin/property-charges"),
        apiRequest("/admin/agents/properties"),
      ]);

      const loadedRules = getArray(rulesResult, ["rules", "items"]);
      const loadedProperties = getArray(propertiesResult, [
        "properties",
        "items",
        "submissions",
      ]);

      setRules(loadedRules);

      // Property submissions endpoint ka actual response structure
      // alag ho sakta hai. Sirf identifiable property records use honge.
      const normalizedProperties = loadedProperties
        .map((item) => item?.property || item)
        .filter(
          (property) =>
            property &&
            typeof property === "object" &&
            getId(property)
        );

      setProperties(normalizedProperties);
    } catch (error) {
      setPageError(
        error?.message ||
          "Property charges load nahi ho paaye. Backend connection check karein."
      );
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const ruleByPropertyId = useMemo(() => {
    const map = new Map();

    for (const rule of rules) {
      const propertyId = getId(rule.propertyId);

      if (propertyId) {
        map.set(propertyId, rule);
      }
    }

    return map;
  }, [rules]);

  const allProperties = useMemo(() => {
    const map = new Map();

    for (const property of properties) {
      const id = getId(property);

      if (id) {
        map.set(id, property);
      }
    }

    // Rules mein aisi properties bhi aa sakti hain jo
    // submissions endpoint ke response mein nahi hain.
    for (const rule of rules) {
      const property =
        rule.propertyId && typeof rule.propertyId === "object"
          ? rule.propertyId
          : null;

      const id = getId(property || rule.propertyId);

      if (id && !map.has(id)) {
        map.set(id, property || { _id: id, name: `Property ${id}` });
      }
    }

    return Array.from(map.values());
  }, [properties, rules]);

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allProperties.filter((property) => {
      const id = getId(property);
      const rule = ruleByPropertyId.get(id);
      const owner = getPropertyOwner(property) || rule?.agentId;

      const searchable = [
        getPropertyName(property),
        property.city,
        property.propertyType,
        getOwnerName(owner),
        getOwnerEmail(owner),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);

      const ruleStatus = rule ? rule.status : "unconfigured";
      const matchesStatus =
        statusFilter === "all" || ruleStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allProperties, ruleByPropertyId, search, statusFilter]);

  const summary = useMemo(() => {
    const configured = allProperties.filter((property) =>
      ruleByPropertyId.has(getId(property))
    );

    return {
      total: allProperties.length,
      configured: configured.length,
      active: rules.filter((rule) => rule.status === "active").length,
      inactive: rules.filter((rule) => rule.status === "inactive").length,
    };
  }, [allProperties, rules, ruleByPropertyId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openEditor(property) {
    const propertyId = getId(property);
    const existingRule = ruleByPropertyId.get(propertyId);

    const listingFee = existingRule?.listingFee || {};
    const bookingCharge = existingRule?.bookingCharge || {};

    setSelectedProperty(property);

    setForm({
      listingFeeEnabled: Boolean(listingFee.enabled),
      listingFeeAmount: String(listingFee.amount ?? 0),
      listingFeeNotes: listingFee.notes || "",
      bookingChargeType: bookingCharge.type || "none",
      percentageRate: String(bookingCharge.percentageRate ?? 0),
      fixedAmount: String(bookingCharge.fixedAmount ?? 0),
      status: existingRule?.status || "active",
      notes: existingRule?.notes || "",
    });

    setFormError("");
    setPageMessage("");
    setModalOpen(true);
  }

  function validateForm() {
    if (!selectedProperty || !getId(selectedProperty)) {
      return "Please select a valid property.";
    }

    const listingAmount = Number(form.listingFeeAmount);
    const percentage = Number(form.percentageRate);
    const fixedAmount = Number(form.fixedAmount);

    if (!Number.isFinite(listingAmount) || listingAmount < 0) {
      return "Listing fee must be a valid non-negative amount.";
    }

    if (
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      return "Percentage must be between 0 and 100.";
    }

    if (!Number.isFinite(fixedAmount) || fixedAmount < 0) {
      return "Fixed charge must be a valid non-negative amount.";
    }

    if (
      ["percentage", "both"].includes(form.bookingChargeType) &&
      percentage <= 0
    ) {
      return "Percentage must be greater than zero.";
    }

    if (
      ["fixed", "both"].includes(form.bookingChargeType) &&
      fixedAmount <= 0
    ) {
      return "Fixed booking charge must be greater than zero.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setPageMessage("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSaving(true);

    try {
      const propertyId = getId(selectedProperty);

      const payload = {
        listingFee: {
          enabled: form.listingFeeEnabled,
          amount: Number(form.listingFeeAmount),
          notes: form.listingFeeNotes.trim(),
        },
        bookingCharge: {
          type: form.bookingChargeType,
          percentageRate:
            ["percentage", "both"].includes(form.bookingChargeType)
              ? Number(form.percentageRate)
              : 0,
          fixedAmount:
            ["fixed", "both"].includes(form.bookingChargeType)
              ? Number(form.fixedAmount)
              : 0,
        },
        status: form.status,
        notes: form.notes.trim(),
      };

      const result = await apiRequest(
        `/admin/property-charges/${propertyId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      setModalOpen(false);
      setPageMessage(
        getMessage(result, "Property charges saved successfully.")
      );

      await loadData();
    } catch (error) {
      setFormError(error?.message || "Unable to save property charges.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-5 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
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
            Property Charges
          </span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#E8E3D9] bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#18352A] text-white">
                <Wallet size={25} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#B96928]">
                  PROPERTY MANAGEMENT
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                  Property Charges
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Configure property listing fees and Destination Corbett
                  booking charges. Agent commissions remain separate.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="flex items-start gap-2 border-t border-slate-100 bg-[#FCFBF8] px-5 py-3 text-xs leading-5 text-slate-600 sm:px-7">
            <ShieldCheck
              size={15}
              className="mt-0.5 shrink-0 text-[#18352A]"
            />
            <p>
              Saving a charge rule only stores its configuration. It does not
              collect payment or automatically deduct money from a booking.
            </p>
          </div>
        </section>

        {pageError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <CircleAlert size={19} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">Unable to load property charges</p>
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
            <p className="flex-1 break-words">{pageMessage}</p>
            <button
              type="button"
              onClick={() => setPageMessage("")}
              aria-label="Dismiss message"
              className="rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Building2}
            label="Properties returned"
            value={summary.total}
            loading={loading}
          />

          <SummaryCard
            icon={Wallet}
            label="Configured properties"
            value={summary.configured}
            loading={loading}
            accent="orange"
          />

          <SummaryCard
            icon={Check}
            label="Active charge rules"
            value={summary.active}
            loading={loading}
            accent="green"
          />

          <SummaryCard
            icon={Clock3}
            label="Inactive charge rules"
            value={summary.inactive}
            loading={loading}
            accent="gray"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#E8E3D9] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-extrabold">Property charge rules</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a property to create or update its charge configuration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_200px]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search property, city or owner..."
                  className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none transition focus:border-[#B96928] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">All configurations</option>
                  <option value="active">Active rules</option>
                  <option value="inactive">Inactive rules</option>
                  <option value="unconfigured">Not configured</option>
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
                Loading properties and charge rules...
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5F0] text-[#B96928]">
                <Building2 size={25} />
              </div>

              <h3 className="mt-4 text-base font-extrabold">
                {allProperties.length === 0
                  ? "No properties returned"
                  : "No matching properties"}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {allProperties.length === 0
                  ? "Check the property submissions API response. No properties have been displayed from an unverified source."
                  : "Try changing your search or configuration filter."}
              </p>

              <button
                type="button"
                onClick={loadData}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#9F5722]"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-[#FCFBF8] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-extrabold">Property</th>
                      <th className="px-5 py-4 font-extrabold">Owner / Agent</th>
                      <th className="px-5 py-4 font-extrabold">Listing fee</th>
                      <th className="px-5 py-4 font-extrabold">Booking charge</th>
                      <th className="px-5 py-4 font-extrabold">Status</th>
                      <th className="px-5 py-4 text-right font-extrabold">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProperties.map((property) => {
                      const id = getId(property);
                      const rule = ruleByPropertyId.get(id);
                      const owner =
                        getPropertyOwner(property) || rule?.agentId;

                      return (
                        <tr
                          key={id}
                          className="transition hover:bg-[#FCFBF8]"
                        >
                          <td className="px-5 py-4">
                            <p className="font-bold text-[#172033]">
                              {getPropertyName(property)}
                            </p>
                            <p className="mt-1 text-xs capitalize text-slate-500">
                              {[property.propertyType, property.city]
                                .filter(Boolean)
                                .join(" · ") || "Property details unavailable"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-700">
                              {getOwnerName(owner)}
                            </p>
                            {getOwnerEmail(owner) && (
                              <p className="mt-1 text-xs text-slate-500">
                                {getOwnerEmail(owner)}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {rule?.listingFee?.enabled ? (
                              <div>
                                <p className="font-bold text-slate-700">
                                  {formatCurrency(rule.listingFee.amount)}
                                </p>
                                <p className="mt-1 text-xs text-emerald-700">
                                  Enabled
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400">
                                Not enabled
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-700">
                              {getBookingChargeLabel(
                                rule?.bookingCharge?.type
                              )}
                            </p>

                            {rule?.bookingCharge?.type === "percentage" && (
                              <p className="mt-1 text-xs text-slate-500">
                                {rule.bookingCharge.percentageRate}%
                              </p>
                            )}

                            {rule?.bookingCharge?.type === "fixed" && (
                              <p className="mt-1 text-xs text-slate-500">
                                {formatCurrency(
                                  rule.bookingCharge.fixedAmount
                                )}
                              </p>
                            )}

                            {rule?.bookingCharge?.type === "both" && (
                              <p className="mt-1 text-xs text-slate-500">
                                {rule.bookingCharge.percentageRate}% +{" "}
                                {formatCurrency(rule.bookingCharge.fixedAmount)}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {rule ? (
                              <StatusBadge status={rule.status} />
                            ) : (
                              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                                Not configured
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => openEditor(property)}
                              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:border-[#B96928] hover:text-[#B96928]"
                            >
                              <Pencil size={14} />
                              {rule ? "Edit charges" : "Configure"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 sm:p-5 lg:hidden">
                {filteredProperties.map((property) => {
                  const id = getId(property);
                  const rule = ruleByPropertyId.get(id);
                  const owner =
                    getPropertyOwner(property) || rule?.agentId;

                  return (
                    <article
                      key={id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#18352A] text-white">
                          <Building2 size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-extrabold">
                            {getPropertyName(property)}
                          </h3>

                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {[property.propertyType, property.city]
                              .filter(Boolean)
                              .join(" · ") || "Property"}
                          </p>

                          <p className="mt-2 break-words text-xs text-slate-600">
                            {getOwnerName(owner)}
                          </p>
                        </div>

                        {rule ? (
                          <StatusBadge status={rule.status} />
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">
                            Not configured
                          </span>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-xs text-slate-500">Listing fee</p>
                          <p className="mt-1 font-bold">
                            {rule?.listingFee?.enabled
                              ? formatCurrency(rule.listingFee.amount)
                              : "Disabled"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Booking charge
                          </p>
                          <p className="mt-1 font-bold">
                            {getBookingChargeLabel(
                              rule?.bookingCharge?.type
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditor(property)}
                        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold transition hover:border-[#B96928] hover:text-[#B96928]"
                      >
                        <Pencil size={15} />
                        {rule ? "Edit charges" : "Configure charges"}
                      </button>
                    </article>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                Showing {filteredProperties.length} of {allProperties.length}{" "}
                properties
              </div>
            </>
          )}
        </section>

        {modalOpen && selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="charges-modal-title"
              className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#B96928]">
                    PROPERTY CHARGES
                  </p>

                  <h2
                    id="charges-modal-title"
                    className="mt-1 text-xl font-black"
                  >
                    {ruleByPropertyId.has(getId(selectedProperty))
                      ? "Edit property charges"
                      : "Configure property charges"}
                  </h2>

                  <p className="mt-1 break-words text-sm text-slate-500">
                    {getPropertyName(selectedProperty)}
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

                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-extrabold">Listing fee</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    A property-level fee. This configuration does not collect
                    payment.
                  </p>

                  <label className="mt-4 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.listingFeeEnabled}
                      onChange={(event) =>
                        updateField("listingFeeEnabled", event.target.checked)
                      }
                      className="h-4 w-4 accent-[#B96928]"
                    />
                    <span className="text-sm font-semibold">
                      Enable listing fee
                    </span>
                  </label>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <FormField label="Listing fee amount (INR)" required>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.listingFeeAmount}
                        onChange={(event) =>
                          updateField("listingFeeAmount", event.target.value)
                        }
                        className="form-input"
                      />
                    </FormField>

                    <FormField label="Listing fee notes">
                      <input
                        maxLength={500}
                        value={form.listingFeeNotes}
                        onChange={(event) =>
                          updateField("listingFeeNotes", event.target.value)
                        }
                        className="form-input"
                        placeholder="Optional note"
                      />
                    </FormField>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-extrabold">Booking charge</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Destination Corbett&apos;s configured property booking
                    charge, separate from Agent Commission.
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <FormField label="Charge type" required>
                      <select
                        value={form.bookingChargeType}
                        onChange={(event) =>
                          updateField("bookingChargeType", event.target.value)
                        }
                        className="form-input"
                      >
                        <option value="none">No booking charge</option>
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed amount</option>
                        <option value="both">Percentage + fixed</option>
                      </select>
                    </FormField>

                    {["percentage", "both"].includes(
                      form.bookingChargeType
                    ) && (
                      <FormField label="Percentage rate (%)" required>
                        <input
                          type="number"
                          min="0.01"
                          max="100"
                          step="0.01"
                          required
                          value={form.percentageRate}
                          onChange={(event) =>
                            updateField("percentageRate", event.target.value)
                          }
                          className="form-input"
                        />
                      </FormField>
                    )}

                    {["fixed", "both"].includes(form.bookingChargeType) && (
                      <FormField label="Fixed amount (INR)" required>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          required
                          value={form.fixedAmount}
                          onChange={(event) =>
                            updateField("fixedAmount", event.target.value)
                          }
                          className="form-input"
                        />
                      </FormField>
                    )}
                  </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2">
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

                  <FormField label="Internal notes">
                    <input
                      maxLength={1000}
                      value={form.notes}
                      onChange={(event) =>
                        updateField("notes", event.target.value)
                      }
                      className="form-input"
                      placeholder="Optional internal notes"
                    />
                  </FormField>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={saving}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 text-sm font-extrabold text-white transition hover:bg-[#9F5722] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Save size={17} />
                    )}
                    {saving ? "Saving..." : "Save charges"}
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