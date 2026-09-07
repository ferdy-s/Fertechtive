import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

import {
  CATEGORY_LIST,
  CategoryValue,
  CategoryOrAll,
  deriveCategory,
} from "@/lib/categories";

import PortfolioClient from "./PortfolioClient";

/* =================== Constants =================== */

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

const title = "Portfolio";

const description =
  "Kumpulan proyek Full Stack Developer, UI/UX Design, dan Digital Creative karya Ferdy Salsabilla. Dibangun dengan fokus pada performa, skalabilitas, aksesibilitas, dan pengalaman pengguna modern.";

/* =================== SEO =================== */

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<
    Record<string, string | string[] | undefined>
  >;
}): Promise<Metadata> {
  const params = await searchParams;

  const hasCategory =
    typeof params?.category === "string" &&
    params.category.trim() !== "" &&
    params.category.toLowerCase() !== "all";

  const hasPage =
    typeof params?.page === "string" &&
    params.page !== "" &&
    params.page !== "1";

  const isFilteredOrPaginated =
    hasCategory || hasPage;

  const canonical = `${SITE_URL}/portfolio`;

  return {
    metadataBase: new URL(SITE_URL),

    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonical,
      siteName: "Fertechtive",
      title,
      description,

      images: [
        {
          url: `${SITE_URL}/portfolio.png`,
          width: 1200,
          height: 630,
          alt: "Portfolio Full Stack Developer – Fertechtive",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/portfolio.png`],
    },

    robots: {
      index: !isFilteredOrPaginated,
      follow: true,

      googleBot: {
        index: !isFilteredOrPaginated,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/* =================== Types =================== */

type ProjectLike = {
  id: string;
  slug: string;
  title?: string | null;
  description?: string | null;
  createdAt?: Date | string | null;
  thumbnailUrl?: string | null;
  categoryDerived?: CategoryValue;
};

type Totals = Record<"all" | CategoryValue, number>;

/* =================== PAGE =================== */

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<
    Record<string, string | string[] | undefined>
  >;
}) {
  /* ============================================
     PERFORMANCE MONITORING
  ============================================ */

  const pageStart = performance.now();

  /* ============================================
     SEARCH PARAMS
  ============================================ */

  const params = await searchParams;

  /* ============================================
     CATEGORY
  ============================================ */

  const rawCat = params?.category;

  const active = (
    Array.isArray(rawCat) ? rawCat[0] : rawCat
  )?.toLowerCase() as CategoryOrAll | undefined;

  const selected: CategoryOrAll =
    CATEGORY_LIST.find(
      (category) =>
        category.value === (active ?? "all")
    )?.value ?? "all";

  /* ============================================
     PAGINATION
  ============================================ */

  const PAGE_SIZE = 6;

  const rawPage = params?.page;

  const pageParam = Array.isArray(rawPage)
    ? rawPage[0]
    : rawPage;

  const pageFromQuery = Number.parseInt(
    pageParam || "1",
    10
  );

  const pageSafe =
    Number.isFinite(pageFromQuery) &&
    pageFromQuery > 0
      ? pageFromQuery
      : 1;

  /* ============================================
     DATABASE QUERY
  ============================================ */

  const dbStart = performance.now();

  const allRaw = await prisma.project.findMany({
    where: {
      published: true,
    },

    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
  });

  const dbDuration = performance.now() - dbStart;

  console.log(
    `[Portfolio Performance] DB query: ${dbDuration.toFixed(
      2
    )}ms`
  );

  /* ============================================
     DATA PROCESSING
  ============================================ */

  const processingStart = performance.now();

  const enriched: ProjectLike[] = allRaw.map(
    (project) => ({
      ...project,
      categoryDerived: deriveCategory(project),
    })
  );

  const filtered =
    selected === "all"
      ? enriched
      : enriched.filter(
          (project) =>
            project.categoryDerived === selected
        );

  /* ============================================
     CATEGORY TOTALS
  ============================================ */

  const totals: Totals = {
    all: enriched.length,
    programming: 0,
    uiux: 0,
    graphic: 0,
    marketing: 0,
  };

  enriched.forEach((project) => {
    if (project.categoryDerived) {
      totals[project.categoryDerived]++;
    }
  });

  /* ============================================
     PAGINATION
  ============================================ */

  const totalItems = filtered.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE)
  );

  const currentPage = Math.min(
    Math.max(1, pageSafe),
    totalPages
  );

  const start =
    (currentPage - 1) * PAGE_SIZE;

  const items = filtered.slice(
    start,
    start + PAGE_SIZE
  );

  const processingDuration =
    performance.now() - processingStart;

  console.log(
    `[Portfolio Performance] Processing: ${processingDuration.toFixed(
      2
    )}ms`
  );

  /* ============================================
     STRUCTURED DATA
  ============================================ */

  const structuredData = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id": `${SITE_URL}/portfolio#collection`,

    name: "Portfolio Ferdy Salsabilla",

    description,

    url: `${SITE_URL}/portfolio`,

    inLanguage: "id-ID",

    author: {
      "@type": "Person",

      "@id": `${SITE_URL}#person`,

      name: "Ferdy Salsabilla",

      url: `${SITE_URL}/about`,
    },
  };

  /* ============================================
     PERFORMANCE RESULT
  ============================================ */

  const totalDuration =
    performance.now() - pageStart;

  console.log(
    `[Portfolio Performance] Total: ${totalDuration.toFixed(
      2
    )}ms`
  );

  /* ============================================
     RESPONSE
  ============================================ */

  return (
    <>
      <PortfolioClient
        items={items}
        totals={totals}
        selected={selected}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData
          ),
        }}
      />
    </>
  );
}
