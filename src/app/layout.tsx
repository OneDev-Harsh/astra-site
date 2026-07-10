import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "astra",
  description:
    "Astra brings agentic coding capabilities to your terminal. Five interaction modes, 38+ tools, staging-first mutations, and multi-agent orchestration — all in your CLI.",
  keywords: [
    "ai",
    "cli",
    "agent",
    "openrouter",
    "coding-assistant",
    "terminal",
    "typescript",
    "bun",
  ],

  openGraph: {
    title: "Astra — AI-Native Development Companion",
    description:
      "Agent, Ask, Plan, Auto, and Multi-Agent modes in your terminal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
