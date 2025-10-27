"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// custom effects/components you already have
import { Sparkles } from "@/components/ui/sparkles";
import { WavyBackground } from "@/components/ui/wavy-background";
import StepsShowcase from "@/components/StepsShowcase"; // keep as-is for "How it Works"

// icons
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Zap,
  Brain,
  Shield,
} from "lucide-react";

export default function OCRLandingPage() {
  // OPTIONAL: if you render a parent floating navbar in your layout, this hook
  // is useful in case you want to hide it from here.
  // In layout: {pathname !== "/ocr" && <FloatingNav />}
  usePathname();

  const heroGridStyle = useMemo(
    () => ({
      backgroundImage:
        "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px)," +
        "linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }),
    []
  );

  const floatAnim = {
    initial: { y: 0 },
    animate: { y: [0, -15, 0] },
    transition: { duration: 6, ease: "easeInOut", repeat: Infinity },
  } as const;

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, delay },
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* subtle animated sparkles */}
      <div className="pointer-events-none absolute inset-0">
        <Sparkles density={160} />
      </div>

      {/* ===== Header (page-local only) ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="#" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-indigo-600 to-teal-500 grid place-items-center text-xs font-bold">
                AI
              </div>
              <span className="text-lg font-semibold tracking-tight">Document Digitizer</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
              <a href="#problem" className="hover:text-teal-400 transition-colors">Problem</a>
              <a href="#demo" className="hover:text-teal-400 transition-colors">Difference</a>
              <a href="#how" className="hover:text-teal-400 transition-colors">How it Works</a>
              {/* <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a> */}
            </nav>

            <Link href="#live-demo" className="hidden md:inline-flex">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
                <Play className="mr-2 h-4 w-4" /> Try Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

{/* ===== HERO (Redesigned) ===== */}
<section
  className="relative flex min-h-screen items-center justify-center px-6 pt-24 text-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white"
  style={heroGridStyle}
>
  {/* ambient sparkles */}
  <div className="pointer-events-none absolute inset-0">
    <Sparkles density={180} />
  </div>

  {/* overlay gradients */}
  <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/10 via-slate-900/60 to-transparent" />

  <div className="relative z-10 mx-auto max-w-6xl">
    {/* Title with scanning shimmer */}
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="text-5xl font-extrabold tracking-tight md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500"
    >
      Turn Paper Documents into{" "}
      <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-400 to-indigo-400">
        Structured Digital Data
        {/* scanning beam animation */}
        <motion.span
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ mixBlendMode: "overlay" }}
        />
      </span>
    </motion.h1>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.8 }}
      className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl"
    >
      Upload, extract, and review — all automated. Experience real-time document
      digitization powered by advanced AI.
    </motion.p>

    {/* CTA Buttons */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.8 }}
      className="mt-10 flex flex-wrap justify-center gap-4"
    >
      <Link href="/demo/ocr">
        <Button className="bg-indigo-600 hover:bg-indigo-700 transition-transform hover:scale-[1.02] shadow-lg shadow-indigo-500/30">
          <Play className="mr-2 h-5 w-5" /> Try Live Demo
        </Button>
      </Link>
      {/* <Link href="/demo?hindi=true">
        <Button
          variant="outline"
          className="border-slate-700 bg-slate-900/60 hover:bg-slate-800"
        >
          <Play className="mr-2 h-5 w-5" /> Try Hindi Demo
        </Button>
      </Link> */}
    </motion.div>

    <p className="mt-4 text-sm text-slate-400">
      No signup · No credit card · Just pure AI.
    </p>

    {/* Floating mockup preview */}
    {/* <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      whileHover={{ scale: 1.02, rotate: -0.3 }}
      className="relative mx-auto mt-20 w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-lg overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl ring-1 ring-indigo-500/20" />

      <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        className="h-[20rem] w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-1"
      >
        <div className="h-full w-full rounded-xl bg-black/50 flex items-center justify-center text-slate-400 text-sm">
          <div className="text-center">
            <p className="font-semibold text-slate-300">
              Upload → Extract → Review → Export
            </p>
            <p className="text-slate-400 mt-2">
              Watch AI in action below ↓
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div> */}
  </div>

  {/* Bottom fade transition */}
  <motion.div
    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1 }}
  />
</section>


      {/* ===== PROBLEM / SOLUTION ===== */}
      <section id="problem" className="bg-black/60 py-24 backdrop-blur md:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <motion.h2 {...fadeUp()} className="mb-4 text-4xl font-bold md:text-5xl">
            Tired of Manually Typing Data from Paper Documents?
          </motion.h2>
          <motion.p
            {...fadeUp(0.1)}
            className="mx-auto mb-12 max-w-3xl text-lg text-gray-300"
          >
            Manual data entry is slow and error‑prone. Our AI automates the conversion, saving time and money while improving quality.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "Blazing Fast Speed", desc: "Convert hundreds of documents in minutes." },
              { icon: Brain, title: "Unmatched Accuracy", desc: "Understands handwriting, tables, and checkboxes." },
              { icon: Shield, title: "Human‑in‑the‑Loop", desc: "Optional review for mission‑critical workflows." },
            ].map((f, i) => (
              <motion.div key={f.title} {...fadeUp(0.15 + i * 0.1)}>
                <Card className="border border-slate-800 bg-slate-900/70 transition-all hover:-translate-y-1 hover:border-teal-500">
                  <CardContent className="flex flex-col items-center space-y-3 p-8 text-center">
                    <f.icon className="h-12 w-12 text-teal-400" />
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                    <p className="text-gray-400">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* ===== DEMO COMPARISON (Redesigned) ===== */}
<section
  id="demo"
  className="relative bg-gradient-to-b from-slate-950 via-black to-slate-950 py-24 md:py-32 overflow-hidden"
>
  <div className="absolute inset-0 opacity-30">
    <WavyBackground />
  </div>

  <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-4xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-400"
    >
      Manual Entry vs. AI Digitizer - The Real Difference
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      viewport={{ once: true }}
      className="mx-auto mt-4 max-w-2xl text-lg text-slate-300"
    >
      Experience how automation transforms hours of tedious work into seconds of accurate results.
    </motion.p>

    <div className="mt-16 grid gap-8 md:grid-cols-2">
      {/* Manual Process */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="relative border border-slate-800 bg-slate-900/70 p-6 shadow-md hover:border-rose-500 transition-all">
          <div className="absolute top-0 left-0 px-4 py-1 bg-rose-600/80 text-white text-xs font-semibold rounded-br-xl">
            MANUAL WORKFLOW
          </div>
          <CardContent className="mt-6 space-y-4">
            <div className="flex items-center justify-center">
              <Brain className="h-10 w-10 text-rose-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Tedious & Error-Prone</h3>
            <p className="text-slate-400">
              Hours spent reading handwritten data, typing manually, and verifying mistakes. Each step slows productivity.
            </p>
            <ul className="mt-4 space-y-2 text-left text-slate-300">
              <li>🕐 60+ hours to process 100 Documents</li>
              <li>⚠️ 12–18% average error rate</li>
              <li>💸 Requires 3+ staff for large batches</li>
              <li>📋 Manual reviews & corrections</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Digitizer Process */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 40 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="relative border-2 border-teal-500 bg-slate-900/80 p-6 shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-400/30">
          <div className="absolute top-0 left-0 px-4 py-1 bg-teal-600/80 text-white text-xs font-semibold rounded-br-xl">
            AI-POWERED DIGITIZER
          </div>
          <CardContent className="mt-6 space-y-4">
            <div className="flex items-center justify-center">
              <Zap className="h-10 w-10 text-teal-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Fast, Accurate & Effortless</h3>
            <p className="text-slate-400">
              Our AI extracts text, tables, and handwriting instantly, then converts it into clean, structured data ready to use.
            </p>
            <ul className="mt-4 space-y-2 text-left text-slate-300">
              <li>⚡ 100 Documents processed in under 2 hours</li>
              <li>✅ 95.2% accuracy [with human review option]</li>
              <li>🧠 Understands handwriting, checkboxes & tables</li>
              <li>☁️ Exports to your desired format [Excel, JSON, API]</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    {/* Center CTA */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-14"
    >
      <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 px-8 py-6 text-lg">
        <Play className="mr-2 h-5 w-5" /> Watch AI Digitizer in Action
      </Button>
    </motion.div>
  </div>
</section>


      {/* ===== HOW IT WORKS (Keep your StepsShowcase exactly) ===== */}
      <section id="how" className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 py-0 md:py-0">
        <WavyBackground className="opacity-40" />
        <div className="relative z-10">
          <StepsShowcase />
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="bg-gradient-to-b from-black to-slate-950 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-14 text-4xl font-bold md:text-5xl">Loved by Innovators</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "Sarah L.", role: "Operations Manager", quote: "We cut processing time by 90%. It feels like magic." },
              { name: "David Chen", role: "Research Analyst", quote: "Flawless accuracy on even the most complex handwriting." },
              { name: "Priya Sharma", role: "NGO Coordinator", quote: "Multilingual support made our surveys effortless." },
            ].map((t, i) => (
              <motion.div key={t.name} {...fadeUp(0.05 + i * 0.1)}>
                <Card className="border-slate-800 bg-slate-900/60 transition-all hover:border-teal-500">
                  <CardContent className="space-y-4 p-8">
                    <p className="text-gray-200 italic">“{t.quote}”</p>
                    <Separator className="my-2" />
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="bg-slate-900 py-24 text-center md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-bold md:text-5xl">Simple, Transparent Pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Choose a plan that fits your needs. Start for free, upgrade as you grow.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
            {/* Free */}
            <Card className="border border-slate-700 text-left">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-teal-400">Free</h3>
                <p className="mt-1 text-4xl font-bold">
                  $0 <span className="text-lg font-normal text-slate-400">/ month</span>
                </p>
                <p className="mt-4 text-slate-300">Perfect for individuals and small projects.</p>
                <ul className="mt-6 space-y-3 text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> 50 Pages/Month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Basic AI Model</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Community Support</li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative border-2 border-indigo-600 text-left">
              <div className="absolute right-0 top-0 translate-x-1/3 translate-y-1/2 rotate-45 bg-indigo-600 px-4 py-1 text-sm font-semibold">Popular</div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-indigo-400">Pro</h3>
                <p className="mt-1 text-4xl font-bold">
                  $?? <span className="text-lg font-normal text-slate-400">/ month</span>
                </p>
                <p className="mt-4 text-slate-300">For professionals and growing businesses.</p>
                <ul className="mt-6 space-y-3 text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> 1000 Pages/Month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Advanced AI Model</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> API Access & Integrations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Priority Email Support</li>
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="border border-slate-700 text-left">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-slate-300">Enterprise</h3>
                <p className="mt-1 text-4xl font-bold">Custom</p>
                <p className="mt-4 text-slate-300">Tailored solutions for large organizations.</p>
                <ul className="mt-6 space-y-3 text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Unlimited Pages</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Human‑in‑the‑Loop</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Dedicated Support</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> On‑Premise Deployment</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <Button variant="outline" className="border-slate-700 bg-slate-900 hover:bg-slate-800">
              View Full Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* ===== CTA / LIVE DEMO ===== */}
      <section id="live-demo" className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 opacity-60">
          <WavyBackground />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Ready to Ditch Manual Data Entry?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Try our interactive demo with your own documents or use our samples. See the magic for yourself.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/demo/ocr">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-transform hover:scale-[1.02]">
                Try Live Demo
              </Button>
            </Link>
            {/* <Link href="/demo?hindi=true">
              <Button variant="outline" className="border-slate-700 bg-slate-900 hover:bg-slate-800">
                Try Hindi Demo Now
              </Button>
            </Link> */}
          </div>
        </div>
      </section>

      {/* ===== FOOTER (page-local) ===== */}
      <footer className="border-t border-slate-800 bg-black/30">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="#" className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-tr from-indigo-600 to-teal-500 text-xs font-bold">
                  AI
                </div>
                <span className="text-lg font-semibold">Document Digitizer</span>
              </Link>
              <p className="mt-3 text-sm text-slate-400">Instant document digitization powered by AI.</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#problem" className="text-slate-400 transition-colors hover:text-teal-400">Problem & Solution</a></li>
                <li><a href="#demo" className="text-slate-400 transition-colors hover:text-teal-400">Difference</a></li>
                <li><a href="#how" className="text-slate-400 transition-colors hover:text-teal-400">How It Works</a></li>
                <li><a href="#pricing" className="text-slate-400 transition-colors hover:text-teal-400">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200">Resources</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 transition-colors hover:text-teal-400">Blog</a></li>
                <li><a href="#" className="text-slate-400 transition-colors hover:text-teal-400">Documentation</a></li>
                <li><a href="#" className="text-slate-400 transition-colors hover:text-teal-400">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 transition-colors hover:text-teal-400">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 transition-colors hover:text-teal-400">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Document Digitizer. All rights reserved.</p>
            <div className="flex items-center gap-4"> */}
              {/* simple socials placeholders */}
              {/* <a href="#" className="hover:text-white" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z" /></svg>
              </a>
              <a href="#" className="hover:text-white" aria-label="Twitter X">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8.29 20.25c7.55 0 11.68-6.25 11.68-11.68 0-.18 0-.36-.01-.53A8.35 8.35 0 0022 5.92a8.2 8.2 0 01-2.36.65 4.12 4.12 0 001.8-2.27 8.22 8.22 0 01-2.61.99 4.11 4.11 0 00-6.99 3.74 11.65 11.65 0 01-8.46-4.29 4.11 4.11 0 001.27 5.48 4.07 4.07 0 01-1.86-.51v.05a4.11 4.11 0 003.29 4.02 4.1 4.1 0 01-1.85.07 4.11 4.11 0 003.83 2.85A8.23 8.23 0 012 18.41a11.62 11.62 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="hover:text-white" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2a10 10 0 00-10 10.01c0 4.61 3.06 8.52 7.14 9.71V15.82H6.99v-3.65h2.15v-2.65c0-2.12 1.26-3.3 3.21-3.3.92 0 1.87.16 1.87.16v2.96h-1.52c-1.05 0-1.39.62-1.39 1.32v1.51h3.29L14.9 15.82H13.3v5.91C17.94 21.53 21 17.62 21 12.01A10 10 0 0012 2z" /></svg>
              </a>
            </div>
          </div> */}
        </div>
      </footer>
    </main>
  );
}
