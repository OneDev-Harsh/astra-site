"use client";

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function SvgTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      // Keep trail manageable
      if (pointsRef.current.length > 120) {
        pointsRef.current = pointsRef.current.slice(-120);
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      if (points.length < 2) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      // Age all points
      for (const p of points) {
        p.age += 1;
      }

      // Remove old points
      while (points.length > 0 && points[0].age > 80) {
        points.shift();
      }

      if (points.length < 2) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      // Draw smooth trail with gradient
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const progress = i / points.length;
        const alpha = progress * 0.6 * (1 - curr.age / 80);
        const width = progress * 3;

        if (alpha < 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);

        // Smooth curve through points
        if (i < points.length - 1) {
          const next = points[i + 1];
          const cpX = (curr.x + next.x) / 2;
          const cpY = (curr.y + next.y) / 2;
          ctx.quadraticCurveTo(curr.x, curr.y, cpX, cpY);
        } else {
          ctx.lineTo(curr.x, curr.y);
        }

        // Purple gradient stroke
        const gradient = ctx.createLinearGradient(prev.x, prev.y, curr.x, curr.y);
        gradient.addColorStop(0, `rgba(139, 92, 246, 0)`);
        gradient.addColorStop(0.5, `rgba(167, 139, 250, ${alpha})`);
        gradient.addColorStop(1, `rgba(196, 181, 253, ${alpha * 1.2})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Draw glowing dot at cursor
      if (mouseRef.current.active) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 20);
        glow.addColorStop(0, "rgba(167, 139, 250, 0.4)");
        glow.addColorStop(0.5, "rgba(139, 92, 246, 0.1)");
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(mx, my, 20, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(196, 181, 253, 0.9)";
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
