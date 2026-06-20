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
          <linearGradient id="heroCore" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="40%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <radialGradient id="heroGlowBg" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="heroRing" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="heroApex" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ede9fe" />
            <stop offset="30%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <filter id="heroSoftGlow">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heroStrongGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heroApexGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx="16" cy="16" r="15" fill="url(#heroGlowBg)" />

        {/* Outer orbital ring */}
        <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="url(#heroRing)" strokeWidth="0.6" transform="rotate(-15 16 16)" opacity="0.6" />

        {/* Middle orbital ring */}
        <ellipse cx="16" cy="16" rx="11" ry="4" fill="none" stroke="url(#heroRing)" strokeWidth="0.5" transform="rotate(30 16 16)" opacity="0.45" />

        {/* Inner orbital ring */}
        <ellipse cx="16" cy="16" rx="7.5" ry="2.5" fill="none" stroke="#c4b5fd" strokeWidth="0.35" transform="rotate(-5 16 16)" opacity="0.4" />

        {/* Hexagonal neural core - outer */}
        <polygon points="16,9 20,11.5 20,16.5 16,19 12,16.5 12,11.5" fill="none" stroke="#a78bfa" strokeWidth="0.7" opacity="0.5" />
        {/* Hexagonal neural core - inner */}
        <polygon points="16,10.5 18.5,12.25 18.5,15.75 16,17.5 13.5,15.75 13.5,12.25" fill="#a78bfa" opacity="0.08" />

        {/* Core "A" shape */}
        <path d="M16 5 L9 23 L12.5 23 L14.5 17.5 L17.5 17.5 L19.5 23 L23 23 Z" fill="url(#heroCore)" filter="url(#heroSoftGlow)" />

        {/* Apex star - bright highlight */}
        <circle cx="16" cy="5.5" r="1.5" fill="url(#heroApex)" filter="url(#heroApexGlow)" />

        {/* Crossbar */}
        <rect x="12" y="14.5" width="8" height="1.5" rx="0.75" fill="#c4b5fd" opacity="0.75" />

        {/* Neural nodes at hex vertices */}
        <circle cx="16" cy="9" r="1.2" fill="#c4b5fd" opacity="0.95" filter="url(#heroSoftGlow)" />
        <circle cx="20" cy="11.5" r="0.9" fill="#a78bfa" opacity="0.75" />
        <circle cx="20" cy="16.5" r="0.9" fill="#a78bfa" opacity="0.75" />
        <circle cx="16" cy="19" r="0.9" fill="#7c3aed" opacity="0.85" />
        <circle cx="12" cy="16.5" r="0.9" fill="#a78bfa" opacity="0.75" />
        <circle cx="12" cy="11.5" r="0.9" fill="#a78bfa" opacity="0.75" />

        {/* Connection lines from nodes to center */}
        <line x1="16" y1="9" x2="16" y2="14" stroke="#c4b5fd" strokeWidth="0.35" opacity="0.45" />
        <line x1="20" y1="11.5" x2="18" y2="14" stroke="#a78bfa" strokeWidth="0.35" opacity="0.35" />
        <line x1="12" y1="11.5" x2="14" y2="14" stroke="#a78bfa" strokeWidth="0.35" opacity="0.35" />

        {/* Scattered star particles */}
        <circle cx="5" cy="7" r="0.6" fill="#c4b5fd" opacity="0.6" />
        <circle cx="27" cy="7" r="0.5" fill="#a78bfa" opacity="0.5" />
        <circle cx="4" cy="22" r="0.5" fill="#7c3aed" opacity="0.55" />
        <circle cx="28" cy="22" r="0.6" fill="#c4b5fd" opacity="0.5" />
        <circle cx="8" cy="28" r="0.4" fill="#a78bfa" opacity="0.4" />
        <circle cx="24" cy="28" r="0.4" fill="#a78bfa" opacity="0.4" />
        <circle cx="16" cy="26" r="0.5" fill="#c4b5fd" opacity="0.45" />
        <circle cx="16" cy="3" r="0.4" fill="#ede9fe" opacity="0.5" />

        {/* Terminal cursor hint */}
        <rect x="14" y="27" width="4" height="0.9" rx="0.45" fill="#a78bfa" opacity="0.35" />
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
          <HeroLogo visible={visible} />

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
