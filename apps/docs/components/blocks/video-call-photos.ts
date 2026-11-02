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
  "/images/social-proof/sami-naji.webp": "50% 18%",
  "/blocks/team/portrait-chloe-dubois.webp": "50% 14%",
  "/images/social-proof/rashed-al-amri.webp": "50% 44%",
  "/blocks/team/portrait-marcus-boateng.webp": "50% 10%",
  "/blocks/team/portrait-grace-okafor.webp": "50% 26%",
  "/images/video-call/cafe-bar-man.webp": "50% 36%",
  "/images/video-call/thumbs-up-camera.webp": "50% 50%",
  "/blocks/team/portrait-elena-novak.webp": "50% 16%",
  "/blocks/team/portrait-omar-nasser.webp": "50% 38%",
  "/blocks/team/portrait-sofia-marchetti.webp": "50% 25%",
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
 * the tile to a camera's frame. Salma and Hala have none: their camera is off,
 * as in Figma, and a tile shows their initials.
 */
const PEOPLE: Record<string, { src: string; alt: Alt }> = {
  karim: { src: "/images/social-proof/sami-naji.webp", alt: { en: "A smiling man in a white shirt with his arms crossed against a dark backdrop", ar: "رجل مبتسم يرتدي قميصًا أبيض ويشبك ذراعيه أمام خلفية داكنة" } },
  mona: { src: "/blocks/team/portrait-chloe-dubois.webp", alt: { en: "A woman with long wavy brown hair in a grey check blazer, arms crossed, against a white wall", ar: "امرأة بشعر بني طويل مموّج وسترة رمادية مربعات تشبك ذراعيها أمام جدار أبيض" } },
  omar: { src: "/images/social-proof/rashed-al-amri.webp", alt: { en: "A young man with short dark hair in an olive shirt against a grey backdrop", ar: "شاب بشعر أسود قصير وقميص بلون الزيتون أمام خلفية رمادية" } },
  tariq: { src: "/blocks/team/portrait-marcus-boateng.webp", alt: { en: "A smiling man in glasses and a black sweater against a white backdrop", ar: "رجل مبتسم يرتدي نظارة وسترة سوداء أمام خلفية بيضاء" } },
  yasmin: { src: "/blocks/team/portrait-grace-okafor.webp", alt: { en: "A smiling woman with long braids in a black top beside a sunlit window", ar: "امرأة مبتسمة بضفائر طويلة وقميص أسود بجانب نافذة مشمسة" } },
  adam: { src: "/images/video-call/cafe-bar-man.webp", alt: { en: "A man in a light blue blazer and white shirt at a restaurant bar", ar: "رجل يرتدي سترة زرقاء فاتحة وقميصًا أبيض عند بار مطعم" } },
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
