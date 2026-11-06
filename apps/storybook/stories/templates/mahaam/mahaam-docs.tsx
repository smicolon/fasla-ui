import { Markdown, Primary, Title } from "@storybook/blocks"

/**
 * The Docs entry of a Mahaam page, short on purpose: one line on what it is,
 * the install command and the props. The page's Playground story is the
 * demonstration; the long version is on the docs site.
 */
export type PropRow = [name: string, type: string, text: string]

const cell = (value: string) => value.replace(/\|/g, "\\|")

const table = (rows: PropRow[]) =>
  ["| Prop | Type | What it does |", "|---|---|---|", ...rows.map(([name, type, text]) => `| \`${name}\` | \`${type.replace(/ \| /g, " / ")}\` | ${cell(text)} |`)].join("\n")

/** Shared by every animated section. */
export const MOTION_PROPS: PropRow[] = [
  ["paused", "boolean", "Freezes the section where it stands. Wire it to a `MahaamMotionToggle`."],
  ["defaultPaused", "boolean", "Starts the section paused, when `paused` is left out."],
  ["still", "boolean", "Holds Figma's still frame, whatever `paused` says."],
  ["reducedMotion", "boolean", "Replaces the visitor's setting. For stories and tests."],
]

export const LOCALE_PROP: PropRow = ["locale", '"en" | "ar"', "The language of the default copy. The page's `dir` sets the direction."]

/** A section's Docs entry: what it is, how to install it, its props. */
export function sectionDocs({ what, item, props }: { what: string; item: string; props: PropRow[] }) {
  const markdown = [what, "", "```bash", `npx @smicolon/fasla-ui@latest add ${item}`, "```", "", table([LOCALE_PROP, ...props])].join("\n")
  return function MahaamSectionDocs() {
    return (
      <>
        <Title />
        <Markdown>{markdown}</Markdown>
      </>
    )
  }
}

/** The Overview's Docs entry: a few lines, then the whole template as a Playground. */
export function overviewDocs() {
  const markdown = [
    "Mahaam is a landing page in ten sections for a voice-first task manager, in English and Arabic, at three screen sizes.",
    "",
    "In the toolbar: **Direction** flips the language (Arabic with RTL), **Theme** flips light and dark, and **Motion** sets Playing, Paused, Final frame or Reduced motion. **Viewport** shows Desktop, Tablet and Mobile on the Playground story.",
    "",
    "```bash",
    "npx @smicolon/fasla-ui@latest add template-mahaam",
    "```",
  ].join("\n")
  return function MahaamOverviewDocs() {
    return (
      <>
        <Title />
        <Markdown>{markdown}</Markdown>
        <Primary />
      </>
    )
  }
}
