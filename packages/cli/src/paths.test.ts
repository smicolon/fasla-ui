import { describe, it, expect } from "vitest"
import fs from "fs-extra"
import os from "os"
import path from "path"
import { aliasToPath, parseAliasRoot, pathToAlias, readAliasRoot } from "./paths"

const tsconfig = (paths: Record<string, string[]>, baseUrl?: string) =>
  JSON.stringify({ compilerOptions: { ...(baseUrl ? { baseUrl } : {}), paths } })

describe("parseAliasRoot", () => {
  it("reads a src/ mapping", () => {
    expect(parseAliasRoot(tsconfig({ "@/*": ["./src/*"] }))).toBe("src")
  })

  it("reads a project-root mapping as the empty string", () => {
    expect(parseAliasRoot(tsconfig({ "@/*": ["./*"] }))).toBe("")
  })

  it("resolves the mapping against baseUrl", () => {
    expect(parseAliasRoot(tsconfig({ "@/*": ["*"] }, "src"))).toBe("src")
    expect(parseAliasRoot(tsconfig({ "@/*": ["./src/*"] }, "./"))).toBe("src")
  })

  it("accepts comments and trailing commas, and leaves // inside strings", () => {
    const text = `{
      "$schema": "https://json.schemastore.org/tsconfig",
      // Next.js writes this one
      "compilerOptions": {
        /* aliases */
        "paths": { "@/*": ["./src/*"], },
      },
    }`
    expect(parseAliasRoot(text)).toBe("src")
  })

  it("is undefined when there is no @/* path or the file doesn't parse", () => {
    expect(parseAliasRoot(tsconfig({ "~/*": ["./src/*"] }))).toBeUndefined()
    expect(parseAliasRoot("{ not json")).toBeUndefined()
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
  async function project(files: Record<string, string>, dirs: string[] = []) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-cli-"))
    for (const d of dirs) await fs.ensureDir(path.join(dir, d))
    for (const [name, text] of Object.entries(files)) await fs.writeFile(path.join(dir, name), text)
    return dir
  }

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
