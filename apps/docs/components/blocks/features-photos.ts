/**
 * The Features block's demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos. These are exactly the photos Figma's
 * Features set shows, slot for slot: 15 are files already committed for the
 * Hero, Blog Cards and About blocks, and 23 are in public/images/features/
 * (credits and Figma image hashes in its CREDITS.md). Each is the same image
 * as the one in Figma, checked by the SHA-1 of Figma's original and by pixel
 * comparison.
 *
 * Each Type's list is in the block's slot order, the start side first, which
 * is the order Figma's Desktop LTR variant places them in. A file can sit in
 * several Types, so each list names files by their folder and name. A slot
 * Figma draws no photo for (the Photo Carousel's slides 2 to 4, the Photo
 * Tabs Panel's tabs 2 to 4) has none here either, and shows its empty state.
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
  "blog-cards/photo-13": { en: "A misty lake between mountains at dawn", ar: "بحيرة ضبابية بين الجبال عند الفجر" },
  "blog-cards/photo-14": { en: "A still lake with mist and dark trees", ar: "بحيرة ساكنة يلفها الضباب وأشجار داكنة" },
  "blog-cards/photo-15": { en: "A small pine on a frosty islet in the mist", ar: "شجرة صنوبر صغيرة على جزيرة صقيعية وسط الضباب" },
  "blog-cards/photo-16": { en: "Bare trees reflected in a misty lake", ar: "أشجار عارية تنعكس على بحيرة ضبابية" },
  "features/boardroom-with-long-table": { en: "A spacious boardroom with a long table and chairs", ar: "قاعة اجتماعات واسعة فيها طاولة طويلة وكراسٍ" },
  "features/collaborative-meeting-seated": { en: "People seated on chairs in a collaborative meeting", ar: "أشخاص جالسون على كراسٍ في اجتماع تعاوني" },
  "features/collaborative-meeting-table": { en: "People talking beside a table in a collaborative meeting", ar: "أشخاص يتحدثون بجانب طاولة في اجتماع تعاوني" },
  "features/colleagues-at-whiteboard": { en: "Two colleagues talking at a whiteboard", ar: "زميلان يتحدثان عند لوح أبيض" },
  "features/coworkers-laptop-design-review": { en: "Four coworkers smiling around a laptop at a table in a design office", ar: "أربعة زملاء يبتسمون حول حاسوب محمول على طاولة في مكتب تصميم" },
  "features/hands-on-laptop-analytics": { en: "Hands typing on a laptop that shows charts, with glasses beside it", ar: "أيدٍ تكتب على حاسوب محمول يعرض رسومًا بيانية، وبجانبه نظارة" },
  "features/laptop-analytics-report": { en: "A laptop showing an analytics report on a dark table", ar: "حاسوب محمول يعرض تقرير تحليلات على طاولة داكنة" },
  "features/laptop-line-graph": { en: "A laptop screen with a white line graph of market data", ar: "شاشة حاسوب محمول عليها رسم بياني خطي أبيض لبيانات السوق" },
  "features/laptop-statistics-on-glass-table": { en: "A laptop showing statistics on a glass table", ar: "حاسوب محمول يعرض إحصاءات على طاولة زجاجية" },
  "features/macbook-beside-mouse": { en: "An Apple MacBook beside a computer mouse on a table", ar: "حاسوب ماك بوك بجانب فأرة حاسوب على طاولة" },
  "features/men-around-office-tables": { en: "Three men seated at tables in an office", ar: "ثلاثة رجال جالسون إلى طاولات في مكتب" },
  "features/office-hallway-glass-walls": { en: "A long office hallway with glass walls and concrete columns", ar: "ممر مكتبي طويل بجدران زجاجية وأعمدة خرسانية" },
  "features/pastel-folders-stack": { en: "A stack of pastel folders in peach, blue and orange on a soft pink background", ar: "كومة من المجلدات بألوان الخوخ والأزرق والبرتقالي على خلفية وردية ناعمة" },
  "features/person-working-on-wooden-desk": { en: "A person working on a laptop at a wooden desk", ar: "شخص يعمل على حاسوب محمول عند مكتب خشبي" },
  "features/pink-chairs-in-workspace": { en: "Modern chairs with pink and grey fabric around small tables in a workspace", ar: "كراسٍ عصرية بقماش وردي ورمادي حول طاولات صغيرة في مساحة عمل" },
  "features/presenter-laptops-room": { en: "A man standing in front of colleagues seated at laptops around a long table", ar: "رجل واقف أمام زملاء جالسين بحواسيبهم حول طاولة طويلة" },
  "features/startup-team-around-laptops": { en: "A group of people around a table with laptops at a startup meeting", ar: "مجموعة من الأشخاص حول طاولة عليها حواسيب محمولة في اجتماع لشركة ناشئة" },
  "features/stock-chart-on-laptop": { en: "A stock market chart on a laptop screen", ar: "رسم بياني لسوق الأسهم على شاشة حاسوب محمول" },
  "features/team-around-meeting-table": { en: "People seated around a table in a meeting", ar: "أشخاص جالسون حول طاولة في اجتماع" },
  "features/team-whiteboard-meeting": { en: "Three men seated with laptops watching a man at a whiteboard", ar: "ثلاثة رجال جالسون بحواسيبهم يراقبون رجلًا عند لوح أبيض" },
  "features/three-men-laughing-at-laptop": { en: "Three men laughing while looking at a laptop in a room", ar: "ثلاثة رجال يضحكون وهم ينظرون إلى حاسوب محمول داخل غرفة" },
  "features/two-men-at-computer": { en: "One man standing beside another who sits at a computer", ar: "رجل واقف بجانب رجل آخر جالس أمام حاسوب" },
  "features/whiteboard-discussion": { en: "A woman presenting at a whiteboard to a seated colleague", ar: "امرأة تعرض على لوح أبيض أمام زميل جالس" },
  "hero/balanced-sculpture": { en: "A stacked sphere, bowl and triangle sculpture on a stone plinth", ar: "منحوتة من كرة ووعاء ومثلث متراصّة على قاعدة حجرية" },
  "hero/brick-modular-housing": { en: "A modular housing block with dark cladding and a brick gable", ar: "مبنى سكني معياري بكسوة داكنة وجملون من الطوب" },
  "hero/businesswoman-window-portrait": { en: "A smiling woman in a grey blazer seated by a tall window", ar: "امرأة مبتسمة ترتدي سترة رمادية تجلس بجانب نافذة عالية" },
  "hero/ceramic-mug-still-life": { en: "A handmade white mug with a coral handle on a round plinth", ar: "كوب أبيض مصنوع يدويًا بمقبض مرجاني على قاعدة مستديرة" },
  "hero/laptop-code-desk": { en: "An open laptop showing code on a desk, with a phone and sunglasses", ar: "حاسوب محمول مفتوح يعرض شيفرة على مكتب، بجانبه هاتف ونظارة شمسية" },
  "hero/living-room-gallery-wall": { en: "A bright living room with a grey sofa, two framed prints and a jute pouf", ar: "غرفة معيشة مضيئة فيها أريكة رمادية ولوحتان مؤطّرتان ومقعد من الجوت" },
  "hero/woman-white-collar-portrait": { en: "A woman with short hair in a patterned top and a white collar", ar: "امرأة بشعر قصير ترتدي قميصًا مزخرفًا بياقة بيضاء" },
}

/** Each Type's photos in slot order, by its name without `features-`. */
const PHOTOS: Record<string, string[]> = {
  "split-photo-icon-list": ["features/coworkers-laptop-design-review"],
  "photo-bento": ["features/team-whiteboard-meeting", "features/hands-on-laptop-analytics"],
  "feature-list-thumbnails": ["features/laptop-analytics-report", "features/laptop-line-graph", "features/colleagues-at-whiteboard", "features/two-men-at-computer"],
  "photo-feature-chips": ["features/three-men-laughing-at-laptop"],
  "media-rail": ["features/team-around-meeting-table", "features/stock-chart-on-laptop", "hero/laptop-code-desk", "about/statement-band-2"],
  "full-bleed-photo-banner": ["features/boardroom-with-long-table"],
  "editorial-photo-split": ["features/pink-chairs-in-workspace"],
  "photo-collage": ["features/collaborative-meeting-seated", "features/three-men-laughing-at-laptop", "features/startup-team-around-laptops", "features/presenter-laptops-room", "features/two-men-at-computer", "features/whiteboard-discussion", "features/office-hallway-glass-walls"],
  "notched-photo-columns": ["features/pastel-folders-stack", "features/macbook-beside-mouse", "features/person-working-on-wooden-desk"],
  "perforated-photo-strip": ["blog-cards/photo-06", "hero/ceramic-mug-still-life", "hero/brick-modular-housing", "blog-cards/photo-15", "hero/balanced-sculpture", "hero/living-room-gallery-wall", "features/pink-chairs-in-workspace", "blog-cards/photo-09", "blog-cards/photo-16", "about/statement-band-2"],
  "portrait-photo-cards-link-row": ["blog-cards/photo-13", "blog-cards/photo-16", "blog-cards/photo-14", "blog-cards/photo-04"],
  "photo-carousel": ["features/men-around-office-tables"],
  "photo-tabs-panel": ["features/laptop-statistics-on-glass-table"],
  "accordion-photo": ["features/collaborative-meeting-table"],
  "numbered-steps-floating-cards": ["features/colleagues-at-whiteboard", "hero/businesswoman-window-portrait"],
  "icon-titled-preview-rail": ["hero/woman-white-collar-portrait"],
  "showcase-card-pair": ["about/statement-band-2", "features/office-hallway-glass-walls"],
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
 * How each Type takes its photos: as one `photo`, as a `photos` array, as named
 * props (a background and an avatar), or as one photo on each item of a list
 * in the block's own copy (a card carries its own image). A Type is added here
 * when its block is built.
 */
type PhotoProp = { kind: "photo" } | { kind: "photos" } | { kind: "named"; props: string[] } | { kind: "list"; list: string; key: string }
const PHOTO_PROP: Record<string, PhotoProp> = {
  "split-photo-icon-list": { kind: "photo" },
  "photo-bento": { kind: "photos" },
  "feature-list-thumbnails": { kind: "list", list: "rows", key: "image" },
  "photo-feature-chips": { kind: "photo" },
  "media-rail": { kind: "list", list: "tiles", key: "image" },
  "full-bleed-photo-banner": { kind: "photo" },
  "editorial-photo-split": { kind: "photo" },
  "photo-collage": { kind: "photos" },
  "notched-photo-columns": { kind: "list", list: "columns", key: "image" },
  "perforated-photo-strip": { kind: "photos" },
  "portrait-photo-cards-link-row": { kind: "list", list: "cards", key: "image" },
  "photo-carousel": { kind: "list", list: "slides", key: "image" },
  "photo-tabs-panel": { kind: "list", list: "tabs", key: "image" },
  "accordion-photo": { kind: "photo" },
  "numbered-steps-floating-cards": { kind: "named", props: ["photo", "avatar"] },
  "icon-titled-preview-rail": { kind: "named", props: ["contactPhoto"] },
  "showcase-card-pair": { kind: "photos" },
}

type BlockCopy = Record<Locale, object>

/**
 * The props that put a Type's demo photos into its block, in slot order. An
 * item of a copy list past the Type's last photo gets none and shows its empty
 * state, as Figma's undrawn slides and panels do. `copy` is the block's
 * exported copy.
 */
export function featuresPhotoProps(type: string, locale: Locale, copy?: BlockCopy): Record<string, unknown> {
  const photos = featuresPhotos(type, locale)
  const prop = PHOTO_PROP[type]
  if (!prop || photos.length === 0) return {}
  if (prop.kind === "photo") return { photo: photos[0] }
  if (prop.kind === "photos") return { photos }
  if (prop.kind === "named") return Object.fromEntries(prop.props.map((name, index) => [name, photos[index]]).filter(([, found]) => found))
  const source = (copy?.[locale] as Record<string, unknown> | undefined) ?? {}
  const items = (source[prop.list] as object[] | undefined) ?? []
  return { [prop.list]: items.map((item, index) => ({ ...item, [prop.key]: photos[index] })) }
}
