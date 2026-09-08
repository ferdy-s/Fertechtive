import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import BlogListClient from "./BlogListClient";
import type { Metadata } from "next";

/* ================= Types & Utils ================= */

type Published = Date | string | null;

type Post = {
  id: string;
  slug: string;
  title: string | null;
  excerpt: string | null;
  coverUrl?: string | null;
  thumbnailUrl?: string | null;
  publishedAt: Published;
  author?: { name?: string | null } | null;
  categories?: Category[];
};

const coverOf = (p: Post) => p.coverUrl || p.thumbnailUrl || "";

const toDate = (d?: Published) =>
  d ? (typeof d === "string" ? new Date(d) : d) : undefined;

const toISO = (d?: Published) =>
  d ? (d instanceof Date ? d.toISOString() : d) : undefined;

const fmtDate = (d?: Published) => {
  const dt = toDate(d);

  return dt
    ? dt.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
};

/* ================= Caching ================= */

export const revalidate = 3600;

/* ================= SEO ================= */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

const BLOG_TITLE = "Catatan";

const BLOG_DESCRIPTION =
  "Kumpulan catatan seputar Full Stack Developer, UI/UX Design, software engineering, serta produktivitas kreator digital yang dirancang untuk meningkatkan kualitas produk dan performa aplikasi modern.";

const BLOG_OG_TITLE = "Berbagi Catatan Digitalisasi Modern";

const BLOG_OG_DESCRIPTION =
  "Insight dan editorial seputar Full Stack Developer, UI/UX, dan engineering modern untuk developer dan kreator digital.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    page?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const cat = params.cat?.trim().toLowerCase() ?? "all";
  const page = params.page?.trim() ?? "1";

  const hasQuery =
    Boolean(q) ||
    (Boolean(cat) && cat !== "all") ||
    (Boolean(page) && page !== "1");

  return {
    metadataBase: new URL(SITE_URL),

    title: BLOG_TITLE,

    description: BLOG_DESCRIPTION,

    keywords: [
      "Tips Full Stack Developer",
      "UI UX Tips",
      "Software Engineering",
      "Frontend Development",
      "Produktivitas Developer",
      "Digital Engineering Insight",
    ],

    alternates: {
      canonical: `${SITE_URL}/blog`,
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      url: `${SITE_URL}/blog`,
      siteName: "Fertechtive",
      title: BLOG_OG_TITLE,
      description: BLOG_OG_DESCRIPTION,
      images: [
        {
          url: `${SITE_URL}/tips-trik.png`,
          width: 1200,
          height: 630,
          alt: "Catatan - Full Stack Developer dan UI/UX Insight",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: BLOG_OG_TITLE,
      description:
        "Insight dan strategi Full Stack Developer serta UI/UX untuk membangun produk digital modern.",
      images: [`${SITE_URL}/tips-trik.png`],
    },

    robots: {
      index: !hasQuery,
      follow: true,

      googleBot: {
        index: !hasQuery,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  };
}

/* ================= Page ================= */

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    page?: string;
  }>;
}) {
  /* ================= SEARCH PARAMS ================= */

  const {
    q: rawQ,
    cat: rawCat,
    page: rawPage,
  } = await searchParams;

  const q = (rawQ ?? "").trim();

  const cat = (rawCat ?? "all").toLowerCase();

  const parsedPage = Number.parseInt(rawPage ?? "1", 10);

  const currentPage =
    Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  /* ================= PAGINATION ================= */

  const POSTS_PER_PAGE = 5;

  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();

    if (q) {
      params.set("q", q);
    }

    if (cat !== "all") {
      params.set("cat", cat);
    }

    if (page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();

    return `/blog${queryString ? `?${queryString}` : ""}`;
  };

  /* ================= WHERE FILTER ================= */

  const where: Prisma.PostWhereInput = {
    publishedAt: {
      not: null,
    },
  };

  if (q) {
    where.OR = [
      {
        title: {
          contains: q,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        excerpt: {
          contains: q,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  if (cat !== "all") {
    where.categories = {
      some: {
        slug: cat,
      },
    };
  }

  /* ================= DATABASE QUERY ================= */

  const [posts, totalCount, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: true,
        categories: true,
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      skip,
      take: POSTS_PER_PAGE,
    }),

    prisma.post.count({
      where,
    }),

    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  /* ================= DATA PREP ================= */

  const typedPosts = posts as unknown as Post[];

  const [featured, ...rest] = typedPosts;

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-[#05060A] text-white"
      aria-label="Halaman Blog"
    >
      {/* ================= BACKGROUND ================= */}

     <div
  aria-hidden
  className="pointer-events-none absolute inset-0 -z-10"
>
  {/* Subtle ambient glow */}
  <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_0%,rgba(56,189,248,0.025),transparent_65%),radial-gradient(900px_500px_at_85%_0%,rgba(139,92,246,0.025),transparent_65%)]" />

  {/* Very subtle grid */}
  <div
    className="absolute inset-0 opacity-[0.018]"
    style={{
      backgroundImage:
        "linear-gradient(to right, rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.25) 1px, transparent 1px)",
      backgroundSize: "52px 52px",
      maskImage:
        "radial-gradient(70% 45% at 50% 0%, black 10%, transparent 75%)",
      WebkitMaskImage:
        "radial-gradient(70% 45% at 50% 0%, black 10%, transparent 75%)",
    }}
  />
</div>

      <section className="mx-auto max-w-[1520px] px-5 pt-36 pb-10 sm:px-6 md:px-10 md:pt-30 lg:px-16">

        {/* ================= FEATURED ARTICLE ================= */}

       {featured && (
  <article
    className="group mb-6 grid grid-cols-1 overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0E14]/70 transition-all hover:border-white/20 lg:grid-cols-[1.08fr_1fr]"
    aria-labelledby={`post-${featured.id}-title`}
  >
    <Link
      href={`/blog/${featured.slug}`}
      className="contents"
      aria-label={`Baca artikel unggulan: ${
        featured.title ?? "Tanpa judul"
      }`}
    >
      {/* THUMBNAIL */}
      <div className="relative overflow-hidden">
        {coverOf(featured) ? (
          <Image
            src={coverOf(featured)!}
            alt={`Sampul artikel: ${
              featured.title ?? "Tanpa judul"
            }`}
            width={1600}
            height={900}
            priority
            fetchPriority="high"
            sizes="(max-width:1024px) 100vw, 55vw"
            className="block h-auto w-full object-contain transition-transform duration-700 group-hover:scale-[1.01]"
          />
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-cyan-700/20 to-violet-800/20" />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent"
        />

        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 text-[11px] backdrop-blur">
          {featured.categories?.[0]?.name ?? "Umum"}
        </span>
      </div>

      {/* TEXT */}
      <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 xl:p-12">
        <h2
          id={`post-${featured.id}-title`}
          className="text-[24px] font-semibold leading-[1.12] sm:text-[28px] md:text-[34px] xl:text-[40px]"
        >
          {featured.title}
        </h2>

        <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-base md:text-lg">
          {featured.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-2 text-[12px] text-white/60 sm:text-sm">
          <span>{featured.author?.name ?? "Anon"}</span>

          <span aria-hidden>•</span>

          <time dateTime={toISO(featured.publishedAt)}>
            {fmtDate(featured.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  </article>
)}

        {/* ================= SEARCH + CATEGORY ================= */}

       <BlogListClient
  categories={
    categories as Pick<
      Category,
      "id" | "name" | "slug"
    >[]
  }
  total={totalCount}
/>

        {/* ================= ARTICLE LIST ================= */}

        <section id="blog-list" aria-label="Daftar artikel">
          {rest.length > 0 ? (
            <ul
              className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              role="list"
            >
              {rest.map((p) => (
                <li key={p.id} className="list-none">
                  <article
                    className="group relative overflow-hidden rounded-2xl bg-[#0B1119]/75 transition-all hover:bg-[#0E1521]/85"
                    aria-labelledby={`post-${p.id}-title`}
                  >
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                      aria-label={`Baca artikel: ${
                        p.title ?? "Tanpa judul"
                      }`}
                    >
                      {/* THUMBNAIL */}

                      <div className="relative aspect-video overflow-hidden bg-[#0B1119]">
                        {coverOf(p) ? (
                          <Image
                            src={coverOf(p)!}
                            alt={`Sampul artikel: ${
                              p.title ?? "Tanpa judul"
                            }`}
                            fill
                            loading="lazy"
                            sizes="(max-width:768px) 100vw, 25vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-br from-cyan-700/20 to-violet-800/20"
                          />
                        )}

                        {/* CATEGORY */}

                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur">
                          {p.categories?.[0]?.name ?? "Umum"}
                        </span>
                      </div>

                      {/* CONTENT */}

                      <div className="p-4">
                        <h3
                          id={`post-${p.id}-title`}
                          className="line-clamp-2 text-[16px] font-semibold leading-snug sm:text-[18px]"
                        >
                          {p.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-[13px] text-white/70 sm:text-[14px]">
                          {p.excerpt}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-[12px] text-white/55">
                          <span>{p.author?.name ?? "Anon"}</span>

                          <span aria-hidden>•</span>

                          <time dateTime={toISO(p.publishedAt)}>
                            {fmtDate(p.publishedAt)}
                          </time>
                        </div>
                      </div>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="py-20 text-center text-white/60"
              role="status"
              aria-live="polite"
            >
              Tidak ada artikel ditemukan.
            </p>
          )}
        </section>

        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (
          <nav
            className="mt-12 flex justify-center"
            aria-label="Pagination"
          >
            <div className="flex items-center gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
              {/* PREVIOUS */}

              {currentPage > 1 ? (
                <Link
                  href={buildUrl(currentPage - 1)}
                  rel="prev"
                  className="text-sm font-medium text-white/70 transition-all duration-200 hover:text-white"
                >
                  ← Previous
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="text-sm font-medium opacity-30"
                >
                  ← Previous
                </span>
              )}

              {/* DIVIDER */}

              <div
                className="h-5 w-px bg-white/10"
                aria-hidden="true"
              />

              {/* PAGE INFO */}

              <div className="text-sm text-white/60">
                Page{" "}
                <span className="font-semibold text-white">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {totalPages}
                </span>
              </div>

              {/* DIVIDER */}

              <div
                className="h-5 w-px bg-white/10"
                aria-hidden="true"
              />

              {/* NEXT */}

              {currentPage < totalPages ? (
                <Link
                  href={buildUrl(currentPage + 1)}
                  rel="next"
                  className="text-sm font-medium text-white/70 transition-all duration-200 hover:text-white"
                >
                  Next →
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="text-sm font-medium opacity-30"
                >
                  Next →
                </span>
              )}
            </div>
          </nav>
        )}

        {/* ================= BLOG JSON-LD ================= */}

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "@id": `${SITE_URL}/blog#blog`,
              inLanguage: "id-ID",
              name: BLOG_TITLE,
              description: BLOG_DESCRIPTION,
              url: `${SITE_URL}/blog`,

              blogPost: typedPosts.slice(0, 16).map((p, i) => ({
                "@type": "BlogPosting",
                headline: p.title ?? undefined,
                description: p.excerpt ?? undefined,
                datePublished: toISO(p.publishedAt) ?? undefined,

                author: {
                  "@type": "Person",
                  name: p.author?.name ?? "Ferdy Salsabilla",
                  url: `${SITE_URL}/about`,
                },

                url: `${SITE_URL}/blog/${p.slug}`,

                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/blog/${p.slug}`,
                },

                image: coverOf(p) || undefined,

                position: i + 1,
              })),
            }),
          }}
        />
      </section>
    </main>
  );
}