import type { ArgTypes } from "@storybook/react"

/**
 * The Controls table for a block family's stories, shared by the FAQ and
 * Error State kits so the two read the same way. It follows the rules in
 * CLAUDE.md ("Storybook controls table"):
 *
 * - Every row changes the preview: text for strings and copy, a toggle for
 *   booleans, a select for unions. A prop that changes nothing on screen has
 *   no row; the docs-site Props table documents it:
 *   - link targets (`…Href`) and form and focus props (`name`, `autoFocus`,
 *     `id`);
 *   - behaviour and starting state (`multiple`, `default…`);
 *   - messages that only appear once the visitor acts (`MESSAGES` below);
 *   - and, per story, what that story's `hide` lists: names only assistive
 *     tech reads, and copy the story leaves off screen.
 * - Props that take an element, an object or a list (actions, links, items,
 *   glyph slots) have no row: Controls can only edit them as raw JSON. The
 *   Select atom's stories drop `items` and `startIcon` the same way.
 * - Callbacks have no row either. They still log to the Actions panel, so a
 *   story that wants its own callback passes it after `{...args}`.
 * - `className` keeps its row, as in every UI table.
 *
 * The block's prop docs describe every prop, rows or not. One stories file
 * holds a whole family, so the meta can't name a `component` for Storybook to
 * read them from itself.
 *
 * The Default column shows each prop's default: the value in the block's
 * signature or its `@default` tag, and for copy, `copy.en`, the English the
 * block falls back to (Arabic when `locale` is "ar").
 *
 * A function, not a shared object: react-docgen-typescript stamps
 * `displayName` and `__docgenInfo` on an exported object, and those then
 * showed as controls.
 */

type DocgenProp = {
  name: string
  description?: string
  type?: { name: string; value?: { value: string }[] }
  defaultValue?: { value: string } | null
}
type Documented = { __docgenInfo?: { props?: Record<string, DocgenProp> } }
/** A block's exported copy: `en` and `ar`, each an object of its copy props. */
export type BlockCopy = { en: object; ar: object }

/** HTML attributes that change nothing on screen, the language prop the toolbar sets, and the glyph slot. */
const HIDDEN = new Set(["locale", "style", "icon"])

/** Form, focus and behaviour props, and starting state: nothing on screen changes when they do. */
const BEHAVIOUR = new Set(["name", "autoFocus", "id", "multiple"])
const isBehaviour = (name: string) => BEHAVIOUR.has(name) || /Href$/.test(name) || /^default[A-Z]/.test(name)

/**
 * Messages a block shows only once the visitor acts (sends, retries, copies,
 * cancels, filters everything out), so a row for them changes nothing until
 * then. A story that opens on one of these states lists it in `show`.
 */
const MESSAGES = new Set([
  "pendingLabel",
  "retryingLabel",
  "success",
  "error",
  "emailError",
  "retryError",
  "requestError",
  "sendError",
  "thanks",
  "copiedLabel",
  "cancelled",
  "redirecting",
  "empty",
])

/** As the UI stories write it: HTML's own prop, which docgen leaves out. */
const CLASS_NAME = {
  control: "text",
  description: "Extra CSS classes, merged onto the root element.",
  table: { type: { summary: "string" } },
} as const

const quote = (text: string) => `"${text.length > 70 ? `${text.slice(0, 67)}…` : text}"`

/** An element, an object or a list: anything but a string, number, boolean or union of strings. */
const isStructured = (type: string) =>
  /\[\]|^\{|Record</.test(type) || (/^[A-Z]/.test(type) && !/^(ReactNode|ReactElement|Element)\b/.test(type))

export function blockArgTypes(
  component: unknown,
  copy: BlockCopy | undefined,
  { hide = [], show = [] }: { hide?: string[]; show?: string[] } = {}
): ArgTypes {
  const props = (component as Documented).__docgenInfo?.props ?? {}
  const english = (copy?.en ?? {}) as Record<string, unknown>
  const argTypes: ArgTypes = {}
  for (const [name, prop] of Object.entries(props)) {
    const type = prop.type?.name ?? ""
    if (/^on[A-Z]/.test(name)) {
      argTypes[name] = { action: name, table: { disable: true } }
      continue
    }
    if (name === "className" || HIDDEN.has(name)) continue
    const offScreen = hide.includes(name) || ((isBehaviour(name) || MESSAGES.has(name)) && !show.includes(name))
    if (offScreen || type.includes("=>") || /Handler\b/.test(type) || isStructured(type)) {
      argTypes[name] = { table: { disable: true } }
      continue
    }
    const fromDocs = prop.defaultValue?.value
    const fallback = fromDocs ?? (typeof english[name] === "string" ? quote(english[name] as string) : name in english ? "Figma's copy" : undefined)
    const base = {
      name,
      description: prop.description,
      table: { type: { summary: type }, ...(fallback !== undefined && { defaultValue: { summary: fallback } }) },
    }
    if (type === "boolean") argTypes[name] = { ...base, control: "boolean" }
    else if (type === "number") argTypes[name] = { ...base, control: "number" }
    else if (type === "enum" && prop.type?.value?.every((v) => /^"/.test(v.value)))
      argTypes[name] = { ...base, control: "select", options: prop.type.value.map((v) => JSON.parse(v.value)) }
    else argTypes[name] = { ...base, control: "text" }
  }
  for (const name of HIDDEN) argTypes[name] = { table: { disable: true } }
  argTypes.className = CLASS_NAME
  return argTypes
}
