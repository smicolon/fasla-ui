import type { CSSProperties } from "react"

/**
 * Marks a part of the hero's product window for the "Show components" x-ray:
 * `data-c` is the Fasla component it is, `--i` staggers its tag in. Only real
 * Fasla components are tagged, so the landing-only chart is tagged as the Card
 * it sits in.
 *
 * `space` moves the outline: "tight" for small controls 8px apart, "roomy"
 * for a part whose content meets its own edge. `style` merges any other
 * custom properties the part needs.
 */
export const xrayTag = (
  name: string,
  i: number,
  { space, style = {} }: { space?: "tight" | "roomy"; style?: CSSProperties } = {}
) => ({
  "data-c": name,
  ...(space ? { [`data-c-${space}`]: "" } : {}),
  style: { "--i": i, ...style } as CSSProperties,
})
