/** Types for theme-items.mjs, which build-registry.mjs runs with plain Node. */
export type RegistryItem = {
  $schema: string
  name: string
  type: "registry:theme" | "registry:font"
  title: string
  description?: string
  registryDependencies?: string[]
  cssVars?: { theme?: Record<string, string>; light?: Record<string, string>; dark?: Record<string, string> }
  tailwind?: { config: { theme: { extend: Record<string, Record<string, unknown>> } } }
  css?: Record<string, Record<string, unknown>>
  font?: { family: string; provider: "google"; import: string; variable: string; [key: string]: unknown }
}
export type Sources = {
  mode: { tokens: Record<string, { light: string; dark: string }>; radius: Record<string, { value: string }> }
  typography: { ramp: Record<string, { size: number; en: { lineHeight: number }; ar: { lineHeight: number } }> }
}
export const SHADCN_TOKENS: string[]
export const LATIN_FONT: string
export const BORDER_RULE: { selector: string; value: string }
export const SHADCN_V3_MAPPED: string[]
export function semanticColor(name: string): string
export function loadSources(root?: string): Sources
export function tokenNames(mode: Sources["mode"]): string[]
export function baseTokenNames(mode: Sources["mode"]): string[]
export function tailwindV3Colors(names: string[], all?: string[]): Record<string, unknown>
export function buildThemeItems(options: { registryUrl: string; sources?: Sources }): RegistryItem[]
