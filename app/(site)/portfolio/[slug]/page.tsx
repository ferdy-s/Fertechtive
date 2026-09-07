import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LightboxGallery from "@/components/LightboxGallery";

/* =================== Constants =================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

/* =================== Helpers =================== */

const safeDesc = (value?: string | null) =>
  value?.trim() ? value.trim().slice(0, 160) : "";

const safeTitle = (value?: string | null) =>
  value?.trim() ? value.trim().slice(0, 70) : "";

const toAbsoluteUrl = (value?: string | null) => {
  if (!value) {
    return `${SITE_URL}/default-cover.jpg`;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return value.startsWith("/")
    ? `${SITE_URL}${value}`
    : `${SITE_URL}/${value}`;
};

/* =================== Metadata =================== */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
      title: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
      ogImage: true,
      thumbnailUrl: true,
      publishedAt: true,
    },
  });

  /*
   * Project tidak ditemukan atau belum dipublikasikan:
   * jangan biarkan halaman masuk index.
   */
  if (!project || !project.publishedAt) {
    return {
      title: "Project Tidak Ditemukan | Fertechtive",
      description: "Project yang Anda cari tidak tersedia.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `${SITE_URL}/portfolio/${project.slug}`;

  const title =
    safeTitle(project.metaTitle || project.title) ||
    "Portfolio | Fertechtive";

  const description =
    safeDesc(project.metaDescription || project.description) ||
    "Project portfolio Ferdy Salsabilla di Fertechtive.";

  const image = toAbsoluteUrl(
    project.ogImage ||
      project.thumbnailUrl ||
      "/default-cover.jpg"
  );

  return {
    metadataBase: new URL(SITE_URL),

    title,

    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "Fertechtive",
      locale: "id_ID",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* =================== PAGE =================== */

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
  });

  /*
   * Konsisten dengan sitemap:
   * hanya project yang published yang boleh
   * diakses sebagai halaman publik.
   */
  if (!project || !project.publishedAt) {
    return notFound();
  }

  const title =
    typeof project.title === "string"
      ? project.title
      : "";

  const category =
    typeof project.category === "string"
      ? project.category
      : "";

  const description =
    typeof project.description === "string"
      ? project.description
      : "";

  const tags = Array.isArray(project.tags)
    ? project.tags.map(String)
    : [];

  const html =
    typeof project.content === "string"
      ? project.content
      : "";

  const images = Array.isArray(project.images)
    ? project.images
    : [];

  const cover =
    project.thumbnailUrl ||
    images[0] ||
    "/default-cover.jpg";

  const coverUrl = toAbsoluteUrl(cover);

  const gallery = images;

  const canonical =
    `${SITE_URL}/portfolio/${project.slug}`;

  /* =================== Structured Data =================== */

  const structuredData = {
    "@context": "https://schema.org",

    "@type": "CreativeWork",

    "@id": `${canonical}#project`,

    name: title,

    description,

    url: canonical,

    image: [coverUrl],

    inLanguage: "id-ID",

    author: {
      "@type": "Person",

      "@id": `${SITE_URL}#person`,

      name: "Ferdy Salsabilla",

      url: `${SITE_URL}/about`,
    },

    creator: {
      "@type": "Person",

      "@id": `${SITE_URL}#person`,

      name: "Ferdy Salsabilla",

      url: `${SITE_URL}/about`,
    },

    ...(project.publishedAt
      ? {
          dateCreated:
            project.createdAt.toISOString(),

          datePublished:
            project.publishedAt.toISOString(),
        }
      : {}),

    ...(category
      ? {
          genre: category,
        }
      : {}),

    keywords:
      tags.length > 0
        ? tags.join(", ")
        : undefined,
  };

  /* =================== Breadcrumb =================== */

  const breadcrumbData = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",

        position: 1,

        name: "Portfolio",

        item: `${SITE_URL}/portfolio`,
      },

      {
        "@type": "ListItem",

        position: 2,

        name: title,

        item: canonical,
      },
    ],
  };

  /* =================== PAGE =================== */

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

      {/* =================== HERO =================== */}

      <header className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-10 pt-24 sm:pt-28 md:pt-40 pb-8 sm:pb-10 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* TEXT */}

          <div className="lg:col-span-5">
            {category ? (
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
                {category}
              </span>
            ) : null}

            <h1 className="mt-4 text-[32px] sm:text-[40px] lg:text-[54px] font-semibold leading-[1.08] tracking-tight">
              {title}
            </h1>

            {description ? (
              <p className="mt-4 max-w-[520px] text-[15px] sm:text-[16px] text-white/75 leading-relaxed">
                {description}
              </p>
            ) : null}

            {tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] text-white/75"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* IMAGE */}

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
              <LightboxGallery
                gallery={gallery}
                title={title}
              />
            </div>
          </div>
        </div>
      </header>

      {/* =================== CONTENT =================== */}

      <main className="mx-auto max-w-[1250px] px-5 sm:px-10 lg:px-14 pb-16 sm:pb-20">
        <article
          className="prose prose-invert max-w-none leading-[1.7] text-white/85"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />

        {!html && (
          <p className="mt-9 text-center text-sm text-white/45">
            Konten proyek ini belum diisi.
          </p>
        )}
      </main>

      {/* =================== STRUCTURED DATA =================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
    </section>
  );
}
