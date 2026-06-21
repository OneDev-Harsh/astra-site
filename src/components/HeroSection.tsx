"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import LedGrid from "./LedGrid";

const terminalLines = [
  { prompt: "$", text: "npm install -g astrabot", delay: 0 },
  { prompt: "", text: "added 1 package in 1.2s", delay: 800, dim: true },
  { prompt: "$", text: "astra setup", delay: 1400 },
  { prompt: "", text: "OpenRouter API key configured.", delay: 2200, dim: true },
  { prompt: "$", text: "astra wakeup", delay: 2800 },
  { prompt: "", text: "", delay: 3600, dim: true },
  { prompt: "", text: "  [ASTRA] session initialized", delay: 3800, accent: true },
  { prompt: "", text: "  [ASTRA] 5 modes loaded", delay: 4200, accent: true },
  { prompt: "", text: "  [ASTRA] 38 tools registered", delay: 4500, accent: true },
  { prompt: "", text: "  [ASTRA] ready.", delay: 4800, accent: true },
  { prompt: "", text: "", delay: 5000, dim: true },
  { prompt: ">", text: "", delay: 5200, cursor: true },
];

const quickSteps = [
  { num: "01", label: "Install", cmd: "npm install -g astrabot" },
  { num: "02", label: "Configure", cmd: "astra setup" },
  { num: "03", label: "Run", cmd: "astra wakeup" },
];

function HeroLogo({ visible }: { visible: boolean }) {
  return (
    <div
      className={`mb-8 transition-all duration-1000 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto animate-float"
      >
        <defs>
          <linearGradient id="heroGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <linearGradient id="heroGradAlt" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <radialGradient id="heroApexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="60%" stopColor="#ddd6fe" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heroShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#6d28d9" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Background circle for polish */}
        <circle cx="16" cy="16" r="15" fill="#0f0a1a" stroke="#2e1f4a" strokeWidth="0.5" />

        {/* Apex star glow */}
        <circle cx="16" cy="5.5" r="2.5" fill="url(#heroApexGlow)" filter="url(#heroGlow)" />
        <circle cx="16" cy="5.5" r="0.9" fill="#f5f3ff" />

        {/* Left stroke of A (thick) */}
        <line x1="16" y1="5.5" x2="6.5" y2="27" stroke="url(#heroGradAlt)" strokeWidth="4" strokeLinecap="round" filter="url(#heroShadow)" />

        {/* Right stroke of A (thick) */}
        <line x1="16" y1="5.5" x2="25.5" y2="27" stroke="url(#heroGrad)" strokeWidth="4" strokeLinecap="round" filter="url(#heroShadow)" />

        {/* Crossbar (thick, matching weight) */}
        <line x1="10.5" y1="18.5" x2="21.5" y2="18.5" stroke="#c4b5fd" strokeWidth="3.2" strokeLinecap="round" />

        {/* Subtle orbital arc */}
        <ellipse cx="16" cy="20" rx="13" ry="4.5" fill="none" stroke="#a78bfa" strokeWidth="0.35" transform="rotate(-12 16 20)" opacity="0.2" />
      </svg>
    </div>
  );
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const startTimer = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(startTimer);
  }, [visible]);

  useEffect(() => {
    if (!started) return;
    if (displayedLines >= terminalLines.length) return;

    const nextLine = terminalLines[displayedLines];
    const elapsed = Date.now();
    const targetTime =
      elapsed +
      (nextLine.delay -
        (displayedLines > 0
          ? terminalLines[displayedLines - 1].delay
          : 0));

    const timeout = setTimeout(() => {
      setDisplayedLines((prev) => prev + 1);
    }, targetTime - elapsed);

    return () => clearTimeout(timeout);
  }, [started, displayedLines]);

  const scrollToInstall = useCallback(() => {
    const el = document.getElementById("install");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToUsage = useCallback(() => {
    const el = document.getElementById("usage");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background LED grid */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <LedGrid
          rows={14}
          cols={24}
          spacing={32}
          dotSize={2}
          variant="wave"
          speed={0.4}
          density={0.25}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.04)_0%,transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-32 w-full">
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Hero Logo */}
          {/* <HeroLogo visible={visible} /> */}

          {/* Minimal header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-[var(--green)] text-xs">astra</span>
              <span className="text-[var(--text-dim)] text-xs">v0.1.7</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-4">
              <span className="text-[var(--foreground)]">
                Your Terminal&apos;s
              </span>
              <br />
              <span className="text-[var(--accent)]">AI Partner</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
              Five interaction modes. 38+ agent tools. Staging-first mutations.
              Multi-agent orchestration. All in your CLI.
            </p>
          </div>

          {/* Terminal window */}
          <div
            ref={terminalRef}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-raised)]/60">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[10px] text-[var(--text-dim)]">
                bash — astra
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-5 text-xs sm:text-sm leading-6 min-h-[280px]">
              {terminalLines.slice(0, displayedLines).map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.dim
                      ? "text-[var(--text-dim)]"
                      : line.accent
                      ? "text-[var(--accent)]"
                      : line.cursor
                      ? "text-[var(--green)]"
                      : "text-[var(--foreground)]"
                  } ${
                    i === displayedLines - 1 && line.cursor
                      ? "terminal-cursor-line"
                      : ""
                  }`}
                >
                  {line.prompt && (
                    <span
                      className={
                        line.prompt === "$"
                          ? "text-[var(--green)]"
                          : "text-[var(--accent)]"
                      }
                    >
                      {line.prompt}
                    </span>
                  )}
                  {line.prompt && " "}
                  {line.text}
                  {i === displayedLines - 1 && !line.cursor && (
                    <span className="terminal-cursor" />
                  )}
                </div>
              ))}
              {displayedLines >= terminalLines.length && (
                <div className="text-[var(--green)]">
                  <span className="terminal-cursor" />
                </div>
              )}
            </div>
          </div>

          {/* Quick setup steps */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            {quickSteps.map((step, i) => (
              <div
                key={step.num}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--surface)]/50 border border-[var(--border)]"
              >
                <span className="text-[10px] text-[var(--text-dim)] font-mono">
                  {step.num}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
                  {step.label}
                </span>
                <span className="text-[10px] text-[var(--foreground)] font-mono">
                  {step.cmd}
                </span>
                {i < quickSteps.length - 1 && (
                  <svg
                    className="w-3 h-3 text-[var(--text-dim)] ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={scrollToInstall}
              className="px-5 py-2.5 rounded-md text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dim)] transition-colors duration-200"
            >
              Install Astra
            </button>
            <button
              onClick={scrollToUsage}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              See examples →
            </button>
            <a
              href="https://github.com/OneDev-Harsh/astra-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/astrabot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#CB3837] hover:text-[#ff6b6b] transition-colors duration-200"
            >
              npm
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
