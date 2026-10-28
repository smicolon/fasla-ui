/**
 * The About block's demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos. Most are the Gallery photos in
 * public/images/gallery/ (credited there); the four Figma places itself and
 * that fit the photo brief are in public/images/about/ (see its CREDITS.md).
 * Figma's other photos of groups, meetings and drinks were swapped for calm
 * Gallery photos that match each slot's caption.
 *
 * Each list is in the block's slot order.
 */

import { galleryPhotoFile, type GalleryDemoPhoto } from "./gallery-photos"

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

/** A Gallery photo, by Gallery Type and file number. */
type FromGallery = { gallery: string; file: number }
/** One of About's own photos, by file name in public/images/about/. */
type Own = { about: string; alt: Alt }
type Slot = FromGallery | Own

const g = (gallery: string, file: number): FromGallery => ({ gallery, file })

const PHOTOS: Record<string, Slot[]> = {
  // The three chips in the headline: tools, teamwork, effortless.
  "mission-statement-hero": [g("horizontal-scroll-rail", 2), g("mosaic-statement-tile", 2), g("full-bleed-slider", 1)],
  // The fanned cards, far start to far end.
  "collage-hero": [
    g("timeline-gallery", 1),
    g("album-cards", 3),
    g("mosaic-statement-tile", 6),
    g("video-gallery", 3),
    g("horizontal-scroll-rail", 5),
  ],
  // The edge photos: top start, top end, start middle, bottom end.
  "statement-band": [
    g("timeline-gallery", 6),
    {
      about: "statement-band-2",
      alt: { en: "An empty office lounge with pale armchairs and a sofa", ar: "صالة مكتب فارغة فيها كراسٍ فاتحة وأريكة" },
    },
    g("culture-photo-grid", 5),
    {
      about: "statement-band-4",
      alt: { en: "A long, empty office corridor with a kitchen along one side", ar: "ممر مكتب طويل وفارغ يمتد بجانبه مطبخ" },
    },
  ],
  "values-spotlight": [g("contact-sheet-wall", 3)],
  "approach-stack-cards": [g("album-cards", 2)],
  // The polaroids: The first espresso, Launch night, Offsite somewhere high, Miso.
  "story-snapshots": [
    g("mosaic-statement-tile", 5),
    g("culture-photo-grid", 2),
    g("scattered-collage", 3),
    {
      about: "story-snapshots-4",
      alt: { en: "A small dog with its eyes closed against a blue wall", ar: "كلب صغير مغمض العينين أمام جدار أزرق" },
    },
  ],
  bento: [g("social-feed-strip", 6)],
  // The masonry: The adventures, Demo Friday, Build Week, Late-night launches.
  "culture-masonry": [g("horizontal-scroll-rail", 1), g("video-gallery", 2), g("hover-index-list", 3), g("dark-cinema-wall", 1)],
  "impact-stats-band": [
    {
      about: "impact-stats-band-1",
      alt: { en: "Green mountain ridges with one walker on a rock", ar: "سلاسل جبلية خضراء ومتنزّه واحد على صخرة" },
    },
  ],
  "story-photos": [g("culture-photo-grid", 1), g("culture-photo-grid", 6), g("hover-caption-cards", 2)],
  "split-panel": [g("hover-caption-cards", 3)],
  "letter-card": [g("filter-tabs-grid", 3)],
  "values-focus": [g("filter-tabs-grid", 6)],
  "headline-photos": [
    g("photo-bento", 3),
    g("editorial-split", 1),
    g("photo-bento", 5),
    g("editorial-split", 2),
    g("photo-bento", 4),
  ],
}

/** An About Type's demo photos in the block's slot order, alt text in `locale`. */
export function aboutPhotos(type: string, locale: Locale): GalleryDemoPhoto[] {
  return (PHOTOS[type] ?? []).map((slot) =>
    "gallery" in slot
      ? galleryPhotoFile(slot.gallery, slot.file, locale)
      : { src: `/images/about/${slot.about}.webp`, alt: slot.alt[locale] }
  )
}

/** Every About Type that has demo photos, by its name without `about-`. */
export const ABOUT_PHOTO_TYPES = Object.keys(PHOTOS)

/**
 * How each Type takes its photos: a `photos` list in slot order, or one photo
 * on each item of a copy list (a captioned card carries its own photo).
 */
const PHOTO_PROP: Record<string, "photos" | { list: string; key: string }> = {
  "mission-statement-hero": "photos",
  "collage-hero": "photos",
  "statement-band": "photos",
  "values-spotlight": "photos",
  "approach-stack-cards": "photos",
  "story-snapshots": { list: "items", key: "image" },
  bento: "photos",
  "culture-masonry": { list: "items", key: "image" },
  "impact-stats-band": "photos",
  "story-photos": { list: "items", key: "image" },
  "split-panel": "photos",
  "letter-card": "photos",
  "values-focus": "photos",
  "headline-photos": "photos",
}

type BlockCopy = Record<Locale, object>

/**
 * The props that put a Type's demo photos into its block: `photos`, or the
 * block's own copy list with a photo added to each item. `copy` is the block's
 * exported copy, needed for the second kind.
 */
export function aboutPhotoProps(type: string, locale: Locale, copy?: BlockCopy): Record<string, unknown> {
  const photos = aboutPhotos(type, locale)
  const prop = PHOTO_PROP[type]
  if (!prop || photos.length === 0) return {}
  if (prop === "photos") return { photos }
  const items = ((copy?.[locale] as Record<string, unknown> | undefined)?.[prop.list] as object[] | undefined) ?? []
  return { [prop.list]: items.map((item, index) => ({ ...item, [prop.key]: photos[index] })) }
}
