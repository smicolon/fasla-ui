/**
 * The Video Call blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photo` prop. Video Call
 * brings no photo files of its own; every still is one the repo already has
 * (the Team portraits, here), so there is nothing to credit beyond their own
 * CREDITS.md.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type VideoCallDemoPhoto = { src: string; alt: string }

/** A Type's photo, by the Type's name without `video-call-`. */
const PHOTOS: Record<string, { src: string; alt: Alt }> = {
  // Captions & Reactions: the speaker's camera still.
  "captions-reactions": {
    src: "/blocks/team/portrait-karim-haddad.webp",
    alt: {
      en: "A man in a grey sweater over a blue shirt against a plain grey backdrop",
      ar: "رجل يرتدي سترة رمادية فوق قميص أزرق أمام خلفية رمادية بسيطة",
    },
  },
}

/** Every Video Call Type that has a demo photo, by its name without `video-call-`. */
export const VIDEO_CALL_PHOTO_TYPES = Object.keys(PHOTOS)

/** A Video Call Type's demo photo with its alt text in `locale`, or nothing. */
export function videoCallPhoto(type: string, locale: Locale): VideoCallDemoPhoto | undefined {
  const photo = PHOTOS[type]
  return photo ? { src: photo.src, alt: photo.alt[locale] } : undefined
}

/** The props that put a Type's demo photo into its block: its `photo`. Types without one get none. */
export function videoCallPhotoProps(type: string, locale: Locale): Record<string, unknown> {
  const photo = videoCallPhoto(type, locale)
  return photo ? { photo } : {}
}
