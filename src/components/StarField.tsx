"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

const STAR_COLORS = [
  "#a78bfa", // purple
  "#c4b5fd", // light purple
  "#e9d5ff", // very light purple
  "#8b5cf6", // vivid purple
  "#7c3aed", // deep purple
  "#ddd6fe", // pale lavender
  "#f5f3ff", // ghost white-purple
];

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 3500);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.2 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.008 + 0.002,
        twinklePhase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const baseAlpha = star.opacity * (0.4 + twinkle * 0.6);

        // Mouse proximity glow
        const dx = star.x - mx;
        const dy = star.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximityBoost = dist < 150 ? (1 - dist / 150) * 0.5 : 0;

        const alpha = Math.min(1, baseAlpha + proximityBoost);

        // Draw glow
        if (alpha > 0.3) {
          const glowSize = star.size * (3 + proximityBoost * 4);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowSize
          );
          gradient.addColorStop(0, star.color.startsWith("#") ? hexToRgba(star.color, alpha * 0.4) : star.color);
          gradient.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (1 + proximityBoost * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = star.color.startsWith("#")
          ? hexToRgba(star.color, alpha)
          : star.color;
        ctx.fill();

        // Cross sparkle for brighter stars
        if (alpha > 0.6 && star.size > 1.2) {
          const sparkleLen = star.size * 2.5 * twinkle;
          ctx.strokeStyle = hexToRgba(star.color, alpha * 0.3);
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - sparkleLen, star.y);
          ctx.lineTo(star.x + sparkleLen, star.y);
          ctx.moveTo(star.x, star.y - sparkleLen);
          ctx.lineTo(star.x, star.y + sparkleLen);
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
