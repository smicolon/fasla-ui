/**
 * The choices `init` and `add` take from flags, and what a run without a
 * terminal does when one is missing: it says which flags to pass and exits,
 * where a prompt would wait for ever.
 */

export const STYLE_CHOICES = ["default", "new-york"] as const
export type StyleChoice = (typeof STYLE_CHOICES)[number]

export function isStyleChoice(value: string): value is StyleChoice {
  return (STYLE_CHOICES as readonly string[]).includes(value)
}

/** The flags a run still needs when nothing can ask, and `--yes` wasn't given. */
export interface InitFlags {
  yes: boolean
  interactive: boolean
  path?: string
  style?: string
  theme?: string
  /** components.json exists and isn't one `init` repairs: overwriting is a question. */
  needsOverwriteAnswer?: boolean
}

/**
 * The flags to pass for a run with no terminal. Empty when a person can
 * answer, when `--yes` takes the defaults, or when every choice has a flag.
 */
export function missingInitFlags({ yes, interactive, path, style, theme, needsOverwriteAnswer }: InitFlags): string[] {
  if (yes || interactive) return []
  const missing: string[] = []
  if (path === undefined) missing.push("--path <dir>")
  if (style === undefined) missing.push("--style <default|new-york>")
  if (theme === undefined) missing.push("--theme <fasla|brand>")
  // Overwriting an existing components.json has no flag but --yes.
  if (needsOverwriteAnswer) missing.push("--yes")
  return missing
}

/** What to print, then exit 1, when `init` has no terminal and a choice is missing. */
export function nonInteractiveInitMessage(missing: string[]): string {
  const flags = missing.includes("--yes") ? missing : [...missing, "or --yes to accept all defaults"]
  return [
    "Error: init asks questions, and stdin is not a terminal, so there is nobody to answer.",
    `Pass ${flags.length === 1 ? "this flag" : "these flags"}: ${flags.join(", ")}.`,
    "Example: npx @smicolon/fasla-ui@latest init --yes",
    "Example: npx @smicolon/fasla-ui@latest init --path src/components --style default --theme fasla",
    "Nothing was written.",
  ].join("\n")
}

/** What to print, then exit 1, when `add` has no terminal and no `--yes`. */
export function nonInteractiveAddMessage(): string {
  return [
    "Error: add asks for confirmation, and stdin is not a terminal, so there is nobody to answer.",
    "Pass --yes to confirm: npx @smicolon/fasla-ui@latest add <component> --yes",
    "Nothing was written.",
  ].join("\n")
}
