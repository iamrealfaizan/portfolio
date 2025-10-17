import Link from "next/link";
import { profile } from "@/lib/data";


export default function About() {
return (
<section id="about" className="bg-background my-10">
<div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
<div>
<h2 className="text-3xl font-bold md:text-4xl">About Me</h2>
<p className="mt-4 text-foreground/80">
I help businesses and teams turn ideas into scalable AI and web solutions that save time, cut costs, and create measurable impact. With a strong foundation in AI engineering, full-stack development, and automation, I specialize in building systems that are not just functional but transformative.
</p>
<div className="mt-6 flex flex-wrap gap-4 text-sm text-foreground/80">
<Link href={profile.github} target="_blank" className="rounded-xl border border-border bg-card/80 px-3 py-1.5 hover:bg-white/10">GitHub</Link>
<Link href={profile.linkedin} target="_blank" className="rounded-xl border border-border bg-card/80 px-3 py-1.5 hover:bg-white/10">LinkedIn</Link>
<a href={`mailto:${profile.email}`} className="rounded-xl border border-border bg-card/80 px-3 py-1.5 hover:bg-white/10">Email</a>
</div>
</div>
<div className="rounded-2xl border border-border bg-card/80 p-6">
<ul className="space-y-3 text-sm text-foreground/80">
<li>📍 {profile.location}</li>
<li>📞 {profile.phone}</li>
<li>📧 {profile.email}</li>
</ul>
</div>
</div>
</section>
);
}