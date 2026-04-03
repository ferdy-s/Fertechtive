import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* ================= GET ================= */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const data = await prisma.project.findUnique({
    where: { id },
  });

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

/* ================= PATCH ================= */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();

  const updated = await prisma.project.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

/* ================= DELETE ================= */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
