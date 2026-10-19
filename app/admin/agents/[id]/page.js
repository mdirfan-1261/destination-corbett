"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Globe,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UserX,
  XCircle,
  BedDouble,
} from "lucide-react";

// Safe API base without double /api
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const AGENT_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  suspended: "bg-slate-100 text-slate-700 ring-slate-200",
};

const PROPERTY_STATUS_STYLES = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  suspended: "bg-slate-100 text-slate-700 ring-slate-200",
};

function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("destin_admin_token") ||
    ""
  );
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

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLabel(value) {
  if (!value) return "Not specified";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getPropertyName(property) {
  return (
    property?.name ||
    property?.propertyName ||
    property?.businessName ||
    property?.title ||
    "Untitled Property"
  );
}

function getPropertyLocation(property) {
  if (typeof property?.address === "string" && property.address.trim()) {
    return property.address;
  }
  if (typeof property?.location === "string" && property.location.trim()) {
    return property.location;
  }
  const parts = [
    property?.city,
    property?.district,
    property?.state,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "Location not provided";
}

function StatusBadge({ status, type = "agent" }) {
  const value = String(status || "unknown").toLowerCase();
  const styles =
    type === "property" ? PROPERTY_STATUS_STYLES : AGENT_STATUS_STYLES;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
        styles[value] || "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F5F0] text-[#B96928]">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-[#172033]">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, accent = "text-[#B96928]" }) {
  return (
    <div className="rounded-2xl border border-[#E8E3D9] bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F5F0] ${accent}`}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 truncate text-xl font-bold text-[#172033]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminAgentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const agentId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchAgentDetails = useCallback(async () => {
    if (!agentId) return;

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      const response = await fetch(
        `${API_BASE}/api/admin/agents/${encodeURIComponent(agentId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error("Your session is invalid or has expired. Please log in again.");
      }
      if (response.status === 403) {
        throw new Error("Access denied. Super Admin permission is required.");
      }
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to load agent details.");
      }

      const data = result.data || {};
      if (!data.agent) {
        throw new Error("Agent details were not found.");
      }

      setAgent(data.agent);
      setProperties(Array.isArray(data.properties) ? data.properties : []);
    } catch (err) {
      setAgent(null);
      setProperties([]);
      setError(err.message || "Unable to load agent details.");
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchAgentDetails();
  }, [fetchAgentDetails]);

  async function sendRequest(url, method = "PATCH", body = null) {
    const token = getToken();
    if (!token) {
      throw new Error("Your admin session has expired. Please log in again.");
    }

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (body !== null) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${url}`, options);
    const result = await response.json().catch(() => ({}));

    if (response.status === 401) {
      throw new Error("Your session is invalid or has expired. Please log in again.");
    }
    if (response.status === 403) {
      throw new Error("Access denied. Super Admin permission is required.");
    }
    if (!response.ok || result.success === false) {
      throw new Error(result.message || "The requested action could not be completed.");
    }

    return result;
  }

  async function handleAgentAction(action) {
    if (!agent?._id || actionKey) return;
    const agentName = agent.name || agent.businessName || "this agent";
    let body = null;

    if (action === "reject") {
      const enteredReason = window.prompt(`Enter a rejection reason for ${agentName}:`);
      if (enteredReason === null) return;
      const reason = enteredReason.trim();
      if (!reason) {
        setError("A rejection reason is required.");
        return;
      }
      body = { reason };
    } else {
      const messages = {
        approve: `Approve ${agentName}?`,
        suspend: `Suspend ${agentName}?`,
        restore: `Restore ${agentName} to pending review?`,
      };
      if (!window.confirm(messages[action] || "Continue with this action?")) {
        return;
      }
    }

    setActionKey(`agent-${action}`);
    setError("");
    setNotice("");

    try {
      const result = await sendRequest(
        `/api/admin/agents/${encodeURIComponent(agent._id)}/${action}`,
        "PATCH",
        body
      );
      setNotice(result.message || "Agent updated successfully.");
      await fetchAgentDetails();
    } catch (err) {
      setError(err.message || "The agent action could not be completed.");
    } finally {
      setActionKey("");
    }
  }

  async function handlePropertyReview(property, decision) {
    if (!property?._id || actionKey) return;
    const propertyName = getPropertyName(property);
    let body = { decision };

    if (decision === "reject") {
      const enteredReason = window.prompt(`Enter a rejection reason for "${propertyName}":`);
      if (enteredReason === null) return;
      const reason = enteredReason.trim();
      if (!reason) {
        setError("A rejection reason is required.");
        return;
      }
      body.reason = reason;
    } else {
      if (!window.confirm(`Approve "${propertyName}"?`)) return;
    }

    setActionKey(`property-${property._id}`);
    setError("");
    setNotice("");

    try {
      const result = await sendRequest(
        `/api/admin/properties/${encodeURIComponent(property._id)}/review`,
        "PATCH",
        body
      );
      setNotice(result.message || "Property review completed successfully.");
      await fetchAgentDetails();
    } catch (err) {
      setError(err.message || "Unable to review this property.");
    } finally {
      setActionKey("");
    }
  }

  async function handlePublication(property, publicationStatus) {
    if (!property?._id || actionKey) return;
    const propertyName = getPropertyName(property);
    const isPublishing = publicationStatus === "published";

    if (!window.confirm(isPublishing ? `Publish "${propertyName}" live?` : `Unpublish "${propertyName}"?`)) {
      return;
    }

    setActionKey(`publication-${property._id}`);
    setError("");
    setNotice("");

    try {
      const result = await sendRequest(
        `/api/admin/properties/${encodeURIComponent(property._id)}/publication`,
        "PATCH",
        { publicationStatus }
      );
      setNotice(result.message || "Publication status updated successfully.");
      await fetchAgentDetails();
    } catch (err) {
      setError(err.message || "Unable to update property publication status.");
    } finally {
      setActionKey("");
    }
  }

  if (loading && !agent) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F5F0] px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <LoaderCircle size={30} className="animate-spin text-[#B96928]" />
          <p className="text-sm font-medium text-slate-600">Loading agent details...</p>
        </div>
      </main>
    );
  }

  if (!agent) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E8E3D9] bg-white p-6 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <XCircle size={26} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-[#172033]">Unable to Load Agent</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error || "Agent not found."}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={fetchAgentDetails}
              className="inline-flex items-center gap-2 rounded-xl bg-[#18352A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#244A3B]"
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <Link
              href="/admin/agents"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED3] px-4 py-2.5 text-sm font-semibold text-[#172033] hover:bg-[#F7F5F0]"
            >
              <ArrowLeft size={16} /> Back to Agents
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const agentName = agent.name || agent.businessName || "Unnamed Agent";

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/agents"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED3] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] transition hover:bg-[#FAF8F4]"
          >
            <ArrowLeft size={16} />
            Back to Agents
          </Link>

          <button
            type="button"
            onClick={fetchAgentDetails}
            disabled={loading || Boolean(actionKey)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E1DBD0] bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-[#FAF8F4] disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="font-bold">×</button>
          </div>
        )}

        {notice && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} className="font-bold">×</button>
          </div>
        )}

        {/* HERO CARD */}
        <section className="overflow-hidden rounded-2xl border border-[#E8E3D9] bg-white shadow-sm">
          <div className="bg-[#172033] px-5 py-6 text-white sm:px-7 sm:py-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                  <UserRound size={28} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9B48A]">
                    Agent Profile
                  </p>
                  <h1 className="mt-1 break-words text-2xl font-bold sm:text-3xl">
                    {agentName}
                  </h1>
                  <p className="mt-2 break-all text-sm text-white/65">
                    {agent.email || "No email provided"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge status={agent.accountStatus} />
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">
                      Registered {formatDate(agent.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.accountStatus === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAgentAction("approve")}
                      disabled={Boolean(actionKey)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {actionKey === "agent-approve" ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      Approve Agent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAgentAction("reject")}
                      disabled={Boolean(actionKey)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                )}

                {agent.accountStatus !== "suspended" && agent.accountStatus !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => handleAgentAction("suspend")}
                    disabled={Boolean(actionKey)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                  >
                    <UserX size={16} />
                    Suspend
                  </button>
                )}

                {agent.accountStatus === "suspended" && (
                  <button
                    type="button"
                    onClick={() => handleAgentAction("approve")}
                    disabled={Boolean(actionKey)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A75B21] disabled:opacity-50"
                  >
                    <RefreshCw size={16} />
                    Reactivate Agent
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="rounded-2xl border border-[#E8E3D9] bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#172033]">Agent Information</h2>
            <p className="mt-1 text-sm text-slate-500">Contact details and account registration.</p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
            <DetailItem icon={UserRound} label="Full Name" value={agent.name} />
            <DetailItem icon={Mail} label="Email Address" value={agent.email} />
            <DetailItem icon={Phone} label="Phone Number" value={agent.phone} />
            <DetailItem icon={Building2} label="Agency / Business" value={agent.businessName} />
            <DetailItem icon={CalendarDays} label="Registration Date" value={formatDateTime(agent.createdAt)} />
            <DetailItem icon={ShieldCheck} label="Account Status" value={formatLabel(agent.accountStatus)} />
          </div>

          {agent.rejectionReason && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-800">Rejection Reason</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-rose-700">
                {agent.rejectionReason}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}