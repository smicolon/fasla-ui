/**
 * The Video Call blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photo` prop. Most stills
 * are files the repo already has (the Team and Social Proof portraits, credited in
 * their own CREDITS.md); two are Video Call's own, in public/images/video-call
 * (credited there): Adam's cafe photo, which is also the Captions speaker, and
 * the Pre-Join camera still. The call stages take `photos`, one per person.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type VideoCallDemoPhoto = { src: string; alt: string; position?: string }

/**
 * Where each portrait's face sits, as the `object-position` the tiles crop
 * around: the focal point of the photo, so every tile shape keeps the whole
 * face in view with a little headroom and loses chest before forehead. The
 * portraits are 4:5; a tile wider than that shows a band of the photo, and
 * these values put the band over the face. One value per file, chosen so the
 * face fits, clear of the name chip and the other overlays, at every tile shape the
 * blocks draw (360, 768 and 1280 wide), with some chest where the tile allows.
 */
const FOCAL: Record<string, string> = {
  "/images/social-proof/adel-qasim.webp": "50% 30%",
  "/images/social-proof/khalid-saad.webp": "50% 38%",
  "/blocks/team/portrait-rami-aziz.webp": "50% 32%",
  "/images/social-proof/bader-al-ghamdi.webp": "50% 40%",
  "/images/social-proof/sami-naji.webp": "50% 18%",
  "/images/social-proof/rashed-al-amri.webp": "50% 44%",
  "/blocks/team/portrait-marcus-boateng.webp": "50% 10%",
  "/images/video-call/cafe-bar-man.webp": "50% 36%",
  "/images/video-call/thumbs-up-camera.webp": "50% 50%",
  "/blocks/team/portrait-omar-nasser.webp": "50% 38%",
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
 * the tile to a camera's frame. Salim and Hani have none: their camera is off,
 * as in Figma, and a tile shows their initials.
 */
const PEOPLE: Record<string, { src: string; alt: Alt }> = {
  karim: { src: "/images/social-proof/sami-naji.webp", alt: { en: "A smiling man in a white shirt with his arms crossed against a dark backdrop", ar: "رجل مبتسم يرتدي قميصًا أبيض ويشبك ذراعيه أمام خلفية داكنة" } },
  mazen: { src: "/images/social-proof/adel-qasim.webp", alt: { en: "A smiling man with a short beard in a light blue shirt, arms crossed, against a teal backdrop", ar: "رجل مبتسم بلحية قصيرة يرتدي قميصًا أزرق فاتحًا ويشبك ذراعيه أمام خلفية بترولية" } },
  omar: { src: "/images/social-proof/rashed-al-amri.webp", alt: { en: "A young man with short dark hair in an olive shirt against a grey backdrop", ar: "شاب بشعر أسود قصير وقميص بلون الزيتون أمام خلفية رمادية" } },
  tariq: { src: "/blocks/team/portrait-marcus-boateng.webp", alt: { en: "A smiling man in glasses and a black sweater against a white backdrop", ar: "رجل مبتسم يرتدي نظارة وسترة سوداء أمام خلفية بيضاء" } },
  yassin: { src: "/images/social-proof/khalid-saad.webp", alt: { en: "A man with short fair hair in a grey shirt against a light backdrop", ar: "رجل بشعر أشقر قصير يرتدي قميصًا رماديًا أمام خلفية فاتحة" } },
  adam: { src: "/images/video-call/cafe-bar-man.webp", alt: { en: "A man in a light blue blazer and white shirt at a restaurant bar", ar: "رجل يرتدي سترة زرقاء فاتحة وقميصًا أبيض عند بار مطعم" } },
  nabil: { src: "/blocks/team/portrait-rami-aziz.webp", alt: { en: "A smiling man with a short beard in a navy sweater against a grey backdrop", ar: "رجل مبتسم بلحية قصيرة يرتدي سترة كحلية أمام خلفية رمادية" } },
  bilal: { src: "/blocks/team/portrait-omar-nasser.webp", alt: { en: "A man in a dark suit and tie against a dark backdrop", ar: "رجل يرتدي بدلة داكنة ورابطة عنق أمام خلفية داكنة" } },
  laith: { src: "/images/social-proof/bader-al-ghamdi.webp", alt: { en: "An older man with glasses in a grey blazer beside a plant", ar: "رجل أكبر سنًا بنظارة يرتدي سترة رمادية بجانب نبتة" } },
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

/** The people's photos with alt text in `locale`, by participant `id`. */
export function videoCallPeople(locale: Locale): Record<string, VideoCallDemoPhoto> {
  return Object.fromEntries(Object.entries(PEOPLE).map(([id, photo]) => [id, withFocal({ src: photo.src, alt: photo.alt[locale] })]))
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
  if (STAGE_TYPES.includes(type)) props.photos = videoCallPeople(locale)
  const photo = videoCallPhoto(type, locale)
  if (photo) props.photo = photo
  return props
}
