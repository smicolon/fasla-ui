/**
 * The Features block's demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos, and this adds no photo files: every
 * slot uses a photo already committed for the Hero, Blog Cards, Gallery or
 * About blocks (credits in each folder's CREDITS.md, and the slot table in
 * public/images/features/CREDITS.md), chosen to fit what Figma's slot shows.
 *
 * Each Type's list is in the block's slot order, the start side first, which is
 * the order Figma's Desktop LTR variant places them in. A file can sit in
 * several Types, so each list names files by their folder and name.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type FeaturesDemoPhoto = { src: string; alt: string }

/** Every file the Types use, with its alt text in English and Arabic. */
const ALTS: Record<string, Alt> = {
  "about/statement-band-2": { en: "A bright lounge with white chairs, a floor lamp and a glass partition", ar: "صالة مضيئة فيها كراسٍ بيضاء ومصباح أرضي وحاجز زجاجي" },
  "blog-cards/photo-04": { en: "Wooden partitions on a checkered carpet beside a glass wall", ar: "حواجز خشبية على سجاد مربعات بجانب جدار زجاجي" },
  "blog-cards/photo-06": { en: "A row of ceramic vases on a shelf against a white wall", ar: "صف من المزهريات الخزفية على رف أمام جدار أبيض" },
  "blog-cards/photo-09": { en: "Palm-leaf shadows on warm sand", ar: "ظلال سعف النخيل على رمل دافئ" },
  "blog-cards/photo-12": { en: "Two folding chairs and a desk in golden light", ar: "كرسيان قابلان للطي ومكتب في ضوء ذهبي" },
  "blog-cards/photo-13": { en: "A misty lake between mountains at dawn", ar: "بحيرة ضبابية بين الجبال عند الفجر" },
  "blog-cards/photo-14": { en: "A still lake with mist and dark trees", ar: "بحيرة ساكنة يلفها الضباب وأشجار داكنة" },
  "blog-cards/photo-15": { en: "A small pine on a frosty islet in the mist", ar: "شجرة صنوبر صغيرة على جزيرة صقيعية وسط الضباب" },
  "blog-cards/photo-16": { en: "Bare trees reflected in a misty lake", ar: "أشجار عارية تنعكس على بحيرة ضبابية" },
  "gallery/before-after-compare-2": { en: "A bright room with a white desk and chair by a window", ar: "غرفة مضيئة فيها مكتب أبيض وكرسي بجانب نافذة" },
  "gallery/featured-thumb-rail-4": { en: "An office with a white table, black chairs and trees outside the windows", ar: "مكتب فيه طاولة بيضاء وكراسٍ سوداء وأشجار خلف النوافذ" },
  "gallery/horizontal-scroll-rail-2": { en: "An open notebook, a phone, glasses and a laptop seen from above", ar: "دفتر مفتوح وهاتف ونظارة وحاسوب محمول من الأعلى" },
  "gallery/horizontal-scroll-rail-5": { en: "A grid of yellow sticky notes on a grey wall", ar: "شبكة من الملاحظات اللاصقة الصفراء على جدار رمادي" },
  "gallery/mosaic-statement-tile-2": { en: "A wooden table with chairs and a pendant lamp in a bright room", ar: "طاولة خشبية وكراسٍ ومصباح معلّق في غرفة مضيئة" },
  "gallery/mosaic-statement-tile-6": { en: "A long wooden meeting table in a room with large windows", ar: "طاولة اجتماعات خشبية طويلة في غرفة ذات نوافذ كبيرة" },
  "gallery/photo-bento-5": { en: "Sheets of paper with architectural plans", ar: "أوراق عليها مخططات معمارية" },
  "gallery/timeline-gallery-10": { en: "A grey armchair beside a small table with a plant", ar: "كرسي بذراعين رمادي بجانب طاولة صغيرة عليها نبتة" },
  "gallery/timeline-gallery-6": { en: "An office with a long table by tall windows and potted palms", ar: "مكتب فيه طاولة طويلة بجانب نوافذ عالية ونخيل في أصص" },
  "gallery/timeline-gallery-8": { en: "A white desk with a monitor on a patterned rug", ar: "مكتب أبيض عليه شاشة فوق سجادة مزخرفة" },
  "gallery/timeline-gallery-9": { en: "An office with plants and a laptop on a low table", ar: "مكتب فيه نباتات وحاسوب محمول على طاولة منخفضة" },
  "gallery/video-gallery-2": { en: "A desk with a computer and a white chair beside a plant", ar: "مكتب عليه حاسوب وكرسي أبيض بجانب نبتة" },
  "gallery/video-gallery-3": { en: "Sketches pinned to a wall", ar: "رسومات تخطيطية مثبّتة على جدار" },
  "hero/balanced-sculpture": { en: "A stacked sphere, bowl and triangle sculpture on a stone plinth", ar: "منحوتة من كرة ووعاء ومثلث متراصّة على قاعدة حجرية" },
  "hero/brick-modular-housing": { en: "A modular housing block with dark cladding and a brick gable", ar: "مبنى سكني معياري بكسوة داكنة وجملون من الطوب" },
  "hero/businesswoman-window-portrait": { en: "A smiling woman in a grey blazer seated by a tall window", ar: "امرأة مبتسمة ترتدي سترة رمادية تجلس بجانب نافذة عالية" },
  "hero/ceramic-mug-still-life": { en: "A handmade white mug with a coral handle on a round plinth", ar: "كوب أبيض مصنوع يدويًا بمقبض مرجاني على قاعدة مستديرة" },
  "hero/developer-workstation": { en: "A laptop showing code on a white desk beside a monitor and a lamp", ar: "حاسوب محمول يعرض شيفرة برمجية على مكتب أبيض بجانب شاشة ومصباح" },
  "hero/laptop-code-desk": { en: "An open laptop showing code on a desk, with a phone and sunglasses", ar: "حاسوب محمول مفتوح يعرض شيفرة على مكتب، بجانبه هاتف ونظارة شمسية" },
  "hero/living-room-gallery-wall": { en: "A bright living room with a grey sofa, two framed prints and a jute pouf", ar: "غرفة معيشة مضيئة فيها أريكة رمادية ولوحتان مؤطّرتان ومقعد من الجوت" },
  "hero/loft-living-room-dusk": { en: "A double-height loft living room with a sectional sofa at dusk", ar: "غرفة معيشة بسقف مرتفع وأريكة زاوية عند الغروب" },
  "hero/office-corridor": { en: "A long office corridor with a slatted ceiling and dark kitchen units", ar: "ممر مكتبي طويل بسقف مشقوق ووحدات مطبخ داكنة" },
  "hero/pleated-floor-lamp": { en: "A brass floor lamp with a pleated white shade on a grey wall", ar: "مصباح أرضي نحاسي بغطاء أبيض مطوي أمام جدار رمادي" },
  "hero/team-laptops-table": { en: "People working together on laptops around a wooden table, seen from above", ar: "أشخاص يعملون معًا على حواسيبهم المحمولة حول طاولة خشبية، من الأعلى" },
}

/** Each Type's photos in slot order, by its name without `features-`. */
const PHOTOS: Record<string, string[]> = {
  "split-photo-icon-list": ["hero/businesswoman-window-portrait"],
  "photo-bento": ["gallery/mosaic-statement-tile-6", "hero/developer-workstation"],
  "dark-photo-panel": ["hero/office-corridor"],
  "overlay-caption-cards": ["hero/laptop-code-desk", "gallery/horizontal-scroll-rail-5", "gallery/mosaic-statement-tile-2"],
  "feature-list-thumbnails": ["gallery/horizontal-scroll-rail-2", "gallery/timeline-gallery-6", "gallery/photo-bento-5", "gallery/timeline-gallery-9"],
  "photo-feature-chips": ["hero/team-laptops-table"],
  "media-rail": ["blog-cards/photo-12", "gallery/video-gallery-3", "gallery/video-gallery-2", "about/statement-band-2"],
  "full-bleed-photo-banner": ["gallery/featured-thumb-rail-4"],
  "editorial-photo-split": ["gallery/before-after-compare-2"],
  "photo-collage": ["hero/team-laptops-table", "hero/laptop-code-desk", "gallery/mosaic-statement-tile-6", "gallery/timeline-gallery-8", "hero/developer-workstation", "about/statement-band-2", "gallery/timeline-gallery-6"],
  "notched-photo-columns": ["gallery/photo-bento-5", "gallery/timeline-gallery-10", "hero/laptop-code-desk"],
  "perforated-photo-strip": ["blog-cards/photo-06", "hero/ceramic-mug-still-life", "hero/brick-modular-housing", "blog-cards/photo-15", "hero/balanced-sculpture", "hero/living-room-gallery-wall", "about/statement-band-2", "blog-cards/photo-09", "hero/pleated-floor-lamp", "hero/loft-living-room-dusk"],
  "portrait-photo-cards-link-row": ["blog-cards/photo-13", "blog-cards/photo-16", "blog-cards/photo-14", "blog-cards/photo-04"],
}

const photo = (file: string, locale: Locale): FeaturesDemoPhoto => ({
  src: `/images/${file}.webp`,
  alt: ALTS[file][locale],
})

/** A Type's demo photos in the block's slot order, alt text in `locale`. */
export function featuresPhotos(type: string, locale: Locale): FeaturesDemoPhoto[] {
  return (PHOTOS[type] ?? []).map((file) => photo(file, locale))
}

/** Every Type that has demo photos, by its name without `features-`. */
export const FEATURES_PHOTO_TYPES = Object.keys(PHOTOS)

/** The files the Types use, for the test that each exists and is credited. */
export const FEATURES_PHOTO_FILES = Object.keys(ALTS)

/**
 * How each Type takes its photos: as one `photo`, as a `photos` array, or as
 * one photo on each item of a list in the block's own copy (a card carries its
 * own image). A Type is added here when its block is built.
 */
type PhotoProp = { kind: "photo" } | { kind: "photos" } | { kind: "list"; list: string; key: string }
const PHOTO_PROP: Record<string, PhotoProp> = {
  "split-photo-icon-list": { kind: "photo" },
  "photo-bento": { kind: "photos" },
  "dark-photo-panel": { kind: "photo" },
  "overlay-caption-cards": { kind: "list", list: "cards", key: "image" },
  "feature-list-thumbnails": { kind: "list", list: "rows", key: "image" },
  "photo-feature-chips": { kind: "photo" },
  "media-rail": { kind: "list", list: "tiles", key: "image" },
  "full-bleed-photo-banner": { kind: "photo" },
  "editorial-photo-split": { kind: "photo" },
  "photo-collage": { kind: "photos" },
  "notched-photo-columns": { kind: "list", list: "columns", key: "image" },
  "perforated-photo-strip": { kind: "photos" },
  "portrait-photo-cards-link-row": { kind: "list", list: "cards", key: "image" },
}

type BlockCopy = Record<Locale, object>

/**
 * The props that put a Type's demo photos into its block, in slot order,
 * starting over when a copy list is longer than the Type's photos. `copy` is
 * the block's exported copy.
 */
export function featuresPhotoProps(type: string, locale: Locale, copy?: BlockCopy): Record<string, unknown> {
  const photos = featuresPhotos(type, locale)
  const prop = PHOTO_PROP[type]
  if (!prop || photos.length === 0) return {}
  if (prop.kind === "photo") return { photo: photos[0] }
  if (prop.kind === "photos") return { photos }
  const source = (copy?.[locale] as Record<string, unknown> | undefined) ?? {}
  const items = (source[prop.list] as object[] | undefined) ?? []
  return { [prop.list]: items.map((item, index) => ({ ...item, [prop.key]: photos[index % photos.length] })) }
}
