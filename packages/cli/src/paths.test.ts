import { afterEach, describe, it, expect, vi } from "vitest"
import { execFileSync } from "child_process"
import fs from "fs-extra"
import os from "os"
import path from "path"
import {
  aliasToPath,
  chooseAliasRoot,
  findAliasRoot,
  pathToAlias,
  resolveInsideProject,
  resolveWritableFile,
  UnknownAliasRootError,
  UnsafePathError,
  writeFileNoFollow,
} from "./paths"

const readAliasRoot = async (dir: string) => (await findAliasRoot(dir)).root

// Every temp folder a test makes, removed after each test.
const tempDirs: string[] = []
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

async function tempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-cli-"))
  tempDirs.push(dir)
  return dir
}

async function project(files: Record<string, string>, dirs: string[] = []) {
  const dir = await tempDir()
  for (const d of dirs) await fs.ensureDir(path.join(dir, d))
  for (const [name, text] of Object.entries(files)) {
    await fs.ensureDir(path.dirname(path.join(dir, name)))
    await fs.writeFile(path.join(dir, name), text)
  }
  return dir
}

const tsconfig = (paths: Record<string, string[]>, baseUrl?: string) =>
  JSON.stringify({ compilerOptions: { ...(baseUrl ? { baseUrl } : {}), paths } })

// The folder `@/` resolves to, for a project holding just these files.
const rootFor = async (files: Record<string, string>, dirs: string[] = []) =>
  readAliasRoot(await project(files, dirs))

describe("readAliasRoot: reading tsconfig", () => {
  it("reads a src/ mapping", async () => {
    expect(await rootFor({ "tsconfig.json": tsconfig({ "@/*": ["./src/*"] }) })).toBe("src")
  })

  it("reads a project-root mapping as the empty string", async () => {
    expect(await rootFor({ "tsconfig.json": tsconfig({ "@/*": ["./*"] }) })).toBe("")
  })

  it("resolves the mapping against baseUrl", async () => {
    expect(await rootFor({ "tsconfig.json": tsconfig({ "@/*": ["*"] }, "src") })).toBe("src")
    expect(await rootFor({ "tsconfig.json": tsconfig({ "@/*": ["./src/*"] }, "./") })).toBe("src")
  })

  it("accepts comments and trailing commas, and leaves // inside strings", async () => {
    const text = `{
      "$schema": "https://json.schemastore.org/tsconfig",
      // Next.js writes this one
      "compilerOptions": {
        /* aliases */
        "paths": { "@/*": ["./src/*"], },
      },
    }`
    expect(await rootFor({ "tsconfig.json": text })).toBe("src")
  })

  it("keeps commas and brackets that are part of a path string", async () => {
    // A hand-rolled trailing-comma strip turned "./src,]/*" into "./src]/*".
    const text = '{ "compilerOptions": { "paths": { "@/*": ["./src,]/*"], }, }, }'
    expect(await rootFor({ "tsconfig.json": text })).toBe("src,]")
  })

  it("falls back when there is no @/* path or the file doesn't parse", async () => {
    expect(await rootFor({ "tsconfig.json": tsconfig({ "~/*": ["./*"] }) }, ["src"])).toBe("src")
  })

  it("reports a config it can't parse instead of guessing silently", async () => {
    const found = await findAliasRoot(await project({ "tsconfig.json": "{ not json" }))
    expect(found).toEqual({ root: "", problem: "tsconfig.json could not be read as JSON." })
  })
})

describe("readAliasRoot: extends", () => {
  it("reads @/* from a config it extends", async () => {
    const root = await rootFor(
      {
        "tsconfig.base.json": tsconfig({ "@/*": ["./*"] }),
        "tsconfig.json": JSON.stringify({ extends: "./tsconfig.base.json" }),
      },
      ["src"]
    )
    // `./*` from the base, not the src/ guess.
    expect(root).toBe("")
  })

  it("resolves an inherited mapping from the config that declares it", async () => {
    // TypeScript reads the mapping relative to configs/deep/, where it is
    // written, not the project root: `../../app/src/*` is app/src from there.
    const root = await rootFor({
      "configs/deep/base.json": tsconfig({ "@/*": ["../../app/src/*"] }),
      "tsconfig.json": JSON.stringify({ extends: "./configs/deep/base.json" }),
    })
    expect(root).toBe("app/src")
  })

  it("resolves an inherited baseUrl from the config that sets it", async () => {
    const root = await rootFor({
      "configs/base.json": tsconfig({ "@/*": ["./src/*"] }, ".."),
      "tsconfig.json": JSON.stringify({ extends: "./configs/base" }),
    })
    expect(root).toBe("src")
  })

  it("lets the extending config override the inherited mapping", async () => {
    const root = await rootFor({
      "base.json": tsconfig({ "@/*": ["./lib/*"] }),
      "tsconfig.json": JSON.stringify({ extends: "./base.json", compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    })
    expect(root).toBe("src")
  })

  it("treats an extending config's paths as replacing the inherited ones", async () => {
    // tsc does not merge `paths`: here the base's @/* no longer applies.
    const root = await rootFor(
      {
        "base.json": tsconfig({ "@/*": ["./*"] }),
        "tsconfig.json": JSON.stringify({ extends: "./base.json", compilerOptions: { paths: { "~/*": ["./*"] } } }),
      },
      ["src"]
    )
    expect(root).toBe("src")
  })

  it("follows a package extends, as monorepo shared configs use", async () => {
    const root = await rootFor({
      "node_modules/@repo/typescript-config/package.json": '{ "name": "@repo/typescript-config" }',
      "node_modules/@repo/typescript-config/nextjs.json": tsconfig({ "@/*": ["../../../src/*"] }),
      "tsconfig.json": JSON.stringify({ extends: "@repo/typescript-config/nextjs.json" }),
    })
    expect(root).toBe("src")
  })

  it("takes the last entry of an array extends first, as TypeScript does", async () => {
    const root = await rootFor({
      "a.json": tsconfig({ "@/*": ["./a/*"] }),
      "b.json": tsconfig({ "@/*": ["./b/*"] }),
      "tsconfig.json": JSON.stringify({ extends: ["./a.json", "./b.json"] }),
    })
    expect(root).toBe("b")
  })

  it("does not loop on a config that extends itself", async () => {
    const root = await rootFor(
      {
        "a.json": JSON.stringify({ extends: "./tsconfig.json" }),
        "tsconfig.json": JSON.stringify({ extends: "./a.json" }),
      },
      ["src"]
    )
    expect(root).toBe("src")
  })
})

describe("aliasToPath", () => {
  it("puts the alias under @/'s folder", () => {
    expect(aliasToPath("@/components", "src")).toBe("src/components")
    expect(aliasToPath("@/lib/utils", "src")).toBe("src/lib/utils")
  })

  it("puts the alias at the project root when @/ is the root", () => {
    expect(aliasToPath("@/components", "")).toBe("components")
  })

  it("keeps a 0.3.3 alias where that release put its files", () => {
    // 0.3.3 stored `@/src/components` and wrote to src/src/components; an
    // existing install keeps landing beside the files it already has.
    expect(aliasToPath("@/src/components", "src")).toBe("src/src/components")
  })
})

describe("pathToAlias", () => {
  it("drops @/'s folder from a prompt answer", () => {
    expect(pathToAlias("src/components", "src")).toBe("@/components")
    expect(pathToAlias("./src/lib/utils/", "src")).toBe("@/lib/utils")
  })

  it("keeps the whole answer when @/ is the project root", () => {
    expect(pathToAlias("components", "")).toBe("@/components")
    expect(pathToAlias("src/components", "")).toBe("@/src/components")
  })

  it("keeps an answer that is already an alias", () => {
    expect(pathToAlias("@/components", "src")).toBe("@/components")
  })

  it("round-trips through aliasToPath", () => {
    for (const [answer, root] of [
      ["src/components", "src"],
      ["components", ""],
      ["app/ui", ""],
    ]) {
      expect(aliasToPath(pathToAlias(answer, root), root)).toBe(answer)
    }
  })
})

describe("readAliasRoot", () => {
  it("prefers tsconfig.json", async () => {
    const dir = await project({ "tsconfig.json": tsconfig({ "@/*": ["./*"] }) }, ["src"])
    expect(await readAliasRoot(dir)).toBe("")
  })

  it("falls back to jsconfig.json", async () => {
    const dir = await project({ "jsconfig.json": tsconfig({ "@/*": ["./src/*"] }) })
    expect(await readAliasRoot(dir)).toBe("src")
  })

  it("guesses from the src/ folder when no config maps @/*", async () => {
    expect(await readAliasRoot(await project({}, ["src"]))).toBe("src")
    expect(await readAliasRoot(await project({}))).toBe("")
  })
})

describe("resolveInsideProject", () => {
  it("returns the absolute path for a path inside the project", async () => {
    const dir = await project({}, ["src"])
    expect(await resolveInsideProject(dir, "src/components/ui")).toBe(path.join(dir, "src/components/ui"))
    expect(await resolveInsideProject(dir, "components")).toBe(path.join(dir, "components"))
  })

  it("refuses a mapping that climbs out with ..", async () => {
    const dir = await project({ "tsconfig.json": tsconfig({ "@/*": ["../../other-project/*"] }) })
    const root = await readAliasRoot(dir)
    expect(root).toBe("../../other-project")
    await expect(resolveInsideProject(dir, aliasToPath("@/components", root))).rejects.toThrow(UnsafePathError)
  })

  it("refuses an alias in components.json that climbs out", async () => {
    const dir = await project({}, ["src"])
    await expect(resolveInsideProject(dir, aliasToPath("@/../../etc", "src"))).rejects.toThrow(UnsafePathError)
  })

  it("refuses a folder inside the project that is a symlink to outside it", async () => {
    const dir = await project({}, ["src"])
    const outside = await tempDir()
    await fs.symlink(outside, path.join(dir, "src/components"))
    await expect(resolveInsideProject(dir, "src/components/ui/badge.tsx")).rejects.toThrow(UnsafePathError)
  })

  it("refuses to overwrite a file that is a symlink to outside the project", async () => {
    // `add --overwrite` writes through an existing file; a symlinked one would
    // replace the file it points at.
    const dir = await project({}, ["components/ui"])
    const outside = await tempDir()
    await fs.writeFile(path.join(outside, "victim.tsx"), "keep me")
    await fs.symlink(path.join(outside, "victim.tsx"), path.join(dir, "components/ui/badge.tsx"))
    await expect(resolveInsideProject(dir, "components/ui/badge.tsx")).rejects.toThrow(UnsafePathError)
  })
})

describe("temp folder cleanup", () => {
  let made: string
  it("makes a temp project", async () => {
    made = await project({ "tsconfig.json": "{}" }, ["src"])
    expect(await fs.pathExists(made)).toBe(true)
  })

  it("has removed it before the next test runs", async () => {
    expect(await fs.pathExists(made)).toBe(false)
  })
})

describe("findAliasRoot: package extends", () => {
  const pkg = (name: string, manifest: object, files: Record<string, string>) =>
    Object.fromEntries([
      [`node_modules/${name}/package.json`, JSON.stringify({ name, ...manifest })],
      ...Object.entries(files).map(([f, text]) => [`node_modules/${name}/${f}`, text]),
    ])
  // Each shared config maps @/* to <project>/app/src, via baseUrl.
  const shared = tsconfig({ "@/*": ["./app/src/*"] }, "../../..")

  it("reads a bare package's tsconfig field", async () => {
    const found = await findAliasRoot(
      await project({
        ...pkg("@repo/tsconfig", { main: "index.js", tsconfig: "base.json" }, { "index.js": "", "base.json": shared }),
        "tsconfig.json": JSON.stringify({ extends: "@repo/tsconfig" }),
      })
    )
    expect(found).toEqual({ root: "app/src" })
  })

  it("reads a bare package's tsconfig.json when it has no tsconfig field", async () => {
    const found = await findAliasRoot(
      await project({
        ...pkg("shared-config", {}, { "tsconfig.json": tsconfig({ "@/*": ["./app/src/*"] }, "../..") }),
        "tsconfig.json": JSON.stringify({ extends: "shared-config" }),
      })
    )
    expect(found).toEqual({ root: "app/src" })
  })

  it("adds .json to a subpath, and never picks a .js file of the same name", async () => {
    const found = await findAliasRoot(
      await project({
        ...pkg("@repo/tsconfig", {}, { "nextjs.js": "module.exports = {}", "nextjs.json": shared }),
        "tsconfig.json": JSON.stringify({ extends: "@repo/tsconfig/nextjs" }),
      })
    )
    expect(found).toEqual({ root: "app/src" })
  })

  it("follows a JSON file the package's exports map", async () => {
    const found = await findAliasRoot(
      await project({
        ...pkg("@repo/tsconfig", { exports: { "./nextjs": "./configs/next.json" } }, { "configs/next.json": tsconfig({ "@/*": ["./app/src/*"] }, "../../../..") }),
        "tsconfig.json": JSON.stringify({ extends: "@repo/tsconfig/nextjs" }),
      })
    )
    expect(found).toEqual({ root: "app/src" })
  })

  it("reports a JSON file the package's exports leave out, as tsc does", async () => {
    // tsc 5.9: error TS6053: File '@repo/tsconfig/nextjs.json' not found.
    const found = await findAliasRoot(
      await project(
        {
          ...pkg("@repo/tsconfig", { exports: { ".": "./index.js" } }, { "index.js": "", "nextjs.json": shared }),
          "tsconfig.json": JSON.stringify({ extends: "@repo/tsconfig/nextjs.json" }),
        },
        ["src"]
      )
    )
    expect(found).toEqual({
      root: "src",
      problem: 'tsconfig.json extends "@repo/tsconfig/nextjs.json", which could not be found.',
    })
  })

  it("reports a package that isn't installed, naming the config that extends it", async () => {
    const found = await findAliasRoot(
      await project({
        "configs/base.json": JSON.stringify({ extends: "@repo/missing/base.json" }),
        "tsconfig.json": JSON.stringify({ extends: "./configs/base.json" }),
      })
    )
    expect(found.problem).toBe('configs/base.json extends "@repo/missing/base.json", which could not be found.')
  })

  it("needs nothing from an unreadable parent when the project sets paths and baseUrl itself", async () => {
    const found = await findAliasRoot(
      await project({
        "tsconfig.json": JSON.stringify({
          extends: "@repo/missing",
          compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
        }),
      })
    )
    expect(found).toEqual({ root: "src" })
  })

  it("reports an unreadable parent that could still set baseUrl", async () => {
    const found = await findAliasRoot(
      await project({
        "tsconfig.json": JSON.stringify({ extends: "@repo/missing", compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
      })
    )
    expect(found.problem).toMatch(/extends "@repo\/missing"/)
  })
})

describe("chooseAliasRoot", () => {
  const unreadable = () => project({ "tsconfig.json": JSON.stringify({ extends: "@repo/missing" }) }, ["src"])

  it("uses a readable config without asking", async () => {
    const dir = await project({ "tsconfig.json": tsconfig({ "@/*": ["./*"] }) })
    const ask = vi.fn()
    expect(await chooseAliasRoot(dir, { yes: false, ask })).toBe("")
    expect(ask).not.toHaveBeenCalled()
  })

  it("stops a --yes run instead of guessing", async () => {
    const ask = vi.fn()
    await expect(chooseAliasRoot(await unreadable(), { yes: true, ask })).rejects.toThrow(UnknownAliasRootError)
    await expect(chooseAliasRoot(await unreadable(), { yes: true, ask })).rejects.toThrow(/without --yes/)
    expect(ask).not.toHaveBeenCalled()
  })

  it("asks an interactive run, offering the guess, and uses the answer", async () => {
    const ask = vi.fn(async () => "./app/src/")
    expect(await chooseAliasRoot(await unreadable(), { yes: false, ask })).toBe("app/src")
    expect(ask).toHaveBeenCalledWith('tsconfig.json extends "@repo/missing", which could not be found.', "src")
  })

  it("reads an answer of . as the project root", async () => {
    expect(await chooseAliasRoot(await unreadable(), { yes: false, ask: async () => "." })).toBe("")
  })

  it("stops when the question is cancelled", async () => {
    await expect(chooseAliasRoot(await unreadable(), { yes: false, ask: async () => undefined })).rejects.toThrow("Cancelled.")
  })
})

describe("never writing through a symlink", () => {
  it("refuses a destination that is a symlink to a missing file outside the project", async () => {
    // Greptile's case: pathExists says the link is absent, the write follows it.
    const dir = await project({}, ["components/ui"])
    const outside = await tempDir()
    await fs.symlink(path.join(outside, "planted.tsx"), path.join(dir, "components/ui/badge.tsx"))
    await expect(resolveWritableFile(dir, "components/ui/badge.tsx")).rejects.toThrow(UnsafePathError)
    await expect(resolveInsideProject(dir, "components/ui/badge.tsx")).rejects.toThrow(UnsafePathError)
    expect(await fs.pathExists(path.join(outside, "planted.tsx"))).toBe(false)
  })

  it("refuses a destination that is a symlink even when it points inside the project", async () => {
    const dir = await project({ "shared/badge.tsx": "mine" }, ["components/ui"])
    await fs.symlink(path.join(dir, "shared/badge.tsx"), path.join(dir, "components/ui/badge.tsx"))
    await expect(resolveWritableFile(dir, "components/ui/badge.tsx")).rejects.toThrow(/is a symlink/)
  })

  it("refuses a folder on the way that is a dangling symlink", async () => {
    const dir = await project({}, ["components"])
    const outside = await tempDir()
    await fs.symlink(path.join(outside, "gone"), path.join(dir, "components/ui"))
    await expect(resolveWritableFile(dir, "components/ui/badge.tsx")).rejects.toThrow(/does not exist/)
  })

  it("accepts a plain file or a new one", async () => {
    const dir = await project({ "components/ui/badge.tsx": "old" })
    expect(await resolveWritableFile(dir, "components/ui/badge.tsx")).toBe(path.join(dir, "components/ui/badge.tsx"))
    expect(await resolveWritableFile(dir, "components/ui/new.tsx")).toBe(path.join(dir, "components/ui/new.tsx"))
  })

  it.skipIf(process.platform === "win32")("fails the write itself if a symlink appears after the check", async () => {
    const dir = await project({}, ["components"])
    const outside = await tempDir()
    await fs.symlink(path.join(outside, "planted.tsx"), path.join(dir, "components/badge.tsx"))
    await expect(writeFileNoFollow(path.join(dir, "components/badge.tsx"), "x")).rejects.toMatchObject({ code: "ELOOP" })
    expect(await fs.pathExists(path.join(outside, "planted.tsx"))).toBe(false)
  })
})

describe("writeFileNoFollow file modes", () => {
  // The umask can't be changed inside a vitest worker, and at the usual 022
  // 0o644 and 0o666 give the same file, so write from a child process under a
  // shared-project umask, where they differ.
  const hasBun = (() => {
    try {
      execFileSync("bun", ["--version"], { stdio: "ignore" })
      return true
    } catch {
      return false
    }
  })()

  it.skipIf(process.platform === "win32" || !hasBun)("gives a new file the mode fs.writeFile would, under the umask", async () => {
    const dir = await tempDir()
    const paths = path.resolve(__dirname, "paths.ts")
    const script = `
      import fs from "fs"
      import { writeFileNoFollow } from ${JSON.stringify(paths)}
      await writeFileNoFollow(${JSON.stringify(path.join(dir, "ours.tsx"))}, "x")
      fs.writeFileSync(${JSON.stringify(path.join(dir, "plain.tsx"))}, "x")
    `
    execFileSync("sh", ["-c", 'umask 002 && exec bun -e "$0"', script])
    const mode = async (f: string) => (await fs.stat(path.join(dir, f))).mode & 0o777
    expect(await mode("plain.tsx")).toBe(0o664)
    expect(await mode("ours.tsx")).toBe(0o664)
  })

  it.skipIf(process.platform === "win32")("keeps the mode of a file it overwrites", async () => {
    const dir = await project({ "badge.tsx": "old" })
    await fs.chmod(path.join(dir, "badge.tsx"), 0o600)
    await writeFileNoFollow(path.join(dir, "badge.tsx"), "new")
    expect((await fs.stat(path.join(dir, "badge.tsx"))).mode & 0o777).toBe(0o600)
    expect(await fs.readFile(path.join(dir, "badge.tsx"), "utf8")).toBe("new")
  })
})
