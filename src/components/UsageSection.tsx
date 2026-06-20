"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import LedBorder from "./LedBorder";

const examples = [
  {
    id: "auto",
    title: "Auto Mode",
    tagline: "Just describe what you need",
    color: "#a78bfa",
    code: `# Direct prompt — auto-router picks the best mode
$ astra "fix the authentication bug in auth.ts"

# Or launch interactive menu
$ astra wakeup

# Auto-classified as → Agent mode
# The agent reads, modifies, and stages changes for approval`,
  },
  {
    id: "agent",
    title: "Agent Mode",
    tagline: "Autonomous multi-step coding",
    color: "#67e8f9",
    code: `$ astra wakeup
# Select: Agent Mode

> What would you like the agent to do?
"Add a REST API endpoint for user profiles"

* read_file  { path: "src/routes/index.ts" }
* read_file  { path: "src/models/user.ts" }
* create_file { path: "src/routes/profiles.ts" }
* modify_file { path: "src/routes/index.ts" }

[ASTRA] 4 files touched. Review changes?

→ Review one by one
  src/routes/profiles.ts  [+45 -0]  ✓ accept
  src/routes/index.ts     [+3 -0]   ✓ accept

✓ Applied 2 changes.`,
  },
  {
    id: "ask",
    title: "Ask Mode",
    tagline: "Read-only Q&A",
    color: "#34d399",
    code: `$ astra wakeup
# Select: Ask Mode

> What would you like to ask?
"How does the session resume system work?"

* read_file   { path: "session/session-manager.ts" }
* read_file   { path: "session/session-cache.ts" }
* grep        { query: "resume", path: "session/" }

[ASTRA] The session system uses a 3-tier resume priority:
1. Explicit session ID
2. Interrupted session in same workspace
3. Keyword overlap ≥30%

Sessions are stored in ~/.astra/sessions/index.json
with atomic writes and a 500ms debounced in-memory cache.

→ Save this answer as .md? (y/N)`,
  },
  {
    id: "plan",
    title: "Plan Mode",
    tagline: "Structured planning + execution",
    color: "#fbbf24",
    code: `$ astra wakeup
# Select: Plan Mode

> What is your goal?
"Design and implement a rate limiter middleware"

[ASTRA] Plan generated:

1. [low]    Research existing rate limiting patterns
2. [medium] Design middleware interface
3. [high]   Implement token bucket algorithm
4. [medium] Add Redis-backed distributed rate limiting
5. [low]    Write unit tests

→ Select steps to execute (all pre-selected)
→ Execute 5 steps? (Y/n)

* Executing step 1/5...
* Executing step 2/5...
...

✓ All steps complete. 8 files modified.`,
  },
  {
    id: "multi",
    title: "Multi-Agent",
    tagline: "Agent teams working together",
    color: "#f472b6",
    code: `$ astra wakeup
# Select: Multi-Agent Mode

> What is your goal?
"Review and improve the CLI error handling"

[ASTRA] Selected template: Code Review
Strategy: Sequential | Agents: 3

┌─ Researcher ──────────────────┐
│ Analyzes current error handling│
│ patterns across the codebase   │
└──────────────┬────────────────┘
               ▼
┌─ Implementer ─────────────────┐
│ Fixes identified issues, adds  │
│ proper error classification    │
└──────────────┬────────────────┘
               ▼
┌─ Reviewer ────────────────────┐
│ Reviews all changes, runs tests│
└───────────────────────────────┘

✓ All agents complete. 12 files reviewed, 5 modified.`,
  },
  {
    id: "sandbox",
    title: "Sandbox Mode",
    tagline: "Secure isolated execution",
    color: "#fb923c",
    code: `$ astra sandbox

[ASTRA] Activating sandbox mode...
✓ Server health check passed
✓ Auth token generated
✓ Bootstrapped with server
✓ Credentials stored in OS keychain
✓ Sandbox mode enabled

[ASTRA] Sandbox active. Model: openrouter/owl-alpha
All credentials stored in OS keychain (macOS/Windows/Linux).
HMAC-SHA-256 signed requests with replay protection.

$ astra "analyze this codebase"
# Runs in isolated sandbox environment`,
  },
];

export default function UsageSection() {
  const [activeExample, setActiveExample] = useState(0);
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

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(examples[activeExample].code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [activeExample]);

  return (
    <section id="usage" ref={ref} className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          className={`mb-12 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[var(--text-dim)]">04</span>
            <div className="h-px w-8 bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Usage Examples</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            See Astra <span className="text-[var(--accent)]">In Action</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-2 max-w-lg">
            Real terminal sessions showing how each mode works. Click a tab to switch examples.
          </p>
        </div>

        <div
          className={`transition-all duration-500 delay-100 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 mb-4 p-1 rounded-md bg-[var(--surface)]/50 border border-[var(--border)] w-fit">
            {examples.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => setActiveExample(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  activeExample === i
                    ? "bg-[var(--surface-raised)] border"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)] border border-transparent"
                }`}
                style={
                  activeExample === i
                    ? { borderColor: `${ex.color}30`, color: ex.color }
                    : {}
                }
              >
                {ex.title}
              </button>
            ))}
          </div>

          {/* Code display */}
          <div
            key={activeExample}
            className="animate-fade-in"
          >
              <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-lg overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-raised)]/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-3 text-[10px] text-[var(--text-dim)]">
                      {examples[activeExample].title.toLowerCase().replace(" ", "-")} — astra
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded border"
                      style={{
                        color: examples[activeExample].color,
                        borderColor: `${examples[activeExample].color}25`,
                        backgroundColor: `${examples[activeExample].color}08`,
                      }}
                    >
                      {examples[activeExample].tagline}
                    </span>
                    <button
                      onClick={copyCode}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-bright)] transition-all duration-200"
                    >
                      {copied ? "✓ copied" : "copy"}
                    </button>
                  </div>
                </div>

                {/* Code body */}
                <div className="p-5 text-xs leading-6 font-mono overflow-x-auto">
                  {examples[activeExample].code.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-6 text-right mr-4 text-[var(--text-dim)] select-none shrink-0">
                        {i + 1}
                      </span>
                      <span
                        className={
                          line.startsWith("$")
                            ? "text-[var(--green)]"
                            : line.startsWith("*")
                            ? "text-[var(--cyan)]"
                            : line.startsWith(">")
                            ? "text-[var(--accent)]"
                            : line.startsWith("✓")
                            ? "text-[var(--green)]"
                            : line.startsWith("→")
                            ? "text-[var(--amber)]"
                            : line.startsWith("[ASTRA]")
                            ? "text-[var(--accent)]"
                            : line.startsWith("┌") || line.startsWith("│") || line.startsWith("└") || line.startsWith("─") || line.startsWith("  ┌") || line.startsWith("  │") || line.startsWith("  └")
                            ? "text-[var(--text-dim)]"
                            : line.startsWith("#")
                            ? "text-[var(--text-dim)]"
                            : "text-[var(--foreground)]"
                        }
                      >
                        {line || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
