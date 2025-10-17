export const profile = {
  name: "Mohammed Faizan",
  role: "AI Engineer · Full-Stack Developer",
  headline: "I build AI systems that save hours and web apps that scale.",
  location: "Aurangabad, Maharashtra, India",
  email: "mohdfaizanashfaq@gmail.com",
  phone: "+91 7498478741",
  github: "https://github.com/iamrealfaizan",
  linkedin: "https://linkedin.com/in/mohdfaizanashfaq",
};

export const highlights = [
  { stat: "95%", label: "Faster invoice processing via automation" },
  { stat: "70%", label: "Team productivity improvement" },
  { stat: "1000+", label: "Records digitized with OCR pipeline" },
];

export const experience = [
  {
    company: "Adaptive AI Ventures",
    role: "AI Engineer",
    period: "Dec 2023 – Present",
    points: [
      "Digitized 1000+ paper records with CV/OCR improving accessibility by 80%.",
      "Reduced invoice processing time by 95% and boosted team productivity by 70% via automation.",
      "Fine-tuned LLMs (OpenAI, Llama2, Mistral) for up to 30% accuracy lift.",
      "Built scalable platforms with Next.js, Node, MongoDB, TailwindCSS.",
    ],
  },
  {
    company: "AboveTheWings",
    role: "Web Developer (Intern)",
    period: "Jun 2023 – Nov 2023",
    points: [
      "Integrated Amadeus API for real-time flight booking (−40% search latency).",
      "Built Express APIs handling 100+ daily queries with 99.9% uptime.",
      "Led Agile workflows in JIRA ensuring on-time delivery.",
    ],
  },
];

export const skills = {
  ai: ["LLM Fine-Tuning", "RAG", "NLP", "Computer Vision", "OCR"],
  web: ["Next.js", "React", "Node.js", "Tailwind", "ShadcnUI", "Express"],
  data: ["MongoDB", "SQL"],
  prog: ["Python", "TypeScript/JavaScript", "Java"],
  tools: ["Docker", "Kubernetes", "GCP", "Git", "JIRA"],
} as const;

export const certifications = [
  {
    name: "Automation Business Analysis - Concepts and Principles",
    issuer: "UiPath",
    date: "Jan 2025",
  },
  {
    name: "Prompt Engineering for Developers",
    issuer: "DeepLearning.AI",
    date: "May 2024",
  },
];

export const projects = [
  {
    title: "Online File Encryption/Decryption Tool",
    description:
      "Browser-only AES-CBC with drag-and-drop UI; no data leaves the device.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    tags: ["Crypto", "Web"],
  },
  {
    title: "Text-to-Speech Converter",
    description:
      "Multilingual TTS via Web Speech API for accessibility and learning.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    tags: ["TTS", "Accessibility"],
  },
];
