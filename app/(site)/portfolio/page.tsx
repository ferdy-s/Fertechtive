import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  CATEGORY_LIST,
  CategoryValue,
  CategoryOrAll,
  deriveCategory,
} from "@/lib/categories";

import PortfolioClient from "./PortfolioClient";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

const title = "Portfolio";

const description =
  "Kumpulan proyek Web Development, UI/UX Design, dan Digital Creative karya Ferdy Salsabilla. Dibangun dengan fokus pada performa, skalabilitas, aksesibilitas, dan pengalaman pengguna modern.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const baseUrl = `${SITE_URL}/portfolio`;

  const category =
    typeof searchParams?.category === "string" ? searchParams.category : "all";

  const page = typeof searchParams?.page === "string" ? searchParams.page : "1";

  const canonical =
    category === "all" && page === "1"
      ? baseUrl
      : `${baseUrl}?category=${category}&page=${page}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
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
          alt: "Portfolio Web Development & UI/UX – Fertechtive",
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
      index: true,
      follow: true,
    },
  };
}

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

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const rawCat = searchParams?.category;
  const active = (Array.isArray(rawCat) ? rawCat[0] : rawCat)?.toLowerCase() as
    | CategoryOrAll
    | undefined;

  const selected: CategoryOrAll =
    CATEGORY_LIST.find((c) => c.value === (active ?? "all"))?.value ?? "all";

  const PAGE_SIZE = 6;

  const rawPage = searchParams?.page;
  const pageParam = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const pageFromQuery = Number.parseInt(pageParam || "1", 10);
  const pageSafe =
    Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;

  const allRaw =
    (await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })) || [];

  const enriched: ProjectLike[] = allRaw.map((p) => ({
    ...p,
    categoryDerived: deriveCategory(p),
  }));

  const filtered =
    selected === "all"
      ? enriched
      : enriched.filter((p) => p.categoryDerived === selected);

  const totals: Totals = {
    all: enriched.length,
    programming: 0,
    uiux: 0,
    graphic: 0,
    marketing: 0,
  };

  enriched.forEach((p) => {
    if (p.categoryDerived) {
      totals[p.categoryDerived]++;
    }
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, pageSafe), totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Portfolio Ferdy Salsabilla",
    description,
    url: `${SITE_URL}/portfolio`,
    author: {
      "@type": "Person",
      name: "Ferdy Salsabilla",
    },
  };

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
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
