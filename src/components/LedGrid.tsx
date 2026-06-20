"use client";

import { useEffect, useRef, useMemo } from "react";

interface LedGridProps {
  rows?: number;
  cols?: number;
  spacing?: number;
  dotSize?: number;
  color?: string;
  glowColor?: string;
  className?: string;
  variant?: "wave" | "pulse" | "scan" | "random";
  speed?: number;
  density?: number;
}

function hashRandom(seed: number, index: number): number {
  let h = (seed + index * 2654435761) | 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

export default function LedGrid({
  rows = 12,
  cols = 20,
  spacing = 28,
  dotSize = 3,
  color = "rgba(167, 139, 250, 0.3)",
  glowColor = "rgba(167, 139, 250, 0.6)",
  className = "",
  variant = "wave",
  speed = 1,
  density = 0.4,
}: LedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const dots = useMemo(() => {
    const seed = rows * 1000 + cols * 100 + Math.round(density * 100);
    const result: { x: number; y: number; phase: number; brightness: number }[] = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (hashRandom(seed, idx) < density) {
          result.push({
            x: c * spacing + spacing / 2,
            y: r * spacing + spacing / 2,
            phase: hashRandom(seed, idx + 1) * Math.PI * 2,
            brightness: 0.1 + hashRandom(seed, idx + 2) * 0.3,
          });
        }
        idx += 3;
      }
    }
    return result;
  }, [rows, cols, spacing, density]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = cols * spacing + spacing;
    const height = rows * spacing + spacing;
    canvas.width = width;
    canvas.height = height;

    const animate = () => {
      timeRef.current += 0.016 * speed;
      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        let alpha = dot.brightness;

        if (variant === "wave") {
          const wave = Math.sin(dot.x * 0.02 + dot.y * 0.015 + timeRef.current * 2);
          alpha = 0.08 + (wave + 1) * 0.4;
        } else if (variant === "pulse") {
          const dist = Math.sqrt(
            Math.pow(dot.x - width / 2, 2) + Math.pow(dot.y - height / 2, 2)
          );
          const pulse = Math.sin(dist * 0.03 - timeRef.current * 2.5);
          alpha = 0.05 + (pulse + 1) * 0.45;
        } else if (variant === "scan") {
          const scanY = ((timeRef.current * 60) % (height + 40)) - 20;
          const dist = Math.abs(dot.y - scanY);
          alpha = dist < 30 ? 0.8 * (1 - dist / 30) : 0.05 + dot.brightness * 0.1;
        } else {
          const flicker = Math.sin(timeRef.current * 3 + dot.phase) * 0.5 + 0.5;
          alpha = 0.05 + flicker * 0.5;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fill();

        if (alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowColor.replace(/[\d.]+\)$/, `${alpha * 0.15})`);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [dots, cols, rows, spacing, dotSize, color, glowColor, variant, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: cols * spacing + spacing, height: rows * spacing + spacing }}
    />
  );
}
