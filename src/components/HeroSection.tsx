"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import LedGrid from "./LedGrid";

const terminalLines = [
  { prompt: "$", text: "npm install -g astrabot", dim: false, accent: false, cursor: false },
  { prompt: "", text: "added 1 package in 1.2s", dim: true, accent: false, cursor: false },
  { prompt: "$", text: "astra setup", dim: false, accent: false, cursor: false },
  { prompt: "", text: "OpenRouter API key configured.", dim: true, accent: false, cursor: false },
  { prompt: "$", text: "astra wakeup", dim: false, accent: false, cursor: false },
  { prompt: "", text: "", dim: true, accent: false, cursor: false },
  { prompt: "", text: "  [ASTRA] session initialized", dim: false, accent: true, cursor: false },
  { prompt: "", text: "  [ASTRA] 5 modes loaded", dim: false, accent: true, cursor: false },
  { prompt: "", text: "  [ASTRA] 38 tools registered", dim: false, accent: true, cursor: false },
  { prompt: "", text: "  [ASTRA] ready.", dim: false, accent: true, cursor: false },
  { prompt: "", text: "", dim: true, accent: false, cursor: false },
  { prompt: ">", text: "", dim: false, accent: false, cursor: true },
];

const quickSteps = [
  { num: "01", label: "Install", cmd: "npm install -g astrabot" },
  { num: "02", label: "Configure", cmd: "astra setup" },
  { num: "03", label: "Run", cmd: "astra wakeup" },
];

function interpolate(
  progress: number,
  start: number,
  end: number,
  startVal: number,
  endVal: number
): number {
  if (progress <= start) return startVal;
  if (progress >= end) return endVal;
  const ratio = (progress - start) / (end - start);
  return startVal + ratio * (endVal - startVal);
}

export default function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [frame0Loaded, setFrame0Loaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);

  const totalFrames = 121;

  const getFramePath = (index: number) => {
    const pad = String(index).padStart(5, "0");
    return `/frames/frame_${pad}.png`;
  };

  const getNearestLoadedImage = useCallback((targetIndex: number): HTMLImageElement | null => {
    if (imagesRef.current[targetIndex]) return imagesRef.current[targetIndex];

    // Search outwards from targetIndex to find the closest loaded frame
    let step = 1;
    while (targetIndex - step >= 0 || targetIndex + step < totalFrames) {
      if (targetIndex - step >= 0 && imagesRef.current[targetIndex - step]) {
        return imagesRef.current[targetIndex - step];
      }
      if (targetIndex + step < totalFrames && imagesRef.current[targetIndex + step]) {
        return imagesRef.current[targetIndex + step];
      }
      step++;
    }
    return null;
  }, [totalFrames]);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = getNearestLoadedImage(frameIndex);
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const targetWidth = rect.width * dpr;
    const targetHeight = rect.height * dpr;

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [getNearestLoadedImage]);

  const resizeCanvas = useCallback(() => {
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Preloading image logic
  useEffect(() => {
    // Load frame 0 first for instant paint
    const img0 = new Image();
    img0.src = getFramePath(0);
    img0.onload = () => {
      imagesRef.current[0] = img0;
      setFrame0Loaded(true);
      setLoadedCount(prev => prev + 1);
      drawFrame(0);

      // Preload remaining frames
      for (let i = 1; i < totalFrames; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        const index = i;
        img.onload = () => {
          imagesRef.current[index] = img;
          setLoadedCount(prev => prev + 1);
          // Force redraw current frame as new image loads
          drawFrame(currentFrameRef.current);
        };
        img.onerror = () => {
          console.error(`Failed to load frame ${index}`);
        };
      }
    };
  }, [drawFrame, totalFrames]);

  // Scroll tracking and resize
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight));

      setScrollProgress(progress);

      const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawFrame, resizeCanvas, totalFrames]);

  const scrollToInstall = useCallback(() => {
    const el = document.getElementById("install");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToUsage = useCallback(() => {
    const el = document.getElementById("usage");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Compute terminal lines to show character-by-character
  const getTypedLines = useCallback(() => {
    const lines = [];
    const startTyping = 0.28;
    const endTyping = 0.5;
    const totalLines = terminalLines.length;

    for (let i = 0; i < totalLines; i++) {
      const lineStart = startTyping + (i / totalLines) * (endTyping - startTyping);
      const lineEnd = startTyping + ((i + 1) / totalLines) * (endTyping - startTyping);

      if (scrollProgress >= lineStart) {
        const line = terminalLines[i];
        if (scrollProgress >= lineEnd) {
          lines.push({ ...line, showCursor: i === totalLines - 1 });
        } else {
          const ratio = (scrollProgress - lineStart) / (lineEnd - lineStart);
          const charCount = Math.floor(ratio * line.text.length);
          lines.push({
            ...line,
            text: line.text.slice(0, charCount),
            showCursor: true,
          });
          break;
        }
      } else {
        break;
      }
    }
    return lines;
  }, [scrollProgress]);

  const typedLines = getTypedLines();
  const displayLines = typedLines.length > 0 ? typedLines : [{ prompt: "$", text: "", dim: false, accent: false, cursor: false, showCursor: true }];

  // Visibility states
  const showIntro = scrollProgress <= 0.22;
  const introOpacity = interpolate(scrollProgress, 0.1, 0.2, 1, 0);
  const introScale = interpolate(scrollProgress, 0.1, 0.2, 1, 0.95);
  const introTranslateY = interpolate(scrollProgress, 0.1, 0.2, 0, -20);

  const showTerminal = scrollProgress >= 0.18 && scrollProgress <= 0.6;
  let terminalOpacity = 0;
  let terminalScale = 0.95;
  let terminalTranslateY = 20;
  if (showTerminal) {
    if (scrollProgress < 0.26) {
      terminalOpacity = interpolate(scrollProgress, 0.18, 0.26, 0, 1);
      terminalScale = interpolate(scrollProgress, 0.18, 0.26, 0.95, 1);
      terminalTranslateY = interpolate(scrollProgress, 0.18, 0.26, 20, 0);
    } else if (scrollProgress > 0.52) {
      terminalOpacity = interpolate(scrollProgress, 0.52, 0.6, 1, 0);
      terminalScale = interpolate(scrollProgress, 0.52, 0.6, 1, 0.95);
      terminalTranslateY = interpolate(scrollProgress, 0.52, 0.6, 0, -20);
    } else {
      terminalOpacity = 1;
      terminalScale = 1;
      terminalTranslateY = 0;
    }
  }

  const showSteps = scrollProgress >= 0.54 && scrollProgress <= 0.84;
  let stepsOpacity = 0;
  let stepsTranslateY = 20;
  if (showSteps) {
    if (scrollProgress < 0.6) {
      stepsOpacity = interpolate(scrollProgress, 0.54, 0.6, 0, 1);
      stepsTranslateY = interpolate(scrollProgress, 0.54, 0.6, 20, 0);
    } else if (scrollProgress > 0.78) {
      stepsOpacity = interpolate(scrollProgress, 0.78, 0.84, 1, 0);
      stepsTranslateY = interpolate(scrollProgress, 0.78, 0.84, 0, -20);
    } else {
      stepsOpacity = 1;
      stepsTranslateY = 0;
    }
  }

  const getStepStyles = (index: number) => {
    const stepStart = 0.60 + index * 0.06;
    const stepEnd = stepStart + 0.05;
    const opacity = interpolate(scrollProgress, stepStart, stepEnd, 0.15, 1);
    const scale = interpolate(scrollProgress, stepStart, stepEnd, 0.96, 1);
    const glow = interpolate(scrollProgress, stepStart, stepEnd, 0, 1);

    return {
      opacity,
      transform: `scale(${scale})`,
      boxShadow: glow > 0.1 ? `0 0 15px rgba(167, 139, 250, ${glow * 0.15})` : "none",
      borderColor: glow > 0.1 ? "var(--border-bright)" : "var(--border)",
      transition: "box-shadow 0.15s ease, border-color 0.15s ease",
    };
  };

  const showCTA = scrollProgress >= 0.8;
  let ctaOpacity = 0;
  let ctaScale = 0.95;
  let ctaTranslateY = 20;
  if (showCTA) {
    ctaOpacity = interpolate(scrollProgress, 0.8, 0.9, 0, 1);
    ctaScale = interpolate(scrollProgress, 0.8, 0.9, 0.95, 1);
    ctaTranslateY = interpolate(scrollProgress, 0.8, 0.9, 20, 0);
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[380vh] bg-transparent"
    >
      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Canvas Background for Scroll Animation */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none"
          style={{ opacity: frame0Loaded ? 0.85 : 0 }}
        />

        {/* Subtle radial dark overlay vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,8,0.25)_0%,rgba(5,5,8,0.9)_80%)] pointer-events-none" />

        {/* Background LED grid */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
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

        {/* Floating gradient light for polish */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.04)_0%,transparent_60%)] pointer-events-none" />

        {/* Text and UI Overlay Container */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 w-full h-full flex items-center justify-center">
          
          {/* Section 1: Intro Header */}
          {showIntro && (
            <div
              style={{
                opacity: introOpacity,
                transform: `scale(${introScale}) translateY(${introTranslateY}px)`,
                pointerEvents: scrollProgress < 0.15 ? "auto" : "none",
              }}
              className="absolute w-full flex flex-col items-center text-center transition-all duration-100 ease-out"
            >
              <div className="flex items-center justify-center gap-3 mb-4 select-none">
                <span className="text-[var(--green)] text-xs font-mono">astra</span>
                <span className="text-[var(--text-dim)] text-xs font-mono">v0.1.7</span>
                {loadedCount < totalFrames ? (
                  <span className="text-[var(--accent)] text-[10px] font-mono animate-pulse">
                    [caching workspace assets: {Math.floor((loadedCount / totalFrames) * 100)}%]
                  </span>
                ) : (
                  <span className="text-[var(--green)] text-[10px] font-mono">[assets: ready]</span>
                )}
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
              <div className="mt-10 text-[10px] text-[var(--text-dim)] animate-bounce font-mono select-none uppercase tracking-wider">
                scroll to explore ↓
              </div>
            </div>
          )}

          {/* Section 2: Terminal typing animation */}
          {showTerminal && (
            <div
              style={{
                opacity: terminalOpacity,
                transform: `scale(${terminalScale}) translateY(${terminalTranslateY}px)`,
                pointerEvents: "none",
              }}
              className="absolute w-full max-w-2xl transition-all duration-100 ease-out"
            >
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 overflow-hidden shadow-2xl shadow-black/60">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-raised)]/60">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-[10px] text-[var(--text-dim)] font-mono select-none">
                    bash — astra
                  </span>
                </div>

                {/* Terminal body */}
                <div className="p-5 text-xs sm:text-sm leading-6 min-h-[280px] font-mono text-left select-none">
                  {displayLines.map((line, i) => (
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
                        line.showCursor && line.cursor
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
                      {line.showCursor && !line.cursor && (
                        <span className="terminal-cursor" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Quick setup steps */}
          {showSteps && (
            <div
              style={{
                opacity: stepsOpacity,
                transform: `translateY(${stepsTranslateY}px)`,
                pointerEvents: "none",
              }}
              className="absolute w-full flex flex-col items-center transition-all duration-100 ease-out"
            >
              <div className="mb-6 text-center select-none">
                <span className="text-[10px] text-[var(--accent)] font-mono uppercase tracking-widest">
                  Quick Start
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-1 text-[var(--foreground)]">
                  Install and Run in Seconds
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl select-none">
                {quickSteps.map((step, i) => {
                  const styles = getStepStyles(i);
                  return (
                    <div
                      key={step.num}
                      style={styles}
                      className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--surface)]/90 border text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--accent)] font-mono font-bold">
                          {step.num}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                          {step.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--foreground)] font-mono bg-[var(--background)]/85 p-2 rounded border border-[var(--border)] overflow-x-auto whitespace-nowrap">
                        {step.cmd}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: CTA and final links */}
          {showCTA && (
            <div
              style={{
                opacity: ctaOpacity,
                transform: `scale(${ctaScale}) translateY(${ctaTranslateY}px)`,
                pointerEvents: scrollProgress >= 0.88 ? "auto" : "none",
              }}
              className="absolute w-full flex flex-col items-center text-center transition-all duration-100 ease-out"
            >
              <div className="flex items-center justify-center gap-3 mb-4 select-none">
                <span className="text-[var(--green)] text-xs font-mono">astra</span>
                <span className="text-[var(--text-dim)] text-xs font-mono">v0.1.7</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-4">
                <span className="text-[var(--foreground)]">
                  Your Terminal&apos;s
                </span>
                <br />
                <span className="text-[var(--accent)]">AI Partner</span>
              </h1>
              <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed mb-8">
                Five interaction modes. 38+ agent tools. Staging-first mutations.
                Multi-agent orchestration. All in your CLI.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={scrollToInstall}
                  className="px-5 py-2.5 rounded-md text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dim)] transition-all duration-200 hover:shadow-[0_0_15px_rgba(167,139,250,0.4)] cursor-pointer"
                >
                  Install Astra
                </button>
                <button
                  onClick={scrollToUsage}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors duration-200 cursor-pointer"
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
          )}

        </div>
      </div>
    </section>
  );
}

