"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";


const navItems = [
  { label: "Home", href: "#hero", type: "anchor" as const },
  { label: "Features", href: "#features", type: "anchor" as const },
  { label: "Modes", href: "#modes", type: "anchor" as const },
  { label: "Install", href: "#install", type: "anchor" as const },
  { label: "Docs", href: "/docs", type: "page" as const },
];

function AstraLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="navGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="navGradAlt" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <radialGradient id="navApex" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="60%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <filter id="navGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="navShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#6d28d9" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="16" cy="16" r="15" fill="#0f0a1a" stroke="#2e1f4a" strokeWidth="0.5" />

      {/* Apex star glow */}
      <circle cx="16" cy="5.5" r="2.5" fill="url(#navApex)" filter="url(#navGlow)" />
      <circle cx="16" cy="5.5" r="0.9" fill="#f5f3ff" />

      {/* Left stroke of A (thick) */}
      <line x1="16" y1="5.5" x2="6.5" y2="27" stroke="url(#navGradAlt)" strokeWidth="4" strokeLinecap="round" filter="url(#navShadow)" />

      {/* Right stroke of A (thick) */}
      <line x1="16" y1="5.5" x2="25.5" y2="27" stroke="url(#navGrad)" strokeWidth="4" strokeLinecap="round" filter="url(#navShadow)" />

      {/* Crossbar (thick, matching weight) */}
      <line x1="10.5" y1="18.5" x2="21.5" y2="18.5" stroke="#c4b5fd" strokeWidth="3.2" strokeLinecap="round" />

      {/* Subtle orbital arc */}
      <ellipse cx="16" cy="20" rx="13" ry="4.5" fill="none" stroke="#a78bfa" strokeWidth="0.35" transform="rotate(-12 16 20)" opacity="0.2" />
    </svg>
  );
}

export default function CreativeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--background)]/80 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleAnchorClick("#hero")}
            className="flex items-center gap-2.5 group"
          >
            <img src="/astra.png" alt="Astra" style={{ width: 40, height: 40, objectFit: "contain" }} />
            <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              astra
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center">
            {navItems.map((item, i) =>
              item.type === "page" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors duration-200"
                >
                  <span className="text-[var(--text-dim)] mr-1">0{i + 1}</span>
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchorClick(item.href);
                  }}
                  className="relative px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors duration-200"
                >
                  <span className="text-[var(--text-dim)] mr-1">0{i + 1}</span>
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Right side links */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/OneDev-Harsh/astra-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-bright)] rounded-md transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/astrabot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium text-[#CB3837] hover:text-[#ff6b6b] border border-[#CB3837]/20 hover:border-[#CB3837]/40 rounded-md transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0v24h24v-24h-24zm13 20h-2v-7h-3v7h-4v-12h12v12h-3z" />
              </svg>
              npm
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-4 h-px bg-[var(--foreground)] transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[3px]" : ""
              }`}
            />
            <span
              className={`block w-4 h-px bg-[var(--foreground)] transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-4 h-px bg-[var(--foreground)] transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--background)]/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navItems.map((item, i) =>
            item.type === "page" ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 text-lg font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
                style={{
                  transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.4s ease-out",
                }}
              >
                <span className="text-[10px] text-[var(--text-dim)]">0{i + 1}</span>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.href}
                onClick={() => handleAnchorClick(item.href)}
                className="group flex items-center gap-3 text-lg font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
                style={{
                  transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.4s ease-out",
                }}
              >
                <span className="text-[10px] text-[var(--text-dim)]">0{i + 1}</span>
                {item.label}
              </button>
            )
          )}
          <div className="flex gap-4 mt-4">
            <a
              href="https://github.com/OneDev-Harsh/astra-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/astrabot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#CB3837] hover:text-[#ff6b6b] transition-colors"
            >
              npm
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
