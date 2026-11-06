/**
 * The CLI as an agent runs it: the built bundle as a child process, stdin
 * closed (not a terminal), against a fixture project and a registry served
 * from this machine. Nothing here touches the network or installs a package:
 * `--no-install` prints the commands, and the fixture lists the packages the
 * button needs.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { spawn } from "child_process"
import fs from "fs-extra"
import http from "http"
import type { AddressInfo } from "net"
import os from "os"
import path from "path"
import { build } from "tsup"
import { fileURLToPath } from "url"

const BUTTON = `// From Fasla UI (@fasla/button): https://fasla.smicolon.com\nimport { cn } from "@/lib/utils"\nexport const Button = () => cn("b")\n`
const items = [{ name: "button", type: "registry:ui", files: [{ path: "registry/ui/button/button.tsx", type: "registry:ui", target: "", content: BUTTON }] }]

let pkgDir: string
let bundleDir: string
let server: http.Server
let registryUrl: string
const fixtures: string[] = []

beforeAll(async () => {
  // The CLI reads its version from ../../package.json, so it is bundled into a
  // package-shaped folder: <pkg>/dist/cli/index.js beside <pkg>/package.json.
  pkgDir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-bundle-"))
  bundleDir = path.join(pkgDir, "dist/cli")
  await fs.ensureDir(bundleDir)
  await fs.writeJson(path.join(pkgDir, "package.json"), { name: "@smicolon/fasla-ui", version: "0.0.0-test" })
  const root = fileURLToPath(new URL("../..", import.meta.url))
  await build({
    config: false,
    silent: true,
    entry: { index: path.join(root, "src/cli/index.ts") },
    outDir: bundleDir,
    format: ["esm"],
    platform: "node",
    target: "node18",
    noExternal: [/.*/],
    shims: true,
    splitting: false,
    banner: { js: 'import { createRequire as __r } from "node:module"\nconst require = __r(import.meta.url)' },
  })
  server = http.createServer((req, res) => {
    const name = (req.url ?? "").replace(/^\//, "").replace(/\.json$/, "")
    const body = name === "registry" ? { name: "fasla", homepage: "", items: items.map(({ files, ...item }) => item) } : items.find((i) => i.name === name)
    res.writeHead(body ? 200 : 404, { "content-type": "application/json" })
    res.end(JSON.stringify(body ?? {}))
  })
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  registryUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
}, 60_000)

afterAll(async () => {
  await new Promise((resolve) => server?.close(resolve))
  await fs.remove(pkgDir)
  await Promise.all(fixtures.map((dir) => fs.remove(dir)))
})

/** create-next-app's shape: src dir, @/* → src/*, Tailwind 4, Geist under --font-geist-sans. */
async function fixture() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fasla-int-"))
  fixtures.push(dir)
  const files: Record<string, string> = {
    "package.json": JSON.stringify({
      dependencies: { next: "16.4.5", react: "19.3.0", clsx: "^2", "tailwind-merge": "^3", "class-variance-authority": "^0.7", "lucide-react": "^1", "@radix-ui/react-slot": "^1" },
      devDependencies: { tailwindcss: "^4" },
    }),
    "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    "src/app/globals.css": '@import "tailwindcss";\n:root { --background: #ffffff; }\n',
    "src/app/layout.tsx": 'const geistSans = Geist({ variable: "--font-geist-sans" })\nexport default function L() { return <html className={geistSans.variable} /> }\n',
  }
  for (const [name, text] of Object.entries(files)) {
    await fs.ensureDir(path.dirname(path.join(dir, name)))
    await fs.writeFile(path.join(dir, name), text)
  }
  return dir
}

/** Runs the bundle with stdin closed, as an agent's shell does. Fails the test if it hangs. */
function cli(cwd: string, ...args: string[]): Promise<{ code: number | null; out: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(bundleDir, "index.js"), ...args], {
      cwd,
      env: { ...process.env, FASLA_UI_REGISTRY_URL: registryUrl, NO_COLOR: "1", FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    })
    let out = ""
    child.stdout.on("data", (chunk) => (out += chunk))
    child.stderr.on("data", (chunk) => (out += chunk))
    const timer = setTimeout(() => {
      child.kill()
      reject(new Error(`hung with no terminal: ${args.join(" ")}\n${out}`))
    }, 20_000)
    child.on("close", (code) => {
      clearTimeout(timer)
      resolve({ code, out })
    })
  })
}

describe("the CLI with no terminal", () => {
  it("init with no flags exits 1 at once, lists the flags, and writes nothing", async () => {
    const dir = await fixture()
    const { code, out } = await cli(dir, "init")
    expect(code).toBe(1)
    expect(out).toContain("--path <dir>")
    expect(out).toContain("--style <default|new-york>")
    expect(out).toContain("--theme <fasla|brand>")
    expect(out).toContain("--yes")
    expect(await fs.pathExists(path.join(dir, "components.json"))).toBe(false)
  }, 30_000)

  it("init with the flags, then add button: files land where the printed imports say", async () => {
    const dir = await fixture()
    const init = await cli(dir, "init", "--path", "src/components/ui", "--style", "new-york", "--theme", "brand", "--no-install")
    expect(init.code).toBe(0)
    const config = await fs.readJson(path.join(dir, "components.json"))
    expect(config.style).toBe("new-york")
    expect(config.aliases).toMatchObject({ components: "@/components", ui: "@/components/ui", utils: "@/lib/utils" })
    expect(init.out).toContain("What init did:")
    expect(init.out).toMatch(/created\s+components\.json/)
    expect(init.out).toMatch(/created\s+src\/lib\/utils\.ts/)
    expect(init.out).toContain("add button --yes")

    const add = await cli(dir, "add", "button", "--yes", "--no-install")
    expect(add.code).toBe(0)
    expect(add.out).toContain('from "@/components/ui/button"')
    expect(add.out).not.toContain("ui/ui")
    expect(await fs.pathExists(path.join(dir, "src/components/ui/button.tsx"))).toBe(true)
    expect(await fs.pathExists(path.join(dir, "src/components/ui/ui"))).toBe(false)
  }, 60_000)

  it("init --yes takes the defaults, and add without --yes exits 1 instead of stopping silently", async () => {
    const dir = await fixture()
    const init = await cli(dir, "init", "--yes", "--theme", "brand", "--no-install")
    expect(init.code).toBe(0)
    expect((await fs.readJson(path.join(dir, "components.json"))).aliases.components).toBe("@/components")
    const add = await cli(dir, "add", "button")
    expect(add.code).toBe(1)
    expect(add.out).toContain("Pass --yes")
    expect(await fs.pathExists(path.join(dir, "src/components/ui/button.tsx"))).toBe(false)
  }, 60_000)
})
