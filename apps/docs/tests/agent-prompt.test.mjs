import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"
import { agentPrompt } from "../app/[locale]/(home)/_components/agent-prompt-text"
import { installCommand } from "../app/[locale]/(home)/_components/links"

const docsRoot = path.resolve(import.meta.dir, "..")
const repoRoot = path.resolve(docsRoot, "../..")
const read = (file) => readFileSync(path.join(repoRoot, file), "utf8")

const commands = [...agentPrompt.matchAll(/`([^`]+)`/g)].map((m) => m[1])

describe("The agent prompt", () => {
  test("holds the install command exactly as the landing page and the CLI print it", () => {
    expect(commands).toContain(installCommand)
    expect(read("packages/fasla-ui/src/cli/commands/init.ts")).toContain(`"  ${installCommand.replace(" init", " add button")}"`)
  })

  test("every command is one the CLI has, run with @latest", () => {
    const cli = ["init.ts", "add.ts", "list.ts"].map((f) => read(`packages/fasla-ui/src/cli/commands/${f}`)).join("\n")
    expect(commands.length).toBe(3)
    for (const command of commands) {
      const match = command.match(/^npx @smicolon\/fasla-ui@latest (init|add|list)\b(.*)$/)
      expect(match, command).not.toBeNull()
      expect(cli).toContain(`.name("${match[1]}")`)
    }
  })

  test("every command appears as written on the installation page", () => {
    const page = read("apps/docs/app/[locale]/docs/installation/page.tsx")
    for (const command of commands) expect(page, command).toContain(command)
  })

  test("is open-source only: nothing about licences, premium blocks or plans", () => {
    expect(agentPrompt).not.toMatch(/licen[cs]e|premium|\bpro\b|paid|plan(?!\s+before)|subscription|checkout/i)
  })

  test("carries no secret-like string and no URL but the public docs", () => {
    expect(agentPrompt).not.toMatch(/sk-[A-Za-z0-9]{8,}|ghp_|gho_|github_pat_|AKIA[0-9A-Z]{8,}|xox[bap]-|AIza[0-9A-Za-z_-]{10,}/)
    expect(agentPrompt).not.toMatch(/api[_-]?key|secret|password|passwd|bearer|authorization|token|BEGIN [A-Z ]*PRIVATE KEY/i)
    expect(agentPrompt).not.toMatch(/\b[A-Fa-f0-9]{32,}\b|[A-Za-z0-9+/]{40,}={0,2}/)
    expect(agentPrompt).not.toMatch(/localhost|127\.0\.0\.1|\b192\.168\.|\.internal\b|@[a-z0-9.-]+\.[a-z]{2,}\b(?!\/fasla-ui)/i)
    const urls = agentPrompt.match(/https?:\/\/[^\s)]+/g) ?? []
    expect(urls).toEqual(["https://fasla.smicolon.com"])
  })

  test("stays short, and is English in both locales (one constant, not in the messages)", () => {
    expect(agentPrompt.split("\n").length).toBeLessThanOrEqual(20)
    expect(agentPrompt).not.toMatch(/[؀-ۿ]/)
    for (const locale of ["en", "ar"]) {
      expect(read(`apps/docs/messages/${locale}.json`)).not.toContain("Set up Fasla in this project")
    }
  })
})

describe("The Copy prompt messages", () => {
  const keys = ["heading", "helper", "copy", "copied", "failed", "show", "hide", "region", "or", "failedHero", "failedHeroLink"]
  const get = (locale) => JSON.parse(read(`apps/docs/messages/${locale}.json`)).landing.final.agent
  test("exist in both languages with the agreed wording", () => {
    const en = get("en")
    const ar = get("ar")
    expect(Object.keys(en).sort()).toEqual([...keys].sort())
    expect(Object.keys(ar).sort()).toEqual([...keys].sort())
    expect(en.copy).toBe("Copy agent prompt")
    expect(en.copied).toBe("Copied")
    expect(ar.copy).toBe("انسخ أمر الوكيل")
    expect(ar.failed).toBe("تعذّر النسخ. حدّد النص وانسخه.")
    expect(ar.heading).toBe("أو دع وكيلك ينفّذ ذلك")
    expect(ar.helper).toBe("الصق هذا الأمر في وكيل البرمجة لديك لتثبيت فاصلة.")
  })
})

describe("The three copy controls' names", () => {
  const msgs = (locale) => JSON.parse(readFileSync(path.join(docsRoot, `messages/${locale}.json`), "utf8"))
  test("the agent labels and the Arabic command label are exactly as specified", () => {
    expect(msgs("en").landing.final.agent.copy).toBe("Copy agent prompt")
    expect(msgs("ar").landing.final.agent.copy).toBe("انسخ أمر الوكيل")
    expect(msgs("ar").copyCommand.copy).toBe("انسخ أمر التثبيت {command} إلى الحافظة")
    expect(msgs("en").copyCommand.copy).toBe("Copy {command} to clipboard")
    expect(msgs("en").landing.final.agent.or).toBe("or")
    expect(msgs("ar").landing.final.agent.or).toBe("أو")
  })

  test("the command button, the agent button and its copied state each have their own name, in both languages", () => {
    for (const locale of ["en", "ar"]) {
      const m = msgs(locale)
      const names = [m.copyCommand.copy.replace("{command}", installCommand), m.landing.final.agent.copy, m.landing.final.agent.copied]
      expect(new Set(names).size, locale).toBe(3)
      // The two ways to copy do not share a leading phrase beyond the verb.
      expect(names[0]).not.toContain(m.landing.final.agent.copy)
      expect(names[1]).not.toContain(m.copyCommand.copied)
    }
  })

  test("the separator word sits in the hero only; the section keeps its own heading", () => {
    const component = readFileSync(path.join(docsRoot, "app/[locale]/(home)/_components/agent-prompt.tsx"), "utf8")
    expect(component.match(/t\("or"\)/g)?.length).toBe(1)
    expect(msgs("en").landing.final.agent.heading).toBe("Or let your agent do it")
    expect(msgs("ar").landing.final.agent.heading).toBe("أو دع وكيلك ينفّذ ذلك")
  })
})

describe("The hero's Copy prompt", () => {
  const read2 = (file) => readFileSync(path.join(docsRoot, file), "utf8")
  test("reuses the one component and the one prompt: no second copy of the text or the logic", () => {
    const page = read2("app/[locale]/(home)/page.tsx")
    expect(page).toContain("<AgentPromptCompact")
    expect(page).not.toContain("agentPrompt")
    expect(page).not.toContain("navigator.clipboard")
    const component = read2("app/[locale]/(home)/_components/agent-prompt.tsx")
    expect(component.match(/copyWithStatus\(agentPrompt/g)?.length).toBe(1)
  })

  test("its failure message links to the section's anchor, which exists", () => {
    const component = read2("app/[locale]/(home)/_components/agent-prompt.tsx")
    expect(component).toContain("href={`#${AGENT_PROMPT_ID}`}")
    expect(component).toContain("id={AGENT_PROMPT_ID}")
    expect(component).toContain('AGENT_PROMPT_ID = "agent-prompt"')
  })

  test("is told apart from the command's own copy button in both languages", () => {
    for (const locale of ["en", "ar"]) {
      const m = JSON.parse(readFileSync(path.join(docsRoot, `messages/${locale}.json`), "utf8"))
      expect(m.landing.final.agent.copy).not.toBe(m.copyCommand.copied)
      expect(m.copyCommand.copy).toContain("{command}")
      expect(m.landing.final.agent.copy).not.toContain("{command}")
    }
  })
})
