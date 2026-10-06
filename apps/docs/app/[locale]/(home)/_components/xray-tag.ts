import type { CSSProperties } from "react"

/**
 * Marks a part of the hero's product window for the "Show components" x-ray:
 * `data-c` is the Fasla component it is, `--i` staggers its tag in. Only real
 * Fasla components are tagged, so the landing-only chart is tagged as the Card
 * it sits in.
 */
export const xrayTag = (name: string, i: number) => ({
  "data-c": name,
  style: { "--i": i } as CSSProperties,
})
