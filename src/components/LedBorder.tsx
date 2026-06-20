"use client";

import { useEffect, useRef } from "react";

interface LedBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: number;
}

export default function LedBorder({
  children,
  className = "",
  color = "#a78bfa",
  speed = 1,
}: LedBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dotSize = 2.5;
    const spacing = 14;
    let time = 0;

    const animate = () => {
      time += 0.02 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const perimeter = 2 * (w + h);
      const totalDots = Math.floor(perimeter / spacing);

      for (let i = 0; i < totalDots; i++) {
        const dist = (i / totalDots) * perimeter;
        let x: number, y: number;

        if (dist < w) {
          x = dist;
          y = 0;
        } else if (dist < w + h) {
          x = w;
          y = dist - w;
        } else if (dist < 2 * w + h) {
          x = w - (dist - w - h);
          y = h;
        } else {
          x = 0;
          y = h - (dist - 2 * w - h);
        }

        const wave = Math.sin(i * 0.15 + time * 2) * 0.5 + 0.5;
        const alpha = 0.1 + wave * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
        ctx.fill();

        if (alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize * 4, 0, Math.PI * 2);
          ctx.fillStyle = color.replace(")", `, ${alpha * 0.1})`).replace("rgb", "rgba");
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, speed]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ width: "100%", height: "100%" }}
      />
      {children}
    </div>
  );
}
