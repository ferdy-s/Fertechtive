import type { Metadata } from "next";
import ContactClient from "./ContactClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://l6qsd05x-3000.asse.devtunnels.ms";

const title = "Kontak";

const description =
  "Hubungi Ferdy Salsabilla untuk kolaborasi Web Development, UI/UX Design, dan pengembangan produk digital modern. Konsultasi proyek, kerja sama, atau diskusi teknologi.";

const url = `${SITE_URL}/contact`;
const image = `${SITE_URL}/hubungi.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title,
  description,

  keywords: [
    "Kontak Web Developer",
    "Hire Web Developer Indonesia",
    "Jasa UI UX Designer",
    "Hubungi Ferdy Salsabilla",
    "Kolaborasi Digital Project",
    "Frontend Developer Indonesia",
  ],

  authors: [{ name: "Ferdy Salsabilla" }],
  creator: "Ferdy Salsabilla",
  publisher: "Fertechtive",

  alternates: {
    canonical: url,
  },

  openGraph: {
    type: "profile",
    locale: "id_ID",
    url,
    siteName: "Fertechtive",
    title,
    description,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "Kontak Ferdy Salsabilla – Web Developer & UI/UX Designer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@username",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "technology",
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#contact`,
    url,
    name: "Kontak Ferdy Salsabilla",
    description,
    image: {
      "@type": "ImageObject",
      url: image,
      contentUrl: image,
      width: 1200,
      height: 630,
      caption: "Kontak Ferdy Salsabilla – Web Developer & UI/UX Designer",
    },
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
      name: "Ferdy Salsabilla",
      jobTitle: "Web Developer & UI/UX Designer",
      url: SITE_URL,
      image: {
        "@type": "ImageObject",
        url: image,
        contentUrl: image,
        width: 1200,
        height: 630,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "ferdysalsabilla87@gmail.com",
        availableLanguage: ["Indonesian", "English"],
      },
    },
  };

  return (
    <>
      <ContactClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
