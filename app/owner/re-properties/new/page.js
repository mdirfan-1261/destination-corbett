"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home, MapPin, IndianRupee, Info, CheckCircle2, ArrowLeft, Loader2,
} from "lucide-react";
import Link from "next/link";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

// Owner token ko dhundhta hai: pehle "ownerToken", phir koi bhi key
// jisme "owner" aur "token" dono ho. Quotes hata deta hai.
function getOwnerToken() {
  if (typeof window === "undefined") return null;

  const clean = (v) => {
    if (!v) return null;
    let t = v.trim();
    if (t.startsWith('"') && t.endsWith('"')) {
      try { t = JSON.parse(t); } catch { t = t.slice(1, -1); }
    }
    return t && t !== "null" && t !== "undefined" ? t : null;
  };

  const direct = clean(localStorage.getItem("destin_owner_token"));
  if (direct) return direct;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (/owner/i.test(key) && /token/i.test(key)) {
      const t = clean(localStorage.getItem(key));
      if (t) return t;
    }
  }

  console.warn("Owner token nahi mila. localStorage keys:", Object.keys(localStorage));
  return null;
}

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "house", label: "House" },
  { value: "plot", label: "Plot / Land" },
  { value: "commercial", label: "Commercial" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "studio", label: "Studio" },
];

const FURNISHED = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "fully-furnished", label: "Fully Furnished" },
];

const EMPTY = {
  title: "", description: "", propertyType: "", transactionType: "",
  price: "", address: "", city: "", state: "", pincode: "",
  areaSqft: "", bedrooms: "", bathrooms: "", parking: false,
  furnished: "unfurnished", amenities: "", priceNegotiable: true,
};

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function AddREPropertyPage() {
  const router = useRouter();
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = getOwnerToken();
      if (!token) {
        throw new Error("Owner login nahi mila. Please owner account se dobara login karein.");
      }

      const body = {
        ...form,
        price: Number(form.price),
        areaSqft: Number(form.areaSqft) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        amenities: form.amenities.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${API_BASE}/api/re/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      // Agar server HTML bhej de to crash na ho
      let data = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }

      if (res.status === 401) {
        throw new Error(
          (data.message || "Session invalid.") + " (Owner account se dobara login karke try karein.)"
        );
      }
      if (!res.ok) throw new Error(data.message || `Failed to submit (${res.status}).`);

      setSuccess(true);
      setTimeout(() => router.push("/owner/re-properties"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
        <CheckCircle2 size={32} className="text-emerald-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">Property Submitted!</h2>
      <p className="text-slate-500 mt-2">Admin will review and approve your property.</p>
      <p className="text-xs text-slate-400 mt-4">Redirecting to My Properties...</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/owner/re-properties"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Add New Property</h1>
        <p className="text-sm text-slate-500 mt-1">Fill in the details — Admin will review before listing.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <Home size={18} /> Basic Information
          </h2>
          <div>
            <label className="text-sm font-medium text-slate-700">Property Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. 3BHK Apartment in Noida Sector 62"
              className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Property Type *</label>
              <select value={form.propertyType} onChange={e => set("propertyType", e.target.value)}
                className={inputCls} required>
                <option value="">Select type</option>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Transaction Type *</label>
              <select value={form.transactionType} onChange={e => set("transactionType", e.target.value)}
                className={inputCls} required>
                <option value="">Select</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="lease">For Lease</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="Describe your property..." className={inputCls} />
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <IndianRupee size={18} /> Pricing
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="e.g. 5000000" className={inputCls} required min={0} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.priceNegotiable}
                  onChange={e => set("priceNegotiable", e.target.checked)}
                  className="h-4 w-4 rounded" />
                <span className="text-sm font-medium text-slate-700">Price Negotiable</span>
              </label>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <MapPin size={18} /> Location
          </h2>
          <div>
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input value={form.address} onChange={e => set("address", e.target.value)}
              placeholder="Street address" className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">City</label>
              <input value={form.city} onChange={e => set("city", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">State</label>
              <input value={form.state} onChange={e => set("state", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Pincode</label>
              <input value={form.pincode} onChange={e => set("pincode", e.target.value)} className={inputCls} />
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <Info size={18} /> Property Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Area (sqft)</label>
              <input type="number" value={form.areaSqft}
                onChange={e => set("areaSqft", e.target.value)} className={inputCls} min={0} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Bedrooms</label>
              <input type="number" value={form.bedrooms}
                onChange={e => set("bedrooms", e.target.value)} className={inputCls} min={0} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Bathrooms</label>
              <input type="number" value={form.bathrooms}
                onChange={e => set("bathrooms", e.target.value)} className={inputCls} min={0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Furnished Status</label>
              <select value={form.furnished} onChange={e => set("furnished", e.target.value)}
                className={inputCls}>
                {FURNISHED.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.parking}
                  onChange={e => set("parking", e.target.checked)} className="h-4 w-4 rounded" />
                <span className="text-sm font-medium text-slate-700">Parking Available</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Amenities (comma separated)</label>
            <input value={form.amenities} onChange={e => set("amenities", e.target.value)}
              placeholder="e.g. Gym, Pool, Security, Lift" className={inputCls} />
          </div>
        </section>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60">
          {loading
            ? <><Loader2 size={18} className="animate-spin" /> Submitting...</>
            : "Submit Property for Review"}
        </button>
      </form>
    </div>
  );
}