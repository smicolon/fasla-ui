import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Avatar, type AvatarProps } from "./avatar"

const SOURCE = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "avatar.tsx"), "utf8")

function avatar(props: Partial<AvatarProps> = {}) {
  const { container } = render(<Avatar data-testid="avatar" {...props} />)
  // Scoped to this render: some tests draw several avatars.
  const root = container.querySelector<HTMLElement>("[data-testid='avatar']")!
  const frame = root.firstElementChild as HTMLElement
  return { root, frame, container }
}

describe("Avatar", () => {
  it("renders Figma's defaults: 32, Standard, no border, no dot", () => {
    const { root, frame } = avatar({ name: "Layla Hassan" })
    expect(root).toHaveClass("size-8")
    expect(frame).toHaveClass("rounded-[var(--radius-md)]", "bg-muted", "text-foreground", "text-base", "overflow-hidden")
    expect(frame.className).not.toMatch(/after:ring/)
    expect(root.querySelector(".rounded-full.bg-success")).toBeNull()
  })

  describe("size × radius", () => {
    it.each([
      ["32", "size-8", "rounded-[var(--radius-md)]", "text-base"],
      ["24", "size-6", "rounded-[var(--radius-md)]", "text-xs"],
      // Figma's XXS: 10px, leaded 14 in English and 16 in Arabic.
      ["12", "size-3", "rounded-[var(--radius-xs)]", "text-xxs"],
    ] as const)("Standard %s is %s, %s, %s, in the foreground colour", (size, box, corner, text) => {
      const { root, frame } = avatar({ size, name: "Layla" })
      expect(root).toHaveClass(box)
      // text-foreground too: merged beside an unknown size, cn dropped it at
      // 12 and the initials took the colour of whatever held them.
      expect(frame).toHaveClass(corner, text, "text-foreground")
    })

    it.each(["32", "24", "12"] as const)("Rounded %s is a circle", (size) => {
      const { frame } = avatar({ size, radius: "rounded" })
      expect(frame).toHaveClass("rounded-full")
      expect(frame.className).not.toMatch(/radius-(md|xs)/)
    })
  })

  describe("border", () => {
    it.each([
      ["32", "after:ring-2"],
      ["24", "after:ring-1"],
      ["12", "after:ring-1"],
    ] as const)("draws a `ring` stroke inside the edge at %s: %s", (size, width) => {
      const { frame } = avatar({ size, border: true })
      expect(frame).toHaveClass("after:ring-inset", "after:ring-ring", "after:absolute", "after:inset-0", width)
    })
  })

  describe("variant=image (the default) falls back through the content", () => {
    it("shows the photo, named by `name`, once it loads", () => {
      const { frame } = avatar({ src: "/layla.png", name: "Layla Hassan" })
      const img = frame.querySelector("img")!
      // Still loading: hidden and unnamed, while the named fallback shows.
      expect(img).toHaveClass("opacity-0")
      expect(img).toHaveAttribute("aria-hidden", "true")
      expect(frame).toHaveClass("bg-muted")
      expect(frame.querySelector(".sr-only")!.textContent).toBe("Layla Hassan")
      fireEvent.load(img)
      expect(screen.getByRole("img", { name: "Layla Hassan" })).toBe(img) // same element, no re-decode
      expect(img).not.toHaveClass("opacity-0")
      expect(frame).not.toHaveClass("bg-muted") // Figma's Image variant has no fill
      expect(frame.textContent).not.toContain("LH")
      expect(frame.querySelector(".sr-only")).toBeNull()
    })

    it("never shows the previous photo under a new src: the fallback shows until it loads", () => {
      const { container, rerender } = render(<Avatar src="/a.png" name="Layla Hassan" />)
      fireEvent.load(container.querySelector("img")!)
      rerender(<Avatar src="/b.png" name="Vera Brandt" />)
      const imgs = container.querySelectorAll("img")
      expect(imgs).toHaveLength(1)
      expect(imgs[0]).toHaveAttribute("src", "/b.png") // the old photo is gone at once
      expect(imgs[0]).toHaveClass("opacity-0")
      expect(screen.queryAllByRole("img")).toHaveLength(0) // nothing named by the old photo
      expect(container.textContent).toContain("VB")
      expect(container.querySelector(".sr-only")!.textContent).toBe("Vera Brandt")
      fireEvent.load(imgs[0]!)
      expect(screen.getByRole("img", { name: "Vera Brandt" })).toHaveAttribute("src", "/b.png")
    })

    it("resets on a new srcSet too", () => {
      const { container, rerender } = render(<Avatar src="/a.png" srcSet="/a.png 1x" name="Layla Hassan" />)
      fireEvent.load(container.querySelector("img")!)
      rerender(<Avatar src="/a.png" srcSet="/a@2x.png 2x" name="Layla Hassan" />)
      expect(container.querySelector("img")).toHaveClass("opacity-0")
      expect(container.textContent).toContain("LH")
    })

    it("tries a source that failed before afresh when it comes back", () => {
      const { container, rerender } = render(<Avatar src="/flaky.png" name="Layla Hassan" />)
      fireEvent.error(container.querySelector("img")!)
      expect(container.querySelector("img")).toBeNull()
      rerender(<Avatar src="/other.png" name="Layla Hassan" />)
      rerender(<Avatar src="/flaky.png" name="Layla Hassan" />)
      const retry = container.querySelector("img")!
      expect(retry).toHaveAttribute("src", "/flaky.png") // requested again, not remembered as failed
      fireEvent.load(retry)
      expect(screen.getByRole("img", { name: "Layla Hassan" })).toBe(retry)
      expect(container.textContent).not.toContain("LH")
    })

    describe("a photo that finished before its listeners were attached", () => {
      // As after hydration, or on a reload served from cache: the browser has
      // already loaded the image, so no load or error event will ever arrive.
      const stub = (complete: boolean, naturalWidth: number) => {
        const proto = HTMLImageElement.prototype
        const was = {
          complete: Object.getOwnPropertyDescriptor(proto, "complete")!,
          naturalWidth: Object.getOwnPropertyDescriptor(proto, "naturalWidth")!,
        }
        Object.defineProperty(proto, "complete", { configurable: true, get: () => complete })
        Object.defineProperty(proto, "naturalWidth", { configurable: true, get: () => naturalWidth })
        return () => {
          Object.defineProperty(proto, "complete", was.complete)
          Object.defineProperty(proto, "naturalWidth", was.naturalWidth)
        }
      }

      it("shows it at once when it is complete with a real size", () => {
        const restore = stub(true, 64)
        try {
          const { frame } = avatar({ src: "/cached.png", name: "Layla Hassan" })
          const img = screen.getByRole("img", { name: "Layla Hassan" }) // no load event fired
          expect(img).not.toHaveClass("opacity-0")
          expect(frame).not.toHaveClass("bg-muted")
          expect(frame.textContent).not.toContain("LH")
        } finally {
          restore()
        }
      })

      it("falls back when it is complete but empty — it failed before we listened", () => {
        const restore = stub(true, 0)
        try {
          const { frame } = avatar({ src: "/broken.png", name: "Layla Hassan" })
          expect(frame.querySelector("img")).toBeNull()
          expect(frame.textContent).toContain("LH")
        } finally {
          restore()
        }
      })

      it("checks again when the source changes to a photo that is already cached", () => {
        const { container, rerender } = render(<Avatar src="/a.png" name="Layla Hassan" />)
        fireEvent.load(container.querySelector("img")!)
        const restore = stub(true, 64)
        try {
          rerender(<Avatar src="/cached.png" name="Vera Brandt" />)
          expect(screen.getByRole("img", { name: "Vera Brandt" })).toHaveAttribute("src", "/cached.png")
        } finally {
          restore()
        }
      })
    })

    it("falls back to initials when the photo fails", () => {
      const { frame } = avatar({ src: "/missing.png", name: "Layla Hassan" })
      fireEvent.error(frame.querySelector("img")!)
      expect(screen.queryByRole("img")).toBeNull()
      expect(frame).toHaveClass("bg-muted")
      expect(frame.textContent).toContain("LH")
    })

    it("shows the user icon when there is no name either", () => {
      const { frame } = avatar()
      const svg = frame.querySelector("svg")!
      expect(svg).toHaveAttribute("aria-hidden", "true")
      expect(svg).toHaveClass("size-3/4")
      expect(svg).toHaveAttribute("stroke-width", "1.5")
    })

    it("falls back to the icon when the photo fails and there is no name", () => {
      const { frame } = avatar({ src: "/missing.png" })
      fireEvent.error(frame.querySelector("img")!)
      expect(frame.querySelector("svg")).not.toBeNull()
    })
  })

  describe("variant=initials", () => {
    it("shows the initials even when there is a photo", () => {
      const { frame } = avatar({ variant: "initials", src: "/layla.png", name: "Layla Hassan" })
      expect(screen.queryByRole("img")).toBeNull()
      expect(frame).toHaveClass("bg-muted")
      expect(frame.querySelector("[aria-hidden='true']")!.textContent).toBe("LH")
      expect(frame.querySelector(".sr-only")!.textContent).toBe("Layla Hassan")
    })

    it("shows the icon when there is no name to take initials from", () => {
      const { frame } = avatar({ variant: "initials" })
      expect(frame.querySelector("svg")).not.toBeNull()
    })
  })

  describe("variant=icon", () => {
    it("shows the icon even with a photo and a name, and is still named by `name`", () => {
      const { frame } = avatar({ variant: "icon", src: "/layla.png", name: "Layla Hassan" })
      expect(screen.queryByRole("img")).toBeNull()
      expect(frame.querySelector("svg")).not.toBeNull()
      expect(frame.textContent).not.toContain("LH")
      expect(frame.querySelector(".sr-only")!.textContent).toBe("Layla Hassan")
    })
  })

  it("names Figma's Style `variant`, so React's inline `style` still reaches the root", () => {
    const { root } = avatar({ variant: "icon", style: { marginInlineStart: "1rem" } })
    expect(root.style.marginInlineStart).toBe("1rem")
  })

  it("passes the image attributes through to the <img>", () => {
    avatar({
      src: "/layla.png",
      name: "Layla Hassan",
      srcSet: "/layla.png 1x, /layla@2x.png 2x",
      sizes: "32px",
      loading: "lazy",
      decoding: "async",
      crossOrigin: "anonymous",
      referrerPolicy: "no-referrer",
    })
    const img = document.querySelector<HTMLImageElement>("img[src='/layla.png']")!
    expect(img).toHaveAttribute("srcset", "/layla.png 1x, /layla@2x.png 2x")
    expect(img).toHaveAttribute("sizes", "32px")
    expect(img).toHaveAttribute("loading", "lazy")
    expect(img).toHaveAttribute("decoding", "async")
    expect(img).toHaveAttribute("crossorigin", "anonymous")
    expect(img).toHaveAttribute("referrerpolicy", "no-referrer")
  })

  describe("initials", () => {
    const shown = (props: Partial<AvatarProps>) =>
      avatar(props).frame.querySelector("[aria-hidden='true']")!.textContent

    it("takes the first letters of the first and last words, upper-cased", () => {
      expect(shown({ name: "layla ahmed hassan" })).toBe("LH")
      expect(shown({ name: "Vera" })).toBe("V")
    })

    it("shows one letter at size 12, as Figma does", () => {
      expect(shown({ name: "Vera Brandt", size: "12" })).toBe("V")
    })

    it("keeps two Arabic initials in their separate forms", () => {
      expect(shown({ name: "ليلى حسن" })).toBe("ل‌ح")
    })

    it("hides the letters and names the fallback with `name`", () => {
      const { frame } = avatar({ name: "Layla Hassan" })
      expect(frame.querySelector(".sr-only")!.textContent).toBe("Layla Hassan")
    })

    it("is silent when `name` is empty, for when a label already names the person", () => {
      const { frame } = avatar({ name: "" })
      expect(frame.querySelector(".sr-only")).toBeNull()
    })
  })

  describe("status", () => {
    const dot = (props: Partial<AvatarProps>) =>
      avatar({ status: "online", ...props }).root.lastElementChild as HTMLElement

    it("is off unless set", () => {
      const { root } = avatar({ name: "Layla" })
      expect(root.children).toHaveLength(1)
    })

    it("uses the 8px dot at 32 and 24, and the 4px dot at 12", () => {
      expect(dot({ size: "32" })).toHaveClass("size-2", "ring-2")
      expect(dot({ size: "24" })).toHaveClass("size-2", "ring-2")
      expect(dot({ size: "12" })).toHaveClass("size-1", "ring-1")
    })

    it("hangs 2px past the end corner on Standard 32 and 24", () => {
      expect(dot({ size: "32" })).toHaveClass("absolute", "-bottom-0.5", "-end-0.5")
      expect(dot({ size: "24" })).toHaveClass("-bottom-0.5", "-end-0.5")
    })

    it("sits flush on Rounded and at 12", () => {
      expect(dot({ radius: "rounded" })).toHaveClass("bottom-0", "end-0")
      expect(dot({ size: "12" })).toHaveClass("bottom-0", "end-0")
    })

    it("uses logical `end`, so dir=rtl moves it to the bottom-left", () => {
      expect(SOURCE).not.toMatch(/\b-?(right|left)-/)
    })

    it.each(["online", "away", "busy", "offline"] as const)("passes %s through", (status) => {
      const fills = { online: "bg-success", away: "bg-warning", busy: "bg-destructive", offline: "bg-muted" }
      expect(dot({ status })).toHaveClass(fills[status])
    })

    it("silences the dot with statusLabel=\"\", as name=\"\" silences the avatar", () => {
      expect(dot({ statusLabel: "" }).textContent).toBe("")
    })

    it("takes a statusLabel for the dot's name", () => {
      expect(dot({ statusLabel: "Layla is online" }).textContent).toBe("Layla is online")
    })
  })

  it("uses tokens only — no raw colour or pixel values", () => {
    expect(SOURCE).not.toMatch(/#[0-9a-f]{3,8}\b|\[\d+px\]|rgb\(/i)
  })

  it("merges a consumer className on the root", () => {
    expect(avatar({ className: "shadow" }).root).toHaveClass("shadow", "size-8")
  })
})
