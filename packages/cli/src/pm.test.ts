import { afterEach, describe, expect, it, vi } from "vitest"
import fs from "fs-extra"
import os from "os"
import path from "path"
import { detectPackageManager, install, installArgs, installCommand, missingPackages, spawnRunner } from "./pm"

const tempDirs: string[] = []
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

async function project(files: Record<string, string> = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-pm-"))
  tempDirs.push(dir)
  for (const [name, text] of Object.entries(files)) {
    await fs.ensureDir(path.dirname(path.join(dir, name)))
    await fs.writeFile(path.join(dir, name), text)
  }
  return dir
}

describe("detectPackageManager", () => {
  it.each([
    ["package-lock.json", "npm"],
    ["npm-shrinkwrap.json", "npm"],
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lock", "bun"],
    ["bun.lockb", "bun"],
  ])("reads %s as %s", async (lockfile, pm) => {
    expect(await detectPackageManager(await project({ [lockfile]: "" }))).toBe(pm)
  })

  it("falls back to npm when there is no lockfile", async () => {
    // A temp folder's parents can hold a lockfile on a developer's machine, so
    // only the answer for a folder with none above it is pinned here: the
    // filesystem root.
    expect(await detectPackageManager(path.parse(os.tmpdir()).root)).toBe("npm")
  })

  it("finds the lockfile at a monorepo root from a workspace below it", async () => {
    const root = await project({ "pnpm-lock.yaml": "", "apps/web/package.json": "{}" })
    expect(await detectPackageManager(path.join(root, "apps/web"))).toBe("pnpm")
  })

  it("lets the nearest lockfile win over one further up", async () => {
    const root = await project({ "pnpm-lock.yaml": "", "apps/web/bun.lock": "" })
    expect(await detectPackageManager(path.join(root, "apps/web"))).toBe("bun")
  })

  it("treats a package-lock.json beside another lockfile as the stray one", async () => {
    // The state a bun or pnpm project is left in after one `npm install`.
    expect(await detectPackageManager(await project({ "package-lock.json": "", "bun.lock": "" }))).toBe("bun")
    expect(await detectPackageManager(await project({ "package-lock.json": "", "pnpm-lock.yaml": "" }))).toBe("pnpm")
    expect(await detectPackageManager(await project({ "package-lock.json": "", "yarn.lock": "" }))).toBe("yarn")
  })
})

describe("installCommand", () => {
  it("uses each package manager's own verb", () => {
    expect(installCommand("npm", ["clsx", "tailwind-merge"])).toBe("npm install clsx tailwind-merge")
    expect(installCommand("pnpm", ["clsx", "tailwind-merge"])).toBe("pnpm add clsx tailwind-merge")
    expect(installCommand("yarn", ["clsx", "tailwind-merge"])).toBe("yarn add clsx tailwind-merge")
    expect(installCommand("bun", ["clsx", "tailwind-merge"])).toBe("bun add clsx tailwind-merge")
  })

  it("spells the dev flag the way each one takes it", () => {
    expect(installCommand("npm", ["@types/node"], { dev: true })).toBe("npm install -D @types/node")
    expect(installCommand("pnpm", ["@types/node"], { dev: true })).toBe("pnpm add -D @types/node")
    expect(installCommand("yarn", ["@types/node"], { dev: true })).toBe("yarn add -D @types/node")
    expect(installCommand("bun", ["@types/node"], { dev: true })).toBe("bun add -d @types/node")
  })

  it("matches the arguments install runs", () => {
    expect(installArgs("pnpm", ["clsx"])).toEqual(["add", "clsx"])
  })
})

describe("missingPackages", () => {
  it("leaves out what package.json lists, in either dependency field", async () => {
    const dir = await project({
      "package.json": JSON.stringify({ dependencies: { clsx: "^2" }, devDependencies: { "lucide-react": "^1" } }),
    })
    expect(await missingPackages(dir, ["clsx", "tailwind-merge", "lucide-react"])).toEqual(["tailwind-merge"])
  })

  it("counts everything as missing without a package.json", async () => {
    expect(await missingPackages(await project(), ["clsx"])).toEqual(["clsx"])
  })
})

describe("install", () => {
  it("runs the package manager with its own install arguments, in the project", async () => {
    const run = vi.fn(async () => ({ ok: true as const }))
    await install("bun", ["clsx", "tailwind-merge"], "/project", run)
    expect(run).toHaveBeenCalledWith("bun", ["add", "clsx", "tailwind-merge"], "/project")
  })

  it("reports a package manager that isn't installed as a failure, not a crash", async () => {
    const result = await spawnRunner("fasla-no-such-package-manager", ["add", "clsx"], os.tmpdir())
    expect(result.ok).toBe(false)
  })

  it("keeps the output of a failed run", async () => {
    const result = await spawnRunner(process.execPath, ["-e", "console.error('boom'); process.exit(3)"], os.tmpdir())
    expect(result).toEqual({ ok: false, output: expect.stringContaining("boom") })
  })
})
