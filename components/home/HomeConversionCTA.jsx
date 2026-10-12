"use client";

import Link from "next/link";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";

import {
  ArrowRight,
  BedDouble,
  Compass,
  Map,
  MessageCircle,
  PartyPopper,
  Sparkles,
} from "lucide-react";

const getDigits = (value) =>
  String(value || "").replace(/\D/g, "");

const getWhatsAppNumber = (profile) =>
  getDigits(profile?.whatsapp || profile?.phone);

const makeWhatsAppLink = (message, number) => {
  if (!number || number.length < 10 || number.length > 15) {
    return "";
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

const services = [
  {
    title: "Book a Safari",
    subtitle: "Explore the jungle",
    icon: Compass,
    href: "/safari",
    message: "Hi, I want to book a Jim Corbett safari.",
  },
  {
    title: "Find a Stay",
    subtitle: "Resorts & hotels",
    icon: BedDouble,
    href: "/stay",
    message: "Hi, please share resort and stay options in Jim Corbett.",
  },
  {
    title: "Tour Packages",
    subtitle: "Plan your getaway",
    icon: Map,
    href: "/packages",
    message: "Hi, please share Jim Corbett tour packages.",
  },
  {
    title: "Events & Weddings",
    subtitle: "Make it memorable",
    icon: PartyPopper,
    href: "/events",
    message: "Hi, I want to plan an event or wedding in Jim Corbett.",
  },
];

export default function HomeConversionCTA() {
  const { profile, loading } = useOrganisationProfile();

  const whatsappNumber = getWhatsAppNumber(profile);

  const openEnquiry = () => {
    window.dispatchEvent(new Event("open-quick-enquiry"));
  };

  const handleWhatsAppClick = (event, url) => {
    if (loading) {
      event.preventDefault();
      window.alert("Please wait while contact details load.");
      return;
    }

    if (!url) {
      event.preventDefault();
      console.error("Organization Profile API response:", profile);
      window.alert(
        "WhatsApp number nahi mila. Admin Panel ke Organization Profile mein WhatsApp number country code ke saath save karo."
      );
    }
  };

  return (
    <section className="relative z-10 min-w-0 bg-[#F7F5F0]">
      {/* Moving CTA strip */}
      <div className="overflow-hidden bg-[#172033] py-2 sm:py-2">
        <div className="home-cta-marquee flex w-max items-center text-white">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center gap-3 px-2 sm:gap-5"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={openEnquiry}
                  tabIndex={copy === 1 ? -1 : 0}
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-1.5 py-1 text-xs font-semibold sm:text-xs"
                >
                  <Sparkles
                    size={14}
                    className="shrink-0 text-[#E6B47B]"
                  />

                  <span>
                    {index % 2 === 0
                      ? "Your Corbett Escape Starts Here"
                      : "Choose Your Experience — Enquire Now"}
                  </span>

                  <ArrowRight
                    size={14}
                    className="shrink-0 text-[#E6B47B]"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quick conversion section */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        {/* Heading and enquiry button */}
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#B96928] sm:text-[10px]">
              Make Your Move
            </p>

            <h2 className="text-lg font-bold leading-tight text-[#172033] sm:text-2xl">
              What would you like to experience?
            </h2>

            <p className="mt-1 hidden text-xs leading-4 text-gray-600 sm:block">
              Choose your experience and take the next step in seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={openEnquiry}
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#B96928] px-2.5 py-2 text-xs font-bold text-white transition hover:bg-[#9E5720] sm:min-h-9 sm:gap-1.5 sm:px-3"
          >
            <span className="sm:hidden">Enquire</span>
            <span className="hidden sm:inline">Quick Enquiry</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            const whatsappUrl = makeWhatsAppLink(
              service.message,
              whatsappNumber
            );

            return (
              <article
                key={service.title}
                className="group flex min-w-0 flex-col rounded-xl border border-[#E7E1D8] bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#B96928]/50 hover:shadow-md sm:rounded-xl sm:p-3.5"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#B96928]/10 text-[#B96928] sm:mb-2 sm:h-8 sm:w-8">
                  <Icon size={18} />
                </div>

                <h3 className="text-sm font-bold leading-5 text-[#172033] sm:text-sm">
                  {service.title}
                </h3>

                <p className="mt-0.5 text-xs leading-4 text-gray-600 sm:text-xs">
                  {service.subtitle}
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-3 sm:grid-cols-2 sm:gap-2">
                  <Link
                    href={service.href}
                    className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg bg-[#B96928] px-2 py-2 text-xs font-bold text-white transition hover:bg-[#9E5720] sm:min-h-8 sm:text-xs"
                  >
                    Explore
                    <ArrowRight size={13} />
                  </Link>

                  <a
                    href={whatsappUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) =>
                      handleWhatsAppClick(event, whatsappUrl)
                    }
                    aria-label={`WhatsApp about ${service.title}`}
                    className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-gray-200 px-1.5 py-2 text-xs font-semibold text-[#172033] transition hover:border-green-600 hover:text-green-700 sm:min-h-8 sm:px-2 sm:text-xs"
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .home-cta-marquee {
          animation: home-cta-scroll 28s linear infinite;
        }

        .home-cta-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes home-cta-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-cta-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
