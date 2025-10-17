import Link from "next/link";
import { Sparkles } from "@/components/ui/sparkles";
import { profile } from "@/lib/data";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative h-[26rem] w-full overflow-hidden bg-background"
    >
      <div className="absolute inset-0">
        <Sparkles density={150} />
      </div>
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h2 className="text-3xl font-bold md:text-5xl">
          Interested in working together?
        </h2>
        <p className="max-w-2xl text-foreground/80">
          Let’s talk about building something valuable with AI and great UX.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`mailto:${profile.email}`}
            className="rounded-xl border border-border bg-white/10 px-6 py-2 text-sm hover:bg-white/20"
          >
            Email Me
          </Link>
          <Link
            href={profile.linkedin}
            target="_blank"
            className="rounded-xl border border-border bg-white/10 px-6 py-2 text-sm hover:bg-white/20"
          >
            Connect on LinkedIn
          </Link>
        </div>
      </div>
    </section>
  );
}
