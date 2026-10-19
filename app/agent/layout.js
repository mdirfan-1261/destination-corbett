
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AgentSidebar from "@/components/agent/AgentSidebar";
import AgentHeader from "@/components/agent/AgentHeader";
import { X } from "lucide-react";

const pageDetails = [
  {
    prefix: "/agent/dashboard",
    title: "Overview",
    description: "Your B2B booking business and commissions at a glance.",
  },
  {
    prefix: "/agent/explore",
    title: "Explore Resorts",
    description: "Browse live Corbett properties & book stays for your clients.",
  },
  {
    prefix: "/agent/bookings",
    title: "Client Bookings",
    description: "Review and track bookings made for your clients.",
  },
  {
    prefix: "/agent/commissions",
    title: "My Commissions",
    description: "Track your commission earnings and payout status.",
  },
  {
    prefix: "/agent/profile",
    title: "Agent Profile",
    description: "View your agency profile and bank settlement details.",
  },
    {
    prefix: "/agent/re-leads",
    title: "Property Leads",
    description: "Buyer enquiries assigned to you — follow up and convert.",
  },
  {
    prefix: "/agent/re-deals",
    title: "RE Deals & Earnings",
    description: "Track your real estate deals and commission payouts.",
  },
];

export default function AgentLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage =
    pathname === "/agent/login" || pathname === "/agent/register";

  useEffect(() => {
    setMobileMenuOpen(false);

    if (isAuthPage) {
      setAuthorized(true);
      return;
    }

    const token = localStorage.getItem("agentToken");

    if (!token) {
      router.replace("/agent/login");
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
        <p className="text-sm text-slate-600">Checking your account...</p>
      </main>
    );
  }

  const currentPage = pageDetails.find((page) =>
    pathname.startsWith(page.prefix)
  );

  const title = currentPage?.title || "Property Partner Portal";
  const description =
    currentPage?.description || "Manage your property business.";

  return (
    <div className="min-h-screen bg-[#F7F5F0] lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden w-[224px] shrink-0 lg:sticky lg:top-0 lg:block lg:h-screen">
        <AgentSidebar />
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

          <div className="absolute inset-y-0 left-0 w-[256px] max-w-[85vw] shadow-2xl">
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

            <AgentSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <AgentHeader
          title={title}
          description={description}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
