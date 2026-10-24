"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Phone, MessageCircle } from "lucide-react";
import { navigation } from "@/data/navigation";
import EnquiryWidget from "@/components/EnquiryWidget";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const { profile } = useOrganisationProfile();

  const phoneNumber = (profile.phone || "").replace(/[^\d+]/g, "");

  /* WhatsApp number organisation profile se aayega */
  const rawWhatsapp = String(
    profile.whatsapp || profile.whatsappNumber || profile.phone || ""
  ).replace(/\D/g, "");
  const whatsappNumber =
    rawWhatsapp.length === 10 ? `91${rawWhatsapp}` : rawWhatsapp;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        "Hi! I need information about stays and safari in Jim Corbett."
      )}`
    : null;

  /* Bottom nav "Quick Quote" button fires this event */
  useEffect(() => {
    const handler = () => {
      setOpen(false);
      setEnquiryOpen(true);
    };
    window.addEventListener("open-quick-enquiry", handler);
    return () => window.removeEventListener("open-quick-enquiry", handler);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 overflow-visible bg-white/60 dark:bg-[#0e1210]/75 backdrop-blur-2xl border-b border-white/70 dark:border-white/10 shadow-[0_8px_30px_rgba(23,32,51,0.08)] dark:shadow-black/40">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 sm:py-1.5 flex items-center justify-between gap-2">

          {/* ================= LOGO ================= */}
          <Link
            href="/"
            className="flex items-center min-w-0 shrink"
            onClick={() => setOpen(false)}
          >
            <div className="group relative flex items-center gap-2 sm:gap-2.5 cursor-pointer min-w-0">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#B96928] bg-white dark:bg-[#1a1f1c] shadow-sm transition-all duration-300 group-hover:scale-105">
                <img
                  src={profile.logo || "/logo/corbett-logo.jpeg"}
                  alt={`${profile.name || "Destination Corbett"} logo`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/logo/corbett-logo.jpeg";
                  }}
                />
              </div>

              <div className="flex flex-col min-w-0 leading-none">
                <span className="text-[12px] sm:text-xs font-black tracking-[0.08em] sm:tracking-[0.10em] text-[#18352A] dark:text-[#e8f3ec] uppercase whitespace-nowrap">
                  {profile.name
                    ? profile.name.split(" ").slice(0, -1).join(" ") || profile.name
                    : "DESTINATION"}
                </span>

                <span className="mt-0.5 text-[16px] sm:text-[13px] font-black tracking-[0.1em] sm:tracking-[0.12em] text-[#B96928] dark:text-[#E0924F] uppercase whitespace-nowrap">
                  {profile.name?.split(" ").slice(-1)[0] || "CORBETT"}
                </span>

                <span className="mt-1 flex items-center whitespace-nowrap text-[10px] sm:text-[11px] font-semibold tracking-normal text-[#18352A]/80 dark:text-white/70">
                  <span>Stay</span>
                  <span className="mx-0.5 text-[#B96928]">•</span>
                  <span>Resort</span>
                  <span className="mx-0.5 text-[#B96928]">•</span>
                  <span>Safari</span>
                  <span className="mx-0.5 text-[#B96928]">•</span>
                  <span>Events</span>
                </span>
              </div>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION (NO DROPDOWN) ================= */}
          <nav className="hidden min-[1280px]:flex items-center gap-1 text-sm font-semibold">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="
                  flex items-center
                  px-3.5 py-2
                  rounded-full
                  text-[#172033] dark:text-gray-100
                  hover:text-[#C87532] dark:hover:text-[#E0924F]
                  hover:bg-white/50 dark:hover:bg-white/10
                  border border-transparent
                  hover:border-white/80 dark:hover:border-white/15
                  backdrop-blur-xl
                  whitespace-nowrap
                  transition-all duration-300
                "
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* ================= DESKTOP RIGHT ACTION CLUSTER ================= */}
          <div className="hidden min-[1280px]:flex items-center gap-2 shrink-0">
            <Link
              href="/offers"
              className="
                group relative flex items-center gap-1.5
                px-3 py-1.5 rounded-full
                bg-gradient-to-r from-[#1dae63] to-[#C87532]
                text-white text-[11px] font-bold tracking-wide uppercase
                shadow-md shadow-red-500/20
                whitespace-nowrap
                transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:shadow-red-500/30
              "
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
              </span>
              <Sparkles size={12} className="text-white" />
              <span>Offers</span>
              <span className="rounded-full bg-white/25 px-1 py-0.2 text-[9px] font-black text-white">
                %
              </span>
            </Link>

            <div className="h-4 w-px bg-black/10 dark:bg-white/20 mx-0.5" />

            <ThemeToggle />

            

            {/* AGENT LOGIN */}
            <Link
              href="/agent/login"
              className="
                inline-flex items-center justify-center
                rounded-full
                border border-[#B96928]/30
                bg-white/60 dark:bg-white/10
                px-3 py-2
                text-xs font-semibold
                text-[#B96928] dark:text-[#E0924F]
                whitespace-nowrap
                shadow-sm
                hover:bg-[#B96928] hover:text-white
                dark:hover:bg-[#B96928] dark:hover:text-white
                transition-all duration-300
              "
            >
              Agent Login
            </Link>

            {/* ENQUIRE NOW */}
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="
                px-4 py-2
                rounded-full
                bg-[#C87532]
                text-white
                text-xs font-semibold tracking-wide
                whitespace-nowrap
                shadow-md
                hover:bg-[#B96928]
                hover:shadow-lg hover:shadow-[#C87532]/25
                transition-all duration-300
              "
            >
              Enquire Now
            </button>
          </div>

          {/* ================= MOBILE CONTACT + MENU ================= */}
          <div className="min-[1280px]:hidden flex items-center gap-1.5 shrink-0">
            <ThemeToggle />

            

            

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="
                flex items-center justify-center
                h-9 w-9 shrink-0
                rounded-full
                bg-white/50 dark:bg-white/10
                backdrop-blur-xl
                border border-white/80 dark:border-white/15
                text-[#172033] dark:text-gray-100
                shadow-sm
                hover:bg-white/70 dark:hover:bg-white/20
                transition-all
              "
              aria-label="Toggle menu"
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE NAVIGATION (NO DROPDOWN) ================= */}
        {open && (
          <div
            className="
              md:hidden
              mx-2.5 sm:mx-3
              mb-2.5 sm:mb-3
              rounded-2xl sm:rounded-3xl
              bg-white/65 dark:bg-[#161b18]/90
              backdrop-blur-3xl
              border border-white/80 dark:border-white/10
              shadow-[0_20px_50px_rgba(23,32,51,0.15)] dark:shadow-black/50
              overflow-hidden
            "
          >
            <nav className="px-2.5 sm:px-4 py-2.5 sm:py-3">
              {/* MOBILE OFFERS */}
              <div className="pb-2.5 mb-1.5 border-b border-white/50 dark:border-white/10">
                <Link
                  href="/offers"
                  onClick={() => setOpen(false)}
                  className="
                    flex items-center justify-center gap-1.5
                    p-2 sm:p-2.5
                    rounded-xl sm:rounded-2xl
                    bg-gradient-to-r from-[#D9381E] to-[#C87532]
                    text-white
                    text-[11px] sm:text-xs
                    font-bold
                    shadow-md
                  "
                >
                  <Sparkles size={13} />
                  <span>SPECIAL OFFERS (%)</span>
                </Link>
              </div>

              {/* MOBILE NAV ITEMS */}
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="border-b border-white/50 dark:border-white/10 last:border-b-0"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="
                      block
                      py-3 sm:py-4
                      px-2.5 sm:px-3
                      rounded-xl
                      text-[13px] sm:text-sm
                      font-semibold
                      text-[#172033] dark:text-gray-100
                      hover:text-[#C88A3D] dark:hover:text-[#E0924F]
                      hover:bg-white/40 dark:hover:bg-white/10
                      transition-all
                    "
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* MOBILE CTA */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <Link
                href="/agent/login"
                onClick={() => setOpen(false)}
                className="
                  mb-2.5 sm:mb-3
                  flex w-full items-center justify-center
                  rounded-xl sm:rounded-2xl
                  border border-[#B96928]/30
                  bg-white/60 dark:bg-white/5
                  px-4 sm:px-5
                  py-2.5 sm:py-3
                  text-[13px] sm:text-sm
                  font-semibold
                  text-[#B96928] dark:text-[#E0924F]
                  hover:bg-[#B96928] hover:text-white
                  transition-all duration-300
                "
              >
                Agent Login
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEnquiryOpen(true);
                }}
                className="
                  w-full
                  rounded-xl sm:rounded-2xl
                  bg-[#C87532]
                  px-4 sm:px-5
                  py-2.5 sm:py-3
                  text-[13px] sm:text-sm
                  font-semibold tracking-wide
                  text-white
                  shadow-md
                  hover:bg-[#B96928]
                  hover:shadow-lg
                  transition-all
                  text-center
                "
              >
                Enquire Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= HEADER ENQUIRY MODAL ================= */}
      <EnquiryWidget open={enquiryOpen} onOpenChange={setEnquiryOpen} />
    </>
  );
}