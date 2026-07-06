// Server-side slug -> R2 object-key lookup for the token + audio routes.
//
// You normally DON'T edit this file: the catalog is built automatically from
// lib/tracks.js (the one place you add songs/sets). EXTRA below is only for
// audio files that exist in R2 but aren't shown anywhere on the site.

import { FILE_BY_SLUG } from "./tracks";

// Playable files not surfaced in any homepage section (no cover/metadata).
const EXTRA = {
  set1: "/sets/first set.mp3",
  cocoon: "/sets/Martin Garrix - COCOON (Remix).mp3",
  madremix: "/sets/Martin Garrix - MAD (Matt Pridgyn Remix).mp3",
  someoneyouloved:
    "/sets/Martin Garrix - SOMEONE YOU LOVED (Remix) [Jesko's Extended Edit].mp3",
};

export const AUDIO_CATALOG = { ...FILE_BY_SLUG, ...EXTRA };

export function resolveSlug(slug) {
  const path = AUDIO_CATALOG[slug];
  return path ? `private-audio${path}` : null;
}
