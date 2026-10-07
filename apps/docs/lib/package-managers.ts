/**
 * The package managers the docs show install commands for, in tab order, and
 * how each one spells an install. Kept apart from the tabs so tests can check
 * the commands and the keyboard without rendering anything.
 */
export const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

/** `npm install clsx` / `pnpm add clsx` / `yarn add clsx` / `bun add clsx`. */
export function installCommand(pm: PackageManager, packages: string): string {
  return `${pm} ${pm === "npm" ? "install" : "add"} ${packages}`
}

/**
 * Where the registry is published. The docs write shadcn commands with full
 * URLs from here, not the `@fasla` namespace: a URL works in any project, while
 * the namespace needs a components.json entry that only our CLI's init writes.
 */
export const REGISTRY_URL = "https://ui.smicolon.com/r"

/** `shadcn add` for registry items, by full URL. */
export function shadcnAdd(...items: string[]): string {
  return `shadcn@latest add ${items.map((name) => `${REGISTRY_URL}/${name}.json`).join(" ")}`
}

/**
 * A package run without installing it: `npx shadcn@latest add …` and its
 * equivalents. bunx needs `--bun`, or a CLI with a node shebang runs on Node.
 */
export function runCommand(pm: PackageManager, command: string): string {
  const runner = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx --bun" }[pm]
  return `${runner} ${command}`
}

/**
 * A command in pieces for display. The file name at the end of each URL is
 * its own piece, kept whole (`keep`) with a break allowed just before it, so a
 * URL too long for a narrow screen breaks as `https://ui.smicolon.com/r/` +
 * `font-geist.json`: never after the hyphen in "font-". The pieces join back
 * into the command unchanged.
 */
export function wrapPieces(command: string): { text: string; keep: boolean }[] {
  return command
    .split(/(https?:\/\/\S*\/)([^\s/]+)/)
    .filter((text) => text !== "")
    .map((text, i, all) => ({ text, keep: i > 0 && /^https?:\/\/\S*\/$/.test(all[i - 1]) && !/\s/.test(text) }))
}

/**
 * The tab an arrow, Home or End key moves to, wrapping at both ends, or
 * undefined for any other key. Arrows follow what is on screen: in a
 * right-to-left page the first tab is on the right, so ArrowLeft moves
 * forward through the list.
 */
export function nextTabIndex(current: number, key: string, count: number, rtl: boolean): number | undefined {
  const forward = rtl ? "ArrowLeft" : "ArrowRight"
  const back = rtl ? "ArrowRight" : "ArrowLeft"
  if (key === forward) return (current + 1) % count
  if (key === back) return (current - 1 + count) % count
  if (key === "Home") return 0
  if (key === "End") return count - 1
  return undefined
}
