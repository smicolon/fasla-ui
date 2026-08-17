import { JSDOM } from "jsdom"
import { afterEach } from "bun:test"

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
})

Object.defineProperty(globalThis, "window", { value: dom.window })
Object.defineProperty(globalThis, "document", { value: dom.window.document })
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator })
Object.defineProperty(globalThis, "HTMLElement", { value: dom.window.HTMLElement })
Object.defineProperty(globalThis, "Node", { value: dom.window.Node })

for (const property of Object.getOwnPropertyNames(dom.window)) {
  if (!(property in globalThis)) {
    Object.defineProperty(globalThis, property, {
      configurable: true,
      get: () => dom.window[property],
    })
  }
}

await import("@testing-library/jest-dom/vitest")
const { cleanup } = await import("@testing-library/react")

afterEach(cleanup)
