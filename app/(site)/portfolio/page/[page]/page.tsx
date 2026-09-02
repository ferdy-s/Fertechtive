import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PortfolioClient from "../../PortfolioClient";
import { CATEGORY_LIST, CategoryValue } from "@/lib/categories";

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

export default async function PortfolioPageNumber({
  params,
}: {
  params: { page: string };
}) {
  const pageNumber = Number(params.page);

  if (!Number.isFinite(pageNumber) || pageNumber < 1) {
    return notFound();
  }

  const PAGE_SIZE = 6;

  const projectsRaw = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const projects = projectsRaw as unknown as ProjectLike[];

  const totalItems = projects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  if (pageNumber > totalPages) {
    return notFound();
  }

  const start = (pageNumber - 1) * PAGE_SIZE;

  const validCategories = new Set(
    CATEGORY_LIST
      .filter((category) => category.value !== "all")
      .map((category) => category.value),
  );

  const items = projects
    .slice(start, start + PAGE_SIZE)
    .map((p) => ({
      ...p,
      categoryDerived:
        p.category && validCategories.has(p.category as CategoryValue)
          ? (p.category as CategoryValue)
          : undefined,
    }));

  const totals: Totals = {
    all: projects.length,
    programming: 0,
    uiux: 0,
    graphic: 0,
    marketing: 0,
  };

  for (const p of projects) {
    if (p.category && p.category in totals) {
      totals[p.category as keyof Totals] += 1;
    }
  }

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