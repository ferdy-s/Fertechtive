import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortfolioClient from "../../PortfolioClient";
import { CATEGORY_LIST, CategoryValue, CategoryOrAll } from "@/lib/categories";

/* ================= Types ================= */

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

/* ================= Page ================= */

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryParam = params.category.toLowerCase();

  const validCategories = CATEGORY_LIST.map((c) => c.value);

  if (!validCategories.includes(categoryParam as CategoryValue)) {
    return notFound();
  }

  const selected = categoryParam as CategoryValue;

  /* ================= Fetch Data ================= */

  const projectsRaw = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const projects = projectsRaw as unknown as ProjectLike[];

  const filtered = projects.filter((p) => p.category === selected);

  /* ================= Calculate Totals ================= */

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

  /* ================= Pagination ================= */

  const PAGE_SIZE = 6;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = 1;

  const items = filtered.slice(0, PAGE_SIZE);

  /* ================= Render ================= */

  return (
    <PortfolioClient
      items={items}
      totals={totals}
      selected={selected as CategoryOrAll}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
