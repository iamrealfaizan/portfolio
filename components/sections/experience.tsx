import { experience } from "@/lib/data";
import { WavyBackground } from "../ui/wavy-background";

export default function Experience() {
  return (
    <section id="experience" className="bg-background my-20">
      <WavyBackground className="bg-grid py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl">Experience</h2>
        <div className="mt-8 grid gap-6">
          {experience.map((job) => (
            <div
              key={job.company}
              className="rounded-2xl border border-border bg-card/80 p-6"
            >
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <h3 className="text-xl font-semibold">
                  {job.role} · {job.company}
                </h3>
                <p className="text-sm text-foreground/60">{job.period}</p>
              </div>
              <ul className="mt-4 grid list-disc gap-2 pl-5 text-foreground/80">
                {job.points.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      </WavyBackground>
    </section>
  );
}
