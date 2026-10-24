
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  CalendarDays,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";

const OFFERS = [
  {
    id: 1,
    featured: true,
    category: "Stay",
    title: "Early Bird Stay",
    subtitle: "Plan ahead and save on your Corbett stay.",
    badge: "20% OFF",
    price: "₹4,999",
    was: "₹6,250",
    unit: "per night · 2 guests",
    valid: "Till 31 Dec 2026",
    code: "EARLY20",
    items: [
      "Breakfast & dinner included",
      "Free cancellation up to 7 days before",
      "Late check-out till 2 PM",
    ],
  },
  {
    id: 2,
    category: "Safari",
    title: "Stay + Jeep Safari",
    subtitle: "A complete Corbett escape in one package.",
    badge: "2N / 3D",
    price: "₹14,500",
    was: "₹17,000",
    unit: "per person · twin sharing",
    valid: "15 Nov 2026 – 15 Jun 2027",
    code: "SAFARI2N",
    items: ["2 nights deluxe room", "1 jeep safari", "All meals & pickup"],
  },
  {
    id: 3,
    category: "Weekend",
    title: "Weekend Getaway",
    subtitle: "A quick jungle break for your weekend.",
    badge: "₹1,500 OFF",
    price: "₹6,499",
    was: "₹7,999",
    unit: "per night · 2 guests",
    valid: "Every Fri – Sun",
    code: "WKND1500",
    items: ["Bonfire evening", "Welcome drink", "Breakfast included"],
  },
  {
    id: 4,
    category: "Wedding",
    title: "Destination Wedding",
    subtitle: "A complete celebration surrounded by nature.",
    badge: "FREE DÉCOR",
    price: "On request",
    was: "",
    unit: "50+ guests",
    valid: "Nov – Mar",
    code: "WEDCORBETT",
    items: [
      "Mandap & stage décor",
      "10 complimentary rooms",
      "Dedicated event manager",
    ],
  },
];

const TABS = ["All", "Stay", "Safari", "Weekend", "Wedding"];

const STEPS = [
  {
    number: "01",
    title: "Choose an offer",
    text: "Pick the package that matches your stay or celebration.",
  },
  {
    number: "02",
    title: "Share your dates",
    text: "Send your travel dates and guest count with the offer code.",
  },
  {
    number: "03",
    title: "We confirm",
    text: "Our team confirms availability and the final rate.",
  },
];

const TERMS = [
  ["Can I combine two offers?", "No. One offer applies per booking."],
  [
    "Are taxes included?",
    "Prices are before GST. Applicable taxes are added at booking.",
  ],
  [
    "Are there blackout dates?",
    "Long weekends and festival dates may be excluded. Confirm your dates with our team.",
  ],
  [
    "What is the cancellation policy?",
    "Cancellation terms depend on the selected offer. Check the inclusions before booking.",
  ],
];

const orange = "#B96928";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B96928]";

/* ----------------------------------------
   Organisation contact helpers
----------------------------------------- */

function getDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function getIndianOrInternationalNumber(value) {
  let number = getDigits(value);

  if (number.startsWith("00")) {
    number = number.slice(2);
  }

  if (number.length === 10) {
    number = `91${number}`;
  }

  return number;
}

function makeWhatsAppUrl(number, message) {
  if (!number) return "";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function offerMessage(offer, purpose = "enquiry") {
  return [
    "Hello Destination Corbett Team! 👋",
    "",
    purpose === "booking"
      ? "I would like to book the following offer:"
      : "I would like to enquire about the following offer:",
    "",
    `Offer: ${offer.title}`,
    `Category: ${offer.category}`,
    `Price: ${offer.price}`,
    `Offer Code: ${offer.code}`,
    "",
    "Please share availability, applicable terms and the next steps.",
    "",
    "Thank you!",
  ].join("\n");
}

/* ----------------------------------------
   Copy Offer Code
----------------------------------------- */

function CopyCode({ code, dark = false }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyCode}
      aria-label={`Copy offer code ${code}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-dashed px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] transition ${focus} ${
        dark
          ? "border-[#C87532] text-[#F0C69F] hover:bg-white/10"
          : "border-[#B96928] text-[#18352A] hover:bg-[#B96928]/10 dark:text-[#F0C69F]"
      }`}
    >
      {copied ? "COPIED" : code}
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

/* ----------------------------------------
   Price
----------------------------------------- */

function Price({ offer, dark = false }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span
        className={`font-serif text-lg font-semibold sm:text-[22px] ${
          dark ? "text-white" : "text-[#172033] dark:text-white"
        }`}
      >
        {offer.price}
      </span>

      {offer.was && (
        <span
          className={`text-[10px] line-through sm:text-[11px] ${
            dark ? "text-white/50" : "text-stone-500 dark:text-gray-400"
          }`}
        >
          {offer.was}
        </span>
      )}

      <span
        className={`text-[10px] sm:text-[11px] ${
          dark ? "text-white/65" : "text-stone-600 dark:text-gray-300"
        }`}
      >
        {offer.unit}
      </span>
    </div>
  );
}

/* ----------------------------------------
   Offer inclusions
----------------------------------------- */

function OfferItems({ offer, dark = false }) {
  return (
    <ul
      className={`space-y-1.5 text-[11px] leading-4 sm:text-[12px] sm:leading-5 ${
        dark ? "text-white/85" : "text-stone-700 dark:text-gray-300"
      }`}
    >
      {offer.items.map((item) => (
        <li key={item} className="flex items-start gap-1.5">
          <Check
            size={13}
            className="mt-0.5 shrink-0 text-[#C87532]"
            strokeWidth={2.5}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------
   WhatsApp action
----------------------------------------- */

function OfferWhatsAppButton({
  offer,
  whatsappNumber,
  purpose = "enquiry",
  featured = false,
}) {
  const message = offerMessage(offer, purpose);
  const url = makeWhatsAppUrl(whatsappNumber, message);

  const buttonClass = `inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[10px] font-bold transition sm:text-[11px] ${focus} ${
    featured
      ? "bg-[#C87532] text-white hover:bg-[#B96928]"
      : "bg-[#18352A] text-white hover:bg-[#28513E]"
  }`;

  if (!url) {
    return (
      <Link href="/contact" className={buttonClass}>
        Contact us
        <ArrowRight size={13} />
      </Link>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
    >
      <MessageCircle size={13} />
      {purpose === "booking" ? "Book this offer" : "Enquire"}
      <ArrowRight size={13} />
    </a>
  );
}

/* ----------------------------------------
   Featured Offer
----------------------------------------- */

function FeaturedCard({ offer, whatsappNumber }) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-[#18352A] text-white shadow-sm sm:col-span-2 lg:col-span-3">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#C87532]/10 blur-3xl" />

      <div className="relative grid md:grid-cols-[0.9fr_1.6fr]">
        <div className="flex min-h-[125px] flex-col justify-between border-b border-white/15 bg-gradient-to-br from-[#28513E] to-[#18352A] p-4 sm:min-h-[145px] sm:p-5 md:border-b-0 md:border-r">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
              <Sparkles size={11} />
              Featured offer
            </span>

            <p className="mt-4 max-w-[180px] font-serif text-2xl font-semibold leading-none text-white sm:mt-5 sm:text-3xl">
              {offer.badge}
            </p>
          </div>

          <p className="mt-4 text-[11px] text-white/65 sm:mt-5">
            Limited availability
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 p-4 sm:p-5 md:p-6">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F0C69F]">
              {offer.category}
            </p>

            <h2 className="font-serif text-xl leading-tight text-white sm:text-2xl">
              {offer.title}
            </h2>

            <p className="mt-1 text-[11px] text-white/75 sm:text-[12px]">
              {offer.subtitle}
            </p>
          </div>

          <Price offer={offer} dark />
          <OfferItems offer={offer} dark />

          <div className="flex items-center gap-1.5 text-[10px] text-white/70 sm:text-[11px]">
            <CalendarDays size={13} />
            {offer.valid}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <CopyCode code={offer.code} dark />
            <OfferWhatsAppButton
              offer={offer}
              whatsappNumber={whatsappNumber}
              purpose="booking"
              featured
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ----------------------------------------
   Normal Offer Card
----------------------------------------- */

function OfferCard({ offer, whatsappNumber }) {
  return (
    <article
      className="group flex h-full flex-col rounded-xl border border-stone-200 border-t-2 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#171c19] sm:p-4"
      style={{ borderTopColor: orange }}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-500 dark:text-gray-400 sm:text-[10px]">
            {offer.category}
          </p>

          <h2 className="mt-0.5 font-serif text-sm leading-snug text-[#172033] dark:text-white sm:text-lg">
            {offer.title}
          </h2>

          <p className="mt-1 text-[10px] leading-4 text-stone-600 dark:text-gray-300 sm:text-xs">
            {offer.subtitle}
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-[#18352A] px-1.5 py-1 text-[9px] font-bold text-[#F0C69F] sm:px-2 sm:text-[10px]">
          {offer.badge}
        </span>
      </div>

      <div className="mt-3">
        <Price offer={offer} />
      </div>

      <div className="mt-3">
        <OfferItems offer={offer} />
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-[10px] text-stone-600 dark:text-gray-300">
        <CalendarDays size={12} className="mt-0.5 shrink-0" />
        <span>{offer.valid}</span>
      </div>

      <div className="mt-auto mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 pt-3 dark:border-white/10">
        <CopyCode code={offer.code} />

        <OfferWhatsAppButton
          offer={offer}
          whatsappNumber={whatsappNumber}
          purpose="booking"
        />
      </div>
    </article>
  );
}

/* ----------------------------------------
   Main Offers Page
----------------------------------------- */

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const { profile } = useOrganisationProfile();

  // Organisation profile contact fields.
  const rawWhatsApp =
    profile?.whatsapp ||
    profile?.whatsappNumber ||
    profile?.whatsapp_number ||
    profile?.whatsApp ||
    profile?.whatsappNo ||
    profile?.whatsapp_no ||
    profile?.contact?.whatsapp ||
    profile?.contact?.whatsappNumber ||
    "";

  const rawPhone =
    profile?.phone ||
    profile?.phoneNumber ||
    profile?.contactNumber ||
    profile?.mobile ||
    profile?.mobileNumber ||
    profile?.contact?.phone ||
    profile?.contact?.phoneNumber ||
    "";

  const whatsappNumber = getIndianOrInternationalNumber(
    rawWhatsApp || rawPhone
  );

  const phoneNumber = getIndianOrInternationalNumber(
    rawPhone || rawWhatsApp
  );

  const validWhatsApp =
    whatsappNumber.length >= 11 && whatsappNumber.length <= 15
      ? whatsappNumber
      : "";

  const phoneHref =
    phoneNumber.length >= 10 && phoneNumber.length <= 15
      ? `tel:+${phoneNumber}`
      : "";

  const filteredOffers =
    activeTab === "All"
      ? OFFERS
      : OFFERS.filter((offer) => offer.category === activeTab);

  const getCount = (tab) =>
    tab === "All"
      ? OFFERS.length
      : OFFERS.filter((offer) => offer.category === tab).length;

  const featuredOffer = OFFERS.find((offer) => offer.featured);

  const generalWhatsAppUrl = makeWhatsAppUrl(
    validWhatsApp,
    [
      "Hello Destination Corbett Team! 👋",
      "",
      "I would like to enquire about your current offers.",
      "Please share availability, prices and booking details.",
      "",
      "Thank you!",
    ].join("\n")
  );

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033] dark:bg-[#0e1210] dark:text-gray-100">
      {/* ================= BREADCRUMB ================= */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-3 pt-3 text-xs sm:px-5 sm:pt-4 sm:text-sm md:px-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="text-[#B96928] transition-colors hover:underline"
          >
            Home
          </Link>

          <span className="text-gray-400">›</span>

          <span
            aria-current="page"
            className="font-medium text-[#172033] dark:text-gray-100"
          >
            Offers
          </span>
        </div>
      </nav>

      {/* ================= COMPACT HERO ================= */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-[#18352A] px-4 py-5 text-white sm:rounded-2xl sm:px-8 sm:py-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F0C69F]">
              Exclusive Corbett Offers
            </p>

            <h1 className="font-serif text-2xl leading-tight sm:text-3xl lg:text-4xl">
              Stay closer to the jungle.
              <span className="block text-[#F0C69F]">
                Pay less for the experience.
              </span>
            </h1>

            <p className="mt-2 max-w-xl text-[12px] leading-5 text-white/80 sm:text-[13px]">
              Offers on stays, safaris, weekends and weddings in Jim Corbett.
            </p>
          </div>

          {featuredOffer && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/75">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#F0C69F]" />
                Featured: {featuredOffer.code}
              </span>

              <span>{OFFERS.length} offers</span>

              <Link
                href="/contact"
                className={`inline-flex items-center gap-1 text-[#F0C69F] hover:text-white ${focus}`}
              >
                Custom package?
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= FILTERS ================= */}
      <div className="sticky top-0 z-20 mt-3 border-b border-[#18352A]/10 bg-[#F7F5F0]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#0e1210]/95">
        <div
          role="tablist"
          aria-label="Filter offers"
          className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-3 py-2 sm:px-5 md:px-6"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${focus} ${
                  active
                    ? "bg-[#18352A] text-white"
                    : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-[#18352A] dark:bg-[#171c19] dark:text-gray-200 dark:ring-white/10"
                }`}
              >
                {tab}
                <span
                  className={`ml-1 ${
                    active ? "text-[#F0C69F]" : "text-stone-500 dark:text-gray-400"
                  }`}
                >
                  {getCount(tab)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= OFFERS ================= */}
      <section className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-6 md:px-6">
        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3">
          {filteredOffers.map((offer) =>
            offer.featured && activeTab === "All" ? (
              <FeaturedCard
                key={offer.id}
                offer={offer}
                whatsappNumber={validWhatsApp}
              />
            ) : (
              <OfferCard
                key={offer.id}
                offer={offer}
                whatsappNumber={validWhatsApp}
              />
            )
          )}
        </div>

        {filteredOffers.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white px-5 py-10 text-center dark:border-white/10 dark:bg-[#171c19]">
            <p className="font-serif text-lg text-[#172033] dark:text-white">
              No offers available
            </p>

            <p className="mt-1 text-xs text-stone-600 dark:text-gray-300">
              Try another category or contact us for a custom quote.
            </p>

            <Link
              href="/contact"
              className={`mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#18352A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#28513E] ${focus}`}
            >
              Contact us
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </section>

      {/* ================= HOW TO REDEEM ================= */}
      <section className="mx-auto max-w-6xl px-3 pb-6 sm:px-5 md:px-6">
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B96928]">
            Simple process
          </p>

          <h2 className="mt-0.5 font-serif text-xl text-[#172033] dark:text-white">
            How to redeem
          </h2>
        </div>

        <ol className="grid gap-2.5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3.5 dark:border-white/10 dark:bg-[#171c19]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#18352A] font-mono text-[10px] font-bold text-[#F0C69F]">
                {step.number}
              </span>

              <div>
                <h3 className="text-[12px] font-semibold text-[#172033] dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-0.5 text-[11px] leading-4 text-stone-600 dark:text-gray-300">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ================= TERMS ================= */}
      <section className="mx-auto max-w-6xl px-3 pb-6 sm:px-5 md:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B96928]">
          Before booking
        </p>

        <h2 className="mt-0.5 font-serif text-xl text-[#172033] dark:text-white">
          Good to know
        </h2>

        <div className="mt-3 divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#171c19]">
          {TERMS.map(([question, answer]) => (
            <details key={question} className="group px-4 py-2.5">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-semibold text-stone-800 dark:text-gray-100 ${focus}`}
              >
                {question}

                <ChevronDown
                  size={15}
                  className="shrink-0 text-stone-500 transition-transform group-open:rotate-180 dark:text-gray-400"
                />
              </summary>

              <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-stone-700 dark:text-gray-300">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ================= DYNAMIC CONTACT / ENQUIRY ================= */}
      <section className="mx-auto max-w-6xl px-3 pb-8 sm:px-5 md:px-6">
        <div className="flex flex-col gap-4 rounded-xl bg-[#18352A] px-4 py-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:px-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F0C69F]">
              Need something specific?
            </p>

            <h2 className="mt-1 font-serif text-lg text-white">
              Build a custom Corbett plan.
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-white/80">
              Group, family, safari or wedding dates — talk to our team.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {generalWhatsAppUrl ? (
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-md border border-white/30 px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-white/10 ${focus}`}
              >
                <MessageCircle size={13} />
                WhatsApp enquiry
              </a>
            ) : (
              <Link
                href="/contact"
                className={`inline-flex items-center gap-1.5 rounded-md border border-white/30 px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-white/10 ${focus}`}
              >
                <MessageCircle size={13} />
                Send an enquiry
              </Link>
            )}

            {phoneHref && (
              <a
                href={phoneHref}
                className={`inline-flex items-center gap-1.5 rounded-md bg-[#B96928] px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-[#A45C27] ${focus}`}
              >
                <Phone size={13} />
                Call us
              </a>
            )}

            <Link
              href="/contact"
              className={`inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-[11px] font-bold text-[#18352A] transition hover:bg-stone-100 ${focus}`}
            >
              Contact page
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {!validWhatsApp && !phoneHref && (
          <p className="mt-3 text-xs leading-5 text-amber-800 dark:text-amber-300">
            Organisation contact details are not available in the profile yet.
            Please configure the phone and WhatsApp details in the organisation
            settings.
          </p>
        )}
      </section>
    </main>
  );
}
