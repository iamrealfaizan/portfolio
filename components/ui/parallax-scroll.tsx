"use client";
import Image from "next/image";
import Link from "next/link";
import { useScroll, useTransform, motion } from "framer-motion";


export type ProjectCard = { title: string; description: string; image: string; link: string; tags?: string[] };


export default function ParallaxScroll({ projects }: { projects: ProjectCard[] }) {
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
return (
<div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
{projects.map((p) => (
<motion.article key={p.title} style={{ y }} className="group overflow-hidden rounded-2xl border border-border bg-card/80">
<Link href={p.link} target="_blank">
<div className="relative aspect-[16/10]">
<Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
</div>
<div className="space-y-2 p-4">
<h3 className="text-lg font-semibold">{p.title}</h3>
<p className="text-sm text-foreground/70">{p.description}</p>
{p.tags?.length ? (
<div className="mt-2 flex flex-wrap gap-2">
{p.tags.map((t) => (
<span key={t} className="rounded-full border border-border bg-white/10 px-2 py-0.5 text-xs text-foreground/80">{t}</span>
))}
</div>
) : null}
</div>
</Link>
</motion.article>
))}
</div>
);
}