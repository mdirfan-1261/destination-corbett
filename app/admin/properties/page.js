"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Hotel,
  Globe,
  MapPin,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import { adminApiRequest } from "@/lib/adminApi";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const json = await adminApiRequest("admin/properties");
      if (json.success && json.data) {
        setProperties(
          Array.isArray(json.data) ? json.data : json.data.properties || []
        );
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleReview = async (propertyId, decision) => {
    let reason = "";
    if (decision === "reject") {
      reason = prompt("Please enter the reason for rejection:") || "";
      if (!reason.trim()) return;
    }

    if (!confirm(`Are you sure you want to ${decision.toUpperCase()} this property?`)) {
      return;
    }

    setActionLoading(propertyId);
    try {
      const res = await adminApiRequest(`admin/properties/${propertyId}/review`, {
        method: "PATCH",
        body: JSON.stringify({ decision, reason: reason.trim() }),
      });

      if (res.success) {
        setProperties((prev) =>
          prev.map((p) =>
            p._id === propertyId
              ? {
                  ...p,
                  propertyStatus: decision === "approve" ? "approved" : "rejected",
                  rejectionReason: reason.trim(),
                }
              : p
          )
        );
      }
    } catch (err) {
      alert(err.message || "Failed to review property");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePublish = async (propertyId, currentStatus) => {
    const nextStatus = currentStatus === "published" ? "unpublished" : "published";

    setActionLoading(propertyId);
    try {
      const res = await adminApiRequest(
        `admin/properties/${propertyId}/publication`,
        {
          method: "PATCH",
          body: JSON.stringify({ publicationStatus: nextStatus }),
        }
      );

      if (res.success) {
        setProperties((prev) =>
          prev.map((p) =>
            p._id === propertyId ? { ...p, publicationStatus: nextStatus } : p
          )
        );
      }
    } catch (err) {
      alert(err.message || "Failed to update publication");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = properties.filter((p) => {
    const matchStatus = filter === "all" ? true : p.propertyStatus === filter;
    const matchSearch =
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E3DDD2] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#172033]">Property Approvals</h1>
          <p className="text-xs text-[#737987]">
            Review resort submissions, approve listings, and publish them live to tourists.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchProperties}
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
          {["all", "pending", "approved", "draft", "rejected"].map((tab) => (
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
            placeholder="Search resort name or city..."
            className="w-full rounded-lg border border-[#DED9CF] bg-white pl-9 pr-3 py-1.5 text-xs text-[#172033] placeholder-[#96938D] focus:border-[#C87532] focus:outline-none"
          />
        </div>
      </div>

      {/* Properties Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E3DDD2] bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F4] border-b border-[#E3DDD2] text-[11px] font-bold uppercase tracking-wider text-[#737987]">
            <tr>
              <th className="px-4 py-3">Property Name</th>
              <th className="px-4 py-3">Type & City</th>
              <th className="px-4 py-3">Owner / Partner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Live Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0ECE5]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#737987]">
                  <RefreshCw size={20} className="mx-auto mb-2 animate-spin text-[#C87532]" />
                  Loading properties...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#737987]">
                  No properties found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const isApproved = p.propertyStatus === "approved";
                const isPending = p.propertyStatus === "pending";
                const isPublished = p.publicationStatus === "published";

                return (
                  <tr key={p._id} className="hover:bg-[#FCFBF9]">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#172033]">{p.name}</div>
                      <div className="text-[11px] text-[#737987]">{p.contactPhone || "No contact"}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="capitalize font-semibold text-[#172033]">{p.propertyType || "Resort"}</span>
                      <div className="mt-0.5 flex items-center gap-1 text-[#596170]">
                        <MapPin size={12} /> {p.city || "Corbett"}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-[#596170]">
                      {p.ownerId?.name || p.agentId?.name || "Resort Owner"}
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
                        {p.propertyStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        disabled={!isApproved || actionLoading === p._id}
                        onClick={() => handleTogglePublish(p._id, p.publicationStatus)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                          isPublished
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title={!isApproved ? "Must approve property before publishing" : "Toggle live status"}
                      >
                        <Globe size={12} />
                        {isPublished ? "Live (Published)" : "Unpublished"}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              disabled={actionLoading === p._id}
                              onClick={() => handleReview(p._id, "approve")}
                              className="rounded-lg bg-[#32623B] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#254c2d] disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={actionLoading === p._id}
                              onClick={() => handleReview(p._id, "reject")}
                              className="rounded-lg bg-[#A33D3D] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#802f2f] disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <button
                            type="button"
                            disabled={actionLoading === p._id}
                            onClick={() => handleReview(p._id, "reject")}
                            className="rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Revoke
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