import { NextResponse } from "next/server";
import { signToken } from "@/lib/audio-token";
import { resolveSlug } from "@/lib/audio-catalog";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug || !resolveSlug(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Referer check — only mint tokens for requests coming from your site
  const referer = req.headers.get("referer") || "";
  const siteHost = process.env.NEXT_PUBLIC_SITE_HOST || "";
  if (siteHost && !referer.startsWith(siteHost)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { token, expires } = signToken(slug);
  const url = `/api/jsk/audio/${slug}?token=${token}&expires=${expires}`;

  return NextResponse.json({ url });
}
