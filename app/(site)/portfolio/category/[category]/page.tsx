import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import PortfolioClient from "../../PortfolioClient";

import {
  CATEGORY_LIST,
  CategoryValue,
  CategoryOrAll,
} from "@/lib/categories";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

const PAGE_SIZE = 6;

type ProjectLike = {
  id: string;
  slug: string;
  title?: string | null;
  description?: string | null;
  createdAt?: Date | string | null;
  tags?: string[] | null;
  category?: string | null;
  thumbnailUrl?: string | null;
  published?: boolean | null;
};

type Totals = Record<"all" | CategoryValue, number>;

/* ================= CATEGORY ================= */

function getCategory(value: string): CategoryValue | null {
  const normalized = value.toLowerCase();

  const category = CATEGORY_LIST.find(
    (item) => item.value === normalized,
  );

  if (!category || category.value === "all") {
    return null;
  }

  return category.value;
}

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  const selected = getCategory(category);

  if (!selected) {
    return {
      title: "Kategori Portfolio Tidak Ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical =
    `${SITE_URL}/portfolio/category/${selected}`;

  const title =
    `${selected.toUpperCase()} - Portfolio`;

  const description =
    `Kumpulan proyek ${selected.toUpperCase()} karya Ferdy Salsabilla, mencakup project, eksperimen, dan karya digital yang terdokumentasi di Fertechtive.`;

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
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  };
}

/* ================= PAGE ================= */

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const selected = getCategory(category);

  if (!selected) {
    return notFound();
  }

  /* ================= DATABASE ================= */

  const projectsRaw = await prisma.project.findMany({
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

  const projects =
    projectsRaw as unknown as ProjectLike[];

  /* ================= FILTER ================= */

  const filtered = projects
    .filter(
      (project) =>
        project.category === selected,
    )
    .map((project) => ({
      ...project,
      categoryDerived: selected,
    }));

  /* ================= TOTALS ================= */

  const totals: Totals = {
    all: projects.length,
    programming: 0,
    uiux: 0,
    graphic: 0,
    marketing: 0,
  };

  for (const project of projects) {
    if (
      project.category &&
      project.category in totals
    ) {
      totals[
        project.category as keyof Totals
      ] += 1;
    }
  }

  /* ================= PAGINATION ================= */

  const totalItems = filtered.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / PAGE_SIZE,
    ),
  );

  const currentPage = 1;

  const items = filtered.slice(
    0,
    PAGE_SIZE,
  );

  /* ================= STRUCTURED DATA ================= */

  const structuredData = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id":
      `${SITE_URL}/portfolio/category/${selected}#collection`,

    name:
      `${selected.toUpperCase()} - Portfolio`,

    description:
      `Kumpulan proyek ${selected.toUpperCase()} karya Ferdy Salsabilla.`,

    url:
      `${SITE_URL}/portfolio/category/${selected}`,

    inLanguage: "id-ID",

    isPartOf: {
      "@type": "CollectionPage",
      "@id":
        `${SITE_URL}/portfolio#collection`,
      url:
        `${SITE_URL}/portfolio`,
      name:
        "Portfolio Ferdy Salsabilla",
    },

    author: {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
      name: "Ferdy Salsabilla",
      url: `${SITE_URL}/about`,
    },
  };

  /* ================= RENDER ================= */

  return (
    <>
      <PortfolioClient
        items={items}
        totals={totals}
        selected={
          selected as CategoryOrAll
        }
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData,
            ),
        }}
      />
    </>
  );
}