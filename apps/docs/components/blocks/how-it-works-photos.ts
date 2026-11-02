/**
 * The How it Works blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photos` prop. The files
 * are in public/images/how-it-works/ (see its CREDITS.md): copies of photos already
 * in the repo, and eight screen photos from Unsplash. The Types without photos draw
 * their pictures in CSS.
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
  "style-guide-monitor": {
    src: "/images/how-it-works/style-guide-monitor.webp",
    alt: {
      en: "A designer seen from behind, in headphones, at a curved monitor showing a style guide with colour swatches, in a dark blue room with a desk lamp and a plant",
      ar: "مصمم يظهر من الخلف يضع سماعات رأس أمام شاشة منحنية تعرض دليل أسلوب بعيّنات ألوان، في غرفة زرقاء داكنة فيها مصباح مكتب ونبتة",
    },
  },
  "imac-app-artboards": {
    src: "/images/how-it-works/imac-app-artboards.webp",
    alt: {
      en: "An iMac showing four colourful mobile app designs laid out in a design tool, on a white desk with plants beside it",
      ar: "جهاز آي ماك يعرض أربعة تصاميم ملوّنة لتطبيق جوال في أداة تصميم، على مكتب أبيض بجانبه نباتات",
    },
  },
  "designer-imac-grid": {
    src: "/images/how-it-works/designer-imac-grid.webp",
    alt: {
      en: "A designer in profile at an iMac, looking at a grid of layouts, at a desk in a warm room with a window",
      ar: "مصمم بوضع جانبي أمام جهاز آي ماك يتأمل شبكة من التصاميم، على مكتب في غرفة دافئة بنافذة",
    },
  },
  "wall-dashboard-office": {
    src: "/images/how-it-works/wall-dashboard-office.webp",
    alt: {
      en: "A wall-mounted screen showing a dashboard in a bright office, with a colourful chest of drawers below it and glass walls beside it",
      ar: "شاشة معلّقة على الجدار تعرض لوحة معلومات في مكتب مشرق، وتحتها خزانة أدراج ملوّنة وبجانبها جدران زجاجية",
    },
  },
  "presenter-wall-screen": {
    src: "/images/how-it-works/presenter-wall-screen.webp",
    alt: {
      en: "A smiling colleague pointing at a screen on a pink wall in a meeting room, with a laptop and a flask on the table in front of him",
      ar: "زميل مبتسم يشير إلى شاشة على جدار وردي في غرفة اجتماعات، وأمامه على الطاولة حاسوب محمول وزجاجة",
    },
  },
  "laptop-build-website": {
    src: "/images/how-it-works/laptop-build-website.webp",
    alt: {
      en: "A laptop on a wooden desk showing a website page with a headline and a photo of a modern building, beside a black mug and a phone",
      ar: "حاسوب محمول على مكتب خشبي يعرض صفحة موقع فيها عنوان كبير وصورة مبنى حديث، بجانبه كوب أسود وهاتف",
    },
  },
  "phone-app-in-hand": {
    src: "/images/how-it-works/phone-app-in-hand.webp",
    alt: {
      en: "A hand holding a phone that shows a dark app with a round counter and a pink button, against a pale grey wall",
      ar: "يد تمسك هاتفًا يعرض تطبيقًا داكنًا فيه عدّاد دائري وزر وردي، أمام جدار رمادي فاتح",
    },
  },
  "monochrome-site-laptop": {
    src: "/images/how-it-works/monochrome-site-laptop.webp",
    alt: {
      en: "A black laptop on white bedding showing a black-and-white page with a grid of photos",
      ar: "حاسوب محمول أسود على فراش أبيض يعرض صفحة بالأبيض والأسود فيها شبكة من الصور",
    },
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
  "center-spine-timeline": ["wood-table-lamp", "wireframe-paper", "laptop-build-website", "glass-meeting-room"],
  "vertical-timeline-card": ["glass-meeting-room"],
  "numbered-photo-steps": ["hack-week", "pencils-paper", "style-guide-monitor", "long-table-room"],
  "split-photo-step-list": ["studio-table"],
  "full-bleed-step-panel": ["dark-desk"],
  "overlay-numeral-cards": ["hack-week", "pencils-paper", "wall-dashboard-office", "long-table-room"],
  "diagonal-photo-collage": ["wireframe-paper", "pencils-paper", "long-table-room"],
  "photo-rail-progress": ["room-window", "hack-week", "presenter-wall-screen", "phone-app-in-hand"],
  "step-tabs-photo-panel": ["hack-week", "pencils-paper", "imac-app-artboards", "long-table-room"],
  "accordion-steps": ["hack-week", "pencils-paper", "designer-imac-grid", "long-table-room", "notebook-coffee"],
  "orbital-process": ["sketching-hands"],
  "photo-bento-steps": ["sketching-hands", "hack-week", "wireframe-paper", "monochrome-site-laptop"],
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
