import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import stays from "@/data/stays";

export default async function StayDetailsPage({ params }) {
  const { slug } = await params;

  const stay = stays.find(
    (item) => item.slug === slug
  );

  if (!stay) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0]">

      {/* HERO */}

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">

        <div className="relative overflow-hidden rounded-3xl bg-[#172033]">

          <div className="relative h-[300px] md:h-[500px]">

            <Image
              src={stay.image}
              alt={stay.name}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-[#172033]/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-10">

              <p className="mb-2 text-sm font-semibold text-[#C87532]">
                {stay.location}
              </p>

              <h1 className="text-3xl font-bold md:text-5xl">
                {stay.name}
              </h1>

              {stay.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                  {stay.description}
                </p>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* DETAILS */}

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* LEFT */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-[#172033]">
              About {stay.name}
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              {stay.description}
            </p>

            {/* AMENITIES */}

            {stay.amenities?.length > 0 && (
              <div className="mt-8">

                <h3 className="text-lg font-bold text-[#172033]">
                  Amenities
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">

                  {stay.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-[#EEF5F2] px-3 py-1.5 text-xs font-semibold text-[#18352A]"
                    >
                      {amenity}
                    </span>
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* RIGHT */}

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Location
            </p>

            <p className="mt-1 font-semibold text-[#172033]">
              {stay.location}
            </p>

            {stay.rating && (
              <div className="mt-4">

                <span className="text-lg font-bold text-[#172033]">
                  {stay.rating}
                </span>

                <span className="ml-2 text-sm text-gray-500">
                  ({stay.reviews || 0} reviews)
                </span>

              </div>
            )}

            <Link
              href="/contact"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#C87532] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B96928]"
            >
              Enquire Now
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}