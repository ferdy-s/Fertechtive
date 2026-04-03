import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "File tidak ditemukan" },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name);
  const filename = `${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public/uploads");
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({
    url: `/uploads/${filename}`,
  });
}
