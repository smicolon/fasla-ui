import { describe, expect, it } from "vitest"
import { isStyleChoice, missingInitFlags, nonInteractiveAddMessage, nonInteractiveInitMessage } from "./init-options"

const base = { yes: false, interactive: false }

describe("missingInitFlags", () => {
  it("asks for nothing when a person can answer", () => {
    expect(missingInitFlags({ yes: false, interactive: true })).toEqual([])
  })
  it("asks for nothing under --yes, which takes the defaults", () => {
    expect(missingInitFlags({ yes: true, interactive: false })).toEqual([])
  })
  it("lists every flag when nothing can answer and none was given", () => {
    expect(missingInitFlags(base)).toEqual(["--path <dir>", "--style <default|new-york>", "--theme <fasla|brand>"])
  })
  it("lists only the flags still missing", () => {
    expect(missingInitFlags({ ...base, path: "src/components", theme: "fasla" })).toEqual(["--style <default|new-york>"])
  })
  it("asks for nothing once all three are given", () => {
    expect(missingInitFlags({ ...base, path: "src/components", style: "default", theme: "brand" })).toEqual([])
  })
  it("names --yes when an existing components.json needs an overwrite answer", () => {
    expect(missingInitFlags({ ...base, path: "p", style: "default", theme: "brand", needsOverwriteAnswer: true })).toEqual(["--yes"])
  })
})

describe("messages", () => {
  it("names the missing flags, offers --yes, and says nothing was written", () => {
    const text = nonInteractiveInitMessage(["--path <dir>", "--style <default|new-york>"])
    expect(text).toContain("--path <dir>, --style <default|new-york>")
    expect(text).toContain("--yes")
    expect(text).toContain("Nothing was written.")
  })
  it("add names --yes", () => {
    expect(nonInteractiveAddMessage()).toContain("--yes")
  })
  it("knows the two styles", () => {
    expect(isStyleChoice("default")).toBe(true)
    expect(isStyleChoice("new-york")).toBe(true)
    expect(isStyleChoice("york")).toBe(false)
  })
})
