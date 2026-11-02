// Browser pass over the running Storybook (bun run storybook): for every Footer story, sets each control in the table to a new value
// and checks the preview changed. Needs playwright-core and Chrome (CHROME=path). The jsdom half is
// packages/fasla-ui/registry/blocks/footer-controls.test.tsx.
import { chromium } from "playwright-core"
import fs from "fs"
const base = "http://localhost:6006"
const idx = await (await fetch(base + "/index.json")).json()
const ids = Object.values(idx.entries).filter(e => e.type === "story" && e.id.startsWith("blocks-footer--")).map(e => e.id)
const b = await chromium.launch({ executablePath: process.env.CHROME ?? process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const out = []
const only = process.argv[2]
for (const id of ids) {
  if (only && !id.includes(only)) continue
  await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`)
  await p.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.storyStoreValue && document.querySelector("#storybook-root")?.children.length, null, { timeout: 20000 }).catch(() => {})
  await p.waitForTimeout(600)
  const controls = await p.evaluate(async (id) => {
    const s = await window.__STORYBOOK_PREVIEW__.storyStoreValue.loadStory({ storyId: id })
    return Object.entries(s.argTypes).filter(([n, a]) => !a.table?.disable && a.control && a.control !== false && !a.action).map(([n, a]) => ({ name: n, type: a.control?.type ?? a.control, options: a.options, def: s.initialArgs[n] }))
  }, id)
  for (const c of controls) {
    const vis = () => p.evaluate(() => JSON.stringify([document.body.innerText, [...document.querySelectorAll("input,textarea")].map(i => i.value + "|" + i.placeholder + "|" + i.disabled + "|" + i.checked), [...document.querySelectorAll("img")].map(i => i.getAttribute("src")), [...document.querySelectorAll("[data-state],[aria-pressed],[aria-expanded],[aria-checked],[data-status]")].map(e => e.outerHTML.slice(0,160))]))
    const before = await vis()
    let val
    const t = (c.type || "").toString()
    if (c.name === "className") val = "bg-red-500 p-20"
    else if (t === "boolean") val = !c.def
    else if (t === "number") val = (Number(c.def) || 0) + 1
    else if (t === "select" || t === "radio") val = (c.options || []).filter(o => o !== c.def)
    else val = "ZQ مرحبا " + c.name
    let changed = false, ariaOnly = false
    for (const v of (Array.isArray(val) ? val : [val])) {
      await p.evaluate(({ id, name, v }) => window.__STORYBOOK_ADDONS_CHANNEL__.emit("updateStoryArgs", { storyId: id, updatedArgs: { [name]: v } }), { id, name: c.name, v })
      await p.waitForTimeout(450)
      const after = await vis()
      if (before !== after) changed = true
      if (typeof v === "string" && v.startsWith("ZQ")) ariaOnly = await p.evaluate(() => !!document.querySelector('[aria-label*="ZQ"],[aria-labelledby]') && !document.body.innerText.includes("ZQ") && ![...document.querySelectorAll("input")].some(i => i.placeholder.includes("ZQ")))
      if (changed) break
    }
    if (c.name === "className") { changed = await p.evaluate(() => !!document.querySelector("footer.p-20, footer.bg-red-500, #storybook-root .p-20")) }
    let ok = changed
    if (changed && typeof val === "string" && c.type === "text" && c.name !== "className") ok = await p.evaluate(() => document.body.innerText.includes("ZQ مرحبا") || [...document.querySelectorAll("input")].some(i => i.placeholder.includes("ZQ مرحبا")))
    out.push({ id, control: c.name, type: t, result: ok ? "pass" : (ariaOnly ? "ARIA ONLY" : "NO CHANGE") })
    await p.evaluate(({ id, name, d }) => window.__STORYBOOK_ADDONS_CHANNEL__.emit("updateStoryArgs", { storyId: id, updatedArgs: { [name]: d } }), { id, name: c.name, d: c.def })
    await p.waitForTimeout(150)
  }
  if (!controls.length) out.push({ id, control: "(none)", type: "", result: "-" })
}
fs.writeFileSync("./footer-controls-result.json", JSON.stringify(out, null, 1))
const bad = out.filter(o => o.result === "NO CHANGE")
console.log("stories", ids.length, "controls", out.length, "fail", bad.length)
for (const o of bad) console.log(o.id.replace("blocks-footer--", ""), o.control, o.type)
await b.close()
