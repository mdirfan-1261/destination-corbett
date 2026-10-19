
"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, UserRound } from "lucide-react";
import Link from "next/link";

export default function AgentHeader({
  title = "Overview",
  description = "Manage your property business.",
  onMenuClick,
}) {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("agentUser");

      if (savedUser) {
        setAgent(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Unable to load agent header details:", error);
    }
  }, []);

  const displayName = agent?.name || "Property Partner";
  const initial = displayName.trim().charAt(0).toUpperCase() || "P";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[#172033] sm:text-xl">
              {title}
            </h1>
            <p className="mt-1 hidden truncate text-xs text-slate-500 sm:block sm:text-sm">
              {description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="max-w-[180px] truncate text-sm font-semibold text-[#172033]">
              {displayName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {agent?.accountStatus === "approved"
                ? "Approved Partner"
                : agent?.accountStatus === "rejected"
                  ? "Registration Rejected"
                  : agent?.accountStatus === "suspended"
                    ? "Account Suspended"
                    : "Approval Pending"}
            </p>
          </div>

          <Link
            href="/agent/profile"
            aria-label="View agent profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-[#F7F5F0] text-[#172033] transition hover:border-[#B96928]"
          >
            <span className="text-sm font-bold">{initial}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
