"use client";

import { useEffect, useRef, useState } from "react";
import LedGrid from "./LedGrid";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* Hero-style footer top */}
      <div className="relative">
        {/* Background LED grid */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <LedGrid
            rows={10}
            cols={18}
            spacing={32}
            dotSize={2}
            variant="pulse"
            speed={0.3}
            density={0.2}
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.06)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <div
            className={`text-center transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Big CTA */}
            <div className="mb-8">
              <p className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase mb-4">
                Ready to build?
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-4">
                <span className="text-[var(--foreground)]">Your terminal is</span>
                <br />
                <span className="text-[var(--accent)]">waiting.</span>
              </h2>
              <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-8">
                One command to install. One command to configure. One command to change how you code forever.
              </p>
            </div>

            {/* Install command */}
            <div
              className={`inline-block transition-all duration-700 delay-200 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono text-sm">
                <span className="text-[var(--green)]">$</span>
                <span className="text-[var(--foreground)]">npm install -g astrabot</span>
                <span className="terminal-cursor" />
              </div>
            </div>

            {/* Quick links grid */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 gap-4 mt-16 transition-all duration-700 delay-300 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <a
                href="https://github.com/OneDev-Harsh/astra-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] bg-[var(--surface)]/40 hover:bg-[var(--surface-raised)]/60 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--foreground)]/5 mb-3 mx-auto group-hover:bg-[var(--foreground)]/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--foreground)">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">GitHub</p>
                <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Source & Issues</p>
              </a>

              <a
                href="https://www.npmjs.com/package/astrabot"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-lg border border-[var(--border)] hover:border-[#CB3837]/30 bg-[var(--surface)]/40 hover:bg-[var(--surface-raised)]/60 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#CB3837]/10 mb-3 mx-auto group-hover:bg-[#CB3837]/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#CB3837">
                    <path d="M0 0v24h24v-24h-24zm13 20h-2v-7h-3v7h-4v-12h12v12h-3z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-[var(--foreground)] group-hover:text-[#CB3837] transition-colors">npm</p>
                <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Package Registry</p>
              </a>

              {/* <a
                href="https://github.com/OneDev-Harsh/astra-cli/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] bg-[var(--surface)]/40 hover:bg-[var(--surface-raised)]/60 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--green)]/10 mb-3 mx-auto group-hover:bg-[var(--green)]/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-[var(--foreground)] group-hover:text-[var(--green)] transition-colors">MIT License</p>
                <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Open Source</p>
              </a>

              <a
                href="/docs"
                className="group p-4 rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] bg-[var(--surface)]/40 hover:bg-[var(--surface-raised)]/60 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--accent)]/10 mb-3 mx-auto group-hover:bg-[var(--accent)]/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">Docs</p>
                <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Full Reference</p>
              </a> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)]/30">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[var(--accent)]/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                astra v0.1.7
              </span> */}
            </div>

            <div className="flex items-center gap-4 text-[10px] text-[var(--text-dim)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[var(--green)] animate-pulse" />
                All systems operational
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Built with Bun + TypeScript + OpenRouter</span>
            </div>

            <div className="text-[10px] text-[var(--text-dim)]">
              © {new Date().getFullYear()} Astra
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
