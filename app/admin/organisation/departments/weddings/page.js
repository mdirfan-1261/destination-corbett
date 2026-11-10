
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Heart,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Users,
  CalendarDays,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" &&
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "");

/* ================= ADMIN AUTH HEADERS ================= */

const getAdminHeaders = (json = false) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.assign("/admin/login");
    return null;
  }

  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
};

/* ================= HANDLE AUTH ERRORS ================= */

const handleUnauthorized = (status) => {
  if (status === 401) {
    localStorage.removeItem("adminToken");
    window.location.assign("/admin/login");
    return true;
  }

  return false;
};

export default function WeddingPackagesAdmin() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    tier: "silver",
    price: "",
    priceUnit: "Lakhs",
    pax: "100 PAX",
    duration: "2 Nights / 3 Days",
    featured: false,
    order: 1,
    featuresText: "",
  });

  /* ================= FETCH PACKAGES ================= */

  const fetchPackages = useCallback(async () => {
    setLoading(true);

    try {
      const headers = getAdminHeaders();

      if (!headers) return;

      const res = await fetch(
        `${API_BASE}/api/wedding-packages/admin/all`,
        { headers }
      );

      const result = await res.json();

      if (handleUnauthorized(res.status)) return;

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load wedding packages"
        );
      }

      setPackages(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Failed to load packages:", err);
      alert(err.message || "Failed to load wedding packages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  /* ================= OPEN MODAL ================= */

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPkg(pkg);

      setFormData({
        title: pkg.title || "",
        tier: pkg.tier || "silver",
        price: pkg.price ?? "",
        priceUnit: pkg.priceUnit || "Lakhs",
        pax: pkg.pax || "100 PAX",
        duration: pkg.duration || "2 Nights / 3 Days",
        featured: !!pkg.featured,
        order: pkg.order ?? 1,
        featuresText: Array.isArray(pkg.features)
          ? pkg.features.join("\n")
          : "",
      });
    } else {
      setEditingPkg(null);

      setFormData({
        title: "",
        tier: "silver",
        price: "",
        priceUnit: "Lakhs",
        pax: "100 PAX",
        duration: "2 Nights / 3 Days",
        featured: false,
        order: packages.length + 1,
        featuresText:
          "Accommodation\nMeals Included\nWedding Venue\nWedding Services",
      });
    }

    setModalOpen(true);
  };

  /* ================= SAVE PACKAGE ================= */

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);

    const payload = {
      title: formData.title.trim(),
      tier: formData.tier,
      price: formData.price,
      priceUnit: formData.priceUnit,
      pax: formData.pax,
      duration: formData.duration,
      featured: formData.featured,
      order: Number(formData.order) || 1,
      features: formData.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      const headers = getAdminHeaders(true);

      if (!headers) return;

      const url = editingPkg
        ? `${API_BASE}/api/wedding-packages/${editingPkg._id}`
        : `${API_BASE}/api/wedding-packages`;

      const method = editingPkg ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (handleUnauthorized(res.status)) return;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save package");
      }

      setModalOpen(false);
      setEditingPkg(null);

      await fetchPackages();
    } catch (err) {
      console.error("Save package error:", err);
      alert(err.message || "Error saving package");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE PACKAGE ================= */

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this wedding package?"
      )
    ) {
      return;
    }

    try {
      const headers = getAdminHeaders();

      if (!headers) return;

      const res = await fetch(
        `${API_BASE}/api/wedding-packages/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await res.json();

      if (handleUnauthorized(res.status)) return;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete package");
      }

      await fetchPackages();
    } catch (err) {
      console.error("Delete package error:", err);
      alert(err.message || "Error deleting package");
    }
  };

  /* ================= TOGGLE FEATURED ================= */

  const toggleFeatured = async (pkg) => {
    try {
      const headers = getAdminHeaders(true);

      if (!headers) return;

      const res = await fetch(
        `${API_BASE}/api/wedding-packages/${pkg._id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            featured: !pkg.featured,
          }),
        }
      );

      const data = await res.json();

      if (handleUnauthorized(res.status)) return;

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update featured status"
        );
      }

      await fetchPackages();
    } catch (err) {
      console.error("Featured update error:", err);
      alert(err.message || "Failed to update featured status");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 text-[#172033] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B96928]">
              <Heart size={14} className="fill-[#B96928]" />
              Weddings Department
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Wedding Packages Management
            </h1>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Live control over wedding packages, pricing, PAX tiers, and website visibility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchPackages}
              disabled={loading}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#B96928] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#A85C22]"
            >
              <Plus size={14} />
              Add Package
            </button>
          </div>
        </div>

        {/* QUICK STATS */}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-black/5 bg-white p-3 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Total Packages
            </p>

            <p className="mt-1 text-xl font-bold text-[#172033]">
              {packages.length}
            </p>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-3 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Featured Tier
            </p>

            <p className="mt-1 text-xl font-bold text-[#D4A24C]">
              {packages.find((p) => p.featured)?.title || "None"}
            </p>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-3 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Starting At
            </p>

            <p className="mt-1 text-xl font-bold text-[#18352A]">
              ₹{packages[0]?.price ?? "—"}{" "}
              {packages[0]?.price ? packages[0]?.priceUnit || "Lakhs" : ""}
            </p>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-3 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Live Website Status
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Connected & Dynamic
            </p>
          </div>
        </div>

        {/* PACKAGES GRID */}

        {loading ? (
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <RefreshCw size={16} className="animate-spin" />
            Loading wedding packages...
          </div>
        ) : packages.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <Heart className="mx-auto text-[#B96928]" size={28} />

            <h3 className="mt-3 text-base font-bold">
              No Wedding Packages Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first wedding package to display it on the website.
            </p>

            <button
              type="button"
              onClick={() => openModal()}
              className="mt-4 rounded-lg bg-[#B96928] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A85C22]"
            >
              Add First Package
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {packages.map((pkg) => {
              const isGold =
                pkg.tier === "gold" || pkg.featured;

              const isPlatinum = pkg.tier === "platinum";

              return (
                <div
                  key={pkg._id}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all ${
                    isPlatinum
                      ? "border-amber-400/40 bg-gradient-to-b from-[#172033] to-[#0B1220] text-white"
                      : isGold
                      ? "border-[#D4A24C] bg-gradient-to-b from-[#FFFDF8] to-[#FBF3DF] text-[#172033] ring-1 ring-[#D4A24C]/40"
                      : "border-black/10 bg-white text-[#172033]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isPlatinum
                            ? "bg-amber-400 text-slate-900"
                            : isGold
                            ? "bg-[#172033] text-[#F0C46E]"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pkg.title}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleFeatured(pkg)}
                        title="Toggle Most Popular Badge"
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold transition ${
                          pkg.featured
                            ? "bg-[#D4A24C] text-white shadow-xs"
                            : "border border-black/10 text-gray-400 hover:text-gray-700"
                        }`}
                      >
                        <Sparkles size={10} />
                        {pkg.featured ? "Most Popular" : "Set Featured"}
                      </button>
                    </div>

                    {/* PRICE & GUESTS */}

                    <div className="mt-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold">₹</span>

                        <span className="text-3xl font-extrabold tracking-tight">
                          {pkg.price}
                        </span>

                        <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                          {pkg.priceUnit || "Lakhs"}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs opacity-85">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Users size={12} />
                          {pkg.pax}
                        </span>

                        <span>•</span>

                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={12} />
                          {pkg.duration}
                        </span>
                      </div>
                    </div>

                    <hr
                      className={`my-3 ${
                        isPlatinum
                          ? "border-white/10"
                          : "border-black/5"
                      }`}
                    />

                    {/* FEATURES */}

                    <ul className="space-y-1.5 text-xs opacity-90">
                      {pkg.features?.map((f, i) => (
                        <li
                          key={`${pkg._id}-${i}`}
                          className="flex items-center gap-1.5"
                        >
                          <CheckCircle2
                            size={12}
                            className="shrink-0 text-[#D4A24C]"
                          />

                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="mt-5 flex items-center justify-end gap-2 border-t border-black/5 pt-3 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => openModal(pkg)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-black/10 bg-white/10 px-2.5 text-xs font-semibold transition hover:bg-black/5"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(pkg._id)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= CREATE / EDIT MODAL ================= */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 text-[#172033] shadow-2xl">

            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold">
                {editingPkg
                  ? "Edit Wedding Package"
                  : "Create New Wedding Package"}
              </h2>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="mt-4 space-y-3"
            >
              {/* TITLE & TIER */}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600">
                    Title
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g. Gold"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#B96928] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600">
                    Tier Style
                  </label>

                  <select
                    value={formData.tier}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tier: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#B96928] focus:outline-none"
                  >
                    <option value="silver">Silver</option>
                    <option value="gold">Gold (Champagne)</option>
                    <option value="platinum">
                      Platinum (Royal Dark)
                    </option>
                  </select>
                </div>
              </div>

              {/* PRICE & PAX */}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600">
                    Price (in Lakhs)
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value,
                      })
                    }
                    placeholder="e.g. 30"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#B96928] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600">
                    Guest Count (PAX)
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.pax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pax: e.target.value,
                      })
                    }
                    placeholder="e.g. 150 PAX"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#B96928] focus:outline-none"
                  />
                </div>
              </div>

              {/* DURATION */}

              <div>
                <label className="text-[11px] font-semibold text-gray-600">
                  Duration
                </label>

                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: e.target.value,
                    })
                  }
                  placeholder="2 Nights / 3 Days"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#B96928] focus:outline-none"
                />
              </div>

              {/* FEATURES */}

              <div>
                <label className="text-[11px] font-semibold text-gray-600">
                  Included Features (1 per line)
                </label>

                <textarea
                  rows={4}
                  value={formData.featuresText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featuresText: e.target.value,
                    })
                  }
                  placeholder={"Accommodation\nMeals Included\nWedding Venue\nDecor"}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#B96928] focus:outline-none"
                />
              </div>

              {/* FEATURED CHECKBOX */}

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded text-[#B96928] focus:ring-[#B96928]"
                  />

                  Mark as "Most Popular"
                </label>
              </div>

              {/* MODAL ACTIONS */}

              <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#B96928] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#A85C22] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
