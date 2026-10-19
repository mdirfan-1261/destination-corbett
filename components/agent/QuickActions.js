"use client";

import Link from "next/link";
import {
  PlusCircle,
  BedDouble,
  CalendarDays,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Add Property",
    description: "Register a new property.",
    href: "/agent/properties/new",
    icon: PlusCircle,
  },
  {
    title: "Manage Rooms",
    description: "Manage your room categories.",
    href: "/agent/rooms",
    icon: BedDouble,
  },
  {
    title: "Update Availability",
    description: "Manage room availability.",
    href: "/agent/availability",
    icon: CalendarDays,
  },
  {
    title: "View Bookings",
    description: "Review your bookings.",
    href: "/agent/bookings",
    icon: ClipboardList,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-extrabold text-[#172033]">
        Quick Actions
      </h2>

      <div className="mt-4 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-[#B96928] hover:bg-orange-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                <Icon size={20} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#172033]">
                  {action.title}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  {action.description}
                </span>
              </span>

              <ArrowRight size={16} className="shrink-0 text-gray-400" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}