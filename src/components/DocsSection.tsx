"use client";

import { useEffect, useRef, useState } from "react";
import LedBorder from "./LedBorder";

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    content: {
      description: "Install Astra and get your AI agent running in under a minutes.",
      items: [
        { label: "Prerequisites", detail: "Bun >= 1.0.0, OpenRouter API key (required), Firecrawl API key (optional)" },
        { label: "Quick Install", detail: "npm install -g astrabot — works on Linux, macOS, Windows" },
        { label: "From Source", detail: "git clone → bun install → bun run index.ts setup" },
        { label: "npx (no install)", detail: "npx astrabot setup — run directly without global install" },
      ],
    },
  },
  {
    id: "commands",
    title: "Commands",
    icon: "⚡",
    content: {
      description: "Every CLI command at a glance.",
      items: [
        { label: "astra [prompt]", detail: "Auto-router — classifies intent and picks the best mode" },
        { label: "astra wakeup", detail: "Interactive menu with ASCII banner + session resume check" },
        { label: "astra setup", detail: "Interactive wizard for API keys, model selection, skills" },
        { label: "astra sandbox", detail: "Secure execution with OS keychain + HMAC-signed requests" },
        { label: "astra play", detail: "Arcade — 5 HTML5 mini-games on local Bun server (port 4321)" },
        { label: "astra reset", detail: "Purge all configs, sessions, credentials from ~/.astra/" },
      ],
    },
  },
  {
    id: "modes",
    title: "Interaction Modes",
    icon: "🎯",
    content: {
      description: "Five modes, each designed for a different workflow.",
      items: [
        { label: "Auto", detail: "LLM intent classifier with fast-path regex. Routes to best mode automatically." },
        { label: "Agent", detail: "Full autonomous coding. 50 tool-calling steps. All mutations staged + diff review." },
        { label: "Ask", detail: "Read-only Q&A. 25 reasoning steps. No mutations. Optional .md save." },
        { label: "Plan", detail: "Structured planning. 1-20 steps with complexity ratings. Selective execution." },
        { label: "Multi-Agent", detail: "Agent teams with 5 strategies, 5 roles, 6 workflow templates." },
      ],
    },
  },
  {
    id: "tools",
    title: "Tool System",
    icon: "🔧",
    content: {
      description: "38+ typed tools exposed to the AI agent via Vercel AI SDK.",
      items: [
        { label: "File System (13)", detail: "read, create, modify, delete, search, grep, replace, append, insert" },
        { label: "Shell & Execution (7)", detail: "run_command, background, tests, lint, format, execute_shell" },
        { label: "Git (3)", detail: "git_status, git_diff, git_log — full repo awareness" },
        { label: "Project (2)", detail: "detect_framework, read_package_json — auto-detect from package.json" },
        { label: "Web (3)", detail: "web_search (DuckDuckGo/Firecrawl), web_crawl, fetch_url" },
        { label: "Planning (2)", detail: "create_plan, get_plan — in-memory task planning" },
        { label: "Staging (2)", detail: "show_pending_changes, discard_changes — overlay control" },
        { label: "Skills (2)", detail: "list_skills, read_skill — discover and load SKILL.md files" },
        { label: "Session (3)", detail: "session_status, session_search, session_resume_context" },
      ],
    },
  },
  {
    id: "staging",
    title: "Staging & Approval",
    icon: "🛡️",
    content: {
      description: "No file is ever written without your explicit approval.",
      items: [
        { label: "Phase 1: Staging", detail: "Path safety → exclude check → size limit → in-memory overlay → ActionTracker log" },
        { label: "Phase 2: Approval", detail: "Approve all / review per-file with unified diffs (3 context) / cancel" },
        { label: "Phase 3: Apply", detail: "Folders → files → shell commands. Atomic writes. Double-apply prevention." },
        { label: "Safety", detail: "Workspace root boundary, exclude patterns (node_modules, .git, dist, .env*), 1MB limit" },
      ],
    },
  },
  {
    id: "sessions",
    title: "Sessions & History",
    icon: "💾",
    content: {
      description: "Persistent sessions with auto-resume and cross-session action history.",
      items: [
        { label: "Storage", detail: "~/.astra/sessions/index.json — atomic writes, LRU cache, 500ms debounce" },
        { label: "Lifecycle", detail: "begin → active → completed/interrupted → resume with full context" },
        { label: "Resume Priority", detail: "Explicit ID → interrupted in workspace → keyword overlap ≥30%" },
        { label: "Action History", detail: "~/.astra/history/actions.jsonl — cross-session JSONL log with UUIDs" },
        { label: "Session Tools", detail: "session_status, session_search, session_resume_context built into agent" },
      ],
    },
  },
  {
    id: "multi-agent",
    title: "Multi-Agent",
    icon: "🤖",
    content: {
      description: "Coordinate multiple AI agents with configurable strategies and roles.",
      items: [
        { label: "Strategies (5)", detail: "Sequential, Parallel, Hierarchical, Collaborative, DAG" },
        { label: "Roles (5)", detail: "Researcher (read-only), Implementer (full), Reviewer, Coordinator, Custom" },
        { label: "Templates (6)", detail: "Code Review, Feature Dev, Bug Fix, Research, Security Audit, Full-Stack" },
        { label: "Message Broker", detail: "Pub-sub communication for collaborative mode with priority ordering" },
        { label: "Validation", detail: "10+ checks including DAG cycle detection, dependency resolution" },
      ],
    },
  },
  {
    id: "sandbox",
    title: "Sandbox & Security",
    icon: "🔒",
    content: {
      description: "Secure execution environment with OS-level credential storage.",
      items: [
        { label: "Credential Storage", detail: "OS keychain (macOS/Windows/Linux) + AES-256-GCM file fallback" },
        { label: "HMAC Signing", detail: "SHA-256 HMAC with timestamps for replay protection" },
        { label: "Fixed Model", detail: "openrouter/owl-alpha — isolated from user config" },
        { label: "Remote Server", detail: "https://astra-server-oh6s.onrender.com with health checks" },
        { label: "Key Caching", detail: "5-minute in-memory TTL with validation (sk-or-v1-* format)" },
      ],
    },
  },
  {
    id: "skills",
    title: "Skills System",
    icon: "📚",
    content: {
      description: "SKILL.md files providing structured guidance to the AI agent.",
      items: [
        { label: "Built-in (5)", detail: "code-review, documentation, git-workflow, project-setup, test-runner" },
        { label: "Directories", detail: ".skills/ → Cursor → Claude → custom SKILLS_DIRS env var" },
        { label: "Format", detail: "YAML frontmatter (name, description) + markdown body with agent instructions" },
        { label: "Agent Tools", detail: "list_skills discovers, read_skill loads — path must be within allowed roots" },
      ],
    },
  },
  {
    id: "config",
    title: "Configuration",
    icon: "⚙️",
    content: {
      description: "Environment-based configuration with interactive setup wizard.",
      items: [
        { label: "Required", detail: "OPENROUTER_API_KEY, OPENROUTER_DEFAULT_MODEL" },
        { label: "Optional", detail: "FIRECRAWL_API_KEY, SKILLS_DIRS (semicolon-separated paths)" },
        { label: "Retry Config", detail: "ASTRA_AGENT_RETRY_MAX (3), ASTRA_MULTI_RETRY_MAX (2), backoff, jitter" },
        { label: "File Locations", detail: "~/.astra/.env, sessions/, logs/astra.log, history/actions.jsonl" },
        { label: "TypeScript", detail: "ESNext target, strict mode, Bun types, bundler resolution" },
      ],
    },
  },
];

function DocSection({
  section,
  index,
  isOpen,
  onToggle,
}: {
  section: (typeof docSections)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left group"
      >
        <div className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] bg-[var(--surface)]/40 hover:bg-[var(--surface-raised)]/60 transition-all duration-300">
          <span className="text-lg">{section.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--text-dim)] font-mono">0{index + 1}</span>
              <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {section.title}
              </h3>
            </div>
            <p className="text-[10px] text-[var(--text-dim)] mt-0.5 truncate">
              {section.content.description}
            </p>
          </div>
          <svg
            className={`w-4 h-4 text-[var(--text-dim)] transition-transform duration-300 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ${
          isOpen ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <LedBorder className="rounded-lg">
          <div className="p-4 bg-[var(--surface)]/60 backdrop-blur-sm rounded-lg">
            <p className="text-xs text-[var(--text-muted)] mb-3">{section.content.description}</p>
            <div className="space-y-2">
              {section.content.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 rounded-md bg-[var(--background)]/40 border border-[var(--border)]/50"
                >
                  <div className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-[var(--foreground)]">{item.label}</span>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LedBorder>
      </div>
    </div>
  );
}

export default function DocsSection() {
  const [openSection, setOpenSection] = useState<string | null>("getting-started");
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="docs" ref={ref} className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div
          className={`mb-12 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[var(--text-dim)]">05</span>
            <div className="h-px w-8 bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Documentation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Everything You <span className="text-[var(--accent)]">Need to Know</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-2 max-w-lg">
            Comprehensive reference for every feature, command, mode, and configuration option. Click any section to expand.
          </p>
        </div>

        <div
          className={`space-y-3 transition-all duration-500 delay-100 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {docSections.map((section, i) => (
            <DocSection
              key={section.id}
              section={section}
              index={i}
              isOpen={openSection === section.id}
              onToggle={() =>
                setOpenSection(openSection === section.id ? null : section.id)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
