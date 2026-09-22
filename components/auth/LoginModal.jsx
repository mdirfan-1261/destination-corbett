"use client";

import { X } from "lucide-react";

export default function LoginModal({ onClose, onSignup }) {
  return (
   <div className="fixed inset-0 z-[9999] bg-[#172033]/40 px-4 overflow-y-auto">
      
  <div className="min-h-full flex items-center justify-center py-8">

    <div className="
      relative
      w-full
      max-w-md
      rounded-3xl
      bg-white/55
      backdrop-blur-3xl
      border border-white/70
      p-8
      shadow-[0_25px_80px_rgba(23,32,51,0.25)]
    ">

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-500 hover:text-[#172033]"
          >
            <X size={22} />
          </button>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D]">
              B2B PARTNER
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#172033]">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Login to manage your Corbett requirements.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#C88A3D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#C88A3D]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#172033] py-3.5 font-semibold text-white transition hover:bg-[#C88A3D]"
            >
              Login
            </button>

          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}

            <button
              type="button"
              onClick={onSignup}
              className="font-semibold text-[#C88A3D] hover:underline"
            >
              Sign Up
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}