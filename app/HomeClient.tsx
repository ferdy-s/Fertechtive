"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load heavy components
const Globe3D = dynamic(() => import("@/components/Globe3D"), {
  ssr: false,
});

const SpaceField = dynamic(() => import("@/components/effects/SpaceField"), {
  ssr: false,
});

export default function HomeClient() {
  const [showGlobe, setShowGlobe] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowEffects(true), 300);
    const t2 = setTimeout(() => setShowGlobe(true), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      {showEffects && (
        <SpaceField
          density={0.22}
          speed={0.32}
        />
      )}

      {/* Subtle technical grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
          [background-size:80px_80px]
        "
      />

      {/* Edge vignette */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_25%,#000_100%)]
        "
      />

      {/* =========================================================
          TECHNICAL FRAME
      ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-white/[0.06] md:inset-6 lg:inset-8"
      />

      {/* Corner marks */}

      <div className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-white/25 md:left-6 md:top-6 lg:left-8 lg:top-8" />

      <div className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-white/25 md:right-6 md:top-6 lg:right-8 lg:top-8" />

      <div className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-white/25 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8" />

      <div className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-white/25 md:bottom-6 md:right-6 lg:right-8 lg:bottom-8" />

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-10 flex min-h-screen items-center px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-10">

          {/* =====================================================
              LEFT
          ===================================================== */}

          <div className="relative text-center md:text-left">

            {/* System label */}

            <div className="mb-7 flex items-center justify-center gap-3 md:justify-start">
              <span className="h-1.5 w-1.5 bg-white" />

              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">
                Digital Portfolio
              </span>

              <span className="h-px w-10 bg-white/15" />

              <span className="text-[10px] font-medium tracking-[0.16em] text-white/25">
                Ferdy Salsabilla
              </span>
            </div>

            {/* Main heading */}

            <h1
              className="
                text-[clamp(3rem,8vw,7rem)]
                font-semibold
                leading-[0.9]
                tracking-[-0.055em]
                text-white
              "
            >
              FERTECHTIVE
            </h1>

            {/* Description */}

            <p className="mx-auto mt-7 max-w-xl text-[15px] leading-7 text-white/55 md:mx-0">
              <span className="font-medium text-white/90">
                Fertechtive
              </span>{" "}
              adalah portfolio digital yang mendokumentasikan karya,
              eksperimen, dan solusi dalam pengembangan teknologi,
              desain digital, dan produk berbasis web.
            </p>

            {/* Actions */}

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/portfolio"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-black
                  transition-colors
                  duration-200
                  hover:bg-neutral-200
                "
              >
                Lihat Karya
              </Link>

              <a
                href="https://wa.me/6282134027993"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  duration-200
                  hover:border-white/40
                  hover:bg-white/[0.05]
                "
              >
                Hubungi Saya
              </a>
            </div>

            {/* Technical metadata */}

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[9px] font-medium uppercase tracking-[0.18em] text-white/25 md:justify-start">
              <span>Web & App Development</span>
              <span>UI / UX Designer</span>
              <span>Graphic Designer</span>
              <span>Digital Marketing</span>
            </div>
          </div>

          {/* =====================================================
              RIGHT — GLOBE
          ===================================================== */}

          <div className="relative hidden h-[520px] w-full items-center justify-center md:flex lg:h-[620px]">
            
            {/* Globe container */}

            <div className="relative flex h-[min(52vw,560px)] w-[min(52vw,560px)] items-center justify-center">

              {/* Technical rings */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-[8%]
                  rounded-full
                  border
                  border-white/[0.07]
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-[17%]
                  rounded-full
                  border
                  border-white/[0.04]
                "
              />

              {/* Crosshair */}

              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[7%] h-5 w-px -translate-x-1/2 bg-white/20"
              />

              <div
                aria-hidden="true"
                className="absolute left-1/2 bottom-[7%] h-5 w-px -translate-x-1/2 bg-white/20"
              />

              <div
                aria-hidden="true"
                className="absolute left-[7%] top-1/2 h-px w-5 -translate-y-1/2 bg-white/20"
              />

              <div
                aria-hidden="true"
                className="absolute right-[7%] top-1/2 h-px w-5 -translate-y-1/2 bg-white/20"
              />

              {/* Globe */}

              {showGlobe && <Globe3D />}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FOOTER SYSTEM INFO
      ========================================================= */}

      <div className="absolute bottom-8 left-8 right-8 hidden items-center justify-between text-[8px] font-medium uppercase tracking-[0.2em] text-white/20 md:flex">
        <span>FRT / 2026</span>

        <span>Digital Systems</span>

        <span>Online</span>
      </div>
    </section>
  );
}