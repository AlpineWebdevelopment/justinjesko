import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/audio-token";
import { resolveSlug } from "@/lib/audio-catalog";
import { getPresignedAudioUrl } from "@/lib/r2";

export async function GET(req, { params }) {
  const dest = req.headers.get("sec-fetch-dest");
  const site = req.headers.get("sec-fetch-site");
  const referer = req.headers.get("referer") || "";
  const siteHost = process.env.NEXT_PUBLIC_SITE_HOST || "";

  const fromPage =
    (dest === "audio" || dest === "empty") &&
    site === "same-origin" &&
    (siteHost ? referer.startsWith(siteHost) : true);

  if (!fromPage) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const expires = searchParams.get("expires");

  const filename = resolveSlug(slug);
  if (!filename) return new NextResponse("Not found", { status: 404 });

  if (!token || !expires || !verifyToken(slug, token, expires)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const presignedUrl = await getPresignedAudioUrl(filename, 60);
    // 302 redirect — browser's <audio> element follows it automatically,
    // including for range requests during seeking.
    return NextResponse.redirect(presignedUrl, {
      status: 302,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("R2 presign failed:", err);
    return new NextResponse("Not found", { status: 404 });
  }
}
