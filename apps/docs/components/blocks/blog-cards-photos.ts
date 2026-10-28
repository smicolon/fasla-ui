/**
 * The Blog Cards block's demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos; these are the 16 Unsplash photos in
 * public/images/blog-cards/ (credits in its CREDITS.md), the same ones Figma's
 * Blog Cards set shows, each with its alt text in English and Arabic.
 *
 * Each Type's list is in the block's slot order, the start side first, which
 * is the order Figma's Desktop LTR variant places them in. A photo can sit in
 * several Types, so the lists name photos by number (1 is `photo-01.webp`).
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type BlogCardsDemoPhoto = { src: string; alt: string }

/** The 16 photos, in file order. */
const ALTS: Alt[] = [
  { en: "A desk by a window in a dim room, with sunlight on the wall", ar: "مكتب بجانب نافذة في غرفة خافتة الإضاءة وضوء الشمس على الجدار" },
  { en: "A bright room with a white desk, shelves and a pink chair", ar: "غرفة مضيئة فيها مكتب أبيض ورفوف وكرسي وردي" },
  { en: "A long corridor with a slatted wooden floor and glass cases", ar: "ممر طويل بأرضية خشبية مشقوقة وواجهات زجاجية" },
  { en: "Wooden partitions on a checkered carpet beside a glass wall", ar: "حواجز خشبية على سجاد مربعات بجانب جدار زجاجي" },
  { en: "A garden of slender trees seen through a large window", ar: "حديقة بأشجار نحيلة تظهر عبر نافذة كبيرة" },
  { en: "A row of ceramic vases on a shelf against a white wall", ar: "صف من المزهريات الخزفية على رف أمام جدار أبيض" },
  { en: "A white vase with a cracked-tile texture on a pale surface", ar: "مزهرية بيضاء بملمس يشبه البلاط المتشقق على سطح فاتح" },
  { en: "Soft shadows on cream fabric", ar: "ظلال ناعمة على قماش بلون الكريم" },
  { en: "Palm-leaf shadows on warm sand", ar: "ظلال سعف النخيل على رمل دافئ" },
  { en: "An open book seen from its spine", ar: "كتاب مفتوح يظهر من جهة كعبه" },
  { en: "A mug of orange flowers beside a sunlit shadow on a dark wall", ar: "كوب فيه أزهار برتقالية بجانب ظل مضيء على جدار داكن" },
  { en: "Two folding chairs and a desk in golden light", ar: "كرسيان قابلان للطي ومكتب في ضوء ذهبي" },
  { en: "A misty lake between mountains at dawn", ar: "بحيرة ضبابية بين الجبال عند الفجر" },
  { en: "A still lake with mist and dark trees", ar: "بحيرة ساكنة يلفها الضباب وأشجار داكنة" },
  { en: "A small pine on a frosty islet in the mist", ar: "شجرة صنوبر صغيرة على جزيرة صقيعية وسط الضباب" },
  { en: "Bare trees reflected in a misty lake", ar: "أشجار عارية تنعكس على بحيرة ضبابية" },
]

/** Each Type's photos in slot order, by photo number, from Figma's Desktop LTR variants. */
const PHOTOS: Record<string, number[]> = {
  "classic-3-up-grid": [2, 10, 13],
  "featured-two-up": [16, 15, 14],
  "compact-4-up-thumb-grid": [4, 12, 3, 10],
  "bento-editorial-grid": [5, 12],
  "split-feature": [11],
  "lead-ranked-picks": [4],
  "overlay-photo-trio": [5, 6, 3],
  "dark-editorial-feature": [9, 11, 10],
  "left-thumb-row-cards": [6, 2, 14, 8],
  "magazine-cover-story": [15],
  "pull-quote-feature": [7, 6, 3],
  "filter-sidebar-results": [4, 2, 12, 13],
  "search-chips-results": [14, 3, 16],
  "post-carousel-with-controls": [13, 2, 4, 15, 1],
  "newsletter-latest": [9, 10, 11, 7],
  "latest-popular-split": [7, 11, 6, 10, 5],
  "author-spotlight": [12, 15, 4],
  "related-posts-strip": [16, 13, 14],
}

/** Journal Bento's two sculptures, which are artwork from Figma, not Unsplash photos. */
const ARTWORK: Record<string, { file: string; alt: Alt }[]> = {
  "journal-bento": [
    { file: "journal-bento-sculpture-1", alt: { en: "A lilac glass disc over three sheets of lined paper", ar: "قرص زجاجي بنفسجي فوق ثلاث أوراق مسطّرة" } },
    { file: "journal-bento-sculpture-2", alt: { en: "A cube of interlocking indigo, amber and cream parts", ar: "مكعب من قطع متداخلة بالنيلي والعنبر والكريمي" } },
  ],
}

const photo = (number: number, locale: Locale): BlogCardsDemoPhoto => ({
  src: `/images/blog-cards/photo-${String(number).padStart(2, "0")}.webp`,
  alt: ALTS[number - 1][locale],
})

/** A Type's demo photos in the block's slot order, alt text in `locale`. */
export function blogCardsPhotos(type: string, locale: Locale): BlogCardsDemoPhoto[] {
  const art = ARTWORK[type]
  if (art) return art.map((item) => ({ src: `/images/blog-cards/${item.file}.webp`, alt: item.alt[locale] }))
  return (PHOTOS[type] ?? []).map((number) => photo(number, locale))
}

/** Every Type that has demo photos, by its name without `blog-cards-`. */
export const BLOG_CARDS_PHOTO_TYPES = [...Object.keys(PHOTOS), ...Object.keys(ARTWORK)]

/** The number of photo files, for the test that every one is used and credited. */
export const BLOG_CARDS_PHOTO_COUNT = ALTS.length

/**
 * How each Type takes its photos: one photo on each item of a copy list (a
 * post carries its own image), or one photo on a named object of the copy.
 * A Type is added here when its block is built.
 */
const PHOTO_PROP: Record<string, { list: string; key: string } | { object: string; key: string }> = {
  "classic-3-up-grid": { list: "posts", key: "image" },
  "featured-two-up": { list: "posts", key: "image" },
  "compact-4-up-thumb-grid": { list: "posts", key: "image" },
  "bento-editorial-grid": { list: "photoTiles", key: "image" },
  "overlay-photo-trio": { list: "posts", key: "image" },
  "journal-bento": { list: "features", key: "image" },
  "left-thumb-row-cards": { list: "posts", key: "image" },
  "latest-popular-split": { list: "latest", key: "image" },
}

type BlockCopy = Record<Locale, object>

/**
 * The props that put a Type's demo photos into its block: the block's own
 * copy list with a photo added to each item, in slot order. `copy` is the
 * block's exported copy.
 */
export function blogCardsPhotoProps(type: string, locale: Locale, copy?: BlockCopy): Record<string, unknown> {
  const photos = blogCardsPhotos(type, locale)
  const prop = PHOTO_PROP[type]
  if (!prop || photos.length === 0) return {}
  const source = (copy?.[locale] as Record<string, unknown> | undefined) ?? {}
  if ("list" in prop) {
    const items = (source[prop.list] as object[] | undefined) ?? []
    return { [prop.list]: items.map((item, index) => ({ ...item, [prop.key]: photos[index] })) }
  }
  return { [prop.object]: { ...(source[prop.object] as object | undefined), [prop.key]: photos[0] } }
}
