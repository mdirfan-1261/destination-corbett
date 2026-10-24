"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// type -> breadcrumb trail (Contact ke pehle ke steps)
// Paths apne routes ke hisab se check kar lena.
const TRAILS = {
  safari: [{ label: "Safari", href: "/safari" }],
  "canter-safari": [
    { label: "Safari", href: "/safari" },
    { label: "Canter Safari", href: "/safari/canter" },
  ],
  stay: [{ label: "Stay", href: "/stay" }],
  event: [{ label: "Events", href: "/events" }],
  "corporate-meeting": [
    { label: "Events", href: "/events" },
    { label: "Corporate Meetings", href: "/events/meetings" },
  ],
  conference: [
    { label: "Events", href: "/events" },
    { label: "Conferences", href: "/events/conferences" },
  ],
  "team-outing": [
    { label: "Events", href: "/events" },
    { label: "Team Outings", href: "/events/team-outings" },
  ],
  package: [{ label: "Packages", href: "/packages" }],
  wedding: [{ label: "Weddings", href: "/weddings" }],
};

export default function ContactBreadcrumb() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const hasHotel = searchParams.get("hotel");

  // ?hotel=... wale links mein type nahi hota, wo Stay se aate hain
  const trail = TRAILS[type] || (hasHotel ? TRAILS.stay : []);

  return (
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

        {trail.map((item) => (
          <span key={item.href} className="flex items-center gap-2">
            <span className="text-gray-400">›</span>
            <Link
              href={item.href}
              className="text-[#B96928] transition-colors hover:underline"
            >
              {item.label}
            </Link>
          </span>
        ))}

        <span className="text-gray-400">›</span>

        <span
          aria-current="page"
          className="font-medium text-[#172033] dark:text-gray-100"
        >
          Contact
        </span>
      </div>
    </nav>
  );
}