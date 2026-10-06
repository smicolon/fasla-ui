/**
 * Where a testimonial was posted. Plain data, importable from server
 * components (wall-columns.tsx is a client module).
 */
export type Platform = "clutch" | "upwork"

/** The site a platform's reviews live on, for the badge's text and label. */
export const platformSite = (platform: Platform) => (platform === "clutch" ? "clutch.co" : "upwork.com")
