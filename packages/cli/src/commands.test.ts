import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import fs from "fs-extra"
import os from "os"
import path from "path"

// Every prompt takes the answer it offers by default, as pressing Enter does,
// and records what it asked.
const asked: { name: string; initial: unknown }[] = []
vi.mock("prompts", () => ({
  default: async (questions: { name: string; initial?: unknown } | { name: string; initial?: unknown }[]) => {
    const answers: Record<string, unknown> = {}
    for (const q of Array.isArray(questions) ? questions : [questions]) {
      asked.push({ name: q.name, initial: q.initial })
      answers[q.name] = q.initial
    }
    return answers
  },
}))

const { createProgram } = await import("./program")
const { installCnPackages } = await import("./commands/init")
const { addExample } = await import("./commands/list")

const tempDirs: string[] = []
let logs: string[] = []

beforeEach(() => {
  asked.length = 0
  logs = []
  vi.spyOn(console, "log").mockImplementation((...args) => void logs.push(args.join(" ")))
  vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
    throw new Error(`process.exit(${code})`)
  }) as never)
})

afterEach(async () => {
  vi.restoreAllMocks()
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

async function project(files: Record<string, string>) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-cmd-"))
  tempDirs.push(dir)
  for (const [name, text] of Object.entries(files)) {
    await fs.ensureDir(path.dirname(path.join(dir, name)))
    await fs.writeFile(path.join(dir, name), text)
  }
  return dir
}

const run = (...args: string[]) => createProgram().parseAsync(["node", "fasla-ui", ...args])
const output = () => logs.join("\n").replace(/\x1b\[[0-9;]*m/g, "")
const nextApp = (extra: Record<string, string> = {}) =>
  project({
    "package.json": JSON.stringify({ dependencies: { next: "16" } }),
    "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "@/*": ["./*"] } } }),
    "app/globals.css": "",
    ...extra,
  })

describe("init", () => {
  it("prints the install in the project's package manager when told not to install", async () => {
    const dir = await nextApp({ "pnpm-lock.yaml": "" })
    await run("init", "--yes", "--no-install", "--cwd", dir)
    expect(output()).toContain("pnpm add clsx tailwind-merge")
    expect(await fs.pathExists(path.join(dir, "lib/utils.ts"))).toBe(true)
  })

  it("installs nothing, and says nothing about it, when package.json already lists both", async () => {
    const dir = await nextApp({ "package.json": JSON.stringify({ dependencies: { clsx: "^2", "tailwind-merge": "^3" } }) })
    await run("init", "--yes", "--cwd", dir)
    expect(output()).not.toContain("clsx")
  })

  it("repairs a 0.3 components.json by default instead of cancelling", async () => {
    const dir = await nextApp({
      "components.json": JSON.stringify({
        tailwind: { css: "src/app/globals.css" },
        aliases: { components: "@/src/components", utils: "@/src/lib/utils", ui: "@/src/components/ui" },
        registries: { smicolon: { url: "https://ui.smicolon.com/r" } },
      }),
      "src/src/lib/utils.ts": "export const cn = () => ''\n",
      "src/src/components/ui/button.tsx": `import { cn } from "@/src/lib/utils"\n`,
    })
    await run("init", "--no-install", "--cwd", dir)

    // The only question was the repair, offered with yes as its default.
    expect(asked).toEqual([{ name: "repair", initial: true }])
    const config = await fs.readJson(path.join(dir, "components.json"))
    expect(config.registries).toEqual({ "@fasla": "https://ui.smicolon.com/r/{name}.json" })
    expect(config.aliases.components).toBe("@/components")
    expect(config.tailwind.css).toBe("app/globals.css")
    expect(await fs.readFile(path.join(dir, "components/ui/button.tsx"), "utf8")).toContain(`"@/lib/utils"`)
    expect(output()).toContain("This components.json was written by @smicolon/cli 0.3.")
    expect(output()).toContain("Success! fasla-ui has been initialized.")
  })

  it("repairs a 0.3 components.json under --yes too", async () => {
    const dir = await nextApp({ "components.json": JSON.stringify({ aliases: {}, registries: { smicolon: { url: "x" } } }) })
    await run("init", "--yes", "--no-install", "--cwd", dir)
    expect((await fs.readJson(path.join(dir, "components.json"))).registries).toEqual({
      "@fasla": "https://ui.smicolon.com/r/{name}.json",
    })
  })

  it("still asks before overwriting a components.json that isn't from 0.3, and keeps it by default", async () => {
    const original = JSON.stringify({ aliases: { components: "@/ui" }, registries: { "@fasla": "x/{name}" } })
    const dir = await nextApp({ "components.json": original })
    await expect(run("init", "--no-install", "--cwd", dir)).rejects.toThrow("process.exit(0)")
    expect(asked).toEqual([{ name: "overwrite", initial: false }])
    expect(await fs.readFile(path.join(dir, "components.json"), "utf8")).toBe(original)
  })

  it("warns a Vite app without @/ and prints the exact changes, in its package manager", async () => {
    const dir = await project({
      "package.json": JSON.stringify({ devDependencies: { vite: "^8" } }),
      "bun.lock": "",
      "vite.config.ts": "export default defineConfig({ plugins: [react()] })\n",
      "tsconfig.json": JSON.stringify({ files: [], references: [{ path: "./tsconfig.app.json" }] }),
      "tsconfig.app.json": JSON.stringify({ compilerOptions: {} }),
      "src/main.tsx": "",
    })
    await run("init", "--yes", "--no-install", "--cwd", dir)
    const out = output()
    expect(out).toContain(`Warning: "@/" is not set up in this Vite app`)
    expect(out).toContain('"paths": { "@/*": ["./src/*"] }')
    expect(out).toContain('resolve: { alias: { "@": path.resolve(__dirname, "./src") } },')
    expect(out).toContain("bun add -d @types/node")
    expect(out).toContain("bun add clsx tailwind-merge")
    // It still sets up src/, which is where those changes point "@/".
    expect(await fs.pathExists(path.join(dir, "src/lib/utils.ts"))).toBe(true)
  })
})

describe("installCnPackages", () => {
  it("installs only what is missing, with the project's package manager", async () => {
    const dir = await project({ "package.json": JSON.stringify({ dependencies: { clsx: "^2" } }) })
    const runner = vi.fn(async () => ({ ok: true as const }))
    expect(await installCnPackages(dir, "yarn", { run: runner })).toBe(true)
    expect(runner).toHaveBeenCalledWith("yarn", ["add", "tailwind-merge"], dir)
  })

  it("prints the package manager's output and the exact command when the install fails", async () => {
    const dir = await project({ "package.json": "{}" })
    const runner = vi.fn(async () => ({ ok: false as const, output: "ERR_PNPM_FETCH_404 clsx" }))
    expect(await installCnPackages(dir, "pnpm", { run: runner })).toBe(false)
    expect(output()).toContain("ERR_PNPM_FETCH_404 clsx")
    expect(output()).toContain("Run this to finish:\n  pnpm add clsx tailwind-merge")
  })

  it("prints the command instead of installing when there is no package.json", async () => {
    const runner = vi.fn()
    expect(await installCnPackages(await project({}), "npm", { run: runner })).toBe(true)
    expect(runner).not.toHaveBeenCalled()
    expect(output()).toContain("npm install clsx tailwind-merge")
  })
})

describe("--version", () => {
  it("prints the version in package.json", async () => {
    const { version } = await fs.readJson(path.join(__dirname, "../package.json"))
    let printed = ""
    const program = createProgram()
      .exitOverride()
      .configureOutput({ writeOut: (s) => void (printed += s) })
    await expect(program.parseAsync(["node", "fasla-ui", "--version"])).rejects.toThrow()
    expect(printed.trim()).toBe(version)
    expect(version).not.toBe("0.1.0")
  })
})

describe("list", () => {
  it("ends with a command that adds a real component, not a placeholder", () => {
    expect(addExample([{ name: "avatar" }, { name: "button" }])).toBe("npx @smicolon/cli add button")
    expect(addExample([{ name: "app-shell" }, { name: "navbar" }])).toBe("npx @smicolon/cli add app-shell")
    expect(addExample([])).toBeUndefined()
  })
})
