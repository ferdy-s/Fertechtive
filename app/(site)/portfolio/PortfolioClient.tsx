"use client";

import Link from "next/link";
import Image from "next/image";
import { FolderOpen, LayoutGrid } from "lucide-react";
import { ArrowRight } from "lucide-react";

import {
  CATEGORY_LIST,
  CategoryValue,
  CategoryOrAll,
  labelForCategory,
  iconForCategory,
} from "@/lib/categories";

/** Types */
type ProjectLike = {
  id: string;
  slug: string;
  title?: string | null;
  description?: string | null;
  createdAt?: Date | string | null;
  tags?: string[] | null;
  category?: string | null;
  thumbnailUrl?: string | null;
  published?: boolean | null;
  categoryDerived?: CategoryValue;
};

type Totals = Record<"all" | CategoryValue, number>;

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

function timeAgo(input?: Date | string | null) {
  const dd = input ? new Date(input) : new Date();
  const diff = Date.now() - dd.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}j`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}h`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon}bln`;
  return `${Math.floor(mon / 12)}th`;
}

function buildUrl({
  category,
  page,
}: {
  category?: CategoryOrAll;
  page?: number;
}) {
  if (!category || category === "all") {
    return page && page > 1 ? `/portfolio/page/${page}` : `/portfolio`;
  }

  return page && page > 1
    ? `/portfolio/category/${category}/page/${page}`
    : `/portfolio/category/${category}`;
}

export default function PortfolioClient({
  items,
  totals,
  selected,
  currentPage,
  totalPages,
}: {
  items: ProjectLike[];
  totals: Totals;
  selected: CategoryOrAll;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <section className="relative overflow-x-hidden">
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(56,189,248,.30), rgba(167,139,250,.22) 60%, transparent 70%)",
        }}
      />

      {/* HERO */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-6 md:pt-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="order-first lg:order-last">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-1 mt-23">
              <div className="relative aspect-[16/8] w-full overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/portfolio.png"
                  alt="Showcase"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="order-last lg:order-first space-y-5 lg:pl-10 xl:pl-10">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Jelajahi{" "}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>
            <p className="mt-5 text-[15px] md:text-[17px] lg:text-[15px] text-white/80 leading-relaxed max-w-2xl">
              Kumpulan karya profesional dalam Web Development, UI/UX Design,
              Graphic Design, dan Digital Marketing, dengan fokus pada performa,
              user experience, dan optimalisasi SEO untuk menghasilkan solusi
              digital yang efektif dan berdampak.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-medium text-black transition hover:bg-white/90"
              >
                Jelajahi Tips
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-base font-medium text-white hover:bg-white/10 transition"
              >
                Kolaborasi
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CategoryBar active={selected} totals={totals} />

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 pb-10">
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 && (
            <div className="col-span-full">
              <EmptyState />
            </div>
          )}

          {items.map((p) => {
            const createdAt = p.createdAt ?? new Date().toISOString();

            return (
              <Link
                key={p.id}
                href={`/portfolio/${p.slug}`}
                className={cx(
                  "group relative rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur-xl",
                  "transition-transform duration-300 hover:-translate-y-0.5",
                  "shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]",
                )}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity [background:radial-gradient(120%_120%_at_0%_0%,rgba(99,102,241,.12),transparent_40%)]" />

                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl border-b border-white/10">
                  {p.thumbnailUrl ? (
                    <img
                      src={p.thumbnailUrl}
                      alt={p.title ?? "Thumbnail"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-xs opacity-70">
                      Preview not available
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wide">
                      {iconForCategory(p.categoryDerived)}
                      {labelForCategory(p.categoryDerived ?? "programming")}
                    </span>
                    <time
                      className="ml-auto text-[10px] opacity-60"
                      dateTime={new Date(createdAt).toISOString()}
                    >
                      {timeAgo(createdAt)}
                    </time>
                  </div>

                  <h3 className="mt-3 text-base font-semibold leading-tight md:text-lg">
                    {p.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm opacity-80">
                    {p.description}
                  </p>

                  <span className="mt-4 inline-flex items-center text-sm font-medium opacity-90">
                    Lihat detail
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {totalPages > 1 && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            selected={selected}
          />
        )}
      </div>
    </section>
  );
}

/* ——— Category Bar (mobile + desktop) ——— */
function CategoryBar({
  active,
  totals,
}: {
  active: CategoryOrAll;
  totals: Totals;
}) {
  return (
    <div className="sticky top-16 z-20 mt-8 mb-8">
      {/* MOBILE */}
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:hidden">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
          <div className="mb-4">
            <Link
              href="/portfolio"
              aria-current={active === "all" ? "page" : undefined}
              className={cx(
                "flex w-full items-center gap-2 rounded-full px-4 py-2 text-sm",
                "border border-white/10 bg-white/[0.06] hover:bg-white/[0.10] backdrop-blur",
                active === "all"
                  ? "ring-2 ring-violet-400/40"
                  : "ring-1 ring-inset ring-white/5",
              )}
            >
              <LayoutGrid className="h-4 w-4 opacity-85 shrink-0" />
              <span className="mx-1 flex-1 text-center leading-tight text-balance sm:truncate">
                Lihat Semua Hasil Karya Saya
              </span>
              <span className="grid place-items-center rounded-full border border-white/15 bg-black/30 px-2.5 py-2.5 text-[10px] leading-none shrink-0">
                {totals.all}
              </span>
            </Link>
          </div>

          {/* MOBILE */}
          <div className="grid grid-cols-2 gap-3.5">
            {CATEGORY_LIST.filter((c) => c.value !== "all").map(
              ({ value, icon: Icon, label }) => (
                <Link
                  key={value}
                  href={buildUrl({ category: value })}
                  aria-current={active === value ? "page" : undefined}
                  className={cx(
                    "relative grid h-24 place-items-center overflow-hidden rounded-2xl",
                    "border border-white/10 bg-white/[0.06] backdrop-blur",
                    "transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/[0.10]",
                    active === value
                      ? "ring-2 ring-violet-400/40"
                      : "ring-1 ring-inset ring-white/5",
                  )}
                >
                  <span className="absolute right-2 top-2 grid h-5 min-w-[20px] place-items-center rounded-full border border-white/15 bg-black/30 px-1.5 text-[10px] leading-none">
                    {totals[value as CategoryValue]}
                  </span>
                  <div className="flex flex-col items-center">
                    <Icon className="h-5 w-5 opacity-85" />
                    <span className="mt-1.5 text-sm font-semibold leading-none">
                      {label}
                    </span>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="mx-auto hidden max-w-screen-2xl px-4 sm:px-6 lg:block">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORY_LIST.map(({ value, label, icon: Icon }) => (
              <Link
                key={value}
                href={buildUrl({ category: value })}
                aria-current={active === value ? "page" : undefined}
                className={cx(
                  "relative inline-flex items-center gap-2 rounded-full text-sm font-medium transition",
                  "border border-white/10 bg-white/[0.06] backdrop-blur",
                  "hover:bg-white/[0.10]",
                  "h-10 px-4",
                  active === value
                    ? "ring-2 ring-violet-400/40"
                    : "ring-1 ring-inset ring-white/5",
                )}
              >
                <Icon className="h-4 w-4 opacity-85" />
                <span className="leading-none">{label}</span>
                <span className="ml-1 inline-grid place-items-center rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] leading-none">
                  {value === "all" ? totals.all : totals[value]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Pagination (mobile + desktop) ——— */
function PaginationBar({
  currentPage,
  totalPages,
  selected,
}: {
  currentPage: number;
  totalPages: number;
  selected: CategoryOrAll;
}) {
  const prevUrl =
    currentPage > 1
      ? buildUrl({ category: selected, page: currentPage - 1 })
      : undefined;

  const nextUrl =
    currentPage < totalPages
      ? buildUrl({ category: selected, page: currentPage + 1 })
      : undefined;

  return (
    <nav
      className="mt-16 flex justify-center px-4"
      role="navigation"
      aria-label="Pagination"
    >
      <div
        className="
          flex items-center justify-between
          w-full max-w-md sm:max-w-lg md:max-w-xl
          rounded-full
          border border-white/10
          bg-white/[0.05]
          backdrop-blur-xl
          shadow-lg
          overflow-hidden
        "
      >
        {/* Previous */}
        <Link
          href={prevUrl || "#"}
          aria-disabled={!prevUrl}
          className={`
            flex-1 text-left
            px-4 sm:px-6 py-3
            text-sm sm:text-base
            text-white/70
            hover:text-white
            transition-all duration-200
            ${!prevUrl ? "pointer-events-none opacity-30" : ""}
          `}
        >
          ← Previous
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10" />

        {/* Page Info */}
        <div className="px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-white whitespace-nowrap">
          Page {currentPage} of {totalPages}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10" />

        {/* Next */}
        <Link
          href={nextUrl || "#"}
          aria-disabled={!nextUrl}
          className={`
            flex-1 text-right
            px-4 sm:px-6 py-3
            text-sm sm:text-base
            text-white/70
            hover:text-white
            transition-all duration-200
            ${!nextUrl ? "pointer-events-none opacity-30" : ""}
          `}
        >
          Next →
        </Link>
      </div>
    </nav>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06]">
        <FolderOpen className="h-5 w-5 opacity-80" />
      </div>
      <p className="text-sm opacity-85">Belum ada proyek pada kategori ini.</p>
    </div>
  );
}
