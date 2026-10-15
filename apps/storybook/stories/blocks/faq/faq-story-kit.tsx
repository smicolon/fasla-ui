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

type DocgenProp = {
  name: string
  description?: string
  type?: { name: string; value?: { value: string }[] }
  defaultValue?: { value: string } | null
}
type Documented = { __docgenInfo?: { props?: Record<string, DocgenProp> } }
/** A block's exported copy: `en` and `ar`, each an object of its copy props. */
type Copy = { en: object; ar: object }

/** HTML attributes every section takes, and the language prop the toolbar sets. */
const HIDDEN = new Set(["locale", "className", "style"])

/** What a list in the copy holds, for its default: "6 questions". */
const NOUNS: Record<string, string> = {
  items: "questions",
  categories: "categories",
  topics: "topics",
  groups: "groups",
  tiles: "tiles",
  channels: "channels",
  stats: "stats",
  messages: "messages",
  people: "people",
  links: "links",
  popularSearches: "searches",
}

const quote = (text: string) => `"${text.length > 70 ? `${text.slice(0, 67)}…` : text}"`

/** A copy value as the Default column shows it: the English text, or a count. */
function copyDefault(name: string, value: unknown): string {
  if (typeof value === "string") return quote(value)
  if (Array.isArray(value)) return `${value.length} ${NOUNS[name] ?? "items"}`
  if (typeof value === "function") return "Figma's copy, from the query"
  if (value && typeof value === "object" && "label" in value && typeof value.label === "string") return `{ label: ${quote(value.label)}, … }`
  return "Figma's copy"
}

/**
 * Controls for a block's own props, from the prop docs react-docgen-typescript
 * attaches to the component: text for strings and copy, an object editor for
 * item and category lists, a toggle for booleans, a select for unions, and the
 * actions panel for callbacks. One file holds all 26 blocks, so the meta can't
 * name a `component` for Storybook to read them from itself.
 *
 * The Default column shows each prop's default: the value in the block's
 * signature or its `@default` tag, and for copy, `copy.en`, the English the
 * block falls back to (Arabic when `locale` is "ar").
 *
 * A function, not a shared object: react-docgen-typescript stamps
 * `displayName` and `__docgenInfo` on an exported object, and those then
 * showed as controls.
 */
export function faqArgTypes(component: unknown, copy?: Copy): ArgTypes {
  const props = (component as Documented).__docgenInfo?.props ?? {}
  const english = (copy?.en ?? {}) as Record<string, unknown>
  const argTypes: ArgTypes = {}
  for (const [name, prop] of Object.entries(props)) {
    if (HIDDEN.has(name)) continue
    const type = prop.type?.name ?? ""
    const fromDocs = prop.defaultValue?.value
    const fallback =
      fromDocs === '["0"]' ? 'the first item (["0"])' : fromDocs ?? (name in english ? copyDefault(name, english[name]) : undefined)
    const base = {
      name,
      description: prop.description,
      table: { type: { summary: type }, ...(fallback !== undefined && { defaultValue: { summary: fallback } }) },
    }
    if (type.includes("=>") || /Handler\b/.test(type))
      // Callbacks go to the actions panel; a function in the copy (a message
      // built from the query) is shown and described, not edited.
      argTypes[name] = /^on[A-Z]/.test(name) ? { ...base, action: name } : { ...base, control: false }
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
