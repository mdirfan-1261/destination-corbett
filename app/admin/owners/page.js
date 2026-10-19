"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  CheckCircle2,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { adminApiRequest } from "@/lib/adminApi";

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const json = await adminApiRequest("admin/owners");
      if (json.success && json.data) {
        setOwners(Array.isArray(json.data) ? json.data : json.data.owners || []);
      }
    } catch (err) {
      console.error("Failed to fetch owners:", err);
      setError(err.message || "Failed to load resort owners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  const handleApprove = async (ownerId) => {
    if (!confirm("Are you sure you want to APPROVE this resort owner?")) return;

    setActionLoading(ownerId);
    try {
      const res = await adminApiRequest(`admin/owners/${ownerId}/approve`, {
        method: "PATCH",
      });
      if (res.success) {
        setOwners((prev) =>
          prev.map((o) => (o._id === ownerId ? { ...o, accountStatus: "approved" } : o))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to approve resort owner");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (ownerId) => {
    const reason = prompt("Please enter the reason for rejection:");
    if (!reason || !reason.trim()) return;

    setActionLoading(ownerId);
    try {
      const res = await adminApiRequest(`admin/owners/${ownerId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      if (res.success) {
        setOwners((prev) =>
          prev.map((o) =>
            o._id === ownerId
              ? { ...o, accountStatus: "rejected", rejectionReason: reason.trim() }
              : o
          )
        );
      }
    } catch (err) {
      alert(err.message || "Failed to reject resort owner");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = owners.filter((o) => {
    const matchStatus = filter === "all" ? true : o.accountStatus === filter;
    const matchSearch =
      (o.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.resortName || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.phone || "").includes(search);

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E3DDD2] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#172033]">Resort Owners</h1>
          <p className="text-xs text-[#737987]">
            Review, verify, and approve partner resort owners on Destination Corbett.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchOwners}
          className="inline-flex items-center gap-2 rounded-lg border border-[#DED9CF] bg-white px-3 py-2 text-xs font-semibold text-[#172033] hover:bg-[#F7F5F0]"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
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
            placeholder="Search by name, resort, phone..."
            className="w-full rounded-lg border border-[#DED9CF] bg-white pl-9 pr-3 py-1.5 text-xs text-[#172033] placeholder-[#96938D] focus:border-[#C87532] focus:outline-none"
          />
        </div>
      </div>

      {/* Owners Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E3DDD2] bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F4] border-b border-[#E3DDD2] text-[11px] font-bold uppercase tracking-wider text-[#737987]">
            <tr>
              <th className="px-4 py-3">Owner & Contact</th>
              <th className="px-4 py-3">Resort Details</th>
              <th className="px-4 py-3">Bank Details</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0ECE5]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#737987]">
                  <RefreshCw size={20} className="mx-auto mb-2 animate-spin text-[#C87532]" />
                  Loading resort owners...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#737987]">
                  No resort owners found.
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const isPending = o.accountStatus === "pending";
                const isApproved = o.accountStatus === "approved";

                return (
                  <tr key={o._id} className="hover:bg-[#FCFBF9]">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#172033]">{o.name}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[#596170]">
                        <Mail size={12} /> {o.email}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[#596170]">
                        <Phone size={12} /> {o.phone}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#172033]">
                        {o.resortName || "Not Provided"}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[#596170]">
                        <MapPin size={12} /> {o.city || "Corbett, Uttarakhand"}
                      </div>
                      {o.gstNumber && (
                        <div className="mt-0.5 text-[10px] text-[#737987]">
                          GST: {o.gstNumber}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-[#596170]">
                      {o.bankDetails?.accountNumber ? (
                        <div>
                          <p className="font-medium text-[#172033]">{o.bankDetails.bankName}</p>
                          <p>A/C: {o.bankDetails.accountNumber}</p>
                          <p className="text-[10px]">IFSC: {o.bankDetails.ifscCode}</p>
                        </div>
                      ) : (
                        <span className="text-[#96938D] italic">Not added yet</span>
                      )}
                    </td>

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
                        {o.accountStatus}
                      </span>
                      {o.rejectionReason && (
                        <p className="mt-1 max-w-xs text-[10px] text-red-600">
                          {o.rejectionReason}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              disabled={actionLoading === o._id}
                              onClick={() => handleApprove(o._id)}
                              className="rounded-lg bg-[#32623B] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#254c2d] disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={actionLoading === o._id}
                              onClick={() => handleReject(o._id)}
                              className="rounded-lg bg-[#A33D3D] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#802f2f] disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <span className="text-[11px] font-semibold text-[#32623B] flex items-center gap-1">
                            <CheckCircle2 size={13} /> Active
                          </span>
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