
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  const allItems = [
    { label: "Home", href: "/" },
    ...items,
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-gray-400"
                />
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-[#172033]"
                >
                  {item.label}
                </span>
              ) : (
               <nav className="mx-auto max-w-7xl px-4 pt-3 text-sm">
  <div className="flex flex-wrap items-center gap-2">
    <Link
      href="/stay/resorts"
      className="text-[#B96928] hover:underline"
    >
      Resorts
    </Link>

    <span className="text-gray-400">›</span>

    <Link
      href="/stay/resorts"
      className="text-gray-600 hover:underline"
    >
      Dhikuli
    </Link>

    <span className="text-gray-400">›</span>

    <span className="font-medium text-[#172033]">
      Corbett Forest Resort
    </span>
  </div>
</nav>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
