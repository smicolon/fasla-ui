import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import fs from "fs-extra"
import path from "path"
import { aliasToPath, outsideAliasMessage, pathToAlias, resolveInsideProject, resolveWritableFile, writeFileIfAbsent, writeFileNoFollow } from "../paths.js"
import { NAMESPACE, namespaceUrl } from "../registry.js"
import { detectPackageManager, install, installCommand, missingPackages, type PackageManager, type Runner } from "../pm.js"
import type { ComponentsConfig } from "../legacy.js"
import { aliasRootOrExit, repairIfNeededOrExit, safeOrExit } from "./shared.js"
import {
  applyTheme,
  detectProjectStyle,
  hasColourTokens,
  THEME_CHOICES,
  themeCommand,
  themeWithoutAsking,
  type ProjectStyle,
  type ThemeChoice,
} from "../theme.js"

/** The cn helper, as packages/fasla-ui/src/lib/utils.ts has it: the registry's components are built against that file. */
export const UTILS_SOURCE = `import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge with Fasla's type sizes it doesn't know. Unknown, \`text-xxs\`
 * reads as a colour, and merging drops the \`text-foreground\` beside it.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["xxs", "link", "list-header"] }] } },
})

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * This ensures proper class merging and deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

/** What the cn helper imports. A fresh project has neither. */
export const CN_PACKAGES = ["clsx", "tailwind-merge"]

/**
 * The cn packages as they install for this project's Tailwind. tailwind-merge
 * 3 knows only Tailwind 4's classes: it reads `outline` as the width
 * `outline-1` also sets and drops it, and on Tailwind 3, where `outline-1`
 * sets no style, the outline Switch lost its track and focus ring. Tailwind 3
 * gets tailwind-merge 2, the last line that supports it.
 */
export function cnPackages(tailwindMajor: 3 | 4 = 4): string[] {
  return tailwindMajor === 3 ? ["clsx", "tailwind-merge@^2"] : CN_PACKAGES
}

/** The name in an install spec: `tailwind-merge` from `tailwind-merge@^2`, `@scope/x` from `@scope/x@1`. */
const specName = (spec: string) => spec.replace(/(?<=.)@.*$/, "")

/**
 * Whether a package.json range can only resolve to major 2 or earlier: `^2`,
 * `~2.6`, `2.x`, `2.6.1`. Anything else counts as no — `>=2`, `*`, `latest`,
 * `^2 || ^3`, a tag, an alias — since it may resolve to 3, today or at the next
 * install. Reading it strictly costs at most a reinstall of tailwind-merge 2.
 */
export function rangeStaysBelow3(range: string): boolean {
  return /^\s*(?:[\^~]|=|v)?\s*[0-2](?:\.(?:\d+|x|\*)){0,2}(?:-[0-9A-Za-z.-]+)?\s*$/.test(range)
}

/**
 * Why a tailwind-merge the project already has can't stay on Tailwind 3:
 * a listed range that may resolve to 3 or later, or an installed copy that is
 * 3 or later whatever the range says. Undefined when it can stay, or when there
 * is none. `shadcn init` installs tailwind-merge 3 whatever the Tailwind.
 */
export async function tailwindMergeTooNew(cwd: string): Promise<string | undefined> {
  const pkg = await fs.readJson(path.join(cwd, "package.json")).catch(() => ({}))
  const listed: string | undefined = pkg.dependencies?.["tailwind-merge"] ?? pkg.devDependencies?.["tailwind-merge"]
  if (listed === undefined) return undefined
  const installed = await installedVersion(cwd, "tailwind-merge")
  if (installed !== undefined && Number(installed.split(".")[0]) >= 3) return `tailwind-merge ${installed} is installed`
  if (!rangeStaysBelow3(listed)) return `package.json lists tailwind-merge "${listed}", which can install 3`
  return undefined
}

/**
 * The version of `name` installed where Node would resolve it from `cwd`: its
 * node_modules, then each folder above, as in a monorepo. Read from the file,
 * not require.resolve: tailwind-merge 3's exports don't include package.json.
 */
async function installedVersion(cwd: string, name: string): Promise<string | undefined> {
  for (let dir = path.resolve(cwd); ; dir = path.dirname(dir)) {
    const pkg = await fs.readJson(path.join(dir, "node_modules", name, "package.json")).catch(() => undefined)
    if (typeof pkg?.version === "string") return pkg.version
    if (path.dirname(dir) === dir) return undefined
  }
}

/**
 * The cn packages to install: the ones package.json doesn't list, and on
 * Tailwind 3 tailwind-merge@^2 in place of one that is or may become 3.
 */
export async function cnPackagesToInstall(cwd: string, tailwindMajor: 3 | 4 = 4): Promise<string[]> {
  const wanted = cnPackages(tailwindMajor)
  const missing = new Set(await missingPackages(cwd, wanted.map(specName)))
  const replace = tailwindMajor === 3 && (await tailwindMergeTooNew(cwd)) !== undefined
  return wanted.filter((spec) => missing.has(specName(spec)) || (replace && specName(spec) === "tailwind-merge"))
}

/**
 * Writes the cn helper at the utils alias when nothing is there yet, and says
 * whether it did. Every registry component imports it.
 */
export async function writeCnHelper(cwd: string, utilsAlias: string, aliasRoot: string): Promise<string | undefined> {
  const utilsRelative = aliasToPath(utilsAlias, aliasRoot)
  const utilsPath = await resolveInsideProject(cwd, `${utilsRelative}.ts`)
  await fs.ensureDir(path.dirname(utilsPath))
  return (await writeFileIfAbsent(utilsPath, UTILS_SOURCE)) ? `${utilsRelative}.ts` : undefined
}

/**
 * Installs clsx and tailwind-merge with the project's package manager, unless
 * package.json already lists them. On failure, or when installing is off or
 * there is no package.json, prints the exact command to run instead. Returns
 * false only when an install was tried and failed.
 */
export async function installCnPackages(
  cwd: string,
  pm: PackageManager,
  { enabled = true, run, tailwindMajor = 4 }: { enabled?: boolean; run?: Runner; tailwindMajor?: 3 | 4 } = {}
): Promise<boolean> {
  const missing = await cnPackagesToInstall(cwd, tailwindMajor)
  if (missing.length === 0) return true
  const command = installCommand(pm, missing)
  // Say why when it replaces a tailwind-merge the project chose.
  const tooNew = tailwindMajor === 3 ? await tailwindMergeTooNew(cwd) : undefined
  if (tooNew) {
    console.log(
      chalk.yellow(`\n${tooNew}. tailwind-merge 3 supports only Tailwind 4; this project is on Tailwind 3, so it gets tailwind-merge@^2.`)
    )
  }
  if (!enabled) {
    console.log(`\nInstall the packages the cn helper imports:\n  ${chalk.cyan(command)}`)
    return true
  }
  if (!(await fs.pathExists(path.join(cwd, "package.json")))) {
    console.log(chalk.yellow(`\nNo package.json here, so nothing was installed. In your project, run:`))
    console.log(`  ${chalk.cyan(command)}`)
    return true
  }
  const spinner = ora(`Installing ${missing.join(" and ")} with ${pm}...`).start()
  const result = await install(pm, missing, cwd, run)
  if (result.ok) {
    spinner.succeed(`Installed ${missing.join(" and ")} with ${pm}`)
    return true
  }
  spinner.fail(`Could not install ${missing.join(" and ")} with ${pm}`)
  const tail = result.output.trim().split("\n").slice(-15).join("\n")
  if (tail) console.log(chalk.gray(tail))
  console.log(`\nThe cn helper imports them, so the project won't compile without them. Run this to finish:`)
  console.log(`  ${chalk.cyan(command)}`)
  return false
}

/**
 * `init`: writes components.json and the cn helper, installs what the helper
 * imports, and repairs a project set up with 0.3.
 */
export function initCommand() {
  return new Command()
    .name("init")
    .description("Initialize fasla-ui in your project")
    .option("-y, --yes", "Skip confirmation prompts")
    .option("--no-install", "Don't install clsx, tailwind-merge or the theme; print the commands instead")
    .option("--theme <choice>", 'The theme: "fasla" for Fasla\'s colours, "brand" to keep yours')
    .option("-c, --cwd <path>", "Working directory", process.cwd())
    .action(async (options) => {
      const cwd = path.resolve(options.cwd)
      const yes = Boolean(options.yes)
      if (options.theme !== undefined && !THEME_CHOICES.some((c) => c.value === options.theme)) {
        console.log(chalk.red(`Error: --theme is "fasla" or "brand", not "${options.theme}". Nothing was written.`))
        process.exit(1)
      }

      console.log(chalk.bold("\nInitializing fasla-ui...\n"))

      const configPath = path.join(cwd, "components.json")
      const pm = await detectPackageManager(cwd)
      // `@/` is wherever the project's tsconfig points it, so the defaults,
      // the stored aliases and the files written all follow it. A --yes run
      // stops here, before anything is written, when "@/" is only a guess.
      const aliasRoot = await aliasRootOrExit(cwd, yes, pm)

      // A 0.3 config is broken, not a choice to keep: repairing it is the
      // default, as is finishing a repair an earlier run left unfinished.
      let config: ComponentsConfig | undefined = await repairIfNeededOrExit(cwd, aliasRoot.root, yes)
      if (!config && (await fs.pathExists(configPath))) {
        if (!yes) {
          const { overwrite } = await prompts({
            type: "confirm",
            name: "overwrite",
            message: "components.json already exists. Overwrite?",
            initial: false,
          })
          if (!overwrite) {
            console.log(chalk.yellow("Cancelled."))
            process.exit(0)
          }
        }
      }

      const style = await detectProjectStyle(cwd, aliasRoot.root)
      if (!config) config = await askForConfig(cwd, aliasRoot.root, yes, style)
      const aliases = config.aliases ?? {}
      const utilsAlias = aliases.utils ?? "@/lib/utils"

      // Refuse before writing anything if a path would land outside the
      // project or write through a symlink. The cn helper is only written
      // when absent, so an existing one — symlinked or not — is left alone.
      await safeOrExit(async () => {
        await resolveWritableFile(cwd, "components.json")
        await resolveInsideProject(cwd, aliasToPath(aliases.components ?? "@/components", aliasRoot.root))
        await resolveInsideProject(cwd, `${aliasToPath(utilsAlias, aliasRoot.root)}.ts`)
      })

      const spinner = ora("Writing configuration...").start()
      try {
        await writeFileNoFollow(configPath, `${JSON.stringify(config, null, 2)}\n`)
        // Only when absent, decided as it is written: a cn helper that appears
        // after the checks above is kept, not truncated.
        const written = await writeCnHelper(cwd, utilsAlias, aliasRoot.root)
        spinner.succeed(
          written
            ? `Configuration written to components.json, cn helper written to ${written}`
            : "Configuration written to components.json"
        )
      } catch (error) {
        spinner.fail("Failed to write configuration")
        console.error(error)
        process.exit(1)
      }

      if (!(await installCnPackages(cwd, pm, { enabled: options.install !== false, tailwindMajor: style.tailwindMajor }))) process.exit(1)

      const css = typeof config.tailwind?.css === "string" ? config.tailwind.css : style.css
      const theme = { flag: options.theme, yes, install: options.install !== false, nextMajor: style.nextMajor }
      if (!(await installTheme(cwd, css, theme))) process.exit(1)

      console.log(chalk.green("\nSuccess! fasla-ui has been initialized."))
      console.log("\nYou can now add components:")
      console.log(chalk.cyan("  npx @smicolon/fasla-ui@latest add button"))
      console.log(chalk.cyan("  npx @smicolon/fasla-ui@latest add shimmer-button"))
    })
}

/**
 * Asks which theme layer the project gets — or, with `--theme` or `--yes`,
 * decides without asking, never replacing colours the project has unless
 * `--theme fasla` says to — and installs it with the shadcn CLI. Returns false
 * only when the install was tried and failed.
 */
export async function installTheme(
  cwd: string,
  css: string,
  { flag, yes, install, nextMajor }: { flag?: string; yes: boolean; install: boolean; nextMajor?: number }
): Promise<boolean> {
  const hasColours = hasColourTokens(await fs.readFile(path.join(cwd, css), "utf8").catch(() => ""))
  let choice = themeWithoutAsking({ flag, yes, hasColours })

  if (!choice) {
    const { theme } = await prompts({
      type: "select",
      name: "theme",
      message: "How should your components look?",
      choices: THEME_CHOICES.map(({ value, title }) => ({
        value,
        // Nothing to keep yet: say so, rather than leave the components colourless.
        title: value === "brand" && !hasColours ? `${title} (${css} has no colours yet, so the components would have none)` : title,
      })),
      initial: 0,
    })
    if (theme === undefined) {
      console.log(chalk.yellow("Cancelled."))
      process.exit(0)
    }
    choice = theme as ThemeChoice
  } else if (yes && !flag) {
    console.log(
      choice === "brand"
        ? `\n${css} has its own colours, so they are kept: installing the base theme only.\n` +
            `To use Fasla's colours instead: ${chalk.cyan("npx @smicolon/fasla-ui@latest init --theme fasla")}`
        : `\n${css} has no colours yet, so it gets Fasla's.`
    )
  }

  const command = themeCommand(choice, { nextMajor })
  if (!install) {
    console.log(`\nInstall the theme:\n  ${chalk.cyan(command)}`)
    return true
  }
  const label = choice === "fasla" ? "Fasla's colours and the base theme" : "the base theme"
  const spinner = ora(`Installing ${label}...`).start()
  const result = await applyTheme(cwd, choice, { nextMajor })
  if (result.ok) {
    spinner.succeed(`Installed ${label}`)
    return true
  }
  spinner.fail(`Could not install ${label}`)
  const tail = result.ok ? "" : result.output.trim().split("\n").slice(-15).join("\n")
  if (tail) console.log(chalk.gray(tail))
  console.log(`\nRun this to finish:\n  ${chalk.cyan(command)}`)
  return false
}

/** The config for a new project, from the prompts or, with `--yes`, the defaults. */
async function askForConfig(cwd: string, aliasRoot: string, yes: boolean, project: ProjectStyle): Promise<ComponentsConfig> {
  const under = (p: string) => (aliasRoot ? `${aliasRoot}/${p}` : p)

  let componentsAlias = "@/components"
  let utilsAlias = "@/lib/utils"
  let style = "default"

  if (!yes) {
    // An answer outside `@/`'s folder can't be imported through `@/`, so it
    // is explained and asked again rather than moved inside it.
    const insideAlias = (answer: string) =>
      pathToAlias(answer, aliasRoot) === undefined ? outsideAliasMessage(answer, aliasRoot) : true
    const response = await prompts([
      {
        type: "text",
        name: "componentsDir",
        message: "Where should components be installed?",
        initial: under("components"),
        validate: insideAlias,
      },
      {
        type: "text",
        name: "utilsPath",
        message: "Where is your utils file (cn)?",
        initial: under("lib/utils"),
        validate: insideAlias,
      },
      {
        type: "select",
        name: "style",
        message: "Which style would you like to use?",
        choices: [
          { title: "Default", value: "default" },
          { title: "New York", value: "new-york" },
        ],
        initial: 0,
      },
    ])

    const components = pathToAlias(response.componentsDir ?? "", aliasRoot)
    const utils = pathToAlias(response.utilsPath ?? "", aliasRoot)
    // Only a cancelled prompt gets here without an alias; validate saw the rest.
    if (components === undefined || utils === undefined || response.style === undefined) {
      console.log(chalk.yellow("Cancelled."))
      process.exit(0)
    }
    componentsAlias = components
    utilsAlias = utils
    style = response.style
  }

  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style,
    rsc: project.rsc,
    tsx: true,
    tailwind: {
      // Tailwind 4 has no config file; the shadcn CLI reads "" as that.
      config: project.config,
      css: project.css,
      baseColor: "slate",
      cssVariables: true,
    },
    aliases: {
      components: componentsAlias,
      utils: utilsAlias,
      ui: `${componentsAlias}/ui`,
      lib: "@/lib",
      hooks: "@/hooks",
    },
    // The shadcn CLI only accepts a namespace that starts with "@" and a URL
    // with {name} in it; the old `smicolon: { url }` entry made every shadcn
    // command in the project fail with "Invalid configuration".
    registries: {
      [NAMESPACE]: namespaceUrl(),
    },
  }
}
