"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";

import {
  Compass,
  BedDouble,
  Map,
  PartyPopper,
  MessageCircle,
  Phone,
  ArrowUpRight,
  Home,
  Zap,
} from "lucide-react";

/* =========================================================
   ORGANIZATION CONTACT HELPERS
   Contact details come from Organization Profile API.
========================================================= */

const getDigits = (value) =>
  String(value || "").replace(/\D/g, "");

const getContactDetails = (profile) => {
  const phone = String(profile?.phone || "").trim();
  const whatsapp = String(profile?.whatsapp || phone).trim();

  return {
    name: profile?.name || "Destination Corbett",
    phone,
    whatsapp: getDigits(whatsapp),
  };
};

/* =========================================================
   WHATSAPP URL
========================================================= */

export const waLink = (text, number) => {
  const digits = getDigits(number);

  // Require a valid-length number; never generate a local URL.
  if (digits.length < 10 || digits.length > 15) {
    return "";
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

/* =========================================================
   CONTACT FALLBACK HANDLER
========================================================= */

const handleMissingContact = (event, loading, href, type) => {
  if (loading) {
    event.preventDefault();
    window.alert("Please wait while Organization Profile details load.");
    return;
  }

  if (!href) {
    event.preventDefault();
    window.alert(
      `${type} number nahi mila. Admin Panel ke Organization Profile mein valid contact number save karo.`
    );
  }
};

/* =========================================================
   QUICK ACTION SERVICES
========================================================= */

const SERVICES = [
  {
    label: "Book a Safari",
    icon: Compass,
    msg: "Hi, I want to book a Jim Corbett safari.",
  },
  {
    label: "Resort Stay",
    icon: BedDouble,
    msg: "Hi, I want to book a stay in Jim Corbett.",
  },
  {
    label: "Tour Package",
    icon: Map,
    msg: "Hi, please share Jim Corbett tour packages.",
  },
  {
    label: "Events & Weddings",
    icon: PartyPopper,
    msg: "Hi, I want to plan an event or wedding in Jim Corbett.",
  },
];

/* =========================================================
   QUICK ACTIONS
   Place immediately below <Hero /> on the homepage.
========================================================= */

export function QuickActions() {
  const { profile, loading } = useOrganisationProfile();
  const contact = getContactDetails(profile);

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-5 sm:py-8 md:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[2px] text-[#B96928] sm:text-xs">
            QUICK BOOKING
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#172033] sm:text-2xl">
            What do you need?
          </h2>

          <p className="mt-1 text-sm text-gray-600 sm:text-[15px]">
            Choose a service to get started on WhatsApp.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {SERVICES.map(({ label, icon: Icon, msg }) => {
          const whatsappHref = waLink(msg, contact.whatsapp);

          return (
            <a
              key={label}
              href={whatsappHref || undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) =>
                handleMissingContact(
                  event,
                  loading,
                  whatsappHref,
                  "WhatsApp"
                )
              }
              aria-label={`${label} enquiry on WhatsApp`}
              aria-disabled={loading || !whatsappHref}
              className="group flex min-h-[105px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B96928] hover:shadow-md active:scale-[0.98] sm:min-h-[115px] sm:p-4"
            >
              <div className="flex items-center justify-between">
                <Icon
                  size={24}
                  strokeWidth={1.8}
                  className="text-[#B96928]"
                />

                <ArrowUpRight
                  size={17}
                  className="text-gray-400 transition group-hover:text-[#B96928]"
                />
              </div>

              <span className="mt-3 text-sm font-bold leading-tight text-[#172033] sm:text-base">
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   STICKY ACTIONS
   Render once in app/layout.js.
========================================================= */

export function StickyActions() {
  const pathname = usePathname();
  const { profile, loading } = useOrganisationProfile();
  const contact = getContactDetails(profile);

  const openEnquiry = () => {
    window.dispatchEvent(new Event("open-quick-enquiry"));
  };

  const generalMessage =
    "Hi, I need help planning my Jim Corbett trip.";

  const whatsappHref = waLink(
    generalMessage,
    contact.whatsapp
  );

  const phoneDigits = contact.phone.replace(/[^\d+]/g, "");
  const phoneHref = phoneDigits ? `tel:${phoneDigits}` : "";

  const itemBase =
    "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold tracking-wide transition active:scale-95";

  const activeCls = (href) =>
    pathname === href ? "text-[#B96928]" : "text-[#172033]";

  return (
    <>
      {/* MOBILE: BOTTOM NAVIGATION */}

      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
      >
        <div className="mx-auto flex max-w-lg items-end">
          <Link
            href="/"
            className={`${itemBase} ${activeCls("/")}`}
          >
            <Home size={22} strokeWidth={1.8} />
            HOME
          </Link>

          <Link
            href="/stay/resorts"
            className={`${itemBase} ${activeCls("/stay/resorts")}`}
          >
            <BedDouble size={22} strokeWidth={1.8} />
            RESORTS
          </Link>

          {/* RAISED QUICK QUOTE BUTTON */}

          <button
            type="button"
            onClick={openEnquiry}
            aria-label="Get a quick quote"
            className="relative -mt-5 flex flex-1 flex-col items-center justify-center gap-0.5 pb-2 text-[10px] font-bold tracking-wide text-[#172033] active:scale-95"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-t-xl rounded-b-md bg-[#B96928] text-white shadow-lg ring-4 ring-white">
              <Zap size={24} fill="currentColor" />
            </span>

            QUICK QUOTE
          </button>

          {/* PHONE FROM ORGANIZATION PROFILE */}

          <a
            href={phoneHref || undefined}
            onClick={(event) =>
              handleMissingContact(
                event,
                loading,
                phoneHref,
                "Phone"
              )
            }
            aria-label={`Call ${contact.name}`}
            className={`${itemBase} text-[#172033]`}
          >
            <Phone size={22} strokeWidth={1.8} />
            CALL
          </a>

          {/* WHATSAPP FROM ORGANIZATION PROFILE */}

          <a
            href={whatsappHref || undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) =>
              handleMissingContact(
                event,
                loading,
                whatsappHref,
                "WhatsApp"
              )
            }
            aria-label={`Chat with ${contact.name} on WhatsApp`}
            className={`${itemBase} text-[#128C4A]`}
          >
            <MessageCircle size={22} strokeWidth={1.8} />
            WA
          </a>
        </div>
      </nav>

      {/* DESKTOP: FLOATING WHATSAPP BUTTON */}

      <a
        href={whatsappHref || undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) =>
          handleMissingContact(
            event,
            loading,
            whatsappHref,
            "WhatsApp"
          )
        }
        aria-label={`Chat with ${contact.name} on WhatsApp`}
        className="fixed bottom-6 right-6 z-50 hidden md:flex"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#128C4A]/30 motion-reduce:animate-none" />

        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#128C4A] text-white shadow-xl transition hover:scale-105 hover:bg-[#0F783F]">
          <MessageCircle size={26} />
        </span>
      </a>
    </>
  );
}
