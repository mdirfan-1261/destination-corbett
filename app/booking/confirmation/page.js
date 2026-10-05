"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-gray-200 shadow-xl p-8 sm:p-10 text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle
            size={48}
            className="text-green-600"
            strokeWidth={1.8}
          />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C87532]">
          Destination Corbett
        </p>

        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-[#172033]">
          Booking Request Sent
        </h1>

        <p className="mt-4 text-gray-600 leading-7">
          Thank you for your enquiry. Our team will contact you shortly
          to confirm availability and discuss the booking details.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C87532] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B96928]"
          >
            Back to Home
            <ArrowRight size={17} />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-[#172033] transition hover:bg-gray-50"
          >
            Contact Us
          </Link>

        </div>
      </div>
    </main>
  );
}