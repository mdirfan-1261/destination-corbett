
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  RefreshCw,
  Pencil,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const EMPTY_PROFILE = {
  name: "",
  logo: "",
  email: "",
  phone: "",
  whatsapp: "",
  website: "",
  address: "",
  description: "",
  status: "active",
};

export default function OrganisationProfilePage() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const clearLogoPreview = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview("");
    setSelectedLogo(null);
  };

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      const token = getToken();

      if (!token) {
        setMessage({
          type: "error",
          text: "Admin session not found. Please log in again.",
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/organisation/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

if (!response.ok || !result.success) {
  throw new Error(
    result.message || "Failed to load organization profile."
  );
}

      const data = {
        ...EMPTY_PROFILE,
        ...(result.data || {}),
      };

      setProfile(data);
      setForm(data);
      setLogoPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return "";
      });
      setSelectedLogo(null);
   } catch (error) {
  setMessage({
    type: "error",
    text:
      error.message ||
      "Unable to connect to the server.",
  });
} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogoSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
  setMessage({
    type: "error",
    text: "Please select a JPG, PNG, or WebP logo.",
  });


      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Logo file must be smaller than 2 MB.",
      });

      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setLogoPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return previewUrl;
    });

    setSelectedLogo(file);

    setMessage({
      type: "success",
      text:
        "Logo selected successfully. Please check the preview; it has not been uploaded to the server yet.",
    });

    // Same file ko dobara select karne ki permission.
    event.target.value = "";
  };

  const handleRemoveLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview("");
    setSelectedLogo(null);

    setForm((previous) => ({
      ...previous,
      logo: "",
    }));

    setMessage(null);
  };

  const handleCancel = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview("");
    setSelectedLogo(null);
    setForm(profile);
    setEditing(false);
    setMessage(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Organization name is required.",
      });
      return;
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setSaving(true);

    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin session not found. Please log in again."
        );
      }

      const payload = {
        name: form.name.trim(),
        logo: form.logo.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        website: form.website.trim(),
        address: form.address.trim(),
        description: form.description.trim(),
        status: form.status,
      };

      const response = await fetch(
        `${API_URL}/api/organisation/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save organization profile."
        );
      }

      const updated = {
        ...EMPTY_PROFILE,
        ...(result.data || payload),
      };

      setProfile(updated);
      setForm(updated);

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoPreview("");
      setSelectedLogo(null);
      setEditing(false);

      setMessage({
  type: "success",
  text: selectedLogo
    ? "Profile saved successfully. The newly selected logo has not been uploaded yet."
    : result.message ||
      "Organization profile saved successfully.",
});
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.message ||
  "An error occurred while saving the organization profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 disabled:bg-gray-50 disabled:text-gray-600";

  const fields = [
    {
      name: "name",
      label: "Organization Name",
      placeholder: "Enter organization name",
      icon: Building2,
      required: true,
    },
    {
      name: "email",
      label: "Official Email",
      placeholder: "name@example.com",
      icon: Mail,
      type: "email",
    },
    {
      name: "phone",
      label: "Contact Number",
      placeholder: "Enter contact number",
      icon: Phone,
      type: "tel",
    },
    {
      name: "whatsapp",
      label: "WhatsApp Number",
      placeholder: "Enter WhatsApp number with country code",
      icon: Phone,
      type: "tel",
    },
    {
      name: "website",
      label: "Website",
      placeholder: "https://example.com",
      icon: Globe,
      type: "url",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto mb-3 animate-spin text-[#B96928]"
            size={30}
          />
          <p className="text-sm text-gray-500">
            Loading organization profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/organisation"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#B96928]"
        >
          <ArrowLeft size={17} />
          Back to Overview
        </Link>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B96928]">
              Organization Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Organization Profile
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your organization details and contact information.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadProfile}
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setForm(profile);
                  setEditing(true);
                  setMessage(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#99551F]"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {message && (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />
            )}

            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-3 text-[#B96928]">
                  <Building2 size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-[#172033]">
                    Organization
                  </h2>
                  <p className="text-xs text-gray-500">
                    Profile identity
                  </p>
                </div>
              </div>

              <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
                {logoPreview || form.logo ? (
                  <img
                    src={logoPreview || form.logo}
                    alt="Organization logo preview"
                    className="mb-3 h-24 w-24 rounded-xl border border-gray-200 bg-white p-2 object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="mb-3 rounded-2xl bg-orange-100 p-4 text-[#B96928]">
                    <Building2 size={32} />
                  </div>
                )}

                <p className="break-words font-bold text-[#172033]">
                  {form.name || "Organization Name"}
                </p>

                <span
                  className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    form.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {form.status === "active"
                    ? "Active"
                    : "Inactive"}
                </span>

                {editing && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#99551F]">
                      <Upload size={16} />
                      Choose Logo

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleLogoSelect}
                        className="hidden"
                      />
                    </label>

                    {(logoPreview || form.logo) && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        <X size={15} />
                        Remove
                      </button>
                    )}
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-500">
                  JPG, PNG or WebP · Maximum 2 MB
                </p>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="status"
                  className="text-sm font-semibold text-gray-700"
                >
                  Organization Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={!editing}
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="mt-5 rounded-xl bg-[#F7F5F0] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Last Updated
                </p>

                <p className="mt-2 text-sm font-medium text-[#172033]">
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6">
                <h2 className="font-bold text-[#172033]">
                  Organization Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Official information stored in your database.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                {fields.map((field) => {
                  const FieldIcon = field.icon;

                  return (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <FieldIcon
                          size={16}
                          className="text-[#B96928]"
                        />

                        {field.label}

                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        value={form[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        disabled={!editing}
                        required={field.required}
                        className={inputClass}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="address"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MapPin
                    size={16}
                    className="text-[#B96928]"
                  />
                  Organization Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address || ""}
                  onChange={handleChange}
                  placeholder="Enter complete organization address"
                  disabled={!editing}
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <FileText
                    size={16}
                    className="text-[#B96928]"
                  />
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  placeholder="Write a short organization description"
                  disabled={!editing}
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </div>

              {editing && (
                <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#99551F] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}

                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </section>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Organization details are loaded from the Organisation Profile API.
        </p>
      </div>
    </div>
  );
}
