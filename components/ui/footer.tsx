import Link from "next/link";
import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/40 py-3">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-foreground/80">
          <Link href={profile.github} target="_blank" className="hover:underline">
            GitHub
          </Link>
          <Link href={profile.linkedin} target="_blank" className="hover:underline">
            LinkedIn
          </Link>
          {/* Use a plain anchor for mailto to avoid passing handlers */}
          <a href={`mailto:${profile.email}`} className="hover:underline">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
