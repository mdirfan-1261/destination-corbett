"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Mail,
  Hotel,
  Trees,
  CalendarDays,
  BarChart3,
  X,
  Menu,
  PanelLeft,
  PanelLeftClose,
  Building2,
  Users,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}) {
  const pathname = usePathname();

  const [administrationOpen, setAdministrationOpen] =
    useState(false);

  // Automatically open Administration
  // when user is inside Administration pages
  useEffect(() => {
    if (pathname.startsWith("/admin/administration")) {
      setAdministrationOpen(true);
    }
  }, [pathname]);

  // Close mobile sidebar after navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const administrationActive =
    pathname.startsWith("/admin/administration");

  const getLinkClass = (active, collapsed) => {
    return `group relative flex w-full items-center rounded-lg py-2 transition-all duration-200 ${
      collapsed
        ? "justify-center px-0"
        : "gap-2.5 px-2.5"
    } ${
      active
        ? "bg-[#C87532] font-bold text-white shadow-md"
        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <>
      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">

          {/* OVERLAY */}
          <div
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* DRAWER */}
          <div className="absolute left-0 top-0 flex h-full w-64 max-w-[85%] flex-col border-r border-white/20 bg-[#142019] p-4 text-white shadow-2xl">

            {/* DRAWER HEADER */}
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

            {/* MOBILE NAV */}
            <nav className="space-y-1 overflow-y-auto text-xs font-semibold">

              {/* DASHBOARD */}
              <Link
                href="/admin/dashboard"
                className={getLinkClass(
                  pathname === "/admin/dashboard",
                  false
                )}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </Link>

              {/* ENQUIRIES */}
              <Link
                href="/admin/enquiries"
                className={getLinkClass(
                  pathname.startsWith("/admin/enquiries"),
                  false
                )}
              >
                <Mail size={17} />
                <span>Enquiries</span>
              </Link>

              {/* CUSTOMERS */}
              <Link
                href="/admin/customers"
                className={getLinkClass(
                  pathname.startsWith("/admin/customers"),
                  false
                )}
              >
                <Users size={17} />
                <span>Customers</span>
              </Link>

              {/* ADMINISTRATION */}
              <button
                type="button"
                onClick={() =>
                  setAdministrationOpen((prev) => !prev)
                }
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition ${
                  administrationActive
                    ? "bg-white/10 text-white"
                    : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck size={17} />

                  <span>
                    Administration
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    administrationOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* ADMINISTRATION CHILDREN */}
              {administrationOpen && (
                <div className="ml-4 space-y-1 border-l border-white/10 pl-3">

                  {/* USER MANAGEMENT */}
                  <Link
                    href="/admin/administration/users"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname.startsWith(
                        "/admin/administration/users"
                      )
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Users size={15} />

                    <span>
                      User Management
                    </span>
                  </Link>

                  {/* ROLES */}
                  <Link
                    href="/admin/administration/roles"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname.startsWith(
                        "/admin/administration/roles"
                      )
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ShieldCheck size={15} />

                    <span>
                      Roles & Permissions
                    </span>
                  </Link>

                </div>
              )}

              {/* HOTELS */}
              <Link
                href="/admin/hotels"
                className={getLinkClass(
                  pathname.startsWith("/admin/hotels"),
                  false
                )}
              >
                <Hotel size={17} />
                <span>Hotels & Stays</span>
              </Link>

              {/* SAFARI */}
              <Link
                href="/admin/safari"
                className={getLinkClass(
                  pathname.startsWith("/admin/safari"),
                  false
                )}
              >
                <Trees size={17} />
                <span>Safari</span>
              </Link>

              {/* EVENTS */}
              <Link
                href="/admin/events"
                className={getLinkClass(
                  pathname.startsWith("/admin/events"),
                  false
                )}
              >
                <CalendarDays size={17} />
                <span>Events</span>
              </Link>

              {/* WEDDINGS */}
              <Link
                href="/admin/weddings"
                className={getLinkClass(
                  pathname.startsWith("/admin/weddings"),
                  false
                )}
              >
                <CalendarDays size={17} />
                <span>Weddings</span>
              </Link>

              {/* ORGANISATION */}
              <Link
                href="/admin/organisation"
                className={getLinkClass(
                  pathname.startsWith("/admin/organisation"),
                  false
                )}
              >
                <Building2 size={17} />
                <span>Organisation</span>
              </Link>

              {/* ANALYTICS */}
              <Link
                href="/admin/analytics"
                className={getLinkClass(
                  pathname.startsWith("/admin/analytics"),
                  false
                )}
              >
                <BarChart3 size={17} />
                <span>Analytics</span>
              </Link>

            </nav>
          </div>
        </div>
      )}

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className={`sticky top-14 hidden h-[calc(100vh-56px)] shrink-0 border-r border-white/10 bg-[#18352A] backdrop-blur-2xl transition-all duration-300 md:block ${
          sidebarCollapsed
            ? "w-16"
            : "w-52"
        }`}
      >

        <div className="relative flex h-full flex-col p-2.5">

          {/* SIDEBAR HEADER */}
          <div
            className={`mb-4 flex items-center ${
              sidebarCollapsed
                ? "justify-center"
                : "justify-between px-1"
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

            <button
              type="button"
              onClick={() =>
                setSidebarCollapsed((prev) => !prev)
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-[#F7F4EC] shadow-xs transition-all hover:bg-[#C87532] hover:text-white"
              title={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <PanelLeft size={15} />
              ) : (
                <PanelLeftClose size={15} />
              )}
            </button>

          </div>

          {/* DESKTOP NAV */}
          <nav className="space-y-1 text-xs font-semibold">

            {/* DASHBOARD */}
            <Link
              href="/admin/dashboard"
              className={getLinkClass(
                pathname === "/admin/dashboard",
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Dashboard"
                  : ""
              }
            >
              <LayoutDashboard size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Dashboard
                </span>
              )}
            </Link>

            {/* ENQUIRIES */}
            <Link
              href="/admin/enquiries"
              className={getLinkClass(
                pathname.startsWith("/admin/enquiries"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Enquiries"
                  : ""
              }
            >
              <Mail size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Enquiries
                </span>
              )}
            </Link>

            {/* CUSTOMERS */}
            <Link
              href="/admin/customers"
              className={getLinkClass(
                pathname.startsWith("/admin/customers"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Customers"
                  : ""
              }
            >
              <Users size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Customers
                </span>
              )}
            </Link>

            {/* ADMINISTRATION */}
            <button
              type="button"
              onClick={() =>
                setAdministrationOpen((prev) => !prev)
              }
              className={`flex w-full items-center rounded-lg py-2 transition-all duration-200 ${
                sidebarCollapsed
                  ? "justify-center px-0"
                  : "justify-between px-2.5"
              } ${
                administrationActive
                  ? "bg-white/10 text-white"
                  : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
              }`}
              title={
                sidebarCollapsed
                  ? "Administration"
                  : ""
              }
            >

              <span
                className={`flex items-center ${
                  sidebarCollapsed
                    ? "justify-center"
                    : "gap-2.5"
                }`}
              >
                <ShieldCheck size={17} />

                {!sidebarCollapsed && (
                  <span className="truncate">
                    Administration
                  </span>
                )}
              </span>

              {!sidebarCollapsed && (
                <ChevronDown
                  size={15}
                  className={`shrink-0 transition-transform ${
                    administrationOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              )}

            </button>

            {/* ADMINISTRATION CHILDREN */}
            {!sidebarCollapsed &&
              administrationOpen && (
                <div className="ml-3 space-y-1 border-l border-white/10 pl-3">

                  {/* USER MANAGEMENT */}
                  <Link
                    href="/admin/administration/users"
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                      pathname.startsWith(
                        "/admin/administration/users"
                      )
                        ? "bg-[#C87532] font-bold text-white shadow-md"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Users size={15} />

                    <span className="truncate">
                      User Management
                    </span>
                  </Link>

                  {/* ROLES */}
                  <Link
                    href="/admin/administration/roles"
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                      pathname.startsWith(
                        "/admin/administration/roles"
                      )
                        ? "bg-[#C87532] font-bold text-white shadow-md"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ShieldCheck size={15} />

                    <span className="truncate">
                      Roles & Permissions
                    </span>
                  </Link>

                </div>
              )}

            {/* HOTELS */}
            <Link
              href="/admin/hotels"
              className={getLinkClass(
                pathname.startsWith("/admin/hotels"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Hotels & Stays"
                  : ""
              }
            >
              <Hotel size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Hotels & Stays
                </span>
              )}
            </Link>

            {/* SAFARI */}
            <Link
              href="/admin/safari"
              className={getLinkClass(
                pathname.startsWith("/admin/safari"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Safari"
                  : ""
              }
            >
              <Trees size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Safari
                </span>
              )}
            </Link>

            {/* EVENTS */}
            <Link
              href="/admin/events"
              className={getLinkClass(
                pathname.startsWith("/admin/events"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Events"
                  : ""
              }
            >
              <CalendarDays size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Events
                </span>
              )}
            </Link>

            {/* WEDDINGS */}
            <Link
              href="/admin/weddings"
              className={getLinkClass(
                pathname.startsWith("/admin/weddings"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Weddings"
                  : ""
              }
            >
              <CalendarDays size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Weddings
                </span>
              )}
            </Link>

            {/* ORGANISATION */}
            <Link
              href="/admin/organisation"
              className={getLinkClass(
                pathname.startsWith("/admin/organisation"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Organisation"
                  : ""
              }
            >
              <Building2 size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Organisation
                </span>
              )}
            </Link>

            {/* ANALYTICS */}
            <Link
              href="/admin/analytics"
              className={getLinkClass(
                pathname.startsWith("/admin/analytics"),
                sidebarCollapsed
              )}
              title={
                sidebarCollapsed
                  ? "Analytics"
                  : ""
              }
            >
              <BarChart3 size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">
                  Analytics
                </span>
              )}
            </Link>

          </nav>
        </div>
      </aside>
    </>
  );
}