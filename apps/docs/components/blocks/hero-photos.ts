/**
 * The Hero block's demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos; these are the photos Figma's Hero set
 * uses, exported to public/images/hero/ (listed in its CREDITS.md), each with
 * its alt text in English and Arabic. Several Types share a photo, as they do
 * in Figma, so the alt text is kept once per file.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

const ALTS: Record<string, Alt> = {
  "developer-workstation": {
    en: "A developer's desk with code on two monitors",
    ar: "مكتب مبرمج وعلى شاشتيه شيفرة برمجية",
  },
  "team-laptops-table": {
    en: "A team working on laptops around a long wooden table",
    ar: "فريق يعمل على حواسيب محمولة حول طاولة خشبية طويلة",
  },
  "office-corridor": {
    en: "A long office corridor with glass doors, between a lounge and an open kitchen",
    ar: "ممر مكتب طويل بأبواب زجاجية، بين ركن للجلوس ومطبخ مفتوح",
  },
  "woman-white-collar-portrait": {
    en: "Portrait of a woman in a white collared shirt, chin resting on her hand",
    ar: "صورة لامرأة ترتدي قميصًا أبيض بياقة، تسند ذقنها إلى يدها",
  },
  "ceramic-mug-still-life": {
    en: "A white ceramic mug with a coral handle on a round stone plinth",
    ar: "كوب خزفي أبيض بمقبض مرجاني على قاعدة حجرية مستديرة",
  },
  "balanced-sculpture": {
    en: "A stacked sculpture of a coral sphere, a blue bowl, a green ball and a yellow triangle on a stone plinth",
    ar: "منحوتة متراصّة من كرة مرجانية ووعاء أزرق وكرة خضراء ومثلث أصفر على قاعدة حجرية",
  },
  "packaging-boxes-blue": {
    en: "Coral and teal packaging boxes stacked against a deep blue backdrop",
    ar: "علب تغليف بلون المرجان والفيروزي مكدّسة أمام خلفية زرقاء داكنة",
  },
  "handshake-cutout": {
    en: "Two people shaking hands, in black and white",
    ar: "شخصان يتصافحان، بالأبيض والأسود",
  },
  "cat-chef-illustration.svg": {
    en: "A black cat in a chef's hat kneading bread dough beside a bowl of biscuits",
    ar: "قطة سوداء تعتمر قبعة طاهٍ وتعجن العجين بجانب وعاء من البسكويت",
  },
  "child-building-blocks": {
    en: "A child stacking colourful building blocks at a wooden table",
    ar: "طفل يرصّ مكعبات بناء ملوّنة على طاولة خشبية",
  },
  "businesswoman-window-portrait": {
    en: "A smiling woman in a grey blazer standing by an office window",
    ar: "امرأة مبتسمة ترتدي سترة رمادية تقف بجوار نافذة مكتب",
  },
  "laptop-code-desk": {
    en: "A laptop showing code on a desk beside a phone and sunglasses",
    ar: "حاسوب محمول يعرض شيفرة برمجية على مكتب بجانب هاتف ونظارة شمسية",
  },
  "three-friends-portrait": {
    en: "Three young women lying close together, one looking at the camera",
    ar: "ثلاث شابات مستلقيات متقاربات، تنظر إحداهن إلى الكاميرا",
  },
  "berry-pancake-skillet": {
    en: "A skillet pancake topped with blueberries on a dark blue table",
    ar: "فطيرة في مقلاة تعلوها حبات التوت الأزرق على طاولة زرقاء داكنة",
  },
  "slow-street-alley": {
    en: "A narrow street between white houses with SLOW painted on the road",
    ar: "شارع ضيق بين بيوت بيضاء كُتبت على أرضه كلمة SLOW",
  },
  "woman-hat-portrait": {
    en: "A woman in a black hat and a dark green top against a dark background",
    ar: "امرأة بقبعة سوداء وبلوزة خضراء داكنة أمام خلفية داكنة",
  },
  "dark-lounge-sofa": {
    en: "A leather sofa with rust cushions in a dark lounge with slatted walls",
    ar: "أريكة جلدية بوسائد بلون الصدأ في صالة داكنة بجدران من الشرائح",
  },
  "living-room-gallery-wall": {
    en: "A bright living room with a grey sofa and two framed prints",
    ar: "غرفة جلوس مضيئة بأريكة رمادية ولوحتين مؤطّرتين",
  },
  "hot-air-balloons-valley": {
    en: "Hot-air balloons over a rocky valley at sunrise",
    ar: "مناطيد هوائية فوق وادٍ صخري عند الشروق",
  },
  "abstract-black-swirl": {
    en: "A grainy black-and-white abstract swirl",
    ar: "دوّامة تجريدية محبّبة بالأبيض والأسود",
  },
  "pleated-floor-lamp": {
    en: "A brass floor lamp with a pleated white shade",
    ar: "مصباح أرضي نحاسي بغطاء أبيض مطويّ",
  },
  "curved-steel-facade": {
    en: "A curved steel building facade against a blue sky",
    ar: "واجهة مبنى منحنية من الفولاذ أمام سماء زرقاء",
  },
  "copper-wave-pavilion": {
    en: "A wave-shaped copper pavilion beside water",
    ar: "جناح نحاسي على شكل موجة بجانب الماء",
  },
  "woman-monochrome-portrait": {
    en: "A black-and-white portrait of a woman with curly hair",
    ar: "صورة بالأبيض والأسود لامرأة بشعر مجعّد",
  },
  "sage-living-room-mirror": {
    en: "A sage-green living room with a round mirror and plants",
    ar: "غرفة جلوس بلون المريمية فيها مرآة دائرية ونباتات",
  },
  "brick-modular-housing": {
    en: "Modular housing with dark cladding beside a brick gable",
    ar: "مساكن نمطية بكسوة داكنة بجانب واجهة من الطوب",
  },
  "desert-highway": {
    en: "A straight desert road running towards distant mountains",
    ar: "طريق صحراوي مستقيم يمتد نحو جبال بعيدة",
  },
  "loft-living-room-dusk": {
    en: "A double-height loft living room with a large sofa at dusk",
    ar: "غرفة جلوس بسقف مرتفع وأريكة كبيرة عند الغسق",
  },
}

/**
 * The people on the cards that show faces, by photo file. An avatar's name is
 * its photo's alt, so these are demo names.
 */
const PEOPLE: Record<string, Alt> = {
  "curved-steel-facade": { en: "Omar Khalil", ar: "عمر خليل" },
  "woman-monochrome-portrait": { en: "Nadia Rahman", ar: "نادية رحمن" },
  "woman-hat-portrait": { en: "Lina Haddad", ar: "لينا حداد" },
  "three-friends-portrait": { en: "Sara Malik", ar: "سارة مالك" },
}

/** Figma's three faces, in its order, for the cards that show them. */
const FACES = ["woman-monochrome-portrait", "woman-hat-portrait", "three-friends-portrait"]

/**
 * Each Type's demo photos, by its name without `hero-`: one `photo`, a
 * `photos` list in the block's slot order, and `people` for faces.
 * `photoDecorative` gives the single photo an empty alt, for a photo set
 * inside a heading, where its description would interrupt the words.
 * `srcs` fills props that take only an image path, such as a face whose
 * name already comes from the block's copy. `avatars` fills single-face
 * props, `{ src, name }`, with a demo name in each language. `named` fills
 * any other single-photo prop, `{ src, alt }`, such as an inset photo;
 * `decorative` lists those whose alt is "", where a printed name beside the
 * photo already says who it is. `videos` fills video props, `{ src, type }`,
 * with the demo films made from these photos (MP4, no sound).
 */
const DEMO: Record<string, { photo?: string; photoDecorative?: boolean; photos?: string[]; people?: string[]; srcs?: Record<string, string>; named?: Record<string, string>; decorative?: string[]; videos?: Record<string, string>; avatars?: Record<string, { file: string; name: Alt }> }> = {
  "editorial-arch": { photo: "woman-hat-portrait" },
  "photo-constellation": { photos: ["slow-street-alley", "abstract-black-swirl", "copper-wave-pavilion", "pleated-floor-lamp", "curved-steel-facade", "woman-monochrome-portrait", "hot-air-balloons-valley", "living-room-gallery-wall", "three-friends-portrait", "dark-lounge-sofa", "berry-pancake-skillet", "desert-highway", "loft-living-room-dusk", "brick-modular-housing"] },
  "arc-gallery": { photos: ["dark-lounge-sofa", "living-room-gallery-wall", "hot-air-balloons-valley", "abstract-black-swirl", "pleated-floor-lamp", "curved-steel-facade", "copper-wave-pavilion", "woman-monochrome-portrait", "sage-living-room-mirror", "brick-modular-housing", "desert-highway"] },
  "inline-image-headline": { photo: "three-friends-portrait", photoDecorative: true, photos: ["woman-monochrome-portrait", "curved-steel-facade", "sage-living-room-mirror", "living-room-gallery-wall"] },
  "bento-split": { photo: "copper-wave-pavilion", people: FACES },
  "framed-full-bleed": { photo: "loft-living-room-dusk", people: FACES },
  "annotated-object": { photo: "abstract-black-swirl", avatars: { cardAvatar: { file: "curved-steel-facade", name: { en: "Daybreak Café", ar: "مقهى الفجر" } } } },
  "editorial-triptych": { photos: ["copper-wave-pavilion", "curved-steel-facade", "brick-modular-housing"], people: ["woman-monochrome-portrait", "woman-hat-portrait", "three-friends-portrait", "curved-steel-facade"] },
  "twin-panels": { photos: ["slow-street-alley", "pleated-floor-lamp", "sage-living-room-mirror", "dark-lounge-sofa", "loft-living-room-dusk", "abstract-black-swirl", "woman-monochrome-portrait", "living-room-gallery-wall"] },
  "split-band-headline": { photo: "dark-lounge-sofa", named: { insetPhoto: "woman-monochrome-portrait" } },
  "textured-dark": { photo: "abstract-black-swirl" },
  "curved-media-rail": { photos: ["dark-lounge-sofa", "berry-pancake-skillet", "woman-monochrome-portrait", "desert-highway", "sage-living-room-mirror", "hot-air-balloons-valley", "living-room-gallery-wall"] },
  "framed-studio-card": { photo: "laptop-code-desk", named: { authorPhoto: "woman-monochrome-portrait" }, decorative: ["authorPhoto"] },
  "orbit-track": { photos: ["woman-monochrome-portrait", "woman-hat-portrait", "three-friends-portrait", "curved-steel-facade", "laptop-code-desk", "pleated-floor-lamp", "sage-living-room-mirror", "brick-modular-housing", "laptop-code-desk"] },
  "shape-grid": { photo: "child-building-blocks" },
  "wave-band": { photo: "handshake-cutout" },
  "studio-mosaic": { photos: ["ceramic-mug-still-life", "balanced-sculpture", "packaging-boxes-blue"] },
  "illustration-split": { named: { illustration: "cat-chef-illustration.svg" } },
  "masked-type-reveal": { photo: "team-laptops-table", named: { stillPhoto: "office-corridor" } },
  "duo-card": { photo: "businesswoman-window-portrait" },
  "video-spotlight": { named: { poster: "office-corridor" }, videos: { video: "office-film.mp4" } },
  "brand-color-block": { photo: "woman-white-collar-portrait" },
  "video-in-type": { named: { poster: "developer-workstation" }, videos: { video: "studio-reel-loop.mp4" } },
}

export type HeroDemoPhoto = { src: string; alt: string }

/** A file's path: the photos are webp, named without the extension; the drawings keep theirs (`.svg`). */
const srcOf = (file: string) => `/images/hero/${file.includes(".") ? file : `${file}.webp`}`

const photo = (file: string, locale: Locale): HeroDemoPhoto => ({
  src: srcOf(file),
  alt: ALTS[file]?.[locale] ?? "",
})

const person = (file: string, locale: Locale) => ({ src: srcOf(file), name: PEOPLE[file]?.[locale] ?? "" })

/** Each Type's demo props, built from its `DEMO` entry in `locale`. */
function demoProps(type: string, locale: Locale): Record<string, unknown> {
  const demo = DEMO[type]
  if (!demo) return {}
  return {
    ...(demo.photo ? { photo: demo.photoDecorative ? { ...photo(demo.photo, locale), alt: "" } : photo(demo.photo, locale) } : {}),
    ...(demo.photos ? { photos: demo.photos.map((file) => photo(file, locale)) } : {}),
    ...(demo.people ? { people: demo.people.map((file) => person(file, locale)) } : {}),
    ...Object.fromEntries(Object.entries(demo.srcs ?? {}).map(([prop, file]) => [prop, srcOf(file)])),
    ...Object.fromEntries(
      Object.entries(demo.named ?? {}).map(([prop, file]) => [prop, demo.decorative?.includes(prop) ? { ...photo(file, locale), alt: "" } : photo(file, locale)])
    ),
    ...Object.fromEntries(Object.entries(demo.videos ?? {}).map(([prop, file]) => [prop, { src: srcOf(file), type: "video/mp4" }])),
    ...Object.fromEntries(Object.entries(demo.avatars ?? {}).map(([prop, face]) => [prop, { src: srcOf(face.file), name: face.name[locale] }])),
  }
}

/** Every Hero Type that has demo photos, by its name without `hero-`. */
export const HERO_PHOTO_TYPES = Object.keys(DEMO)

/** The props that put a Type's demo photos into its block, described in `locale`. */
export function heroPhotoProps(type: string, locale: Locale): Record<string, unknown> {
  return demoProps(type, locale)
}

/** Every photo a Type's demo uses, with its description: the photos and the faces. */
export function heroDemoImages(type: string, locale: Locale): HeroDemoPhoto[] {
  const props = heroPhotoProps(type, locale)
  const named = Object.keys(DEMO[type]?.named ?? {}).map((prop) => props[prop])
  const list = [props.photo, ...named, ...((props.photos as HeroDemoPhoto[] | undefined) ?? [])].filter(Boolean) as HeroDemoPhoto[]
  const faces = ((props.people as { src: string; name: string }[] | undefined) ?? []).map((person) => ({ src: person.src, alt: person.name }))
  const avatars = Object.keys(DEMO[type]?.avatars ?? {}).map((prop) => props[prop] as { src: string; name: string }).map((face) => ({ src: face.src, alt: face.name }))
  return [...list, ...faces, ...avatars]
}

/** The paths a Type's demo passes to its image-path and video props (`srcs`, `videos`), which take no alt of their own. */
export function heroDemoSrcs(type: string): string[] {
  return [...Object.values(DEMO[type]?.srcs ?? {}), ...Object.values(DEMO[type]?.videos ?? {})].map(srcOf)
}
