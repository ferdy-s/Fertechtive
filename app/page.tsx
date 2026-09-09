import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fertechtive.vercel.app";

const PERSON_ID = `${SITE_URL}/#person`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const WEBPAGE_ID = `${SITE_URL}/#webpage`;

const title = "Fertechtive - Portfolio Digital Ferdy Salsabilla";

const description =
  "Fertechtive adalah portfolio digital Ferdy Salsabilla, Full Stack Developer yang mendokumentasikan project, eksperimen, dan karya dalam software development, web, dan teknologi digital.";

export const metadata: Metadata = {
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
    siteName: "Fertechtive",
    locale: "id_ID",
    images: [
      {
        url: `${SITE_URL}/cover_fertechtive.png`,
        width: 1200,
        height: 630,
        alt: "Fertechtive - Portfolio Digital Ferdy Salsabilla",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Ferdy Salsabilla",
      jobTitle: "Full Stack Developer",
      url: `${SITE_URL}/about`,
      knowsAbout: [
        "Full Stack Development",
        "Web Development",
        "Software Development",
        "Web Application Development",
      ],
      sameAs: [
        "https://github.com/ferdy-s",
        "https://www.linkedin.com/in/ferdysalsabilla",
      ],
    },

    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Fertechtive",
      url: SITE_URL,
      description:
        "Fertechtive adalah portfolio digital Ferdy Salsabilla yang mendokumentasikan karya, project, eksperimen, dan insight dalam software development, web, dan teknologi digital.",
      founder: {
        "@id": PERSON_ID,
      },
    },

    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Fertechtive",
      url: SITE_URL,
      description,
      publisher: {
        "@id": ORGANIZATION_ID,
      },
    },

    {
      "@type": "WebPage",
      "@id": WEBPAGE_ID,
      name: title,
      url: SITE_URL,
      description,
      isPartOf: {
        "@id": WEBSITE_ID,
      },
      about: {
        "@id": PERSON_ID,
      },
      publisher: {
        "@id": ORGANIZATION_ID,
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <HomeClient />
    </>
  );
}