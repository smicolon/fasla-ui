/**
 * The Mahaam template's demo photos, for the docs previews and the Storybook
 * stories. No section ships with photos: they take their images as props.
 * These are the images Figma's `Mahaam Template` set uses, in
 * public/images/mahaam/ (listed in its CREDITS.md). The faces are the small
 * round crops Figma shows, exported from the set.
 */
export const mahaamDemoPhotos = {
  /** The painting behind the Hero's planner. Decorative. */
  scene: "/images/mahaam/hero-signac-harbour.webp",
  /** The three faces, in the Hero's social proof and on its tasks. */
  avatars: {
    noura: "/images/mahaam/avatar-noura.webp",
    khalid: "/images/mahaam/avatar-khalid.webp",
    faisal: "/images/mahaam/avatar-faisal.webp",
  },
} as const

/** The props the Hero takes its photos by. */
export const mahaamHeroPhotoProps = {
  sceneSrc: mahaamDemoPhotos.scene,
  avatars: mahaamDemoPhotos.avatars,
}

/** The props every section takes its photos by; sections take only the ones they use, so the rest are ignored. */
export const mahaamPhotoProps = {
  sceneSrc: mahaamDemoPhotos.scene,
  avatars: mahaamDemoPhotos.avatars,
}
