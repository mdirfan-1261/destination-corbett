
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Pencil,
  Save,
  X,
  RefreshCw,
} from "lucide-react";

const ORANGE = "#B96928";
const NAVY = "#172033";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  resortName: "",
  resortAddress: "",
  city: "Ramnagar",
  gstNumber: "",
};

function getStatusDetails(status) {
  switch (String(status || "").toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        description: "Your owner account has been approved.",
        icon: CheckCircle2,
        color: "text-green-700",
        bg: "bg-green-50",
      };

    case "rejected":
      return {
        label: "Rejected",
        description: "Please review the rejection reason below.",
        icon: ShieldCheck,
        color: "text-red-700",
        bg: "bg-red-50",
      };

    case "suspended":
      return {
        label: "Suspended",
        description: "Please contact the administrator for assistance.",
        icon: ShieldCheck,
        color: "text-red-700",
        bg: "bg-red-50",
      };

    default:
      return {
        label: "Pending Approval",
        description:
          "Your account is awaiting admin approval. Some features may remain unavailable until approval.",
        icon: Clock3,
        color: "text-amber-800",
        bg: "bg-amber-50",
      };
  }
}

async function ownerApi(path, token, options = {}) {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const baseUrl = configuredUrl.replace(/\/+$/, "").replace(/\/api$/i, "");
  const response = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const text = await response.text();
  let result;

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned a non-JSON response (HTTP ${response.status}). ${text
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 180)}`
    );
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Request failed with HTTP ${response.status}.`
    );
  }

  return result;
}

function ProfileField({ label, value, icon: Icon, fullWidth = false }) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <div className="flex min-h-[48px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Icon size={17} className="shrink-0 text-slate-400" />
        <p className="min-w-0 break-words text-sm font-medium text-slate-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = "text",
  fullWidth = false,
  maxLength,
  required = false,
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
      >
        {label}
      </label>
      <div className="flex min-h-[48px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-[#B96928] focus-within:ring-2 focus-within:ring-orange-100">
        <Icon size={17} className="shrink-0 text-slate-400" />
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          maxLength={maxLength}
          required={required}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none"
        />
      </div>
    </div>
  );
}

export default function OwnerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);
  const [accountStatus, setAccountStatus] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem("destin_owner_token");
    router.replace("/owner/login");
  }, [router]);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    try {
      setError("");
      const result = await ownerApi("/owner/auth/me", token);
      const owner = result?.data?.owner || result?.owner || result?.data;

      if (!owner || typeof owner !== "object") {
        throw new Error("Owner profile data was not returned by the server.");
      }

      const nextProfile = {
        name: owner.name || "",
        email: owner.email || "",
        phone: owner.phone || "",
        resortName: owner.resortName || "",
        resortAddress: owner.resortAddress || "",
        city: owner.city || "Ramnagar",
        gstNumber: owner.gstNumber || "",
      };

      setProfile(nextProfile);
      setOriginalProfile(nextProfile);
      setAccountStatus(owner.accountStatus || "pending");
      setRejectionReason(owner.rejectionReason || "");
    } catch (err) {
      if (
        /invalid or expired|unauthorized|authentication token|jwt expired/i.test(
          err.message
        )
      ) {
        logout();
        return;
      }

      setError(err.message || "Unable to load your owner profile.");
    } finally {
      setLoading(false);
    }
  }, [logout, router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  }

  function cancelEditing() {
    setProfile(originalProfile);
    setEditing(false);
    setError("");
    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();

    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      logout();
      return;
    }

    if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim()) {
      setError("Name, email and phone are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await ownerApi("/owner/auth/me", token, {
        method: "PATCH",
        body: JSON.stringify({
          name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
          resortName: profile.resortName.trim(),
          resortAddress: profile.resortAddress.trim(),
          city: profile.city.trim(),
          gstNumber: profile.gstNumber.trim(),
        }),
      });

      const owner = result?.data?.owner || result?.owner || result?.data;

      if (owner && typeof owner === "object") {
        const updatedProfile = {
          name: owner.name || "",
          email: owner.email || "",
          phone: owner.phone || "",
          resortName: owner.resortName || "",
          resortAddress: owner.resortAddress || "",
          city: owner.city || "Ramnagar",
          gstNumber: owner.gstNumber || "",
        };

        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
        setAccountStatus(owner.accountStatus || accountStatus);
        setRejectionReason(owner.rejectionReason || rejectionReason);
      } else {
        const updatedProfile = { ...profile };
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
      }

      setEditing(false);
      setSuccess(result.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const status = getStatusDetails(accountStatus);
  const StatusIcon = status.icon;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-5">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#B96928]" />
          <p className="text-sm text-slate-600">Loading your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/owner/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#B96928]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B96928]">
            Account Settings
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            My Owner Profile
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Manage your personal information and resort business details.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            {success}
          </div>
        )}

        <section className={`mb-6 rounded-2xl border border-slate-200 p-5 sm:p-6 ${status.bg}`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ${status.color}`}>
              <StatusIcon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`text-base font-bold ${status.color}`}>
                  {status.label}
                </h2>
                <span className="rounded-full border border-current/15 bg-white/70 px-2.5 py-1 text-[11px] font-semibold">
                  Account Status
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {status.description}
              </p>
              {String(accountStatus).toLowerCase() === "rejected" && rejectionReason && (
                <div className="mt-3 rounded-xl border border-red-200 bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Review Reason
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.75fr_1.5fr]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#172033] px-5 py-6 text-white sm:px-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Building2 size={27} />
              </div>
              <h2 className="mt-4 break-words text-xl font-bold">
                {profile.name || "Resort Owner"}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-300">
                {profile.email || "Email not provided"}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100">
                <span
                  className={`h-2 w-2 rounded-full ${
                    String(accountStatus).toLowerCase() === "approved"
                      ? "bg-green-400"
                      : ["rejected", "suspended"].includes(
                          String(accountStatus).toLowerCase()
                        )
                      ? "bg-red-400"
                      : "bg-amber-400"
                  }`}
                />
                {status.label}
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[#B96928]" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {profile.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[#B96928]" />
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 size={18} className="mt-0.5 shrink-0 text-[#B96928]" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Resort / Property</p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {profile.resortName || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs leading-5 text-slate-500">
                  Your account status is managed by the Destination Corbett administrator.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#172033]">
                  Personal & Resort Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {editing
                    ? "Update your details and save your changes."
                    : "Your current details saved in your owner account."}
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setEditing(true);
                  }}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 text-sm font-semibold text-[#B96928] transition hover:bg-orange-50"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputField label="Full Name" name="name" value={profile.name} onChange={handleChange} icon={UserRound} maxLength={100} required />
                  <InputField label="Registered Email" name="email" value={profile.email} onChange={handleChange} icon={Mail} type="email" maxLength={150} required />
                  <InputField label="Primary Phone" name="phone" value={profile.phone} onChange={handleChange} icon={Phone} maxLength={15} required />
                  <InputField label="GST Number" name="gstNumber" value={profile.gstNumber} onChange={handleChange} icon={ShieldCheck} maxLength={20} />
                  <InputField label="Resort / Property Name" name="resortName" value={profile.resortName} onChange={handleChange} icon={Building2} maxLength={150} fullWidth />
                  <InputField label="Resort Address" name="resortAddress" value={profile.resortAddress} onChange={handleChange} icon={MapPin} maxLength={500} fullWidth />
                  <InputField label="City" name="city" value={profile.city} onChange={handleChange} icon={MapPin} maxLength={100} />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: ORANGE }}
                  >
                    {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={cancelEditing}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <ProfileField label="Full Name" value={profile.name} icon={UserRound} />
                  <ProfileField label="Registered Email" value={profile.email} icon={Mail} />
                  <ProfileField label="Primary Phone" value={profile.phone} icon={Phone} />
                  <ProfileField label="GST Number" value={profile.gstNumber} icon={ShieldCheck} />
                  <ProfileField label="Resort / Property Name" value={profile.resortName} icon={Building2} fullWidth />
                  <ProfileField label="Resort Address" value={profile.resortAddress} icon={MapPin} fullWidth />
                  <ProfileField label="City" value={profile.city} icon={MapPin} />
                </div>
              </>
            )}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <Link
                href="/owner/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                Back to Dashboard
              </Link>

              <button
                type="button"
                onClick={logout}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </section>
        </div>

        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Destination Corbett Resort Owner Portal</p>
          <p>Secure account access</p>
        </footer>
      </div>
    </main>
  );
}
