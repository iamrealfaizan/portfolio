"use client";
import { useEffect, useRef } from "react";


export function Sparkles({ density = 80 }: { density?: number }) {
const canvasRef = useRef<HTMLCanvasElement | null>(null);
useEffect(() => {
const canvas = canvasRef.current!;
const ctx = canvas.getContext("2d")!;
let raf = 0;
const DPR = window.devicePixelRatio || 1;
function resize() {
canvas.width = canvas.clientWidth * DPR;
canvas.height = canvas.clientHeight * DPR;
}
resize();
const stars = Array.from({ length: density }, () => ({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
r: Math.random() * 1.2 + 0.3,
a: Math.random(),
v: Math.random() * 0.02 + 0.005,
}));
const draw = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);
for (const s of stars) {
s.a += s.v;
const alpha = (Math.sin(s.a) + 1) / 2;
ctx.beginPath();
ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
ctx.fillStyle = `rgba(255,255,255,${alpha})`;
ctx.fill();
}
raf = requestAnimationFrame(draw);
};
window.addEventListener("resize", resize);
draw();
return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
}, [density]);
return <canvas ref={canvasRef} className="h-full w-full" />;
}