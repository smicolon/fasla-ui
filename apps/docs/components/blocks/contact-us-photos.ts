/**
 * The Contact Us blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photo` prop. The files
 * are in public/images/contact-us/ (see its CREDITS.md). Each is the photo with
 * as little cropped off as the slot allows, and a `focus` says where the slot's
 * crop is centred at each size, as Figma's image fills do: the butte is the
 * same photo in all three of its slots, framed lower in the Tablet and Mobile
 * bands. The other three fill their slots from the middle, as Figma does.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type ContactUsDemoPhoto = { src: string; alt: string; focus?: { base?: string; tablet?: string; desktop?: string } }

/**
 * The moment the live blocks (Hours and Availability, HQ Feature, Book a Call)
 * are frozen at in previews, stories and tests: Tuesday 10 March 2026, 14:20 in
 * Dubai, where Figma's frames stand. Real apps pass no `now`.
 */
export const CONTACT_US_NOW = "2026-03-10T10:20:00Z"
/** The Global Offices Table's moment: a Tuesday when London is on summer time (11:20 BST), as its frame reads. */
export const CONTACT_US_TABLE_NOW = "2026-04-07T10:20:00Z"

/** A Type's photo, by the Type's name without `contact-us-`. */
type Entry = { src: string; alt: Alt; focus?: ContactUsDemoPhoto["focus"] }
const PHOTOS: Record<string, Entry> = {
  // Form + Contact Methods: the red butte. Figma crops it to the middle of the
  // photo in the 440 × 464 slot, and to a band lower down at Tablet (720 × 320)
  // and Mobile (328 × 240): 72% and 81% of the way down.
  "form-contact-methods": {
    src: "/images/contact-us/form-contact-methods.webp",
    focus: { base: "50% 81%", tablet: "50% 72.3%", desktop: "50% 50%" },
    alt: {
      en: "A tall red rock formation lit by the setting sun under a clear evening sky",
      ar: "تكوين صخري أحمر شاهق يضيئه غروب الشمس تحت سماء مساء صافية",
    },
  },
  // Split Photo Dark: the river through the valley, centred in all three slots (700 × 731, 736 × 360, 328 × 280).
  "split-photo-dark": {
    src: "/images/contact-us/split-photo-dark.webp",
    alt: {
      en: "A river running through a pine valley below a granite cliff at sunrise",
      ar: "نهر يجري عبر وادٍ من أشجار الصنوبر تحت جرف من الغرانيت عند شروق الشمس",
    },
  },
  // Photo & Dark Panel: the woman with a phone beside a laptop that Figma shows. Figma fills all
  // three slots (580 × 570, 704 × 300, 312 × 220) from the middle of the photo, so no focus.
  "photo-and-dark-panel": {
    src: "/images/contact-us/photo-and-dark-panel.webp",
    alt: {
      en: "A woman holding a phone beside a laptop on a marble table, with a vase of dried flowers behind",
      ar: "امرأة تمسك هاتفًا بجانب حاسوب محمول على طاولة رخامية، وخلفها إناء فيه زهور مجففة",
    },
  },
  // Editorial & Address Card: the conference hall that Figma shows. Figma fills all three slots
  // (520 × 402, 736 × 300, 328 × 220) from the middle of the photo. The speaker stands low in the
  // picture, so the Tablet band (the shortest crop) is moved down to keep the whole figure in it.
  "editorial-and-address-card": {
    src: "/images/contact-us/editorial-address-card.webp",
    alt: {
      en: "A speaker on a lit stage addressing a large seated audience in a dark hall",
      ar: "متحدث على منصة مضاءة يخاطب جمهورًا كبيرًا جالسًا في قاعة مظلمة",
    },
    focus: { base: "50% 50%", tablet: "50% 85%", desktop: "50% 50%" },
  },
  // Map Split: the Dubai skyline Figma shows in the map slot (720 × 460).
  "map-split": {
    src: "/images/contact-us/map-split.webp",
    alt: {
      en: "The Burj Khalifa and skyscrapers above a multi-level highway interchange at sunrise",
      ar: "برج خليفة وناطحات السحاب فوق تقاطع طرق متعدد المستويات عند شروق الشمس",
    },
  },
  // HQ Feature: the office lounge Figma shows (664 × 440).
  // Figma fills the 664 × 440 and 328 × 318 slots from the middle and crops the Tablet band
  // (720 × 289) to the lower part of the photo: its crop starts 28.2% of the way down and
  // shows 59.2% of the height, which is 69.1% in object-position terms.
  "hq-feature": {
    src: "/images/contact-us/hq-feature.webp",
    focus: { base: "50% 50%", tablet: "50% 69.1%", desktop: "50% 50%" },
    alt: {
      en: "A lounge in a Dubai office with terracotta sofas, a living plant wall and glass meeting rooms",
      ar: "ركن استراحة في مكتب بدبي فيه أرائك بلون الطين ولوح من النباتات الحية وغرف اجتماعات زجاجية",
    },
  },
}

/**
 * Office Cards' photos, in the order of its cards (Dubai, Riyadh, Amman).
 */
const OFFICE_PHOTOS: (Entry | undefined)[] = [
  {
    src: "/images/contact-us/office-dubai.webp",
    alt: {
      en: "An aerial view of the Burj Al Arab on the Dubai coast, the city behind it",
      ar: "منظر جوي لبرج العرب على ساحل دبي وخلفه المدينة",
    },
  },
  {
    src: "/images/contact-us/office-riyadh.webp",
    alt: {
      en: "Visitors on a walkway beside a lit geometric glass building in Riyadh at night",
      ar: "زوّار على ممشى بجانب مبنى زجاجي هندسي مضاء في الرياض ليلًا",
    },
    // The visitors stand at the foot of the picture: crop from the top so they stay whole.
    focus: { base: "50% 100%", tablet: "50% 100%", desktop: "50% 100%" },
  },
  {
    src: "/images/contact-us/office-amman.webp",
    alt: {
      en: "The domed hall and ruins of the Amman Citadel, the city and a Jordanian flag behind them",
      ar: "القاعة ذات القبة وآثار قلعة عمّان، وخلفها المدينة وعلم الأردن",
    },
  },
]

/** Every Contact Us Type that has a demo photo, by its name without `contact-us-`. */
export const CONTACT_US_PHOTO_TYPES = [...Object.keys(PHOTOS), "office-cards"]

/** A Contact Us Type's demo photo with its alt text in `locale`, or nothing. */
export function contactUsPhoto(type: string, locale: Locale): ContactUsDemoPhoto | undefined {
  const photo = PHOTOS[type]
  return photo ? { src: photo.src, alt: photo.alt[locale], ...(photo.focus ? { focus: photo.focus } : {}) } : undefined
}

/** The props that put a Type's demo photo into its block: its `photo`. Types without one get none. */
export function contactUsPhotoProps(type: string, locale: Locale): Record<string, unknown> {
  if (type === "office-cards")
    return { photos: OFFICE_PHOTOS.map((entry) => (entry ? { src: entry.src, alt: entry.alt[locale], ...(entry.focus ? { focus: entry.focus } : {}) } : undefined)) }
  const photo = contactUsPhoto(type, locale)
  return photo ? { photo } : {}
}
