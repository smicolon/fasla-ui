/**
 * The Careers blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos: a block takes a `photo` prop. Careers'
 * own files are in public/images/careers/ (see its CREDITS.md); the ones Figma
 * shares with Hero are the Hero files.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

export type CareersDemoPhoto = { src: string; alt: string }

/** A Type's photo, by the Type's name without `careers-`. */
const PHOTOS: Record<string, { src: string; alt: Alt }> = {
  // The About us card: the portrait under the play button.
  "about-card-role-list": {
    src: "/images/careers/about-card-portrait.webp",
    alt: {
      en: "A team member in a dark sweater against a plain light wall",
      ar: "أحد أعضاء الفريق يرتدي سترة داكنة أمام جدار فاتح بسيط",
    },
  },
  // The Featured Role Spotlight: three people laughing over laptops.
  "featured-role-spotlight": {
    src: "/images/careers/spotlight-photo.webp",
    alt: {
      en: "Three colleagues laughing around a wooden table with laptops and notebooks",
      ar: "ثلاثة زملاء يضحكون حول طاولة خشبية عليها حواسيب محمولة ودفاتر",
    },
  },
  // Perks & Benefits: Figma's Culture Photo is Hero's corridor, so the file is Hero's.
  "perks-benefits": {
    src: "/images/hero/office-corridor.webp",
    alt: {
      en: "A long office corridor with a slatted ceiling and dark kitchen units",
      ar: "ممر مكتب طويل بسقف مشقوق ووحدات مطبخ داكنة",
    },
  },
  // Role Detail Page: the banner is Figma's Header Photo, which is Hero's team-at-a-table file.
  "role-detail-page": {
    src: "/images/hero/team-laptops-table.webp",
    alt: {
      en: "A team working on laptops around a wooden table",
      ar: "فريق يعمل على حواسيب محمولة حول طاولة خشبية",
    },
  },
  // No Open Roles: a handshake.
  "no-open-roles-empty-state": {
    src: "/images/careers/team-handshake.webp",
    alt: {
      en: "Two people shaking hands in a meeting room",
      ar: "شخصان يتصافحان في قاعة اجتماعات",
    },
  },
}

/** Every Careers Type that has a demo photo, by its name without `careers-`. */
export const CAREERS_PHOTO_TYPES = Object.keys(PHOTOS)

/** A Careers Type's demo photo with its alt text in `locale`, or nothing. */
export function careersPhoto(type: string, locale: Locale): CareersDemoPhoto | undefined {
  const photo = PHOTOS[type]
  return photo ? { src: photo.src, alt: photo.alt[locale] } : undefined
}

/** The props that put a Type's demo photo into its block: its `photo`. Types without one get none. */
export function careersPhotoProps(type: string, locale: Locale): Record<string, unknown> {
  const photo = careersPhoto(type, locale)
  return photo ? { photo } : {}
}
