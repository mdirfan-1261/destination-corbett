"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  Mail,
  Hotel,
  Trees,
  CalendarDays,
  BarChart3,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Building2,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // LOGIN CHECK
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  // LOAD THEME
  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  // SAVE THEME
  useEffect(() => {
    if (pathname === "/admin/login") return;
    localStorage.setItem("adminTheme", darkMode ? "dark" : "light");
  }, [darkMode, pathname]);

  // CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    setSidebarOpen(false);
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "text-white" : "text-[#18352A]"
      }`}
    >
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-20 bg-[#F5F7FA]" />

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 -z-10 transition-all duration-300 ${
          darkMode ? "bg-[#07100C]/40" : "bg-[#F5F7FA]/70"
        }`}
      />

      {/* TOP HEADER */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ${
          darkMode
            ? "border-white/10 bg-[#142019]/85"
            : "border-[#18352A]/20 bg-[#18352A]/95"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* MOBILE HAMBURGER BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen((prev) => !prev);
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-[#18352A] text-white shadow-md transition active:scale-95 md:hidden"
              aria-label="Open mobile menu"
            >
              <Menu size={18} />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#18352A]/95 text-[#E8DDC8] shadow-md">
              <Trees size={19} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-wider text-white sm:text-sm">
                DESTINATION CORBETT
              </h1>

              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-[#B8C19F]">
                Admin Console
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR DRAWER */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="absolute left-0 top-0 flex h-full w-64 max-w-[85%] flex-col border-r border-white/20 bg-[#142019] p-4 text-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B8C19F]">
                  Admin Navigation
                </p>

                <h2 className="text-sm font-bold text-white">
                  Destination Corbett
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="space-y-1 overflow-y-auto text-xs font-semibold">
              <Link
                href="/admin/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition ${
                  pathname === "/admin/dashboard"
                    ? "bg-[#C87532] font-bold text-white shadow-md"
                    : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/admin/enquiries"
                onClick={() => setSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition ${
                  pathname.startsWith("/admin/enquiries")
                    ? "bg-[#C87532] font-bold text-white shadow-md"
                    : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Mail size={17} />
                <span>Enquiries</span>
              </Link>

              <Link
                href="/admin/hotels"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[#C7D0BC] hover:bg-white/10 hover:text-white"
              >
                <Hotel size={17} />
                <span>Hotels & Stays</span>
              </Link>

              <Link
                href="/admin/safari"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[#C7D0BC] hover:bg-white/10 hover:text-white"
              >
                <Trees size={17} />
                <span>Safari</span>
              </Link>

              <Link
                href="/admin/events"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[#C7D0BC] hover:bg-white/10 hover:text-white"
              >
                <CalendarDays size={17} />
                <span>Events</span>
              </Link>

              <Link
                href="/admin/organisation"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[#C7D0BC] hover:bg-white/10 hover:text-white"
              >
                <Building2 size={17} />
                <span>Organisation</span>
              </Link>

              <Link
                href="/admin/analytics"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[#C7D0BC] hover:bg-white/10 hover:text-white"
              >
                <BarChart3 size={17} />
                <span>Analytics</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* DESKTOP MAIN CONTAINER */}
      <div className="flex">
        {/* ALWAYS VISIBLE DESKTOP SIDEBAR (SLIM W-52) */}
        <aside
          className={`sticky top-14 hidden h-[calc(100vh-56px)] shrink-0 border-r border-white/10 bg-[#18352A] backdrop-blur-2xl transition-all duration-300 md:block ${
            sidebarCollapsed ? "w-16" : "w-52"
          }`}
        >
          {/* SIDEBAR INNER */}
          <div className="relative flex h-full flex-col justify-between p-2.5">
            <div>
              {/* SIDEBAR HEADER */}
              <div
                className={`mb-4 flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-between px-1"
                }`}
              >
                {!sidebarCollapsed && (
                  <div>
                    <p className="text-[8.5px] font-extrabold uppercase tracking-[0.2em] text-[#B8C19F]">
                      MANAGEMENT
                    </p>

                    <h2 className="mt-0.5 text-xs font-extrabold text-[#F7F4EC]">
                      Corbett Admin
                    </h2>
                  </div>
                )}

                {/* TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-[#F7F4EC] shadow-xs transition-all hover:bg-[#C87532] hover:text-white"
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? (
                    <PanelLeft size={15} />
                  ) : (
                    <PanelLeftClose size={15} />
                  )}
                </button>
              </div>

              {/* NAVIGATION */}
              <nav className="space-y-1 text-xs font-semibold">
                {/* Dashboard */}
                <Link
                  href="/admin/dashboard"
                  className={`group relative flex w-full items-center rounded-lg py-2 transition-all duration-200 ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  } ${
                    pathname === "/admin/dashboard"
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                  title={sidebarCollapsed ? "Dashboard" : ""}
                >
                  <LayoutDashboard size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Dashboard</span>}
                </Link>

                {/* Enquiries */}
                <Link
                  href="/admin/enquiries"
                  className={`group relative flex w-full items-center rounded-lg py-2 transition-all duration-200 ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  } ${
                    pathname.startsWith("/admin/enquiries")
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                  title={sidebarCollapsed ? "Enquiries" : ""}
                >
                  <Mail size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Enquiries</span>}
                </Link>

                {/* Hotels */}
                <Link
                  href="/admin/hotels"
                  className={`group relative flex w-full items-center rounded-lg py-2 text-[#C7D0BC] transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  }`}
                  title={sidebarCollapsed ? "Hotels & Stays" : ""}
                >
                  <Hotel size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Hotels & Stays</span>}
                </Link>

                {/* Safari */}
                <Link
                  href="/admin/safari"
                  className={`group relative flex w-full items-center rounded-lg py-2 text-[#C7D0BC] transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  }`}
                  title={sidebarCollapsed ? "Safari" : ""}
                >
                  <Trees size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Safari</span>}
                </Link>

                {/* Events */}
                <Link
                  href="/admin/events"
                  className={`group relative flex w-full items-center rounded-lg py-2 text-[#C7D0BC] transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  }`}
                  title={sidebarCollapsed ? "Events" : ""}
                >
                  <CalendarDays size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Events</span>}
                </Link>

                {/* Weddings */}
                <Link
                  href="/admin/weddings"
                  className={`group relative flex w-full items-center rounded-lg py-2 text-[#C7D0BC] transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  }`}
                  title={sidebarCollapsed ? "Weddings" : ""}
                >
                  <CalendarDays size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Weddings</span>}
                </Link>

                {/* Organisation */}
                <Link
                  href="/admin/organisation"
                  className={`group relative flex w-full items-center rounded-lg py-2 text-[#C7D0BC] transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  }`}
                  title={sidebarCollapsed ? "Organisation" : ""}
                >
                  <Building2 size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Organisation</span>}
                </Link>

                {/* Analytics */}
                <Link
                  href="/admin/analytics"
                  className={`group relative flex w-full items-center rounded-lg py-2 text-[#C7D0BC] transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "gap-2.5 px-2.5"
                  }`}
                  title={sidebarCollapsed ? "Analytics" : ""}
                >
                  <BarChart3 size={17} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Analytics</span>}
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* PAGE CONTENT */}
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </main>
  );
}