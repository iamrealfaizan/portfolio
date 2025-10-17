import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Footer from "@/components/ui/footer";
import LayoutClient from "@/components/layout-client"; // 👈 new wrapper
import { Analytics } from "@vercel/analytics/next"

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Mohammed Faizan - AI Engineer & Full-Stack Developer",
  description:
    "Portfolio: LLM, RAG, CV/OCR, scalable web apps with Next.js, Node, MongoDB, Tailwind!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans", fontSans.variable)}>
        <ThemeProvider>
          {/* 👇 move all conditional UI to client wrapper */}
          <LayoutClient>{children}</LayoutClient>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
