"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Phone,
  MessageCircle,
} from "lucide-react";
import { navigation } from "@/data/navigation";
import EnquiryWidget from "@/components/EnquiryWidget";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const phoneNumber = "+919205299338";
  const whatsappNumber = "919205299338";

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 overflow-visible bg-white/60 backdrop-blur-2xl border-b border-white/70 shadow-[0_8px_30px_rgba(23,32,51,0.08)]">
        {/* ================= NAVBAR CONTAINER ================= */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-5 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2">

          {/* ================= LOGO ================= */}
          <Link
            href="/"
            className="flex items-center min-w-0 shrink"
            onClick={() => setOpen(false)}
          >
            <div className="group relative flex items-center gap-1 sm:gap-2 cursor-pointer min-w-0">

              {/* LOGO IMAGE */}
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#C87532] shadow-sm transition-all duration-300 group-hover:scale-105">
                <img
                  src="/logo/corbett-logo.jpeg"
                  alt="Destination Corbett"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* LOGO TEXT */}
  <div className="flex flex-col min-w-0 leading-none">
  <span className="text-[8px] xs:text-[9px] sm:text-xs font-black tracking-[0.06em] sm:tracking-[0.10em] text-[#18352A] uppercase truncate">
  DESTINATION
</span>

  <span className="mt-0.5 text-[9px] xs:text-[10px] sm:text-[11px] font-black tracking-[0.09em] sm:tracking-[0.12em] text-[#B96928] uppercase truncate">
    CORBETT
  </span>
</div>

            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">

            {navigation.map((item) => (
              <div key={item.name} className="relative group">

                <Link
                  href={item.href}
                  className="
                    flex items-center gap-1
                    px-3.5 py-2
                    rounded-full
                    text-[#172033]
                    hover:text-[#C87532]
                    hover:bg-white/50
                    border border-transparent
                    hover:border-white/80
                    backdrop-blur-xl
                    whitespace-nowrap
                    transition-all
                    duration-300
                  "
                >
                  {item.name}

                  {item.dropdown && (
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {/* ================= DESKTOP DROPDOWN ================= */}
                {item.dropdown && (
                  <div
                    className="
                      absolute
                      left-1/2
                      -translate-x-1/2
                      top-full
                      pt-3
                      opacity-0
                      invisible
                      translate-y-2
                      group-hover:opacity-100
                      group-hover:visible
                      group-hover:translate-y-0
                      transition-all
                      duration-300
                    "
                  >
                    <div
                      className={
                        item.name === "Events"
                          ? `
                            w-[520px]
                            rounded-3xl
                            bg-white/60
                            backdrop-blur-3xl
                            border border-white/80
                            shadow-[0_20px_60px_rgba(23,32,51,0.16)]
                            p-4
                          `
                          : `
                            w-64
                            rounded-2xl
                            bg-white/60
                            backdrop-blur-3xl
                            border border-white/80
                            shadow-[0_20px_50px_rgba(23,32,51,0.14)]
                            p-2
                          `
                      }
                    >
                      {item.name === "Events" ? (
                        <>
                          <div className="px-4 pt-2 pb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#C88A3D] font-semibold">
                              Events
                            </p>

                            <h3 className="text-xl font-semibold text-[#172033] mt-1">
                              Create unforgettable experiences
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="
                                  group/item
                                  rounded-2xl
                                  px-4 py-4
                                  bg-white/35
                                  hover:bg-white/75
                                  border border-white/40
                                  hover:border-white/90
                                  shadow-sm
                                  hover:shadow-md
                                  transition-all
                                  duration-300
                                "
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-semibold text-[#172033] group-hover/item:text-[#C87532] transition">
                                    {dropdownItem.name}
                                  </span>

                                  <span className="text-[#C88A3D] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">
                                    →
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <Link
                            href="/events"
                            className="
                              mt-3
                              flex
                              items-center
                              justify-between
                              rounded-2xl
                              bg-[#172033]/90
                              backdrop-blur-xl
                              border border-white/20
                              text-white
                              px-5 py-4
                              shadow-lg
                              hover:bg-[#172033]
                              hover:shadow-xl
                              transition-all
                              duration-300
                            "
                          >
                            <div>
                              <p className="text-sm font-semibold">
                                Plan your event in Jim Corbett
                              </p>

                              <p className="text-xs text-white/60 mt-1">
                                Meetings • Retreats • Conferences • Celebrations
                              </p>
                            </div>

                            <span className="text-xl">↗</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="
                                block
                                px-4 py-3
                                rounded-xl
                                text-sm
                                font-medium
                                text-[#172033]
                                hover:bg-white/70
                                hover:text-[#C87532]
                                hover:shadow-sm
                                transition-all
                                duration-200
                              "
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ))}

          </nav>

          {/* ================= DESKTOP RIGHT ACTION CLUSTER ================= */}
          <div className="hidden md:flex items-center gap-2 shrink-0">

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

            <div className="h-4 w-px bg-black/10 mx-0.5" />

            {/* ENQUIRE NOW */}
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="
                px-4 py-2
                rounded-full
                bg-[#C87532]
                text-white
                text-xs
                font-semibold
                tracking-wide
                whitespace-nowrap
                shadow-md
                hover:bg-[#B96928]
                hover:shadow-lg
                hover:shadow-[#C87532]/25
                transition-all
                duration-300
              "
            >
              Enquire Now
            </button>
          </div>

          {/* ================= MOBILE CONTACT + MENU ================= */}
          {/* ================= MOBILE CONTACT + MENU ================= */}
<div className="md:hidden flex items-center gap-1 sm:gap-1.5 shrink-0">

  {/* CALL */}
  <a
    href={`tel:${phoneNumber}`}
    aria-label="Call Destination Corbett"
    className="
      flex items-center justify-center
      h-8 w-8
      sm:h-9 sm:w-9
      shrink-0
      rounded-full
      bg-white/60
      backdrop-blur-xl
      border border-white/80
      text-[#172033]
      shadow-sm
      hover:bg-white/80
      hover:text-[#C87532]
      transition-all
    "
  >
    <Phone
      size={16}
      className="sm:w-[18px] sm:h-[18px]"
      strokeWidth={2.2}
    />
  </a>

  {/* WHATSAPP */}
  <a
    href={`https://wa.me/${whatsappNumber}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="
      flex items-center justify-center
      h-8 w-8
      sm:h-9 sm:w-9
      shrink-0
      rounded-full
      bg-white/60
      backdrop-blur-xl
      border border-white/80
      shadow-sm
      hover:bg-white/80
      transition-all
    "
  >
    <MessageCircle
      size={17}
      className="sm:w-[19px] sm:h-[19px] text-[#25D366]"
      strokeWidth={2.2}
    />
  </a>

  {/* MOBILE MENU */}
  <button
    type="button"
    onClick={() => setOpen(!open)}
    className="
      flex items-center justify-center
      h-8 w-8
      sm:h-9 sm:w-9
      shrink-0
      rounded-full
      bg-white/50
      backdrop-blur-xl
      border border-white/80
      text-[#172033]
      shadow-sm
      hover:bg-white/70
      transition-all
    "
    aria-label="Toggle menu"
  >
    {open ? (
      <X
        size={20}
        className="sm:w-[21px] sm:h-[21px]"
      />
    ) : (
      <Menu
        size={20}
        className="sm:w-[21px] sm:h-[21px]"
      />
    )}
  </button>

</div>
        </div>

        {/* ================= MOBILE NAVIGATION ================= */}
        {open && (
          <div
            className="
              md:hidden
              mx-2.5 sm:mx-3
              mb-2.5 sm:mb-3
              rounded-2xl sm:rounded-3xl
              bg-white/65
              backdrop-blur-3xl
              border border-white/80
              shadow-[0_20px_50px_rgba(23,32,51,0.15)]
              overflow-hidden
            "
          >
            <nav className="px-2.5 sm:px-4 py-2.5 sm:py-3">

              {/* MOBILE OFFERS */}
              <div className="pb-2.5 mb-1.5 border-b border-white/50">
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
                  className="border-b border-white/50 last:border-b-0"
                >
                  <div className="flex items-center justify-between">

                    <Link
                      href={item.href}
                      onClick={() => {
                        if (!item.dropdown) {
                          setOpen(false);
                        }
                      }}
                      className="
                        flex-1
                        py-3 sm:py-4
                        px-2.5 sm:px-3
                        rounded-xl
                        text-[13px] sm:text-sm
                        font-semibold
                        text-[#172033]
                        hover:text-[#C88A3D]
                        hover:bg-white/40
                        transition-all
                      "
                    >
                      {item.name}
                    </Link>

                    {item.dropdown && (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileDropdown(
                            mobileDropdown === item.name
                              ? null
                              : item.name
                          )
                        }
                        className="
                          p-2 sm:p-3
                          rounded-xl
                          text-[#172033]
                          hover:bg-white/50
                          transition
                        "
                        aria-label={`Toggle ${item.name} menu`}
                      >
                        <ChevronDown
                          size={17}
                          className={`
                            transition-transform
                            duration-300
                            ${
                              mobileDropdown === item.name
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />
                      </button>
                    )}

                  </div>

                  {/* MOBILE DROPDOWN */}
                  {item.dropdown &&
                    mobileDropdown === item.name && (
                      <div
                        className="
                          mx-2 sm:mx-3
                          mb-2.5 sm:mb-3
                          p-1.5 sm:p-2
                          rounded-xl sm:rounded-2xl
                          bg-white/40
                          backdrop-blur-xl
                          border border-white/60
                        "
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            onClick={() => setOpen(false)}
                            className="
                              block
                              px-3 py-2.5 sm:px-4 sm:py-3
                              rounded-lg sm:rounded-xl
                              text-[13px] sm:text-sm
                              text-gray-700
                              hover:bg-white/60
                              hover:text-[#C88A3D]
                              transition-all
                            "
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}

            </nav>

            {/* MOBILE CTA */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">

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
                  font-semibold
                  tracking-wide
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
      <EnquiryWidget
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
      />
    </>
  );
}