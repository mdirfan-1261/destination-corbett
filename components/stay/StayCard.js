import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ArrowRight, Send } from "lucide-react";

export default function StayCard({
  href,
  enquiryHref,
  image,
  name,
  location,
  badge,
  rating,
  tags = [],
  price,
  ctaLabel = "View Details",
  unoptimized = false,
}) {
  const ratingNumber = Number(rating) || 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#161b18]">

      {/* IMAGE + BADGES */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-[#1a1f1c]">
        <Image
          src={image}
          alt={name}
          fill
          unoptimized={unoptimized}
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {badge && (
          <span className="absolute left-2 top-2 inline-flex max-w-[65%] items-center gap-1 rounded bg-[#0B3B32]/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur sm:text-[10px]">
            <MapPin size={11} className="shrink-0 text-[#E0924F]" />
            <span className="truncate">{badge}</span>
          </span>
        )}

        {ratingNumber > 0 && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-[#0B3B32]/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur sm:text-xs">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            {ratingNumber}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">

        {/* Poore card par click isi link se hota hai */}
        <h3 className="line-clamp-1 text-sm font-bold text-[#172033] dark:text-gray-100 sm:text-base">
          <Link href={href} className="after:absolute after:inset-0">
            {name}
          </Link>
        </h3>

        {location && (
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#EDF4F2] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#0B3B32] dark:bg-white/10 dark:text-gray-200 sm:text-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {price && (
          <p className="mt-2 text-sm font-bold text-[#172033] dark:text-gray-100">
            {price}
            <span className="ml-1 text-[10px] font-normal text-gray-500 dark:text-gray-400">
              / night
            </span>
          </p>
        )}

        {/* BUTTONS */}
        <div className="relative z-10 mt-auto flex gap-1.5 pt-3">
          {enquiryHref && (
            <Link
              href={enquiryHref}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] px-1.5 text-[10px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white dark:border-white/30 dark:text-gray-100 dark:hover:bg-white/10 sm:h-9 sm:text-xs"
            >
              Enquire
              <Send size={11} />
            </Link>
          )}

          <Link
            href={href}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-1.5 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:h-9 sm:text-xs"
          >
            {ctaLabel}
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}