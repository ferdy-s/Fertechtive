// app/portfolio/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LightboxGallery from "@/components/LightboxGallery";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

/* ===== Metadata ===== */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!p) {
    return {
      title: "Project Not Found",
      description: "Halaman proyek tidak ditemukan.",
    };
  }

  const url = `${SITE_URL}/portfolio/${p.slug}`;

  return {
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: p.metaTitle || p.title,
      description: p.metaDescription || p.description,
      images: [{ url: p.ogImage || p.thumbnailUrl || "/default-cover.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.metaTitle || p.title,
      description: p.metaDescription || p.description,
      images: [p.ogImage || p.thumbnailUrl || "/default-cover.jpg"],
    },
  };
}

/* ===== Helpers ===== */
const s = (v: unknown) => (typeof v === "string" ? v : "");
const a = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);

/* ===== Page ===== */
export default async function PortfolioDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });
  if (!project) return notFound();

  const title = s(project.title);
  const category = s(project.category);
  const desc = s(project.description);
  const tags = a(project.tags);
  const html = s(project.content);
  const cover = s(project.thumbnailUrl) || "/default-cover.jpg";
  const gallery = Array.isArray(project.images) ? project.images : [];

  return (
    <section className="relative min-h-screen bg-[#0B0D12] text-white antialiased">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0B0D12] via-[#0A0D14] to-black" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04]
      [background-image:linear-gradient(to_right,rgba(255,255,255,.35)_1px,transparent_1px),
      linear-gradient(to_bottom,rgba(255,255,255,.35)_1px,transparent_1px)]
      [background-size:32px_32px]"
      />

      {/* ================= HERO ================= */}
      <header className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-10 pt-24 sm:pt-28 md:pt-40 pb-8 sm:pb-10 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* TEXT */}
          <div className="lg:col-span-5">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
              {category}
            </span>

            <h1 className="mt-4 text-[32px] sm:text-[40px] lg:text-[54px] font-semibold leading-[1.08] tracking-tight">
              {title}
            </h1>

            <p className="mt-4 max-w-[520px] text-[15px] sm:text-[16px] text-white/75 leading-relaxed">
              {desc}
            </p>

            {tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] text-white/75"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* VISUAL */}
          <div className="lg:col-span-7 mt-2 lg:mt-0">
            <figure className="relative aspect-[14/9] overflow-hidden rounded-3xl border border-white/10 bg-[#10131A] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.85)]">
              <Image
                src={cover}
                alt={title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 800px"
                className="object-cover"
              />
            </figure>
          </div>

          {/* GALLERY */}
          <div className="lg:col-span-12 mt-4">
            <div className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12">
              <LightboxGallery gallery={gallery} title={title} />
            </div>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-14 pb-16 sm:pb-20">
        <article
          className="prose prose-invert max-w-none
        prose-p:text-white/85 prose-a:text-sky-400 hover:prose-a:text-sky-300
        prose-strong:text-white prose-blockquote:border-sky-500/40
        prose-h2:text-white prose-h3:text-white/90
        prose-img:rounded-xl prose-img:border prose-img:border-white/10
        leading-[1.8]"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {!html && (
          <p className="mt-8 text-center text-sm text-white/45">
            Konten proyek ini belum diisi.
          </p>
        )}
      </main>
    </section>
  );
}
