
import {
  Building2,
  CalendarCheck,
  BedDouble,
  Clock3,
} from "lucide-react";

const CARD_CONFIG = [
  {
    key: "properties",
    label: "My Properties",
    icon: Building2,
    iconClass: "bg-orange-50 text-[#B96928]",
  },
  {
    key: "bookings",
    label: "Total Bookings",
    icon: CalendarCheck,
    iconClass: "bg-blue-50 text-blue-700",
  },
  {
    key: "rooms",
    label: "Room Categories",
    icon: BedDouble,
    iconClass: "bg-violet-50 text-violet-700",
  },
  {
    key: "pending",
    label: "Pending Bookings",
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-700",
  },
];

export default function DashboardSummaryCards({
  stats = {},
  loading = false,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARD_CONFIG.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];

        return (
          <article
            key={card.key}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#172033]">
                  {loading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-100" />
                  ) : Number.isFinite(value) ? (
                    value.toLocaleString("en-IN")
                  ) : (
                    "—"
                  )}
                </p>
              </div>

              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <Icon size={22} />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
