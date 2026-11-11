import { Command } from "commander"
import { addCommand } from "./commands/add.js"
import { initCommand } from "./commands/init.js"
import { listCommand } from "./commands/list.js"
import { cliVersion } from "./version.js"

/**
 * The whole CLI, built fresh on each call: Commander keeps option values on
 * the command objects, so a test that parses twice needs two programs.
 */
export function createProgram() {
  return new Command()
    .name("fasla-ui")
    .description("CLI for installing the 42 Fasla UI components: 35 UI primitives and 7 effects")
    .version(cliVersion())
    .addCommand(initCommand())
    .addCommand(addCommand())
    .addCommand(listCommand())
}
