import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { spawn } from "child_process"
import fs from "fs-extra"
import os from "os"
import path from "path"

// Every prompt takes the answer it offers by default, as pressing Enter does,
// and records what it asked.
const asked: { name: string; initial: unknown }[] = []
// The questions as asked, with their choices and wording.
const prompted: { name: string; message?: string; choices?: { title: string; value: string }[] }[] = []
// Answers that differ from the default, by question name, for one test.
const overrides: Record<string, unknown> = {}
const answers = overrides
vi.mock("prompts", () => ({
  default: async (questions: { name: string; initial?: unknown } | { name: string; initial?: unknown }[]) => {
    const answers: Record<string, unknown> = {}
    for (const q of Array.isArray(questions) ? questions : [questions]) {
      asked.push({ name: q.name, initial: q.initial })
      prompted.push(q as (typeof prompted)[number])
      // An override may be a promise: the question then waits, as a person would.
      // A select answers with the chosen choice's value, as prompts does.
      const choices = (q as { choices?: { value: unknown }[] }).choices
      const byDefault = choices && typeof q.initial === "number" ? choices[q.initial]?.value : q.initial
      answers[q.name] = q.name in overrides ? await overrides[q.name] : byDefault
    }
    return answers
  },
}))

// The registry, without the network: two components, one of them needing a
// package. `registryDown` makes the fetch fail.
let registryDown = false
vi.mock("./registry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./registry")>()
  const items = [
    { name: "button", type: "registry:ui", dependencies: ["lucide-react"], files: [{ path: "registry/ui/button/button.tsx", type: "registry:ui", target: "", content: `// From Fasla UI (@fasla/button): https://ui.smicolon.com\nimport { cn } from "@/lib/utils"\nexport const Button = () => cn("b")\n` }] },
    { name: "badge", type: "registry:ui", files: [{ path: "registry/ui/badge/badge.tsx", type: "registry:ui", target: "", content: `// From Fasla UI (@fasla/badge): https://ui.smicolon.com\nimport { cn } from "@/lib/utils"\nexport const Badge = () => cn("x")\n` }] },
    // Broken registry entries, for what add says when a component writes nothing.
    { name: "hollow", type: "registry:ui", files: [] },
    { name: "blank", type: "registry:ui", files: [{ path: "registry/ui/blank/blank.tsx", type: "registry:ui", target: "", content: "" }] },
  ]
  return {
    ...actual,
    fetchRegistry: async () => {
      if (registryDown) throw new Error("Failed to fetch registry: 503 Service Unavailable")
      return { name: "fasla", homepage: "", items: items.map(({ files, ...item }) => item) }
    },
    fetchComponent: async (name: string) => items.find((item) => item.name === name)!,
  }
})

// The theme installs with the shadcn CLI, over the network: recorded here instead.
const themesApplied: { cwd: string; choice: string }[] = []
let themeFails = false
vi.mock("./theme", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./theme")>()
  return {
    ...actual,
    applyTheme: async (cwd: string, choice: string, _project?: unknown) => {
      themesApplied.push({ cwd, choice })
      return themeFails ? { ok: false, output: "ERR_SOME_SHADCN_FAILURE" } : { ok: true }
    },
  }
})

const { createProgram } = await import("./program")
const { installCnPackages, rangeStaysBelow3 } = await import("./commands/init")
const { beginLegacyRepair, executeJournal, LOCK_FILE, planLegacyRepair, REPAIR_FILE } = await import("./legacy")
const { addExample } = await import("./commands/list")

const tempDirs: string[] = []
let logs: string[] = []

beforeEach(() => {
  asked.length = 0
  prompted.length = 0
  registryDown = false
  themesApplied.length = 0
  themeFails = false
  for (const key of Object.keys(overrides)) delete overrides[key]
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

/** Every file under `dir` with its text, and every folder, to compare before and after. */
async function tree(dir: string, rel = ""): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  for (const entry of await fs.readdir(path.join(dir, rel), { withFileTypes: true })) {
    const child = rel ? `${rel}/${entry.name}` : entry.name
    if (entry.isDirectory()) Object.assign(out, { [`${child}/`]: "" }, await tree(dir, child))
    else out[child] = await fs.readFile(path.join(dir, child), "utf8")
  }
  return out
}

const viteApp = () =>
  project({
    "package.json": JSON.stringify({ devDependencies: { vite: "^8" } }),
    "bun.lock": "",
    "vite.config.ts": "export default defineConfig({ plugins: [react()] })\n",
    "tsconfig.json": JSON.stringify({ files: [], references: [{ path: "./tsconfig.app.json" }] }),
    "tsconfig.app.json": JSON.stringify({ compilerOptions: {} }),
    "src/main.tsx": "",
  })

/** A Next.js app set up with 0.3.3's interactive init and add. */
const legacyProject = (extra: Record<string, string> = {}) =>
  nextApp({
    "components.json": JSON.stringify({
      tailwind: { css: "src/app/globals.css" },
      aliases: { components: "@/src/components", utils: "@/src/lib/utils", ui: "@/src/components/ui" },
      registries: { smicolon: { url: "https://ui.smicolon.com/r" } },
    }),
    "package.json": JSON.stringify({ dependencies: { next: "16", clsx: "^2", "tailwind-merge": "^3" } }),
    "src/src/lib/utils.ts": "export const cn = () => ''\n",
    "src/src/components/ui/badge.tsx": `import { cn } from "@/src/lib/utils"\n`,
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
    expect(asked).toEqual([
      { name: "repair", initial: true },
      { name: "theme", initial: 0 },
    ])
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

  it("warns an interactive run in a Vite app without @/, prints the exact changes, and carries on", async () => {
    const dir = await viteApp()
    await run("init", "--no-install", "--cwd", dir)
    const out = output()
    expect(out).toContain(`Warning: "@/" is not set up in this Vite app`)
    expect(out).toContain('"paths": { "@/*": ["./src/*"] }')
    expect(out).toContain('resolve: { alias: { "@": path.resolve(__dirname, "./src") } },')
    expect(out).toContain("bun add -d @types/node")
    expect(out).toContain("bun add clsx tailwind-merge")
    // It sets up src/, which is where those changes point "@/".
    expect(await fs.pathExists(path.join(dir, "src/lib/utils.ts"))).toBe(true)
  })

  it("stops a --yes run in a Vite app without @/, prints the fix, and writes nothing", async () => {
    const dir = await viteApp()
    const before = await tree(dir)
    await expect(run("init", "--yes", "--no-install", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    const out = output()
    expect(out).toContain(`Error: "@/" is not set up in this Vite app`)
    expect(out).toContain('"paths": { "@/*": ["./src/*"] }')
    expect(out).toContain("Nothing was written.")
    expect(await tree(dir)).toEqual(before)
  })

  it("stops a --yes run in any project whose tsconfig doesn't map @/", async () => {
    const dir = await project({ "package.json": "{}", "tsconfig.json": JSON.stringify({ compilerOptions: {} }), "src/index.ts": "" })
    const before = await tree(dir)
    await expect(run("init", "--yes", "--no-install", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain(`Error: "@/" is not mapped in this project's tsconfig`)
    expect(await tree(dir)).toEqual(before)
  })

  it("finishes a repair that an earlier run was killed in the middle of", async () => {
    const dir = await legacyProject({ "src/src/components/ui/button.tsx": `import { cn } from "@/src/lib/utils"\n` })
    const config = await fs.readJson(path.join(dir, "components.json"))
    const journal = await beginLegacyRepair(dir, await planLegacyRepair(dir, config, ""))
    // Killed after the first move, leaving the project half repaired.
    const killed = executeJournal(dir, journal, {
      afterStep: (i) => {
        if (journal.steps[i].op === "move") throw new Error("killed")
      },
    })
    await expect(killed).rejects.toThrow("killed")
    expect(await fs.pathExists(path.join(dir, REPAIR_FILE))).toBe(true)

    // --yes never resumes a plan it hasn't shown: it says how, and changes nothing.
    const halfway = await tree(dir)
    await expect(run("init", "--yes", "--no-install", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain("Run the command without --yes to review and resume it")
    expect(output()).toContain(`or delete ${REPAIR_FILE} to abandon it`)
    expect(await tree(dir)).toEqual(halfway)

    // Run interactively, it shows what is left and asks first.
    logs = []
    await run("init", "--no-install", "--cwd", dir)
    expect(asked.map((q) => q.name)).toEqual(["resume", "theme"])
    expect(asked[0].initial).toBe(true)
    expect(output()).toContain(`stopped after ${journal.done} of ${journal.steps.length} steps`)
    expect(output()).toContain("- write the repaired components.json")
    expect(await fs.pathExists(path.join(dir, REPAIR_FILE))).toBe(false)
    expect((await fs.readJson(path.join(dir, "components.json"))).registries).toEqual({ "@fasla": "https://ui.smicolon.com/r/{name}.json" })
    for (const file of ["components/ui/badge.tsx", "components/ui/button.tsx"]) {
      expect(await fs.readFile(path.join(dir, file), "utf8")).toContain(`"@/lib/utils"`)
    }
    expect(await fs.pathExists(path.join(dir, "src"))).toBe(false)
  })

  it("names the files and the way out when a repair can neither finish nor be undone", async () => {
    const dir = await legacyProject({
      "app/page.tsx": `import { Badge } from "@/src/components/ui/badge"\n`,
      "app/other.tsx": `import { cn } from "@/src/lib/utils"\n`,
    })
    const config = await fs.readJson(path.join(dir, "components.json"))
    const journal = await beginLegacyRepair(dir, await planLegacyRepair(dir, config, ""))
    const pageStep = journal.steps.findIndex((s) => s.op === "write" && s.file === "app/page.tsx")
    const otherStep = journal.steps.findIndex((s) => s.op === "write" && s.file === "app/other.tsx")
    // Killed after updating whichever page comes first; then both pages are
    // edited by hand: the next step refuses, and its undo can't restore the first.
    const [first, second] = pageStep < otherStep ? ["app/page.tsx", "app/other.tsx"] : ["app/other.tsx", "app/page.tsx"]
    await expect(
      executeJournal(dir, journal, {
        afterStep: (i) => {
          if (i === Math.min(pageStep, otherStep)) throw new Error("killed")
        },
      })
    ).rejects.toThrow("killed")
    await fs.writeFile(path.join(dir, first), "// edited after the repair wrote it\n")
    await fs.writeFile(path.join(dir, second), "// edited before the repair reached it\n")

    await expect(run("init", "--no-install", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain(`couldn't put back ${first}`)
    expect(output()).toContain(`delete ${REPAIR_FILE} to abandon the repair`)
    expect(await fs.pathExists(path.join(dir, REPAIR_FILE))).toBe(true)

    // Run again, it isn't stuck: the edited file's step is now the one that
    // fails, so it counts as never made, and the rest is undone around it.
    logs = []
    await expect(run("add", "badge", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain("Everything it had changed was put back")
    expect(await fs.pathExists(path.join(dir, REPAIR_FILE))).toBe(false)
    expect(await fs.pathExists(path.join(dir, "src/src/components/ui/badge.tsx"))).toBe(true)
    expect(await fs.readFile(path.join(dir, first), "utf8")).toBe("// edited after the repair wrote it\n")
    expect(await fs.readFile(path.join(dir, second), "utf8")).toBe("// edited before the repair reached it\n")
  })

  it("refuses a tampered plan that would move .env into public/, asks nothing, and changes nothing", async () => {
    const dir = await legacyProject({ ".env": "SECRET=1\n", "public/robots.txt": "" })
    const config = await fs.readJson(path.join(dir, "components.json"))
    const journal = await beginLegacyRepair(dir, await planLegacyRepair(dir, config, ""))
    // What a malicious commit could add: a real plan with one extra move.
    journal.steps.unshift({ op: "move", from: ".env", to: "public/.env" })
    await fs.writeFile(path.join(dir, REPAIR_FILE), JSON.stringify(journal))
    const before = await tree(dir)

    for (const args of [["init", "--no-install"], ["add", "badge"], ["init", "--yes", "--no-install"]]) {
      logs = []
      asked.length = 0
      await expect(run(...args, "--cwd", dir)).rejects.toThrow("process.exit(1)")
      expect(output()).toContain(`${REPAIR_FILE} asks to move .env to public/.env, which a 0.3 repair never does`)
      expect(output()).toContain("nothing was changed")
      expect(asked.filter((q) => q.name === "resume")).toEqual([])
      expect(await tree(dir)).toEqual(before)
    }
  })

  it("lets only one run repair at a time: a second run while the first waits on its question exits", async () => {
    const dir = await legacyProject()
    let answer!: (value: boolean) => void
    overrides.repair = new Promise<boolean>((resolve) => (answer = resolve))

    const first = run("init", "--no-install", "--cwd", dir)
    // The first run now holds the lock, waiting for "Repair it?".
    for (let i = 0; i < 50 && !(await fs.pathExists(path.join(dir, LOCK_FILE))); i++) await new Promise((r) => setTimeout(r, 10))
    expect(await fs.pathExists(path.join(dir, LOCK_FILE))).toBe(true)
    const before = await tree(dir)

    await expect(run("add", "badge", "--yes", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain(`Another fasla-ui run (process ${process.pid}) is repairing this project`)
    expect(output()).toContain(`If no other run is going, delete ${LOCK_FILE}`)
    expect(await tree(dir)).toEqual(before)

    answer(true)
    await first
    expect((await fs.readJson(path.join(dir, "components.json"))).aliases.components).toBe("@/components")
    expect(await fs.pathExists(path.join(dir, LOCK_FILE))).toBe(false)
  })

  it("waits for no lock held by a run that is still going in another process, and clears one whose process has ended", async () => {
    const dir = await legacyProject()
    const other = spawn(process.execPath, ["-e", "setTimeout(() => {}, 30000)"], { stdio: "ignore" })
    try {
      await fs.writeFile(path.join(dir, LOCK_FILE), JSON.stringify({ pid: other.pid }))
      const before = await tree(dir)
      await expect(run("init", "--yes", "--no-install", "--cwd", dir)).rejects.toThrow("process.exit(1)")
      expect(output()).toContain(`Another fasla-ui run (process ${other.pid}) is repairing this project`)
      expect(await tree(dir)).toEqual(before)
    } finally {
      other.kill()
      await new Promise((resolve) => other.once("exit", resolve))
    }
    // That process is gone now: its lock is stale, so this run takes over.
    logs = []
    await run("init", "--yes", "--no-install", "--cwd", dir)
    expect((await fs.readJson(path.join(dir, "components.json"))).registries).toEqual({ "@fasla": "https://ui.smicolon.com/r/{name}.json" })
    expect(await fs.pathExists(path.join(dir, LOCK_FILE))).toBe(false)
  })

  it("does not repair a 0.3 project under --yes when @/ is only a guess", async () => {
    const dir = await legacyProject({ "tsconfig.json": JSON.stringify({ compilerOptions: {} }) })
    const before = await tree(dir)
    await expect(run("init", "--yes", "--no-install", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(await tree(dir)).toEqual(before)
  })
})

describe("add", () => {
  it("leaves a 0.3 project untouched when a component name is wrong", async () => {
    const dir = await legacyProject()
    const before = await tree(dir)
    await expect(run("add", "buton", "--yes", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain("Unknown components: buton")
    expect(await tree(dir)).toEqual(before)
  })

  it("leaves a 0.3 project untouched when the registry can't be fetched", async () => {
    registryDown = true
    const dir = await legacyProject()
    const before = await tree(dir)
    await expect(run("add", "button", "--yes", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(await tree(dir)).toEqual(before)
  })

  it("leaves a 0.3 project untouched when the add is declined", async () => {
    const dir = await legacyProject()
    const before = await tree(dir)
    asked.length = 0
    answers.confirm = false
    await expect(run("add", "button", "--cwd", dir)).rejects.toThrow("process.exit(0)")
    expect(asked.map((q) => q.name)).toEqual(["confirm"])
    expect(await tree(dir)).toEqual(before)
  })

  it("repairs a 0.3 project once the add is confirmed, then adds into the repaired folders", async () => {
    const dir = await legacyProject({ "pnpm-lock.yaml": "" })
    await run("add", "button", "--yes", "--cwd", dir)
    expect((await fs.readJson(path.join(dir, "components.json"))).aliases.components).toBe("@/components")
    expect(await fs.readFile(path.join(dir, "components/ui/badge.tsx"), "utf8")).toContain(`"@/lib/utils"`)
    expect(await fs.pathExists(path.join(dir, "components/ui/button.tsx"))).toBe(true)
    expect(await fs.pathExists(path.join(dir, "src"))).toBe(false)
    expect(output()).toContain("pnpm add lucide-react")
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

  it("installs tailwind-merge 2 on Tailwind 3, whose classes tailwind-merge 3 doesn't know", async () => {
    const dir = await project({ "package.json": "{}" })
    const runner = vi.fn(async () => ({ ok: true as const }))
    expect(await installCnPackages(dir, "npm", { run: runner, tailwindMajor: 3 })).toBe(true)
    expect(runner).toHaveBeenCalledWith("npm", ["install", "clsx", "tailwind-merge@^2"], dir)
  })

  it("replaces a tailwind-merge 3 already listed on Tailwind 3, and leaves it on Tailwind 4", async () => {
    const dir = await project({ "package.json": JSON.stringify({ dependencies: { clsx: "^2", "tailwind-merge": "^3.7.0" } }) })
    const runner = vi.fn(async () => ({ ok: true as const }))
    await installCnPackages(dir, "pnpm", { run: runner, tailwindMajor: 3 })
    expect(runner).toHaveBeenCalledWith("pnpm", ["add", "tailwind-merge@^2"], dir)
    runner.mockClear()
    await installCnPackages(dir, "pnpm", { run: runner, tailwindMajor: 4 })
    expect(runner).not.toHaveBeenCalled()
  })

  it("leaves a tailwind-merge 2 alone on Tailwind 3", async () => {
    const dir = await project({
      "package.json": JSON.stringify({ dependencies: { clsx: "^2", "tailwind-merge": "^2.6.0" } }),
      "node_modules/tailwind-merge/package.json": JSON.stringify({ version: "2.6.1" }),
    })
    const runner = vi.fn(async () => ({ ok: true as const }))
    await installCnPackages(dir, "npm", { run: runner, tailwindMajor: 3 })
    expect(runner).not.toHaveBeenCalled()
  })

  it("on Tailwind 3, replaces any range that can resolve to tailwind-merge 3, and says why", async () => {
    for (const range of [">=2.0.0", "*", "latest", "^2.6.0 || ^3.0.0", "3", "~3.7.0", "x"]) {
      const dir = await project({ "package.json": JSON.stringify({ dependencies: { clsx: "^2", "tailwind-merge": range } }) })
      const runner = vi.fn(async () => ({ ok: true as const }))
      logs = []
      await installCnPackages(dir, "npm", { run: runner, tailwindMajor: 3 })
      expect(runner, range).toHaveBeenCalledWith("npm", ["install", "tailwind-merge@^2"], dir)
      expect(output(), range).toContain(`package.json lists tailwind-merge "${range}", which can install 3.`)
    }
  })

  it("on Tailwind 3, replaces an installed tailwind-merge 3 even when the range reads 2", async () => {
    const dir = await project({
      "package.json": JSON.stringify({ dependencies: { clsx: "^2", "tailwind-merge": "^2.6.0" } }),
      "node_modules/tailwind-merge/package.json": JSON.stringify({ version: "3.7.0" }),
    })
    const runner = vi.fn(async () => ({ ok: true as const }))
    await installCnPackages(dir, "npm", { run: runner, tailwindMajor: 3 })
    expect(runner).toHaveBeenCalledWith("npm", ["install", "tailwind-merge@^2"], dir)
    expect(output()).toContain("tailwind-merge 3.7.0 is installed. tailwind-merge 3 supports only Tailwind 4")
  })

  it("finds the installed copy in a monorepo's root node_modules", async () => {
    const root = await project({
      "node_modules/tailwind-merge/package.json": JSON.stringify({ version: "3.1.0" }),
      "apps/web/package.json": JSON.stringify({ dependencies: { clsx: "^2", "tailwind-merge": "^2" } }),
    })
    const dir = path.join(root, "apps/web")
    const runner = vi.fn(async () => ({ ok: true as const }))
    await installCnPackages(dir, "pnpm", { run: runner, tailwindMajor: 3 })
    expect(runner).toHaveBeenCalledWith("pnpm", ["add", "tailwind-merge@^2"], dir)
  })

  it("leaves any tailwind-merge alone on Tailwind 4", async () => {
    const dir = await project({
      "package.json": JSON.stringify({ dependencies: { clsx: "^2", "tailwind-merge": ">=2.0.0" } }),
      "node_modules/tailwind-merge/package.json": JSON.stringify({ version: "3.7.0" }),
    })
    const runner = vi.fn(async () => ({ ok: true as const }))
    await installCnPackages(dir, "npm", { run: runner, tailwindMajor: 4 })
    expect(runner).not.toHaveBeenCalled()
  })

  it("reads only ranges that stay on major 2 or below as safe for Tailwind 3", () => {
    for (const range of ["^2", "^2.6.0", "~2.6.1", "2", "2.x", "2.6.x", "2.6.1", "=2.6.1", "v2.6.1", "^1.14.0", "2.0.0-beta.1"]) {
      expect(rangeStaysBelow3(range), range).toBe(true)
    }
    for (const range of [">=2.0.0", ">2", "*", "x", "latest", "next", "^3", "3.0.0", "^2 || ^3", "2 - 3", "<4", "npm:tailwind-merge@2", "workspace:*", ""]) {
      expect(rangeStaysBelow3(range), range).toBe(false)
    }
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

describe("init: the theme", () => {
  const withColours = (extra: Record<string, string> = {}) =>
    nextApp({ "app/globals.css": `@import "tailwindcss";\n:root {\n  --primary: #ff0066;\n}\n`, ...extra })

  it("asks which theme, Fasla's colours first, and installs what was picked", async () => {
    const dir = await withColours({ "package.json": JSON.stringify({ dependencies: { next: "16", clsx: "^2", "tailwind-merge": "^3" } }) })
    await run("init", "--cwd", dir)
    const theme = prompted.find((q) => q.name === "theme")!
    expect(theme.message).toBe("How should your components look?")
    expect(theme.choices!.map((c) => [c.value, c.title])).toEqual([
      ["fasla", "Starting from scratch: use Fasla's colours"],
      ["brand", "I have a brand: keep my colours"],
    ])
    expect(asked.find((q) => q.name === "theme")!.initial).toBe(0)
    expect(themesApplied).toEqual([{ cwd: dir, choice: "fasla" }])
  })

  it("says when there are no colours to keep", async () => {
    const dir = await nextApp({ "app/globals.css": `@import "tailwindcss";\n` })
    await run("init", "--no-install", "--cwd", dir)
    const brand = prompted.find((q) => q.name === "theme")!.choices!.find((c) => c.value === "brand")!
    expect(brand.title).toBe("I have a brand: keep my colours (app/globals.css has no colours yet, so the components would have none)")
  })

  it("keeps the project's colours under --yes: base theme only, and says how to switch", async () => {
    const dir = await withColours()
    await run("init", "--yes", "--cwd", dir, "--no-install")
    expect(output()).toContain("app/globals.css has its own colours, so they are kept: installing the base theme only.")
    expect(output()).toContain("npx @smicolon/cli init --theme fasla")
    expect(output()).toContain("npx shadcn@latest add @fasla/theme-base")
    expect(asked.map((q) => q.name)).not.toContain("theme")
  })

  it("installs Fasla's colours under --yes only when the project has none", async () => {
    const dir = await nextApp({ "app/globals.css": `@import "tailwindcss";\n`, "package.json": JSON.stringify({ dependencies: { next: "16", clsx: "^2", "tailwind-merge": "^3" } }) })
    await run("init", "--yes", "--cwd", dir)
    expect(output()).toContain("app/globals.css has no colours yet, so it gets Fasla's.")
    expect(themesApplied).toEqual([{ cwd: dir, choice: "fasla" }])
  })

  it("replaces the project's colours only when --theme fasla says so", async () => {
    const dir = await withColours({ "package.json": JSON.stringify({ dependencies: { next: "16", clsx: "^2", "tailwind-merge": "^3" } }) })
    await run("init", "--yes", "--theme", "fasla", "--cwd", dir)
    expect(themesApplied).toEqual([{ cwd: dir, choice: "fasla" }])
    expect(output()).not.toContain("so they are kept")
  })

  it("leaves Geist out of the command on Next.js 14, whose next/font has none", async () => {
    const dir = await nextApp({ "package.json": JSON.stringify({ dependencies: { next: "14.2.35" } }), "app/globals.css": "@tailwind base;\n" })
    await run("init", "--yes", "--no-install", "--cwd", dir)
    expect(output()).toContain("Install the theme:\n  npx shadcn@latest add @fasla/theme\n")
  })

  it("takes --theme brand without asking", async () => {
    const dir = await nextApp({ "package.json": JSON.stringify({ dependencies: { next: "16", clsx: "^2", "tailwind-merge": "^3" } }) })
    await run("init", "--theme", "brand", "--cwd", dir)
    expect(asked.map((q) => q.name)).not.toContain("theme")
    expect(themesApplied).toEqual([{ cwd: dir, choice: "brand" }])
  })

  it("refuses an unknown --theme before writing anything", async () => {
    const dir = await nextApp()
    const before = await tree(dir)
    await expect(run("init", "--yes", "--theme", "blue", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain('--theme is "fasla" or "brand", not "blue"')
    expect(await tree(dir)).toEqual(before)
  })

  it("prints the shadcn command and stops when installing the theme fails", async () => {
    themeFails = true
    const dir = await withColours({ "package.json": JSON.stringify({ dependencies: { next: "16", clsx: "^2", "tailwind-merge": "^3" } }) })
    await expect(run("init", "--yes", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain("ERR_SOME_SHADCN_FAILURE")
    expect(output()).toContain("Run this to finish:\n  npx shadcn@latest add @fasla/theme-base")
  })
})

describe("init: where the stylesheet and Tailwind are", () => {
  it("finds a Vite app's src/index.css, with no Tailwind config and no server components", async () => {
    const dir = await project({
      "package.json": JSON.stringify({ devDependencies: { vite: "^8", tailwindcss: "^4.3.3" } }),
      "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
      "src/index.css": `@import "tailwindcss";\n`,
      "src/App.css": ".app {}\n",
    })
    await run("init", "--yes", "--no-install", "--cwd", dir)
    const config = await fs.readJson(path.join(dir, "components.json"))
    expect(config.tailwind).toMatchObject({ css: "src/index.css", config: "" })
    expect(config.rsc).toBe(false)
  })

  it("names the Tailwind 3 config file a Next.js app has", async () => {
    const dir = await nextApp({
      "package.json": JSON.stringify({ dependencies: { next: "14" }, devDependencies: { tailwindcss: "^3.4.1" } }),
      "tailwind.config.js": "module.exports = {}\n",
      "app/globals.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
    })
    await run("init", "--yes", "--no-install", "--cwd", dir)
    const config = await fs.readJson(path.join(dir, "components.json"))
    expect(config.tailwind).toMatchObject({ css: "app/globals.css", config: "tailwind.config.js" })
    expect(config.rsc).toBe(true)
  })
})

describe("add: files of the same name from another library", () => {
  const shadcnButton = `import { Slot } from "@radix-ui/react-slot"\nexport function Button() { return null }\n`
  const withShadcnButton = () =>
    nextApp({
      "components.json": JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" }, registries: { "@fasla": "x/{name}" } }),
      "components/ui/button.tsx": shadcnButton,
    })

  it("asks before replacing one, yes by default, and replaces it", async () => {
    const dir = await withShadcnButton()
    await run("add", "button", "--cwd", dir)
    const replace = prompted.find((q) => q.name === "replaceIt")!
    expect(replace.message).toBe("button.tsx exists and isn't Fasla's. Replace it?")
    expect(asked.find((q) => q.name === "replaceIt")!.initial).toBe(true)
    expect(await fs.readFile(path.join(dir, "components/ui/button.tsx"), "utf8")).toContain("From Fasla UI (@fasla/button)")
  })

  it("keeps it when the answer is no", async () => {
    const dir = await withShadcnButton()
    overrides.replaceIt = false
    await run("add", "button", "--cwd", dir)
    expect(await fs.readFile(path.join(dir, "components/ui/button.tsx"), "utf8")).toBe(shadcnButton)
    expect(output()).toContain("Kept components/ui/button.tsx: not Fasla's, so not replaced.")
  })

  it("never replaces one under --yes, and prints the -o command that would", async () => {
    const dir = await withShadcnButton()
    await run("add", "button", "badge", "--yes", "--cwd", dir)
    expect(await fs.readFile(path.join(dir, "components/ui/button.tsx"), "utf8")).toBe(shadcnButton)
    expect(await fs.pathExists(path.join(dir, "components/ui/badge.tsx"))).toBe(true)
    expect(output()).toContain("To replace it with Fasla's: npx @smicolon/cli add button -o")
    expect(asked.map((q) => q.name)).not.toContain("replaceIt")
    // badge was written, button wasn't: the summary says so, and why.
    expect(output()).toContain("Added 1 of 2 component(s).\nNot added:\n  button: button.tsx is already there")
    expect(output()).toContain('import { ... } from "@/components/ui/badge"')
    expect(output()).not.toContain('from "@/components/ui/button"')
  })

  it("doesn't say it added a component whose only file it kept under --yes", async () => {
    const dir = await withShadcnButton()
    await run("add", "button", "--yes", "--cwd", dir)
    expect(output()).toContain("Added nothing.\nNot added:\n  button: button.tsx is already there")
    expect(output()).not.toContain("Components added successfully!")
    expect(output()).not.toContain("Import them in your code:")
  })

  it("names the real reason a component wrote nothing: no files, or no content", async () => {
    const dir = await withShadcnButton()
    await run("add", "hollow", "blank", "badge", "--yes", "--cwd", dir)
    const text = output()
    expect(text).toContain("Added 1 of 3 component(s).")
    expect(text).toContain("  hollow: the registry has no files for it")
    expect(text).toContain("  blank: the registry has no content for registry/ui/blank/blank.tsx")
    // Neither is blamed on a file that is already there.
    expect(text).not.toMatch(/(hollow|blank): .*already there/)
  })

  it("reads nothing through a folder that is a symlink out of the project", async () => {
    const dir = await nextApp({
      "components.json": JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" }, registries: { "@fasla": "x/{name}" } }),
    })
    const outside = await project({ "button.tsx": "SECRET outside the project\n" })
    await fs.ensureDir(path.join(dir, "components"))
    await fs.symlink(outside, path.join(dir, "components/ui"))
    const reads = vi.spyOn(fs, "readFile")

    await expect(run("add", "button", "--yes", "--cwd", dir)).rejects.toThrow("process.exit(1)")
    expect(output()).toContain("Nothing was written.")
    const touched = reads.mock.calls.map((call) => String(call[0])).filter((file) => file.startsWith(outside) || file.includes("components/ui/button.tsx"))
    expect(touched).toEqual([])
    expect(await fs.readFile(path.join(outside, "button.tsx"), "utf8")).toBe("SECRET outside the project\n")
  })

  it("replaces it with -o, without asking", async () => {
    const dir = await withShadcnButton()
    await run("add", "button", "-o", "--yes", "--cwd", dir)
    expect(await fs.readFile(path.join(dir, "components/ui/button.tsx"), "utf8")).toContain("From Fasla UI (@fasla/button)")
  })

  it("doesn't ask about a Fasla file, edited or not, which keeps the -o rule", async () => {
    const dir = await withShadcnButton()
    const edited = `// From Fasla UI (@fasla/button): https://ui.smicolon.com\n// my edit\n`
    await fs.writeFile(path.join(dir, "components/ui/button.tsx"), edited)
    await run("add", "button", "--cwd", dir)
    expect(asked.map((q) => q.name)).not.toContain("replaceIt")
    expect(await fs.readFile(path.join(dir, "components/ui/button.tsx"), "utf8")).toBe(edited)
  })
})
