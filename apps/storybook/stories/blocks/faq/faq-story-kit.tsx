import * as React from "react"
import type { ArgTypes, Decorator } from "@storybook/react"

/**
 * For FAQ.stories.tsx, beside it. The blocks bring their own English
 * and Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const faqViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

/**
 * The FAQ meta sets `parameters: { layout: "fullscreen", viewport: {
 * viewports: faqViewports } }`: full-bleed, as a block sits on a page, with
 * Figma's breakpoints in the viewport toolbar. Written out in the meta, not
 * shared as a variable: Storybook's docs plugin replaces a meta's
 * `parameters` that isn't an object literal, and the stories fall back to the
 * preview's centred layout.
 */

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

type DocgenProp = { name: string; description?: string; type?: { name: string; value?: { value: string }[] } }
type Documented = { __docgenInfo?: { props?: Record<string, DocgenProp> } }

/** HTML attributes every section takes, and the language prop the toolbar sets. */
const HIDDEN = new Set(["locale", "className", "style"])

/**
 * Controls for a block's own props, from the prop docs react-docgen-typescript
 * attaches to the component: text for strings and copy, an object editor for
 * item and category lists, a toggle for booleans, a select for unions, and the
 * actions panel for callbacks. One file holds all 26 blocks, so the meta can't
 * name a `component` for Storybook to read them from itself.
 *
 * A function, not a shared object: react-docgen-typescript stamps
 * `displayName` and `__docgenInfo` on an exported object, and those then
 * showed as controls.
 */
export function faqArgTypes(component: unknown): ArgTypes {
  const props = (component as Documented).__docgenInfo?.props ?? {}
  const argTypes: ArgTypes = {}
  for (const [name, prop] of Object.entries(props)) {
    if (HIDDEN.has(name)) continue
    const type = prop.type?.name ?? ""
    const base = { name, description: prop.description, table: { type: { summary: type } } }
    if (type.includes("=>") || /Handler\b/.test(type)) argTypes[name] = { ...base, action: name }
    else if (type === "boolean") argTypes[name] = { ...base, control: "boolean" }
    else if (type === "number") argTypes[name] = { ...base, control: "number" }
    else if (type === "enum" && prop.type?.value?.every((v) => /^"/.test(v.value)))
      argTypes[name] = { ...base, control: "select", options: prop.type.value.map((v) => JSON.parse(v.value)) }
    // Lists, object literals and the blocks' own types (FaqContactCtaCardAction):
    // anything but a string or React node.
    else if (/\[\]|^\{|Record</.test(type) || (/^[A-Z]/.test(type) && !/^(ReactNode|ReactElement|Element)\b/.test(type)))
      argTypes[name] = { ...base, control: "object" }
    else argTypes[name] = { ...base, control: "text" }
  }
  for (const name of HIDDEN) argTypes[name] = { table: { disable: true } }
  return argTypes
}

/**
 * A theme with none of Fasla's inverse tokens, as in a project on another
 * library's theme: `initial` unsets each one, so the mapping's fallback, the
 * page colours swapped, is what paints the panel. The page colours are set
 * too, to a colour scheme Fasla doesn't use, so the fallback is visibly
 * reading them.
 */
export const withForeignTheme: Decorator = (Story) => (
  <div
    style={
      {
        "--background-inverse": "initial",
        "--foreground-inverse": "initial",
        "--muted-foreground-inverse": "initial",
        "--background": "#fdf6ec",
        "--foreground": "#2b1d0e",
      } as React.CSSProperties
    }
  >
    <Story />
  </div>
)
