"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import {
  deriveCategory,
  normalizeTags,
  type CategoryValue,
} from "@/lib/categories";

/* ========= Constants ========= */
const ALLOWED_MIME = new Set(["image/jpeg", "image/png"]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png"]);
const MAX_BYTES = 2 * 1024 * 1024; // 2MB per file
const MAX_FILES = 12; // max 12 files
const MAX_TOTAL = 4 * 1024 * 1024; // 4MB

/* ========= Small helpers ========= */
const ext = (name: string) => path.extname(name || "").toLowerCase();
const isAllowed = (f: File) =>
  !!f &&
  !!f.name &&
  f.size > 0 &&
  ALLOWED_MIME.has((f.type || "").toLowerCase()) &&
  ALLOWED_EXT.has(ext(f.name));

const slugify = (input?: string) =>
  (input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toNull = (v?: string | null) => {
  const s = (v ?? "").trim();
  return s.length ? s : null;
};

const fixUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://${url}`;
};

const csvToArray = (v?: string | null) =>
  (v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** clamp length helper */
const clampLen = (s: string, max: number) =>
  s.length > max ? s.slice(0, max) : s;

async function saveImages(slug: string, files: File[]) {
  const out: string[] = [];
  if (!files.length) return out;

  const validFiles = files.filter(isAllowed);
  if (!validFiles.length) return out;

  let i = 0;

  for (const file of validFiles) {
    if (file.size > MAX_BYTES) {
      throw new Error(`"${file.name}" > 8MB`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const hash = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex")
      .slice(0, 8);

    const filename = `${(++i)
      .toString()
      .padStart(2, "0")}-${hash}${ext(file.name)}`;

    const filePath = `${slug}/${filename}`;

    // ✅ Upload ke Supabase
    const { error } = await supabase.storage
      .from("projects")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true, // ✅ penting
      });

    if (error) {
      throw new Error("Upload gagal: " + error.message);
    }

    // ✅ Ambil public URL
    const { data } = supabase.storage.from("projects").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Gagal mendapatkan public URL");
    }

    out.push(data.publicUrl);
  }

  return out;
}

/* ========= Zod schema ========= */
const BaseSchema = z.object({
  title: z.string().min(2, "Title minimal 2 karakter"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Gunakan lowercase-angka-minus"),
  description: z.string().min(2),
  content: z.string().optional(),
  tags: z.string().optional(),
  published: z.string().optional(), // "on"
  category: z
    .enum(["programming", "uiux", "graphic", "marketing"])
    .optional()
    .or(z.literal("")), // kosong = biar auto-derive

  // === SEO fields (semua opsional) ===
  metaTitle: z
    .string()
    .max(70, "Meta title maksimal 70 karakter")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta description maksimal 160 karakter")
    .optional()
    .or(z.literal("")),
  metaKeywords: z.string().optional().or(z.literal("")), // CSV
  canonicalUrl: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\/.+/.test(val), {
      message: "Canonical harus URL valid",
    }),
  ogImage: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\/.+/.test(val), {
      message: "OG Image harus URL valid",
    }),
});

/* ========= Actions ========= */

export async function togglePublish(formData: FormData) {
  const id = formData.get("id") as string;
  const to = formData.get("published") === "true";

  const p = await prisma.project.findUnique({ where: { id } });
  if (!p) throw new Error("Project tidak ditemukan");

  const data: { published: boolean; publishedAt?: Date | null } = {
    published: to,
  };

  if (to && !p.publishedAt) {
    data.publishedAt = new Date();
  }

  await prisma.project.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${p.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
}

export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("ID tidak ditemukan");
  }

  const p = await prisma.project.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!p) {
    throw new Error("Project tidak ditemukan");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");

  if (p.slug) {
    revalidatePath(`/portfolio/${p.slug}`);
  }

  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
}

export async function upsertProject(form: FormData) {
  const id = String(form.get("id") ?? "");
  const titleRaw = String(form.get("title") ?? "").trim();
  const slugInput = String(form.get("slug") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const content = String(form.get("content") ?? "");
  const tagsInput = String(form.get("tags") ?? "");

  // ✅ ambil dari hidden input (hasil upload client)
  const imagesJson = form.get("images") as string;
  const images: string[] = imagesJson ? JSON.parse(imagesJson) : [];

  const publishedOn = String(form.get("published") ?? "");
  const categoryRaw =
    (form.get("category") as string | null)?.toLowerCase() ?? "";

  // SEO
  const metaTitleRaw = String(form.get("metaTitle") ?? "");
  const metaDescriptionRaw = String(form.get("metaDescription") ?? "");
  const metaKeywordsCSV = String(form.get("metaKeywords") ?? "");
  const canonicalUrlRaw = String(form.get("canonicalUrl") ?? "");
  const ogImageRaw = String(form.get("ogImage") ?? "");

  const slug = slugify(slugInput || titleRaw);
  if (!titleRaw || !slug) throw new Error("Title & slug wajib diisi.");

  // VALIDASI
  const parsed = BaseSchema.safeParse({
    title: titleRaw,
    slug,
    description,
    content,
    tags: tagsInput,
    published: publishedOn ? "on" : undefined,
    category: categoryRaw,
    metaTitle: metaTitleRaw,
    metaDescription: metaDescriptionRaw,
    metaKeywords: metaKeywordsCSV,
    canonicalUrl: fixUrl(canonicalUrlRaw),
    ogImage: fixUrl(ogImageRaw),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues?.[0]?.message || "Invalid data");
  }

  const tags = normalizeTags(tagsInput);

  const allowed = new Set<CategoryValue>([
    "programming",
    "uiux",
    "graphic",
    "marketing",
  ]);

  const pickedCategory =
    categoryRaw && allowed.has(categoryRaw as CategoryValue)
      ? (categoryRaw as CategoryValue)
      : undefined;

  const category =
    pickedCategory ??
    (deriveCategory({
      tags,
      title: titleRaw,
      description,
    }) as CategoryValue | undefined);

  const metaTitle = toNull(clampLen(metaTitleRaw, 70));
  const metaDescription = toNull(clampLen(metaDescriptionRaw, 160));
  const metaKeywords = csvToArray(metaKeywordsCSV);
  const canonicalUrl = toNull(canonicalUrlRaw);
  const ogImage = toNull(ogImageRaw);

  // ================= UPDATE =================
  if (id) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new Error("Project tidak ditemukan.");

    const prevImages = Array.isArray(existing.images)
      ? (existing.images as string[])
      : [];

    const mergedImages = images.length
      ? [...prevImages, ...images]
      : prevImages;

    const thumbnailUrl = existing.thumbnailUrl ?? mergedImages[0] ?? null;

    const nowPublish = Boolean(publishedOn);
    const setPublishedAt =
      nowPublish && !existing.publishedAt ? new Date() : existing.publishedAt;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: titleRaw,
        slug,
        description,
        content,
        tags,
        images: mergedImages,
        thumbnailUrl,
        category: category ?? null,
        published: nowPublish,
        publishedAt: setPublishedAt,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        ogImage,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${updated.slug}`);

    if (existing.slug !== updated.slug) {
      revalidatePath(`/portfolio/${existing.slug}`);
    }

    return;
  }

  // ================= CREATE =================

  const thumbnailUrl = images[0] ?? null;

  await prisma.project.create({
    data: {
      title: titleRaw,
      slug,
      description,
      content,
      tags,
      images,
      thumbnailUrl,
      category: category ?? null,
      published: Boolean(publishedOn),
      publishedAt: Boolean(publishedOn) ? new Date() : null,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogImage,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
}
