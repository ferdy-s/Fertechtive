import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PortfolioClient from "../../PortfolioClient";
import { CATEGORY_LIST, CategoryValue } from "@/lib/categories";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

const PAGE_SIZE = 6;

const description =
  "Kumpulan proyek Full Stack Developer, UI/UX Design, dan Digital Creative karya Ferdy Salsabilla.";

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

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;

  const canonical = `${SITE_URL}/portfolio`;

  return {
    metadataBase: new URL(SITE_URL),

    title: `Portfolio - Halaman ${page}`,

    description,

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

export default async function PortfolioPageNumber({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  const pageNumber = Number(page);

  /*
   * /portfolio/page/1 adalah duplikat /portfolio.
   * Jangan biarkan URL ini menjadi halaman valid.
   */
  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 2
  ) {
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

  const projects = projectsRaw as unknown as ProjectLike[];

  /* ================= PAGINATION ================= */

  const totalItems = projects.length;

  const totalPages = Math.ceil(
    totalItems / PAGE_SIZE,
  );

  if (pageNumber > totalPages) {
    return notFound();
  }

  const start = (pageNumber - 1) * PAGE_SIZE;

  /* ================= CATEGORY ================= */

  const validCategories = new Set(
    CATEGORY_LIST
      .filter(
        (category) =>
          category.value !== "all",
      )
      .map(
        (category) =>
          category.value,
      ),
  );

  const items = projects
    .slice(
      start,
      start + PAGE_SIZE,
    )
    .map((project) => ({
      ...project,

      categoryDerived:
        project.category &&
        validCategories.has(
          project.category as CategoryValue,
        )
          ? (project.category as CategoryValue)
          : undefined,
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

  /* ================= RENDER ================= */

  return (
    <PortfolioClient
      items={items}
      totals={totals}
      selected="all"
      currentPage={pageNumber}
      totalPages={totalPages}
    />
  );
}