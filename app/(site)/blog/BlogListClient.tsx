"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  LayoutGrid,
  Search,
} from "lucide-react";

/* ================= Types ================= */

type Cat = {
  id: string;
  name: string;
  slug: string;
};

/* ================= Component ================= */

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

  /*
   * One ref for the entire filter section.
   *
   * This avoids the previous problem where the same
   * category ref was attached to both desktop and mobile.
   */
  const sectionRef = useRef<HTMLElement | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [categoryOpen, setCategoryOpen] = useState(false);

  /* ================= URL STATE ================= */

  const activeCat =
    searchParams.get("cat")?.trim().toLowerCase() || "all";

  const queryFromUrl = searchParams.get("q") ?? "";

  /* ================= SEARCH STATE ================= */

  const [search, setSearch] = useState(queryFromUrl);

  /* ================= SYNC SEARCH ================= */

  useEffect(() => {
    setSearch(queryFromUrl);
  }, [queryFromUrl]);

  /* ================= CLOSE DROPDOWN ================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        sectionRef.current &&
        !sectionRef.current.contains(target)
      ) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= ESCAPE ================= */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /* ================= QUERY UPDATE ================= */

  const updateQuery = (
    key: "q" | "cat",
    value?: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    const normalizedValue = value?.trim() ?? "";

    if (!normalizedValue || normalizedValue === "all") {
      params.delete(key);
    } else {
      params.set(key, normalizedValue);
    }

    /*
     * Reset pagination whenever
     * search or category changes.
     */
    params.delete("page");

    const queryString = params.toString();

    startTransition(() => {
      router.replace(
        `${pathname}${queryString ? `?${queryString}` : ""}`,
        {
          scroll: false,
        },
      );
    });
  };

  /* ================= SEARCH ================= */

  const submitSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    updateQuery("q", search);
  };

  /* ================= ACTIVE CATEGORY ================= */

  const activeCategory = categories.find(
    (category) =>
      category.slug.toLowerCase() === activeCat,
  );

  return (
    <section
      ref={sectionRef}
      className="sticky top-[84px] z-30 mb-6 w-full rounded-2xl border border-white/10 bg-[#0C121B]/85 shadow-[0_10px_36px_rgba(0,0,0,0.30)] backdrop-blur-xl"
      aria-label="Filter dan pencarian artikel"
    >
      {/* =========================================================
          DESKTOP / TABLET
          ========================================================= */}

      <div className="hidden min-w-0 items-center gap-3 p-3 sm:flex">
        {/* ================= SEARCH ================= */}

        <div className="min-w-0 flex-1">
          <SearchInput
            inputId={inputId}
            value={search}
            onChange={setSearch}
            onSubmit={submitSearch}
          />
        </div>

        {/* ================= RESULT ================= */}

        <ResultCount
          total={total}
          isPending={isPending}
        />

        {/* ================= FILTER ================= */}

        <FilterControls
          categories={categories}
          activeCat={activeCat}
          activeCategory={activeCategory}
          categoryOpen={categoryOpen}
          setCategoryOpen={setCategoryOpen}
          updateQuery={updateQuery}
        />
      </div>

      {/* =========================================================
          MOBILE
          ========================================================= */}

      <div className="sm:hidden">
        {/* ================= SEARCH ================= */}

        <div className="p-2.5 pb-2">
          <SearchInput
            inputId={inputId}
            value={search}
            onChange={setSearch}
            onSubmit={submitSearch}
            mobile
          />
        </div>

        {/* ================= RESULT + FILTER ================= */}

        <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-2.5 py-2.5">
          <ResultCount
            total={total}
            isPending={isPending}
            mobile
          />

          <FilterControls
            categories={categories}
            activeCat={activeCat}
            activeCategory={activeCategory}
            categoryOpen={categoryOpen}
            setCategoryOpen={setCategoryOpen}
            updateQuery={updateQuery}
            mobile
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SEARCH INPUT
   ============================================================ */

function SearchInput({
  inputId,
  value,
  onChange,
  onSubmit,
  mobile = false,
}: {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={inputId}
        className="sr-only"
      >
        Cari artikel
      </label>

      <Search
        size={mobile ? 18 : 17}
        strokeWidth={1.8}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
      />

      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
        onBlur={onSubmit}
        placeholder="Cari artikel..."
        autoComplete="off"
        className={`w-full rounded-xl border border-white/10 bg-white/[0.04] text-white outline-none transition placeholder:text-white/35 focus:border-white/20 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/10 ${
          mobile
            ? "py-3 pl-10 pr-4 text-sm"
            : "py-2.5 pl-10 pr-4 text-sm"
        }`}
        aria-label="Cari artikel"
      />
    </div>
  );
}

/* ============================================================
   RESULT COUNT
   ============================================================ */

function ResultCount({
  total,
  isPending,
  mobile = false,
}: {
  total: number;
  isPending: boolean;
  mobile?: boolean;
}) {
  return (
    <div
      className="shrink-0 whitespace-nowrap text-xs text-white/45"
      aria-live="polite"
    >
      {isPending ? (
        "Memuat..."
      ) : mobile ? (
        `${total} artikel`
      ) : (
        `${total} artikel ditemukan`
      )}
    </div>
  );
}

/* ============================================================
   FILTER CONTROLS
   ============================================================ */

function FilterControls({
  categories,
  activeCat,
  activeCategory,
  categoryOpen,
  setCategoryOpen,
  updateQuery,
  mobile = false,
}: {
  categories: Cat[];
  activeCat: string;
  activeCategory?: Cat;
  categoryOpen: boolean;

  /*
   * Correct React state setter type.
   *
   * Supports:
   * setCategoryOpen(true)
   * setCategoryOpen(false)
   * setCategoryOpen((open) => !open)
   */
  setCategoryOpen: Dispatch<SetStateAction<boolean>>;

  updateQuery: (
    key: "q" | "cat",
    value?: string,
  ) => void;

  mobile?: boolean;
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="relative flex shrink-0 items-center gap-1">
      {/* ================= SEMUA ================= */}

      <button
        type="button"
        onClick={() => {
          updateQuery("cat", "all");
          setCategoryOpen(false);
        }}
        aria-pressed={activeCat === "all"}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-white/20 ${
          mobile
            ? "px-3 py-2.5"
            : "px-3.5 py-2.5"
        } ${
          activeCat === "all"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
      >
        <LayoutGrid
          size={mobile ? 16 : 17}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <span>Semua</span>
      </button>

      {/* ================= KATEGORI ================= */}

      <button
        type="button"
        onClick={() => {
          setCategoryOpen((open) => !open);
        }}
        aria-expanded={categoryOpen}
        aria-haspopup="listbox"
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-white/20 ${
          mobile
            ? "max-w-[125px] px-3 py-2.5"
            : "max-w-[170px] px-3.5 py-2.5"
        } ${
          activeCat !== "all"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
      >
        <span className="truncate">
          {activeCategory?.name ?? "Kategori"}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className={`shrink-0 transition-transform ${
            categoryOpen
              ? "rotate-180"
              : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* ================= DROPDOWN ================= */}

      {categoryOpen && (
        <div
          role="listbox"
          aria-label="Pilih kategori artikel"
          className={`absolute right-0 top-[calc(100%+8px)] z-50 max-h-[320px] min-w-[190px] max-w-[280px] overflow-y-auto rounded-xl border border-white/10 bg-[#0C121B] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
            mobile
              ? "max-w-[230px]"
              : ""
          }`}
        >
          {/* ================= SEMUA ================= */}

          <CategoryOption
            label="Semua"
            active={activeCat === "all"}
            onClick={() => {
              updateQuery("cat", "all");
              setCategoryOpen(false);
            }}
          />

          {/* ================= CATEGORIES ================= */}

          {categories.map((category) => (
            <CategoryOption
              key={category.id}
              label={category.name}
              active={
                activeCat ===
                category.slug.toLowerCase()
              }
              onClick={() => {
                updateQuery(
                  "cat",
                  category.slug,
                );

                setCategoryOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CATEGORY OPTION
   ============================================================ */

function CategoryOption({
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
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
        active
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="truncate">
        {label}
      </span>
    </button>
  );
}