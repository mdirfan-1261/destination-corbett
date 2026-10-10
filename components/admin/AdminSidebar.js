
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
  PanelLeft,
  PanelLeftClose,
  Building2,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Archive,
  Network,
  ClipboardList,
  Settings2,
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

  const [organisationOpen, setOrganisationOpen] =
    useState(false);

  const [departmentsOpen, setDepartmentsOpen] =
    useState(false);

  // Automatically open Administration
  // when user is inside Administration pages
  useEffect(() => {
    if (pathname.startsWith("/admin/administration")) {
      setAdministrationOpen(true);
    }
  }, [pathname]);

  // Automatically open Organisation
  // when user is inside Organisation pages
  useEffect(() => {
    if (pathname.startsWith("/admin/organisation")) {
      setOrganisationOpen(true);
    }
  }, [pathname]);

  // Automatically open Departments & Groups
  // when user is inside a department page
  useEffect(() => {
    if (
      pathname.startsWith(
        "/admin/organisation/departments"
      )
    ) {
      setDepartmentsOpen(true);
    }
  }, [pathname]);

  // Close mobile sidebar after navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const administrationActive =
    pathname.startsWith("/admin/administration");

  const organisationActive =
    pathname.startsWith("/admin/organisation");

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

              {/* BOOKINGS */}
              <Link
                href="/admin/bookings"
                className={getLinkClass(
                  pathname.startsWith("/admin/bookings"),
                  false
                )}
              >
                <ClipboardList size={17} />
                <span>Bookings</span>
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
                  <span>Administration</span>
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    administrationOpen ? "rotate-180" : ""
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
                    <span>User Management</span>
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
                    <span>Roles & Permissions</span>
                  </Link>

                  {/* GROUPS */}
                  <Link
                    href="/admin/administration/groups"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname.startsWith(
                        "/admin/administration/groups"
                      )
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Building2 size={15} />
                    <span>Groups & Departments</span>
                  </Link>

                  {/* RECOVERY BIN */}
                  <Link
                    href="/admin/administration/recovery"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname.startsWith(
                        "/admin/administration/recovery"
                      )
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Archive size={15} />
                    <span>Recovery Bin</span>
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

              {/* ORGANISATION MOBILE DROPDOWN */}
              <button
                type="button"
                onClick={() =>
                  setOrganisationOpen((prev) => !prev)
                }
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition ${
                  organisationActive
                    ? "bg-white/10 text-white"
                    : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Building2 size={17} />
                  <span>Organisation</span>
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    organisationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ORGANISATION MOBILE CHILDREN */}
              {organisationOpen && (
                <div className="ml-4 space-y-1 border-l border-white/10 pl-3">

                  <Link
                    href="/admin/organisation"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname === "/admin/organisation"
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Building2 size={15} />
                    <span>Overview</span>
                  </Link>

                  <Link
                    href="/admin/organisation/profile"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname === "/admin/organisation/profile"
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Settings2 size={15} />
                    <span>Company Profile</span>
                  </Link>

                  {/* DEPARTMENTS & GROUPS */}
                  <button
                    type="button"
                    onClick={() =>
                      setDepartmentsOpen((prev) => !prev)
                    }
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-[#C7D0BC] transition hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Network size={15} />
                      <span className="truncate">
                        Departments & Groups
                      </span>
                    </span>

                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition-transform ${
                        departmentsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* DEPARTMENT LINKS */}
                  {departmentsOpen && (
                    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
                      {[
                        ["Safari", "/admin/organisation/departments/safari"],
                        ["Stay", "/admin/organisation/departments/stay"],
                        ["Events", "/admin/organisation/departments/events"],
                        ["Weddings", "/admin/organisation/departments/weddings"],
                        ["Packages", "/admin/organisation/departments/packages"],
                      ].map(([name, href]) => (
                        <Link
                          key={name}
                          href={href}
                          className={`block rounded-lg px-3 py-2 transition ${
                            pathname === href
                              ? "bg-[#C87532] font-bold text-white"
                              : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/admin/organisation/members"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname.startsWith(
                        "/admin/organisation/members"
                      )
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Users size={15} />
                    <span>Members</span>
                  </Link>

                  <Link
                    href="/admin/organisation/policies"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname.startsWith(
                        "/admin/organisation/policies"
                      )
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ShieldCheck size={15} />
                    <span>Booking Policies</span>
                  </Link>

                  <Link
                    href="/admin/organisation/activity-logs"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                      pathname.startsWith(
                        "/admin/organisation/activity-logs"
                      )
                        ? "bg-[#C87532] font-bold text-white"
                        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ClipboardList size={15} />
                    <span>Activity Logs</span>
                  </Link>

                </div>
              )}

              

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
          sidebarCollapsed ? "w-16" : "w-52"
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
          <nav className="space-y-1 overflow-y-auto text-xs font-semibold">

            {/* DASHBOARD */}
            <Link
              href="/admin/dashboard"
              className={getLinkClass(
                pathname === "/admin/dashboard",
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Dashboard" : ""}
            >
              <LayoutDashboard size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Dashboard</span>
              )}
            </Link>

            {/* ENQUIRIES */}
            <Link
              href="/admin/enquiries"
              className={getLinkClass(
                pathname.startsWith("/admin/enquiries"),
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Enquiries" : ""}
            >
              <Mail size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Enquiries</span>
              )}
            </Link>

            {/* CUSTOMERS */}
            <Link
              href="/admin/customers"
              className={getLinkClass(
                pathname.startsWith("/admin/customers"),
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Customers" : ""}
            >
              <Users size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Customers</span>
              )}
            </Link>

            {/* BOOKINGS */}
            <Link
              href="/admin/bookings"
              className={getLinkClass(
                pathname.startsWith("/admin/bookings"),
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Bookings" : ""}
            >
              <ClipboardList size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Bookings</span>
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
              title={sidebarCollapsed ? "Administration" : ""}
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
                    administrationOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* ADMINISTRATION CHILDREN */}
            {!sidebarCollapsed && administrationOpen && (
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
                  <span className="truncate">User Management</span>
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

                {/* GROUPS */}
                <Link
                  href="/admin/administration/groups"
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                    pathname.startsWith(
                      "/admin/administration/groups"
                    )
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Building2 size={15} />
                  <span className="truncate">
                    Groups & Departments
                  </span>
                </Link>

                {/* RECOVERY BIN */}
                <Link
                  href="/admin/administration/recovery"
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                    pathname.startsWith(
                      "/admin/administration/recovery"
                    )
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Archive size={15} />
                  <span className="truncate">Recovery Bin</span>
                </Link>

              </div>
            )}

            {/* ORGANISATION */}
            <button
              type="button"
              onClick={() =>
                setOrganisationOpen((prev) => !prev)
              }
              className={`flex w-full items-center rounded-lg py-2 transition-all duration-200 ${
                sidebarCollapsed
                  ? "justify-center px-0"
                  : "justify-between px-2.5"
              } ${
                organisationActive
                  ? "bg-white/10 text-white"
                  : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
              }`}
              title={sidebarCollapsed ? "Organisation" : ""}
            >
              <span
                className={`flex items-center ${
                  sidebarCollapsed
                    ? "justify-center"
                    : "gap-2.5"
                }`}
              >
                <Building2 size={17} />

                {!sidebarCollapsed && (
                  <span className="truncate">Organisation</span>
                )}
              </span>

              {!sidebarCollapsed && (
                <ChevronDown
                  size={15}
                  className={`shrink-0 transition-transform ${
                    organisationOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* ORGANISATION CHILDREN */}
            {!sidebarCollapsed && organisationOpen && (
              <div className="ml-3 space-y-1 border-l border-white/10 pl-3">

                {/* OVERVIEW */}
                <Link
                  href="/admin/organisation"
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                    pathname === "/admin/organisation"
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Building2 size={15} />
                  <span className="truncate">Overview</span>
                </Link>

                {/* COMPANY PROFILE */}
                <Link
                  href="/admin/organisation/profile"
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                    pathname === "/admin/organisation/profile"
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Settings2 size={15} />
                  <span className="truncate">Company Profile</span>
                </Link>

                {/* DEPARTMENTS & GROUPS */}
                <button
                  type="button"
                  onClick={() =>
                    setDepartmentsOpen((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[#C7D0BC] transition hover:bg-white/10 hover:text-white"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Network size={15} />
                    <span className="truncate">
                      Departments & Groups
                    </span>
                  </span>

                  <ChevronDown
                    size={14}
                    className={`shrink-0 transition-transform ${
                      departmentsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DEPARTMENT LINKS */}
                {departmentsOpen && (
                  <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
                    {[
                      ["Safari", "/admin/organisation/departments/safari"],
                      ["Stay", "/admin/organisation/departments/stay"],
                      ["Events", "/admin/organisation/departments/events"],
                      ["Weddings", "/admin/organisation/departments/weddings"],
                      ["Packages", "/admin/organisation/departments/packages"],
                    ].map(([name, href]) => (
                      <Link
                        key={name}
                        href={href}
                        className={`block rounded-lg px-2.5 py-2 transition ${
                          pathname === href
                            ? "bg-[#C87532] font-bold text-white shadow-md"
                            : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* MEMBERS */}
                <Link
                  href="/admin/organisation/members"
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                    pathname.startsWith(
                      "/admin/organisation/members"
                    )
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Users size={15} />
                  <span className="truncate">Members</span>
                </Link>

                {/* BOOKING POLICIES */}
                <Link
                  href="/admin/organisation/policies"
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                    pathname.startsWith(
                      "/admin/organisation/policies"
                    )
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ShieldCheck size={15} />
                  <span className="truncate">Booking Policies</span>
                </Link>

                {/* ACTIVITY LOGS */}
                <Link
                  href="/admin/organisation/activity-logs"
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                    pathname.startsWith(
                      "/admin/organisation/activity-logs"
                    )
                      ? "bg-[#C87532] font-bold text-white shadow-md"
                      : "text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ClipboardList size={15} />
                  <span className="truncate">Activity Logs</span>
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
              title={sidebarCollapsed ? "Hotels & Stays" : ""}
            >
              <Hotel size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Hotels & Stays</span>
              )}
            </Link>

            {/* SAFARI */}
            <Link
              href="/admin/safari"
              className={getLinkClass(
                pathname.startsWith("/admin/safari"),
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Safari" : ""}
            >
              <Trees size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Safari</span>
              )}
            </Link>

            {/* EVENTS */}
            <Link
              href="/admin/events"
              className={getLinkClass(
                pathname.startsWith("/admin/events"),
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Events" : ""}
            >
              <CalendarDays size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Events</span>
              )}
            </Link>

            {/* WEDDINGS */}
            <Link
              href="/admin/weddings"
              className={getLinkClass(
                pathname.startsWith("/admin/weddings"),
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Weddings" : ""}
            >
              <CalendarDays size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Weddings</span>
              )}
            </Link>

            {/* ANALYTICS */}
            <Link
              href="/admin/analytics"
              className={getLinkClass(
                pathname.startsWith("/admin/analytics"),
                sidebarCollapsed
              )}
              title={sidebarCollapsed ? "Analytics" : ""}
            >
              <BarChart3 size={17} />

              {!sidebarCollapsed && (
                <span className="truncate">Analytics</span>
              )}
            </Link>

          </nav>
        </div>
      </aside>
    </>
  );
}

