/**
 * Every Fasla component imports `@/lib/utils`, so `@/` has to resolve. Next.js
 * reads it from the tsconfig; a Vite app needs it in two places, the tsconfig
 * for the type checker and vite.config for the bundler, and has neither until
 * someone adds them. This says exactly what to add, instead of quietly writing
 * files under src/ as though `@/` already pointed there.
 */
import fs from "fs-extra"
import path from "path"
import { installCommand, missingPackages, type PackageManager } from "./pm.js"

const VITE_CONFIGS = ["vite.config.ts", "vite.config.mts", "vite.config.js", "vite.config.mjs", "vite.config.cts", "vite.config.cjs"]

/** The project's vite.config file name, or undefined when it isn't a Vite app. */
export async function findViteConfig(cwd: string): Promise<string | undefined> {
  for (const name of VITE_CONFIGS) {
    if (await fs.pathExists(path.join(cwd, name))) return name
  }
  return undefined
}

/**
 * Whether a vite.config already sets an `@` alias. A text check, not an
 * evaluation of the config: it looks for `"@"` or `"@/"` as a quoted key or
 * `find:` value, which is how every alias recipe spells it.
 */
export function viteConfigHasAlias(source: string): boolean {
  return /(["'`])@\/?\1\s*:/.test(source) || /find\s*:\s*(["'`])@\/?\1/.test(source) || usesTsconfigPaths(source)
}

/**
 * Whether the config loads vite-tsconfig-paths, which resolves `@/` from the
 * tsconfig itself: with it, the tsconfig mapping is the only half needed.
 */
function usesTsconfigPaths(source: string): boolean {
  return /from\s+(["'`])vite-tsconfig-paths\1|require\(\s*(["'`])vite-tsconfig-paths\2\s*\)/.test(source)
}

/**
 * The config files to put `paths` in. The Vite templates split the tsconfig:
 * tsconfig.json only lists references, and tsconfig.app.json is what `tsc -b`
 * checks the app with, so both need it — the first for editors, the second
 * for the build. A JavaScript project without a tsconfig uses jsconfig.json.
 */
async function tsconfigFiles(cwd: string): Promise<string[]> {
  const files = []
  for (const name of ["tsconfig.json", "tsconfig.app.json"]) {
    if (await fs.pathExists(path.join(cwd, name))) files.push(name)
  }
  if (files.length > 0) return files
  return (await fs.pathExists(path.join(cwd, "jsconfig.json"))) ? ["jsconfig.json"] : ["tsconfig.json"]
}

/**
 * The changes a project needs before `@/` resolves, as lines to print — the
 * first line says what is wrong — or undefined when nothing is missing.
 * `root` is the folder `@/` should point to; `mapped` says whether a tsconfig
 * already maps it. Outside Vite, only the tsconfig can be missing.
 */
export async function aliasAdvice(
  cwd: string,
  { root, mapped, pm }: { root: string; mapped: boolean; pm: PackageManager }
): Promise<string[] | undefined> {
  const viteConfig = await findViteConfig(cwd)
  const source = viteConfig ? await fs.readFile(path.join(cwd, viteConfig), "utf8").catch(() => "") : ""
  const aliased = !viteConfig || viteConfigHasAlias(source)
  if (mapped && aliased) return undefined

  const target = root ? `./${root}` : "."
  const lines = [
    !viteConfig
      ? `"@/" is not mapped in this project's tsconfig. Fasla components import "@/lib/utils", so the project won't type-check or build until it is.`
      : mapped
        ? `"@/" is mapped in the tsconfig but not in ${viteConfig}. Fasla components import "@/lib/utils", so the app won't build until it is.`
        : `"@/" is not set up in this Vite app. Fasla components import "@/lib/utils", so the app won't type-check or build until it is.`,
    `Make these changes:`,
  ]
  let step = 1
  if (!mapped) {
    const files = await tsconfigFiles(cwd)
    lines.push(
      "",
      `${step++}. In ${files.join(" and ")}, inside "compilerOptions" (add the key if it isn't there):`,
      "",
      `     "paths": { "@/*": ["${target}/*"] }`
    )
  }
  if (!aliased) {
    lines.push(
      "",
      `${step++}. In ${viteConfig}, import path and add resolve.alias:`,
      "",
      `     import path from "path"`,
      "",
      `     export default defineConfig({`,
      `       // ...what is already there`,
      `       resolve: { alias: { "@": path.resolve(__dirname, "${target}") } },`,
      `     })`
    )
    if ((await missingPackages(cwd, ["@types/node"])).length > 0) {
      lines.push("", `${step++}. Install Node's types, which "path" needs:`, "", `     ${installCommand(pm, ["@types/node"], { dev: true })}`)
    }
  }
  return lines
}
