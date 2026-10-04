import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

const packagesData = [
  {
    id: "corbett-wildlife-expedition",
    title: "Corbett Wildlife & Safari Expedition",
    category: "safari",
    tag: "Most Popular",
    duration: "2 Nights / 3 Days",
    groupSize: "2 - 6 Pax",
    location: "Bijrani & Garjiya Zones",
    price: "₹12,499",
    priceUnit: "per person",
    image: "/images/packages/safari-expedition.jpg",
    description:
      "Immerse yourself in the wilderness of Corbett with jeep safari slots, premium resort stays, guided nature experiences and comfortable hospitality.",
    inclusions: [
      "2 Nights Stay at 4-Star Riverside Resort",
      "1 Morning Jeep Safari + 1 Evening Zone Tour",
      "All Meals (Buffet Breakfast, Lunch & Dinner)",
      "Jeep Permits, Guide & Driver Charges Included",
      "Evening Bonfire with Live Folk Music",
    ],
  },

  {
    id: "luxury-resort-retreat",
    title: "Luxury Riverfront Resort Escape",
    category: "resort",
    tag: "Luxury Stay",
    duration: "3 Nights / 4 Days",
    groupSize: "2 - 8 Pax",
    location: "Kosi River Bank, Corbett",
    price: "₹18,999",
    priceUnit: "per person",
    image: "/images/packages/luxury-resort1.jpg",
    description:
      "Unwind in absolute luxury with private pool villas, spa therapy vouchers, gourmet dining, and exclusive riverfront experiences.",
    inclusions: [
      "3 Nights in Luxury Cottage / River View Villa",
      "1 Exclusive Jeep Safari (Dhikala / Bijrani)",
      "Daily Chef Special Buffet Meals & High Tea",
      "Complimentary Spa Massage Voucher",
      "Private Bonfire & Barbeque Dinner",
    ],
  },

  {
    id: "corporate-mice-retreat",
    title: "Corporate Leadership & Outing Retreat",
    category: "corporate",
    tag: "Corporate Special",
    duration: "2 Nights / 3 Days",
    groupSize: "15 - 100+ Pax",
    location: "Jim Corbett National Park",
    price: "₹14,500",
    priceUnit: "per delegate",
    image: "/images/packages/corporate-retreat1.jpg",
    description:
      "Seamlessly blend corporate meetings with team building, safari experiences and event support.",
    inclusions: [
      "Conference Hall with AV & High-Speed Wi-Fi",
      "Group Accommodation in Luxury Resort",
      "Team Building Outdoor Activities & Games",
      "1 Exclusive Group Jeep Safari Tour",
      "Gala Dinner with Live DJ & Bar Setup",
    ],
  },

  {
    id: "dhikala-canter-adventure",
    title: "Dhikala Forest Zone Trail",
    category: "safari",
    tag: "Wildlife Special",
    duration: "1 Night / 2 Days",
    groupSize: "2 - 12 Pax",
    location: "Dhikala Core Zone",
    price: "₹8,999",
    priceUnit: "per person",
    image: "/images/packages/dhikala-zone.jpg",
    description:
      "Deep forest core zone experience designed for wildlife photographers, bird watchers and nature lovers.",
    inclusions: [
      "1 Night Accommodation inside Forest Rest House / Resort",
      "Canter Safari inside Dhikala Core Zone",
      "Forest Entry Permits & Forest Guide Fees",
      "All Meals & Tea / Snacks",
      "Pick-up & Drop from Ramnagar Station",
    ],
  },

  {
    id: "family-weekend-bonanza",
    title: "Family Weekend Wilderness Bonanza",
    category: "family",
    tag: "Best for Families",
    duration: "2 Nights / 3 Days",
    groupSize: "4 - 10 Pax",
    location: "Sitabani & Dhikuli",
    price: "₹10,999",
    priceUnit: "per person",
    image: "/images/packages/family-package.jpg",
    description:
      "A complete family vacation with resort relaxation, wildlife experiences and memorable Corbett activities.",
    inclusions: [
      "2 Nights Family Suite Accommodation",
      "1 Jeep Safari + Corbett Museum & Waterfalls Tour",
      "Kids Activity Zone Access & Swimming Pool",
      "All Buffet Meals (Breakfast, Lunch, Dinner)",
      "Local Transportation & Transfers",
    ],
  },

  {
    id: "adventure-thrill-seeker",
    title: "Corbett Adventure & River Rafting Package",
    category: "safari",
    tag: "Adventure Special",
    duration: "2 Nights / 3 Days",
    groupSize: "4 - 20 Pax",
    location: "Kosi River & Marchula",
    price: "₹11,800",
    priceUnit: "per person",
    image: "/images/packages/adventure-package.jpg",
    description:
      "A thrill-filled Corbett experience combining river rafting, ziplining, trekking and jungle safari.",
    inclusions: [
      "2 Nights Stay in Adventure Camp / Resort",
      "River Rafting & Zipline Activity",
      "1 Jungle Jeep Safari Tour",
      "Trekking & Nature Walk with Expert Guide",
      "Bonfire Nights with Music & Barbeque",
    ],
  },
];

export default async function PackageDetailPage({ params }) {
  const { id } = await params;

  const pkg = packagesData.find((item) => item.id === id);

  if (!pkg) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#172033]">
          Package Not Found
        </h1>

        <Link
          href="/packages"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#C87532] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B96928]"
        >
          <ArrowLeft size={16} />
          Back to Packages
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#F7F5F0] text-[#172033]">

      {/* HERO */}
      <section className="px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] sm:rounded-[24px] md:rounded-[28px]">

          <div className="relative h-[320px] sm:h-[440px] md:h-[500px]">

            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[#172033]/35" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

            <div className="relative z-10 flex h-full items-center px-5 sm:px-8 md:px-12 lg:px-16">

              <div className="max-w-2xl">

                <span className="inline-flex rounded-full bg-[#C87532] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white sm:text-xs">
                  {pkg.tag}
                </span>

                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                  {pkg.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="inline-flex items-center gap-1.5 rounded-md bg-black/35 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-md sm:text-xs">
                    <Clock size={13} className="text-[#C87532]" />
                    {pkg.duration}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md bg-black/35 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-md sm:text-xs">
                    <Users size={13} className="text-[#C87532]" />
                    {pkg.groupSize}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md bg-black/35 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-md sm:text-xs">
                    <MapPin size={13} className="text-[#C87532]" />
                    {pkg.location}
                  </span>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.5fr_0.7fr]">

          {/* LEFT */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">

            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C87532] sm:text-xs">
              Package Details
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#172033] sm:text-3xl">
              {pkg.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/60 sm:text-base">
              {pkg.description}
            </p>

            <div className="mt-7 border-t border-black/5 pt-6">

              <h3 className="text-lg font-semibold text-[#172033]">
                Package Highlights
              </h3>

              <div className="mt-4 space-y-3">

                {pkg.inclusions.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-black/65"
                  >
                    <Check
                      size={17}
                      className="mt-0.5 shrink-0 text-[#C87532]"
                    />

                    <span>{item}</span>
                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* BOOKING CARD */}
          <div className="h-fit rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">

            <span className="text-[9px] font-semibold uppercase tracking-wider text-black/40">
              Starting From
            </span>

            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#172033]">
                {pkg.price}
              </span>

              <span className="text-xs text-black/45">
                / {pkg.priceUnit}
              </span>
            </div>

            <div className="mt-5 space-y-2">

              <div className="flex items-center justify-between border-b border-black/5 pb-2.5 text-xs">
                <span className="text-black/45">Duration</span>
                <span className="font-semibold">{pkg.duration}</span>
              </div>

              <div className="flex items-center justify-between border-b border-black/5 pb-2.5 text-xs">
                <span className="text-black/45">Group Size</span>
                <span className="font-semibold">{pkg.groupSize}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-black/45">Location</span>
                <span className="text-right font-semibold">
                  {pkg.location}
                </span>
              </div>

            </div>

            <div className="mt-6 grid gap-2">

              <Link
                href={`/booking?type=package&package=${encodeURIComponent(pkg.id)}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#C87532] text-sm font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928]"
              >
                <CalendarDays size={16} />
                Book Now
              </Link>

              <Link
                href={`/contact?type=package&package=${encodeURIComponent(pkg.id)}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#172033] bg-white text-sm font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white"
              >
                Enquire Now
                <ArrowRight size={16} />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* BACK */}
      <section className="px-4 pb-10 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#172033] transition hover:text-[#C87532] sm:text-sm"
          >
            <ArrowLeft size={15} />
            Back to All Packages
          </Link>

        </div>
      </section>

    </main>
  );
}