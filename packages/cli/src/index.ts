import { Command } from "commander"
import { add } from "./commands/add.js"
import { init } from "./commands/init.js"
import { list } from "./commands/list.js"

const program = new Command()

program
  .name("smi-ui")
  .description("CLI for installing smi-ui components")
  .version("0.1.0")

program.addCommand(init)
program.addCommand(add)
program.addCommand(list)

program.parse()
