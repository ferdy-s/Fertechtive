import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://l6qsd05x-3000.asse.devtunnels.ms";

const title = "Tentang";

const description =
  "Profil lengkap Ferdy Salsabilla, Web Developer dan UI/UX Designer dengan pengalaman lebih dari 3 tahun dalam membangun website modern, scalable, berorientasi performa, aksesibilitas, serta pengalaman pengguna.";

const url = `${SITE_URL}/about`;
const image = `${SITE_URL}/cover_fertechtive.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title,
  description,

  keywords: [
    "Ferdy Salsabilla",
    "Tentang Ferdy",
    "Web Developer Indonesia",
    "UI UX Designer Indonesia",
    "Frontend Developer",
    "Digital Creative Portfolio",
    "Profil Web Developer",
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
        alt: "Tentang Ferdy Salsabilla – Web Developer & UI/UX Designer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@username", // optional
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
  return <AboutClient />;
}
