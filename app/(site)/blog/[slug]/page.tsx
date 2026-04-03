import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { makeMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

/* =================== Utils =================== */
async function getOrigin() {
  try {
    // headers() bisa bertipe ReadonlyHeaders ATAU Promise<ReadonlyHeaders> di beberapa setup
    const hx: any = headers();
    const h: Headers =
      typeof hx?.get === "function" ? hx : ((await hx) as Headers);
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    if (host) return `${proto}://${host}`;
  } catch {
    /* ignore */
  }
  // Fallback environment (disarankan set NEXT_PUBLIC_SITE_URL)
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

function fmtDate(d?: string | Date | null) {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function toISO(d?: string | Date | null) {
  if (!d) return undefined;
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString();
}
function readingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* =================== SEO =================== */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, categories: true },
  });

  if (!post) return {};

  const origin = await getOrigin();
  const canonical = `${origin}/blog/${post.slug}`;

  const image = post.coverUrl
    ? post.coverUrl.startsWith("http")
      ? post.coverUrl
      : `${origin}${post.coverUrl}`
    : `${origin}/default-blog.jpg`;

  return {
    title: post.title,
    description: post.excerpt || "",
    alternates: { canonical },

    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.excerpt || "",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [image],
    },
  };
}

/* =========== Hi-Tech Code & Typography Theme (2025) =========== */
const PRISM_INLINE_CSS = `
:root{
  --code-bg: rgba(10,15,21,.92);
  --code-brd: rgba(255,255,255,.10);
  --code-glow: 0 12px 40px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04);
  --code-radius: 16px;
  --code-txt: #eaf1ff;
  --code-muted: #8a90a6;
  --code-kw: #7dd3fc;
  --code-fn: #bca6ff;
  --code-str: #f9a8d4;
  --code-num: #fde68a;
}

/* Prism base */
code[class*="language-"], pre[class*="language-"]{
  color: var(--code-txt);
  background: transparent;
  text-shadow: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  direction: ltr; white-space: pre; word-break: normal; line-height: 1.7;
  tab-size: 2;
}
pre[class*="language-"]{
  position: relative;
  padding: 1rem 1.25rem;
  margin: 1.25rem 0;
  overflow: auto;
  border-radius: var(--code-radius);
  border: 1px solid var(--code-brd);
  background: var(--code-bg);
  box-shadow: var(--code-glow);
  backdrop-filter: blur(6px);
}

/* Soft-wrap (default ON lewat script: data-wrap="on") */
pre[data-wrap="on"] code,
pre[data-wrap="on"]{
  white-space: pre-wrap !important;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Inline code */
:not(pre) > code[class*="language-"]{
  padding:.22em .45em;
  border-radius:.5rem;
  border:1px solid var(--code-brd);
  background:rgba(10,15,21,.78);
}

/* Toolbar chip */
.pre-toolbar{ position:absolute; top:.55rem; right:.55rem; display:flex; gap:.35rem; z-index:2; }
.pre-chip{
  font-size:10px; line-height:1;
  padding:.32rem .55rem; border-radius:.5rem;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);
  color:#c8eaff; user-select:none;
}
.pre-btn{ cursor:pointer; }
.pre-btn:hover{ background:rgba(255,255,255,.10); }

/* Scrollbar halus */
pre::-webkit-scrollbar{ height:10px; width:10px; }
pre::-webkit-scrollbar-track{ background:transparent; }
pre::-webkit-scrollbar-thumb{ background:rgba(255,255,255,.12); border-radius:999px; }

/* Token (cocok dengan Prism & token custom) */
.token.comment,.token.prolog,.token.doctype,.token.cdata,.cm{ color:var(--code-muted); font-style:italic; }
.token.punctuation{ color:#a8b1ff; }
.token.property,.token.tag,.token.constant,.token.symbol,.token.deleted{ color:#ff7aa2; }
.token.boolean,.token.number,.nu{ color:#fde68a; }
.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted,.st{ color:#f9a8d4; }
.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string{ color:#9bd1ff; }
.token.atrule,.token.keyword,.kw{ color:#7dd3fc; }
.token.function,.token.class-name,.fn{ color:#bca6ff; }

/* ===== Typography override (SEO-friendly) ===== */
.rich h2{
  font-size: 26px !important;
  line-height: 1.35;
  font-weight: 800;
  margin: 18px 0 10px;
}
.rich h3{
  font-size: 20px !important;
  line-height: 1.35;
  font-weight: 750;
  margin: 14px 0 8px;
}
@media (min-width: 640px){
  .rich h2{ font-size:28px !important; }
  .rich h3{ font-size:22px !important; }
}
@media (min-width: 1024px){
  .rich h2{ font-size:30px !important; }
  .rich h3{ font-size:24px !important; }
}

.rich p{ margin:0 0 .85rem; }

/* List seperti Word */
.rich ul, .rich ol{ margin:.6rem 0 .9rem; padding-left:1.6rem; }
.rich ul{ list-style:disc; }
.rich ol{ list-style:decimal; }
.rich li > ul, .rich li > ol{ margin:.3rem 0; padding-left:1.3rem; }
.rich ol[type="a"]{ list-style:lower-alpha; }
.rich ol[type="A"]{ list-style:upper-alpha; }
.rich ol[type="i"]{ list-style:lower-roman; }
.rich ol[type="I"]{ list-style:upper-roman; }
.rich ul ul{ list-style:circle; }
.rich ul ul ul{ list-style:square; }
.rich li{ display:list-item; scroll-margin-top: 86px; }
` as const;

/* =========== Code tools (lang badge, WRAP toggle, COPY, safe Prism) =========== */
const CODE_ENHANCE_SCRIPT = `
(function(){
  function detectLangClass(el){
    const cls=(el.className||'').split(/\\s+/);
    for(const c of cls){ if(c.startsWith('language-')) return c.replace('language-',''); }
    return '';
  }
  function guess(txt){
    if(/<\\/?[a-z]/i.test(txt)) return 'markup';
    if(/\\b(fn\\s+[a-zA-Z_]+\\(|let\\s|println!\\(|::)\\b/.test(txt)) return 'rust';
    if(/\\b(function|const|let|=>|console\\.log)\\b/.test(txt)) return 'javascript';
    if(/\\b(def|import|self|print)\\b/.test(txt)) return 'python';
    if(/\\b(public|class|new)\\b/.test(txt)) return 'java';
    if(/\\b(#include|std::|printf)\\b/.test(txt)) return 'cpp';
    if(/\\bSELECT\\b|\\bFROM\\b|\\bWHERE\\b/i.test(txt)) return 'sql';
    if(/\\$\\w+\\s*=/.test(txt)) return 'bash';
    return 'text';
  }
  function alreadyTokenized(html){
    return /<span\\s+class="(kw|st|cm|fn|tg|at)"/.test(html);
  }
  function enhanceOne(code){
    const pre=code.parentElement; if(!pre||pre.dataset.enhanced) return;
    pre.dataset.enhanced='1';

    /* default: soft-wrap ON */
    pre.setAttribute('data-wrap','on');

    /* language badge */
    let lang=detectLangClass(code)||guess(code.textContent||'')||'text';
    code.classList.add('language-'+lang);

    /* toolbar */
    const bar=document.createElement('div'); bar.className='pre-toolbar';
    const badge=document.createElement('span'); badge.className='pre-chip'; badge.textContent=(lang||'TEXT').toUpperCase();
    const wrapBtn=document.createElement('button'); wrapBtn.type='button'; wrapBtn.className='pre-chip pre-btn'; wrapBtn.textContent='WRAP';
    wrapBtn.onclick=()=>{ const on=pre.getAttribute('data-wrap')==='on'; pre.setAttribute('data-wrap', on?'off':'on'); wrapBtn.textContent=on?'NOWRAP':'WRAP'; };
    const copyBtn=document.createElement('button'); copyBtn.type='button'; copyBtn.className='pre-chip pre-btn'; copyBtn.textContent='COPY';
    copyBtn.onclick=async()=>{ try{ await navigator.clipboard.writeText(code.textContent||''); copyBtn.textContent='COPIED'; setTimeout(()=>copyBtn.textContent='COPY',1200);}catch(e){} };
    bar.append(badge,wrapBtn,copyBtn); pre.insertBefore(bar,code);

    /* Prism hanya jika belum ada token custom */
    if(window.Prism && !alreadyTokenized(code.innerHTML)){
      try{ Prism.highlightElement(code); }catch(e){}
    }
  }
  function enhance(){ document.querySelectorAll('pre > code').forEach(enhanceOne); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhance); else enhance();
  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
})();
` as const;

/* =================== PAGE =================== */
export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, categories: true },
  });

  if (!post || !post.publishedAt) return notFound();

  const readTime = readingTime(post.content);
  const isoDate = toISO(post.publishedAt);
  const year = new Date().getFullYear();
  const firstCategory = post.categories?.[0];

  // Canonical absolute untuk JSON-LD
  const origin = await getOrigin();
  const canonical = `${origin}/blog/${post.slug}`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: isoDate,
    dateModified: isoDate, // ✅ hindari akses post.updatedAt (menghapus error tipe)
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    mainEntityOfPage: canonical,
    image: post.coverUrl ? [post.coverUrl] : undefined,
    articleSection: firstCategory?.name,
    inLanguage: "id-ID",
    wordCount: post.content
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/).length,
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: `${origin}/blog`,
      },
      ...(firstCategory
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: firstCategory.name,
              item: `${origin}/blog/cat/${firstCategory.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: firstCategory ? 3 : 2,
        name: post.title,
        item: canonical,
      },
    ],
  };

  return (
    <main className="relative isolate min-h-screen bg-[#05060A] text-white overflow-hidden">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_12%_-5%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(1200px_600px_at_90%_10%,rgba(139,92,246,0.12),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.26) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.26) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Content Container */}
      <article
        itemScope
        itemType="https://schema.org/Article"
        className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14 pt-36 sm:pt-44 md:pt-52 pb-28 sm:pb-36 md:pb-48"
      >
        {/* Breadcrumb */}
        <nav
          className="mb-8 sm:mb-10 text-[13px] sm:text-sm text-white/60 flex flex-wrap gap-1 items-center"
          aria-label="Breadcrumb"
        >
          <Link href="/blog" className="hover:text-cyan-400 transition">
            Blog
          </Link>
          <span aria-hidden>/</span>
          {firstCategory ? (
            <>
              <Link
                href={`/blog/cat/${firstCategory.slug}`}
                className="hover:text-cyan-400 transition"
              >
                {firstCategory.name}
              </Link>
              <span aria-hidden>/</span>
            </>
          ) : null}
          <span className="text-white/80 line-clamp-1" itemProp="headline">
            {post.title}
          </span>
        </nav>

        {/* Hero Image */}
        {post.coverUrl ? (
          <div className="relative aspect-[16/9] w-full mb-8 sm:mb-12 rounded-[28px] sm:rounded-[32px] md:rounded-[36px] overflow-hidden border border-white/10 bg-[#0B0F15]">
            <Image
              src={post.coverUrl}
              alt={post.title ?? "Cover"}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="object-cover object-center will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          </div>
        ) : null}

        {/* Header */}
        <header className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-bold leading-[1.08] mb-3 sm:mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p
              className="text-white/75 text-base sm:text-lg md:text-xl mb-4 sm:mb-5 max-w-3xl"
              itemProp="description"
            >
              {post.excerpt}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/60">
            {post.author?.name ? (
              <span>
                Oleh{" "}
                <span className="text-white/80" itemProp="author">
                  {post.author.name}
                </span>
              </span>
            ) : null}
            <span aria-hidden>•</span>
            <time dateTime={isoDate} itemProp="datePublished">
              {fmtDate(post.publishedAt)}
            </time>
            <span aria-hidden>•</span>
            <span>{readTime} menit baca</span>
          </div>
        </header>

        {/* Content */}
        <section
          className="
            rich
            prose prose-invert max-w-none
            prose-headings:font-semibold prose-headings:text-white
            prose-p:text-[16px] sm:prose-p:text-[17px] prose-p:text-white/85
            prose-a:text-cyan-400 hover:prose-a:text-cyan-300
            prose-li:marker:text-white/40
            prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-lg
            prose-pre:m-0 prose-pre:rounded-xl prose-code:text-[85%]
            leading-relaxed
          "
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-10 border-t border-white/10 text-white/60 text-xs sm:text-sm">
          {post.categories?.length ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/cat/${cat.slug}`}
                  className="px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-xs sm:text-sm text-white/80 transition"
                >
                  #{cat.name}
                </Link>
              ))}
            </div>
          ) : null}
          <p className="flex flex-wrap gap-2">
            <span>Bagian dari seri</span>
            <Link
              href="/blog"
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              Tips &amp; Trik
            </Link>
            <span>• © {year}.</span>
          </p>
        </footer>
      </article>

      {/* Inline CSS untuk Prism & Typography */}
      <style dangerouslySetInnerHTML={{ __html: PRISM_INLINE_CSS }} />

      {/* Prism + Autoloader CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js"
        strategy="afterInteractive"
      />
      <Script id="prism-autoloader-path" strategy="afterInteractive">
        {`if(window.Prism&&Prism.plugins&&Prism.plugins.autoloader){Prism.plugins.autoloader.languages_path='https://cdn.jsdelivr.net/npm/prismjs@1/components/';}`}
      </Script>

      {/* Script tools: badge, wrap toggle, copy, safe Prism */}
      <Script id="code-enhance-tools" strategy="afterInteractive">
        {CODE_ENHANCE_SCRIPT}
      </Script>

      {/* JSON-LD Article & Breadcrumb (SEO) */}
      <Script
        id="ld-article"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLdArticle)}
      </Script>
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLdBreadcrumb)}
      </Script>
    </main>
  );
}
