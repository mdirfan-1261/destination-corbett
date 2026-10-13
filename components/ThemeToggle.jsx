"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className="h-9 w-9 shrink-0" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                 bg-white/60 dark:bg-white/10 backdrop-blur-xl
                 border border-white/80 dark:border-white/15
                 text-[#172033] dark:text-yellow-300
                 shadow-sm hover:text-[#C87532] transition-all"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}