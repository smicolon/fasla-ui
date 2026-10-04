import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Switch } from "./switch"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and no style resolution: it matches neither
 * `:checked` inside `:has()` nor `:focus-visible`, applies no stylesheet, and
 * every `getBoundingClientRect` is zero. So the visual tests below assert
 * **class presence only** — that the component emits the right utility on the
 * right element. Track and thumb geometry, the thumb's travel in both
 * directions, the focus ring and the tokens in Light and Dark were measured in
 * a real browser.
 * Treat a green run here as "the contract is wired", not "it looks right".
 */

/** label ▸ input ▸ [band ▸ track ▸ thumb, text] ▸ focusRing */
const parts = (input: HTMLElement) => {
  const root = input.closest("label") as HTMLElement
  const track = root.querySelector("[data-slot=track]") as HTMLElement
  return {
    root,
    band: track.parentElement as HTMLElement,
    track,
    thumb: root.querySelector("[data-slot=thumb]") as HTMLElement,
    focusRing: root.querySelector("[data-slot=focus-ring]") as HTMLElement,
  }
}

const control = () => screen.getByRole("switch")

describe("Switch", () => {
  it("renders a native checkbox exposed as a switch", () => {
    render(<Switch aria-label="Wi-Fi" />)
    expect(control()).toHaveAttribute("type", "checkbox")
    expect(control()).toHaveAccessibleName("Wi-Fi")
  })

  it("is off by default and reflects defaultChecked", () => {
    const { rerender } = render(<Switch aria-label="Wi-Fi" />)
    expect(control()).not.toBeChecked()

    rerender(<Switch aria-label="Wi-Fi" defaultChecked />)
    expect(control()).toBeChecked()
  })

  it("toggles uncontrolled from defaultChecked", () => {
    render(<Switch label="Wi-Fi" defaultChecked />)
    fireEvent.click(screen.getByText("Wi-Fi"))
    expect(control()).not.toBeChecked()
    fireEvent.click(screen.getByText("Wi-Fi"))
    expect(control()).toBeChecked()
  })

  it("follows a controlled checked prop", () => {
    const handleChange = vi.fn()
    const { rerender } = render(
      <Switch label="Wi-Fi" checked={false} onChange={handleChange} />
    )
    fireEvent.click(control())
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(control()).not.toBeChecked()

    rerender(<Switch label="Wi-Fi" checked onChange={handleChange} />)
    expect(control()).toBeChecked()
  })

  it("drives the thumb from the input itself, not from React props", () => {
    // The thumb must move for `defaultChecked` and for a form reset alike, so
    // its position comes from CSS reading the real input — never from a
    // `data-state` derived from props.
    render(<Switch label="Wi-Fi" defaultChecked />)
    const { thumb } = parts(control())
    expect(thumb).not.toHaveAttribute("data-state")
    expect(thumb.className).toMatch(/group-has-\[:checked\]\/switch:start-\[/)
  })

  it("sizes the track and thumb to the Figma set", () => {
    const cases = [
      ["sm", ["h-[18px]", "w-8"], "size-4", "start-[15px]"],
      ["md", ["h-5", "w-10"], "size-[18px]", "start-[21px]"],
      ["lg", ["h-6", "w-12"], "size-[22px]", "start-[25px]"],
    ] as const
    for (const [size, track, thumb, on] of cases) {
      const { unmount } = render(<Switch size={size} aria-label="Wi-Fi" />)
      const p = parts(control())
      expect(p.track).toHaveClass(...track)
      expect(p.thumb).toHaveClass(thumb, "start-px", "top-px")
      expect(p.thumb).toHaveClass(`group-has-[:checked]/switch:${on}`)
      // The focus ring is laid over the track, so it is the track's size.
      expect(p.focusRing).toHaveClass(...track)
      unmount()
    }
  })

  it("defaults to md", () => {
    render(<Switch aria-label="Wi-Fi" />)
    expect(parts(control()).track).toHaveClass("h-5", "w-10")
  })

  it("positions the thumb with logical properties only", () => {
    // No physical offsets and no `rtl:` overrides: `inset-inline-start` makes
    // the thumb travel towards the end of the line in either direction.
    for (const size of ["sm", "md", "lg"] as const) {
      const { unmount } = render(<Switch size={size} aria-label="Wi-Fi" />)
      const html = parts(control()).root.outerHTML
      expect(html).not.toMatch(/\brtl:/)
      expect(html).not.toMatch(/translate-x/)
      expect(html).not.toMatch(/\b(left|right)-/)
      unmount()
    }
  })

  it("paints the solid variant with Figma's tokens", () => {
    render(<Switch aria-label="Wi-Fi" />)
    const { track, thumb, focusRing } = parts(control())
    expect(track).toHaveClass(
      "bg-input",
      "group-has-[:checked]/switch:bg-primary",
      "shadow-sm"
    )
    expect(thumb).toHaveClass(
      "bg-primary-foreground",
      "group-has-[:disabled]/switch:bg-background"
    )
    // Focus: a 1px ring stroke inside the track.
    expect(focusRing).toHaveClass("border", "border-ring")
  })

  it("paints the outline variant with Figma's tokens", () => {
    render(<Switch variant="outline" aria-label="Wi-Fi" />)
    const { track, thumb, focusRing } = parts(control())
    // A Figma OUTSIDE stroke is a CSS outline: painted, but not in the box.
    expect(track).toHaveClass(
      "bg-background",
      "outline",
      "outline-1",
      "outline-input",
      "group-has-[:checked]/switch:outline-primary"
    )
    expect(track).not.toHaveClass("border", "shadow-sm")
    expect(thumb).toHaveClass("bg-input", "group-has-[:checked]/switch:bg-primary")
    // Focus replaces the stroke with `ring`, except an on switch keeps primary.
    expect(focusRing).toHaveClass(
      "outline-ring",
      "peer-checked:outline-primary"
    )
  })

  it("draws focus as a ring-coloured halo on a sibling of the input", () => {
    for (const variant of ["solid", "outline"] as const) {
      const { unmount } = render(<Switch variant={variant} aria-label="Wi-Fi" />)
      const { focusRing } = parts(control())
      expect(focusRing.previousElementSibling).not.toBeNull()
      expect(control().parentElement).toBe(focusRing.parentElement)
      expect(focusRing).toHaveClass(
        "ring-[3px]",
        "ring-ring/50",
        "opacity-0",
        "peer-focus-visible:opacity-100",
        "rounded-full"
      )
      expect(focusRing).toHaveAttribute("aria-hidden", "true")
      unmount()
    }
  })

  it("drives focus without a has-[] utility", () => {
    // `:has()` is invisible to the pseudo-state renderer the Storybook states
    // grid uses. Checked and disabled are real attributes, so `:has()` is fine
    // for them; focus must stay `peer`-driven.
    render(<Switch label="Wi-Fi" />)
    const html = parts(control()).root.outerHTML
    expect(html).not.toMatch(/has-\[:focus/)
    expect(html).not.toMatch(/focus-within/)
  })

  it("puts the track first by default, and last for label-first", () => {
    const { rerender } = render(<Switch label="Wi-Fi" description="Detail" />)
    let { root, band, focusRing } = parts(control())
    // input, band, text, focus ring
    expect(root.children[1]).toBe(band)
    expect(root).toHaveClass("inline-flex")
    expect(focusRing).toHaveClass("start-0")

    rerender(<Switch layout="label-first" label="Wi-Fi" description="Detail" />)
    ;({ root, band, focusRing } = parts(control()))
    expect(root.children[2]).toBe(band)
    expect(root).toHaveClass("flex", "justify-between")
    expect(focusRing).toHaveClass("end-0")
  })

  it("sets the label and description in Figma's text styles", () => {
    // The ramp owns the leading (20px English, 24px Arabic), so neither line
    // may carry a leading or a fixed height of its own.
    render(<Switch label="Wi-Fi" description="Detail" />)
    const label = screen.getByText("Wi-Fi")
    const description = screen.getByText("Detail")
    expect(label).toHaveClass("text-sm", "font-medium", "text-foreground")
    expect(description).toHaveClass("text-xs", "font-light", "text-muted-foreground")
    for (const el of [label, description]) {
      expect(el.className).not.toMatch(/\bleading-/)
      expect(el.className).not.toMatch(/\bh-\d/)
    }
    // Figma's 2px label-to-description gap.
    expect(label.parentElement).toHaveClass("gap-0.5")
  })

  it("dims the whole component when disabled", () => {
    render(<Switch label="Wi-Fi" disabled />)
    expect(control()).toBeDisabled()
    expect(control().closest("label")).toHaveClass(
      "has-[:disabled]:opacity-50",
      "has-[:disabled]:pointer-events-none"
    )
  })

  it("associates the label so clicking it toggles the switch", () => {
    render(<Switch label="Airplane mode" />)
    fireEvent.click(screen.getByText("Airplane mode"))
    expect(control()).toBeChecked()
  })

  it("links the description via aria-describedby", () => {
    render(<Switch label="Notifications" description="Receive push notifications" />)
    expect(control()).toHaveAccessibleDescription("Receive push notifications")
  })

  it("keeps a caller's aria-describedby alongside the description", () => {
    render(
      <>
        <span id="hint">Hint</span>
        <Switch label="Wi-Fi" description="Detail" aria-describedby="hint" />
      </>
    )
    expect(control()).toHaveAccessibleDescription("Detail Hint")
  })

  it("keeps the track and focus ring out of the accessibility tree", () => {
    render(<Switch label="Wi-Fi" />)
    const { band, focusRing } = parts(control())
    expect(band).toHaveAttribute("aria-hidden", "true")
    expect(focusRing).toHaveAttribute("aria-hidden", "true")
  })

  it("renders no text column when label and description are omitted", () => {
    render(<Switch aria-label="Wi-Fi" />)
    // input, band, focus ring — and no text column.
    expect(control().parentElement?.childElementCount).toBe(3)
    expect(screen.queryByText(/./)).toBeNull()
  })

  it("keeps a stable id across renders and honours a given one", () => {
    const { rerender } = render(<Switch label="Wi-Fi" />)
    const first = control().id
    rerender(<Switch label="Wi-Fi" />)
    expect(control().id).toBe(first)

    rerender(<Switch label="Wi-Fi" id="wifi" />)
    expect(control().id).toBe("wifi")
    expect(screen.getByText("Wi-Fi").closest("label")).toHaveAttribute("for", "wifi")
  })

  it("applies custom className to the root", () => {
    render(<Switch label="Wi-Fi" className="custom-class" />)
    expect(control().closest("label")).toHaveClass("custom-class")
  })

  it("forwards ref to the input", () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Switch aria-label="Wi-Fi" ref={ref} />)
    expect(ref.current).toBe(control())
  })

  it("rejects null as a variant", () => {
    // @ts-expect-error `variant` is declared on SwitchProps rather than
    // inherited from CVA's VariantProps, which would widen it with `| null`.
    render(<Switch aria-label="Wi-Fi" variant={null} />)
    expect(control()).toBeInTheDocument()
  })
})
