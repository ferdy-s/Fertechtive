import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fertechtive.vercel.app";

// 🔥 CACHE 1 JAM
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
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

    /* ================= BLOG (WAJIB kalau ada) ================= */
    const posts = await prisma.post.findMany({
      where: { publishedAt: { not: null } },
      select: {
        slug: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ?? post.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    /* ================= STATIC ================= */
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

    return [...staticEntries, ...projectEntries, ...blogEntries];
  } catch (error) {
    console.error("Sitemap error:", error);

    // fallback minimal (biar tidak crash)
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
      },
    ];
  }
}
