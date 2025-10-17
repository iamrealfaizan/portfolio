"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = theme === "system" ? systemTheme : theme;
  if (!mounted) {
    // Avoid hydration mismatch
    return (
      <button
        className="rounded-xl border border-border bg-muted/40 px-2.5 py-1.5 text-sm"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme(current === "dark" ? "light" : "dark")}
        className="rounded-xl border border-border bg-muted/40 px-2.5 py-1.5 text-sm hover:bg-muted"
        aria-label="Toggle theme"
        title={`Switch to ${current === "dark" ? "light" : "dark"} mode`}
      >
        {current === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}
