/**
 * The Footer blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: each takes them as props of type
 * `{ src, alt }`. Footer's own files are in public/images/footer/ (see its
 * CREDITS.md); Careers & Culture's studio photo is Hero's team-at-a-table
 * file, the same photo Figma uses.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type FooterDemoPhoto = { src: string; alt: string }

const photo = (src: string, en: string, ar: string): { src: string; alt: Alt } => ({ src, alt: { en, ar } })

/** The slot each Type's photos fill, by the Type's name without `footer-`. */
const PHOTOS: Record<string, Record<string, { src: string; alt: Alt }>> = {
  "contact-first": {
    office1: photo("/images/footer/contact-office-open-plan.webp", "A bright open-plan office with a wooden ceiling, desks and a sofa", "مكتب مفتوح مشرق بسقف خشبي ومكاتب وأريكة"),
    office2: photo("/images/footer/contact-office-lobby.webp", "A calm lobby with a green wall, a curved sofa and glass partitions", "ردهة هادئة بجدار أخضر وأريكة منحنية وحواجز زجاجية"),
  },
  "image-backed-brand": {
    background: photo("/images/footer/image-backed-facade.webp", "A dark glass facade seen from below", "واجهة زجاجية داكنة من الأسفل"),
  },
  "careers-culture": {
    studio: photo("/images/hero/team-laptops-table.webp", "A team working on laptops around a wooden table", "فريق يعمل على حواسيب محمولة حول طاولة خشبية"),
    team1: photo("/images/footer/careers-team-table.webp", "Colleagues talking around a table in a bright office", "زملاء يتحدثون حول طاولة في مكتب مشرق"),
    team2: photo("/images/footer/careers-team-long-table.webp", "Colleagues at a long wooden table seen from above", "زملاء حول طاولة خشبية طويلة من الأعلى"),
  },
  "local-business": {
    map: photo("/images/footer/local-business-street.webp", "A red-brick building with tall plane trees on a sunny street", "مبنى من الطوب الأحمر وأشجار الدلب العالية في شارع مشمس"),
  },
}

/** Every Footer Type that has demo photos, by its name without `footer-`. */
export const FOOTER_PHOTO_TYPES = Object.keys(PHOTOS)

/** Every photo file a Footer Type shows, as `src` paths. */
export function footerPhotoFiles(): string[] {
  return FOOTER_PHOTO_TYPES.flatMap((type) => Object.values(PHOTOS[type]).map((p) => p.src))
}

/** A Type's demo photos, by slot, with alt text in `locale`. */
export function footerPhotos(type: string, locale: Locale): Record<string, FooterDemoPhoto> {
  const slots = PHOTOS[type] ?? {}
  return Object.fromEntries(Object.entries(slots).map(([slot, p]) => [slot, { src: p.src, alt: p.alt[locale] }]))
}

type Copy = Record<Locale, object>

/**
 * The props that put a Type's demo photos into its block, each under the
 * prop the block names: Contact-First's offices take one each, Image-Backed
 * Brand its `background`, Careers & Culture its `studio` and `team`, Local
 * Business its `map`. Types without photos get none.
 */
export function footerPhotoProps(type: string, locale: Locale, copy: Copy): Record<string, unknown> {
  const p = footerPhotos(type, locale)
  switch (type) {
    case "contact-first": {
      const offices = (copy[locale] as { offices: object[] }).offices
      return { offices: offices.map((office, index) => ({ ...office, image: index === 0 ? p.office1 : p.office2 })) }
    }
    case "image-backed-brand":
      return { background: p.background }
    case "careers-culture":
      return { studio: p.studio, team: [p.team1, p.team2] }
    case "local-business":
      return { map: p.map }
    default:
      return {}
  }
}
