import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fertechtive.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ================= PROJECTS ================= */
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
  });

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  /* ================= STATIC PAGES ================= */
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return [...staticEntries, ...projectEntries];
}
