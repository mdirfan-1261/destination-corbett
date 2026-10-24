"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Binoculars,
  Camera,
  CheckCircle2,
  Compass,
  Handshake,
  Heart,
  MessageCircle,
  PenLine,
  Send,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";

// =====================================================
// CONTENT
// =====================================================

const creatorTypes = [
  { icon: Camera, title: "Photographers", text: "Forest, resort and golden-hour stories." },
  { icon: Video, title: "Reel Creators", text: "Short, scroll-stopping travel videos." },
  { icon: PenLine, title: "Travel Bloggers", text: "Guides, itineraries and honest reviews." },
  { icon: Users, title: "Influencers", text: "Introduce your audience to Corbett." },
];

const opportunities = [
  { icon: BedDouble, title: "Stay stories", text: "Experience our resorts and share your stay." },
  { icon: Binoculars, title: "Safari stories", text: "Jeep, canter and forest-zone adventures." },
  { icon: Heart, title: "Wedding & events", text: "Destination weddings in the wild." },
  { icon: Compass, title: "Local Corbett", text: "Food, culture, trails and hidden spots." },
];

const ideas = [
  "Sunrise jungle safari reel",
  "Riverside stay walkthrough",
  "Corbett weekend itinerary",
  "Destination wedding highlights",
  "Wildlife photography diary",
  "Local food & village trail",
];

const steps = [
  { n: "1", title: "Share", text: "Your profile and idea" },
  { n: "2", title: "Discuss", text: "We review and reply" },
  { n: "3", title: "Create", text: "Plan the collaboration" },
];

const platforms = ["Instagram", "YouTube", "Facebook", "Blog / Website", "Multiple", "Other"];

const initialForm = {
  name: "",
  phone: "",
  platform: "Instagram",
  handle: "",
  followers: "",
  message: "",
};

// =====================================================
// PAGE
// =====================================================

export default function CollabPage() {
  const { profile } = useOrganisationProfile();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const rawNumber = String(
    profile?.whatsapp ||
      profile?.whatsappNumber ||
      profile?.whatsapp_number ||
      profile?.phone ||
      profile?.contactNumber ||
      ""
  );

  let whatsappNumber = rawNumber.replace(/\D/g, "");
  if (whatsappNumber.startsWith("0091")) whatsappNumber = whatsappNumber.slice(2);
  if (whatsappNumber.length === 10) whatsappNumber = `91${whatsappNumber}`;

  const hasWhatsApp = whatsappNumber.length >= 11 && whatsappNumber.length <= 15;

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSubmitted(false);
  };

  const updateField = (e) => setField(e.target.name, e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!hasWhatsApp) {
      setError(
        "The organisation WhatsApp number is not configured correctly. Please contact the administrator."
      );
      return;
    }

    const message = [
      "Hello Destination Corbett Team! 👋",
      "",
      "I would like to collaborate with Destination Corbett.",
      "",
      `Name: ${form.name.trim()}`,
      `Contact Number: ${form.phone.trim()}`,
      `Platform: ${form.platform}`,
      `Profile / Handle: ${form.handle.trim()}`,
      `Followers / Monthly Views: ${form.followers.trim() || "Not provided"}`,
      "",
      "My Collaboration Idea:",
      form.message.trim() ||
        "I would love to discuss collaboration opportunities with your team.",
      "",
      "Please let me know if we can discuss this further.",
      "",
      "Thank you!",
      form.name.trim(),
    ].join("\n");

    const url =
      `https://api.whatsapp.com/send?phone=${whatsappNumber}` +
      `&text=${encodeURIComponent(message)}`;

    const newWindow = window.open(url, "_blank");

    if (!newWindow) {
      window.location.assign(url);
      return;
    }

    setSubmitted(true);
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-[#E7E1D8] bg-[#FCFBF8] px-3 py-2 text-sm text-[#172033] outline-none transition placeholder:text-gray-400 focus:border-[#B96928] focus:bg-white focus:ring-2 focus:ring-[#B96928]/15";

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-5 sm:py-4 md:px-6">
        {/* ================= PREMIUM COMPACT HERO ================= */}
        <section className="relative overflow-hidden rounded-2xl bg-[#172033] px-5 py-5 text-white shadow-[0_18px_50px_rgba(23,32,51,0.25)] sm:px-8 sm:py-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#B96928]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#E0924F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0924F]/70 to-transparent" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/65 transition hover:text-white"
              >
                <ArrowLeft size={13} />
                Home
              </Link>

              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E0924F] backdrop-blur">
                <Sparkles size={12} />
                Creator Collaboration
              </div>

              <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                Tell Corbett&apos;s story{" "}
                <span className="bg-gradient-to-r from-[#E0924F] to-[#F3C58F] bg-clip-text text-transparent">
                  your way.
                </span>
              </h1>

              <p className="mt-2 hidden text-sm leading-6 text-white/75 sm:block">
                Photographers, reel creators, bloggers and influencers — partner
                with Destination Corbett for stays, safaris, weddings and local
                experiences.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 md:items-end">
              <a
                href="#collab-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#B96928]/30 transition hover:bg-[#A85C22]"
              >
                Propose a Collaboration
                <ArrowRight size={15} />
              </a>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70">
                {["Creator-friendly", "Flexible proposals", "Reply on WhatsApp"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-[#E0924F]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTENT + FORM ================= */}
        <div className="mt-3 grid items-start gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT: CONTENT */}
          <div className="space-y-3 sm:space-y-4">
            {/* Who */}
            <section className="rounded-2xl border border-[#EAE4DA] bg-white p-4 shadow-sm sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B96928]">
                Who can collaborate
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {creatorTypes.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="group rounded-xl border border-[#F0EBE2] bg-[#FCFBF8] p-3 transition hover:-translate-y-0.5 hover:border-[#B96928]/30 hover:shadow-md"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B96928]/10 text-[#B96928] transition group-hover:bg-[#B96928] group-hover:text-white">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-2 text-sm font-bold leading-tight">{title}</h3>
                    <p className="mt-0.5 text-xs leading-4 text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* What we can explore */}
            <section className="rounded-2xl border border-[#EAE4DA] bg-white p-4 shadow-sm sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B96928]">
                What we can explore together
              </p>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {opportunities.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl bg-[#F7F5F0] p-3">
                    <Icon size={19} className="mt-0.5 shrink-0 text-[#B96928]" />
                    <div>
                      <h3 className="text-sm font-bold leading-tight">{title}</h3>
                      <p className="mt-0.5 text-xs leading-4 text-gray-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
                Content ideas we love
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {ideas.map((idea) => (
                  <span
                    key={idea}
                    className="rounded-full border border-[#B96928]/20 bg-[#B96928]/5 px-2.5 py-1 text-xs font-medium text-[#8F4E1B]"
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </section>

            {/* Steps */}
            <section className="rounded-2xl bg-[#172033] p-4 text-white shadow-sm sm:p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {steps.map((s) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E0924F]/50 bg-[#E0924F]/10 text-sm font-bold text-[#E0924F]">
                      {s.n}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold leading-tight">{s.title}</h3>
                      <p className="text-xs text-white/65">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/60">
                Every proposal is reviewed individually. Deliverables and any commercial terms are
                discussed and confirmed before the collaboration begins.
              </p>
            </section>
          </div>

          {/* RIGHT: FORM */}
          <section
            id="collab-form"
            className="scroll-mt-4 rounded-2xl border border-[#E8E0D5] bg-white p-4 shadow-[0_15px_45px_rgba(23,32,51,0.08)] sm:p-5 lg:sticky lg:top-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B96928]/10 text-[#B96928]">
                <Handshake size={19} />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">Send your proposal</h2>
                <p className="text-xs text-gray-500">Opens WhatsApp with your message ready.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-3 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="name" className="text-xs font-semibold">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.name}
                    onChange={updateField}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-xs font-semibold">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    minLength={7}
                    maxLength={20}
                    value={form.phone}
                    onChange={updateField}
                    placeholder="Contact number"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Platform: chips instead of a dropdown */}
              <div>
                <span className="text-xs font-semibold">Primary Platform *</span>
                <div className="mt-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Primary platform">
                  {platforms.map((p) => {
                    const selected = form.platform === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setField("platform", p)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          selected
                            ? "border-[#172033] bg-[#172033] text-white"
                            : "border-[#E7E1D8] bg-white text-gray-600 hover:border-[#B96928]/50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="handle" className="text-xs font-semibold">
                    Profile Link / Handle *
                  </label>
                  <input
                    id="handle"
                    name="handle"
                    type="text"
                    required
                    maxLength={300}
                    value={form.handle}
                    onChange={updateField}
                    placeholder="@handle or URL"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="followers" className="text-xs font-semibold">
                    Followers / Views
                  </label>
                  <input
                    id="followers"
                    name="followers"
                    type="text"
                    maxLength={100}
                    value={form.followers}
                    onChange={updateField}
                    placeholder="e.g. 25K followers"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-semibold">
                  Your Idea
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={2000}
                  value={form.message}
                  onChange={updateField}
                  placeholder="What would you like to create with us?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              {submitted && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-xs leading-5 text-green-800"
                >
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <span>
                    WhatsApp has opened with your proposal. Please review the message and press <strong>Send</strong>.
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B96928] to-[#D17F36] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#B96928]/25 transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#B96928]/40 focus:ring-offset-2"
              >
                <MessageCircle size={18} />
                Send Proposal on WhatsApp
                <Send size={14} />
              </button>

              <p className="text-center text-[11px] leading-4 text-gray-500">
                Your proposal is sent only when you press Send in WhatsApp.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}