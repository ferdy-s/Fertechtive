"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SpaceField from "@/components/effects/SpaceField";

export default function HomePage() {
  return (
    <section className="relative h-screen overflow-hidden bg-deep-950 text-white">
      {/* space animation */}
      <SpaceField density={0.22} speed={0.32} />

      {/* extra nebula glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />

      {/* content */}
      <div className="relative z-10 mx-auto grid h-full max-w-5xl place-items-center px-6">
        <div className="w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider"
          >
            Selamat Datang di Fertechtive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-3 text-[42px] md:text-[120px] font-bold leading-tight"
          >
            FERTECHTIVE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-2 max-w-2xl text-[15px] md:text-[15px] text-white/75 leading-relaxed"
          >
            <strong>Fertechtive</strong> adalah website portfolio dari Ferdy
            Salsabilla, dibangun untuk berbagi{" "}
            <span className="text-cyan-300">gagasan</span>,{" "}
            <span className="text-violet-300">karya</span>, dan eksplorasi
            digital yang semoga dapat memberi manfaat bagi publik.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <Link
              href="/portfolio"
              className="rounded-full bg-white px-6 py-2.5 text-[14px] font-semibold text-black shadow hover:opacity-90 transition"
            >
              Lihat Karya
            </Link>
            <a
              href="https://wa.me/6282134027993"
              target="_blank"
              className="rounded-full border border-white/25 px-6 py-2.5 text-[14px] font-medium hover:bg-white/10 transition"
            >
              WhatsApp Saya
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
