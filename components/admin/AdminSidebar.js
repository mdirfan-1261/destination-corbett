
"use client";

import { useCallback, useEffect, useState } from "react";
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
  Archive,
  Network,
  ClipboardList,
  Settings2,
  ImagePlus,
  Handshake,
  Wallet,
  CheckCircle2,
  Home,
} from "lucide-react";

const ACTIVE_COLOR = "#B96928";
const TEXT_COLOR = "#C7D0BC";

const departmentLinks = [
  ["Manage All Departments", "/admin/organisation/departments"],
  ["Safari", "/admin/organisation/departments/safari"],
  ["Stay", "/admin/organisation/departments/stay"],
  ["Events", "/admin/organisation/departments/events"],
  ["Weddings", "/admin/organisation/departments/weddings"],
  ["Packages", "/admin/organisation/departments/packages"],
];

const safariLinks = [
  ["Jeep Safari", "/admin/organisation/departments/safari/jeep"],
  ["Canter Safari", "/admin/organisation/departments/safari/canter"],
  ["Safari Zones", "/admin/organisation/departments/safari/zones"],
  [
    "Nature Activities",
    "/admin/organisation/departments/safari/nature-activities",
  ],
  [
    "Sightseeing",
    "/admin/organisation/departments/safari/sightseeing",
  ],
  [
    "Local Experiences",
    "/admin/organisation/departments/safari/local-experiences",
  ],
];

function isRouteActive(pathname, href, exact = false) {
  if (exact) return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}) {
  const pathname = usePathname();

  const [administrationOpen, setAdministrationOpen] = useState(false);
  const [organisationOpen, setOrganisationOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [safariOpen, setSafariOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [ownersOpen, setOwnersOpen] = useState(false);
  const [realEstateOpen, setRealEstateOpen] = useState(false);

  const administrationActive = pathname.startsWith(
    "/admin/administration"
  );

  const organisationActive = pathname.startsWith(
    "/admin/organisation"
  );

  const departmentsActive = pathname.startsWith(
    "/admin/organisation/departments"
  );

  const agentsActive = pathname.startsWith("/admin/agents");

  const ownersActive =
    pathname.startsWith("/admin/owners") ||
    pathname.startsWith("/admin/properties");

  const realEstateActive = pathname.startsWith("/admin/real-estate");

  // Keep the correct parent dropdown open for the current route.
  useEffect(() => {
    if (administrationActive) setAdministrationOpen(true);
    if (organisationActive) setOrganisationOpen(true);
    if (departmentsActive) setDepartmentsOpen(true);

    if (
      pathname.startsWith(
        "/admin/organisation/departments/safari"
      )
    ) {
      setSafariOpen(true);
    }

    if (agentsActive) setAgentsOpen(true);
    if (ownersActive) setOwnersOpen(true);
    if (realEstateActive) setRealEstateOpen(true);
  }, [
    pathname,
    administrationActive,
    organisationActive,
    departmentsActive,
    agentsActive,
    ownersActive,
    realEstateActive,
  ]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const closeMobileSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  const linkClass = (active, collapsed = false) =>
    [
      "group relative flex w-full min-w-0 items-center rounded-lg",
      "py-2 transition-colors duration-200",
      collapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
      active
        ? "font-bold text-white shadow-sm"
        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white",
    ].join(" ");

  const activeStyle = (active) =>
    active ? { backgroundColor: ACTIVE_COLOR } : undefined;

  const subLinkClass = (active) =>
    [
      "flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-2",
      "transition-colors duration-200",
      active
        ? "font-bold text-white shadow-sm"
        : "text-[#C7D0BC] hover:bg-white/10 hover:text-white",
    ].join(" ");

  // Shared link component for mobile and desktop.
  const NavLink = ({
    href,
    icon: Icon,
    children,
    active,
    collapsed = false,
    exact = false,
    mobile = false,
  }) => {
    const selected =
      active ?? isRouteActive(pathname, href, exact);

    return (
      <Link
        href={href}
        onClick={mobile ? closeMobileSidebar : undefined}
        title={collapsed ? String(children) : undefined}
        aria-current={selected ? "page" : undefined}
        style={activeStyle(selected)}
        className={linkClass(selected, collapsed)}
      >
        {Icon && <Icon size={17} className="shrink-0" />}

        {!collapsed && (
          <span className="min-w-0 truncate">{children}</span>
        )}
      </Link>
    );
  };

  // Shared expandable section header.
  const GroupButton = ({
    label,
    icon: Icon,
    open,
    active,
    onToggle,
    collapsed = false,
  }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      title={collapsed ? label : undefined}
      className={[
        "flex w-full items-center rounded-lg py-2",
        "transition-colors duration-200",
        collapsed ? "justify-center px-0" : "justify-between px-2.5",
        active
          ? "bg-white/10 text-white"
          : "text-[#C7D0BC] hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "flex min-w-0 items-center",
          collapsed ? "justify-center" : "gap-2.5",
        ].join(" ")}
      >
        <Icon size={17} className="shrink-0" />

        {!collapsed && (
          <span className="truncate">{label}</span>
        )}
      </span>

      {!collapsed && (
        <ChevronDown
          size={15}
          className={[
            "shrink-0 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      )}
    </button>
  );

  // A collapsed group click expands the sidebar and opens that group.
  const toggleGroup = (setter, currentValue) => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      setter(true);
      return;
    }

    setter(!currentValue);
  };

  const renderDepartmentLinks = (mobile = false) => (
    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
      {departmentLinks.map(([name, href]) => {
        const isSafari = name === "Safari";

        const active = isSafari
          ? pathname === href || pathname.startsWith(`${href}/`)
          : isRouteActive(pathname, href);

        return (
          <div key={href}>
            <div className="flex min-w-0 items-center gap-1">
              <Link
                href={href}
                onClick={mobile ? closeMobileSidebar : undefined}
                aria-current={active ? "page" : undefined}
                style={activeStyle(active)}
                className={[
                  "min-w-0 flex-1 rounded-lg px-2.5 py-2",
                  "transition-colors duration-200",
                  active
                    ? "font-bold text-white shadow-sm"
                    : "text-[#C7D0BC] hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <span className="block truncate">{name}</span>
              </Link>

              {isSafari && (
                <button
                  type="button"
                  onClick={() => setSafariOpen((prev) => !prev)}
                  aria-label={
                    safariOpen
                      ? "Collapse Safari options"
                      : "Expand Safari options"
                  }
                  aria-expanded={safariOpen}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#C7D0BC] hover:bg-white/10 hover:text-white"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      safariOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {isSafari && safariOpen && (
              <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                {safariLinks.map(([childName, childHref]) => {
                  const childActive = isRouteActive(
                    pathname,
                    childHref
                  );

                  return (
                    <Link
                      key={childHref}
                      href={childHref}
                      onClick={
                        mobile ? closeMobileSidebar : undefined
                      }
                      aria-current={
                        childActive ? "page" : undefined
                      }
                      style={activeStyle(childActive)}
                      className={[
                        "block rounded-lg px-2.5 py-2 text-[11px]",
                        "transition-colors duration-200",
                        childActive
                          ? "font-bold text-white shadow-sm"
                          : "text-[#C7D0BC] hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {childName}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderOwnerChildren = (mobile = false) => (
    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
      <NavLink
        href="/admin/owners"
        icon={Building2}
        exact
        mobile={mobile}
      >
        Resort Owners
      </NavLink>

      <NavLink
        href="/admin/properties"
        icon={Hotel}
        mobile={mobile}
      >
        Property Approvals
      </NavLink>
    </div>
  );

  const renderAgentChildren = (mobile = false) => (
    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
      <NavLink
        href="/admin/agents"
        icon={Users}
        exact
        mobile={mobile}
      >
        Agents
      </NavLink>

      <NavLink
        href="/admin/agents/commissions"
        icon={Wallet}
        mobile={mobile}
      >
        Commission Settings
      </NavLink>

      <NavLink
        href="/admin/commissions"
        icon={CheckCircle2}
        mobile={mobile}
      >
        Commission Approvals
      </NavLink>
    </div>
  );

  const renderRealEstateChildren = (mobile = false) => (
    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
      <NavLink
        href="/admin/real-estate/properties"
        icon={Building2}
        mobile={mobile}
      >
        RE Properties
      </NavLink>

      <NavLink
        href="/admin/real-estate/leads"
        icon={Users}
        mobile={mobile}
      >
        RE Leads
      </NavLink>

      <NavLink
        href="/admin/real-estate/deals"
        icon={Handshake}
        mobile={mobile}
      >
        RE Deals
      </NavLink>
    </div>
  );

  const renderAdministrationChildren = (mobile = false) => (
    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
      <NavLink
        href="/admin/administration/users"
        icon={Users}
        mobile={mobile}
      >
        User Management
      </NavLink>

      <NavLink
        href="/admin/administration/roles"
        icon={ShieldCheck}
        mobile={mobile}
      >
        Roles & Permissions
      </NavLink>

      <NavLink
        href="/admin/administration/groups"
        icon={Building2}
        mobile={mobile}
      >
        Groups & Departments
      </NavLink>

      <NavLink
        href="/admin/administration/recovery"
        icon={Archive}
        mobile={mobile}
      >
        Recovery Bin
      </NavLink>
    </div>
  );

  const renderOrganisationChildren = (mobile = false) => (
    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
      <NavLink
        href="/admin/organisation"
        icon={Building2}
        exact
        mobile={mobile}
      >
        Overview
      </NavLink>

      <NavLink
        href="/admin/organisation/profile"
        icon={Settings2}
        mobile={mobile}
      >
        Company Profile
      </NavLink>

      <GroupButton
        label="Departments & Groups"
        icon={Network}
        open={departmentsOpen}
        active={departmentsActive}
        onToggle={() => setDepartmentsOpen((prev) => !prev)}
      />

      {departmentsOpen && renderDepartmentLinks(mobile)}

      <NavLink
        href="/admin/organisation/members"
        icon={Users}
        mobile={mobile}
      >
        Members
      </NavLink>

      <NavLink
        href="/admin/organisation/policies"
        icon={ShieldCheck}
        mobile={mobile}
      >
        Booking Policies
      </NavLink>

      <NavLink
        href="/admin/organisation/activity-logs"
        icon={ClipboardList}
        mobile={mobile}
      >
        Activity Logs
      </NavLink>
    </div>
  );

  const renderNavigation = ({
    mobile = false,
    collapsed = false,
  } = {}) => (
    <nav className="space-y-1 overflow-y-auto text-xs font-semibold">
      <NavLink
        href="/admin/dashboard"
        icon={LayoutDashboard}
        exact
        collapsed={collapsed}
        mobile={mobile}
      >
        Dashboard
      </NavLink>

      <NavLink
        href="/admin/enquiries"
        icon={Mail}
        collapsed={collapsed}
        mobile={mobile}
      >
        Enquiries
      </NavLink>

      <NavLink
        href="/admin/customers"
        icon={Users}
        collapsed={collapsed}
        mobile={mobile}
      >
        Customers
      </NavLink>

      <GroupButton
        label="Resort Partners"
        icon={Building2}
        open={ownersOpen}
        active={ownersActive}
        collapsed={collapsed}
        onToggle={() => toggleGroup(setOwnersOpen, ownersOpen)}
      />

      {!collapsed && ownersOpen && renderOwnerChildren(mobile)}

      <GroupButton
        label="Agent Management"
        icon={Handshake}
        open={agentsOpen}
        active={agentsActive}
        collapsed={collapsed}
        onToggle={() => toggleGroup(setAgentsOpen, agentsOpen)}
      />

      {!collapsed && agentsOpen && renderAgentChildren(mobile)}

      <GroupButton
        label="Real Estate"
        icon={Home}
        open={realEstateOpen}
        active={realEstateActive}
        collapsed={collapsed}
        onToggle={() =>
          toggleGroup(setRealEstateOpen, realEstateOpen)
        }
      />

      {!collapsed &&
        realEstateOpen &&
        renderRealEstateChildren(mobile)}

      <NavLink
        href="/admin/bookings"
        icon={ClipboardList}
        collapsed={collapsed}
        mobile={mobile}
      >
        Bookings
      </NavLink>

      <NavLink
        href="/admin/media"
        icon={ImagePlus}
        collapsed={collapsed}
        mobile={mobile}
      >
        Media Library
      </NavLink>

      <GroupButton
        label="Administration"
        icon={ShieldCheck}
        open={administrationOpen}
        active={administrationActive}
        collapsed={collapsed}
        onToggle={() =>
          toggleGroup(setAdministrationOpen, administrationOpen)
        }
      />

      {!collapsed &&
        administrationOpen &&
        renderAdministrationChildren(mobile)}

      <GroupButton
        label="Organisation"
        icon={Building2}
        open={organisationOpen}
        active={organisationActive}
        collapsed={collapsed}
        onToggle={() =>
          toggleGroup(setOrganisationOpen, organisationOpen)
        }
      />

      {!collapsed &&
        organisationOpen &&
        renderOrganisationChildren(mobile)}

      <NavLink
        href="/admin/hotels"
        icon={Hotel}
        collapsed={collapsed}
        mobile={mobile}
      >
        Hotels & Stays
      </NavLink>

      <NavLink
        href="/admin/safari"
        icon={Trees}
        collapsed={collapsed}
        mobile={mobile}
      >
        Safari
      </NavLink>

      <NavLink
        href="/admin/events"
        icon={CalendarDays}
        collapsed={collapsed}
        mobile={mobile}
      >
        Events
      </NavLink>

      <NavLink
        href="/admin/weddings"
        icon={CalendarDays}
        collapsed={collapsed}
        mobile={mobile}
      >
        Weddings
      </NavLink>

      <NavLink
        href="/admin/analytics"
        icon={BarChart3}
        collapsed={collapsed}
        mobile={mobile}
      >
        Analytics
      </NavLink>
    </nav>
  );

  return (
    <>
      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <button
            type="button"
            aria-label="Close navigation backdrop"
            onClick={closeMobileSidebar}
            className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
          />

          <aside className="absolute left-0 top-0 flex h-full w-64 max-w-[85%] flex-col border-r border-white/20 bg-[#142019] p-4 text-white shadow-2xl">
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
                onClick={closeMobileSidebar}
                aria-label="Close navigation"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white"
              >
                <X size={16} />
              </button>
            </div>

            {renderNavigation({ mobile: true })}
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className={[
          "sticky top-14 hidden h-[calc(100vh-56px)] shrink-0",
          "border-r border-white/10 bg-[#18352A]",
          "backdrop-blur-2xl transition-[width] duration-300 md:block",
          sidebarCollapsed ? "w-16" : "w-52",
        ].join(" ")}
      >
        <div className="relative flex h-full flex-col p-2.5">
          <div
            className={[
              "mb-4 flex items-center",
              sidebarCollapsed
                ? "justify-center"
                : "justify-between px-1",
            ].join(" ")}
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
              aria-label={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              title={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-[#F7F4EC] shadow-sm transition-colors hover:bg-[#B96928] hover:text-white"
            >
              {sidebarCollapsed ? (
                <PanelLeft size={15} />
              ) : (
                <PanelLeftClose size={15} />
              )}
            </button>
          </div>

          {renderNavigation({ collapsed: sidebarCollapsed })}
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
