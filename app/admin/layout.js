"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Trees,
  LogOut,
  Menu,
  Sun,
  Moon,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [darkMode, setDarkMode] = useState(false);

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (
      !token &&
      pathname !== "/admin/login"
    ) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  // =====================================================
  // LOAD THEME
  // =====================================================

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("adminTheme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // =====================================================
  // SAVE THEME
  // =====================================================

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    localStorage.setItem(
      "adminTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode, pathname]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("adminToken");

    setSidebarOpen(false);

    router.push("/admin/login");
  };

  // =====================================================
  // ADMIN LOGIN PAGE
  // =====================================================

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "text-white"
          : "text-[#18352A]"
      }`}
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 -z-20 bg-[#F5F7FA]" />

      <div
        className={`fixed inset-0 -z-10 transition-all duration-300 ${
          darkMode
            ? "bg-[#07100C]/40"
            : "bg-[#F5F7FA]/70"
        }`}
      />

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ${
          darkMode
            ? "border-white/10 bg-[#142019]/85"
            : "border-[#18352A]/20 bg-[#18352A]/95"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">

          {/* LEFT SIDE */}
          <div className="flex min-w-0 items-center gap-3">

            {/* MOBILE MENU */}

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

            {/* LOGO */}

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

          {/* HEADER ACTIONS */}

          <div className="flex shrink-0 items-center gap-2">

            {/* THEME */}

            <button
              type="button"
              onClick={() =>
                setDarkMode((prev) => !prev)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              {darkMode ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <LogOut size={15} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* =====================================================
          ADMIN CONTENT AREA
      ===================================================== */}

      <div className="flex">

        {/* SIDEBAR */}

        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* PAGE CONTENT */}

        <section className="min-w-0 flex-1">
          {children}
        </section>

      </div>

    </main>
  );
}