"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// 🔥 Lazy load heavy components
const Globe3D = dynamic(() => import("@/components/Globe3D"), {
  ssr: false,
});

const SpaceField = dynamic(() => import("@/components/effects/SpaceField"), {
  ssr: false,
});

export default function HomeClient() {
  const [showGlobe, setShowGlobe] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  // ⏱️ delay heavy render
  useEffect(() => {
    const t1 = setTimeout(() => setShowEffects(true), 300);
    const t2 = setTimeout(() => setShowGlobe(true), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-deep-950 text-white">
      {/* 🔥 lazy background effect */}
      {showEffects && <SpaceField density={0.22} speed={0.32} />}

      {/* ambient lighting */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center px-6">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* LEFT */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
              Selamat Datang di Halaman
            </div>

            <h1 className="mt-5 text-[44px] md:text-[92px] font-semibold tracking-tight leading-[1.05]">
              FERTECHTIVE
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-[15px] text-white/60 leading-relaxed md:mx-0">
              <span className="text-white/90 font-medium">Fertechtive</span>{" "}
              adalah portfolio digital yang menampilkan{" "}
              <span className="text-cyan-300">gagasan</span>,{" "}
              <span className="text-violet-300">karya</span>, dan eksplorasi
              teknologi dengan pendekatan modern dan berdampak.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
              <Link
                href="/portfolio"
                className="rounded-full bg-white px-6 py-2.5 text-[14px] font-medium text-black hover:opacity-90 transition"
              >
                Lihat Karya
              </Link>

              <a
                href="https://wa.me/6282134027993"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/50 px-6 py-2.5 text-[14px] text-white/70 hover:border-white/80 hover:text-white transition"
              >
                Hubungi Saya
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center justify-center w-[600px] h-[600px]">
            {showGlobe && <Globe3D />}
          </div>
        </div>
      </div>
    </section>
  );
}
