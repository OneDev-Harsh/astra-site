"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface TocItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

const toc: TocItem[] = [
  { id: "introduction", label: "Introduction" },
  { id: "quickstart", label: "Quickstart" },
  { id: "installation", label: "Installation" },
  {
    id: "commands", label: "Commands",
    children: [
      { id: "cmd-astra", label: "astra (default)" },
      { id: "cmd-wakeup", label: "astra wakeup" },
      { id: "cmd-setup", label: "astra setup" },
      { id: "cmd-sandbox", label: "astra sandbox" },
      { id: "cmd-play", label: "astra play" },
      { id: "cmd-reset", label: "astra reset" },
    ],
  },
  {
    id: "modes", label: "Interaction Modes",
    children: [
      { id: "mode-auto", label: "Auto Mode" },
      { id: "mode-agent", label: "Agent Mode" },
      { id: "mode-ask", label: "Ask Mode" },
      { id: "mode-plan", label: "Plan Mode" },
      { id: "mode-multi", label: "Multi-Agent Mode" },
    ],
  },
  {
    id: "tools", label: "Tool System",
    children: [
      { id: "tools-filesystem", label: "File System (13 tools)" },
      { id: "tools-shell", label: "Shell & Execution (7 tools)" },
      { id: "tools-git", label: "Git (3 tools)" },
      { id: "tools-project", label: "Project Intelligence (2 tools)" },
      { id: "tools-web", label: "Web (3 tools)" },
      { id: "tools-planning", label: "Planning (2 tools)" },
      { id: "tools-staging", label: "Staging (2 tools)" },
      { id: "tools-skills", label: "Skills (2 tools)" },
      { id: "tools-session", label: "Session (3 tools)" },
    ],
  },
  { id: "staging", label: "Staging & Approval Pipeline" },
  { id: "action-tracking", label: "Action Tracking System" },
  { id: "sessions", label: "Session Management" },
  { id: "action-history", label: "Persistent Action History" },
  {
    id: "multi-agent", label: "Multi-Agent Orchestration",
    children: [
      { id: "ma-roles", label: "Agent Roles" },
      { id: "ma-strategies", label: "Orchestration Strategies" },
      { id: "ma-templates", label: "Workflow Templates" },
      { id: "ma-broker", label: "Message Broker" },
      { id: "ma-validation", label: "Validation Checks" },
    ],
  },
  { id: "sandbox", label: "Sandbox Mode & Security" },
  { id: "skills-system", label: "Skills System" },
  { id: "retry", label: "Retry Engine" },
  { id: "configuration", label: "Configuration" },
  { id: "project-structure", label: "Project Structure" },
  { id: "dependencies", label: "Dependencies" },
  { id: "changelog", label: "Changelog" },
  { id: "roadmap", label: "Roadmap" },
];

function flattenToc(items: TocItem[]): { id: string; label: string; parentId?: string; parentLabel?: string }[] {
  const result: { id: string; label: string; parentId?: string; parentLabel?: string }[] = [];
  for (const item of items) {
    result.push({ id: item.id, label: item.label });
    if (item.children) {
      for (const child of item.children) {
        result.push({ id: child.id, label: child.label, parentId: item.id, parentLabel: item.label });
      }
    }
  }
  return result;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[var(--accent)] bg-[var(--accent)]/10 rounded px-0.5">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

function Section({ id, title, number, children }: { id: string; title: string; number?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.05 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} className={"mb-16 transition-all duration-500 " + (inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
      <div className="flex items-center gap-3 mb-5">
        {number && <span className="text-[10px] text-[var(--text-dim)] font-mono tabular-nums">{number}</span>}
        <div className="h-px w-8 bg-[var(--border)]" />
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ... CodeBlock, IC, Table, Callout, Badge, Sidebar, SearchBar components stay exactly the same ...
function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  return (
    <div className="relative group my-4">
      {lang && <span className="absolute top-2 right-3 text-[9px] text-[var(--text-dim)] font-mono uppercase">{lang}</span>}
      <pre className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] overflow-x-auto text-[11px] leading-relaxed text-[var(--foreground)] font-mono">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function IC({ children }: { children: React.ReactNode }) {
  return <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[var(--accent)] font-mono">{children}</code>;
}

// ... (skipping Table, Callout, Badge, Sidebar, SearchBar implementations for space as they remain completely unchanged) ...
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-[11px] leading-relaxed">
        <thead><tr className="bg-[var(--surface)]">
          {headers.map((h, i) => <th key={i} className="text-left px-3 py-2 font-semibold text-[var(--text-muted)] border-b border-[var(--border)] whitespace-nowrap">{h}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--surface)]/40 transition-colors">
              {row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-[var(--foreground)] whitespace-nowrap">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ type = "info", children }: { type?: "info" | "warning" | "tip"; children: React.ReactNode }) {
  const c = { info: "border-[var(--accent)]/30 bg-[var(--accent)]/5", warning: "border-[var(--amber)]/30 bg-[var(--amber)]/5", tip: "border-[var(--green)]/30 bg-[var(--green)]/5" };
  const l = { info: "Note", warning: "Warning", tip: "Tip" };
  return <div className={"my-4 p-4 rounded-lg border " + c[type]}><p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">{l[type]}</p><div className="text-xs text-[var(--foreground)] leading-relaxed">{children}</div></div>;
}

function Badge({ children, color = "purple" }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { purple: "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/20", green: "bg-[var(--green)]/15 text-[var(--green)] border-[var(--green)]/20", amber: "bg-[var(--amber)]/15 text-[var(--amber)] border-[var(--amber)]/20" };
  return <span className={"inline-block px-2 py-0.5 rounded text-[10px] font-medium border " + (c[color] || c.purple)}>{children}</span>;
}

function Sidebar({ activeId, onNavigate, mobileOpen, onClose }: { activeId: string; onNavigate: (id: string) => void; mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={onClose} />}
      <aside className={"fixed top-14 left-0 bottom-0 z-50 w-64 bg-[var(--background)] border-r border-[var(--border)] overflow-y-auto transition-transform duration-300 md:translate-x-0 " + (mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <nav className="p-4 space-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-dim)] px-3 mb-3">Documentation</p>
          {toc.map((item) => (
            <div key={item.id}>
              <button onClick={() => { onNavigate(item.id); onClose(); }}
                className={"w-full text-left px-3 py-1.5 rounded-md text-[11px] transition-colors duration-150 " + (activeId === item.id ? "text-[var(--accent)] bg-[var(--accent)]/8 font-medium" : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]")}>
                {item.label}
              </button>
              {item.children && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {item.children.map((child) => (
                    <button key={child.id} onClick={() => { onNavigate(child.id); onClose(); }}
                      className={"w-full text-left px-3 py-1 rounded-md text-[10px] transition-colors duration-150 " + (activeId === child.id ? "text-[var(--accent)] bg-[var(--accent)]/8 font-medium" : "text-[var(--text-dim)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]")}>
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

function SearchBar({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const flatItems = useMemo(() => flattenToc(toc), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return flatItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [query, flatItems]);

  const showDropdown = isFocused && results.length > 0;

  const handleSelect = useCallback((id: string) => {
    onNavigate(id);
    setQuery("");
    setIsFocused(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, [onNavigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].id);
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelect(results[0].id);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }, [results, selectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[selectedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current && !inputRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative mb-10">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search sections..."
          className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Clear search"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 mt-2 rounded-lg bg-[var(--surface)] border border-[var(--border-bright)] shadow-xl shadow-black/40 max-h-64 overflow-y-auto"
        >
          <div className="p-2">
            {results.map((item, i) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={"w-full text-left px-3 py-2 rounded-md text-[11px] transition-colors duration-100 flex items-center gap-2 " + (i === selectedIndex ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]")}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 opacity-40">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <div className="min-w-0 flex-1">
                  <div className="truncate">{highlightMatch(item.label, query)}</div>
                  {item.parentLabel && (
                    <div className="text-[9px] text-[var(--text-dim)] truncate mt-0.5">{item.parentLabel}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-[var(--border)] text-[9px] text-[var(--text-dim)] flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[8px]">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[8px]">↵</kbd>
              jump
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[8px]">esc</kbd>
              close
            </span>
          </div>
        </div>
      )}

      {isFocused && query.trim() && results.length === 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-lg bg-[var(--surface)] border border-[var(--border-bright)] shadow-xl shadow-black/40 p-4">
          <p className="text-[11px] text-[var(--text-dim)] text-center">No sections match &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}

export default function DocsContent() {
  const [activeId, setActiveId] = useState("introduction");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const handleNavigate = useCallback((id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, []);
  useEffect(() => {
    const allIds = toc.flatMap((item) => [item.id, ...(item.children?.map((c) => c.id) ?? [])]);
    const observers: IntersectionObserver[] = [];
    allIds.forEach((id) => { const el = document.getElementById(id); if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveId(id); }, { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }); o.observe(el); observers.push(o); });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative min-h-screen pt-14">
      <Sidebar activeId={activeId} onNavigate={handleNavigate} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="fixed top-14 left-0 right-0 z-30 md:hidden flex items-center gap-3 px-4 h-10 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors" aria-label="Open navigation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
        <span className="text-[11px] text-[var(--text-muted)] font-medium truncate">{toc.find((t) => t.id === activeId)?.label ?? toc.flatMap((t) => t.children ?? []).find((c) => c.id === activeId)?.label ?? "Documentation"}</span>
      </div>
      <main ref={mainRef} className="md:ml-64 md:pt-0 pt-10">
        <div className="max-w-3xl mx-auto px-6 py-12 pb-32">
          {/* Sticky Header Container */}
          <div className="sticky top-10 md:top-0 z-40 bg-[var(--background)]/90 backdrop-blur-md pt-4 pb-2 mb-6">
            {/* Back Button */}
            <a 
              href="/" 
              className="inline-flex items-center gap-2 mb-4 text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors group font-medium"
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transform transition-transform group-hover:-translate-x-0.5"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to main page
            </a>

            <SearchBar onNavigate={handleNavigate} />
          </div>
          
          {/* ... Content Sections (Introduction, Quickstart, etc.) remain completely unchanged ... */}
          <Section id="introduction" title="Introduction" number="01">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Astra is an AI-native development companion that brings agentic coding capabilities directly to your terminal. It gives an LLM full programmatic access to your filesystem, shell, and the web -- all gated behind a staging and approval system that keeps you in control at all times.</p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Built on Bun, powered by OpenRouter, and leveraging the Vercel AI SDK ToolLoopAgent for autonomous, multi-step tool-driven workflows.</p>
            <div className="grid grid-cols-2 gap-3 my-6">
              {[{l:"Package",v:"astrabot"},{l:"CLI Binary",v:"astra"},{l:"Version",v:"0.1.7"},{l:"Runtime",v:"Bun >= 1.0.0"},{l:"Language",v:"TypeScript 5"},{l:"License",v:"MIT"},{l:"LLM Provider",v:"OpenRouter"},{l:"Agent SDK",v:"Vercel AI SDK"}].map((item) => (
                <div key={item.l} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider mb-1">{item.l}</p>
                  <p className="text-xs font-medium text-[var(--foreground)]">{item.v}</p>
                </div>
              ))}
            </div>
            <Callout type="info">Astra runs on Bun, not Node.js. npm / npx are used only for package distribution. All TypeScript source is executed directly by Bun at runtime.</Callout>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">Interaction Modes at a Glance</h3>
            <Table headers={["Mode","Purpose","File Mutations"]} rows={[["Auto","LLM-powered intent router -- picks the best mode for your request","Depends on route"],["Agent","Autonomous multi-step code modifications","Yes (staged)"],["Ask","Read-only Q&A about your codebase","No (except optional save)"],["Plan","Structured multi-step planning with selective execution","Yes (staged)"],["Multi-Agent","Multiple agents working in configurable topologies","Yes (staged)"]]} />
          </Section>

          <Section id="quickstart" title="Quickstart" number="02">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Get Astra up and running in under a minute.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-2">Step 1: Install</h3>
            <CodeBlock lang="bash">npm install -g astrabot</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-2">Step 2: Configure API Keys</h3>
            <p className="text-xs text-[var(--text-muted)] mb-2">Run the interactive setup wizard. It will prompt for your OpenRouter API key, let you search and select a model (with pricing), and optionally configure Firecrawl and custom skills directories.</p>
            <CodeBlock lang="bash">astra setup</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-2">Step 3: Navigate to Your Project</h3>
            <CodeBlock lang="bash">cd /path/to/your/project</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-2">Step 4: Use It</h3>
            <CodeBlock lang="bash">{"# Interactive menu\nastra wakeup\n\n# Direct auto-router execution\nastra \"fix the bug in store.ts\"\n\n# Ask a question (read-only)\nastra \"explain how the auth system works\""}</CodeBlock>
            <Callout type="tip">You can also run Astra without installing: <IC>npx astrabot &quot;your goal here&quot;</IC></Callout>
          </Section>

          <Section id="installation" title="Installation" number="03">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Prerequisites</h3>
            <Table headers={["Requirement","Version","Purpose"]} rows={[["Bun",">= 1.0.0","JavaScript / TypeScript runtime"],["OpenRouter API key","--","LLM provider access (required)"],["Firecrawl API key","--","Web search and crawling (optional)"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">Option 1: Cross-Platform Installer (Recommended)</h3>
            <p className="text-xs text-[var(--text-muted)] mb-2">The installers automatically detect and install Node.js, Bun, and the astrabot npm package, then configure your PATH.</p>
            <CodeBlock lang="bash">{"# Linux / macOS\nbash install/install.sh\n\n# Windows\ninstall\\install.bat"}</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">Option 2: Install Globally via npm</h3>
            <CodeBlock lang="bash">{"npm install -g astrabot\nastra --version\nnpm update -g astrabot\nnpm uninstall -g astrabot"}</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">Option 3: Run Directly with npx (No Installation)</h3>
            <CodeBlock lang="bash">{"npx astrabot setup\nnpx astrabot wakeup\nnpx astrabot \"explain how this works\""}</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">Option 4: Install from Source</h3>
            <CodeBlock lang="bash">{"git clone https://github.com/OneDev-Harsh/astra-cli.git\ncd astra-cli\nbun install\nbun run index.ts setup"}</CodeBlock>
          </Section>

          <Section id="commands" title="Commands" number="04">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">Astra uses commander@^15.0.0 for CLI argument parsing. Every command is available as a subcommand of the <IC>astra</IC> binary.</p>
            <div id="cmd-astra" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2"><IC>astra [prompt...]</IC> <Badge>default</Badge></h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">The default action. With a prompt, it classifies intent via the auto-router and dispatches to the best mode. Without a prompt, it falls back to the interactive wakeup menu.</p>
              <CodeBlock lang="bash">{"astra \"fix the bug in store.ts\"\nastra"}</CodeBlock>
              <p className="text-xs text-[var(--text-muted)] mt-2">The auto-router uses fast-path regex for common patterns and falls back to an LLM classifier with temperature: 0. On classification failure, it defaults to agent mode.</p>
            </div>
            <div id="cmd-wakeup" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2"><IC>astra wakeup</IC></h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Launches the interactive menu with an animated ASCII art banner. Before showing the mode selector, it checks for interrupted sessions and offers to resume them.</p>
              <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
                <li>Renders ASCII banner using figlet with &quot;ANSI Shadow&quot; font (falls back to &quot;Standard&quot;)</li>
                <li>Banner displayed in gold (#ffd000) with version and tagline</li>
                <li>Session resume check: looks for sessions with status === &quot;interrupted&quot;</li>
                <li>Mode selection via @clack/prompts select: CLI, Exit (Telegram placeholder)</li>
              </ul>
            </div>
            <div id="cmd-setup" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2"><IC>astra setup</IC></h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Interactive configuration wizard. Prompts for all required and optional settings and saves them to ~/.astra/.env.</p>
              <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal">
                <li>OpenRouter API key input</li>
                <li>Model selection -- fetches available models from OpenRouter API with search and pricing display</li>
                <li>Optional Firecrawl API key</li>
                <li>Optional custom skills directories (semicolon-separated paths)</li>
              </ol>
              <Callout type="tip">Re-run <IC>astra setup</IC> at any time to update your configuration. Existing values are preserved and merged.</Callout>
            </div>
            <div id="cmd-sandbox" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2"><IC>astra sandbox</IC></h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Activates sandbox mode -- a secure execution environment with OS keychain credential storage and HMAC-signed server communication. Uses the fixed model openrouter/owl-alpha.</p>
              <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal">
                <li>Health check the sandbox server</li>
                <li>Generate a secure random 32-byte hex auth token</li>
                <li>Bootstrap with the server (POST /bootstrap)</li>
                <li>Validate and sanitize the returned API key</li>
                <li>Store credentials in OS keychain (or AES-256-GCM encrypted file fallback)</li>
                <li>Set ASTRA_SANDBOX_ENABLED=true</li>
              </ol>
            </div>
            <div id="cmd-play" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2"><IC>astra play</IC></h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Launches the arcade -- a game selector with 5 HTML5 Canvas mini-games. Spawns a local Bun HTTP server on port 4321 and opens your default browser.</p>
              <Table headers={["Game","File"]} rows={[["Retro Snake Classic","index.html"],["Neon Brick Breaker","neon-breaker.html"],["Neon Pong","neon-pong.html"],["Neon Memory","neon-memory.html"],["Neon Tetris","neon-tetris.html"]]} />
            </div>
            <div id="cmd-reset" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2"><IC>astra reset</IC> <Badge color="amber">destructive</Badge></h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Purges all stored configurations, sessions, and credentials from ~/.astra/. Requires explicit confirmation via interactive prompt.</p>
              <Callout type="warning">This action is irreversible. All session history, API keys, and configuration will be permanently deleted.</Callout>
            </div>
          </Section>
          <Section id="modes" title="Interaction Modes" number="05">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">Astra provides five distinct interaction modes, each designed for a different development workflow. All modes use streaming output with real-time token telemetry.</p>
            <div id="mode-auto" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Auto Mode</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">An LLM-based intent classifier that routes your request to the best mode automatically. Uses fast-path regex for common patterns before falling back to the LLM.</p>
              <Table headers={["Input Pattern","Routed To"]} rows={[['"fix the bug in store.ts"','agent'],['"explain how this app works"','ask'],['"design a new authentication system"','plan'],['"run a security audit"','multi']]} />
              <p className="text-xs text-[var(--text-muted)] mt-2">Falls back to agent on classification failure. Uses temperature: 0 for deterministic classification.</p>
            </div>
            <div id="mode-agent" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Agent Mode</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">The primary autonomous coding mode. Full tool access, multi-step file modifications, shell commands, and web research. All mutations staged and presented for approval with unified diffs. Up to 50 tool-calling steps per run.</p>
              <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal">
                <li>Goal input from user</li>
                <li>Initialize with defaultAgentConfig() (1 MB file size limit, exclude patterns, all tool permissions enabled)</li>
                <li>Begin session with workspace path, mode &quot;agent&quot;, and goal</li>
                <li>Construct ToolLoopAgent with stopWhen: stepCountIs(50)</li>
                <li>Execute via agent.stream() with per-step logging and token telemetry</li>
                <li>Auto-retry on error, with manual retry fallback</li>
                <li>Render final response as markdown in terminal</li>
                <li>Run approval flow for staged changes</li>
                <li>Apply approved changes to disk</li>
                <li>End session -- generate LLM summary, persist to disk, sync action history</li>
              </ol>
            </div>
            <div id="mode-ask" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Ask Mode</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Read-only Q&A. The agent can read files, search the codebase, and browse the web, but cannot modify files (except optionally saving the response as a .md file). Up to 25 reasoning steps.</p>
              <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
                <li>All mutation permissions disabled (allowShellExecution, allowFileModification, allowFileCreation, allowFolderCreation)</li>
                <li>12 mutation tools stripped; keeps read-only tools + web tools + session tools</li>
                <li>Answer rendered as markdown in terminal</li>
                <li>Optional save to .md file with ## Question / ## Answer headings</li>
              </ul>
            </div>
            <div id="mode-plan" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Plan Mode</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Breaks a high-level goal into a structured plan with 1-20 steps, each with complexity ratings. You select which steps to execute; each runs as an independent agent. All changes are batched for a single approval review.</p>
              <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal">
                <li>Goal input from user</li>
                <li>Plan generation via Output.object() with Zod schema (researchSummary + steps[])</li>
                <li>Display plan -- numbered steps with color-coded complexity (low=green, medium=yellow, high=red)</li>
                <li>Step selection via @clack/prompts multiselect (all pre-selected)</li>
                <li>Each selected step runs as independent ToolLoopAgent (50 steps max)</li>
                <li>Single runApprovalFlow() for all changes across all steps</li>
              </ol>
            </div>
            <div id="mode-multi" className="mb-10">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Multi-Agent Mode</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">Coordinates multiple AI agents working together. The LLM analyzes your goal and either selects a pre-built template or designs a custom agent team. Supports 5 orchestration strategies and per-agent model overrides.</p>
              <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
                <li>LLM selects from 6 pre-built workflow templates or designs a custom topology</li>
                <li>10+ validation checks before execution</li>
                <li>Each agent gets role-based tool subset and permissions</li>
                <li>Per-agent approval flow with diff viewing</li>
                <li>Real-time event handling during execution</li>
              </ul>
            </div>
          </Section>

          <Section id="tools" title="Tool System" number="06">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Astra exposes 38 typed tools to the AI agent via the Vercel AI SDK. Each tool is defined with Zod schemas for input validation. Tools are organized into 9 categories.</p>
            <Callout type="info">Tools marked as &quot;mutate&quot; are staged in an in-memory overlay and require explicit user approval before being written to disk. Read-only tools execute immediately.</Callout>
            <div id="tools-filesystem" className="mt-8 mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">File System <Badge>13 tools</Badge></h3>
              <Table headers={["Tool","Description","Mutates"]} rows={[["read_file","Read a text file from the workspace","No"],["read_multiple_files","Read multiple files in a single call","No"],["create_file","Stage creation of a new file","Yes"],["modify_file","Stage a full-file replacement","Yes"],["delete_file","Stage deletion of a file","Yes"],["create_folder","Stage creation of a directory tree (mkdir -p)","Yes"],["list_files","List files and directories under a path","No"],["search_files","Find files matching a glob pattern (e.g. *.ts)","No"],["analyze_codebase","Summarize project structure: file counts, size, extensions","No"],["grep","Search file contents using a text query","No"],["replace_in_file","Replace text inside a file while preserving the rest","Yes"],["append_to_file","Append content to the end of a file","Yes"],["insert_at_line","Insert content at a specific line number","Yes"]]} />
            </div>
            <div id="tools-shell" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Shell & Execution <Badge>7 tools</Badge></h3>
              <Table headers={["Tool","Description","Mutates"]} rows={[["run_command","Run a command synchronously and capture output","No"],["run_background_command","Start a long-running detached process","No"],["execute_shell","Queue a shell command for post-approval execution","Yes"],["run_tests","Auto-detect and run the project test suite","No"],["run_test_file","Run a specific test file","No"],["lint_project","Auto-detect and run linting","No"],["format_project","Auto-detect and run formatting","No"]]} />
            </div>
            <div id="tools-git" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Git <Badge>3 tools</Badge></h3>
              <Table headers={["Tool","Description"]} rows={[["git_status","Get git status --short"],["git_diff","Get git diff (optionally staged)"],["git_log","Get recent commits (--oneline)"]]} />
            </div>
            <div id="tools-project" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Project Intelligence <Badge>2 tools</Badge></h3>
              <Table headers={["Tool","Description"]} rows={[["detect_framework","Detect framework from package.json"],["read_package_json","Read and summarize package.json"]]} />
            </div>
            <div id="tools-web" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Web <Badge>3 tools</Badge></h3>
              <Table headers={["Tool","Description","Requires"]} rows={[["web_search","Search the web, returns title/url/snippet list","Firecrawl key (or DuckDuckGo fallback)"],["web_crawl","Scrape a URL into markdown text","Firecrawl key"],["fetch_url","HTTP GET for a URL, returns response body","--"]]} />
            </div>
            <div id="tools-planning" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Planning <Badge>2 tools</Badge></h3>
              <Table headers={["Tool","Description"]} rows={[["create_plan","Create a task execution plan object in memory"],["get_plan","Retrieve the current plan as JSON"]]} />
            </div>
            <div id="tools-staging" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Staging <Badge>2 tools</Badge></h3>
              <Table headers={["Tool","Description"]} rows={[["show_pending_changes","Display all staged operations (read-only)"],["discard_changes","Discard all staged operations from the overlay"]]} />
            </div>
            <div id="tools-skills" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Skills <Badge>2 tools</Badge></h3>
              <Table headers={["Tool","Description"]} rows={[["list_skills","List SKILL.md files from configured skill directories"],["read_skill","Read a specific SKILL.md file"]]} />
            </div>
            <div id="tools-session" className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Session <Badge>3 tools</Badge></h3>
              <Table headers={["Tool","Description"]} rows={[["session_status","Check recent session history (limit 1-20, default 5)"],["session_search","Search previous sessions by keyword, file name, or goal"],["session_resume_context","Get full context of a previous session for resumption"]]} />
            </div>
          </Section>
          <Section id="staging" title="Staging & Approval Pipeline" number="07">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">No mutation ever touches disk without explicit user consent. Astra uses a three-phase pipeline to ensure complete safety.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Phase 1: Staging</h3>
            <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal mb-4">
              <li><strong>Path safety validation</strong> -- must be within workspace root</li>
              <li><strong>Exclude pattern check</strong> -- node_modules, .git, dist, build, .next, *.log, .env* are blocked</li>
              <li><strong>File size check</strong> -- max 1 MB for reads</li>
              <li><strong>Stage in memory overlay</strong> -- Map&lt;string, string&gt; + Set&lt;string&gt;</li>
              <li><strong>Log to ActionTracker</strong> -- append-only audit trail with status: &quot;pending&quot;</li>
            </ol>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Phase 2: Approval Flow</h3>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>&quot;Approve and apply all&quot;</strong> -- marks all pending actions as &quot;approved&quot;</li>
              <li><strong>&quot;Review one by one&quot;</strong> -- groups by file path, iterates with accept / reject / diff options</li>
              <li><strong>&quot;Cancel&quot;</strong> -- marks all as &quot;rejected&quot;</li>
            </ul>
            <p className="text-xs text-[var(--text-muted)] mb-3">Diffs use unified format with 3 lines of context. Large diffs are truncated (120-line limit). Multiple actions on the same path are composed into a single before/after diff.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Phase 3: Application</h3>
            <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal mb-4">
              <li>Folder creation first (sorted by timestamp)</li>
              <li>File operations sorted by timestamp, grouped by path -- only the last action per path is applied</li>
              <li>Shell commands executed via spawnSync with 16 MB buffer and 5-minute timeout</li>
              <li>appliedActionIds set prevents double-application</li>
              <li>Successfully applied actions are recorded to the persistent ActionHistoryManager in real-time</li>
            </ol>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Staging Overlay Internals</h3>
            <CodeBlock lang="typescript">{"private overlay = new Map<string, string>()  // staged file contents\nprivate deleted = new Set<string>()          // staged deletions\nprivate appliedActionIds = new Set<string>() // already-applied action IDs"}</CodeBlock>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mt-2">
              <li>createFile() -- removes from deleted, adds to overlay</li>
              <li>modifyFile() -- adds to overlay (reads &quot;before&quot; from overlay or disk)</li>
              <li>deleteFile() -- removes from overlay, adds to deleted</li>
              <li>getEffectiveText() -- checks deleted then overlay then disk</li>
              <li>discardStagedPath() -- removes from both overlay and deleted</li>
            </ul>
          </Section>

          <Section id="action-tracking" title="Action Tracking System" number="08">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">An append-only log of every action the agent takes. Stored in ActionTracker and persisted to the session store.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">Action Types</h3>
            <Table headers={["Type","Description"]} rows={[["file_create","A new file was staged"],["file_modify","An existing file was staged for replacement"],["file_delete","A file was staged for deletion"],["folder_create","A directory tree was staged for creation"],["code_analysis","A read-only analysis was performed (marked 'executed' immediately)"],["tool_execute","A shell command or web tool was invoked"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Action Status</h3>
            <Table headers={["Status","Meaning"]} rows={[["pending","Staged but not yet approved or rejected"],["executed","Read-only action completed immediately"],["approved","User approved the action for application"],["rejected","User rejected the action"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">ActionLog Schema</h3>
            <CodeBlock lang="typescript">{"interface ActionLog {\n  id: string              // \"action_0\", \"action_1\", ...\n  timestamp: Date\n  type: ActionType\n  path: string            // file path or \"shell\" or \"skills\" or \"web\"\n  details: {\n    before?: string; after?: string; toolName?: string\n    toolResult?: string; error?: string; command?: string\n  }\n  status: ActionStatus\n  userApproved?: boolean\n}"}</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Tracker Methods</h3>
            <Table headers={["Method","Description"]} rows={[["log(entry)","Append a new action, auto-assigns ID and timestamp"],["getActions()","Returns the full readonly array of all actions"],["getPendingMutations()","Filters to mutation-type actions with status 'pending'"],["getPendingMutationsForPath(path)","Filters pending mutations to a specific path"],["updateStatus(id, status, userApproved?)","Updates an action's status"]]} />
          </Section>

          <Section id="sessions" title="Session Management" number="09">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Sessions are persisted to disk with LLM-generated summaries. Astra supports auto-resume on interruption and cross-session action history.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">Storage</h3>
            <p className="text-xs text-[var(--text-muted)] mb-2">Sessions are stored in ~/.astra/sessions/index.json with atomic writes (temp file + rename).</p>
            <CodeBlock lang="typescript">{"interface SessionStoreIndex {\n  version: number          // currently 2\n  sessions: SessionEntry[]\n  maxSessions: number      // 100\n}"}</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Session Entry Schema</h3>
            <CodeBlock lang="typescript">{"interface SessionEntry {\n  id: string               // \"sess_m5k2x3_abc123\"\n  workspacePath: string\n  mode: 'agent' | 'ask' | 'plan' | 'multi' | 'auto'\n  status: 'active' | 'completed' | 'interrupted'\n  summary: string          // LLM-generated\n  lastGoal: string\n  allGoals: string[]\n  touchedFiles: string[]\n  appliedActions: number\n  rejectedActions: number\n  createdAt: string\n  updatedAt: string\n  previousSessionId?: string\n  transcript?: TranscriptMessage[]  // capped at 60\n  pendingTasks?: string[]\n  lastAgentResponse?: string  // truncated to 2000 chars\n}"}</CodeBlock>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Cache Layer</h3>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li>Reads served from memory (no file I/O) when clean</li>
              <li>Writes batched with 500 ms debounce</li>
              <li>LRU entry cache (50 entries) for O(1) lookups by session ID</li>
              <li>flushSync() for critical shutdown paths</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Session Lifecycle</h3>
            <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal">
              <li><strong>Begin</strong> -- creates entry with status: &quot;active&quot;; loads prior context if resuming</li>
              <li><strong>Active</strong> -- agent performs work, actions accumulate</li>
              <li><strong>End</strong> -- collects touched files, counts actions, generates LLM summary, sets status: &quot;completed&quot;, syncs to action history</li>
              <li><strong>Interrupt</strong> -- sets status: &quot;interrupted&quot;, all state preserved</li>
              <li><strong>Resume</strong> -- on wakeup, interrupted sessions offered for resumption</li>
            </ol>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Resume Priority (3-tier)</h3>
            <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal">
              <li>Explicit session ID (via session tools)</li>
              <li>Interrupted session in the same workspace</li>
              <li>Keyword overlap &gt;= 30% between current goal and previous goals</li>
            </ol>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Session Search (Relevance Scoring)</h3>
            <Table headers={["Field","Weight"]} rows={[["lastGoal","50"],["summary","30"],["tags","25"],["touchedFiles","8"],["recency bonus","variable"]]} />
          </Section>

          <Section id="action-history" title="Persistent Action History" number="10">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">New in v0.1.7. All approved actions are logged to a persistent global JSONL file, queryable across sessions.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">ActionHistoryManager</h3>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>Log file:</strong> ~/.astra/history/actions.jsonl (JSON Lines, append-only)</li>
              <li><strong>Entry format:</strong> PersistentActionEntry with globalActionId (UUID), sessionId, workspacePath, timestamp, and the full ActionLog record</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">API</h3>
            <Table headers={["Method","Description"]} rows={[["recordGlobalActions(sessionId, workspacePath, actions)","Appends approved/applied actions with UUIDs; uses atomic Bun writes"],["getGlobalHistory(limit?)","Retrieves recent actions across all sessions (newest first, default 500)"],["searchHistoryByFile(targetPath)","Finds all historical actions targeting a specific file path"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Integration Points</h3>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li>applyApprovedFromTracker() in tool-executor.ts -- records successfully applied actions in real-time</li>
              <li>endSession() in session-manager.ts -- syncs all approved actions on session completion</li>
              <li>endMultiSession() in session-manager.ts -- syncs aggregated multi-agent approved actions</li>
            </ul>
          </Section>
          <Section id="multi-agent" title="Multi-Agent Orchestration" number="11">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">Coordinates multiple AI agents working together in configurable topologies. The LLM analyzes your goal and either selects a pre-built template or designs a custom agent team.</p>
            <div id="ma-roles" className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Agent Roles</h3>
              <Table headers={["Role","Permissions","Max Steps","Tools"]} rows={[["researcher","Read-only","30","16"],["implementer","Full read/write/execute","50","26"],["reviewer","Read + execute (no writes)","25","15"],["coordinator","Read-only + planning","20","8"],["custom","Configurable","30","Variable"]]} />
            </div>
            <div id="ma-strategies" className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Orchestration Strategies</h3>
              <Table headers={["Strategy","Behavior","Failure Mode"]} rows={[["Sequential","Agents run one after another; each sees previous outputs","fail-fast"],["Parallel","Agents run in batches of maxConcurrentAgents (default 3) via Promise.all()","continue"],["Hierarchical","Coordinator runs first, then specialists with coordinator's plan","fail-fast"],["Collaborative","Round-robin turns; output broadcast via MessageBroker","continue"],["DAG","Agents run when dependencies are satisfied; cycle detection and deadlock handling","fail-at-end"]]} />
            </div>
            <div id="ma-templates" className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Workflow Templates</h3>
              <Table headers={["Template","Agents","Strategy"]} rows={[["Code Review","Researcher -> Implementer -> Reviewer","Sequential (retry x1)"],["Feature Development","Coordinator -> Backend + Frontend -> QA","DAG"],["Bug Fixing","Debug -> Fix -> Test","Sequential (retry x2)"],["Collaborative Research","Researcher 1 + 2 + 3","Parallel (3 concurrent, 45s timeout)"],["Security Audit","Scanner -> Static + Dependency Auditor -> Report","DAG"],["Full-Stack Feature","Architect -> DB + API + UI Dev -> Integration Tester","DAG"]]} />
            </div>
            <div id="ma-broker" className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Message Broker</h3>
              <Table headers={["Method","Description"]} rows={[["broadcast(msg)","Send to specific agent or all"],["subscribe(agentId, callback)","Register callback; returns unsubscribe function"],["getMessagesFor(agentId)","Filter messages (direct or broadcast)"],["replayMessages(agentId, callback)","Async iteration over message history"]]} />
            </div>
            <div id="ma-validation" className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Validation Checks (10+)</h3>
              <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
                <li>Workflow ID and goal present; at least one agent, no duplicate IDs, no empty names</li>
                <li>maxSteps &gt; 0, at least 1 tool per agent; valid strategy type</li>
                <li>Hierarchical requires a coordinator; collaborative with &gt;1 agent needs a timeout</li>
                <li>Fallback agent IDs exist; dependency references valid, no self-references</li>
                <li>DAG cycle detection; warning if DAG strategy used without dependencies</li>
              </ul>
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Fluent Workflow Builder API</h3>
            <CodeBlock lang="typescript">{"new WorkflowBuilder(id, goal)\n  .addResearcher(...)\n  .addImplementer(...)\n  .addReviewer(...)\n  .withDagStrategy(maxConcurrent, timeout)\n  .withRetryOnFailure(maxRetries)\n  .build()"}</CodeBlock>
          </Section>

          <Section id="sandbox" title="Sandbox Mode & Security" number="12">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">A secure, self-contained execution environment activated via astra sandbox.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">Security Principles</h3>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>No secrets in config files</strong> -- API keys never touch ~/.astra/.env</li>
              <li><strong>OS keychain storage</strong> -- macOS Keychain, Windows Credential Vault, Linux Secret Service (via keytar)</li>
              <li><strong>AES-256-GCM file fallback</strong> -- encrypted file at ~/.astra/.secure/sandbox.enc (key from machine-id via scrypt, 0o600 perms, atomic writes)</li>
              <li><strong>HMAC-SHA-256 signed requests</strong> -- with timestamps for replay protection</li>
              <li><strong>Fixed model</strong> -- openrouter/owl-alpha (isolated from user config)</li>
              <li><strong>Remote server</strong> -- https://astra-server-oh6s.onrender.com</li>
              <li><strong>5-minute in-memory key TTL</strong> with validation (sk-or-v1-* format)</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Activation Flow</h3>
            <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal mb-4">
              <li>Health check the sandbox server (GET /health)</li>
              <li>Generate secure random 32-byte hex auth token</li>
              <li>Bootstrap with server (POST /bootstrap with authToken)</li>
              <li>Validate and sanitize returned API key</li>
              <li>Store 3 credentials: sandbox-api-key, sandbox-auth-token, sandbox-signing-secret</li>
              <li>Set ASTRA_SANDBOX_ENABLED=true</li>
            </ol>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Subsequent AI Calls</h3>
            <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal">
              <li>getSandboxApiKey() checks keychain</li>
              <li>Check in-memory cache (5-min TTL)</li>
              <li>Fetch from server (GET /api/key, HMAC-signed)</li>
              <li>Validate, cache, and store; use key for OpenRouter API calls with owl-alpha model</li>
            </ol>
          </Section>

          <Section id="skills-system" title="Skills System" number="13">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Skills are SKILL.md files providing structured guidance to the AI agent. Discoverable by agents via list_skills and read_skill tools.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">Skill Directories (in order)</h3>
            <ol className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-decimal mb-4">
              <li><strong>Built-in:</strong> .skills/ (shipped with the package)</li>
              <li><strong>Cursor:</strong> ~/.cursor/skills-cursor/</li>
              <li><strong>Claude:</strong> ~/.claude/skills/</li>
              <li><strong>Custom:</strong> SKILLS_DIRS env var (semicolon-separated paths)</li>
            </ol>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Built-in Skills</h3>
            <Table headers={["Skill","Purpose"]} rows={[["code-review","Code review checklist (quality, error handling, security, performance, testing)"],["documentation","Documentation standards for README, CHANGELOG, and TSDoc comments"],["git-workflow","Branch naming conventions, conventional commits, pre-commit checklist"],["project-setup","Development environment setup guide"],["test-runner","Test execution patterns and result interpretation"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Skill File Format</h3>
            <CodeBlock lang="markdown">{"---\nname: skill-name\ndescription: When to use this skill\n---\n\n# Skill Title\n\nInstructions for the agent..."}</CodeBlock>
          </Section>

          <Section id="retry" title="Retry Engine" number="14">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Configurable retry logic for AI provider calls and multi-agent step failures, with exponential backoff and jitter.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">Error Categories</h3>
            <Table headers={["Category","HTTP / Code","Retryable","Suggested Delay"]} rows={[["TRANSIENT","500, 502, 504","Yes","1s"],["RATE_LIMIT","429","Yes","5s"],["NETWORK","ECONNRESET, ENOTFOUND","Yes","2s"],["TIMEOUT","ETIMEDOUT","Yes","3s"],["UNKNOWN","unclassified","Yes","1s"],["PERMANENT","4xx (except 429)","No","0"],["AUTH","401, 403","No","0"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Retry Presets</h3>
            <Table headers={["Preset","Retries","Base Delay","Max Delay","Backoff","Jitter"]} rows={[["aiCall","3","1s","30s","2x","1s"],["toolExecution","2","500ms","5s","2x","0"],["network","5","2s","60s","2x","2s"],["critical","5","1s","60s","2x","1.5s"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Features</h3>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li>Exponential backoff with configurable multiplier</li>
              <li>Random jitter to prevent thundering herd</li>
              <li>Per-attempt timeouts; onRetry and onExhausted callbacks</li>
              <li>withRetryOrNull() for non-throwing variants</li>
              <li>createRetryWrapper() for reusable retry-wrapped functions</li>
            </ul>
          </Section>
          <Section id="configuration" title="Configuration" number="15">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Astra is configured entirely through environment variables, loaded from ~/.astra/.env. Run astra setup for the interactive wizard.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-4 mb-3">Required Variables</h3>
            <Table headers={["Variable","Description","Example"]} rows={[["OPENROUTER_API_KEY","OpenRouter API key for LLM access","sk-or-v1-abc123..."],["OPENROUTER_DEFAULT_MODEL","Default model identifier","anthropic/claude-3.5-sonnet"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Optional Variables</h3>
            <Table headers={["Variable","Description","Example"]} rows={[["FIRECRAWL_API_KEY","Enables web_search, web_crawl, fetch_url via Firecrawl","fc-abc123..."],["SKILLS_DIRS","Semicolon-separated paths to custom skill directories","/path/to/skills;/another/dir"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Retry Configuration</h3>
            <Table headers={["Variable","Default","Description"]} rows={[["ASTRA_AGENT_RETRY_ENABLED","true","Enable automatic retry for agent AI calls"],["ASTRA_AGENT_RETRY_MAX","3","Maximum retry attempts for agent calls"],["ASTRA_AGENT_RETRY_PROGRESS","true","Show retry progress in the terminal"],["ASTRA_MULTI_RETRY_ENABLED","true","Enable retry for multi-agent steps"],["ASTRA_MULTI_RETRY_MAX","2","Maximum retry attempts for multi-agent steps"],["ASTRA_MULTI_RETRY_BACKOFF","2","Backoff multiplier for multi-agent retries"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Sandbox Variable</h3>
            <Table headers={["Variable","Description"]} rows={[["ASTRA_SANDBOX_ENABLED","Set to 'true' when sandbox mode is active. API key stored in OS keychain, not in ~/.astra/.env."]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">File Locations</h3>
            <Table headers={["Path","Purpose"]} rows={[["~/.astra/.env","Environment variables (API keys, model, settings)"],["~/.astra/sessions/index.json","Session store (persisted conversation history)"],["~/.astra/sessions/<session-id>.json","Individual session action logs"],["~/.astra/.secure/sandbox.enc","Encrypted sandbox credentials (if OS keychain unavailable)"],["~/.astra/logs/astra.log","Rotating error log file (5 MiB max, 3 backups)"],["~/.astra/history/actions.jsonl","Persistent action history log (JSONL, all approved actions across sessions)"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">TypeScript Configuration</h3>
            <Table headers={["Option","Value"]} rows={[["target","ESNext"],["module","Preserve (Bun-native resolution)"],["moduleResolution","bundler"],["strict","true"],["types","bun"],["noFallthroughCasesInSwitch","true"],["noUncheckedIndexedAccess","true"],["noImplicitOverride","true"],["noUnusedLocals","false"],["noUnusedParameters","false"]]} />
          </Section>

          <Section id="project-structure" title="Project Structure" number="16">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">Every file in the Astra codebase and its purpose.</p>
            <CodeBlock>{"astrabot/\n+-- index.ts                        # CLI entry point (Commander)\n+-- package.json                    # Package config (astrabot v0.1.7)\n+-- tsconfig.json                   # TypeScript config: ESNext, strict, Bun types\n+-- bun.lock                        # Bun lockfile\n+-- bin/astra                       # Binary entry point (#!/usr/bin/env bun)\n+-- install/                        # Cross-platform installer scripts\n|   +-- install.sh                  # Linux/macOS\n|   +-- install.bat                 # Windows\n+-- ai/                             # AI provider configuration\n|   +-- ai.config.ts                # OpenRouter provider setup + model cache\n|   +-- config-loader.ts            # ~/.astra/.env management\n|   +-- auto-retry.ts               # AI call retry wrapper\n|   +-- sandbox-config.ts           # Sandbox activation + HMAC signing\n|   +-- secure-storage.ts           # Encrypted credential storage\n+-- core/                           # Core utilities\n|   +-- logger.ts                   # Centralised error logger (rotating file)\n|   +-- retry/                      # Retry engine\n|       +-- retry-config.ts         # ErrorCategory, RetryConfig, presets\n|       +-- retry-engine.ts         # withRetry(), RetryPresets\n|       +-- error-classifier.ts     # Error classification\n+-- tui/                            # Terminal UI\n|   +-- terminal-md.ts              # Markdown-to-terminal rendering\n|   +-- spinner.ts                  # Animated spinner (metabolic rate engine)\n|   +-- wakeup.ts                   # ASCII banner + mode selection\n+-- modes/                          # Interaction modes\n|   +-- cli.ts                      # CLI mode loop\n|   +-- auto.ts                     # Auto mode (intent classifier)\n|   +-- setup.ts                    # Setup wizard\n|   +-- agent/                      # Agent mode\n|   |   +-- types.ts                # ActionType, ActionLog, AgentConfig\n|   |   +-- action-tracker.ts       # Append-only action log\n|   |   +-- agent-tools.ts          # 38 Vercel AI SDK tools\n|   |   +-- tool-executor.ts        # Staging overlay + implementations\n|   |   +-- diff-view.ts            # Unified diff generation\n|   |   +-- approval.ts             # Approval flow\n|   |   +-- orchestrator.ts         # Full agent lifecycle\n|   +-- ask/orchestrator.ts         # Read-only Q&A\n|   +-- plan/                       # Plan mode\n|   |   +-- planner.ts              # LLM-structured planning\n|   |   +-- orchestrator.ts         # Plan -> select -> execute -> approve\n|   +-- multi/                      # Multi-agent mode\n|       +-- multi-agent-orchestrator.ts  # Strategy dispatch\n|       +-- workflow-builder.ts     # Fluent API + templates\n|       +-- orchestrator.ts         # AI workflow designer + execution\n+-- session/                        # Session management\n|   +-- store.ts                    # JSON file store (atomic writes)\n|   +-- session-manager.ts          # Lifecycle & auto-resume\n|   +-- session-cache.ts            # In-memory cache (debounced writes)\n|   +-- action-history.ts           # Persistent cross-session action log\n+-- .skills/                        # Built-in skills (5 SKILL.md files)\n+-- game/                           # Arcade (5 HTML5 Canvas games)\n+-- tests/cli.test.ts               # CLI smoke tests\n+-- .github/workflows/ci.yml        # Bun install + test"}</CodeBlock>
          </Section>

          <Section id="dependencies" title="Dependencies" number="17">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Runtime</h3>
            <Table headers={["Package","Version","Purpose"]} rows={[["@openrouter/ai-sdk-provider","^2.9.0","OpenRouter LLM provider"],["@clack/prompts","^1.4.0","Interactive terminal prompts"],["@clack/core","^1.3.1","Core prompt primitives"],["@mendable/firecrawl-js","^4.25.1","Firecrawl SDK for web search/crawl"],["commander","^15.0.0","CLI argument parsing"],["chalk","^5.6.2","Terminal string styling"],["figlet","^1.11.0","ASCII art banner"],["marked","^18.0.4","Markdown parser"],["marked-terminal","^7.3.0","Markdown terminal renderer"],["diff","^9.0.0","Unified diff generation"],["dotenv","^17.4.2",".env file loading"],["docx","^9.7.1","Word document generation"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Dev</h3>
            <Table headers={["Package","Version","Purpose"]} rows={[["@types/bun","latest","Bun type definitions"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Peer</h3>
            <Table headers={["Package","Version","Purpose"]} rows={[["typescript","^5","TypeScript compiler"]]} />
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-6 mb-3">Optional</h3>
            <Table headers={["Package","Purpose"]} rows={[["keytar","OS keychain access for sandbox credentials"]]} />
          </Section>

          <Section id="changelog" title="Changelog" number="18">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">All notable changes to Astra. Format based on keepachangelog.com, adhering to semver.org.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">v0.1.7 <Badge color="amber">unreleased</Badge></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Added</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>Persistent action history</strong> -- New ActionHistoryManager logs all approved/applied actions to ~/.astra/history/actions.jsonl with UUIDs, session IDs, and timestamps.</li>
              <li><strong>Cross-session action queries</strong> -- getGlobalHistory() and searchHistoryByFile() for querying across sessions.</li>
              <li><strong>Automatic history sync</strong> -- on session end and on apply.</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">v0.1.6 <span className="text-[10px] text-[var(--text-dim)] font-normal">2026-07-04</span></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Added</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>Streaming output</strong> for Agent, Ask, and Plan modes via agent.stream().</li>
              <li><strong>OpenRouter prompt caching</strong> with X-OpenRouter-Cache header and sticky session routing.</li>
              <li><strong>Session-aware model cache</strong> with sessionId in cache key.</li>
              <li><strong>Neon Memory & Neon Tetris</strong> arcade games.</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">v0.1.5 <span className="text-[10px] text-[var(--text-dim)] font-normal">2026-07-03</span></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Changed</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li><strong>Sandbox server migrated to remote</strong> -- URL changed to https://astra-server-oh6s.onrender.com.</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">v0.1.4 <span className="text-[10px] text-[var(--text-dim)] font-normal">2026-07-02</span></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Removed</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li><strong>Bundled server</strong> -- The server/ directory was removed.</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">v0.1.3 <span className="text-[10px] text-[var(--text-dim)] font-normal">2026-07-01</span></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Added</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>Sandbox mode</strong> -- astra sandbox with OS keychain, AES-256-GCM fallback, HMAC signing.</li>
              <li><strong>Session store cache</strong> -- 500ms debounced writes, LRU cache.</li>
              <li><strong>Cross-platform installers</strong> -- install.sh and install.bat.</li>
              <li><strong>Skills system</strong> -- 5 built-in skills as SKILL.md files.</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">v0.1.2 <span className="text-[10px] text-[var(--text-dim)] font-normal">2026-06-08</span></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Added</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>Streaming agent output</strong> -- All modes migrated to agent.stream().</li>
              <li><strong>Token telemetry</strong> -- Live counters with velocity summary (tok/s).</li>
              <li><strong>Detailed step logging</strong> -- Per-step duration and token counts.</li>
              <li><strong>Neon Pong</strong> arcade game.</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">v0.1.1 <span className="text-[10px] text-[var(--text-dim)] font-normal">2026-06-07</span></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Added</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li><strong>Dynamic version in banner</strong> from package.json.</li>
              <li><strong>npm binary entry point</strong> -- bin/astra shebang file.</li>
              <li><strong>CI pipeline</strong> -- GitHub Actions workflow.</li>
              <li><strong>CLI smoke tests</strong> for --version, --help, and command listing.</li>
            </ul>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Changed</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li><strong>Package rename</strong> from astra to astrabot (npm availability).</li>
              <li><strong>Build simplification</strong> -- Removed tsc compile step; Bun executes TypeScript directly.</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mt-8 mb-3">v0.1.0 <span className="text-[10px] text-[var(--text-dim)] font-normal">2026-06-06</span></h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Added</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li><strong>Five interaction modes</strong> -- Auto, Agent, Ask, Plan, Multi-Agent.</li>
              <li><strong>38 agent tools</strong> -- filesystem, shell, git, web, project intelligence, staging, skills, session.</li>
              <li><strong>Staging & approval pipeline</strong> -- in-memory overlay with per-file diff review.</li>
              <li><strong>Session management</strong> -- persistent sessions with auto-resume and cache.</li>
              <li><strong>Multi-agent orchestration</strong> -- 5 strategies, 5 roles, 6 templates, fluent builder.</li>
              <li><strong>Retry system</strong> -- 7 error categories, 4 presets, exponential backoff.</li>
              <li><strong>Sandbox mode foundation</strong> -- OS keychain credential storage.</li>
              <li><strong>Arcade</strong> -- Retro Snake and Neon Brick Breaker with local HTTP server.</li>
              <li><strong>astra play and astra reset commands</strong>.</li>
              <li><strong>Breathing banner animation</strong> with twinkling star field.</li>
              <li><strong>Animated spinner</strong> with metabolic rate engine.</li>
              <li><strong>Setup wizard</strong> for interactive configuration.</li>
              <li><strong>Centralised error logger</strong> with rotating file output.</li>
            </ul>
          </Section>

          <Section id="roadmap" title="Roadmap" number="19">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">Planned and in-progress features for future Astra releases.</p>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Implemented</h3>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-6">
              <li>Streaming token output with real-time telemetry</li>
              <li>Direct prompt argument (astra &quot;goal&quot;)</li>
              <li>Sandbox mode with secure credential storage</li>
              <li>Session store cache with debounced writes</li>
              <li>Cross-platform installers</li>
              <li>Skills system (5 built-in skills)</li>
              <li>Centralised error logger with rotating file output</li>
              <li>Sandbox remote server migration</li>
              <li>Persistent action history (cross-session JSONL log)</li>
            </ul>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Planned</h3>
            <h4 className="text-xs font-semibold text-[var(--foreground)] mt-4 mb-2">P0 -- Critical</h4>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li>Undo/redo support via action log replay</li>
              <li>Multi-provider support</li>
              <li>Context window management</li>
            </ul>
            <h4 className="text-xs font-semibold text-[var(--foreground)] mt-4 mb-2">P1 -- Major</h4>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li>Per-mode model selection</li>
              <li>Project-level config (.astrarcc)</li>
              <li>MCP (Model Context Protocol) support</li>
              <li>Diff-based editing</li>
            </ul>
            <h4 className="text-xs font-semibold text-[var(--foreground)] mt-4 mb-2">P2 -- Quality of Life</h4>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc mb-4">
              <li>astra watch (file watching mode)</li>
              <li>Pipe/stdin support</li>
              <li>Cost tracking</li>
              <li>Plugin system</li>
            </ul>
            <h4 className="text-xs font-semibold text-[var(--foreground)] mt-4 mb-2">P3 -- Future</h4>
            <ul className="text-xs text-[var(--text-muted)] space-y-1 ml-4 list-disc">
              <li>Telegram mode</li>
              <li>REPL mode</li>
              <li>Multimodal input</li>
              <li>LSP integration</li>
            </ul>
          </Section>

          <div className="h-20" />
        </div>
      </main>
    </div>
  );
}