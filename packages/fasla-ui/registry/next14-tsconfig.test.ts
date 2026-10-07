// @vitest-environment node
import { describe, it, expect } from "vitest"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import ts from "typescript"

const registry = __dirname

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(entry.name) && !/\.(test|stories)\.tsx?$/.test(entry.name) ? [path] : []
  })
}

// The compiler options create-next-app@14 writes. It sets no target, so
// TypeScript falls back to ES5, and syntax that needs ES2015 or later (a u
// flag on a regex literal, for one) fails `next build`.
const next14 = {
  lib: ["lib.dom.d.ts", "lib.dom.iterable.d.ts", "lib.esnext.d.ts"],
  allowJs: true,
  skipLibCheck: true,
  strict: true,
  noEmit: true,
  esModuleInterop: true,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  resolveJsonModule: true,
  isolatedModules: true,
  jsx: ts.JsxEmit.Preserve,
}

describe("registry under a Next.js 14 tsconfig", () => {
  it("type-checks with no target set", () => {
    const program = ts.createProgram(sourceFiles(registry), next14)
    const errors = ts.getPreEmitDiagnostics(program).map((d) => {
      const where = d.file ? `${d.file.fileName.replace(registry, "registry")}:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : ""
      return `${where} TS${d.code} ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`
    })
    expect(errors).toEqual([])
  }, 60_000)
})
