// app/admin/projects/page.tsx
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { deriveCategory } from "@/lib/categories";

import FilePicker from "./FilePicker";
import CategorySelect from "./CategorySelect";
import SlugField from "./SlugField";
import RichTextEditor from "./RichTextEditor";
import { upsertProject, deleteProject, togglePublish } from "./actions";

/* =========================================
   Lightweight types (tanpa ketergantungan Prisma types)
========================================= */
type DBProject = {
  id: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  content?: string | null;
  createdAt?: Date | string | null;
  tags?: unknown; // biasanya Json
  images?: unknown; // biasanya Json
  thumbnailUrl?: string | null;
  published?: boolean | null;

  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;

  // custom
  category?: string | null;
};

type ProjectRow = DBProject & { categoryShown: string | null };

/* =========================================
   Small utils
========================================= */
const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x)) : [];

const firstImage = (v: unknown): string | null => {
  const arr = asStringArray(v);
  return arr.length ? arr[0] : null;
};

/* =========================================
   Data layer (dengan koneksi aman)
========================================= */
async function canConnect(): Promise<boolean> {
  try {
    await prisma.$connect();
    return true;
  } catch (e) {
    console.error("[admin/projects] DB connect failed:", e);
    return false;
  }
}

async function getData(): Promise<DBProject[]> {
  if (!(await canConnect())) return [];
  try {
    const rows = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows as unknown as DBProject[];
  } catch (e) {
    console.error("[admin/projects] findMany failed:", e);
    return [];
  }
}

/* =========================================
   Page
========================================= */
export default async function AdminProjectsPage() {
  const itemsRaw = await getData();

  // Tampilkan kategori: pakai yang tersimpan, kalau kosong derive dari metadata
  const items: ProjectRow[] = itemsRaw.map((p: DBProject) => {
    const tagsArr = asStringArray(p.tags);
    const derived = deriveCategory({
      tags: tagsArr,
      title: p.title ?? "",
      description: p.description ?? "",
    });
    return { ...p, categoryShown: p.category ?? derived ?? null };
  });

  return (
    <div className="grid gap-6">
      {/* CREATE */}
      <form
        action={upsertProject}
        className={[
          "relative overflow-hidden rounded-3xl p-5 md:p-6",
          "border border-white/10 bg-white/[0.03] backdrop-blur",
          "shadow-[0_10px_30px_-12px_rgba(0,0,0,.45)]",
          "ring-1 ring-inset ring-white/5",
          "before:absolute before:inset-0 before:-z-10 before:rounded-[28px]",
          "before:bg-[radial-gradient(120%_120%_at_0%_0%,rgba(99,102,241,.18),transparent_45%)]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide">
            Create Project
          </div>
          <span className="text-xs opacity-70">Fields bertanda * wajib</span>
        </div>

        {/* Title + Slug */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field name="title" label="Title" required />
          <SlugField basePath="/portfolio" />
        </div>

        {/* Category + Published */}
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <CategorySelect required />
          <label className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
            <span>Published</span>
            <input
              type="checkbox"
              name="published"
              className="h-4 w-4 rounded border border-white/15 bg-black/40 outline-none"
            />
          </label>
        </div>

        {/* Deskripsi singkat */}
        <div className="mt-3">
          <Textarea name="description" label="Short Description" required />
        </div>

        {/* Detail (Rich Text) */}
        <div className="mt-3">
          <RichTextEditor name="content" label="Detail (Rich Text)" />
        </div>

        {/* Tags + Images */}
        <div className="mt-3 grid gap-4">
          <Field
            name="tags"
            label="Tags"
            hint="comma / new lines (e.g. next.js, uiux)"
          />
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <FilePicker
              name="images"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              maxBytes={8 * 1024 * 1024}
              maxFiles={12}
            />
          </div>
        </div>

        {/* ===== SEO Section ===== */}
        <div
          className={[
            "mt-4 rounded-2xl border border-white/10 bg-gradient-to-br",
            "from-violet-500/5 via-sky-400/5 to-transparent p-4",
          ].join(" ")}
        >
          <div className="mb-2 text-sm font-semibold tracking-wide">SEO</div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              name="metaTitle"
              label="Meta Title"
              hint="Ideal 50–70 karakter"
            />
            <Field
              name="canonicalUrl"
              label="Canonical URL"
              hint="https://domainmu.com/portfolio/slug"
            />
          </div>

          <div className="mt-3">
            <Textarea name="metaDescription" label="Meta Description" />
          </div>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <Field
              name="metaKeywords"
              label="Meta Keywords"
              hint="Pisahkan dengan koma (opsional, untuk referensi internal)"
            />
            <Field
              name="ogImage"
              label="OG Image URL (1200×630)"
              hint="Kosongkan untuk pakai thumbnail"
            />
          </div>

          <p className="mt-2 text-xs opacity-70">
            • <strong>Meta Title</strong> &le; 70 char,{" "}
            <strong>Description</strong> &le; 160 char. <br />•{" "}
            <strong>Canonical</strong> disarankan berisi URL final halaman.{" "}
            <br />• <strong>OG Image</strong> akan dipakai untuk Open Graph &
            Twitter Card.
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="reset"
            className={[
              "rounded-full px-4 py-2 text-sm",
              "border border-white/10 bg-white/[0.02] hover:bg-white/[0.08]",
              "transition shadow-[inset_0_1px_0_0_rgba(255,255,255,.05)]",
            ].join(" ")}
          >
            Reset
          </button>
          <button
            className={[
              "rounded-full px-4 py-2 text-sm font-medium",
              "border border-violet-400/40 bg-gradient-to-r from-violet-500/25 to-sky-400/25",
              "hover:from-violet-500/35 hover:to-sky-400/35",
              "ring-1 ring-inset ring-white/10 transition",
            ].join(" ")}
          >
            Save
          </button>
        </div>
      </form>

      {/* LIST */}
      <div
        className={[
          "overflow-x-auto rounded-3xl border border-white/10",
          "bg-white/[0.03] backdrop-blur ring-1 ring-inset ring-white/5",
        ].join(" ")}
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white/[0.04] backdrop-blur">
            <tr>
              <Th>Title</Th>
              <Th>Slug</Th>
              <Th>Category</Th>
              <Th>Published</Th>
              <Th>Tags</Th>
              <Th>Images</Th>
              <Th>SEO</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="[&>tr:hover]:bg-white/[0.025]">
            {items.map((p: ProjectRow) => {
              const thumb = p.thumbnailUrl ?? firstImage(p.images);
              const seoTitle = p.metaTitle ?? undefined;
              const seoDesc = p.metaDescription ?? undefined;
              const og = p.ogImage ?? undefined;

              return (
                <tr key={p.id} className="border-t border-white/10 align-top">
                  <Td className="font-medium">{p.title ?? "Untitled"}</Td>
                  <Td className="text-xs opacity-80">{p.slug ?? "—"}</Td>
                  <Td className="text-[11px] opacity-85">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                      {p.categoryShown ?? "—"}
                    </span>
                  </Td>

                  <Td>
                    <form action={togglePublish.bind(null, p.id, !p.published)}>
                      <button
                        className={[
                          "rounded-full px-3 py-1 text-xs transition",
                          p.published
                            ? "border border-amber-400/30 text-amber-200 hover:bg-amber-500/10"
                            : "border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/10",
                        ].join(" ")}
                      >
                        {p.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                  </Td>

                  <Td className="max-w-[240px] truncate">
                    {asStringArray(p.tags).join(", ")}
                  </Td>

                  <Td className="max-w-[360px]">
                    {thumb ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-7 w-12 overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-inner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={String(thumb)}
                            alt=""
                            className="h-7 w-12 object-cover"
                          />
                        </span>
                        <a
                          href={String(thumb)}
                          target="_blank"
                          className="truncate text-xs opacity-85 hover:underline"
                        >
                          {String(thumb)}
                        </a>
                      </div>
                    ) : (
                      <span className="opacity-60">—</span>
                    )}
                  </Td>

                  <Td className="min-w-[240px]">
                    <div className="space-y-1.5">
                      <div className="truncate">
                        <span className="opacity-60">Title:</span>{" "}
                        <span className="text-xs">
                          {seoTitle || <em className="opacity-60">—</em>}
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="opacity-60">Desc:</span>{" "}
                        <span className="text-xs">
                          {seoDesc || <em className="opacity-60">—</em>}
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="opacity-60">OG:</span>{" "}
                        {og ? (
                          <a
                            href={og}
                            target="_blank"
                            className="text-xs underline decoration-dotted"
                          >
                            {og}
                          </a>
                        ) : (
                          <span className="text-xs opacity-60">—</span>
                        )}
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <form action={deleteProject.bind(null, p.id)}>
                      <button className="rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-300 transition hover:bg-rose-500/10">
                        Delete
                      </button>
                    </form>
                  </Td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <Td colSpan={8} className="py-10 text-center opacity-75">
                  No projects yet.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================
   Tiny UI helpers — polished 2025
========================================= */
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className={[
        "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider",
        "text-white/90",
        "border-b border-white/10",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      className={["px-3 py-2 align-top", "text-white/90", className ?? ""].join(
        " "
      )}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

function Field({
  name,
  label,
  hint,
  required,
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="group grid gap-1 text-sm">
      <span className="opacity-85">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        required={required}
        className={[
          "rounded-xl px-3 py-2 outline-none transition",
          "border border-white/15 bg-black/40",
          "focus:border-white/40 focus:ring-1 focus:ring-violet-400/40",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,.05)]",
        ].join(" ")}
      />
      {hint && <span className="text-xs opacity-60">{hint}</span>}
    </label>
  );
}

function Textarea({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="group grid gap-1 text-sm">
      <span className="opacity-85">
        {label}
        {required && " *"}
      </span>
      <textarea
        name={name}
        rows={4}
        required={required}
        className={[
          "rounded-xl px-3 py-2 outline-none transition",
          "border border-white/15 bg-black/40",
          "focus:border-white/40 focus:ring-1 focus:ring-sky-400/40",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,.05)]",
        ].join(" ")}
      />
    </label>
  );
}
