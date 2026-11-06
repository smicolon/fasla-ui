import { describe, expect, mock, test } from "bun:test"
import { COPIED_MS, copyText, copyWithStatus } from "../app/[locale]/(home)/_components/copy-text"

function fakeDocument({ execResult = true, throws = false } = {}) {
  const appended = []
  const area = {
    value: "",
    style: {},
    attrs: {},
    setAttribute(k, v) { this.attrs[k] = v },
    select: mock(() => {}),
    remove: mock(() => {}),
  }
  const focus = mock(() => {})
  return {
    area,
    focus,
    appended,
    doc: {
      createElement: () => area,
      body: { appendChild: (n) => appended.push(n) },
      execCommand: mock(() => { if (throws) throw new Error("no"); return execResult }),
      activeElement: { focus },
    },
  }
}

describe("copyText", () => {
  test("uses the clipboard API when it works", async () => {
    const writeText = mock(async () => {})
    expect(await copyText("hello", { clipboard: { writeText } })).toBe(true)
    expect(writeText).toHaveBeenCalledWith("hello")
  })

  test("falls back to a textarea and execCommand when the clipboard refuses", async () => {
    const { doc, area, focus } = fakeDocument()
    const writeText = mock(async () => { throw new Error("denied") })
    expect(await copyText("hello", { clipboard: { writeText }, document: doc })).toBe(true)
    expect(area.value).toBe("hello")
    expect(area.select).toHaveBeenCalled()
    expect(doc.execCommand).toHaveBeenCalledWith("copy")
    expect(area.remove).toHaveBeenCalled()
    expect(focus).toHaveBeenCalled()
  })

  test("falls back when there is no clipboard API at all", async () => {
    const { doc } = fakeDocument()
    expect(await copyText("x", { document: doc })).toBe(true)
  })

  test("fails when the clipboard refuses and the fallback does too", async () => {
    const refuse = { writeText: async () => { throw new Error("denied") } }
    const a = fakeDocument({ execResult: false })
    expect(await copyText("x", { clipboard: refuse, document: a.doc })).toBe(false)
    expect(a.area.remove).toHaveBeenCalled()
    const b = fakeDocument({ throws: true })
    expect(await copyText("x", { clipboard: refuse, document: b.doc })).toBe(false)
    expect(await copyText("x", {})).toBe(false)
  })
})

describe("copyWithStatus", () => {
  function harness(copy) {
    const statuses = []
    const pending = new Map()
    let next = 1
    const timers = {
      set: (fn, ms) => { const id = next++; pending.set(id, { fn, ms }); return id },
      clear: (id) => { pending.delete(id) },
    }
    return { statuses, pending, run: (previous) => copyWithStatus("p", { setStatus: (s) => statuses.push(s), copy, timers, previous }) }
  }

  test("success shows copied, then the label resets to idle after two seconds", async () => {
    const h = harness(async () => true)
    const id = await h.run()
    expect(h.statuses).toEqual(["copied"])
    expect(h.pending.get(id).ms).toBe(COPIED_MS)
    expect(COPIED_MS).toBe(2000)
    h.pending.get(id).fn()
    expect(h.statuses).toEqual(["copied", "idle"])
  })

  test("failure shows failed and schedules no reset", async () => {
    const h = harness(async () => false)
    expect(await h.run()).toBeUndefined()
    expect(h.statuses).toEqual(["failed"])
    expect(h.pending.size).toBe(0)
  })

  test("a second click cancels the first reset, so the label never flips early", async () => {
    const h = harness(async () => true)
    const first = await h.run()
    const second = await h.run(first)
    expect(h.pending.has(first)).toBe(false)
    expect(h.pending.has(second)).toBe(true)
    expect(h.pending.size).toBe(1)
  })

  test("a copy that throws is not swallowed into a false success", async () => {
    const h = harness(async () => { throw new Error("boom") })
    await expect(h.run()).rejects.toThrow("boom")
    expect(h.statuses).toEqual([])
  })
})
