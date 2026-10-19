"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, CalendarCheck, CalendarDays,
  UserRound, LogOut, Trees, ChevronRight, Home, Handshake,
} from "lucide-react";

const hotelNav = [
  { label: "Dashboard",          href: "/owner/dashboard",  icon: LayoutDashboard },
  { label: "My Properties",      href: "/owner/properties", icon: Building2 },
  { label: "Availability Calendar", href: "/owner/calendar", icon: CalendarDays },
  { label: "Resort Bookings",    href: "/owner/bookings",   icon: CalendarCheck },
  { label: "Profile & Payouts",  href: "/owner/profile",    icon: UserRound },
];

const realEstateNav = [
  { label: "RE Properties", href: "/owner/re-properties", icon: Home },
  { label: "RE Deals",      href: "/owner/re-deals",      icon: Handshake },
];

export default function OwnerSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("destin_owner_token");
    localStorage.removeItem("destin_owner_user");
    router.replace("/owner/login");
  };

  const isActive = (href) => {
    if (href === "/owner/dashboard") return pathname === href;
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
          active ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <Icon size={19} className="shrink-0" />
        <span className="flex-1">{item.label}</span>
        {active && <ChevronRight size={16} />}
      </Link>
    );
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-[#111c24] text-white">
      {/* Brand */}
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/owner/dashboard" onClick={onNavigate} className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600">
            <Trees size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-[0.08em]">DESTINATION</p>
            <p className="mt-0.5 text-xs font-semibold tracking-[0.16em] text-emerald-400">CORBETT</p>
            <p className="mt-1 text-[11px] text-slate-400">Resort Owner Extranet</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {/* Hotel Section */}
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          🏨 Hotel Management
        </p>
        {hotelNav.map(item => <NavLink key={item.href} item={item} />)}

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
          <p className="text-xs font-semibold text-white">Resort & Property Partner</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            Manage rooms, rates & real estate listings.
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