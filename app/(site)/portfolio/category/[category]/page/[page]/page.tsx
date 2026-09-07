import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import PortfolioClient from "../../../../PortfolioClient";

import {
  CATEGORY_LIST,
  CategoryValue,
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
  categoryDerived?: CategoryValue;
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
  params: Promise<{
    category: string;
    page: string;
  }>;
}): Promise<Metadata> {
  const { category, page } =
    await params;

  const selected =
    getCategory(category);

  const canonical = selected
    ? `${SITE_URL}/portfolio/category/${selected}`
    : `${SITE_URL}/portfolio`;

  return {
    metadataBase: new URL(SITE_URL),

    title: selected
      ? `${selected.toUpperCase()} - Portfolio - Halaman ${page}`
      : `Portfolio - Halaman ${page}`,

    description:
      selected
        ? `Halaman lanjutan portfolio kategori ${selected.toUpperCase()} karya Ferdy Salsabilla.`
        : "Halaman lanjutan portfolio Fertechtive.",

    alternates: {
      canonical,
    },

    robots: {
      index: false,
      follow: true,

      googleBot: {
        index: false,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/* ================= PAGE ================= */

export default async function CategoryPageNumber({
  params,
}: {
  params: Promise<{
    category: string;
    page: string;
  }>;
}) {
  const {
    category,
    page,
  } = await params;

  const selected =
    getCategory(category);

  const pageNumber =
    Number(page);

  /*
   * /page/1 adalah duplikat
   * halaman kategori utama.
   */
  if (
    !selected ||
    !Number.isInteger(
      pageNumber,
    ) ||
    pageNumber < 2
  ) {
    return notFound();
  }

  /* ================= DATABASE ================= */

  const projectsRaw =
    await prisma.project.findMany({
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

  const filtered =
    projects.filter(
      (project) =>
        project.category ===
        selected,
    );

  /* ================= PAGINATION ================= */

  const totalItems =
    filtered.length;

  const totalPages =
    Math.ceil(
      totalItems /
        PAGE_SIZE,
    );

  if (
    pageNumber >
    totalPages
  ) {
    return notFound();
  }

  const start =
    (pageNumber - 1) *
    PAGE_SIZE;

  const items =
    filtered
      .slice(
        start,
        start +
          PAGE_SIZE,
      )
      .map(
        (project) => ({
          ...project,
          categoryDerived:
            selected,
        }),
      );

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
      project.category in
        totals
    ) {
      totals[
        project.category as keyof Totals
      ] += 1;
    }
  }

  /* ================= RENDER ================= */

  return (
    <PortfolioClient
      items={items}
      totals={totals}
      selected={selected}
      currentPage={pageNumber}
      totalPages={totalPages}
    />
  );
}