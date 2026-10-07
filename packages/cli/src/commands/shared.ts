import chalk from "chalk"
import prompts from "prompts"
import { chooseAliasRoot, UnknownAliasRootError, UnsafePathError } from "../paths.js"
import { applyLegacyRepair, describeRepair, planLegacyRepair, type ComponentsConfig } from "../legacy.js"
import type { PackageManager } from "../pm.js"
import { viteAliasAdvice } from "../vite.js"

/**
 * Where `@/` points, for `init` and `add`, and whether a config maps it or the
 * folder is only a guess. When a config in the tsconfig chain can't be read,
 * asks — or, with `--yes`, stops — rather than guess.
 */
export async function aliasRootOrExit(cwd: string, yes: boolean): Promise<{ root: string; mapped: boolean }> {
  try {
    return await chooseAliasRoot(cwd, {
      yes,
      ask: async (problem, guess) => {
        console.log(chalk.yellow(`Warning: ${problem}`))
        console.log(chalk.yellow(`So the "@/*" path in it is unknown, and "@/" may not point where the CLI would guess.`))
        const { folder } = await prompts({
          type: "text",
          name: "folder",
          message: `Which folder does "@/" point to? ("." is the project root)`,
          initial: guess || ".",
        })
        return folder
      },
    })
  } catch (error) {
    if (!(error instanceof UnknownAliasRootError)) throw error
    if (error.message === "Cancelled.") {
      console.log(chalk.yellow("Cancelled."))
      process.exit(0)
    }
    console.log(chalk.red(`Error: ${error.message}`))
    console.log("Nothing was written.")
    process.exit(1)
  }
}

/** Runs a destination check; on an unsafe path, says why and exits before any write. */
export async function safeOrExit<T>(check: () => Promise<T>): Promise<T> {
  try {
    return await check()
  } catch (error) {
    if (!(error instanceof UnsafePathError)) throw error
    console.log(chalk.red(`Error: ${error.message}`))
    console.log("Nothing was written.")
    process.exit(1)
  }
}

/**
 * Shows what repairing a 0.3 components.json will do and, unless `--yes`,
 * asks — yes by default. On yes, moves the files and updates imports, and
 * returns the new config for the caller to write. On no, exits: the old
 * config is what broke the project, so carrying on with it would too.
 */
export async function repairLegacyOrExit(
  cwd: string,
  config: ComponentsConfig,
  aliasRoot: string,
  yes: boolean
): Promise<ComponentsConfig> {
  const plan = await planLegacyRepair(cwd, config, aliasRoot)
  console.log(chalk.yellow("This components.json was written by @smicolon/cli 0.3."))
  console.log(
    chalk.yellow(`The shadcn CLI can't read it, and it put components where "@/" doesn't reach. Repairing it will:`)
  )
  for (const line of describeRepair(plan, config)) console.log(`  ${line}`)
  console.log()

  if (!yes) {
    const { repair } = await prompts({ type: "confirm", name: "repair", message: "Repair it?", initial: true })
    if (!repair) {
      console.log(chalk.yellow("Left as it is. Run npx @smicolon/cli init to repair it later."))
      process.exit(0)
    }
  }

  try {
    const { rewritten, backups } = await safeOrExit(() => applyLegacyRepair(cwd, plan))
    for (const move of plan.moves.filter((m) => m.action === "move")) console.log(chalk.gray(`  moved ${move.from} → ${move.to}`))
    for (const file of rewritten) console.log(chalk.gray(`  updated imports in ${file}`))
    for (const file of backups) console.log(chalk.yellow(`  kept ${file}: a different file is already at the new place; delete it once you've checked it`))
  } catch (error) {
    console.log(chalk.red(`Error: the repair stopped part way: ${(error as Error).message}`))
    console.log("components.json was not changed. Fix the cause and run the command again.")
    process.exit(1)
  }
  return plan.config
}

/** Prints the `@/` setup a Vite app is missing, if any. Never stops the command. */
export async function warnViteAlias(cwd: string, aliasRoot: { root: string; mapped: boolean }, pm: PackageManager) {
  const advice = await viteAliasAdvice(cwd, { ...aliasRoot, pm })
  if (!advice) return
  console.log(chalk.yellow(`Warning: ${advice[0]}`))
  for (const line of advice.slice(1)) console.log(line)
  console.log()
}
