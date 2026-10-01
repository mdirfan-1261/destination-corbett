
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

const PHONE = "+919205299338";
const WHATSAPP = "919205299338";

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
    items: [
      "2 nights deluxe room",
      "1 jeep safari",
      "All meals & pickup",
    ],
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
    items: [
      "Bonfire evening",
      "Welcome drink",
      "Breakfast included",
    ],
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
    text: "Send your travel dates and guest count with the code.",
  },
  {
    number: "03",
    title: "We confirm",
    text: "Our team confirms availability and the final rate.",
  },
];

const TERMS = [
  [
    "Can I combine two offers?",
    "No. One offer applies per booking.",
  ],
  [
    "Are taxes included?",
    "Prices are before GST. Applicable taxes are added at booking.",
  ],
  [
    "Are there blackout dates?",
    "Yes. Long weekends and festival dates may be excluded. Confirm your dates with our team.",
  ],
  [
    "What is the cancellation policy?",
    "Cancellation terms depend on the selected offer. Check the offer inclusions before booking.",
  ],
];

const gold = "#B99255";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B99255]";

/* ----------------------------------------
   Copy Offer Code
----------------------------------------- */

function CopyCode({ code, dark = false }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <button
      type="button"
      onClick={copyCode}
      aria-label={`Copy offer code ${code}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-dashed px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] transition ${focus} ${
        dark
          ? "border-[#B99255] text-[#E8D8B8] hover:bg-white/10"
          : "border-[#B99255] text-[#234235] hover:bg-[#B99255]/10"
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
        className={`font-serif text-[22px] font-semibold ${
          dark ? "text-white" : "text-[#234235]"
        }`}
      >
        {offer.price}
      </span>

      {offer.was && (
        <span
          className={`text-[11px] line-through ${
            dark ? "text-white/40" : "text-stone-400"
          }`}
        >
          {offer.was}
        </span>
      )}

      <span
        className={`text-[11px] ${
          dark ? "text-white/55" : "text-stone-500"
        }`}
      >
        {offer.unit}
      </span>
    </div>
  );
}

/* ----------------------------------------
   Offer Items
----------------------------------------- */

function OfferItems({ offer, dark = false }) {
  return (
    <ul
      className={`space-y-1.5 text-[12px] leading-5 ${
        dark ? "text-white/75" : "text-stone-600"
      }`}
    >
      {offer.items.map((item) => (
        <li key={item} className="flex items-start gap-1.5">
          <Check
            size={13}
            className="mt-1 shrink-0 text-[#B99255]"
            strokeWidth={2.5}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------
   Featured Offer
----------------------------------------- */

function FeaturedCard({ offer }) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-[#234235] text-white shadow-sm sm:col-span-2 lg:col-span-3">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#B99255]/10 blur-3xl" />

      <div className="relative grid md:grid-cols-[0.9fr_1.6fr]">
        {/* Left */}
        <div className="flex min-h-[145px] flex-col justify-between border-b border-white/10 bg-gradient-to-br from-[#315846] to-[#234235] p-5 md:border-b-0 md:border-r">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B99255] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#234235]">
              <Sparkles size={11} />
              Featured offer
            </span>

            <p className="mt-5 max-w-[180px] font-serif text-3xl font-semibold leading-none text-white">
              {offer.badge}
            </p>
          </div>

          <p className="mt-5 text-[11px] text-white/45">
            Limited availability
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center gap-3 p-5 md:p-6">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8D8B8]">
              {offer.category}
            </p>

            <h2 className="font-serif text-2xl leading-tight">
              {offer.title}
            </h2>

            <p className="mt-1 text-[12px] text-white/55">
              {offer.subtitle}
            </p>
          </div>

          <Price offer={offer} dark />

          <OfferItems offer={offer} dark />

          <div className="flex items-center gap-1.5 text-[11px] text-white/50">
            <CalendarDays size={13} />
            {offer.valid}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <CopyCode code={offer.code} dark />

            <Link
              href={`/contact?offer=${encodeURIComponent(offer.code)}`}
              className={`inline-flex items-center gap-1.5 rounded-md bg-[#B99255] px-3.5 py-2 text-[11px] font-bold text-[#234235] transition hover:bg-[#C8A968] ${focus}`}
            >
              Book this offer
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ----------------------------------------
   Normal Offer Card
----------------------------------------- */

function OfferCard({ offer }) {
  return (
    <article
      className="group flex flex-col rounded-lg border border-stone-200 border-t-2 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTopColor: gold }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
            {offer.category}
          </p>

          <h2 className="mt-0.5 font-serif text-[18px] leading-snug text-[#234235]">
            {offer.title}
          </h2>

          <p className="mt-1 text-[11px] leading-4 text-stone-500">
            {offer.subtitle}
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-[#234235] px-2 py-1 text-[10px] font-bold text-[#E8D8B8]">
          {offer.badge}
        </span>
      </div>

      <div className="mt-3">
        <Price offer={offer} />
      </div>

      <div className="mt-3">
        <OfferItems offer={offer} />
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-400">
        <CalendarDays size={12} />
        {offer.valid}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
        <CopyCode code={offer.code} />

        <Link
          href={`/contact?offer=${encodeURIComponent(offer.code)}`}
          className={`inline-flex items-center gap-1 rounded-md bg-[#234235] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#3B6752] ${focus}`}
        >
          Book now
          <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}

/* ----------------------------------------
   Main Page
----------------------------------------- */

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredOffers =
    activeTab === "All"
      ? OFFERS
      : OFFERS.filter((offer) => offer.category === activeTab);

  const getCount = (tab) => {
    if (tab === "All") {
      return OFFERS.length;
    }

    return OFFERS.filter((offer) => offer.category === tab).length;
  };

  const featuredOffer = OFFERS.find((offer) => offer.featured);

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-stone-900">
      {/* =====================================
          HERO
      ====================================== */}

      <section className="bg-[#234235] px-5 py-9 text-white md:py-11">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8D8B8]">
              Exclusive Corbett Offers
            </p>

            <h1 className="font-serif text-3xl leading-[1.08] md:text-4xl">
              Stay closer to the jungle.
              <span className="block text-[#E8D8B8]">
                Pay less for the experience.
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-[13px] leading-5 text-white/60">
              Current deals on stays, safaris, weekends and weddings in Jim
              Corbett.
            </p>
          </div>

          {featuredOffer && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/45">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#B99255]" />
                Featured: {featuredOffer.code}
              </span>

              <span>{OFFERS.length} active offers</span>

              <Link
                href="/contact"
                className={`inline-flex items-center gap-1 text-[#E8D8B8] hover:text-white ${focus}`}
              >
                Need a custom package?
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =====================================
          FILTERS
      ====================================== */}

      <div className="sticky top-0 z-20 border-b border-stone-200 bg-[#F8F6F1]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-5 py-2.5">
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
                    ? "bg-[#234235] text-white"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-[#234235]"
                }`}
              >
                {tab}

                <span
                  className={`ml-1 ${
                    active ? "text-[#E8D8B8]" : "text-stone-400"
                  }`}
                >
                  {getCount(tab)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================
          OFFERS
      ====================================== */}

      <section className="mx-auto max-w-6xl px-5 py-5">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) =>
            offer.featured && activeTab === "All" ? (
              <FeaturedCard key={offer.id} offer={offer} />
            ) : (
              <OfferCard key={offer.id} offer={offer} />
            )
          )}
        </div>

        {filteredOffers.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white px-5 py-10 text-center">
            <p className="font-serif text-lg text-[#234235]">
              No offers available
            </p>

            <p className="mt-1 text-xs text-stone-500">
              Try another category or contact us for a custom quote.
            </p>

            <Link
              href="/contact"
              className={`mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#234235] px-4 py-2 text-xs font-semibold text-white ${focus}`}
            >
              Contact us
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </section>

      {/* =====================================
          HOW TO REDEEM
      ====================================== */}

      <section className="mx-auto max-w-6xl px-5 pb-6">
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B99255]">
            Simple process
          </p>

          <h2 className="mt-0.5 font-serif text-xl text-[#234235]">
            How to redeem
          </h2>
        </div>

        <ol className="grid gap-2.5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#234235] font-mono text-[10px] font-bold text-[#E8D8B8]">
                {step.number}
              </span>

              <div>
                <h3 className="text-[12px] font-semibold text-[#234235]">
                  {step.title}
                </h3>

                <p className="mt-0.5 text-[11px] leading-4 text-stone-500">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* =====================================
          TERMS
      ====================================== */}

      <section className="mx-auto max-w-6xl px-5 pb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B99255]">
          Before booking
        </p>

        <h2 className="mt-0.5 font-serif text-xl text-[#234235]">
          Good to know
        </h2>

        <div className="mt-3 divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
          {TERMS.map(([question, answer]) => (
            <details key={question} className="group px-4 py-2.5">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-semibold text-stone-700 ${focus}`}
              >
                {question}

                <ChevronDown
                  size={15}
                  className="shrink-0 text-stone-400 transition-transform group-open:rotate-180"
                />
              </summary>

              <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-stone-500">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* =====================================
          CONTACT CTA
      ====================================== */}

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="flex flex-col gap-3 rounded-xl bg-[#234235] px-5 py-4 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8D8B8]">
              Need something specific?
            </p>

            <h2 className="mt-0.5 font-serif text-lg">
              Build a custom Corbett plan.
            </h2>

            <p className="mt-0.5 text-[11px] text-white/50">
              Group, family, safari or wedding dates — talk to our team.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                "Hi, I would like to know about your current offers."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-white/10 ${focus}`}
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>

            <a
              href={`tel:${PHONE}`}
              className={`inline-flex items-center gap-1.5 rounded-md bg-[#B99255] px-3.5 py-2 text-[11px] font-bold text-[#234235] transition hover:bg-[#C8A968] ${focus}`}
            >
              <Phone size={13} />
              Call us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

