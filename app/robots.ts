import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fertechtive.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // tambahkan disallow jika perlu
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
