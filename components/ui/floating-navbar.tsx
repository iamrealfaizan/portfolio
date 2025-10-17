"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/theme-toggle";

export function FloatingNav({
  navItems,
}: {
  navItems: { name: string; link: string; icon?: React.ReactNode }[];
}) {
  return (
    <nav
      className={cn(
        "fixed left-1/2 top-6 z-50 -translate-x-1/2",
        "rounded-2xl border border-border bg-card/80 backdrop-blur",
        "px-4 py-2 shadow-lg"
      )}
    >
      <div className="flex items-center gap-3">
        <ul className="flex items-center gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.link}
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-foreground transition hover:bg-muted hover:text-foreground"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-1 h-5 w-px bg-border" />
        <ThemeToggle />
      </div>
    </nav>
  );
}
