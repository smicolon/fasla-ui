import type { ArgTypes } from "@storybook/react"

/**
 * For ErrorState.stories.tsx, beside it. The blocks bring their own English
 * and Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const errorStateViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

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

/**
 * Props that change nothing a viewer can see from the Controls panel: HTML
 * attributes, the language the toolbar sets, and the glyph slots, which take
 * an element rather than text. Callbacks are left out too (below): they do
 * their work in the app, not in the preview.
 */
const HIDDEN = new Set(["locale", "className", "style", "icon"])

/** What a list in the copy holds, for its default: "6 links". */
const NOUNS: Record<string, string> = {
  links: "links",
  quickLinks: "links",
  destinations: "destinations",
  pages: "pages",
  tiles: "tiles",
  columns: "columns",
  rows: "rows",
  services: "services",
  options: "options",
  checks: "checks",
  suggestions: "suggestions",
  lines: "lines",
  people: "people",
  photos: "photos",
  trail: "steps",
  tokens: "tokens",
  numerals: "numerals",
}

const quote = (text: string) => `"${text.length > 70 ? `${text.slice(0, 67)}…` : text}"`

/** A copy value as the Default column shows it: the English text, or a count. */
function copyDefault(name: string, value: unknown): string {
  if (typeof value === "string") return quote(value)
  if (Array.isArray(value)) return `${value.length} ${NOUNS[name] ?? "items"}`
  if (value === null) return "none"
  if (value && typeof value === "object" && "label" in value && typeof value.label === "string") return `{ label: ${quote(value.label)}, … }`
  return "Figma's copy"
}

/**
 * Controls for a block's own props, from the prop docs react-docgen-typescript
 * attaches to the component: text for strings and copy, an object editor for
 * lists and actions, a toggle for booleans, a select for unions. Every row
 * changes the preview; callbacks and glyph slots are left out of the table,
 * and so is `screenReaderOnly`, a block's props that only name something for
 * assistive tech or are read out while an action runs. The block's prop docs
 * describe them all. One file holds all 28 blocks, so the meta can't name a
 * `component` for Storybook to read them from itself.
 *
 * The Default column shows each prop's default: the value in the block's
 * signature or its `@default` tag, and for copy, `copy.en`, the English the
 * block falls back to (Arabic when `locale` is "ar").
 */
export function errorStateArgTypes(component: unknown, copy?: Copy, screenReaderOnly: string[] = []): ArgTypes {
  const props = (component as Documented).__docgenInfo?.props ?? {}
  const english = (copy?.en ?? {}) as Record<string, unknown>
  const argTypes: ArgTypes = {}
  for (const [name, prop] of Object.entries(props)) {
    const type = prop.type?.name ?? ""
    if (HIDDEN.has(name) || screenReaderOnly.includes(name) || type.includes("=>") || /Handler\b/.test(type) || /^on[A-Z]/.test(name)) {
      argTypes[name] = { table: { disable: true } }
      continue
    }
    const fromDocs = prop.defaultValue?.value
    const fallback = fromDocs ?? (name in english ? copyDefault(name, english[name]) : undefined)
    const base = {
      name,
      description: prop.description,
      table: { type: { summary: type }, ...(fallback !== undefined && { defaultValue: { summary: fallback } }) },
    }
    if (type === "boolean") argTypes[name] = { ...base, control: "boolean" }
    else if (type === "number") argTypes[name] = { ...base, control: "number" }
    else if (type === "enum" && prop.type?.value?.every((v) => /^"/.test(v.value)))
      argTypes[name] = { ...base, control: "select", options: prop.type.value.map((v) => JSON.parse(v.value)) }
    // Lists, object literals and the blocks' own types (ErrorStateCenteredMinimalAction):
    // anything but a string or React node.
    else if (/\[\]|^\{|Record</.test(type) || (/^[A-Z]/.test(type) && !/^(ReactNode|ReactElement|Element)\b/.test(type)))
      argTypes[name] = { ...base, control: "object" }
    else argTypes[name] = { ...base, control: "text" }
  }
  for (const name of HIDDEN) argTypes[name] = { table: { disable: true } }
  return argTypes
}
