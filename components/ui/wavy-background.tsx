"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


export function WavyBackground({ children, className }: { children?: React.ReactNode; className?: string }) {
return (
<div className={cn("relative w-full overflow-hidden bg-background", className)}>
<svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
<defs>
<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
<stop offset="0%" stopColor="#ffffff" stopOpacity="0.2"/>
<stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
</linearGradient>
</defs>
{[...Array(8)].map((_, i) => (
<motion.path
key={i}
d={`M0 ${40 + i * 20} Q50 ${20 + i * 20}, 100 ${40 + i * 20}`}
stroke="url(#g)"
strokeWidth="1"
fill="none"
initial={{ pathLength: 0 }}
animate={{ pathLength: 1 }}
transition={{ duration: 2 + i * 0.2, delay: i * 0.1, repeat: Infinity, repeatType: "mirror" }}
vectorEffect="non-scaling-stroke"
/>
))}
</svg>
<div className="relative z-10">{children}</div>
</div>
);
}