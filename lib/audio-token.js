import crypto from "crypto";

const SECRET = process.env.AUDIO_SIGNING_SECRET;
// 30s — long enough that seeking after a pause works fine
const TOKEN_TTL_MS = 0.5 * 60 * 1000;

export function signToken(slug) {
  if (!SECRET) throw new Error("AUDIO_SIGNING_SECRET not set");
  const expires = Date.now() + TOKEN_TTL_MS;
  const payload = `${slug}.${expires}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return { token: sig, expires };
}

export function verifyToken(slug, token, expires) {
  if (!SECRET) return false;
  const expiresNum = Number(expires);
  if (!expiresNum || Date.now() > expiresNum) return false;

  const payload = `${slug}.${expiresNum}`;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");

  // Constant-time comparison to avoid timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}
