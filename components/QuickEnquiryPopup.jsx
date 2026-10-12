
"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  BedDouble,
  Map,
  PartyPopper,
  MessageCircle,
  Minus,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";

import { waLink } from "./ConversionKit";

const OPTIONS = [
  {
    label: "Book a Safari",
    icon: Compass,
    intro: "I want to book a safari",
  },
  {
    label: "Resort Stay",
    icon: BedDouble,
    intro: "I want to book a resort stay",
  },
  {
    label: "Tour Package",
    icon: Map,
    intro: "I want a tour package",
  },
  {
    label: "Events & Weddings",
    icon: PartyPopper,
    intro: "I want to plan an event or wedding",
  },
];

const getLocalToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const buildMessage = (option, name, guests, date) => {
  const parts = [
    `Hi, ${option.intro} in Jim Corbett.`,
  ];

  if (name.trim()) {
    parts.push(`Name: ${name.trim()}.`);
  }

  parts.push(`Guests: ${guests}.`);

  if (date) {
    const [year, month, day] = date.split("-");
    parts.push(`Preferred date: ${day}/${month}/${year}.`);
  }

  parts.push("Please share the details and available options.");

  return parts.join(" ");
};

export default function QuickEnquiryPopup() {
  const [show, setShow] = useState(false);
  const [option, setOption] = useState(null);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");

  // Sticky Enquiry button se popup open hoga.
  useEffect(() => {
    const openPopup = () => {
      setOption(null);
      setShow(true);
    };

    window.addEventListener("open-quick-enquiry", openPopup);

    return () => {
      window.removeEventListener("open-quick-enquiry", openPopup);
    };
  }, []);

  // Escape key se popup close hoga.
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShow(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  if (!show) return null;

  const today = getLocalToday();

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-gray-400 focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/15";

  const closePopup = () => {
    setShow(false);
  };

  const sendMessage = () => {
    if (!option) return;

    if (date && date < today) return;

    const message = buildMessage(option, name, guests, date);

    // WhatsApp ko user ke click par open karo.
    window.open(waLink(message), "_blank", "noopener,noreferrer");

    setShow(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:p-4 md:items-center"
      onClick={closePopup}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-enquiry-title"
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-7 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close enquiry"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
        >
          <X size={19} />
        </button>

        {!option ? (
          <>
            <div className="mb-5 pr-9">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B96928]">
                Destination Corbett
              </p>

              <h2
                id="quick-enquiry-title"
                className="text-2xl font-bold leading-tight text-[#172033]"
              >
                Plan your Corbett trip
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Choose a service and get details directly on WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {OPTIONS.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setOption(item)}
                    className="group flex min-h-[112px] flex-col items-start justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-[#B96928] hover:bg-orange-50/50 active:scale-[0.98]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B96928]/10 text-[#B96928] transition group-hover:bg-[#B96928] group-hover:text-white">
                      <Icon size={21} />
                    </span>

                    <span className="mt-3 text-sm font-semibold leading-5 text-[#172033]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <MessageCircle size={15} className="text-green-600" />
              Quick enquiry through WhatsApp
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOption(null)}
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#B96928] hover:underline"
            >
              <ArrowLeft size={17} />
              Back to services
            </button>

            <div className="mb-5 pr-8">
              <h2
                id="quick-enquiry-title"
                className="text-2xl font-bold text-[#172033]"
              >
                {option.label}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Add your details or send your enquiry directly.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="enquiry-name"
                  className="mb-2 block text-sm font-semibold text-[#172033]"
                >
                  Your name <span className="font-normal text-gray-400">(optional)</span>
                </label>

                <input
                  id="enquiry-name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172033]">
                  Number of guests
                </label>

                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Guests
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      aria-label="Remove one guest"
                      disabled={guests <= 1}
                      onClick={() =>
                        setGuests((current) => Math.max(1, current - 1))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#172033] transition hover:border-[#B96928] hover:text-[#B96928] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-5 text-center text-sm font-bold text-[#172033]">
                      {guests}
                    </span>

                    <button
                      type="button"
                      aria-label="Add one guest"
                      disabled={guests >= 50}
                      onClick={() =>
                        setGuests((current) => Math.min(50, current + 1))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#172033] transition hover:border-[#B96928] hover:text-[#B96928] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="enquiry-date"
                  className="mb-2 block text-sm font-semibold text-[#172033]"
                >
                  Preferred date <span className="font-normal text-gray-400">(optional)</span>
                </label>

                <input
                  id="enquiry-date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={sendMessage}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-900/10 transition hover:bg-[#9E5720] active:scale-[0.99]"
              >
                <MessageCircle size={19} />
                Continue on WhatsApp
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Your enquiry opens in WhatsApp. You can review the message before sending it.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
