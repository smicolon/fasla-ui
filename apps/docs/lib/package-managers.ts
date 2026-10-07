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
 * A package run without installing it: `npx shadcn@latest add …` and its
 * equivalents. bunx needs `--bun`, or a CLI with a node shebang runs on Node.
 */
export function runCommand(pm: PackageManager, command: string): string {
  const runner = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx --bun" }[pm]
  return `${runner} ${command}`
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
