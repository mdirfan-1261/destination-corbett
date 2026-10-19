"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Building2, UserRound } from "lucide-react";

export default function OwnerHeader({ title, description, onMenuClick }) {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("destin_owner_user");
      if (saved) {
        setOwner(JSON.parse(saved));
      }
    } catch {}
  }, []);

  return (
    <header className="sticky top-0 z-30 flex min-h-[70px] items-center justify-between border-b border-[#E3DDD2] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DED9CF] text-[#172033] hover:bg-[#F7F5F0] lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-[17px] font-bold tracking-tight text-[#172033] sm:text-[19px]">
            {title}
          </h1>
          <p className="hidden text-[12px] text-[#737987] sm:block">
            {description}
          </p>
        </div>
      </div>

      {/* Right User Badge */}
      <div className="flex items-center gap-3">
        <Link
          href="/owner/profile"
          className="flex items-center gap-2 rounded-full border border-[#DED9CF] bg-[#F7F5F0] p-1.5 pr-3 text-xs font-semibold text-[#172033] hover:border-[#B96928]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#172033] text-white">
            <UserRound size={14} />
          </span>
          <span className="max-w-[120px] truncate sm:max-w-none">
            {owner?.name || owner?.resortName || "Resort Owner"}
          </span>
        </Link>
      </div>
    </header>
  );
}