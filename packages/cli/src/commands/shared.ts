import chalk from "chalk"
import prompts from "prompts"
import { chooseAliasRoot, UnknownAliasRootError, UnsafePathError } from "../paths.js"
import {
  applyLegacyRepair,
  describeRepair,
  planLegacyRepair,
  readJournal,
  RepairJournalError,
  RepairRolledBackError,
  RepairStoppedError,
  REPAIR_FILE,
  resumeLegacyRepair,
  type ComponentsConfig,
} from "../legacy.js"
import type { PackageManager } from "../pm.js"
import { aliasAdvice } from "../vite.js"

/**
 * Where `@/` points, for `init` and `add`, and whether a config maps it or the
 * folder is only a guess. When a config in the tsconfig chain can't be read,
 * asks — or, with `--yes`, stops — rather than guess.
 *
 * When `@/` isn't set up — no config maps it, or a Vite app's vite.config
 * lacks the alias — prints the exact changes. An interactive run carries on
 * after the warning; a `--yes` run with no mapping stops before writing
 * anything, since every folder it would write to is a guess.
 */
export async function aliasRootOrExit(cwd: string, yes: boolean, pm: PackageManager): Promise<{ root: string; mapped: boolean }> {
  const found = await chooseRootOrExit(cwd, yes)
  const advice = await aliasAdvice(cwd, { ...found, pm })
  if (!advice) return found
  if (yes && !found.mapped) {
    console.log(chalk.red(`Error: ${advice[0]}`))
    for (const line of advice.slice(1)) console.log(line)
    console.log(`\nWith --yes the CLI won't write files under a guessed folder. Make these changes and run it again, or run it without --yes.`)
    console.log("Nothing was written.")
    process.exit(1)
  }
  console.log(chalk.yellow(`Warning: ${advice[0]}`))
  for (const line of advice.slice(1)) console.log(line)
  console.log()
  return found
}

/** `chooseAliasRoot`, with its questions and errors handled for a command. */
async function chooseRootOrExit(cwd: string, yes: boolean): Promise<{ root: string; mapped: boolean }> {
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
 * Finishes a 0.3 repair that a previous run started and didn't finish, if
 * `.fasla-repair.json` is there. Returns the config it wrote, or undefined
 * when there was nothing to finish.
 */
export async function resumeRepairOrExit(cwd: string): Promise<ComponentsConfig | undefined> {
  const journal = await repairOrExit(() => readJournal(cwd))
  if (!journal) return undefined
  console.log(chalk.yellow(`Finishing the repair a previous run started (${journal.done} of ${journal.steps.length} steps done).`))
  const { config, rewritten, backups } = await repairOrExit(() => resumeLegacyRepair(cwd, journal))
  report([], rewritten, backups)
  console.log(chalk.green("Repaired components.json.\n"))
  return config
}

/**
 * Shows what repairing a 0.3 components.json will do and, unless `--yes`,
 * asks — yes by default. On yes, moves the files, updates imports and writes
 * components.json, and returns the new config. On no, exits: the old config
 * is what broke the project, so carrying on with it would too.
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

  const { rewritten, backups } = await repairOrExit(() => applyLegacyRepair(cwd, plan))
  report(plan.moves.filter((m) => m.action === "move").map((m) => `${m.from} → ${m.to}`), rewritten, backups)
  return plan.config
}

/** Prints what a repair moved, rewrote and kept as .bak. */
function report(moved: string[], rewritten: string[], backups: string[]) {
  for (const line of moved) console.log(chalk.gray(`  moved ${line}`))
  for (const file of rewritten) console.log(chalk.gray(`  updated imports in ${file}`))
  for (const file of backups) console.log(chalk.yellow(`  kept ${file}: a different file is already at the new place; delete it once you've checked it`))
}

/**
 * Runs a repair step and turns its failures into a message and an exit: an
 * unsafe path stops it before anything changes, an error rolls it back, and a
 * failed roll-back leaves the plan in .fasla-repair.json to finish next time.
 */
async function repairOrExit<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await safeOrExit(run)
  } catch (error) {
    if (error instanceof RepairRolledBackError) {
      console.log(chalk.red(`Error: the repair stopped: ${error.message}`))
      console.log("Everything it had changed was put back, so the project is as it was. Fix the cause and run the command again.")
    } else if (error instanceof RepairJournalError) {
      console.log(chalk.red(`Error: ${error.message}`))
    } else if (error instanceof RepairStoppedError) {
      console.log(chalk.red(`Error: the repair stopped: ${error.message}`))
      console.log(`Its plan is kept in ${REPAIR_FILE}. Run the command again to finish it.`)
    } else {
      throw error
    }
    process.exit(1)
  }
}
