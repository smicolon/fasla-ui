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
