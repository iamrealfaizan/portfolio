import { certifications } from "@/lib/data";
import { WavyBackground } from "../ui/wavy-background";

export default function Certifications() {
  return (
    <section id="certifications" className="bg-background my-20">
      <WavyBackground className="bg-grid py-28">
        <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl">Certifications</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {certifications.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-border bg-card/80 p-6"
            >
              <h3 className="text-lg font-semibold">{c.name}</h3>
              <p className="text-sm text-foreground/70">
                {c.issuer} · {c.date}
              </p>
            </div>
          ))}
        </div>
      </div>
        </WavyBackground>
    </section>
  );
}
