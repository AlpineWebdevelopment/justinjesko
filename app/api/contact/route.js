import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY_JESKO);

// Basic in-memory rate limit (per-IP, 3 requests per 10 min)
// For production across multiple instances, use Upstash/Redis instead
const rateLimit = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }
  entry.count++;
  rateLimit.set(ip, entry);
  return entry.count <= MAX_REQUESTS;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { name, email, type, message, website } = await req.json();

    // Honeypot — real users won't fill this hidden field
    if (website) {
      return NextResponse.json({ ok: true }); // silently accept + drop
    }

    // Validation
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }
    if (name.length > 100 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: `Justin Jesko Site <${process.env.CONTACT_FROM_EMAIL}>`,
      to: [process.env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `[${type}] New message from ${name}`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 600px;">
          <h2 style="border-bottom: 2px solid #C3FF00; padding-bottom: 8px;">
            New contact form submission
          </h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Type:</strong> ${escapeHtml(type)}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">
${escapeHtml(message)}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
