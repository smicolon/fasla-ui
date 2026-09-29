import { afterEach, describe, it, expect } from "vitest"
import fs from "fs-extra"
import os from "os"
import path from "path"
import {
  aliasToPath,
  OutsideProjectError,
  pathToAlias,
  readAliasRoot,
  resolveInsideProject,
} from "./paths"

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
    expect(await rootFor({ "tsconfig.json": "{ not json" })).toBe("")
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
    await expect(resolveInsideProject(dir, aliasToPath("@/components", root))).rejects.toThrow(OutsideProjectError)
  })

  it("refuses an alias in components.json that climbs out", async () => {
    const dir = await project({}, ["src"])
    await expect(resolveInsideProject(dir, aliasToPath("@/../../etc", "src"))).rejects.toThrow(OutsideProjectError)
  })

  it("refuses a folder inside the project that is a symlink to outside it", async () => {
    const dir = await project({}, ["src"])
    const outside = await tempDir()
    await fs.symlink(outside, path.join(dir, "src/components"))
    await expect(resolveInsideProject(dir, "src/components/ui/badge.tsx")).rejects.toThrow(OutsideProjectError)
  })

  it("refuses to overwrite a file that is a symlink to outside the project", async () => {
    // `add --overwrite` writes through an existing file; a symlinked one would
    // replace the file it points at.
    const dir = await project({}, ["components/ui"])
    const outside = await tempDir()
    await fs.writeFile(path.join(outside, "victim.tsx"), "keep me")
    await fs.symlink(path.join(outside, "victim.tsx"), path.join(dir, "components/ui/badge.tsx"))
    await expect(resolveInsideProject(dir, "components/ui/badge.tsx")).rejects.toThrow(OutsideProjectError)
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
