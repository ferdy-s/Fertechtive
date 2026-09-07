import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

// Cache sitemap selama 1 jam
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    /* ================= FETCH DYNAMIC DATA ================= */

    const [projects, posts] = await Promise.all([
      prisma.project.findMany({
        where: {
          publishedAt: {
            not: null,
          },
        },
        select: {
          slug: true,
          updatedAt: true,
          publishedAt: true,
        },
        orderBy: [
          {
            updatedAt: "desc",
          },
          {
            slug: "asc",
          },
        ],
      }),

      prisma.post.findMany({
        where: {
          publishedAt: {
            not: null,
          },
        },
        select: {
          slug: true,
          createdAt: true,
          publishedAt: true,
        },
        orderBy: [
          {
            publishedAt: "desc",
          },
          {
            slug: "asc",
          },
        ],
      }),
    ]);

    /* ================= PROJECT DETAIL ================= */

    const projectEntries: MetadataRoute.Sitemap = projects.map(
      (project) => ({
        url: `${SITE_URL}/portfolio/${project.slug}`,

        lastModified:
          project.updatedAt ??
          project.publishedAt ??
          undefined,

        changeFrequency: "weekly",

        priority: 0.8,
      }),
    );

    /* ================= BLOG DETAIL ================= */

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,

      /*
       * Post tidak memiliki updatedAt.
       * Karena itu publishedAt menjadi timestamp
       * perubahan paling akurat yang tersedia.
       */
      lastModified:
        post.publishedAt ??
        post.createdAt,

      changeFrequency: "weekly",

      priority: 0.8,
    }));

    /* ================= BLOG LISTING ================= */

    /*
     * /blog berubah ketika artikel terbaru dipublikasikan.
     */
    const latestPostPublishedAt =
      posts[0]?.publishedAt;

    /* ================= STATIC PAGES ================= */

    const staticEntries: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,

        changeFrequency: "weekly",

        priority: 1.0,
      },

      {
        url: `${SITE_URL}/about`,

        changeFrequency: "monthly",

        priority: 0.8,
      },

      {
        url: `${SITE_URL}/portfolio`,

        changeFrequency: "weekly",

        priority: 0.9,
      },

      {
        url: `${SITE_URL}/blog`,

        lastModified:
          latestPostPublishedAt ??
          undefined,

        changeFrequency: "daily",

        priority: 0.9,
      },

      {
        url: `${SITE_URL}/contact`,

        changeFrequency: "yearly",

        priority: 0.8,
      },
    ];

    /* ================= FINAL SITEMAP ================= */

    return [
      ...staticEntries,
      ...projectEntries,
      ...blogEntries,
    ];
  } catch (error) {
    console.error("Sitemap error:", error);

    /*
     * Fallback minimal agar sitemap tetap valid
     * ketika database tidak dapat diakses.
     */
    return [
      {
        url: SITE_URL,
      },
    ];
  }
}