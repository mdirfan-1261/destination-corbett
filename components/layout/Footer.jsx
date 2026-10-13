"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "Stay", href: "/stay" },
  { name: "Safari", href: "/safari" },
  { name: "Packages", href: "/packages" },
  { name: "About Us", href: "/about" },
];

const serviceLinks = [
  { name: "Events", href: "/events" },
  { name: "Destination Weddings", href: "/weddings" },
  { name: "Transportation", href: "/transport" },
  { name: "Add Your Property", href: "/add-property" },
  { name: "Contact Us", href: "/contact" },
];
const socials = [
  {
    label: "Texora AI on LinkedIn",
    href: "https://www.linkedin.com/company/texora-ai/",
    style: { backgroundColor: "#0A66C2" },
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          fill="#fff"
          d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.25 6.94 1.97 1.97 0 0 0 5.25 3ZM20.44 13.41c0-3.46-1.84-5.07-4.3-5.07-1.98 0-2.87 1.09-3.36 1.86V8.5H9.4V20h3.38v-6.4c0-1.69.32-3.33 2.42-3.33 2.07 0 2.1 1.94 2.1 3.44V20h3.38l-.24-6.59Z"
        />
      </svg>
    ),
  },
  {
    label: "Texora AI on YouTube",
    href: "https://www.youtube.com/@Texoraai",
    style: { backgroundColor: "#FF0000" },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Destination Corbett on Instagram",
    href: "https://www.instagram.com/destination_corbett?stkn=NzIxMG1ndmd5Zg%3D%3D",
    style: {
      background:
        "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 75%, #515BD4 100%)",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          fill="#fff"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
  },
  {
    label: "Texora AI on Facebook",
    href: "https://www.facebook.com/texoraaiCX/",
    style: { backgroundColor: "#1877F2" },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M14 8h3V4h-3c-3.314 0-5 1.686-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.552.448-1 1-1z" />
      </svg>
    ),
  },
];

function FooterHeading({ children }) {
  return (
    <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#E0924F]">
      {children}
    </h3>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-0 text-sm text-white/65 transition-all duration-200 hover:text-white sm:text-[15px]"
    >
      <span className="h-px w-0 bg-[#C87532] transition-all duration-200 group-hover:mr-2 group-hover:w-3" />
      {children}
    </Link>
  );
}

function ContactRow({ icon: Icon, children, align = "center" }) {
  return (
    <div className={`flex gap-3 ${align === "start" ? "items-start" : "items-center"}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#E0924F]">
        <Icon size={16} />
      </span>
      <div className="min-w-0 text-sm leading-6 text-white/70 sm:text-[15px]">
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const { profile } = useOrganisationProfile();

  const phoneLink = (profile.phone || "").replace(/[^\d+]/g, "");
  const waLink = `https://wa.me/${phoneLink.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hi Destination Corbett, I would like to plan a trip."
  )}`;

  return (
    <footer className="relative overflow-hidden bg-[#172033] pb-20 text-white md:pb-0 dark:border-t dark:border-white/10 dark:bg-[#0a1226]">
      {/* top accent line + soft glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C87532]/70 to-transparent" />
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#C87532]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        {/* ============ CTA BAND ============ */}
        {/*{profile.phone && (
          <div className="mb-12 flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-r from-[#C87532]/25 via-white/5 to-transparent p-5 sm:mb-14 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <h3 className="text-lg font-bold sm:text-xl">
                Planning your Jim Corbett trip?
              </h3>
              <p className="mt-1 text-sm text-white/65">
                Tell us your dates and we&apos;ll share the best stay and safari options.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:shrink-0">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/20 transition hover:scale-105"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>

              <a
                href={`tel:${phoneLink}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </div>
        )}*/}
        {/* ============ MAIN GRID ============ */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-x-8">

          {/* BRAND */}
          <div className="col-span-2 min-w-0 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#C87532]/40 bg-white p-0.5 shadow-md dark:bg-white">
                <img
                  src="/logo/corbett-logo.webp"
                  alt="Destination Corbett"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="whitespace-nowrap text-xl font-black leading-none tracking-tight sm:text-2xl">
                  Destination <span className="text-[#C87532]">Corbett</span>
                </p>
                <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
                  Wild Safari &amp; Luxury Stays
                </span>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65 sm:text-[15px]">
              Your complete Jim Corbett experience partner for stays, safaris,
              events and destination weddings.
            </p>

            {/* SOCIALS */}
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={s.style}
                  className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* EXPLORE */}
          <div className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <div className="space-y-3">
              {exploreLinks.map((l) => (
                <FooterLink key={l.name} href={l.href}>
                  {l.name}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          {/* SERVICES */}
<div className="lg:col-span-2">
  <FooterHeading>Services</FooterHeading>

  <div className="space-y-3">
    {serviceLinks.map((link) => (
      <FooterLink key={link.name} href={link.href}>
        {link.name}
      </FooterLink>
    ))}
  </div>
</div>

          {/* CONTACT — Organization Profile API */}
          <div className="col-span-2 min-w-0 lg:col-span-4">
            <FooterHeading>Contact</FooterHeading>

            <div className="space-y-4">
              {profile.address && (
                <ContactRow icon={MapPin} align="start">
                  <p>{profile.address}</p>
                </ContactRow>
              )}

              {profile.phone && (
                <ContactRow icon={Phone}>
                  <a
                    href={`tel:${phoneLink}`}
                    className="transition-colors hover:text-[#E0924F]"
                  >
                    {profile.phone}
                  </a>
                </ContactRow>
              )}

              {profile.email && (
                <ContactRow icon={Mail}>
                  <a
                    href={`mailto:${profile.email}`}
                    className="break-all transition-colors hover:text-[#E0924F]"
                  >
                    {profile.email}
                  </a>
                </ContactRow>
              )}

              {!profile.phone && !profile.email && !profile.address && (
                <Link
                  href="/contact"
                  className="text-sm text-white/70 transition-colors hover:text-[#E0924F]"
                >
                  Contact Us
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ============ BOTTOM BAR ============ */}
        <div className="mt-12 flex flex-col items-center gap-1.5 border-t border-white/10 pt-6 text-center text-xs leading-6 text-white/45 sm:mt-14 sm:flex-row sm:justify-between sm:text-sm">
          <p>
            © {new Date().getFullYear()} Destination Corbett. All rights reserved.
          </p>

          <p>
            Developed by{" "}
            <a
              href="https://texora.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 transition-colors hover:text-[#E0924F]"
            >
              Texora.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}