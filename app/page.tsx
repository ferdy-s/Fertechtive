import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Fertechtive | Portfolio Digital Ferdy Salsabilla";

  const description =
    "Fertechtive adalah portfolio digital resmi Ferdy Salsabilla...";

  return {
    title,
    description,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/cover_fertechtive.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/cover_fertechtive.png`],
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
