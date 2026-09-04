import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import PageTransition from "@/components/page-transition/PageTransition";

// ✅ Gunakan SATU font saja (Inter sudah cukup)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ✅ gunakan domain production
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fertechtive.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Fertechtive",
    template: "%s | Fertechtive",
  },

  description:
    "Fertechtive adalah platform teknologi dan insight digital terbaru, membahas AI, development, dan inovasi masa depan.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: "Fertechtive",
    description: "Platform teknologi dan insight digital terbaru.",
    url: SITE_URL,
    siteName: "Fertechtive",
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Fertechtive",
    description: "Platform teknologi dan insight digital terbaru.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <PageTransition />

        {children}

        {/* Microsoft Clarity */}
        <Script
  id="microsoft-clarity"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "ybzlhzw9u2");
    `,
  }}
/>
      </body>
    </html>
  );
}