#!/usr/bin/env node
/**
 * Builds the Fasla blocks index from a raw Figma capture.
 *
 *   node design/scripts/build-blocks-index.mjs <capture.json>   # capture -> .json + .md
 *   node design/scripts/build-blocks-index.mjs --render-only    # .json   -> .md
 *
 * The sibling of build-index.mjs (the atom index), with its own scope rule and its own shape.
 * The capture step — which pages, which nodes — lives in `.agents/skills/figma-index/SKILL.md`
 * under "Target: blocks"; everything below is derivation. Shared pieces (file key, links, page
 * name parsing, the status legend) are imported so the two indexes cannot drift apart.
 *
 * Figma is the source of truth. Re-run the skill rather than patching either output by hand:
 * a dirty `git status` afterwards is the drift report.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { FILE_KEY, LEGEND, EXCLUDED_BLOCK_PAGES, link, parseDoc, parsePage } from "./build-index.mjs"

const DESIGN = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const REPO = resolve(DESIGN, "..")

/* ── Scope ─────────────────────────────────────────────────────────────────────────
 * Exactly the pages under two section headers, in page order. A section runs from the page
 * after its header to the next header or divider page (a blank or "---" name), so a page added
 * inside a section is picked up on its own. The E-commerce section must end on Gift Cards: if a
 * page ever appears after it, the build stops and names it rather than quietly taking it in.
 * Headers and the end page are anchored by node id, because page names drift. */
export const SECTIONS = [
  { key: "marketing", title: "Marketing UI Components", header: "40935:41137" },
  { key: "ecommerce", title: "E-commerce UI Components", header: "43164:51148", endsAt: { id: "43164:52345", name: "Gift Cards" } },
]
export const isHeader = (name) => name.trim().endsWith("↴")
export const isDivider = (name) => name.trim() === "" || /^-+$/.test(name.trim())

/** Ready = the page's status emoji is 🟢. Nothing else — no ✅ rule for blocks.
 *  Settled by Yasmin on 2026-10-16; deliberately different from the atom index rule. */
export const READY = (status) => status === "🟢"

/** Component sets on a block page that are neither the family set nor a helper part.
 *  Each was settled by a designer; a new one stops the build until someone decides. */
export const EXTRA_SETS = {
  "44907:354325": {
    flag: "new-direction-set",
    note: "4 Desktop-only Types, not counted as blocks. A new direction, to be merged with an Arabic version later (Yasmin, 2026-10-16).",
  },
}

/** Family set id -> registry name prefix. Each Type maps to `${prefix}${slug(type)}`; the
 *  builder fails if a derived name is missing from the registry or a registry item with the
 *  prefix is left unclaimed. Hand-maintained: add a family when its blocks ship in code. */
export const CODE_PREFIX = { "42359:9029": "faq-", "42556:548": "error-state-", "42806:232717": "logo-cloud-", "42586:4669": "auth-" }

export const OWNERS = { Y: { name: "Yasmin", active: true }, H: { name: "Haneen", active: false }, "Y/H": { name: "Yasmin and Haneen", active: true } }

const BREAKPOINTS = ["Desktop", "Tablet", "Mobile"]
const DIRECTIONS = ["LTR", "RTL"]
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "")
/** GitHub's heading anchor: lowercase, drop punctuation, spaces to hyphens ("A & B" -> "a--b"). */
const anchor = (s) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-")
const cell = (s) => String(s).replace(/\|/g, "\\|")

/** Which pages the rule selects, from the ordered page list alone. */
export function deriveScope(pageList) {
  const out = []
  for (const s of SECTIONS) {
    let i = pageList.findIndex(([id]) => id === s.header)
    if (i < 0) throw new Error(`section header ${s.header} (${s.title}) is not in the file`)
    const ids = []
    for (i++; i < pageList.length && !isHeader(pageList[i][1]) && !isDivider(pageList[i][1]); i++) ids.push(pageList[i][0])
    if (s.endsAt && ids[ids.length - 1] !== s.endsAt.id) {
      const at = ids.indexOf(s.endsAt.id)
      const extra = at < 0 ? ids : ids.slice(at + 1)
      const err = new Error(`${s.title} must end on ${s.endsAt.name} (${s.endsAt.id}); ` +
        (at < 0 ? "that page is missing" : `found ${extra.length} page(s) after it`) + " — not guessing; ask the designer")
      err.pages = extra.map((id) => pageList.find(([p]) => p === id))
      throw err
    }
    out.push({ section: s, ids })
  }
  return out
}

/** "✦  🟢 Y | FAQ - 26 Blocks" -> 26; "Social Proof (Testimonials -29 , Ratings 4, Stats 1)" -> 34. */
export function countInName(name) {
  const m = name.match(/[-–—]\s*(\d+)\s*Blocks?\b/i)
  if (m) return { value: Number(m[1]), source: "suffix" }
  const paren = name.match(/\(([^)]*\d[^)]*)\)/)
  if (paren) return { value: (paren[1].match(/\d+/g) || []).reduce((a, n) => a + Number(n), 0), source: "breakdown" }
  return { value: null, source: null }
}

/** The house page-name format is "✦  {status} {owner} | {Name}". Report how a name departs from it. */
export function pageNameIssues(name) {
  const issues = []
  if (name !== name.trimEnd()) issues.push("trailing space")
  if (!/^✦ {2}\S/.test(name)) issues.push("not two spaces after ✦")
  if (/\|\S/.test(name)) issues.push("no space after the bar")
  if (/\| {2,}/.test(name)) issues.push("double space after the bar")
  if (/\S {2,}\S/.test(name.replace(/^✦ {2}/, ""))) issues.push("double space inside the name")
  return issues
}

export function build(capture, { registry } = {}) {
  const { pageList, pages } = capture
  const scope = deriveScope(pageList)
  const scopeIds = scope.flatMap((s) => s.ids)
  const captured = pages.map((p) => p.pageId)
  if (JSON.stringify(scopeIds) !== JSON.stringify(captured)) {
    const err = new Error("the capture does not match the scope rule — re-run the capture")
    err.missing = scopeIds.filter((id) => !captured.includes(id))
    err.unexpected = captured.filter((id) => !scopeIds.includes(id))
    throw err
  }

  // Shape check first, for every page: the builder only understands the type-axis shape.
  const offShape = []
  for (const p of pages) {
    const fam = p.sets.filter((s) => !EXTRA_SETS[s.id] && s.types.length && s.axes.Breakpoint && s.axes.Direction)
    const other = p.sets.filter((s) => !EXTRA_SETS[s.id] && !fam.includes(s) && (s.axes.Breakpoint || s.axes.Type))
    if (fam.length !== 1 || other.length) offShape.push({ pageId: p.pageId, name: p.page, familySets: fam.length, otherBlockSets: other.map((s) => s.name) })
  }
  if (offShape.length) {
    const err = new Error("pages not in the type-axis shape (one set with Type × Breakpoint × Direction) — not guessing")
    err.offShape = offShape
    throw err
  }

  const registryNames = registry ? registry.items.map((i) => i.name) : null
  const claimed = new Set()
  const families = []
  const enStyles = []

  for (const p of pages) {
    const sec = scope.find((s) => s.ids.includes(p.pageId)).section
    const meta = parsePage(p.page)
    const set = p.sets.find((s) => !EXTRA_SETS[s.id] && s.types.length && s.axes.Breakpoint && s.axes.Direction)
    const parts = p.sets.filter((s) => s !== set && !EXTRA_SETS[s.id])
    const extras = p.sets.filter((s) => EXTRA_SETS[s.id])
    const owner = OWNERS[meta.initials] ?? { name: null, active: null }
    const flags = []
    const expected = set.axes.Breakpoint.length * set.axes.Direction.length

    const prefix = CODE_PREFIX[set.id]
    const blocks = set.types.map(([name, variants, nodeId]) => {
      let code = null
      if (prefix) {
        code = prefix + slug(name)
        if (registryNames && !registryNames.includes(code)) throw new Error(`${set.name} / ${name}: derived registry name "${code}" is not in registry.json`)
        claimed.add(code)
      }
      if (variants !== expected) flags.push(`incomplete-type: ${name} (${variants}/${expected})`)
      return { name, nodeId, url: link(nodeId), variants, code }
    })

    // Docs: the "{X} — Fasla UI Block Documentation[ (EN)|(AR)]" frames inside the doc section.
    const docs = p.docs.map((d) => ({ ...d, ...parseDoc(d.name) }))
    const en = docs.filter((d) => d.lang === "en"), ar = docs.filter((d) => d.lang === "ar")
    if (!en.length) flags.push("no-en-doc")
    if (!ar.length) flags.push("no-ar-doc")
    if (en.length > 1 || ar.length > 1) flags.push("duplicate-doc-frame")
    const subjects = new Set([norm(set.name), norm(meta.display.replace(/\s*[-–—]\s*\d+\s*Blocks?\b.*$/i, ""))])
    const mismatched = docs.filter((d) => !subjects.has(norm(d.subject)))
    if (mismatched.length) flags.push(`doc-name-mismatch: doc says "${mismatched[0].subject}", set is "${set.name}"`)
    if (en[0]) enStyles.push({ pageId: p.pageId, suffixed: /\(EN\)\s*$/i.test(en[0].name) })

    // Leftovers: anything on the page that is not a section, and anything in a doc section that
    // is not a header, a panel or a doc frame. Recorded, never removed.
    const leftovers = [
      ...p.top.filter(([, type]) => type !== "SECTION").map(([id, type, name]) => ({ id, type, name, where: "page" })),
      ...p.sections.flatMap((s) => s.children
        .filter(([, type, name]) => !(type === "INSTANCE" && name === "Design system header") && !(type === "FRAME" && name === "Component Name") && !(type === "FRAME" && /documentation/i.test(name)))
        .map(([id, type, name]) => ({ id, type, name, where: s.name }))),
    ].map((x) => ({ ...x, url: link(x.id) }))
    if (leftovers.length) flags.push(`leftover-nodes: ${leftovers.length}`)
    const placeholder = p.sections.filter((s) => /^-{3,}/.test(s.name.trim()))
    if (placeholder.length) flags.push(`placeholder-section-name: "${placeholder[0].name}"`)

    const nameIssues = pageNameIssues(p.page)
    if (nameIssues.length) flags.push(`page-name-format: ${nameIssues.join(", ")}`)
    const count = countInName(p.page)
    if (count.value === null) flags.push("no-count-in-name")
    else if (count.value !== blocks.length) flags.push(`count-mismatch: name says ${count.value}, Figma has ${blocks.length}`)
    if (parts.length) flags.push(`helper-sets: ${parts.map((s) => s.name).join(", ")}`)
    for (const x of extras) flags.push(`${EXTRA_SETS[x.id].flag}: ${x.name}`)
    if (owner.active === false) flags.push(`owner-left: ${owner.name}`)

    const setRow = (s) => ({ id: s.id, name: s.name, url: link(s.id), variants: s.variants, axes: { ...(s.types.length ? { Type: s.types.map((t) => t[0]) } : {}), ...s.axes }, hasDescription: s.desc > 0 })
    families.push({
      id: p.pageId,
      section: sec.key,
      family: set.name,
      page: { id: p.pageId, name: p.page, display: meta.display, url: link(p.pageId) },
      status: meta.status,
      ready: READY(meta.status),
      tail: meta.tail,
      owner: { initials: meta.initials, ...owner },
      count: { inName: count.value, source: count.source, counted: blocks.length, matches: count.value === null ? null : count.value === blocks.length },
      set: setRow(set),
      parts: parts.map((s) => ({ ...setRow(s), role: "helper" })),
      extraSets: extras.map((s) => ({ ...setRow(s), note: EXTRA_SETS[s.id].note })),
      breakpoints: set.axes.Breakpoint,
      directions: set.axes.Direction,
      rtl: set.axes.Direction.includes("RTL"),
      docs: {
        en: en[0] ? { id: en[0].id, name: en[0].name, url: link(en[0].id) } : null,
        ar: ar[0] ? { id: ar[0].id, name: ar[0].name, url: link(ar[0].id) } : null,
        duplicates: [...en.slice(1), ...ar.slice(1)].map((d) => ({ id: d.id, name: d.name, url: link(d.id) })),
      },
      code: { prefix: prefix ?? null, built: blocks.filter((b) => b.code).length, of: blocks.length },
      blocks,
      leftovers,
      flags,
    })
  }

  // EN doc frames are named two ways in the file. Flag whichever style is the minority.
  const suffixed = enStyles.filter((s) => s.suffixed).length
  const minorityIsSuffixed = suffixed <= enStyles.length - suffixed
  for (const s of enStyles) if (s.suffixed === minorityIsSuffixed) families.find((f) => f.id === s.pageId).flags.push(`doc-name-style: EN frame ${s.suffixed ? "ends in" : "lacks"} "(EN)", unlike most`)

  if (registryNames) {
    for (const prefix of Object.values(CODE_PREFIX)) {
      const unclaimed = registryNames.filter((n) => n.startsWith(prefix) && !claimed.has(n))
      if (unclaimed.length) throw new Error(`registry items with prefix "${prefix}" that no Figma Type maps to: ${unclaimed.join(", ")}`)
    }
  }
  const excludedMissing = EXCLUDED_BLOCK_PAGES.filter((x) => !families.some((f) => f.id === x.id))
  if (excludedMissing.length) throw new Error(`pages the atom index hands to the blocks index are not in it: ${excludedMissing.map((x) => x.id)}`)

  const all = families.flatMap((f) => f.blocks)
  const ready = families.filter((f) => f.ready)
  return {
    $meta: {
      source: `Figma · Fasla · ${FILE_KEY}`,
      fileKey: FILE_KEY,
      target: "blocks",
      measured: process.env.INDEX_MEASURED || new Date().toISOString().slice(0, 10),
      generatedBy: ".agents/skills/figma-index (read-only use_figma page walk, target: blocks) → design/scripts/build-blocks-index.mjs",
      scope: {
        rule: "every page after each section header, up to the next header or divider page (a blank or \"---\" name); the E-commerce section must end on Gift Cards",
        onDisagreement: "the build throws and names the pages; it never guesses",
        sections: SECTIONS.map((s) => ({ key: s.key, title: s.title, header: s.header, headerUrl: link(s.header), ...(s.endsAt ? { endsAt: s.endsAt } : {}) })),
        shape: "every page in scope must hold exactly one component set with Type × Breakpoint × Direction; helper sets (no Type, no Breakpoint) are recorded as parts; any other set stops the build unless it is listed in EXTRA_SETS",
      },
      readiness: LEGEND.readiness.blocks,
      counts: {
        sections: SECTIONS.length,
        families: families.length,
        readyFamilies: ready.length,
        blocks: all.length,
        readyBlocks: ready.reduce((a, f) => a + f.blocks.length, 0),
        variants: families.reduce((a, f) => a + f.set.variants, 0),
        withEnDoc: families.filter((f) => f.docs.en).length,
        withArDoc: families.filter((f) => f.docs.ar).length,
        blocksInCode: all.filter((b) => b.code).length,
        familiesInCode: families.filter((f) => f.code.built).length,
        parts: families.reduce((a, f) => a + f.parts.length, 0),
        extraSets: families.reduce((a, f) => a + f.extraSets.length, 0),
        flagged: families.filter((f) => f.flags.length).length,
      },
      legend: LEGEND,
      codeMap: "CODE_PREFIX in design/scripts/build-blocks-index.mjs, keyed on the family set id; each Type maps to `${prefix}${slug(type)}`",
      siblingIndexes: { atoms: "design/index-atoms.json" },
      note: "Node ids are the only stable join key. A block's link opens its Desktop/LTR variant; the family set link opens the whole set.",
    },
    sections: SECTIONS.map((s) => {
      const fs = families.filter((f) => f.section === s.key)
      return { key: s.key, title: s.title, header: s.header, url: link(s.header), familyIds: fs.map((f) => f.id), blocks: fs.reduce((a, f) => a + f.blocks.length, 0) }
    }),
    families,
  }
}

/* ── Markdown ─────────────────────────────────────────────────────────────────────── */
export function renderMarkdown(ix) {
  const m = ix.$meta
  const notesPath = resolve(DESIGN, "index-blocks.notes.json")
  const notes = existsSync(notesPath) ? JSON.parse(readFileSync(notesPath, "utf8")) : {}
  const L = []
  const tick = (d) => (d ? `[✅](${d.url})` : "—")
  const c = m.counts
  L.push("# Fasla UI — blocks index", "")
  L.push("<!-- GENERATED FILE — do not edit by hand.")
  L.push("     Rendered from design/index-blocks.json by design/scripts/build-blocks-index.mjs.")
  L.push("     To refresh: run the `figma-index` skill (target: blocks), then `node design/scripts/build-blocks-index.mjs <capture.json>`. -->", "")
  L.push(`**Source** ${m.source}`, "")
  L.push(`**Measured** ${m.measured} · **Generated by** \`${m.generatedBy}\``, "")
  L.push(`**In scope** ${c.families} block families in ${c.sections} sections · ${c.blocks} blocks · ${c.variants} variants · ` +
    `**ready** ${c.readyFamilies} families (${c.readyBlocks} blocks) · EN doc ${c.withEnDoc} · AR doc ${c.withArDoc} · in code ${c.blocksInCode} blocks (${c.familiesInCode} family)`, "")
  L.push("> Figma is the source of truth. This file and `index-blocks.json` are the committed record of what it")
  L.push("> said on the measured date. Each block links to its Desktop/LTR variant; node ids are the only stable join key.", "")

  L.push("## Scope", "")
  L.push(`${m.scope.rule[0].toUpperCase()}${m.scope.rule.slice(1)}. If the rule and the file ever disagree, **${m.scope.onDisagreement}**.`, "")
  for (const s of m.scope.sections) L.push(`- **${s.title}** — header [${s.header}](${s.headerUrl})${s.endsAt ? `, ends on ${s.endsAt.name} (${s.endsAt.id})` : ""}`)
  L.push("", `Shape: ${m.scope.shape}.`, "")

  L.push("## Ready to build from", "")
  L.push(`A block family is **ready** when ${m.readiness}`, "")
  L.push("| Mark | Meaning | Settled by |", "|---|---|---|")
  const conf = m.legend.confirmedBy
  for (const k of ["🟢", "🟡", "🟠"]) L.push(`| ${k} | ${k === "🟢" ? "ready" : "in progress"} | ${conf[k] ?? (k === "🟢" ? "Yasmin, 2026-10-16 (blocks rule)" : "*inferred*")} |`)
  for (const [k, v] of Object.entries(m.legend.initials)) L.push(`| \`${k}\` | owner: ${v} | ${conf[k] ?? "*inferred*"} |`)
  L.push("")

  for (const s of ix.sections) {
    const fs = s.familyIds.map((id) => ix.families.find((f) => f.id === id))
    L.push(`## ${s.title}`, "")
    L.push(`${fs.length} families · ${s.blocks} blocks · header [${s.header}](${s.url})`, "")
    L.push("| Family | Status | Owner | Blocks | Name says | Variants | RTL | EN | AR | Code | Flags |")
    L.push("|---|---|---|---|---|---|---|---|---|---|---|")
    for (const f of fs) {
      L.push(`| [${f.family}](#${anchor(f.family)}) | ${f.status} ${f.ready ? "ready" : "in progress"} | ${f.owner.name ?? "—"}${f.owner.active === false ? " (left)" : ""} | ` +
        `[${f.count.counted}](${f.set.url}) | ${f.count.inName ?? "—"}${f.count.matches === false ? " ⚠️" : ""} | ${f.set.variants} | ${f.rtl ? "✅" : "—"} | ${tick(f.docs.en)} | ${tick(f.docs.ar)} | ` +
        `${f.code.built ? `${f.code.built}/${f.code.of}` : "—"} | ${f.flags.length || "—"} |`)
    }
    L.push("")
    for (const f of fs) {
      L.push(`### ${f.family}`, "")
      L.push(`[Figma page](${f.page.url}) \`${f.page.name.trim()}\` · [set \`${f.set.id}\`](${f.set.url}) · ` +
        `${f.breakpoints.join(" / ")} × ${f.directions.join(" / ")} · ${f.status} ${f.ready ? "**ready**" : "in progress"} · ` +
        `owner ${f.owner.name ?? "—"}${f.owner.active === false ? " (has left the project)" : ""}` +
        `${f.docs.en ? ` · [EN doc](${f.docs.en.url})` : ""}${f.docs.ar ? ` · [AR doc](${f.docs.ar.url})` : ""}`, "")
      if (f.flags.length) L.push(`Flags: ${f.flags.map((x) => `\`${x}\``).join(" · ")}`, "")
      for (const x of f.extraSets) L.push(`> [${x.name}](${x.url}) — ${x.note}`, "")
      for (const x of f.parts) L.push(`- Helper set (not a block): [${x.name}](${x.url}) — ${x.variants} variants, axes ${Object.keys(x.axes).join(" × ")}`)
      if (f.parts.length) L.push("")
      f.blocks.forEach((b, i) => {
        L.push(`${i + 1}. [${b.name}](${b.url})${b.code ? ` — \`${b.code}\`` : ""}${notes[b.nodeId] ? ` — ${notes[b.nodeId]}` : ""}`)
      })
      L.push("")
    }
  }

  L.push("## Needs attention", "")
  const byKind = {}
  for (const f of ix.families) for (const fl of f.flags) {
    const kind = fl.split(":")[0]
    ;(byKind[kind] ??= []).push(`[${f.family}](#${anchor(f.family)})${fl.includes(":") ? ` (${cell(fl.slice(kind.length + 1).trim())})` : ""}`)
  }
  if (!Object.keys(byKind).length) L.push("Nothing flagged.", "")
  else {
    L.push("| Flag | Families |", "|---|---|")
    for (const k of Object.keys(byKind).sort()) L.push(`| \`${k}\` | ${byKind[k].join(", ")} |`)
    L.push("")
  }
  const left = ix.families.filter((f) => f.leftovers.length)
  if (left.length) {
    L.push("### Leftover nodes", "", "Recorded, not removed.", "")
    L.push("| Family | Node | Type | Where |", "|---|---|---|---|")
    for (const f of left) for (const x of f.leftovers) L.push(`| ${f.family} | [${cell(x.name)}](${x.url}) | ${x.type} | ${cell(x.where)} |`)
    L.push("")
  }
  return L.join("\n") + "\n"
}

/* ── CLI ── (skipped when imported, e.g. by the freshness test) */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2]
  const jsonPath = resolve(DESIGN, "index-blocks.json")
  const mdPath = resolve(DESIGN, "index-blocks.md")
  let ix
  if (arg === "--render-only") ix = JSON.parse(readFileSync(jsonPath, "utf8"))
  else {
    if (!arg) { console.error("usage: build-blocks-index.mjs <capture.json> | --render-only"); process.exit(2) }
    const registry = JSON.parse(readFileSync(resolve(REPO, "packages/fasla-ui/registry.json"), "utf8"))
    try {
      ix = build(JSON.parse(readFileSync(resolve(process.cwd(), arg), "utf8")), { registry })
    } catch (err) {
      console.error(`\n✗ ${err.message}\n`)
      for (const k of ["pages", "missing", "unexpected", "offShape"]) if (err[k]?.length) console.error(`  ${k}:`, JSON.stringify(err[k], null, 2))
      process.exit(1)
    }
    writeFileSync(jsonPath, JSON.stringify(ix, null, 2) + "\n")
  }
  writeFileSync(mdPath, renderMarkdown(ix))
  const c = ix.$meta.counts
  console.log(`✓ blocks: ${c.blocks} blocks in ${c.families} families · ${c.variants} variants · ready ${c.readyFamilies} families / ${c.readyBlocks} blocks`)
  console.log(`  EN ${c.withEnDoc}  AR ${c.withArDoc}  code ${c.blocksInCode}  parts ${c.parts}  extra sets ${c.extraSets}  flagged ${c.flagged}`)
}
