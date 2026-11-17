import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

// The two headers, the docs' SiteHeader and the home page's LandingNav, behave
// and look the same where they share a control.
const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
const toggle = read("components/theme-toggle.tsx")

describe("The theme toggle", () => {
  test("switches from the theme in effect, so a system theme flips on the first click", () => {
    expect(toggle).toContain('setTheme(resolvedTheme === "dark" ? "light" : "dark")')
    expect(toggle).not.toMatch(/\btheme === "(light|dark)"/)
  })
})

describe("The theme icon and its name", () => {
  const landing = read("app/[locale]/(home)/_components/landing-nav.tsx")
  const messages = (lang) => JSON.parse(read(`messages/${lang}.json`))

  test("both headers show the sun while the page is light and the moon while it is dark", () => {
    expect(landing).toContain('<SunIcon className="dark:hidden" />')
    expect(landing).toContain('<MoonIcon className="hidden dark:block" />')
    // The docs toggle draws the sun first (gone in dark) and the moon second (shown in dark).
    const sun = toggle.indexOf('<circle cx="12" cy="12" r="4" />')
    const moon = toggle.indexOf('d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"')
    expect(sun).toBeGreaterThan(-1)
    expect(moon).toBeGreaterThan(sun)
    expect(toggle.slice(0, sun)).toContain("dark:scale-0")
    expect(toggle.slice(sun, moon)).toContain("dark:scale-100")
  })

  test("both name the action, in English and Arabic, picked by the theme without JavaScript", () => {
    for (const source of [landing, toggle]) {
      expect(source).toMatch(/<span className="sr-only dark:hidden">\{\w+\("themeToDark"\)\}<\/span>/)
      expect(source).toMatch(/<span className="sr-only hidden dark:inline">\{\w+\("themeToLight"\)\}<\/span>/)
    }
    expect(landing).not.toMatch(/aria-label=\{t\("theme"\)\}/)
    expect(messages("en").nav.themeToDark).toBe("Switch to dark theme")
    expect(messages("en").nav.themeToLight).toBe("Switch to light theme")
    expect(messages("ar").nav.themeToDark).toBe("التبديل إلى المظهر الداكن")
    expect(messages("ar").nav.themeToLight).toBe("التبديل إلى المظهر الفاتح")
  })
})

describe("The install command on the home page", () => {
  test("stays on one line: it never wraps, and its type shrinks on narrow screens instead", () => {
    const copy = read("components/copy-command.tsx")
    expect(copy).toContain('className="whitespace-nowrap font-mono text-[length:clamp(11px,3.4vw,15px)] text-foreground">{command}')
    expect(copy).not.toContain("text-[15px]")
    // On phones the box spends less on padding and gaps.
    expect(read("app/[locale]/(home)/page.tsx")).toContain("max-[560px]:gap-2 max-[560px]:px-3")
  })
})

describe("Arabic sidebar labels", () => {
  test("keep the English name in parentheses whole and isolated", () => {
    const sidebar = read("components/docs-sidebar.tsx")
    expect(sidebar).toContain('<bdi className="whitespace-nowrap">{match[2]}</bdi>')
    expect(sidebar).toContain("<SidebarLabel text={routeText(route, locale).h1} />")
  })

  test("the pattern splits every Arabic component name, and only those", async () => {
    const source = read("components/docs-sidebar.tsx")
    const pattern = new RegExp(source.match(/text\.match\(\/(.+)\/\)/)[1])
    const { componentRouteGroups, routeText } = await import("../lib/seo-routes")
    const routes = componentRouteGroups.flatMap((group) => group.routes)
    expect(routes.length).toBeGreaterThan(0)
    for (const route of routes) {
      const ar = routeText(route, "ar").h1
      const en = routeText(route, "en").h1
      if (/\(/.test(ar)) expect(ar.match(pattern)?.[2], ar).toMatch(/^\([^()]+\)$/)
      expect(en.match(pattern), en).toBeNull()
    }
    expect("حقل الإدخال الرقمي (Input Number)".match(pattern).slice(1)).toEqual(["حقل الإدخال الرقمي", "(Input Number)"])
  })
})

describe("Effect names", () => {
  const effects = { "animated-gradient": "Animated Gradient", "border-beam": "Border Beam", "text-reveal": "Text Reveal", "shimmer-button": "Shimmer Button", "glow-card": "Glow Card" }

  test("are written with spaces in every heading, title and description, English and Arabic", async () => {
    const { routes, routeText } = await import("../lib/seo-routes")
    for (const [slug, name] of Object.entries(effects)) {
      const route = routes.find((r) => r.path === `/docs/components/${slug}/`)
      expect(routeText(route, "en").h1, slug).toBe(name)
      expect(routeText(route, "ar").h1, slug).toContain(`(${name})`)
    }
    const display = [read("lib/seo-routes.ts"), JSON.stringify(JSON.parse(read("messages/ar.json")).docs), JSON.stringify(JSON.parse(read("messages/en.json")).landing)]
    for (const text of display) expect(text).not.toMatch(/\((AnimatedGradient|BorderBeam|TextReveal)\)|h1: "(AnimatedGradient|BorderBeam|TextReveal)"/)
  })

  test("keep the code names in code: imports, JSX and <code> are unchanged", () => {
    const page = read("app/[locale]/docs/components/animated-gradient/page.tsx")
    expect(page).toMatch(/AnimatedGradient/)
  })
})

describe("The GitHub link", () => {
  test("opens in a new tab everywhere, with rel=\"noopener noreferrer\"", () => {
    const landing = read("app/[locale]/(home)/_components/landing-nav.tsx")
    const footer = read("app/[locale]/(home)/_components/landing-footer.tsx")
    const header = read("components/site-header.tsx")
    const menu = read("components/mobile-menu.tsx")
    for (const source of [landing, footer]) {
      expect(source).toContain('<a href={landingLinks.github} target="_blank" rel="noopener noreferrer"')
      expect(source).not.toMatch(/<a href=\{landingLinks\.github\} className/)
    }
    expect(landing).toContain('{ href: landingLinks.github, label: t("github"), newTab: true }')
    expect(header).toContain('label: t("github"), newTab: true }')
    expect(header).not.toMatch(/rel="noreferrer"/)
    expect(menu).toContain('{ target: "_blank", rel: "noopener noreferrer" }')
  })
})
