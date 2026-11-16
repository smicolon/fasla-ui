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

// The compiler options of create-vite's react-ts template (tsconfig.app.json,
// create-vite with Vite 8 and TypeScript 7), which its `build` script checks
// with `tsc -b` before `vite build`. `types` lists only vite/client, so Node's
// globals, `process` among them, are not declared: a component that names
// `process` fails the template's build. `strict` is TypeScript 7's default.
const viteApp = {
  target: ts.ScriptTarget.ES2023,
  lib: ["lib.es2023.d.ts", "lib.dom.d.ts"],
  module: ts.ModuleKind.ESNext,
  types: ["vite/client"],
  allowArbitraryExtensions: true,
  skipLibCheck: true,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  allowImportingTsExtensions: true,
  verbatimModuleSyntax: true,
  moduleDetection: ts.ModuleDetectionKind.Force,
  noEmit: true,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  erasableSyntaxOnly: true,
  noFallthroughCasesInSwitch: true,
}

describe("registry under the Vite react-ts tsconfig", () => {
  it("type-checks without Node's types", () => {
    const program = ts.createProgram(sourceFiles(registry), viteApp)
    const errors = ts.getPreEmitDiagnostics(program).map((d) => {
      const where = d.file ? `${d.file.fileName.replace(registry, "registry")}:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : ""
      return `${where} TS${d.code} ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`
    })
    expect(errors).toEqual([])
  }, 60_000)
})
