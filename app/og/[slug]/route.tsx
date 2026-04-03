import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: "black",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {slug}
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
