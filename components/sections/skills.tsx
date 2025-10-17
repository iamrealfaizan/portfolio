import { skills } from "@/lib/data";
import { Sparkles } from "../ui/sparkles";
import { WavyBackground } from "../ui/wavy-background";

export default function Skills() {
  return (
    <section id="skills" className="bg-background my-20">
      {/* <WavyBackground className="bg-grid py-28"> */}
      {/* <div className="absolute inset-0">
        <Sparkles density={150} />
      </div> */}
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl">Skills</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([group, items]) => (
            <div
              key={group}
              className="rounded-2xl border border-border bg-card/80 p-6"
            >
              <h3 className="text-lg font-semibold capitalize">{group}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border bg-white/10 px-3 py-1 text-xs text-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* </WavyBackground> */}
    </section>
  );
}
