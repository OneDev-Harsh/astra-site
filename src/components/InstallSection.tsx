"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import LedBorder from "./LedBorder";

type OS = "linux" | "macos" | "windows" | "unknown";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

const installData: Record<OS, { label: string; command: string; note: string; file: string }> = {
  linux: {
    label: "Linux",
    command: "npm install -g astrabot",
    note: "Or: npm install -g astrabot",
    file: "install.sh",
  },
  macos: {
    label: "macOS",
    command: "npm install -g astrabot",
    note: "Or: npm install -g astrabot",
    file: "install.sh",
  },
  windows: {
    label: "Windows",
    command: "npm install -g astrabot",
    note: "Or: npm install -g astrabot",
    file: "install.bat",
  },
  unknown: {
    label: "All Platforms",
    command: "npm install -g astrabot",
    note: "Works on Linux, macOS, and Windows",
    file: "install.sh",
  },
};

export default function InstallSection() {
  const [os, setOs] = useState<OS>(() =>
    typeof window !== "undefined" ? detectOS() : "unknown"
  );
  const [copied, setCopied] = useState(false);
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

  const current = installData[os];

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText(current.command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [current.command]);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = `/${current.file}`;
    a.download = current.file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [current.file]);

  return (
    <section id="install" ref={ref} className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div
          className={`mb-12 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[var(--text-dim)]">03</span>
            <div className="h-px w-8 bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Install</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Up and Running in <span className="text-[var(--accent)]">Seconds</span>
          </h2>
        </div>

        <div
          className={`transition-all duration-500 delay-100 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* OS selector */}
          <div className="flex gap-1 mb-6">
            {(["linux", "macos", "windows"] as const).map((platform) => (
              <button
                key={platform}
                onClick={() => setOs(platform)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  os === platform
                    ? "bg-[var(--surface-raised)] text-[var(--foreground)] border border-[var(--border-bright)]"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)] border border-transparent"
                }`}
              >
                {installData[platform].label}
              </button>
            ))}
          </div>

          <LedBorder className="rounded-lg">
            <div className="bg-[var(--surface)]/60 backdrop-blur-sm rounded-lg p-6">
              {/* Command line */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-[var(--background)] border border-[var(--border)] font-mono text-xs mb-4">
                <span className="text-[var(--green)]">$</span>
                <span className="text-[var(--foreground)] flex-1">
                  {current.command}
                </span>
                <button
                  onClick={copyCommand}
                  className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-bright)] transition-all duration-200"
                >
                  {copied ? "copied" : "copy"}
                </button>
              </div>

              {/* Download button */}
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dim)] transition-colors duration-200 mb-4"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download {current.file}
              </button>

              <p className="text-[10px] text-[var(--text-dim)] text-center mb-4">
                {current.note}
              </p>

              {/* Next steps */}
              <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--background)]/50">
                <p className="text-[10px] text-[var(--text-dim)] mb-1">Next:</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Run{" "}
                  <code className="px-1 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--foreground)] text-[10px] font-mono">
                    astra setup
                  </code>{" "}
                  to configure API keys, then{" "}
                  <code className="px-1 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--foreground)] text-[10px] font-mono">
                    astra wakeup
                  </code>
                </p>
              </div>
            </div>
          </LedBorder>
        </div>
      </div>
    </section>
  );
}
