"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group flex w-full items-center justify-center md:justify-start gap-3 rounded-xl px-3 py-3 font-semibold text-slate-200/80 hover:bg-white/10 hover:text-white transition-all"
      aria-label="Toggle theme"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </span>
      <span className="hidden md:inline text-sm">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
