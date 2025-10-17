import ParallaxScroll from "@/components/ui/parallax-scroll";
import { projects } from "@/lib/data";
import { WavyBackground } from "../ui/wavy-background";

export default function Projects() {
  return (
    <section id="projects" className="bg-background py-20">
      {/* <WavyBackground className="bg-grid py-28"> */}
        <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl pb-10">Projects</h2>
        {/* <p className="mt-2 text-foreground/70 pb-5">
          A few things I’ve built and shipped.
        </p> */}
        <div className="mt-8">
          <ParallaxScroll projects={projects} />
        </div>
      </div>
    {/* </WavyBackground> */}
    </section>
  );
}
