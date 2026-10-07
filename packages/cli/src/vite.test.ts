import { afterEach, describe, expect, it } from "vitest"
import fs from "fs-extra"
import os from "os"
import path from "path"
import { viteAliasAdvice, viteConfigHasAlias } from "./vite"

const tempDirs: string[] = []
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

async function project(files: Record<string, string>) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-vite-"))
  tempDirs.push(dir)
  for (const [name, text] of Object.entries(files)) await fs.writeFile(path.join(dir, name), text)
  return dir
}

// What `npm create vite -- --template react-ts` writes today.
const TEMPLATE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
`
const viteTemplate = (extra: Record<string, string> = {}) =>
  project({
    "vite.config.ts": TEMPLATE_CONFIG,
    "tsconfig.json": JSON.stringify({ files: [], references: [{ path: "./tsconfig.app.json" }, { path: "./tsconfig.node.json" }] }),
    "tsconfig.app.json": JSON.stringify({ compilerOptions: { target: "ES2022" }, include: ["src"] }),
    "package.json": JSON.stringify({ devDependencies: { vite: "^8" } }),
    ...extra,
  })

describe("viteConfigHasAlias", () => {
  it("sees an @ alias written as an object key or a find: entry", () => {
    expect(viteConfigHasAlias(`resolve: { alias: { "@": path.resolve(__dirname, "./src") } }`)).toBe(true)
    expect(viteConfigHasAlias(`resolve: { alias: { '@/': '/src/' } }`)).toBe(true)
    expect(viteConfigHasAlias("resolve: { alias: [{ find: `@`, replacement: src }] }")).toBe(true)
  })

  it("does not count a package scope or an email as an alias", () => {
    expect(viteConfigHasAlias(TEMPLATE_CONFIG)).toBe(false)
    expect(viteConfigHasAlias(`import x from "@vitejs/plugin-react" // dev@example.com`)).toBe(false)
  })
})

describe("viteAliasAdvice", () => {
  it("prints both halves for a fresh Vite app, naming the files it has", async () => {
    const advice = (await viteAliasAdvice(await viteTemplate(), { root: "src", mapped: false, pm: "bun" }))!.join("\n")
    expect(advice).toContain('"@/" is not set up in this Vite app')
    expect(advice).toContain('In tsconfig.json and tsconfig.app.json, inside "compilerOptions"')
    expect(advice).toContain('"paths": { "@/*": ["./src/*"] }')
    // TypeScript 6 rejects baseUrl, so the advice never adds it.
    expect(advice).not.toContain("baseUrl")
    expect(advice).toContain("In vite.config.ts, import path and add resolve.alias")
    expect(advice).toContain('resolve: { alias: { "@": path.resolve(__dirname, "./src") } },')
    expect(advice).toContain("bun add -d @types/node")
  })

  it("leaves out @types/node when package.json already has it", async () => {
    const dir = await viteTemplate({ "package.json": JSON.stringify({ devDependencies: { "@types/node": "^24" } }) })
    const advice = (await viteAliasAdvice(dir, { root: "src", mapped: false, pm: "npm" }))!.join("\n")
    expect(advice).not.toContain("@types/node")
  })

  it("asks only for the vite.config half when the tsconfig maps @/ already", async () => {
    const advice = (await viteAliasAdvice(await viteTemplate(), { root: "src", mapped: true, pm: "pnpm" }))!.join("\n")
    expect(advice).toContain("mapped in the tsconfig but not in vite.config.ts")
    expect(advice).not.toContain('"paths"')
    expect(advice).toContain("1. In vite.config.ts")
    expect(advice).toContain("pnpm add -D @types/node")
  })

  it("asks only for the tsconfig half when vite.config has the alias", async () => {
    const dir = await viteTemplate({ "vite.config.ts": `export default defineConfig({ resolve: { alias: { "@": "/src" } } })` })
    const advice = (await viteAliasAdvice(dir, { root: "src", mapped: false, pm: "npm" }))!.join("\n")
    expect(advice).toContain('"paths": { "@/*": ["./src/*"] }')
    expect(advice).not.toContain("resolve.alias")
  })

  it("says nothing once both halves are there", async () => {
    const dir = await viteTemplate({ "vite.config.mjs": `export default { resolve: { alias: { "@": "/src" } } }` })
    await fs.remove(path.join(dir, "vite.config.ts"))
    expect(await viteAliasAdvice(dir, { root: "src", mapped: true, pm: "npm" })).toBeUndefined()
  })

  it("says nothing outside a Vite app", async () => {
    const dir = await project({ "tsconfig.json": "{}", "next.config.ts": "" })
    expect(await viteAliasAdvice(dir, { root: "", mapped: false, pm: "npm" })).toBeUndefined()
  })

  it("points the alias at the project root when there is no src/ folder", async () => {
    const dir = await project({ "vite.config.js": "export default {}", "tsconfig.json": "{}" })
    const advice = (await viteAliasAdvice(dir, { root: "", mapped: false, pm: "npm" }))!.join("\n")
    expect(advice).toContain('"paths": { "@/*": ["./*"] }')
    expect(advice).toContain('path.resolve(__dirname, ".")')
    expect(advice).toContain("In tsconfig.json, inside")
  })
})
