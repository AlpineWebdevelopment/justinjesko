export const AUDIO_CATALOG = {
  set1: "/sets/first set.mp3",
  set2: "/sets/set2.mp3",
  set3: "/sets/set3.mp3",
  butterflies: "/previews/Martin Garrix - BUTTERFLIES.mp3",
  gravity: "/previews/Martin Garrix - GRAVITY.mp3",
  ourtime: "/previews/Martin Garrix - OUR TIME.mp3",
  something: "/previews/Martin Garrix - SOMETHING.mp3",
  vodoo: "/previews/Martin Garrix - VODOO.mp3",
  cocoon: "/sets/Martin Garrix - COCOON (Remix).mp3",
  madremix: "/sets/Martin Garrix - MAD (Matt Pridgyn Remix).mp3",
  someoneyouloved:
    "/sets/Martin Garrix - SOMEONE YOU LOVED (Remix) [Jesko's Extended Edit].mp3",
};

export function resolveSlug(slug) {
  return `private-audio${AUDIO_CATALOG[slug]}` || null;
}
