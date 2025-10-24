"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Loader2, UploadCloud, Wand2, Save } from "lucide-react";

/**
 * HowItWorksDemo
 * ------------------------------------------------------
 * A faithful, state-driven animation of your actual flow:
 * 0 Upload -> 1 Extracting -> 2 Auto-fill -> 3 Submit (success)
 *
 * - No external deps beyond framer-motion + your shadcn/ui
 * - Auto-plays on mount; includes controls to replay/pause
 * - Uses your slate/teal/indigo theme and glass cards
 */

export default function HowItWorksDemo() {
  const [phase, setPhase] = React.useState<0 | 1 | 2 | 3>(0);
  const [playing, setPlaying] = React.useState(true);

  // timings tuned to your video/screenshots
  const PHASE_DURATIONS = [2000, 2600, 2600, 2000]; // ms per phase

  React.useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setPhase((p) => ((p + 1) % 4) as 0 | 1 | 2 | 3);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, playing]);

  const restart = () => {
    setPhase(0);
    setPlaying(true);
  };

  return (
    <section
      id="how-it-works-demo"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
              How It Works
            </h2>
            <p className="mt-2 text-slate-300">
              A live, animated walkthrough of the actual Document Digitizer flow.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setPlaying((v) => !v)}>
              {playing ? "Pause" : "Play"}
            </Button>
            <Button onClick={restart}>Replay</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT: Document side with upload + scanning */}
          <div className="lg:col-span-6">
            <Card className="rounded-2xl border-slate-800/70 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <UploadButton phase={phase} />
                  <ExtractButton phase={phase} />
                </div>

                <div className="rounded-xl border border-slate-800/70 bg-black/30 p-4">
                  <h3 className="text-slate-200 font-semibold mb-3">Original</h3>

                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-slate-800/60 bg-gradient-to-b from-white to-white">
                    {/* Paper edges */}
                    <div className="absolute inset-0 m-3 rounded-lg border border-slate-200/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]" />

                    {/* PDF header line + bullets (simple skeleton) */}
                    <div className="absolute left-0 right-0 top-10 mx-8 h-3 rounded bg-blue-600/80" />
                    <div className="absolute left-0 right-0 top-20 mx-8 space-y-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 rounded bg-slate-300/80"
                          style={{ width: `${70 - i * 5}%` }}
                        />
                      ))}
                    </div>

                    {/* Scanning beam during phase 1 */}
                    <AnimatePresence>
                      {phase === 1 && (
                        <motion.div
                          initial={{ y: "-120%" }}
                          animate={{ y: "120%" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2.2, ease: "linear" }}
                          className="pointer-events-none absolute left-0 right-0 h-28 bg-gradient-to-b from-transparent via-indigo-500/25 to-transparent"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    Drop a PDF or use the picker. The right fields map 1:1 with the uploaded form.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Structured fields side with animated fill */}
          <div className="lg:col-span-6">
            <Card className="rounded-2xl border-slate-800/70 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-200">Student Information</h3>
                  <Badge
                    className={cn(
                      "rounded-full transition-colors",
                      phase === 1 ? "bg-indigo-600" : "bg-slate-800 text-slate-300"
                    )}
                  >
                    {phase === 1 ? "Extracting" : "Idle"}
                  </Badge>
                </div>

                <FieldList phase={phase} />

                <div className="mt-6 flex items-center gap-3">
                  <SubmitButton phase={phase} />
                  <Button variant="outline">Reset</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Upload button + filename reveal */
function UploadButton({ phase }: { phase: number }) {
  return (
    <motion.div
      className="relative inline-flex items-center"
      initial={false}
      animate={{ scale: phase === 0 ? [1, 1.03, 1] : 1 }}
      transition={{ duration: 1.2, repeat: phase === 0 ? Infinity : 0 }}
    >
      <Button
        variant="outline"
        className="border-slate-700 bg-slate-900/70 hover:bg-slate-800"
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        Choose File
      </Button>

      {/* filename appears in phase >= 0 and sticks */}
      <AnimatePresence>
        {phase >= 0 && (
          <motion.span
            key="filename"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 12 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.35 }}
            className="ml-2 rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300"
          >
            Document Sample.pdf
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Extract button that turns into extracting state during phase 1 */
function ExtractButton({ phase }: { phase: number }) {
  const extracting = phase === 1;
  return (
    <Button
      disabled={extracting}
      className={cn(
        "ml-auto bg-indigo-600 hover:bg-indigo-700",
        extracting && "bg-indigo-500/60 hover:bg-indigo-500/60 cursor-default"
      )}
    >
      {extracting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Extracting…
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Extract
        </>
      )}
    </Button>
  );
}

/* Right side fields that fill in during phase 2 with staggered typing */
function FieldList({ phase }: { phase: number }) {
  const items: { label: string; value: string }[] = [
    { label: "Student's Name", value: "Cristiano Ronaldo" },
    { label: "Date of Birth (MM/DD/YYYY)", value: "01/11/2010" },
    { label: "Gender", value: "Male" },
    { label: "Residential Address", value: "A-102, Green Colony" },
    { label: "City", value: "Ahmedabad" },
    { label: "State", value: "Gujarat" },
    { label: "Zip", value: "380015" },
  ];

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <FieldRow
          key={it.label}
          label={it.label}
          target={it.value}
          active={phase >= 2}
          delay={i * 0.25}
        />
      ))}
    </div>
  );
}

function FieldRow({
  label,
  target,
  active,
  delay = 0,
}: {
  label: string;
  target: string;
  active: boolean;
  delay?: number;
}) {
  const [text, setText] = React.useState("");

  // simple in-component "typewriter" when active toggles on
  React.useEffect(() => {
    if (!active) {
      setText("");
      return;
    }
    let i = 0;
    const start = setTimeout(() => {
      const t = setInterval(() => {
        i++;
        setText(target.slice(0, i));
        if (i >= target.length) clearInterval(t);
      }, 22);
    }, delay * 1000);
    return () => clearTimeout(start);
  }, [active, target, delay]);

  return (
    <div className="rounded-lg border border-slate-800/70 bg-slate-900/60 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <motion.div
        className="mt-1 h-6 overflow-hidden text-sm text-slate-100"
        initial={false}
        animate={{
          boxShadow: active && text.length
            ? "0 0 0 1px rgba(45,212,191,.25), 0 0 18px rgba(45,212,191,.15)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4 }}
      >
        {text || <span className="text-slate-500">—</span>}
      </motion.div>
    </div>
  );
}

/* Submit button animates in phase 3 */
function SubmitButton({ phase }: { phase: number }) {
  const ready = phase === 2 || phase === 3;
  const done = phase === 3;

  return (
    <motion.div
      initial={false}
      animate={{
        scale: ready ? [1, 1.03, 1] : 1,
        boxShadow: ready
          ? "0 0 0 1px rgba(99,102,241,.25), 0 20px 60px -30px rgba(99,102,241,.45)"
          : "0 0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 1.2, repeat: ready && !done ? Infinity : 0 }}
    >
      <Button
        className={cn(
          "bg-teal-600 hover:bg-teal-700",
          done && "bg-emerald-600 hover:bg-emerald-600"
        )}
      >
        {done ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Saved
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save / Submit
          </>
        )}
      </Button>
    </motion.div>
  );
}
