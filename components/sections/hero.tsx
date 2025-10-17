"use client";
import { WavyBackground } from "@/components/ui/wavy-background";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { highlights, profile } from "@/lib/data";
import { Sparkles } from "../ui/sparkles";
import { Button } from "../ui/button";
import { use } from "react";

export default function Hero() {
  return (
    <section id="home" className="bg-background">
              <div className="absolute inset-0">
                <Sparkles density={150} />
              </div>
      <WavyBackground className="bg-grid pt-28 pb-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="mt-2 text-4xl font-bold md:text-3xl">Hi, I’m</h1>
          {/* <h1 className="mt-2 text-4xl font-bold md:text-6xl">{profile.name}</h1> */}
          {/* <p className="text-sm uppercase tracking-widest text-foreground/60">{profile.role}</p> */}
          <TextGenerateEffect
            text={profile.name}
            className="mt-2 text-4xl font-bold md:text-6xl"
          />
          <TextGenerateEffect
            text={profile.role}
            className="text-sm uppercase tracking-widest text-foreground/60"
          />
          <TextGenerateEffect
            text={profile.headline}
            className="mx-auto mt-4 max-w-2xl text-foreground/80"
          />

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3">
            {highlights.map((h) => (
              <div
                key={h.stat}
                className="rounded-2xl border border-border bg-card/80 p-4"
              >
                <div className="text-2xl font-bold">{h.stat}</div>
                <div className="text-xs text-foreground/60">{h.label}</div>
              </div>
            ))}
          </div>
          <div>
            {/* Download Resume */}
            <Button
              className="mt-10"
              variant="outline"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/forms/MOHD_FAIZAN_7498478741.pdf"; // static path
                link.download = "MOHD_FAIZAN_7498478741.pdf";
                link.click();
              }}
            >
              Download My Resume
            </Button>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}
