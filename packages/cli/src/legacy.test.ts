import { afterEach, describe, expect, it } from "vitest"
import fs from "fs-extra"
import os from "os"
import path from "path"
import { applyLegacyRepair, isLegacyConfig, planLegacyRepair, rewriteSpecifiers, type ComponentsConfig } from "./legacy"

const tempDirs: string[] = []
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

async function project(files: Record<string, string>) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-legacy-"))
  tempDirs.push(dir)
  for (const [name, text] of Object.entries(files)) {
    await fs.ensureDir(path.dirname(path.join(dir, name)))
    await fs.writeFile(path.join(dir, name), text)
  }
  return dir
}

const read = (dir: string, file: string) => fs.readFile(path.join(dir, file), "utf8")
const exists = (dir: string, file: string) => fs.pathExists(path.join(dir, file))

/** The components.json 0.3.3 wrote: interactive defaults, or --yes. */
const config033 = (interactive: boolean): ComponentsConfig => ({
  $schema: "https://ui.shadcn.com/schema.json",
  style: "default",
  rsc: true,
  tsx: true,
  tailwind: { config: "tailwind.config.ts", css: "src/app/globals.css", baseColor: "slate", cssVariables: true },
  aliases: interactive
    ? { components: "@/src/components", utils: "@/src/lib/utils", ui: "@/src/components/ui", lib: "@/lib", hooks: "@/hooks" }
    : { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/hooks" },
  registries: { smicolon: { url: "https://ui.smicolon.com/r" } },
})

const UTILS = `import { clsx } from "clsx"\nexport const cn = clsx\n`
const component = (name: string, utils: string, extra = "") =>
  `import { cn } from "${utils}"\n${extra}export function ${name}() { return cn("${name}") }\n`

describe("isLegacyConfig", () => {
  it("spots the registry entry 0.3 wrote", async () => {
    expect(await isLegacyConfig(await project({}), config033(false))).toBe(true)
  })

  it("leaves a config written by 0.4 alone", async () => {
    const config = { aliases: { components: "@/components", utils: "@/lib/utils" }, registries: { "@fasla": "https://ui.smicolon.com/r/{name}.json" } }
    expect(await isLegacyConfig(await project({}), config)).toBe(false)
  })

  it("spots src/src paths even after the registry entry was fixed by hand", async () => {
    const config = { aliases: { components: "@/src/components", utils: "@/src/lib/utils" }, registries: {} }
    expect(await isLegacyConfig(await project({ "src/src/lib/utils.ts": UTILS }), config)).toBe(true)
    // `@/src/...` alone is a legitimate choice when `@/` is the root.
    expect(await isLegacyConfig(await project({ "src/lib/utils.ts": UTILS }), config)).toBe(false)
  })
})

describe("repairing a 0.3 project whose @/ is the root (the broken case)", () => {
  // 0.3.3's interactive init, then 0.3.3's add (src/src), then 0.4's add with
  // the old config (src/, where "@/src/" does point). Nothing here compiled.
  const setup = () =>
    project({
      "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "@/*": ["./*"] } } }),
      "app/globals.css": "",
      "src/src/lib/utils.ts": UTILS,
      "src/src/components/ui/button.tsx": component("Button", "@/src/lib/utils"),
      "src/src/components/ui/avatar.tsx": component("Avatar", "@/src/lib/utils", `import "./status-indicator"\n`),
      "src/src/components/ui/badge.tsx": component("OldBadge", "@/src/lib/utils"),
      "src/components/ui/avatar.tsx": component("Avatar", "@/src/lib/utils", `import "./status-indicator"\n`),
      "src/components/ui/status-indicator.tsx": component("StatusIndicator", "@/src/lib/utils"),
      "src/components/ui/badge.tsx": component("Badge", "@/src/lib/utils"),
      "app/page.tsx": [
        `import { Avatar } from "@/src/components/ui/avatar"`,
        `import { Button } from "@/components/ui/button"`,
        `import { Group } from "@/src/components/ui/button-group"`,
        `import { cn } from '@/src/lib/utils'`,
      ].join("\n"),
    })

  it("plans the new aliases, the shadcn-readable registry and the real globals.css", async () => {
    const dir = await setup()
    const plan = await planLegacyRepair(dir, config033(true), "")
    expect(plan.config.aliases).toEqual({ components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/hooks" })
    expect(plan.config.registries).toEqual({ "@fasla": "https://ui.smicolon.com/r/{name}.json" })
    expect(plan.config.tailwind?.css).toBe("app/globals.css")
    expect(plan.config.style).toBe("default")
  })

  it("moves every file to where @/ reaches, newest copy first, and keeps a differing older one as .bak", async () => {
    const dir = await setup()
    const plan = await planLegacyRepair(dir, config033(true), "")
    const { backups } = await applyLegacyRepair(dir, plan)

    for (const file of ["avatar", "status-indicator", "badge", "button"]) {
      expect(await exists(dir, `components/ui/${file}.tsx`)).toBe(true)
    }
    expect(await read(dir, "components/ui/badge.tsx")).toContain("function Badge")
    expect(await read(dir, "lib/utils.ts")).toBe(UTILS)
    expect(backups).toEqual(["src/src/components/ui/badge.tsx.bak"])
    expect(await read(dir, "src/src/components/ui/badge.tsx.bak")).toContain("function OldBadge")
    // The 0.3 avatar was the same file as the 0.4 one, so it went.
    expect(await exists(dir, "src/src/components/ui/avatar.tsx")).toBe(false)
    // Emptied folders go; the one holding the backup stays.
    expect(await exists(dir, "src/components")).toBe(false)
    expect(await exists(dir, "src/src/lib")).toBe(false)
  })

  it("points the moved files and the project's own code at the new places, and nothing else", async () => {
    const dir = await setup()
    const { rewritten } = await applyLegacyRepair(dir, await planLegacyRepair(dir, config033(true), ""))

    expect(await read(dir, "components/ui/button.tsx")).toContain(`from "@/lib/utils"`)
    expect(await read(dir, "components/ui/avatar.tsx")).toContain(`import "./status-indicator"`)
    expect(await read(dir, "app/page.tsx")).toBe(
      [
        `import { Avatar } from "@/components/ui/avatar"`,
        `import { Button } from "@/components/ui/button"`,
        // Not a file the repair moved, so not its import to change.
        `import { Group } from "@/src/components/ui/button-group"`,
        `import { cn } from '@/lib/utils'`,
      ].join("\n")
    )
    expect(rewritten).toContain("app/page.tsx")
    // A backup is not source; it keeps what it said.
    expect(await read(dir, "src/src/components/ui/badge.tsx.bak")).toContain(`"@/src/lib/utils"`)
  })

  it("is not legacy any more once repaired, and a second plan does nothing", async () => {
    const dir = await setup()
    const plan = await planLegacyRepair(dir, config033(true), "")
    await applyLegacyRepair(dir, plan)
    expect(await isLegacyConfig(dir, plan.config)).toBe(false)
    const again = await planLegacyRepair(dir, plan.config, "")
    expect(again.moves).toEqual([])
    expect(again.specifiers).toEqual([])
  })
})

describe("repairing a 0.3 project whose @/ is src/", () => {
  it("moves src/src up to src/ and updates the imports that worked before, so they still work", async () => {
    const dir = await project({
      "src/app/globals.css": "",
      "src/src/lib/utils.ts": UTILS,
      "src/src/components/ui/button.tsx": component("Button", "@/src/lib/utils"),
      "src/app/page.tsx": `import { Button } from "@/src/components/ui/button"\n`,
    })
    const plan = await planLegacyRepair(dir, config033(true), "src")
    expect(plan.moves.map((m) => [m.from, m.to, m.action])).toEqual([
      ["src/src/components/ui/button.tsx", "src/components/ui/button.tsx", "move"],
      ["src/src/lib/utils.ts", "src/lib/utils.ts", "move"],
    ])
    await applyLegacyRepair(dir, plan)
    expect(await read(dir, "src/components/ui/button.tsx")).toContain(`from "@/lib/utils"`)
    expect(await read(dir, "src/app/page.tsx")).toBe(`import { Button } from "@/components/ui/button"\n`)
    expect(await exists(dir, "src/src")).toBe(false)
    expect(plan.config.tailwind?.css).toBe("src/app/globals.css")
  })
})

describe("repairing a project set up with 0.3's --yes", () => {
  it("moves files from the hard-coded src/ to the root when @/ is the root, without touching imports", async () => {
    const dir = await project({
      "src/lib/utils.ts": UTILS,
      "src/components/ui/button.tsx": component("Button", "@/lib/utils"),
      "app/page.tsx": `import { Button } from "@/components/ui/button"\n`,
    })
    const plan = await planLegacyRepair(dir, config033(false), "")
    expect(plan.specifiers).toEqual([])
    await applyLegacyRepair(dir, plan)
    expect(await exists(dir, "components/ui/button.tsx")).toBe(true)
    expect(await exists(dir, "lib/utils.ts")).toBe(true)
    expect(await read(dir, "app/page.tsx")).toBe(`import { Button } from "@/components/ui/button"\n`)
    expect(await exists(dir, "src")).toBe(false)
  })

  it("only fixes the registry when @/ is src/ and the files are already where it points", async () => {
    const dir = await project({ "src/lib/utils.ts": UTILS, "src/components/ui/button.tsx": component("Button", "@/lib/utils") })
    const plan = await planLegacyRepair(dir, config033(false), "src")
    expect(plan.moves).toEqual([])
    expect(plan.config.registries).toEqual({ "@fasla": "https://ui.smicolon.com/r/{name}.json" })
  })
})

describe("rewriteSpecifiers", () => {
  it("replaces only an exact, quoted specifier", () => {
    const pairs: [string, string][] = [["@/src/components/ui/button", "@/components/ui/button"]]
    expect(rewriteSpecifiers(`from "@/src/components/ui/button"`, pairs)).toBe(`from "@/components/ui/button"`)
    expect(rewriteSpecifiers(`from '@/src/components/ui/button'`, pairs)).toBe(`from '@/components/ui/button'`)
    expect(rewriteSpecifiers(`from "@/src/components/ui/button-group"`, pairs)).toBe(`from "@/src/components/ui/button-group"`)
    expect(rewriteSpecifiers(`// see @/src/components/ui/button`, pairs)).toBe(`// see @/src/components/ui/button`)
  })
})
