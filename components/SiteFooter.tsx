// app/components/FooterMonochromeCompact.tsx
// Server Component – elegant monochrome, compact & proportional, SEO-friendly
import Link from "next/link";
import Script from "next/script";
import { Instagram, Github, Mail } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Tips & Trik" },
  { href: "/contact", label: "Kontak" },
];

export default function FooterMonochromeCompact() {
  const year = new Date().getFullYear();
  const siteName = "Fertechtive";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fertechtive.vercel.app";
  const email = "ferdysalsabilla87@gmail.com";
  const phoneIntl = "+6282134027993"; // E.164

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    email,
    telephone: phoneIntl,
    sameAs: [
      "https://github.com/ferdy-s",
      "https://www.linkedin.com/in/ferdysalsabilla",
      "https://wa.me/6282134027993",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tangerang Selatan",
      addressRegion: "Banten",
      addressCountry: "ID",
    },
  };

  return (
    <footer
      role="contentinfo"
      className="relative bg-black text-white border-t border-white/10 overflow-x-clip"
    >
      {/* === CTA compact === */}
      <section className="w-full px-6 sm:px-10 lg:px-25 py-10">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-7 lg:p-8 shadow-[0_0_0_1px_rgba(255,255,255,.06)]">
          {/* subtle accent */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-transparent to-white/5" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Copy */}
            <div className="flex-1">
              <h2 className="font-extrabold tracking-tight leading-tight text-[clamp(21px,2.6vw,28px)]">
                <span className="text-white">{siteName}</span>
              </h2>
              <p className="mt-1.5 max-w-xl text-[13.5px] text-white/60">
                Web Development • UI/UX • Graphic Design • Digital Marketing
              </p>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${phoneIntl.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Konsultasi via WhatsApp"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black/90 transition hover:bg-white/95"
              >
                <span className="relative z-10">Konsultasi</span>
                <span className="absolute inset-0 -z-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(0,0,0,.08),transparent_70%)]" />
              </a>

              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-sm text-white/90 transition hover:bg-white/10"
              >
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === GRID compact: 4 / 4 / 4 === */}
      <section className="w-full px-6 sm:px-10 lg:px-25 pb-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 items-start">
          {/* ABOUT */}
          <div className="lg:col-span-4">
            <h3 className="text-l font-bold tracking-wide text-white/95">
              Tentang
            </h3>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-white/65">
              {siteName} Memadukan UI/UX, Web Dev, Graphic Design & Digital
              Marketing untuk hasil nyata dan fokus pada kecepatan,
              aksesibilitas, dan maintainability.
            </p>
          </div>

          {/* NAV */}
          <nav aria-label="Navigasi footer" className="lg:col-span-4">
            <h3 className="text-l font-bold tracking-wide text-white/95">
              Navigasi
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-white/75">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded transition-colors"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* SOCIAL + CONTACT ICONS */}
          <div className="lg:col-span-4 lg:justify-self-end">
            <div
              className="mt-4 flex flex-wrap justify-center lg:justify-end gap-3"
              aria-label="Social media links"
            >
              <a
                href="https://www.instagram.com/fertechtive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition text-sm"
              >
                <Instagram size={16} />
                Instagram
              </a>

              <a
                href="https://www.tiktok.com/@fertechtive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition text-sm"
              >
                <FaTiktok size={16} />
                TikTok
              </a>

              <a
                href="https://github.com/ferdy-s"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition text-sm"
              >
                <Github size={16} />
                GitHub
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition text-sm"
              >
                <Mail size={16} />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* LEGAL compact */}
        <div className="mt-8 border-t border-white/10 pt-5 text-[12px] text-white/55">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/70">
            <p>
              © {year} {siteName}. All rights reserved.
            </p>

            <p className="text-center md:text-right">
              Dibuat oleh{" "}
              <span className="font-medium text-white">Ferdy Salsabilla</span> •
              2026{" "}
            </p>
          </div>
        </div>
      </section>

      {/* JSON-LD non-blocking */}
      <Script
        id="org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
    </footer>
  );
}
