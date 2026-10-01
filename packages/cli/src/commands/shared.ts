import chalk from "chalk"
import prompts from "prompts"
import { chooseAliasRoot, UnknownAliasRootError, UnsafePathError } from "../paths.js"

/**
 * Where `@/` points, for `init` and `add`. When a config in the tsconfig
 * chain can't be read, asks — or, with `--yes`, stops — rather than guess.
 */
export async function aliasRootOrExit(cwd: string, yes: boolean): Promise<string> {
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
