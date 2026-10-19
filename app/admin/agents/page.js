"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Building2,
  Wallet,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { adminApiRequest } from "@/lib/adminApi";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected | suspended
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const json = await adminApiRequest("admin/agents");
      if (json.success && json.data) {
        setAgents(Array.isArray(json.data) ? json.data : json.data.agents || []);
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
      setError(err.message || "Failed to load agents list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleApprove = async (agentId) => {
    if (!confirm("Are you sure you want to APPROVE this Travel Agent?")) return;

    setActionLoading(agentId);
    try {
      const res = await adminApiRequest(`admin/agents/${agentId}/approve`, {
        method: "PATCH",
      });
      if (res.success) {
        setAgents((prev) =>
          prev.map((a) => (a._id === agentId ? { ...a, accountStatus: "approved" } : a))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to approve agent");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (agentId) => {
    const reason = prompt("Please enter the reason for rejection:");
    if (!reason || !reason.trim()) return;

    setActionLoading(agentId);
    try {
      const res = await adminApiRequest(`admin/agents/${agentId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      if (res.success) {
        setAgents((prev) =>
          prev.map((a) =>
            a._id === agentId
              ? { ...a, accountStatus: "rejected", rejectionReason: reason.trim() }
              : a
          )
        );
      }
    } catch (err) {
      alert(err.message || "Failed to reject agent");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (agentId) => {
    if (!confirm("Are you sure you want to SUSPEND this agent's account?")) return;

    setActionLoading(agentId);
    try {
      const res = await adminApiRequest(`admin/agents/${agentId}/suspend`, {
        method: "PATCH",
      });
      if (res.success) {
        setAgents((prev) =>
          prev.map((a) => (a._id === agentId ? { ...a, accountStatus: "suspended" } : a))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to suspend agent");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = agents.filter((a) => {
    const matchStatus = filter === "all" ? true : a.accountStatus === filter;
    const matchSearch =
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.businessName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.phone || "").includes(search) ||
      (a.city || "").toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E3DDD2] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#172033]">Agent Management</h1>
          <p className="text-xs text-[#737987]">
            Review, verify travel agents and manage B2B booking access on Destination Corbett.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/agents/commissions"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#B96928] bg-[#FFF8F2] px-3 py-2 text-xs font-semibold text-[#B96928] hover:bg-[#B96928] hover:text-white transition"
          >
            <Wallet size={14} />
            Commission Settings
          </Link>

          <button
            type="button"
            onClick={fetchAgents}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DED9CF] bg-white px-3 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F7F5F0]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected", "suspended"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                filter === tab
                  ? "bg-[#C87532] text-white shadow-sm"
                  : "bg-white border border-[#E3DDD2] text-[#697181] hover:bg-[#F7F5F0]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-[#96938D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agent, agency, phone..."
            className="w-full rounded-lg border border-[#DED9CF] bg-white pl-9 pr-3 py-1.5 text-xs text-[#172033] placeholder-[#96938D] focus:border-[#C87532] focus:outline-none"
          />
        </div>
      </div>

      {/* Agents Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E3DDD2] bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F4] border-b border-[#E3DDD2] text-[11px] font-bold uppercase tracking-wider text-[#737987]">
            <tr>
              <th className="px-4 py-3">Agent & Contact</th>
              <th className="px-4 py-3">Agency / Business</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Account Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0ECE5]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#737987]">
                  <RefreshCw size={20} className="mx-auto mb-2 animate-spin text-[#C87532]" />
                  Loading travel agents...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#737987]">
                  No travel agents found.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const isPending = a.accountStatus === "pending";
                const isApproved = a.accountStatus === "approved";
                const isSuspended = a.accountStatus === "suspended";

                return (
                  <tr key={a._id} className="hover:bg-[#FCFBF9]">
                    {/* Agent & Contact */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#172033]">{a.name}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[#596170]">
                        <Mail size={12} /> {a.email}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[#596170]">
                        <Phone size={12} /> {a.phone}
                      </div>
                    </td>

                    {/* Agency / Business */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#172033]">
                        {a.businessName || "Independent Agent"}
                      </div>
                      <div className="mt-1 text-[11px] text-[#737987]">
                        Joined: {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 text-[#596170]">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{a.city || "Not specified"}</span>
                        {a.state && <span>, {a.state}</span>}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isApproved
                            ? "bg-[#E8F2E8] text-[#32623B]"
                            : isPending
                            ? "bg-[#FFF2DF] text-[#96601F]"
                            : "bg-[#FCEAEA] text-[#A33D3D]"
                        }`}
                      >
                        {a.accountStatus}
                      </span>
                      {a.rejectionReason && (
                        <p className="mt-1 max-w-xs text-[10px] text-red-600">
                          {a.rejectionReason}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              disabled={actionLoading === a._id}
                              onClick={() => handleApprove(a._id)}
                              className="rounded-lg bg-[#32623B] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#254c2d] disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={actionLoading === a._id}
                              onClick={() => handleReject(a._id)}
                              className="rounded-lg bg-[#A33D3D] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#802f2f] disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <button
                            type="button"
                            disabled={actionLoading === a._id}
                            onClick={() => handleSuspend(a._id)}
                            className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        )}

                        {isSuspended && (
                          <button
                            type="button"
                            disabled={actionLoading === a._id}
                            onClick={() => handleApprove(a._id)}
                            className="rounded-lg bg-[#32623B] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#254c2d] disabled:opacity-50"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}