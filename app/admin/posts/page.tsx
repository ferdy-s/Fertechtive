import { prisma } from "@/lib/prisma";
import {
  createCategory,
  deleteCategory,
  deletePost,
  upsertPost,
  uploadImage,
} from "./actions";
import Editor from "./ui";
import { cookies } from "next/headers";
import type { Prisma, Category as CategoryModel } from "@prisma/client";
import SearchBar from "./SearchBar";

/* ===== Types ===== */
type PostWithRels = Prisma.PostGetPayload<{
  include: { categories: true; author: true };
}>;

/* ===== Utils ===== */
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

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  void cookies();

  const q =
    (Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q) ??
    "";

  const where: Prisma.PostWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { metaDescription: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [posts, categories, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { categories: true, author: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.post.count(),
  ]);

  const publishedCount = posts.filter((p) => p.publishedAt).length;

  return (
    <main className="relative mx-auto max-w-6xl w-full px-5 sm:px-6 py-10 text-white overflow-x-hidden">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(120,119,198,.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.04),transparent_35%)]" />
      </div>

      {/* ===== Header ===== */}
      <header className="mb-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,.6)]">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Blog CMS
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Kelola posting, kategori, SEO & media. Pencarian instan via judul
            dan deskripsi.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Total Post (semua)" value={totalCount} />
            <Stat label="Ditampilkan (hasil)" value={posts.length} />
            <Stat label="Dipublish (hasil)" value={publishedCount} />
          </div>
        </div>
      </header>

      {/* ===== Post Baru: panel penuh (full width) ===== */}
      <section className="mb-4">
        <NewPostPanel
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </section>

      {/* ===== Bar Bawah: Search (1/2) + Tambah Kategori (1/2) ===== */}
      <section
        aria-label="Pencarian & tambah kategori"
        className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,.7)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <div className="min-w-0">
            <SearchBar initialQuery={q} />
          </div>
          <div className="min-w-0">
            <NewCategoryForm />
          </div>
        </div>
      </section>

      {/* ===== Posts ===== */}
      <section
        aria-label="Daftar posting"
        className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-sm text-white/80">
          <span>
            {q ? (
              <>
                Hasil untuk{" "}
                <span className="font-medium text-white">“{q}”</span>
              </>
            ) : (
              <>Daftar Post (urut terbaru)</>
            )}
          </span>
          <span className="text-white/60">
            {publishedCount} / {posts.length} dipublish
          </span>
        </div>

        <ul className="divide-y divide-white/10">
          {posts.map((p: PostWithRels) => (
            <li key={p.id} className="px-3 sm:px-4 py-4">
              <div className="rounded-2xl bg-white/[0.03] ring-1 ring-inset ring-white/10 px-4 py-4 hover:bg-white/[0.05] transition">
                <PostRow
                  post={p}
                  categories={categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                  }))}
                />
              </div>
            </li>
          ))}

          {posts.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-white/60">
              {q
                ? "Tidak ada hasil yang cocok."
                : "Belum ada konten. Buat post baru untuk memulai."}
            </li>
          )}
        </ul>
      </section>

      {/* ===== Categories ===== */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">Kategori</h2>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c: CategoryModel) => (
              <form
                key={c.id}
                action={async () => {
                  "use server";
                  await deleteCategory(c.id);
                }}
                className="inline-flex"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm">
                  {c.name}
                  <button
                    type="submit"
                    className="rounded-md px-1.5 py-0.5 text-white/70 ring-1 ring-inset ring-white/10 hover:text-white hover:bg-white/10 transition"
                    title={`Hapus kategori ${c.name}`}
                    aria-label={`Hapus kategori ${c.name}`}
                  >
                    ×
                  </button>
                </span>
              </form>
            ))}

            {categories.length === 0 && (
              <span className="text-sm text-white/60">Belum ada kategori.</span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===== Bits ===== */
function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
      <div className="text-xs uppercase tracking-wide text-white/60">
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold">{value}</div>
    </div>
  );
}

/* ===== New Category ===== */
function NewCategoryForm() {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const name = String(formData.get("name") || "").trim();
        if (!name) return;
        await createCategory({ name });
      }}
      className="flex w-full items-center gap-2"
      aria-label="Tambah kategori"
    >
      <input
        name="name"
        placeholder="Tambah kategori…"
        className="h-10 w-full rounded-xl bg-white/10 px-3 text-sm outline-none placeholder-white/45 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30"
        aria-label="Nama kategori"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-xl bg-white/15 px-3 text-sm ring-1 ring-inset ring-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        Tambah
      </button>
    </form>
  );
}

/* ===== Post Baru Panel (full width) ===== */
function NewPostPanel({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <details className="group">
        <summary className="w-full list-none cursor-pointer select-none px-5 py-4 text-sm md:text-base font-medium text-white/90 flex items-center justify-between hover:bg-white/[0.06] transition">
          <span>+ Post Baru</span>
          <span className="text-white/50 group-open:rotate-180 transition">
            ▾
          </span>
        </summary>
        <div className="border-t border-white/10 p-5">
          <PostForm categories={categories} />
        </div>
      </details>
    </div>
  );
}

/* ===== Row ===== */
function PostRow({
  post,
  categories,
}: {
  post: PostWithRels;
  categories: { id: string; name: string }[];
}) {
  const iso = toISO(post.publishedAt);
  const pubLabel = post.publishedAt ? fmtDate(post.publishedAt) : "Draft";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6 min-w-0">
      {/* info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-medium leading-6">
          {post.title}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
          <span>{post.author?.name ?? "—"}</span>
          <span aria-hidden>•</span>
          {post.publishedAt ? (
            <time dateTime={iso}>{pubLabel}</time>
          ) : (
            <span>{pubLabel}</span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-white/75">
          {post.excerpt || (post as any)?.metaDescription || "—"}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.categories.length ? (
            post.categories.map((c) => (
              <span
                key={c.id}
                className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs text-white/80"
              >
                {c.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-white/50">—</span>
          )}
        </div>
      </div>

      {/* actions */}
      <div className="flex shrink-0 items-center gap-2 self-start md:self-center">
        <EditPostDialog post={post} categories={categories} />
        <form
          action={async () => {
            "use server";
            await deletePost(post.id);
          }}
        >
          <button
            className="rounded-xl bg-red-500/15 px-3 py-2 text-sm ring-1 ring-inset ring-red-400/20 transition hover:bg-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-400/40"
            title={`Hapus "${post.title}"`}
            aria-label={`Hapus ${post.title}`}
          >
            Hapus
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===== Dialogs (Edit) ===== */
function EditPostDialog({
  post,
  categories,
}: {
  post: PostWithRels;
  categories: { id: string; name: string }[];
}) {
  return (
    <details className="group">
      <summary className="cursor-pointer rounded-xl bg-white/15 px-3 py-2 text-sm ring-1 ring-inset ring-white/10 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
        Edit
      </summary>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <PostForm post={post} categories={categories} />
      </div>
    </details>
  );
}

/* ===== Form ===== */
function PostForm({
  post,
  categories,
}: {
  post?: PostWithRels;
  categories: { id: string; name: string }[];
}) {
  async function action(formData: FormData) {
    "use server";
    const get = (k: string) => String(formData.get(k) || "");
    const categoryIds = formData.getAll("categoryIds").map(String);

    const published = get("published") === "on";
    let coverUrl = get("coverUrl");

    const rawFile = formData.get("file");
    if (rawFile instanceof File && rawFile.size > 0) {
      const fd = new FormData();
      fd.set("file", rawFile);
      const res = await uploadImage(fd);
      coverUrl = res.url;
    }

    await upsertPost({
      id: get("id") || undefined,
      title: get("title"),
      excerpt: get("excerpt"),
      contentHtml: get("contentHtml"),
      coverUrl: coverUrl || undefined,
      metaTitle: get("metaTitle"),
      metaDescription: get("metaDescription"),
      metaKeywords: get("metaKeywords"),
      categoryIds,
      published,
      slug: get("slug"),
    });
  }

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="id" defaultValue={post?.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Judul">
          <input
            name="title"
            defaultValue={post?.title ?? ""}
            className="h-10 rounded-xl bg-white/10 px-3 outline-none ring-1 ring-inset ring-white/10 placeholder-white/45 focus:ring-2 focus:ring-white/30"
            placeholder="Judul artikel"
            required
            aria-required
          />
        </Field>

        <Field label="Slug (opsional)">
          <input
            name="slug"
            defaultValue={post?.slug ?? ""}
            className="h-10 rounded-xl bg-white/10 px-3 outline-none ring-1 ring-inset ring-white/10 placeholder-white/45 focus:ring-2 focus:ring-white/30"
            placeholder="otomatis dari judul"
          />
        </Field>
      </div>

      <Field label="Excerpt / Ringkasan">
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={3}
          className="rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-inset ring-white/10 placeholder-white/45 focus:ring-2 focus:ring-white/30"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Meta Title">
          <input
            name="metaTitle"
            defaultValue={post?.metaTitle ?? post?.title ?? ""}
            className="h-10 rounded-xl bg-white/10 px-3 outline-none ring-1 ring-inset ring-white/10 placeholder-white/45 focus:ring-2 focus:ring-white/30"
          />
        </Field>

        <Field label="Meta Keywords (comma)">
          <input
            name="metaKeywords"
            defaultValue={
              Array.isArray((post as any)?.metaKeywords)
                ? (post as any).metaKeywords.join(", ")
                : ((post as any)?.metaKeywords ?? "")
            }
            className="h-10 rounded-xl bg-white/10 px-3 outline-none ring-1 ring-inset ring-white/10 placeholder-white/45 focus:ring-2 focus:ring-white/30"
            placeholder="web dev, nextjs, prisma"
          />
        </Field>
      </div>

      <Field label="Meta Description">
        <textarea
          name="metaDescription"
          defaultValue={(post as any)?.metaDescription ?? ""}
          rows={2}
          className="rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-inset ring-white/10 placeholder-white/45 focus:ring-2 focus:ring-white/30"
        />
      </Field>

      {/* Cover */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Cover URL">
          <input
            name="coverUrl"
            defaultValue={(post as any)?.coverUrl ?? ""}
            className="h-10 rounded-xl bg-white/10 px-3 outline-none ring-1 ring-inset ring-white/10 placeholder-white/45 focus:ring-2 focus:ring-white/30"
            placeholder="/uploads/cover.jpg"
          />
        </Field>

        <Field label="atau Upload Cover">
          <input
            type="file"
            name="file"
            className="rounded-xl bg-white/10 px-3 py-2 file:mr-2 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30"
            aria-label="Upload cover"
          />
        </Field>
      </div>

      {/* Categories */}
      <fieldset className="grid gap-2">
        <legend className="text-sm text-white/70">Kategori</legend>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => {
            const checked = post?.categories?.some((x) => x.id === c.id);
            return (
              <label
                key={c.id}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5"
              >
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={c.id}
                  defaultChecked={!!checked}
                />
                <span className="text-sm">{c.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Editor */}
      <Editor
        name="contentHtml"
        defaultValue={(post as any)?.contentHtml ?? ""}
        uploadAction={uploadImage}
      />

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={!!post?.publishedAt}
        />
        <span className="text-sm">Publish</span>
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-xl bg-emerald-500/20 px-4 py-2 ring-1 ring-inset ring-emerald-400/25 transition hover:bg-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}

/* ===== Field Wrapper ===== */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}
