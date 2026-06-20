"use client";

import { useEffect, useRef, useState } from "react";
import LedBorder from "./LedBorder";

const features = [
  {
    title: "Five Interaction Modes",
    description: "Auto, Agent, Ask, Plan, and Multi-Agent — each tailored for a different workflow. The auto-router picks the best mode for your request.",
    color: "#a78bfa",
  },
  {
    title: "38+ Agent Tools",
    description: "Filesystem, shell, git, web research, project intelligence, staging, skills, and session management — all exposed as typed tools.",
    color: "#67e8f9",
  },
  {
    title: "Staging-First Mutations",
    description: "No file is ever written without your explicit approval. Every mutation is staged in memory and presented with unified diffs.",
    color: "#34d399",
  },
  {
    title: "Multi-Agent Orchestration",
    description: "Coordinate multiple AI agents with 5 strategies: Sequential, Parallel, Hierarchical, Collaborative, and DAG.",
    color: "#fbbf24",
  },
  {
    title: "Streaming Output",
    description: "Real-time text generation with live token telemetry. Watch the agent work with input/output counters and tok/s velocity.",
    color: "#f472b6",
  },
  {
    title: "Persistent Sessions",
    description: "Sessions saved to disk with LLM-generated summaries. Auto-resume on interruption with 3-tier resume priority.",
    color: "#fb923c",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <LedBorder className="h-full rounded-lg">
        <div className="p-5 h-full bg-[var(--surface)]/60 backdrop-blur-sm rounded-lg hover:bg-[var(--surface-raised)]/60 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: feature.color }}
            />
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {feature.title}
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {feature.description}
          </p>
        </div>
      </LedBorder>
    </div>
  );
}

export default function FeaturesSection() {
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
    <section id="features" ref={ref} className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          className={`mb-12 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[var(--text-dim)]">01</span>
            <div className="h-px w-8 bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Features</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Everything for <span className="text-[var(--accent)]">Agentic Coding</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
