// ─────────────────────────────────────────────────────────────────────────
// The ONLY file you edit to add or change a song / set.
//
// To add a track:
//   1. Upload the .mp3 to R2 (under the "private-audio" folder).
//   2. Drop a cover image in public/jesko/images/.
//   3. Append ONE object to the list below.
//
// Fields:
//   slug   — unique id, letters/numbers/underscores, no spaces (used in URLs)
//   file   — the .mp3's path inside R2, AFTER the "private-audio" root
//   kind   — "set"     → shows in the DJ Sets section
//            "preview" → shows in the Previews section
//   title, artist, cover, lngth (length in SECONDS)
//   duration, date — sets only (human-readable labels)
//
// Everything else updates automatically: the homepage sections, the R2
// lookup, and the shareable /shared/<ref> page. You never pick a `ref` —
// it's generated from the slug and stays stable as long as the slug does.
// ─────────────────────────────────────────────────────────────────────────

const RAW = [
  // ─── DJ Sets ───
  {
    slug: "set2",
    file: "/sets/set2.mp3",
    kind: "set",
    title: "YouTube Live Mix - 2026.01.31",
    artist: "Justin Jesko",
    cover: "/jesko/images/set02.jpg",
    lngth: 3359,
    duration: "56 min",
    date: "Jan 2026",
  },
  {
    slug: "set3",
    file: "/sets/set3.mp3",
    kind: "set",
    title: "Playa Beach Club - 2026.04.10.",
    artist: "Justin Jesko",
    cover: "/jesko/images/set03.jpg",
    lngth: 3772,
    duration: "63 min",
    date: "Apr 2026",
  },
  {
    slug: "sziget_son",
    file: "/sets/sziget-sound-of-naitons-JustinJesko.mp3",
    kind: "set",
    title: "Sziget 2026 - Sound Of Nations - Justin Jesko's Submission",
    artist: "Justin Jesko",
    cover: "/jesko/images/set03.jpg",
    lngth: 912,
    duration: "15 min",
    date: "Jul 2026",
  },

  // ─── Previews / IDs ───
  {
    slug: "butterflies",
    file: "/previews/Martin Garrix - BUTTERFLIES.mp3",
    kind: "preview",
    title: "BUTTERFLIES",
    artist: "Martin Garrix",
    cover: "/jesko/images/butterflies.jpg",
    lngth: 270,
  },
  {
    slug: "gravity",
    file: "/previews/Martin Garrix - GRAVITY.mp3",
    kind: "preview",
    title: "GRAVITY",
    artist: "Martin Garrix",
    cover: "/jesko/images/gravity.jpg",
    lngth: 342,
  },
  {
    slug: "ourtime",
    file: "/previews/Martin Garrix - OUR TIME.mp3",
    kind: "preview",
    title: "OUR TIME",
    artist: "Martin Garrix",
    cover: "/jesko/images/ourtime.jpg",
    lngth: 240,
  },
  {
    slug: "something",
    file: "/previews/Martin Garrix - SOMETHING.mp3",
    kind: "preview",
    title: "SOMETHING",
    artist: "Martin Garrix",
    cover: "/jesko/images/something.jpg",
    lngth: 223,
  },
  {
    slug: "vodoo",
    file: "/previews/Martin Garrix - VODOO.mp3",
    kind: "preview",
    title: "VODOO",
    artist: "Martin Garrix",
    cover: "/jesko/images/vodoo.jpg",
    lngth: 245,
  },
];

// Deterministic, opaque share id derived from the slug — the same slug always
// produces the same code, so share links stay stable without hand-picking one.
function deriveRef(slug) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let n = h >>> 0;
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += alphabet[n % 62];
    n = Math.floor(n / 62);
  }
  return out;
}

export const ITEMS = RAW.map((i) => ({ ...i, ref: deriveRef(i.slug) }));

export const SETS = ITEMS.filter((i) => i.kind === "set");
export const PREVIEWS = ITEMS.filter((i) => i.kind === "preview");

// slug -> R2 path (after the private-audio root). Used server-side by the
// audio catalog so the token/audio routes can find the file.
export const FILE_BY_SLUG = Object.fromEntries(
  RAW.map((i) => [i.slug, i.file]),
);

/** Resolve a public share ref (/shared/<ref>) to its item, or null. */
export function getByRef(ref) {
  return ITEMS.find((i) => i.ref === ref) || null;
}

/** Resolve a slug to its item, or null. */
export function getBySlug(slug) {
  return ITEMS.find((i) => i.slug === slug) || null;
}

/**
 * Suggestions for the "you might also like" section: every other item,
 * excluding the one currently on the page. Sets are surfaced first so a
 * shared preview still points people toward the full mixes.
 */
export function getSuggestions(currentRef, limit = 6) {
  return ITEMS.filter((i) => i.ref !== currentRef)
    .slice()
    .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "set" ? -1 : 1))
    .slice(0, limit);
}
