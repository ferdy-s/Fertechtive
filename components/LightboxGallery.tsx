"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  gallery: string[];
  title: string;
}

export default function LightboxGallery({ gallery, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const close = () => setSelectedIndex(null);

  const prev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === 0 ? gallery.length - 1 : (prev ?? 0) - 1,
    );
  };

  const next = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === gallery.length - 1 ? 0 : (prev ?? 0) + 1,
    );
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (!gallery.length) return null;

  return (
    <>
      {/* ================= HORIZONTAL GALLERY ================= */}
      <div className="relative">
        {/* DESKTOP ARROWS */}
        <button
          onClick={scrollLeft}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
          h-10 w-10 items-center justify-center
          rounded-full bg-black/50 border border-white/20
          text-white hover:bg-black/70 transition"
        >
          ‹
        </button>

        <button
          onClick={scrollRight}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
          h-10 w-10 items-center justify-center
          rounded-full bg-black/50 border border-white/20
          text-white hover:bg-black/70 transition"
        >
          ›
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((src, i) => (
            <div
              key={`${src}-${i}`}
              onClick={() => setSelectedIndex(i)}
              className="relative aspect-[16/10]
            min-w-[85%] sm:min-w-[55%] lg:min-w-[30%]
              snap-start overflow-hidden rounded-2xl
              border border-white/10 bg-[#10131A]
              transition-transform duration-500 hover:scale-[1.03]
              cursor-pointer"
            >
              <Image
                src={src}
                alt={`${title} preview ${i + 1}`}
                fill
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0B0D12] to-transparent hidden lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0B0D12] to-transparent hidden lg:block" />
      </div>

      {/* ================= FULLSCREEN MODAL ================= */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[9999]">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={close}
          />

          {/* CONTENT */}
          <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
            <div
              className="max-w-6xl w-full flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[selectedIndex]}
                alt={`${title} fullscreen`}
                width={1600}
                height={1000}
                className="w-full h-auto max-h-[80vh] object-contain"
                priority
              />
            </div>

            {/* CONTROLS */}
            <div
              className="mt-6 flex items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={prev}
                className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm"
              >
                ←
              </button>

              <span className="text-white/60 text-sm">
                {selectedIndex + 1} / {gallery.length}
              </span>

              <button
                onClick={next}
                className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm"
              >
                →
              </button>
            </div>

            {/* CLOSE */}
            <button
              onClick={close}
              className="absolute top-5 right-5 text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
