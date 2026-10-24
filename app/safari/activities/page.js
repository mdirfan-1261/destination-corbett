"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";
import {
  ArrowRight,
  Bird,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  Footprints,
  Leaf,
  MessageCircle,
  Mountain,
  Search,
  Trees,
  Waves,
  X,
  ImageOff,
} from "lucide-react";

const HERO_IMAGE = "/safari/activities/activities-hero.jpg";

const activities = [
  {
    id: "jeep-safari",
    name: "Jeep Safari",
    category: "Wildlife",
    tagline: "Explore the wild",
    duration: "3–4 hours",
    location: "Permitted safari zones",
    image: "/safari/activities/jeep-safari1.jpg",
    icon: Compass,
    number: "01",
    description:
      "Explore designated forest safari routes in an authorised vehicle. Wildlife sightings depend on nature, season and conditions.",
    highlights: [
      "Forest landscapes",
      "Wildlife observation",
      "Authorised safari routes",
    ],
    note: "Permits, zone availability and forest rules determine access.",
  },
  {
    id: "bird-watching",
    name: "Bird Watching",
    category: "Birding",
    tagline: "Listen to the forest",
    duration: "2–3 hours",
    location: "Suitable birding locations",
    image: "/safari/activities/bird-watching.jpg",
    icon: Bird,
    number: "02",
    description:
      "Observe resident and seasonal birds around suitable habitats in the Corbett landscape.",
    highlights: [
      "Bird observation",
      "Nature interpretation",
      "Photography opportunities",
    ],
    note: "Bird sightings depend on habitat, weather and season.",
  },
  {
    id: "guided-nature-walk",
    name: "Guided Nature Walk",
    category: "Nature",
    tagline: "Discover the little things",
    duration: "1–2 hours",
    location: "Permitted trails or resort grounds",
    image: "/safari/activities/nature-walk.jpg",
    icon: Footprints,
    number: "03",
    description:
      "Explore permitted nature trails and learn about local trees, plants, insects and the surrounding landscape.",
    highlights: [
      "Native plants and trees",
      "Forest ecology",
      "Guided interpretation",
    ],
    note: "Walks must take place in authorised areas.",
  },
  {
    id: "nature-photography",
    name: "Nature Photography",
    category: "Nature",
    tagline: "See nature differently",
    duration: "As arranged",
    location: "Suitable permitted locations",
    image: "/safari/activities/nature-photography.jpg",
    icon: Camera,
    number: "04",
    description:
      "Photograph landscapes, birds, plants and natural details while respecting wildlife and local restrictions.",
    highlights: [
      "Landscape composition",
      "Bird and plant photography",
      "Responsible observation",
    ],
    note: "Photography must follow the rules of the location.",
  },
  {
    id: "butterfly-observation",
    name: "Butterfly & Insect Observation",
    category: "Nature",
    tagline: "Explore tiny wonders",
    duration: "As arranged",
    location: "Suitable natural habitats",
    image: "/safari/activities/butterfly-observation.jpg",
    icon: Leaf,
    number: "05",
    description:
      "Discover butterflies, insects and small details of the local ecosystem during a nature experience.",
    highlights: [
      "Seasonal butterfly observation",
      "Plant and insect diversity",
      "Slow nature exploration",
    ],
    note: "The experience depends on season, weather and local access.",
  },
  {
    id: "landscape-exploration",
    name: "Landscape Exploration",
    category: "Outdoor",
    tagline: "Beyond the ordinary",
    duration: "As arranged",
    location: "Designated local viewpoints",
    image: "/safari/activities/landscape-exploration.jpg",
    icon: Mountain,
    number: "06",
    description:
      "Explore suitable surrounding landscapes, forest-edge scenery and designated viewpoints around Corbett.",
    highlights: [
      "Scenic viewpoints",
      "Natural landscapes",
      "Relaxed exploration",
    ],
    note: "Access depends on local conditions and permission.",
  },
  {
    id: "riverside-nature",
    name: "Riverside Nature Viewing",
    category: "Outdoor",
    tagline: "Slow down by nature",
    duration: "As arranged",
    location: "Permitted riverside locations",
    image: "/safari/activities/riverside-nature.jpg",
    icon: Waves,
    number: "07",
    description:
      "Enjoy riverside scenery and observe the surrounding landscape from safe, permitted areas.",
    highlights: [
      "River and landscape views",
      "Nature observation",
      "Relaxed outdoor time",
    ],
    note: "Access depends on safety, weather and local restrictions.",
  },
  {
    id: "forest-interpretation",
    name: "Forest & Nature Learning",
    category: "Nature",
    tagline: "Understand the ecosystem",
    duration: "As arranged",
    location: "Permitted learning locations",
    image: "/safari/activities/forest-learning.jpg",
    icon: Trees,
    number: "08",
    description:
      "Learn about forest habitats, local plant life, animal signs and conservation through a guided experience.",
    highlights: [
      "Forest habitats",
      "Local ecology",
      "Responsible tourism",
    ],
    note: "This experience does not permit entry into restricted forest areas.",
  },
];

const categories = [
  { label: "All Activities", value: "All" },
  { label: "Wildlife", value: "Wildlife" },
  { label: "Bird Watching", value: "Birding" },
  { label: "Nature", value: "Nature" },
  { label: "Outdoor", value: "Outdoor" },
];

function normalisePhoneNumber(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.startsWith("0091")) {
    digits = digits.slice(2);
  }

  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return digits;
}

function getWhatsAppUrl(message, number) {
  const phone = normalisePhoneNumber(number);

  if (!phone || phone.length < 10) {
    return "";
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function getEnquiryUrl(activity) {
  return (
    `/contact?type=safari` +
    `&activity=${encodeURIComponent(activity.name)}` +
    `&location=${encodeURIComponent(activity.location)}`
  );
}

function getWhatsAppMessage(activity) {
  return [
    "Hi Destination Corbett,",
    "",
    `I am interested in ${activity.name}.`,
    `Experience: ${activity.category}`,
    `Location: ${activity.location}`,
    `Duration: ${activity.duration}`,
    "",
    "Please share current prices, availability and booking details.",
  ].join("\n");
}

function ImageFallback({ hero = false }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#26392E] to-[#172033] text-white ${
        hero ? "min-h-full" : ""
      }`}
    >
      <ImageOff size={hero ? 32 : 24} className="text-white/70" />
      <span className="px-3 text-center text-xs font-semibold text-white/80">
        Image unavailable
      </span>
    </div>
  );
}

function ActivityImage({ activity, priority = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <>
      {!failed ? (
        <Image
          src={activity.image}
          alt={activity.name}
          fill
          priority={priority}
          sizes="(max-width: 639px) 120px, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageFallback />
      )}
    </>
  );
}

export default function SafariActivitiesPage() {
  const { profile } = useOrganisationProfile();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);

  const whatsappNumber = profile?.whatsapp || profile?.phone || "";

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const categoryMatch =
        category === "All" || activity.category === category;

      const searchMatch =
        !query ||
        activity.name.toLowerCase().includes(query) ||
        activity.category.toLowerCase().includes(query) ||
        activity.location.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const visibleActivities =
    category === "All" && !search.trim() && !showAll
      ? filteredActivities.slice(0, 6)
      : filteredActivities;

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setShowAll(false);
    setExpanded(null);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
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

          <Link
            href="/safari"
            className="text-[#B96928] transition-colors hover:underline"
          >
            Safari
          </Link>

          <span className="text-gray-400">›</span>

          <span aria-current="page" className="font-medium text-[#172033]">
            Activities
          </span>
        </div>
      </nav>

      {/* ================= COMPACT HERO ================= */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
          {/* Hero Image */}
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            {!heroFailed ? (
              <Image
                src={HERO_IMAGE}
                alt="Forest landscape in the Corbett region"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 700px"
                className="object-cover object-center brightness-110"
                onError={() => setHeroFailed(true)}
              />
            ) : (
              <ImageFallback hero />
            )}
          </div>

          {/* Image Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-[45%] hidden w-[15%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 flex h-full items-center px-4 py-4 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
                <Leaf className="h-3 w-3 text-[#E0924F]" />
                Corbett Nature Experiences
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                Experience{" "}
                <span className="text-[#E0924F]">the Wild Side.</span>
              </h1>

              <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
                Wildlife safari, bird watching and nature experiences around
                Corbett.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href="#activities"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
                >
                  Explore Activities
                  <ArrowRight size={13} />
                </a>

                <Link
                  href="/contact?type=safari"
                  className="hidden items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex sm:text-sm"
                >
                  <MessageCircle size={13} />
                  Plan Your Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACTIVITIES ================= */}
      <section
        id="activities"
        className="scroll-mt-20 px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-8"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section Heading */}
          <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
            <div className="min-w-0">
              <p className="hidden text-xs font-bold uppercase tracking-wider text-[#B96928] sm:block">
                Discover · Observe · Explore
              </p>

              <h2 className="text-lg font-bold leading-tight text-[#172033] sm:mt-1 sm:text-2xl">
                Things to Do in Jim Corbett
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                Find an experience that suits your trip.
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-[#E6DFD5] bg-white px-3 py-2 sm:px-4 sm:py-2.5">
              <p className="text-base font-extrabold">{activities.length}</p>
              <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                Experiences
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative sm:max-w-md">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search birds, nature, safari..."
              aria-label="Search activities"
              className="h-11 w-full rounded-xl border border-[#E4DDD3] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10"
            />
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
            {categories.map((item) => {
              const selected = category === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setCategory(item.value);
                    setShowAll(false);
                  }}
                  aria-pressed={selected}
                  className={`min-h-9 shrink-0 rounded-full px-3.5 text-xs font-bold transition sm:px-4 sm:text-sm ${
                    selected
                      ? "bg-[#172033] text-white"
                      : "border border-[#E4DDD3] bg-white text-slate-700 hover:border-[#B96928] hover:text-[#B96928]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-600 sm:text-sm">
              {visibleActivities.length} activities shown
            </p>

            {(search || category !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-[#9F5520] hover:underline sm:text-sm"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* ACTIVITY CARDS */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {visibleActivities.map((activity, index) => {
              const Icon = activity.icon;
              const isExpanded = expanded === activity.id;

              const whatsappUrl = getWhatsAppUrl(
                getWhatsAppMessage(activity),
                whatsappNumber
              );

              return (
                <article
                  key={activity.id}
                  className="group flex min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-300 hover:border-[#D6B28E] hover:shadow-md sm:flex-col sm:rounded-2xl"
                >
                  <Link
                    href={getEnquiryUrl(activity)}
                    aria-label={`Enquire about ${activity.name}`}
                    className="relative block min-h-[150px] w-[112px] shrink-0 self-stretch overflow-hidden bg-[#E8E3DA] sm:aspect-[4/3] sm:min-h-0 sm:w-full sm:self-auto lg:aspect-[5/3]"
                  >
                    <ActivityImage activity={activity} priority={index < 2} />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <span className="absolute left-2 top-2 rounded-md bg-[#172033]/85 px-2 py-1 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:text-xs">
                      {activity.category}
                    </span>

                    <span className="absolute bottom-2 left-2 text-xs font-bold text-white sm:bottom-3 sm:left-3">
                      {activity.number}
                    </span>

                    <span className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm sm:flex">
                      <ArrowRight size={16} />
                    </span>
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                    <div className="flex min-w-0 items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#B96928] sm:text-[10px]">
                          {activity.tagline}
                        </p>

                        <h3 className="mt-1 break-words text-sm font-extrabold leading-snug text-[#172033] sm:text-base">
                          {activity.name}
                        </h3>
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B96928]/10 text-[#B96928] sm:h-9 sm:w-9">
                        <Icon size={17} strokeWidth={1.8} />
                      </div>
                    </div>

                    <p
                      className={`mt-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6 ${
                        isExpanded ? "" : "line-clamp-3"
                      }`}
                    >
                      {activity.description}
                    </p>

                    {isExpanded && (
                      <div className="mt-3 rounded-lg bg-[#F7F5F0] p-3">
                        <p className="text-sm font-extrabold text-[#172033]">
                          What to expect
                        </p>

                        <ul className="mt-2 space-y-2">
                          {activity.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="flex items-start gap-2 text-xs leading-5 text-slate-700 sm:text-sm"
                            >
                              <CheckCircle2
                                size={15}
                                className="mt-0.5 shrink-0 text-[#B96928]"
                              />
                              {highlight}
                            </li>
                          ))}
                        </ul>

                        <p className="mt-3 border-t border-[#E4DDD3] pt-3 text-xs leading-5 text-slate-600">
                          {activity.note}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto pt-3 sm:pt-4">
                      <div className="flex min-w-0 items-center justify-between gap-2 border-t border-[#EEE8E0] pt-3 text-[10px] font-semibold text-slate-600 sm:text-xs">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Clock3
                            size={14}
                            className="shrink-0 text-[#B96928]"
                          />
                          <span className="truncate">{activity.duration}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(isExpanded ? null : activity.id)
                          }
                          aria-expanded={isExpanded}
                          className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md px-1.5 text-xs font-bold text-[#9F5520] transition hover:bg-[#F7F5F0]"
                        >
                          {isExpanded ? "Less" : "Details"}
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-[1fr_38px] gap-2">
                        <Link
                          href={getEnquiryUrl(activity)}
                          className="inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg bg-[#B96928] px-2 text-[11px] font-bold text-white transition hover:bg-[#9F5520] sm:h-10 sm:text-sm"
                        >
                          Enquire Now
                          <ArrowRight size={13} />
                        </Link>

                        <a
                          href={whatsappUrl || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp about ${activity.name}`}
                          aria-disabled={!whatsappUrl}
                          onClick={(event) => {
                            if (!whatsappUrl) event.preventDefault();
                          }}
                          className={`flex h-9 items-center justify-center rounded-lg border border-[#16794B]/20 bg-[#16794B]/5 text-[#16794B] transition hover:bg-[#16794B]/10 sm:h-10 ${
                            !whatsappUrl
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          <MessageCircle size={17} />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* NO RESULTS */}
          {filteredActivities.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-[#D8CFC3] bg-white px-5 py-8 text-center sm:rounded-2xl sm:px-8 sm:py-10">
              <Search className="mx-auto text-slate-400" size={28} />

              <h3 className="mt-3 text-lg font-bold text-[#172033]">
                No activities found
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Try another keyword or category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-[#172033] px-4 text-sm font-bold text-white transition hover:bg-[#283650]"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* VIEW ALL */}
          {category === "All" &&
            !search.trim() &&
            filteredActivities.length > 6 && (
              <div className="mt-5 flex justify-center sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DCD3C7] bg-white px-5 text-sm font-bold text-[#172033] transition hover:border-[#B96928] hover:text-[#B96928]"
                >
                  {showAll ? "Show fewer" : "View all activities"}
                  {showAll ? <X size={15} /> : <ArrowRight size={15} />}
                </button>
              </div>
            )}

          <p className="mt-4 text-xs leading-5 text-gray-500">
            Activities and locations are subject to applicable permits,
            local rules, access and availability. Confirm arrangements
            before booking.
          </p>
        </div>
      </section>

      {/* ================= QUICK ENQUIRY ================= */}
      <section className="px-3 pb-6 sm:px-5 sm:pb-8 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-xl border border-[#B96928]/15 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:p-5">
          <div>
            <h2 className="text-sm font-bold text-[#172033] sm:text-lg">
              Need Help Choosing an Activity?
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
              Ask us about prices, availability and suitable experiences.
            </p>
          </div>

          <Link
            href="/contact?type=safari"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A85C22] sm:text-sm"
          >
            Contact Us
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}