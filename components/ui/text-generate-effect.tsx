"use client";
import { useEffect, useState } from "react";


export function TextGenerateEffect({ text, speed = 18, className }: { text: string; speed?: number; className?: string }) {
const [display, setDisplay] = useState("");
useEffect(() => {
let i = 0;
const id = setInterval(() => {
setDisplay(text.slice(0, i + 1));
i++;
if (i >= text.length) clearInterval(id);
}, speed);
return () => clearInterval(id);
}, [text, speed]);
return <p className={className}>{display}</p>;
}