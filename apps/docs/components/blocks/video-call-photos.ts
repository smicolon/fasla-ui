/**
 * The Video Call blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photo` prop. Most stills
 * are files the repo already has (the Team and Social Proof portraits, credited in
 * their own CREDITS.md); three are Video Call's own, in public/images/video-call
 * (credited there): Adam's cafe photo, Tariq's portrait and the Pre-Join camera
 * still. They follow Figma tile by tile: the call stages take `photos`, one per
 * person, and Adam, whom Figma shows with two different photos, has a per-Type
 * override (see PEOPLE_BY_TYPE).
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type VideoCallDemoPhoto = { src: string; alt: string; position?: string }

/**
 * Each photo's crop, as the `object-position` the tiles use: the crop Figma's
 * fill gives it (Figma FILL = centred, 50% 50%; a Figma CROP [[1,0,0],[0,vy,ty]]
 * = ty/(1-vy) down; a FILL of a 16:9 crop of the original = the y that band sits
 * at on the original). One value per file. Where a tile is a different shape
 * from the one a value was read on, Figma's window and this one differ a little.
 */
const FOCAL: Record<string, string> = {
  "/images/social-proof/khalid-saad.webp": "50% 37%",
  "/images/social-proof/sami-naji.webp": "50% 22%",
  "/blocks/team/portrait-rami-aziz.webp": "50% 32%",
  "/images/social-proof/bader-al-ghamdi.webp": "50% 40%",
  "/blocks/team/portrait-tomas-vidal.webp": "50% 42%",
  "/blocks/team/portrait-omar-nasser.webp": "50% 17%",
  "/blocks/team/portrait-karim-haddad.webp": "50% 37%",
  "/images/video-call/man-black-glasses.webp": "50% 16%",
  "/images/video-call/cafe-bar-man.webp": "50% 50%",
  "/images/video-call/thumbs-up-camera.webp": "50% 50%",
  // Omar's Figma photo is not in the repo; this stand-in keeps his tiles as they were.
  "/images/social-proof/adel-qasim.webp": "50% 30%",
}

/** A Type's photo, by the Type's name without `video-call-`. */
const PHOTOS: Record<string, { src: string; alt: Alt }> = {
  // Pre-Join Lobby: your own camera still.
  "pre-join-lobby": {
    src: "/images/video-call/thumbs-up-camera.webp",
    alt: {
      en: "A smiling bearded man in a cream sweater giving a thumbs up",
      ar: "رجل مبتسم بلحية يرتدي سترة بلون الكريم ويرفع إبهامه",
    },
  },
  // Captions & Reactions: the speaker's camera still. The speaker is Adam Farouk in the copy, so it is Adam's photo.
  "captions-reactions": {
    src: "/images/video-call/cafe-bar-man.webp",
    alt: {
      en: "A man in a light blue blazer and white shirt at a restaurant bar",
      ar: "رجل يرتدي سترة زرقاء فاتحة وقميصًا أبيض عند بار مطعم",
    },
  },
}

/**
 * The recordings' stills, for the two Types that show one: the cafe photo, as
 * Figma draws both thumbnails (centred fill).
 */
const RECORDINGS: Record<string, { src: string; alt: Alt }> = {
  "call-ended-summary": { src: "/images/video-call/cafe-bar-man.webp", alt: { en: "A man in a light blue blazer and white shirt at a restaurant bar", ar: "رجل يرتدي سترة زرقاء فاتحة وقميصًا أبيض عند بار مطعم" } },
  "ai-meeting-recap": { src: "/images/video-call/cafe-bar-man.webp", alt: { en: "A man in a light blue blazer and white shirt at a restaurant bar", ar: "رجل يرتدي سترة زرقاء فاتحة وقميصًا أبيض عند بار مطعم" } },
}

/**
 * The people on the call stages, by participant `id`. Every file is an ordinary
 * portrait the repo already has (the Team and Social Proof ones), cropped by
 * the tile to a camera's frame. Salim and Hani have none: their camera is off,
 * as in Figma, and a tile shows their initials.
 */
const PEOPLE: Record<string, { src: string; alt: Alt }> = {
  karim: { src: "/blocks/team/portrait-tomas-vidal.webp", alt: { en: "A smiling man with short dark hair and a stubble beard in a white t-shirt against a grey marble wall", ar: "رجل مبتسم بشعر أسود قصير ولحية خفيفة يرتدي قميصًا أبيض أمام جدار رخامي رمادي" } },
  mazen: { src: "/images/social-proof/khalid-saad.webp", alt: { en: "A man with short fair hair in a grey shirt against a light backdrop", ar: "رجل بشعر أشقر قصير يرتدي قميصًا رماديًا أمام خلفية فاتحة" } },
  omar: { src: "/images/social-proof/adel-qasim.webp", alt: { en: "A smiling man with a short beard in a light blue shirt, arms crossed, against a teal backdrop", ar: "رجل مبتسم بلحية قصيرة يرتدي قميصًا أزرق فاتحًا ويشبك ذراعيه أمام خلفية بترولية" } },
  tariq: { src: "/images/video-call/man-black-glasses.webp", alt: { en: "A serious man in black-framed glasses and a grey suit against a bright blurred background", ar: "رجل جاد بنظارة بإطار أسود وبدلة رمادية أمام خلفية مضيئة غير واضحة" } },
  yassin: { src: "/images/social-proof/sami-naji.webp", alt: { en: "A smiling man in a white shirt with his arms crossed against a dark backdrop", ar: "رجل مبتسم يرتدي قميصًا أبيض ويشبك ذراعيه أمام خلفية داكنة" } },
  adam: { src: "/blocks/team/portrait-karim-haddad.webp", alt: { en: "A close-up of a man with dark swept-back hair against a blue-grey backdrop", ar: "لقطة قريبة لرجل بشعر أسود مسرّح للخلف أمام خلفية رمادية مزرقة" } },
  nabil: { src: "/blocks/team/portrait-rami-aziz.webp", alt: { en: "A smiling man with a short beard in a navy sweater against a grey backdrop", ar: "رجل مبتسم بلحية قصيرة يرتدي سترة كحلية أمام خلفية رمادية" } },
  bilal: { src: "/blocks/team/portrait-omar-nasser.webp", alt: { en: "A man in a dark suit and tie against a dark backdrop", ar: "رجل يرتدي بدلة داكنة ورابطة عنق أمام خلفية داكنة" } },
  laith: { src: "/images/social-proof/bader-al-ghamdi.webp", alt: { en: "An older man with glasses in a grey blazer beside a plant", ar: "رجل أكبر سنًا بنظارة يرتدي سترة رمادية بجانب نبتة" } },
}

/**
 * Figma gives Adam two photos: the cafe one in the Speaker & Filmstrip main tile
 * (and the Captions speaker and recording thumbnails, which are not people), and
 * a close-up everywhere else. `PEOPLE.adam` is the close-up; a Type listed here
 * takes the other photo for that person.
 */
const PEOPLE_BY_TYPE: Record<string, Record<string, { src: string; alt: Alt }>> = {
  "speaker-filmstrip": { adam: { src: "/images/video-call/cafe-bar-man.webp", alt: { en: "A man in a light blue blazer and white shirt at a restaurant bar", ar: "رجل يرتدي سترة زرقاء فاتحة وقميصًا أبيض عند بار مطعم" } } },
}

/** The Types that show people, which take `photos` by person `id`: the call stages, the waiting room's guests and the callers. */
const STAGE_TYPES = [
  "grid-gallery-call",
  "speaker-filmstrip",
  "screen-share-stage",
  "call-with-side-panel",
  "waiting-room-knock",
  "incoming-call",
  "call-ended-summary",
  "upcoming-meetings",
  "ai-meeting-recap",
  "hero-call-mockup",
]

/** A photo with its focal point, when it has one. The recordings' stills are scenes, not faces, so they have none. */
const withFocal = (photo: VideoCallDemoPhoto): VideoCallDemoPhoto => (FOCAL[photo.src] ? { ...photo, position: FOCAL[photo.src] } : photo)

/** The people's photos with alt text in `locale`, by participant `id`; for a `type`, with that Type's per-person overrides. */
export function videoCallPeople(locale: Locale, type?: string): Record<string, VideoCallDemoPhoto> {
  const people = { ...PEOPLE, ...(type ? PEOPLE_BY_TYPE[type] : undefined) }
  return Object.fromEntries(Object.entries(people).map(([id, photo]) => [id, withFocal({ src: photo.src, alt: photo.alt[locale] })]))
}

/** Every person's photos across the Types, by `id`: more than one only where Figma gives a person two. */
export function videoCallPersonPhotos(locale: Locale): Record<string, VideoCallDemoPhoto[]> {
  const out: Record<string, VideoCallDemoPhoto[]> = {}
  for (const type of [undefined, ...Object.keys(PEOPLE_BY_TYPE)]) {
    for (const [id, photo] of Object.entries(videoCallPeople(locale, type))) {
      const list = (out[id] ??= [])
      if (!list.some((existing) => existing.src === photo.src)) list.push(photo)
    }
  }
  return out
}

/** Every Video Call Type that has a demo photo, by its name without `video-call-`. */
export const VIDEO_CALL_PHOTO_TYPES = [...Object.keys(PHOTOS), ...Object.keys(RECORDINGS)]

/** A Video Call Type's demo photo with its alt text in `locale`, or nothing. */
export function videoCallPhoto(type: string, locale: Locale): VideoCallDemoPhoto | undefined {
  const photo = PHOTOS[type] ?? RECORDINGS[type]
  return photo ? withFocal({ src: photo.src, alt: photo.alt[locale] }) : undefined
}

/** The props that put a Type's demo photo into its block: its `photo`. Types without one get none. */
export function videoCallPhotoProps(type: string, locale: Locale): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  if (STAGE_TYPES.includes(type)) props.photos = videoCallPeople(locale, type)
  const photo = videoCallPhoto(type, locale)
  if (photo) props.photo = photo
  return props
}
