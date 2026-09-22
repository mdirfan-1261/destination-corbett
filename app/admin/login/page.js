"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  Mail,
  LogIn,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      localStorage.setItem("adminToken", data.token);

      router.push("/admin/dashboard");
    } catch (error) {
      setError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // NOTE: no `overflow-hidden` here anymore — that was clipping/hiding
    // content on short phone screens instead of letting it scroll.
    <main
      className="relative min-h-[100dvh] overflow-x-hidden bg-cover bg-center bg-no-repeat"
      
      
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#18352A]/40" />

      {/* Glow blurs live in their own clipped layer, so they never
          force horizontal scroll / clip real content */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[#C88A3D]/20 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#66734A]/25 blur-3xl sm:h-80 sm:w-80" />
      </div>

      {/* Scrollable content layer */}
      <div className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-[420px]">

          {/* =========================
              HEADING
          ========================== */}
          <div className="mb-5 text-center sm:mb-7">

            {/* Icon */}
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-[#18352A]/75 shadow-xl backdrop-blur-xl sm:mb-4 sm:h-14 sm:w-14">
              <LockKeyhole
                className="text-white"
                size={22}
                strokeWidth={1.8}
              />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Admin Login
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-white/75 sm:mt-2 sm:text-sm">
              Sign in to manage Destination Corbett
            </p>
          </div>

          {/* =========================
              LOGIN CARD
          ========================== */}
          <div className="w-full rounded-[26px] border border-white/60 bg-white/45 p-4 shadow-[0_20px_60px_rgba(24,32,51,0.25)] backdrop-blur-2xl sm:rounded-3xl sm:p-7">

            <form
              onSubmit={handleLogin}
              className="space-y-4 sm:space-y-5"
            >

              {/* =========================
                  EMAIL
              ========================== */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#172033] sm:mb-2 sm:text-sm">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66734A] sm:left-4"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="admin@destinationcorbett.com"
                    required
                    // text-base (16px) on mobile stops iOS Safari from
                    // auto-zooming the page when the input is focused
                    className="h-12 w-full rounded-xl border border-white/70 bg-white/45 pl-10 pr-3 text-base text-[#172033] placeholder:text-gray-400 outline-none backdrop-blur-xl transition-all duration-300 focus:border-[#C88A3D]/70 focus:bg-white/65 focus:ring-4 focus:ring-[#C88A3D]/10 sm:h-auto sm:rounded-2xl sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm"
                  />
                </div>
              </div>

              {/* =========================
                  PASSWORD
              ========================== */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#172033] sm:mb-2 sm:text-sm">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66734A] sm:left-4"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    className="h-12 w-full rounded-xl border border-white/70 bg-white/45 pl-10 pr-3 text-base text-[#172033] placeholder:text-gray-400 outline-none backdrop-blur-xl transition-all duration-300 focus:border-[#C88A3D]/70 focus:bg-white/65 focus:ring-4 focus:ring-[#C88A3D]/10 sm:h-auto sm:rounded-2xl sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm"
                  />
                </div>
              </div>

              {/* =========================
                  ERROR
              ========================== */}
              {error && (
                <div className="rounded-xl border border-red-200/70 bg-red-50/70 px-3 py-2.5 text-xs leading-5 text-red-600 backdrop-blur-xl sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                  {error}
                </div>
              )}

              {/* =========================
                  LOGIN BUTTON
              ========================== */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C88A3D] text-sm font-medium text-white shadow-lg shadow-[#C88A3D]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B77932] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:h-auto sm:rounded-2xl sm:py-3.5"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    Login to Admin
                  </>
                )}
              </button>
            </form>
          </div>

          {/* =========================
              FOOTER
          ========================== */}
          <p className="mt-4 text-center text-[10px] text-white/60 sm:mt-6 sm:text-xs">
            Destination Corbett • Admin Panel
          </p>
        </div>
      </div>
    </main>
  );
}