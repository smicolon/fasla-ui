/**
 * The Social Proof block's demo photos, for the docs previews and the
 * Storybook stories. No block ships with photos: each block takes `photos`,
 * a map from a person's id (or a photo slot's) to an image URL, and shows
 * initials or an empty slot for anything the map leaves out. The demos fill
 * every key, so no preview shows initials.
 *
 * All of them are Unsplash photos, credited in
 * public/images/social-proof/CREDITS.md. Figma's Social Proof set places the
 * same images. Each person has one portrait, used wherever they appear.
 */
const dir = "/images/social-proof"

/** One portrait per person, by person id. */
const people = {
  "adel-qasim": `${dir}/adel-qasim.webp`,
  "bader-al-ghamdi": `${dir}/bader-al-ghamdi.webp`,
  "fahad-salem": `${dir}/fahad-salem.webp`,
  "hamad-al-mutairi": `${dir}/hamad-al-mutairi.webp`,
  "hani-jaber": `${dir}/hani-jaber.webp`,
  "khalid-saad": `${dir}/khalid-saad.webp`,
  "majed-nouri": `${dir}/majed-nouri.webp`,
  "omar-haddad": `${dir}/omar-haddad.webp`,
  "rashed-al-amri": `${dir}/rashed-al-amri.webp`,
  "sami-naji": `${dir}/sami-naji.webp`,
  "tariq-zaki": `${dir}/tariq-zaki.webp`,
  "yousef-amin": `${dir}/yousef-amin.webp`,
  "ziad-karam": `${dir}/ziad-karam.webp`,
}

export const socialProofPhotos: Partial<Record<string, string>> = {
  ...people,
  // Progress Carousel: one workplace photograph per story.
  "progress-carousel-1": `${dir}/layered-beige-tiers.webp`,
  "progress-carousel-2": `${dir}/pencil-blank-page.webp`,
  "progress-carousel-3": `${dir}/tablet-design-canvas.webp`,
  "progress-carousel-4": `${dir}/laptop-bright-office.webp`,
  // Overlay Photo Quote's full-bleed photograph.
  "overlay-photo-quote": `${dir}/rainy-warehouse-yard.webp`,
  // Workplace Portrait Stories: each audience tile shows a person from the set, as Figma does.
  "workplace-founders": people["yousef-amin"],
  "workplace-engineers": people["hani-jaber"],
  "workplace-design-leads": people["hamad-al-mutairi"],
  "workplace-product-managers": people["sami-naji"],
  // Video Story Cards' posters, for when the stories family ships.
  "video-story-rashed": `${dir}/minimal-white-desk.webp`,
  "video-story-omar": `${dir}/dark-desk-monitor.webp`,
  // Proof Bento's video tile has its own poster, so it does not repeat Rashed's.
  "proof-bento-video": `${dir}/window-desk-corner.webp`,
}
