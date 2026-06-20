"use client";

import { useEffect, useRef, useState } from "react";

const modes = [
  {
    name: "Auto",
    tagline: "Intent Router",
    description: "LLM-powered classifier that routes your request to the best mode. Fast-path regex for common patterns, falls back to LLM for ambiguous input.",
    color: "#a78bfa",
    details: ["Intent classification", "Automatic mode selection", "Fallback to Agent"],
  },
  {
    name: "Agent",
    tagline: "Autonomous Coding",
    description: "Full tool access with multi-step file modifications, shell commands, and web research. All mutations staged and presented for approval with diffs.",
    color: "#67e8f9",
    details: ["50 tool-calling steps", "Full filesystem access", "Per-file diff review"],
  },
  {
    name: "Ask",
    tagline: "Read-Only Q&A",
    description: "Read files, search the codebase, and browse the web — but never modify anything. Optionally save the response as markdown.",
    color: "#34d399",
    details: ["25 reasoning steps", "No mutations", "Optional .md save"],
  },
  {
    name: "Plan",
    tagline: "Structured Planning",
    description: "Breaks a high-level goal into structured steps with complexity ratings. Select which steps to execute; each runs as an independent agent.",
    color: "#fbbf24",
    details: ["1-20 plan steps", "Complexity ratings", "Selective execution"],
  },
  {
    name: "Multi-Agent",
    tagline: "Agent Teams",
    description: "Coordinates multiple AI agents with 5 orchestration strategies and 6 pre-built workflow templates. Per-agent model overrides supported.",
    color: "#f472b6",
    details: ["5 strategies", "5 agent roles", "6 workflow templates"],
  },
];

export default function ModesSection() {
  const [activeMode, setActiveMode] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="modes" ref={ref} className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          className={`mb-12 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[var(--text-dim)]">02</span>
            <div className="h-px w-8 bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Modes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Five Modes, <span className="text-[var(--accent)]">One CLI</span>
          </h2>
        </div>

        <div
          className={`transition-all duration-500 delay-100 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Mode selector — terminal style tabs */}
          <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-md bg-[var(--surface)]/50 border border-[var(--border)] w-fit">
            {modes.map((mode, i) => (
              <button
                key={mode.name}
                onClick={() => setActiveMode(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  activeMode === i
                    ? "bg-[var(--surface-raised)] text-[var(--foreground)] border border-[var(--border-bright)]"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)] border border-transparent"
                }`}
              >
                <span className="text-[var(--text-dim)] mr-1.5">$</span>
                {mode.name.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Active mode detail */}
          <div className="max-w-2xl">
            <div
              key={activeMode}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/60 p-6 animate-fade-in"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: modes[activeMode].color }}
                />
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {modes[activeMode].name}
                </h3>
                <span
                  className="text-xs"
                  style={{ color: modes[activeMode].color }}
                >
                  {modes[activeMode].tagline}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-3 mb-4">
                {modes[activeMode].description}
              </p>
              <div className="flex flex-wrap gap-2">
                {modes[activeMode].details.map((detail) => (
                  <span
                    key={detail}
                    className="px-2 py-0.5 text-[10px] font-mono border rounded"
                    style={{
                      borderColor: `${modes[activeMode].color}25`,
                      color: modes[activeMode].color,
                      backgroundColor: `${modes[activeMode].color}08`,
                    }}
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
