"use client";

import { usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-navbar";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { SunMoon, Home, User, Briefcase, GalleryHorizontal, Phone } from "lucide-react";

const navItems = [
  { name: "Home", link: "#home", icon: <Home className="h-4 w-4" /> },
  { name: "About", link: "#about", icon: <User className="h-4 w-4" /> },
  { name: "Experience", link: "#experience", icon: <Briefcase className="h-4 w-4" /> },
  { name: "Projects", link: "#projects", icon: <GalleryHorizontal className="h-4 w-4" /> },
  { name: "Contact", link: "#contact", icon: <Phone className="h-4 w-4" /> },
];

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/ocr") || pathname.startsWith("/demo");

  return (
    <>
      {!hideNav ? (
        <FloatingNav navItems={navItems} />
      ) : (
        <div className="absolute right-6 top-6 z-50">
          {/* Replace with your real theme toggle */}
          <ThemeToggle />
        </div>
      )}
      {children}
    </>
  );
}
