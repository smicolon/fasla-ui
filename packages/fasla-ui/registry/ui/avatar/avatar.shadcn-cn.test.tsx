import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

// shadcn's cn, which a project set up with `shadcn init` keeps: plain
// tailwind-merge, which doesn't know Fasla's `text-xxs`.
vi.mock("../../../src/lib/utils", async () => {
  const { clsx } = await import("clsx")
  const { twMerge } = await import("tailwind-merge")
  return { cn: (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs)) }
})

import { Avatar, avatarVariants } from "./avatar"

const sizes = ["32", "24", "12"] as const
const radii = ["standard", "rounded"] as const

function frameOf(props: React.ComponentProps<typeof Avatar>) {
  const { container } = render(<Avatar data-testid="avatar" {...props} />)
  return container.querySelector("[data-testid='avatar']")!.firstElementChild as HTMLElement
}

describe("Avatar with shadcn's cn", () => {
  it.each(sizes)("keeps text-foreground at %s, where the initials and icon take it", (size) => {
    expect(frameOf({ size, variant: "initials", name: "Layla" })).toHaveClass("text-foreground")
    expect(frameOf({ size, variant: "icon" })).toHaveClass("text-foreground")
  })

  // Every class, in order, exactly as the variants give them: nothing merged
  // away, nothing added, so Avatar looks as it did at every size.
  it.each(sizes.flatMap((size) => radii.flatMap((radius) => [true, false].map((border) => [size, radius, border] as const))))(
    "draws %s %s border=%s with the variants' classes and bg-muted, unmerged",
    (size, radius, border) => {
      const frame = frameOf({ size, radius, border, variant: "initials", name: "Layla" })
      expect(frame.className).toBe(`${avatarVariants({ size, radius, border })} bg-muted`)
    }
  )
})
