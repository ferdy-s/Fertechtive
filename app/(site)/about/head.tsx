const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://your-devtunnel-url.dev";

export default function Head() {
  const title =
    "Tentang Ferdy Salsabilla | Web Developer & UI/UX Designer – Fertechtive";

  const description =
    "Profil lengkap Ferdy Salsabilla, Web Developer dan UI/UX Designer dengan pengalaman 3+ tahun dalam membangun website modern dan scalable.";

  const url = `${SITE_URL}/about`;
  const image = `${SITE_URL}/cover_fertechtive.png`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
