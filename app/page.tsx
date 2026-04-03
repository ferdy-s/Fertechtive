export { default } from "./(site)/page";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://l6qsd05x-3000.asse.devtunnels.ms";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Fertechtive | Portfolio Digital Ferdy Salsabilla";

  const description =
    "Fertechtive adalah portfolio digital resmi Ferdy Salsabilla yang menampilkan karya Web Development, UI/UX Design, dan eksplorasi teknologi modern.";

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
