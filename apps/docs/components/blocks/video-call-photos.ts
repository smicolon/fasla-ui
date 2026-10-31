/**
 * The Video Call blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photo` prop. Video Call
 * brings no photo files of its own; every still is one the repo already has
 * (the Team and Social Proof portraits, here), so there is nothing to credit
 * beyond their own CREDITS.md. The call stages take `photos`, one per person.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type VideoCallDemoPhoto = { src: string; alt: string }

/** A Type's photo, by the Type's name without `video-call-`. */
const PHOTOS: Record<string, { src: string; alt: Alt }> = {
  // Pre-Join Lobby: your own camera still.
  "pre-join-lobby": {
    src: "/images/social-proof/hamad-al-mutairi.webp",
    alt: {
      en: "A smiling man in a light blue t-shirt against a white wall",
      ar: "رجل مبتسم يرتدي قميصًا أزرق فاتحًا أمام جدار أبيض",
    },
  },
  // Captions & Reactions: the speaker's camera still.
  "captions-reactions": {
    src: "/blocks/team/portrait-karim-haddad.webp",
    alt: {
      en: "A man in a grey sweater over a blue shirt against a plain grey backdrop",
      ar: "رجل يرتدي سترة رمادية فوق قميص أزرق أمام خلفية رمادية بسيطة",
    },
  },
}

/**
 * The recordings' stills, for the two Types that show one. Calm scenes the repo
 * already has, not people: the corridor under the Call Ended Summary's recording
 * row, the table of colleagues under the recap's player.
 */
const RECORDINGS: Record<string, { src: string; alt: Alt }> = {
  "call-ended-summary": {
    src: "/images/hero/office-corridor.webp",
    alt: {
      en: "A long office corridor with a slatted ceiling, glass partitions and dark kitchen units",
      ar: "ممر مكتب طويل بسقف مشقوق وحواجز زجاجية ووحدات مطبخ داكنة",
    },
  },
  "ai-meeting-recap": {
    src: "/images/hero/team-laptops-table.webp",
    alt: {
      en: "Colleagues working on laptops around a wooden table",
      ar: "زملاء يعملون على حواسيب محمولة حول طاولة خشبية",
    },
  },
}

/**
 * The people on the call stages, by participant `id`. Every file is an ordinary
 * portrait the repo already has (the Team and Social Proof ones), cropped by
 * the tile to a camera's frame. Salma and Hala have none: their camera is off,
 * as in Figma, and a tile shows their initials.
 */
const PEOPLE: Record<string, { src: string; alt: Alt }> = {
  karim: { src: "/blocks/team/portrait-tomas-vidal.webp", alt: { en: "A smiling man in a white t-shirt against a plain light backdrop", ar: "رجل مبتسم يرتدي قميصًا أبيض أمام خلفية فاتحة بسيطة" } },
  mona: { src: "/blocks/team/portrait-layla-mansour.webp", alt: { en: "A smiling woman with short curly hair in a striped blazer against a pale wall", ar: "امرأة مبتسمة بشعر قصير مجعّد وسترة مخططة أمام جدار فاتح" } },
  omar: { src: "/images/social-proof/hamad-al-mutairi.webp", alt: { en: "A smiling man in a light blue t-shirt against a white wall", ar: "رجل مبتسم يرتدي قميصًا أزرق فاتحًا أمام جدار أبيض" } },
  tariq: { src: "/images/social-proof/hani-jaber.webp", alt: { en: "A man with a beard and round glasses in a grey sweater", ar: "رجل بلحية ونظارة مستديرة يرتدي سترة رمادية" } },
  yasmin: { src: "/blocks/team/portrait-mei-tanaka.webp", alt: { en: "A woman in a black blazer smiling against a brick wall", ar: "امرأة ترتدي سترة سوداء تبتسم أمام جدار من الطوب" } },
  adam: { src: "/blocks/team/portrait-rami-aziz.webp", alt: { en: "A smiling man with a short beard in a navy sweater against a grey backdrop", ar: "رجل مبتسم بلحية قصيرة يرتدي سترة كحلية أمام خلفية رمادية" } },
  nour: { src: "/blocks/team/portrait-elena-novak.webp", alt: { en: "A smiling woman with red hair in a black top", ar: "امرأة مبتسمة بشعر أحمر ترتدي قميصًا أسود" } },
  bilal: { src: "/blocks/team/portrait-omar-nasser.webp", alt: { en: "A man in a dark suit and tie against a dark backdrop", ar: "رجل يرتدي بدلة داكنة ورابطة عنق أمام خلفية داكنة" } },
  layla: { src: "/blocks/team/portrait-sofia-marchetti.webp", alt: { en: "A woman with long hair in a grey blazer against an orange wall", ar: "امرأة بشعر طويل وسترة رمادية أمام جدار برتقالي" } },
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

/** The people's photos with alt text in `locale`, by participant `id`. */
export function videoCallPeople(locale: Locale): Record<string, VideoCallDemoPhoto> {
  return Object.fromEntries(Object.entries(PEOPLE).map(([id, photo]) => [id, { src: photo.src, alt: photo.alt[locale] }]))
}

/** Every Video Call Type that has a demo photo, by its name without `video-call-`. */
export const VIDEO_CALL_PHOTO_TYPES = [...Object.keys(PHOTOS), ...Object.keys(RECORDINGS)]

/** A Video Call Type's demo photo with its alt text in `locale`, or nothing. */
export function videoCallPhoto(type: string, locale: Locale): VideoCallDemoPhoto | undefined {
  const photo = PHOTOS[type] ?? RECORDINGS[type]
  return photo ? { src: photo.src, alt: photo.alt[locale] } : undefined
}

/** The props that put a Type's demo photo into its block: its `photo`. Types without one get none. */
export function videoCallPhotoProps(type: string, locale: Locale): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  if (STAGE_TYPES.includes(type)) props.photos = videoCallPeople(locale)
  const photo = videoCallPhoto(type, locale)
  if (photo) props.photo = photo
  return props
}
