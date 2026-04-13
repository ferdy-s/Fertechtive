"use client";

import { useEffect, useRef } from "react";

export default function SpaceField({
  density = 0.18,
  speed = 0.3,
}: {
  density?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      build();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // 🔥 TURUNKAN jumlah star
    let count = Math.max(60, Math.min(140, Math.floor((w * h) / 1800)));

    type Star = { x: number; y: number; z: number; r: number; vy: number };
    let stars: Star[] = [];

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function build() {
      stars = Array.from({ length: count }, () => {
        const z = rand(0.4, 1.2);
        return {
          x: rand(0, w),
          y: rand(0, h),
          z,
          r: 0.5 + (1.2 - z),
          vy: (rand(0.1, 0.3) + speed) * z,
        };
      });
    }
    build();

    // 🔥 CACHE GRADIENT (sekali saja)
    const gradient = ctx.createRadialGradient(
      w * 0.5,
      h * 0.25,
      0,
      w * 0.5,
      h * 0.25,
      Math.max(w, h),
    );
    gradient.addColorStop(0, "rgba(56, 189, 248, .05)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    // 🔥 FPS LIMIT (30fps)
    let last = 0;
    let raf = 0;

    function tick(time: number) {
      if (time - last < 33) {
        raf = requestAnimationFrame(tick);
        return;
      }
      last = time;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        s.y += s.vy;

        if (s.y > h + 5) {
          s.y = -5;
          s.x = rand(0, w);
        }

        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ display: "block" }}
    />
  );
}
