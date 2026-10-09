import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { installCommand, nextTabIndex, PACKAGE_MANAGERS, runCommand, shadcnAdd, wrapPieces } from "../lib/package-managers.ts"

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")

function sourceFiles(dir) {
  return readdirSync(path.join(docsRoot, dir)).flatMap((name) => {
    const rel = path.join(dir, name)
    if (statSync(path.join(docsRoot, rel)).isDirectory()) return sourceFiles(rel)
    return /\.(tsx?|mdx)$/.test(name) ? [rel] : []
  })
}

describe("Package manager commands", () => {
  test("spell an install the way each package manager takes it, in tab order", () => {
    expect(PACKAGE_MANAGERS).toEqual(["npm", "pnpm", "yarn", "bun"])
    expect(PACKAGE_MANAGERS.map((pm) => installCommand(pm, "clsx tailwind-merge"))).toEqual([
      "npm install clsx tailwind-merge",
      "pnpm add clsx tailwind-merge",
      "yarn add clsx tailwind-merge",
      "bun add clsx tailwind-merge",
    ])
  })
})

describe("Package manager run commands", () => {
  test("run a package without installing it, the way each package manager does", () => {
    expect(PACKAGE_MANAGERS.map((pm) => runCommand(pm, "shadcn@latest add @fasla/theme"))).toEqual([
      "npx shadcn@latest add @fasla/theme",
      "pnpm dlx shadcn@latest add @fasla/theme",
      "yarn dlx shadcn@latest add @fasla/theme",
      "bunx --bun shadcn@latest add @fasla/theme",
    ])
  })
})

describe("Package manager tabs keyboard", () => {
  test("arrows move with the layout left to right, wrapping at the ends", () => {
    expect(nextTabIndex(0, "ArrowRight", 4, false)).toBe(1)
    expect(nextTabIndex(3, "ArrowRight", 4, false)).toBe(0)
    expect(nextTabIndex(0, "ArrowLeft", 4, false)).toBe(3)
  })

  test("arrows move with the layout right to left, where the first tab is on the right", () => {
    expect(nextTabIndex(0, "ArrowLeft", 4, true)).toBe(1)
    expect(nextTabIndex(1, "ArrowRight", 4, true)).toBe(0)
    expect(nextTabIndex(0, "ArrowRight", 4, true)).toBe(3)
  })

  test("Home and End go to the first and last tab in either direction, other keys do nothing", () => {
    for (const rtl of [false, true]) {
      expect(nextTabIndex(2, "Home", 4, rtl)).toBe(0)
      expect(nextTabIndex(0, "End", 4, rtl)).toBe(3)
      expect(nextTabIndex(1, "Enter", 4, rtl)).toBeUndefined()
    }
  })
})

describe("Package manager tabs markup", () => {
  const tabs = read("components/package-manager-tabs.tsx")

  test("is a labelled tab list whose command stays left to right", () => {
    expect(tabs).toContain('role="tablist"')
    expect(tabs).toContain('aria-label={t("packageManager")}')
    expect(tabs).toContain('role="tab"')
    expect(tabs).toContain('role="tabpanel"')
    expect(tabs).toContain('<pre dir="ltr"')
    // The tab row itself is not pinned LTR, so it follows an Arabic page.
    expect(tabs).not.toMatch(/role="tablist"[^>]*dir=/)
    // Arrows read the row's direction: the tabs are .font-mono, which
    // globals.css pins to LTR inside RTL pages, so their own direction lies.
    expect(read("app/globals.css")).toMatch(/\[dir="rtl"\] \.font-mono \{\s*direction: ltr/)
    expect(tabs).toContain(`closest('[role="tablist"]')`)
  })

  test("labels the tab list in both locales", () => {
    expect(JSON.parse(read("messages/en.json")).docs.packageManager).toBe("Package manager")
    expect(JSON.parse(read("messages/ar.json")).docs.packageManager).toBe("مدير الحزم")
  })
})

describe("Install commands on the docs pages", () => {
  const pages = [...sourceFiles("app"), ...sourceFiles("components")].filter(
    (file) => !file.endsWith("package-manager-tabs.tsx")
  )

  test("never stack the same install for several package managers; the tabs do that", () => {
    const stacked = pages.filter((file) => {
      const text = read(file)
      return ["pnpm add ", "yarn add ", "bun add "].filter((cmd) => text.includes(cmd)).length > 0
    })
    expect(stacked).toEqual([])
  })

  test("show no npm-only install either; every install goes through the tabs", () => {
    const npmOnly = pages.filter((file) => /npm install /.test(read(file)))
    expect(npmOnly).toEqual([])
    expect(read("app/[locale]/docs/installation/page.tsx").match(/<PackageManagerTabs /g)).toHaveLength(7)
  })
})

describe("Theme section of the Installation page", () => {
  const page = read("app/[locale]/docs/installation/page.tsx")

  test("installs each layer through the tabs, Fasla's colours first", () => {
    const fasla = page.indexOf('<PackageManagerTabs run={shadcnAdd("theme", "font-geist")} />')
    const base = page.indexOf('<PackageManagerTabs run={shadcnAdd("theme-base")} />')
    expect(fasla).toBeGreaterThan(-1)
    expect(base).toBeGreaterThan(fasla)
    // The old manual Tailwind setup is gone.
    expect(page).not.toContain("tailwindSemanticColors")
  })

  test("says to set the project up first, before any shadcn command, in both languages", () => {
    // Without components.json, `shadcn add` runs its own setup and its
    // preset's colours replace Fasla's; on Next.js 14 that setup fails the build.
    const first = page.indexOf('i.rich("themeSetupFirst", rich)')
    expect(first).toBeGreaterThan(-1)
    expect(first).toBeLessThan(page.indexOf('shadcnAdd("theme", "font-geist")'))
    for (const lang of ["en", "ar"]) {
      const t = JSON.parse(read(`messages/${lang}.json`)).docs.installation
      expect(t.themeSetupFirst).toContain("<code>npx @smicolon/fasla-ui@latest init</code>")
      expect(t.themeSetupFirst).toContain("<code>npx shadcn@latest init</code>")
      expect(t.themeNext14).toContain("<code>npx @smicolon/fasla-ui@latest init</code>")
      expect(t.cliLegacy).toContain("<code>init</code>")
      expect(t.manualTailwind3).toContain("<code>tailwind-merge@^2</code>")
      expect(t.manualCopy).toContain("<code>https://ui.smicolon.com/r/button.json</code>")
    }
  })

  test("gives Next.js 14 a command that builds there: theme.json without Geist", () => {
    const note = page.indexOf('i.rich("themeNext14", rich)')
    expect(page.indexOf('<PackageManagerTabs run={shadcnAdd("theme")} />')).toBeGreaterThan(note)
  })

  test("shows the cn helper with Fasla's type sizes, as init writes it", () => {
    // Without them tailwind-merge reads `text-xxs` as a colour and drops the
    // `text-foreground` beside it: Avatar's initials at size 12 lose colour.
    const registryUtils = readFileSync(path.join(docsRoot, "../../packages/fasla-ui/src/lib/utils.ts"), "utf8")
    const config = registryUtils.match(/const twMerge = extendTailwindMerge\(\{[\s\S]*?\n\}\)/)[0]
    expect(page).toContain('import { extendTailwindMerge } from "tailwind-merge"')
    expect(page).toContain(config)
  })

  test("installs tailwind-merge 2 on Tailwind 3 in the manual install", () => {
    expect(page).toContain('<PackageManagerTabs packages="class-variance-authority clsx tailwind-merge@^2 framer-motion" />')
  })

  test("shows init's fallback install for Tailwind 3 as its own command, with tailwind-merge 2", () => {
    // The CLI prints tailwind-merge@^2 there; a reader copying the plain
    // command into a Tailwind 3 project would get 3, which drops `outline`.
    const plain = page.indexOf('<PackageManagerTabs packages="clsx tailwind-merge" />')
    const note = page.indexOf('i.rich("cliDepsTailwind3", rich)')
    const tw3 = page.indexOf('<PackageManagerTabs packages="clsx tailwind-merge@^2" />')
    expect(plain).toBeGreaterThan(-1)
    expect(note).toBeGreaterThan(plain)
    expect(tw3).toBeGreaterThan(note)
    for (const lang of ["en", "ar"]) {
      const t = JSON.parse(read(`messages/${lang}.json`)).docs.installation
      expect(t.cliDepsTailwind3).toContain("<code>tailwind-merge@^2</code>")
      // The general sentence no longer carries the Tailwind 3 version on its own.
      expect(t.cliDepsFallback).not.toContain("tailwind-merge@^2")
    }
  })

  test("writes shadcn commands with full registry URLs, which work without our init", () => {
    expect(shadcnAdd("theme", "font-geist")).toBe(
      "shadcn@latest add https://ui.smicolon.com/r/theme.json https://ui.smicolon.com/r/font-geist.json"
    )
    expect(runCommand("npm", shadcnAdd("theme-base"))).toBe("npx shadcn@latest add https://ui.smicolon.com/r/theme-base.json")
    // The @fasla namespace needs a components.json entry only our init writes.
    const offenders = [...sourceFiles("app"), ...sourceFiles("components"), ...sourceFiles("lib"), "messages/en.json", "messages/ar.json"].filter(
      (file) => read(file).includes("@fasla/")
    )
    expect(offenders).toEqual([])
  })

  test("says, in both languages, that Fasla's components replace shadcn's of the same name", () => {
    const en = JSON.parse(read("messages/en.json")).docs.installation
    const ar = JSON.parse(read("messages/ar.json")).docs.installation
    expect(en.themeReplaces).toContain("replace shadcn’s components of the same name")
    expect(ar.themeReplaces).toContain("تحل المكوّنات الأساسية في فاصلة محل مكوّنات shadcn/ui")
    for (const key of ["themeTitle", "themeBody", "themeFasla", "themeNext14", "themeBrand", "themeConfirm", "themeArabicFont", "themeReplaces"]) {
      expect(typeof en[key]).toBe("string")
      expect(typeof ar[key]).toBe("string")
    }
    // shadcn's own question defaults to No: both languages say to type y, and
    // that the base layer changes no colour the project has.
    for (const t of [en.themeConfirm, ar.themeConfirm]) {
      expect(t).toContain("<code>Existing CSS variables and components will be overwritten. Continue?</code>")
      expect(t).toContain("<code>y</code>")
      expect(t).toContain("<code>theme-base</code>")
    }
    expect(page.indexOf('i.rich("themeConfirm", rich)')).toBeGreaterThan(page.indexOf('shadcnAdd("theme-base")'))
    expect(en.themeArabicFont).toContain("<code>--font-arabic</code>")
    expect(ar.themeArabicFont).toContain("<code>--font-arabic</code>")
  })
})

describe("Command blocks", () => {
  // A long command — theme.json plus font-geist.json — ran past the block's
  // edge. Commands wrap at their spaces; overflow-wrap breaks a URL only when
  // it can't fit on a line of its own.
  const WRAP = "whitespace-pre-wrap break-words"

  test("wrap in the tabs, on the Installation page, and in bash code blocks", () => {
    expect(read("components/package-manager-tabs.tsx")).toContain(`<pre dir="ltr" className="${WRAP} p-4">`)
    const page = read("app/[locale]/docs/installation/page.tsx")
    expect(page.match(new RegExp(`<pre className="${WRAP} rounded-lg bg-terminal p-4">`, "g"))).toHaveLength(4)
    expect(read("components/component-preview.tsx")).toContain(`language === "bash" ? "${WRAP} p-4" : "overflow-x-auto p-4"`)
  })

  test("leave code samples on their own lines, scrolling", () => {
    const page = read("app/[locale]/docs/installation/page.tsx")
    expect(page).toContain('<pre className="overflow-x-auto rounded-lg bg-terminal p-4 text-sm">')
  })

  test("keep each URL's file name whole, so a URL breaks only before it, and join back unchanged", () => {
    const command = runCommand("npm", shadcnAdd("theme", "font-geist"))
    expect(wrapPieces(command)).toEqual([
      { text: "npx shadcn@latest add ", keep: false },
      { text: "https://ui.smicolon.com/r/", keep: false },
      { text: "theme.json", keep: true },
      { text: " ", keep: false },
      { text: "https://ui.smicolon.com/r/", keep: false },
      { text: "font-geist.json", keep: true },
    ])
    expect(wrapPieces(command).map((p) => p.text).join("")).toBe(command)
    expect(wrapPieces("npm install clsx tailwind-merge")).toEqual([{ text: "npm install clsx tailwind-merge", keep: false }])
    expect(read("components/package-manager-tabs.tsx")).toContain('<span className="whitespace-nowrap">{text}</span>')
  })

  test("still copy the command as one line", () => {
    const tabs = read("components/package-manager-tabs.tsx")
    expect(tabs).toContain("navigator.clipboard.writeText(command)")
  })
})
