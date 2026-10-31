/**
 * The How it Works blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photos` prop. The files
 * are in public/images/how-it-works/ (see its CREDITS.md); each is a copy of one
 * already in the repo. The Types without photos draw their pictures in CSS.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type HowItWorksDemoPhoto = { src: string; alt: string }

const FILES: Record<string, { src: string; alt: Alt }> = {
  "room-window": {
    src: "/images/how-it-works/room-window.webp",
    alt: { en: "A bright empty room with tall windows, a round table and a chair", ar: "غرفة مشرقة فارغة بنوافذ عالية وطاولة مستديرة وكرسي" },
  },
  "pencils-paper": {
    src: "/images/how-it-works/pencils-paper.webp",
    alt: { en: "Coloured pencils around a blank sheet of paper on brown card", ar: "أقلام ملوّنة حول ورقة بيضاء على ورق مقوّى بني" },
  },
  "white-desk": {
    src: "/images/how-it-works/white-desk.webp",
    alt: { en: "A small desk and chair against a plain white wall", ar: "مكتب صغير وكرسي أمام جدار أبيض بسيط" },
  },
  "long-table-room": {
    src: "/images/how-it-works/long-table-room.webp",
    alt: { en: "A long wooden table with chairs in a bright room with wooden beams", ar: "طاولة خشبية طويلة بكراسٍ في غرفة مشرقة ذات عوارض خشبية" },
  },
  "wireframe-paper": {
    src: "/images/how-it-works/wireframe-paper.webp",
    alt: { en: "A blue pencil resting on a sheet of wireframe sketches", ar: "قلم أزرق على ورقة رسومات مخطّطات" },
  },
  "dark-desk": {
    src: "/images/how-it-works/dark-desk.webp",
    alt: { en: "A dark desk with a monitor and a lamp against a black wall", ar: "مكتب داكن عليه شاشة ومصباح أمام جدار أسود" },
  },
  "studio-table": {
    src: "/images/how-it-works/studio-table.webp",
    alt: { en: "A wooden trestle table and a stool in a bright studio", ar: "طاولة خشبية وكرسي مرتفع في استوديو مشرق" },
  },
  "window-desk": {
    src: "/images/how-it-works/window-desk.webp",
    alt: { en: "A wooden desk and chair by a sunlit window with a plant", ar: "مكتب خشبي وكرسي بجانب نافذة مشمسة وبها نبتة" },
  },
  "hack-week": {
    src: "/images/how-it-works/hack-week.webp",
    alt: { en: "A grid of yellow sticky notes on a wall, a hand placing the last one", ar: "شبكة من الملاحظات اللاصقة الصفراء على جدار، ويد تضع آخر ملاحظة" },
  },
  "notebook-coffee": {
    src: "/images/how-it-works/notebook-coffee.webp",
    alt: { en: "A closed grey notebook with a pen on it, a glass of coffee and a plant beside it", ar: "دفتر رمادي مغلق عليه قلم، وبجانبه كوب قهوة ونبتة" },
  },
  "wood-table-lamp": {
    src: "/images/how-it-works/wood-table-lamp.webp",
    alt: { en: "A long wooden table under a pendant lamp in a loft kitchen, with black chairs", ar: "طاولة خشبية طويلة تحت مصباح معلّق في مطبخ مفتوح، وحولها كراسٍ سوداء" },
  },
  "cup-on-wood": {
    src: "/images/how-it-works/cup-on-wood.webp",
    alt: { en: "An empty white cup on a worn wooden table", ar: "فنجان أبيض فارغ على طاولة خشبية مهترئة" },
  },
  "glass-meeting-room": {
    src: "/images/how-it-works/glass-meeting-room.webp",
    alt: { en: "A white meeting table with black chairs in an office with tall windows onto trees", ar: "طاولة اجتماعات بيضاء بكراسٍ سوداء في مكتب بنوافذ عالية تطل على أشجار" },
  },
  "sketching-hands": {
    src: "/images/how-it-works/sketching-hands.webp",
    alt: { en: "A hand sketching on a sheet of paper", ar: "يد ترسم على ورقة" },
  },
}

/**
 * A Type's photos, in the order its `photos` prop reads them, by the Type's name
 * without `how-it-works-`.
 */
const PHOTOS: Record<string, string[]> = {
  "center-spine-timeline": ["wood-table-lamp", "wireframe-paper", "cup-on-wood", "dark-desk"],
  "vertical-timeline-card": ["glass-meeting-room"],
  "numbered-photo-steps": ["room-window", "pencils-paper", "white-desk", "long-table-room"],
  "split-photo-step-list": ["studio-table"],
  "full-bleed-step-panel": ["dark-desk"],
  "overlay-numeral-cards": ["room-window", "pencils-paper", "white-desk", "long-table-room"],
  "diagonal-photo-collage": ["wireframe-paper", "pencils-paper", "dark-desk"],
  "photo-rail-progress": ["room-window", "hack-week", "white-desk", "window-desk"],
  "step-tabs-photo-panel": ["room-window", "pencils-paper", "white-desk", "long-table-room"],
  "accordion-steps": ["notebook-coffee", "pencils-paper", "white-desk", "long-table-room", "studio-table"],
  "orbital-process": ["sketching-hands"],
  "photo-bento-steps": ["sketching-hands", "pencils-paper", "white-desk", "window-desk"],
}

/** Every How it Works Type that has demo photos, by its name without `how-it-works-`. */
export const HOW_IT_WORKS_PHOTO_TYPES = Object.keys(PHOTOS)

/** The files in use, by name. */
export const HOW_IT_WORKS_PHOTO_FILES = Object.keys(FILES)

/** A Type's demo photos with their alt text in `locale`, or none. */
export function howItWorksPhotos(type: string, locale: Locale): HowItWorksDemoPhoto[] {
  return (PHOTOS[type] ?? []).map((key) => {
    const file = FILES[key]!
    return { src: file.src, alt: file.alt[locale] }
  })
}

/** The props that put a Type's demo photos into its block: its `photos`. Types without any get none. */
export function howItWorksPhotoProps(type: string, locale: Locale): Record<string, unknown> {
  const photos = howItWorksPhotos(type, locale)
  return photos.length > 0 ? { photos } : {}
}
