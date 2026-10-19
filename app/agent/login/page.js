
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { agentApiRequest } from "@/lib/agentApi";

export default function AgentLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const result = await agentApiRequest("agent/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Backend response: result.data.token and result.data.agent
      const token = result?.data?.token;
      const agent = result?.data?.agent;

      if (!token) {
        throw new Error(
          "Login response did not contain an authentication token."
        );
      }

      // Save authentication session only once.
      localStorage.setItem("agentToken", token);

      if (agent) {
        localStorage.setItem("agentUser", JSON.stringify(agent));
      } else {
        localStorage.removeItem("agentUser");
      }

      // Navigate to the dashboard after successful login.
      router.replace("/agent/dashboard");
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full min-h-[48px] rounded-md border border-[#DED9CF] bg-white px-3.5 py-3 text-[14px] text-[#172033] outline-none placeholder:text-[#96938D] transition-colors hover:border-[#BDB5A8] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10";

  const labelClass =
    "mb-2 block text-[12px] font-semibold tracking-[0.01em] text-[#354052]";

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#596170] transition-colors hover:text-[#B96928]"
        >
          <ArrowLeft size={16} />
          Back to Destination Corbett
        </Link>

        <div className="overflow-hidden rounded-xl border border-[#E3DDD2] bg-white shadow-[0_12px_40px_rgba(23,32,51,0.055)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* Brand panel */}
            <aside className="flex flex-col justify-between bg-[#172033] px-6 py-8 text-white sm:px-9 sm:py-10 lg:px-10 lg:py-12">
              <div>
                <Link href="/" className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B96928]">
                    <Building2 size={21} strokeWidth={1.8} />
                  </span>

                  <span className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-[0.2em]">
                      DESTINATION
                    </span>
                    <span className="mt-1 text-[18px] font-bold leading-none tracking-[0.04em]">
                      CORBETT
                    </span>
                  </span>
                </Link>

                <div className="mt-12 border-l-2 border-[#C88A3D] pl-4 sm:mt-16">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8AC79]">
                    Partner Portal
                  </p>

                  <h1 className="mt-4 text-[32px] font-semibold leading-[1.2] tracking-[-0.035em] sm:text-[39px]">
                    Welcome
                    <span className="mt-1 block text-[#D8AC79]">
                      back.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-sm text-[13px] leading-6 text-[#D1D6DF]">
                    Sign in to access your property dashboard, manage room
                    availability and keep track of your bookings.
                  </p>
                </div>

                <div className="mt-10 border-t border-white/15">
                  <div className="flex gap-3 border-b border-white/10 py-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.07] text-[#D8AC79]">
                      <Building2 size={18} />
                    </span>

                    <div>
                      <p className="text-[13px] font-semibold">
                        Your property workspace
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#B9C1CE]">
                        Access your property and room information.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 py-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.07] text-[#D8AC79]">
                      <ShieldCheck size={18} />
                    </span>

                    <div>
                      <p className="text-[13px] font-semibold">
                        Secure partner access
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#B9C1CE]">
                        Account access follows the administrator approval
                        process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/15 pt-5">
                <p className="text-[11px] leading-5 text-[#B9C1CE]">
                  Property publication is subject to a separate administrator
                  review.
                </p>
              </div>
            </aside>

            {/* Login form */}
            <section className="flex min-w-0 flex-col justify-center px-5 py-9 sm:px-9 sm:py-12 lg:px-12">
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B96928]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B96928]">
                    Partner sign in
                  </p>
                </div>

                <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.04em] text-[#172033] sm:text-[32px]">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-[#697181]">
                  Enter the email address and password associated with your
                  partner account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858B95]"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={updateField}
                      placeholder="you@example.com"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="text-[12px] font-semibold text-[#354052]"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858B95]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={form.password}
                      onChange={updateField}
                      placeholder="Enter your password"
                      className={`${inputClass} pl-11 pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#747B86] transition-colors hover:text-[#B96928]"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B96928] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#99531F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in to dashboard"}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#EAE5DC]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#96938D]">
                  New partner
                </span>
                <div className="h-px flex-1 bg-[#EAE5DC]" />
              </div>

              <Link
                href="/agent/register"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#D8D0C4] bg-white px-5 py-3 text-[13px] font-semibold text-[#172033] transition-colors hover:border-[#B96928] hover:bg-[#FCFAF7]"
              >
                Create a partner account
                <ArrowRight size={16} className="text-[#B96928]" />
              </Link>

              <div className="mt-7 flex items-start gap-2.5 rounded-md bg-[#F7F5F0] p-3.5">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-[#B96928]"
                />
                <p className="text-[11px] leading-5 text-[#697181]">
                  New accounts require administrator approval. If your account
                  is pending, follow the status provided by the server.
                </p>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-5 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] text-[#858B95]">
          <span>Destination Corbett</span>
          <span aria-hidden="true">·</span>
          <span>Property Partner Portal</span>
        </footer>
      </div>
    </main>
  );
}
