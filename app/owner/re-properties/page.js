"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Home, MapPin, IndianRupee, Eye, Pencil, Trash2,
  Clock, CheckCircle2, XCircle, RefreshCw, AlertCircle,
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

const STATUS_STYLES = {
  draft:    "bg-slate-100 text-slate-600",
  pending:  "bg-amber-100 text-amber-700",
  listed:   "bg-emerald-100 text-emerald-700",
  sold:     "bg-blue-100 text-blue-700",
  rented:   "bg-purple-100 text-purple-700",
  rejected: "bg-rose-100 text-rose-700",
};

const STATUS_ICONS = {
  draft:   Clock,
  pending: Clock,
  listed:  CheckCircle2,
  sold:    CheckCircle2,
  rented:  CheckCircle2,
  rejected:XCircle,
};

function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function OwnerREPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [deleting, setDeleting]     = useState(null);

  const fetchProperties = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("ownerToken");
      const res = await fetch(`${API_BASE}/api/re/properties/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch.");
      setProperties(data.properties || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this property?")) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem("ownerToken");
      const res = await fetch(`${API_BASE}/api/re/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProperties(p => p.filter(x => x._id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Properties</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your real estate listings</p>
        </div>
        <Link
          href="/owner/re-properties/new"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
        >
          <Plus size={18} /> Add Property
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchProperties} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <RefreshCw size={20} className="animate-spin" /> Loading...
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Home size={28} className="text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg">No properties yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">Add your first property to get started</p>
          <Link href="/owner/re-properties/new"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
            <Plus size={16} /> Add Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map(p => {
            const StatusIcon = STATUS_ICONS[p.status] || Clock;
            return (
              <div key={p._id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {/* Image */}
                <div className="h-44 bg-slate-100 relative">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} alt={p.title}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home size={40} className="text-slate-300" />
                    </div>
                  )}
                  <span className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[p.status] || "bg-slate-100 text-slate-600"}`}>
                    <StatusIcon size={12} />
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{p.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin size={12} /> {p.city || "Location not set"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-lg font-bold text-emerald-700">
                      <IndianRupee size={16} />{formatPrice(p.price)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                      {p.transactionType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {p.bedrooms > 0 && <span>{p.bedrooms} BHK</span>}
                    {p.areaSqft > 0 && <span>• {p.areaSqft} sqft</span>}
                    <span className="capitalize">• {p.propertyType}</span>
                  </div>

                  {p.status === "rejected" && p.rejectionReason && (
                    <p className="text-xs text-rose-600 bg-rose-50 rounded-lg p-2">
                      ❌ {p.rejectionReason}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link href={`/owner/re-properties/${p._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                      <Eye size={14} /> View
                    </Link>
                    {["draft","pending","rejected"].includes(p.status) && (
                      <Link href={`/owner/re-properties/${p._id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition">
                        <Pencil size={14} /> Edit
                      </Link>
                    )}
                    {["draft","pending","rejected"].includes(p.status) && (
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50">
                        {deleting === p._id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}