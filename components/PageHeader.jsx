import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Compact page header: a slim strip instead of a full-screen hero,
 * so the real content (offers, stays, safaris...) is visible straight away.
 *
 * Usage:
 *   <PageHeader
 *     kicker="Special Deals"
 *     title="Offers"
 *     subtitle="Current packages and seasonal deals at Destination Corbett."
 *     ctaLabel="Enquire Now"
 *     ctaHref="/contact"
 *   />
 *   ...offer cards directly below...
 */
export default function PageHeader({ kicker, title, subtitle, ctaLabel, ctaHref }) {
  return (
    <section className="px-3 pt-3 sm:px-5 md:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-xl bg-[#172033] px-4 py-3 text-white sm:rounded-2xl sm:px-6 sm:py-4">
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#B96928]/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0924F]/70 to-transparent" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            {kicker && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E0924F]">
                {kicker}
              </p>
            )}

            <h1 className="text-lg font-bold leading-tight sm:text-2xl">{title}</h1>

            {subtitle && (
              <p className="mt-0.5 hidden truncate text-xs text-white/75 sm:block sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#B96928] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#A85C22] sm:text-sm"
            >
              {ctaLabel}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}