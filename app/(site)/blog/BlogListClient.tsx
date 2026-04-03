"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* ===== Types (SESUAI PRISMA) ===== */
type Cat = {
  id: string;
  name: string;
  slug: string;
};

export default function BlogListClient({
  categories,
  total,
}: {
  categories: Cat[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputId = useId();

  const activeCat = searchParams.get("cat") ?? "all";
  const queryFromUrl = searchParams.get("q") ?? "";

  /* ===== Controlled Search State ===== */
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState(queryFromUrl);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  /* ===== Update Query Params ===== */
  const updateQuery = (key: "q" | "cat", value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page"); // reset pagination

    startTransition(() => {
      router.replace(
        `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false },
      );
    });
  };

  return (
    <>
      {/* ================= SEARCH ================= */}
      <section
        className="sticky top-[84px] z-30 mb-4 rounded-2xl border border-white/12 bg-[#0C121B]/80 backdrop-blur-xl shadow-[0_10px_36px_rgba(0,0,0,0.35)]"
        role="search"
        aria-label="Pencarian artikel"
      >
        <div className="p-4 sm:px-5 sm:py-5">
          <label
            htmlFor={inputId}
            className="mb-5 block text-[12px] uppercase tracking-widest text-white/50"
          >
            Pencarian Cepat
          </label>

          <div className="relative">
            <input
              id={inputId}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateQuery("q", search);
                }
              }}
              onBlur={() => {
                updateQuery("q", search);
              }}
              placeholder="Cari topik tips & trik ..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 sm:px-5 pl-12 sm:pl-14 py-3 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />

            <svg
              className="absolute left-4 sm:left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 7.5a7.5 7.5 0 0 0 9.15 9.15Z"
              />
            </svg>
          </div>

          <p className="mt-5 text-xs text-white/60">
            {isPending ? "Memuat…" : `${total} artikel ditemukan`}
          </p>
        </div>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      {categories.length > 0 && (
        <nav
          className="sticky top-[152px] z-20 mb-10 rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-xl"
          aria-label="Filter kategori"
        >
          <div className="overflow-x-auto px-3 py-3 sm:px-4">
            <ul className="flex min-w-max gap-2 sm:gap-3">
              {/* ALL */}
              <li>
                <Chip
                  label="Semua"
                  active={activeCat === "all"}
                  onClick={() => updateQuery("cat", "all")}
                />
              </li>

              {/* DYNAMIC CATEGORIES FROM DB */}
              {categories.map((c) => (
                <li key={c.id}>
                  <Chip
                    label={c.name}
                    active={activeCat === c.slug}
                    onClick={() => updateQuery("cat", c.slug)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}

/* ================= CHIP ================= */
function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
        active
          ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-black"
          : "bg-white/[0.06] text-white/85 hover:bg-white/[0.12]"
      }`}
    >
      {label}
    </button>
  );
}
