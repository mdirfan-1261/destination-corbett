"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Compass, CalendarCheck, UserRound,
  Wallet, LogOut, Trees, ChevronRight, Home, Handshake, IndianRupee,
} from "lucide-react";

const resortNav = [
  { label: "Overview",       href: "/agent/dashboard",   icon: LayoutDashboard },
  { label: "Explore Resorts", href: "/agent/explore",    icon: Compass },
  { label: "Client Bookings", href: "/agent/bookings",   icon: CalendarCheck },
  { label: "My Commissions",  href: "/agent/commissions", icon: Wallet },
  { label: "Agent Profile",   href: "/agent/profile",    icon: UserRound },
];

const realEstateNav = [
  { label: "Property Leads", href: "/agent/re-leads", icon: Home },
  { label: "RE Deals",       href: "/agent/re-deals", icon: Handshake },
];

export default function AgentSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("agentToken");
    localStorage.removeItem("agentUser");
    router.replace("/agent/login");
  };

  const isActive = (href) => {
    if (href === "/agent/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
          active ? "bg-[#B96928] text-white shadow-sm" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <Icon size={19} className="shrink-0" />
        <span className="flex-1">{item.label}</span>
        {active && <ChevronRight size={16} />}
      </Link>
    );
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-[#172033] text-white">
      {/* Brand */}
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/agent/dashboard" onClick={onNavigate} className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B96928]">
            <Trees size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-[0.08em]">DESTINATION</p>
            <p className="mt-0.5 text-xs font-semibold tracking-[0.16em] text-[#D8A36B]">CORBETT</p>
            <p className="mt-1 text-[11px] text-slate-400">Travel Agent B2B Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {/* Resort Section */}
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          🏨 Resort Booking
        </p>
        {resortNav.map(item => <NavLink key={item.href} item={item} />)}

        {/* Real Estate Section */}
        <div className="my-4 border-t border-white/10" />
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          🏠 Real Estate
        </p>
        {realEstateNav.map(item => <NavLink key={item.href} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-3 rounded-xl bg-white/[0.05] px-3 py-3">
          <p className="text-xs font-semibold text-white">Travel Agent Partner</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            Book Corbett stays & manage property leads.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );
}