
"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

const NAVY = "#172033";
const ORANGE = "#B96928";
const GREEN = "#18352A";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  businessAddress: "",
  city: "",
  state: "",
  pincode: "",
  alternatePhone: "",
};

function getStatusDetails(status) {
  switch (String(status || "").toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        description: "Your account has been approved.",
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
        description: "Please contact support for assistance.",
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

function ProfileField({
  label,
  value,
  icon: Icon,
  fullWidth = false,
}) {
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

export default function AgentProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(emptyProfile);
  const [accountStatus, setAccountStatus] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("agentToken");
      const savedUser = localStorage.getItem("agentUser");

      if (!token) {
        router.replace("/agent/login");
        return;
      }

      if (savedUser) {
        const agent = JSON.parse(savedUser);

        setProfile({
          name: agent.name || "",
          email: agent.email || "",
          phone: agent.phone || "",
          businessName: agent.businessName || "",
          businessAddress: agent.businessAddress || "",
          city: agent.city || "",
          state: agent.state || "",
          pincode: agent.pincode || "",
          alternatePhone: agent.alternatePhone || "",
        });

        setAccountStatus(agent.accountStatus || "pending");
        setRejectionReason(agent.rejectionReason || "");
      }
    } catch (err) {
      console.error("Agent profile loading error:", err);
      setError("Unable to load your saved profile details.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("agentToken");
    localStorage.removeItem("agentUser");
    router.replace("/agent/login");
  };

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
      {/*<header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172033] text-white">
              <Building2 size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-wide text-[#172033]">
                DESTINATION CORBETT
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Property Partner Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>*/}

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/agent/dashboard"
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
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Review your personal information, business details and account
            approval status.
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

        <section
          className={`mb-6 rounded-2xl border border-slate-200 p-5 sm:p-6 ${status.bg}`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ${status.color}`}
            >
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

              {accountStatus === "rejected" && rejectionReason && (
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
                <UserRound size={27} />
              </div>

              <h2 className="mt-4 break-words text-xl font-bold">
                {profile.name || "Property Partner"}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-300">
                {profile.email || "Email not provided"}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100">
                <span
                  className={`h-2 w-2 rounded-full ${
                    accountStatus === "approved"
                      ? "bg-green-400"
                      : accountStatus === "rejected" ||
                          accountStatus === "suspended"
                        ? "bg-red-400"
                        : "bg-amber-400"
                  }`}
                />
                {status.label}
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[#B96928]"
                />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {profile.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-[#B96928]"
                />
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2
                  size={18}
                  className="mt-0.5 shrink-0 text-[#B96928]"
                />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Business Name</p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {profile.businessName || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs leading-5 text-slate-500">
                  Need to change your registered email or phone number?
                  Contact the website administrator for assistance.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#172033]">
                Personal & Business Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                These details are currently displayed from your saved account
                information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ProfileField
                label="Full Name"
                value={profile.name}
                icon={UserRound}
              />

              <ProfileField
                label="Registered Email"
                value={profile.email}
                icon={Mail}
              />

              <ProfileField
                label="Primary Phone"
                value={profile.phone}
                icon={Phone}
              />

              <ProfileField
                label="Alternate Phone"
                value={profile.alternatePhone}
                icon={Phone}
              />

              <ProfileField
                label="Business / Property Name"
                value={profile.businessName}
                icon={Building2}
                fullWidth
              />

              <ProfileField
                label="Business Address"
                value={profile.businessAddress}
                icon={MapPin}
                fullWidth
              />

              <ProfileField
                label="City"
                value={profile.city}
                icon={MapPin}
              />

              <ProfileField
                label="State"
                value={profile.state}
                icon={MapPin}
              />

              <ProfileField
                label="PIN Code"
                value={profile.pincode}
                icon={MapPin}
              />
            </div>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Profile updates are not enabled yet
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Your details are read-only on this page. An authenticated
                backend profile endpoint is needed before changes can be
                saved securely.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/agent/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: ORANGE }}
              >
                Back to Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </section>
        </div>

        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Destination Corbett Property Partner Portal</p>
          <p>Secure account access</p>
        </footer>
      </div>
    </main>
  );
}
