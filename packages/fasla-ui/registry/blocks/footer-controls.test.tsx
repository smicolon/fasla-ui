import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"
import hidden from "../../../../apps/storybook/stories/blocks/footer/footer-hidden-controls.json"

// Storybook's Controls table for every Footer story. The rule: every control in
// the table visibly changes the preview, so a copy prop that changes nothing
// on screen (an accessible name, a message shown only after the visitor acts)
// is hidden from the table. `footer-hidden-controls.json` (beside the stories)
// lists the hidden ones per story; the stories read it. This test renders each
// Type once per copy prop with an Arabic string typed in and proves both
// halves: a control that is not hidden shows the typed text on screen (as text
// or as the field's placeholder), and a hidden one does not. jsdom has no CSS,
// so a prop that is only hidden at one breakpoint cannot be told apart here;
// the browser pass over the running Storybook covers that and the non-text controls.

// Vite's glob import, which the package's tsconfig does not type.
const modules = (import.meta as unknown as { glob: (pattern: string, options: { eager: true }) => Record<string, Record<string, unknown>> }).glob("./footer-*/Footer*.tsx", { eager: true })

const TYPED = "ZQ مرحبا"
/** The messages blockArgTypes already drops from every table: they show only once the visitor acts. */
const BY_RULE = new Set(["pendingLabel", "retryingLabel", "success", "error", "emailError", "retryError", "requestError", "sendError", "requiredError", "consentError", "againLabel", "thanks", "copiedLabel", "cancelled", "redirecting", "empty"])
const hiddenByStory = hidden as Record<string, string[]>

/** Stories beyond the one-per-Type: the newsletter's forced states, with the prop the story sets. */
const STATES: Record<string, Record<string, unknown>> = {
  "newsletter-split-loading": { status: "loading" },
  "newsletter-split-sent": { status: "sent" },
  "newsletter-split-error": { status: "error" },
}

const stories = Object.entries(modules).flatMap(([path, mod]) => {
  const slug = path.split("/")[1]!.replace(/^footer-/, "")
  const Component = Object.entries(mod).find(([name, value]) => /^Footer[A-Z]/.test(name) && typeof value === "function")?.[1] as React.ComponentType<Record<string, unknown>>
  const copy = Object.entries(mod).find(([name]) => /^footer.*Copy$/.test(name))?.[1] as { en: Record<string, unknown> }
  const states = Object.entries(STATES).filter(([id]) => id.startsWith(`${slug}-`)).map(([id, props]) => ({ id, props }))
  return [{ id: slug, props: {} }, ...states].map(({ id, props }) => ({ id, slug, Component, copy, props }))
})

beforeEach(() => {
  window.matchMedia = ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia
})
afterEach(() => {
  vi.restoreAllMocks()
  // @ts-expect-error the stub is removed again
  delete window.matchMedia
})

const shows = (container: HTMLElement) =>
  (container.textContent ?? "").includes(TYPED) || [...container.querySelectorAll("input")].some((input) => input.placeholder.includes(TYPED))

describe("Footer Storybook controls", () => {
  it("covers all 33 Types", () => {
    expect(new Set(stories.map((story) => story.slug)).size).toBe(33)
  })

  describe.each(stories)("$id", ({ id, Component, copy, props }) => {
    const keys = Object.entries(copy.en).filter(([key, value]) => typeof value === "string" && !/Href$/.test(key) && !BY_RULE.has(key)).map(([key]) => key)

    it("hides exactly the copy props that change nothing on screen", () => {
      const silent = keys.filter((key) => {
        const { container } = render(<Component locale="en" {...props} {...{ [key]: TYPED }} />)
        const result = !shows(container)
        container.remove()
        return result
      })
      expect(silent.sort()).toEqual([...(hiddenByStory[id] ?? [])].sort())
    })

    it("shows Arabic typed into an English story, for every control left in the table", () => {
      for (const key of keys.filter((key) => !(hiddenByStory[id] ?? []).includes(key))) {
        const { container } = render(<Component locale="en" {...props} {...{ [key]: TYPED }} />)
        expect(shows(container), `${id}: ${key}`).toBe(true)
        container.remove()
      }
    })
  })
})
