"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import OwnerHeader from "@/components/owner/OwnerHeader";
import { X } from "lucide-react";

const pageDetails = [
  {
    prefix: "/owner/dashboard",
    title: "Dashboard Overview",
    description: "Your resort properties and arrivals at a glance.",
  },
  {
    prefix: "/owner/properties",
    title: "My Properties",
    description: "Manage your resorts, room categories and photos.",
  },
  {
    prefix: "/owner/calendar",
    title: "Availability Calendar",
    description: "Manage seasonal room rates and open/closed dates.",
  },
  {
    prefix: "/owner/bookings",
    title: "Resort Bookings",
    description: "Review guest stays and booking confirmations.",
  },
  {
    prefix: "/owner/profile",
    title: "Owner Profile & Payouts",
    description: "Your contact details, resort license and bank info.",
  },
    {
    prefix: "/owner/re-properties",
    title: "RE Properties",
    description: "Manage your real estate property listings.",
  },
  {
    prefix: "/owner/re-deals",
    title: "RE Deals",
    description: "Track your real estate property deals.",
  },
];

export default function OwnerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage =
    pathname === "/owner/login" || pathname === "/owner/register";

  useEffect(() => {
    setMobileMenuOpen(false);

    if (isAuthPage) {
      setAuthorized(true);
      return;
    }

    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setAuthorized(true);
  }, [pathname, isAuthPage, router]);

  if (isAuthPage) {
    return children;
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0]">
        <p className="text-sm font-semibold text-slate-600">
          Checking your resort partner session...
        </p>
      </main>
    );
  }

  const currentPage = pageDetails.find((page) =>
    pathname.startsWith(page.prefix)
  );

  const title = currentPage?.title || "Resort Partner Extranet";
  const description =
    currentPage?.description || "Manage your property and guest stays.";

  return (
    <div className="min-h-screen bg-[#F7F5F0] lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden w-[230px] shrink-0 lg:sticky lg:top-0 lg:block lg:h-screen">
        <OwnerSidebar />
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="absolute inset-y-0 left-0 w-[260px] max-w-[85vw] shadow-2xl">
            <div className="absolute right-3 top-3 z-10">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                <X size={19} />
              </button>
            </div>

            <OwnerSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="min-w-0 flex-1">
        <OwnerHeader
          title={title}
          description={description}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}