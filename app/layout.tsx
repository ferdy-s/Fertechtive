// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://l6qsd05x-3000.asse.devtunnels.ms";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Fertechtive",
    template: "%s | Fertechtive",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
