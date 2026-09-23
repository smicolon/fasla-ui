#!/usr/bin/env node
/**
 * Builds a Fasla design-system index from a raw Figma capture.
 *
 *   node design/scripts/build-index.mjs atoms <capture.json>   # capture -> .json + .md
 *   node design/scripts/build-index.mjs atoms --render-only    # .json   -> .md
 *
 * Figma is the source of truth. `design/index-<target>.json` is the committed record of
 * what it said at the last sync; `design/index-<target>.md` is rendered from that JSON and
 * is never hand-edited. Everything below is derivation — the capture step (which pages,
 * which nodes) lives in `.agents/skills/figma-index/SKILL.md`, so the two halves can be
 * audited separately.
 *
 * Regeneration is deliberately cheap (~7 read-only MCP calls). Re-run it rather than
 * patching either file by hand: a dirty `git status` afterwards IS the drift report.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const DESIGN = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const REPO = resolve(DESIGN, "..")
const FILE_KEY = "yGEQmCZOvs7KptsYUdB0Xg"

/* ── Selection rule ────────────────────────────────────────────────────────────────
 * A page is in scope for the atom index only if BOTH signals agree:
 *   (1) the page name carries 🟢 AND ends with ✅
 *   (2) the page name carries no "- N Blocks" suffix
 * (1) alone would leak block pages in the moment they are finished and earn a ✅.
 * If the two ever disagree on a page, the build STOPS and names it — it does not guess. */
export const GREEN_TICK = (name) => name.includes("🟢") && name.trim().endsWith("✅")
export const BLOCK_SHAPED = (name) => /[-–—]\s*\d+\s*Blocks?\b/i.test(name)

/* ── Status legend ─────────────────────────────────────────────────────────────────
 * Inferred from usage across all 133 pages, NOT from a written source. Recorded in the
 * JSON as `confirmed: false` until the designers sign it off. */
export const LEGEND = {
  confirmed: false,
  note: "Inferred from usage across the whole file on 2026-09-23; not yet confirmed by Yasmin or Haneen.",
  status: {
    "🟢": "work on this page is done",
    "🟡": "in progress",
    "🟠": "queued / not started — every 🟠 page lacks documentation",
    "🔴": "not started",
    "❌": "cancelled or removed",
  },
  trailing: {
    "✅": "signed off — a second gate beyond 🟢; the atom index keys on this",
    "🔸": "meaning unknown (only on Footer and Card)",
    "🔺🔺": "meaning unknown (only on File Input)",
    "🙋": "meaning unknown (only on Case Study Cards)",
  },
  initials: { Y: "Yasmin", H: "Haneen", "Y/H": "both" },
  prefix: { "✦": "marks a component page (not a status)" },
}

/** Registry item -> the Figma component set it is implemented against.
 *  Hand-maintained and deliberately explicit. Keyed on {set, page} rather than name alone:
 *  the "Components Skeleton" page holds 87 loading placeholders literally named `button`,
 *  `input`, `badge` …, so a name-only lookup matches the wrong node.
 *  `null` means the registry item has no Figma counterpart in scope — either none exists
 *  (all seven effects components) or its page fails the selection rule. */
export const CODE_MAP = {
  avatar: { set: "Avatar", page: "3710:7318" },
  badge: { set: "Badge", page: "3724:120666" },
  button: { set: "Button", page: "1:3" },
  checkbox: { set: "Check Box", page: "3830:5150" },
  combobox: { set: "Combobox", page: "14852:8647" },
  input: { set: "Default Input", page: "3882:2381" },
  radio: { set: "Radio", page: "3830:60584" },
  select: { set: "Select Input", page: "3884:9073" },
  skeleton: { set: "Skeleton", page: "14860:69258" },
  switch: { set: "Switch", page: "3862:3097" },
  tabs: { set: "Tabs Component", page: "3808:12668" },
  textarea: { set: "Textarea", page: "3975:63617" },
  "data-table": { set: "Table", page: "14885:1510" },
  navbar: { set: "Navbar", page: "4108:1605" },
  sidebar: { set: "Side Bar", page: "14889:866" },
  // No in-scope Figma atom:
  card: null,          // Figma page "✦ 🟢 Y | Card 🔸" has no trailing ✅
  "form-section": null, // Figma page "✦ 🟡 Y | Form" is 🟡, not 🟢+✅
  "app-shell": null, "empty-state": null, "page-header": null, "stats-card": null,
  "animated-gradient": null, "border-beam": null, "glow-card": null,
  "shimmer-button": null, spotlight: null, "text-reveal": null, "typewriter-text": null,
}

const FAMILY_MIN = 10
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "")
const link = (id) => `https://www.figma.com/design/${FILE_KEY}/?node-id=${id.replace(":", "-")}`
/** "Modal  — Fasla Component Documentation (AR)" -> { subject: "Modal", lang: "ar" } */
function parseDoc(name) {
  const lang = /\(AR\)\s*$/i.test(name) ? "ar" : "en"
  const subject = name
    .replace(/\((AR|EN)\)\s*$/i, "")
    .split(/\s+[—–-]\s+/)[0]
    .replace(/\s+Documentation\s*$/i, "")
    .trim()
  return { subject, lang, legacyName: /SMI[\s_-]?UI/i.test(name) }
}

function parsePage(name) {
  const status = ["🟢", "🟡", "🟠", "🔴", "❌"].find((e) => name.includes(e)) ?? null
  const trimmed = name.trim()
  const tail = trimmed.endsWith("✅") ? "✅" : (trimmed.match(/[^\w\s)\]]+$/)?.[0] ?? null)
  const bar = name.indexOf("|")
  const initials = bar > 0 ? (name.slice(0, bar).replace(/[^A-Za-z/]/g, "") || null) : null
  const display = (bar > 0 ? name.slice(bar + 1) : name)
    .replace(/[🟢🟡🟠🔴❌✅✦🔸🔺🙋]/g, "").replace(/\s+/g, " ").trim()
  return { status, tail, initials, display }
}

export function build(capture) {
  const conflicts = capture
    .filter((p) => GREEN_TICK(p.page) && BLOCK_SHAPED(p.page))
    .map((p) => ({ pageId: p.pageId, name: p.page }))
  const offRule = capture.filter((p) => !GREEN_TICK(p.page)).map((p) => ({ pageId: p.pageId, name: p.page }))
  if (conflicts.length || offRule.length) {
    const err = new Error("selection-rule disagreement — not guessing; resolve these pages first")
    err.conflicts = conflicts
    err.offRule = offRule
    throw err
  }

  const entries = {}
  const pages = []
  const codeByFigma = new Map(
    Object.entries(CODE_MAP).filter(([, v]) => v).map(([k, v]) => [`${v.page}|${norm(v.set)}`, k])
  )

  for (const p of capture) {
    const meta = parsePage(p.page)
    const docs = p.docs.map((d) => ({ ...d, ...parseDoc(d.name) }))
    // The old scheme was a SECTION called "{X} Documentation"; the current one is a
    // FRAME called "{X} — Fasla … Documentation". A page carrying both has a leftover.
    const legacySections = docs.filter((d) => d.type === "SECTION")
    const real = docs.filter((d) => d.type === "FRAME")
    const members = [
      ...p.sets.map((s) => ({ ...s, node: "COMPONENT_SET" })),
      ...p.loose.map((s) => ({ ...s, node: "COMPONENT", variants: 1, axes: {} })),
    ]

    // A "family page" is one whose members are interchangeable placeholders sharing an
    // identical axis signature, covered by a single doc (only "Components Skeleton" today).
    // The threshold is explicit rather than silent — see $meta.derivation.
    const sig = (m) => JSON.stringify(Object.keys(m.axes).sort())
    const isFamilyPage = members.length > FAMILY_MIN && new Set(members.map(sig)).size === 1
    // Does any set on this page share a name with an EN doc frame on it?
    const anyMatched = members.some((m) => real.some((d) => d.lang === "en" && norm(d.subject) === norm(m.name)))
    const hasOrphanEnDoc = real.some((d) => d.lang === "en" && !members.some((m) => norm(m.name) === norm(d.subject)))

    const pageEntryIds = []
    for (const s of members) {
      const key = norm(s.name)
      const enAll = real.filter((d) => d.lang === "en" && norm(d.subject) === key)
      const arAll = real.filter((d) => d.lang === "ar" && norm(d.subject) === key)
      const [en, ...enDup] = enAll
      const [ar, ...arDup] = arAll
      const axisNames = Object.keys(s.axes)
      const dir = s.axes.Direction ?? null
      const flags = []

      let role
      if (isFamilyPage) role = "family-member"
      else if (en || members.length === 1) role = "primary"
      else role = "part"
      // Several sets, none named like the page's doc frame: we cannot tell which set the
      // doc describes, so say so rather than pick one.
      if (!isFamilyPage && !anyMatched && members.length > 1) role = "unclassified"

      // Distinguish "there is no doc" from "the doc is there under a different name" —
      // the second is a rename, the first is missing work.
      if (role === "primary" && !en) flags.push(hasOrphanEnDoc ? "doc-name-mismatch" : "no-en-doc")
      if (role === "unclassified") flags.push("doc-name-mismatch")
      if (role === "primary" && en && !ar) flags.push("no-ar-doc")
      if (enDup.length || arDup.length) flags.push("duplicate-doc-frame")
      if (en?.legacyName || ar?.legacyName) flags.push("legacy-smi-ui-doc-name")
      if (legacySections.length) flags.push("legacy-doc-section-on-page")
      if (!dir) flags.push("no-direction-axis")
      else if (!dir.includes("RTL")) flags.push("no-rtl-value")
      if (!s.desc) flags.push("no-description")
      if (/\s{2,}/.test(s.name) || s.name !== s.name.trim()) flags.push("whitespace-in-name")

      entries[s.id] = {
        name: s.name.trim(),
        // Figma's own name, kept only when it differs, so verify-index.mjs can rebuild the
        // exact string the Figma-side walk hashes.
        ...(s.name === s.name.trim() ? {} : { rawName: s.name }),
        node: s.node,
        kind: "atom",
        role,
        page: { id: p.pageId, name: p.page, display: meta.display, status: meta.status, tail: meta.tail, initials: meta.initials },
        url: link(s.id),
        variants: s.variants,
        axes: s.axes,
        axisNames,
        rtl: Boolean(dir?.includes("RTL")),
        docs: {
          en: en ? { id: en.id, name: en.name, url: link(en.id) } : null,
          ar: ar ? { id: ar.id, name: ar.name, url: link(ar.id) } : null,
          // Extra frames matching the same set and language: a duplicate that needs
          // deleting. Kept so the index can point at the node, not just report a count.
          duplicates: enDup.concat(arDup).map((d) => ({ id: d.id, name: d.name, url: link(d.id) })),
        },
        code: codeByFigma.get(`${p.pageId}|${key}`) ?? null,
        hasDescription: s.desc > 0,
        flags,
      }
      pageEntryIds.push(s.id)
    }

    // Doc frames whose subject names no component set on their own page.
    const orphanDocs = real
      .filter((d) => !members.some((m) => norm(m.name) === norm(d.subject)))
      .map((d) => ({ id: d.id, name: d.name, url: link(d.id) }))

    pages.push({
      id: p.pageId, name: p.page, display: meta.display, status: meta.status,
      tail: meta.tail, initials: meta.initials, url: link(p.pageId),
      entryIds: pageEntryIds,
      legacyDocSections: legacySections.map((d) => ({ id: d.id, name: d.name })),
      orphanDocs,
    })
  }

  // Nothing captured may be silently dropped: every doc frame must be reachable from the
  // index, or a reader cannot act on it. (A duplicate EN frame was lost this way once.)
  const capturedDocs = new Set(capture.flatMap((p) => p.docs.map((d) => d.id)))
  const placedDocs = new Set()
  for (const x of Object.values(entries)) {
    if (x.docs.en) placedDocs.add(x.docs.en.id)
    if (x.docs.ar) placedDocs.add(x.docs.ar.id)
    for (const d of x.docs.duplicates) placedDocs.add(d.id)
  }
  for (const pg of pages) {
    for (const d of pg.orphanDocs) placedDocs.add(d.id)
    for (const d of pg.legacyDocSections) placedDocs.add(d.id)
  }
  const dropped = [...capturedDocs].filter((id) => !placedDocs.has(id))
  if (dropped.length) throw new Error(`doc frames captured but not placed in the index: ${dropped.join(", ")}`)

  const ids = Object.keys(entries)
  const claimed = new Set(ids.map((i) => entries[i].code).filter(Boolean))
  const unmappedCode = Object.keys(CODE_MAP).filter((k) => !claimed.has(k)).sort()

  return {
    $meta: {
      source: `Figma · Fasla · ${FILE_KEY}`,
      fileKey: FILE_KEY,
      target: "atoms",
      measured: process.env.INDEX_MEASURED || new Date().toISOString().slice(0, 10),
      generatedBy: ".agents/skills/figma-index (read-only use_figma page walk) → design/scripts/build-index.mjs",
      selectionRule: {
        inScope: "page name contains 🟢 AND page name ends with ✅",
        crossCheck: "page name must NOT match /[-–—]\\s*\\d+\\s*Blocks?/i",
        onDisagreement: "the build throws and names the pages; it never guesses",
        excluded: "test and scratch pages, section dividers, Component Atoms, the Lucide icon page, and every block page",
      },
      coverage: "walked all pages of the file; captured depth ≤5, INSTANCE subtrees skipped",
      derivation: {
        role: "primary = an EN doc frame on the page names this set, or it is the only component there; part = a sub-component of a primary; family-member = an interchangeable placeholder on a family page; unclassified = several sets and no doc frame names any of them — not guessed",
        familyPageThreshold: `more than ${FAMILY_MIN} members sharing one identical axis signature`,
        docCoverageDenominator: "primary components only — parts and family members are not expected to carry their own doc",
        codeMap: "hand-maintained in design/scripts/build-index.mjs, keyed on {set, page} because the family page reuses atom names",
      },
      counts: {
        pagesInScope: pages.length,
        entries: ids.length,
        primary: ids.filter((i) => entries[i].role === "primary").length,
        componentSets: ids.filter((i) => entries[i].node === "COMPONENT_SET").length,
        looseComponents: ids.filter((i) => entries[i].node === "COMPONENT").length,
        variants: ids.reduce((a, i) => a + entries[i].variants, 0),
        primaryWithEnDoc: ids.filter((i) => entries[i].role === "primary" && entries[i].docs.en).length,
        primaryWithArDoc: ids.filter((i) => entries[i].role === "primary" && entries[i].docs.ar).length,
        withEnDoc: ids.filter((i) => entries[i].docs.en).length,
        withArDoc: ids.filter((i) => entries[i].docs.ar).length,
        withRtl: ids.filter((i) => entries[i].rtl).length,
        withDescription: ids.filter((i) => entries[i].hasDescription).length,
        mappedToCode: ids.filter((i) => entries[i].code).length,
        docFrames: placedDocs.size,
      },
      legend: LEGEND,
      siblingIndexes: { blocks: "design/index-blocks.json — not built yet" },
      note: "Node ids are the only stable join key: page order, page names and component names all drift, and three pages were deleted mid-session while this was being read.",
    },
    unmappedCode,
    pages,
    entries,
  }
}

/* ── Markdown ─────────────────────────────────────────────────────────────────────
 * ~1 row per atom. The 87 loading-skeleton placeholders on one page collapse to a
 * single row; their detail stays in the JSON. */
const SKELETON_PAGE = "5357:51180"

export function renderMarkdown(ix) {
  const m = ix.$meta
  const notesPath = resolve(DESIGN, "index-atoms.notes.json")
  const notes = existsSync(notesPath) ? JSON.parse(readFileSync(notesPath, "utf8")) : {}
  const L = []
  const tick = (v) => (v ? "✅" : "—")
  const e = ix.entries

  L.push("# Fasla UI — atom index")
  L.push("")
  L.push("<!-- GENERATED FILE — do not edit by hand.")
  L.push("     Rendered from design/index-atoms.json by design/scripts/build-index.mjs.")
  L.push("     To refresh: run the `figma-index` skill, then `node design/scripts/build-index.mjs atoms <capture.json>`. -->")
  L.push("")
  L.push(`**Source** ${m.source}`, "")
  L.push(`**Measured** ${m.measured} · **Generated by** \`${m.generatedBy}\``, "")
  L.push(
    `**In scope** ${m.counts.pagesInScope} pages · ${m.counts.entries} components ` +
      `(${m.counts.componentSets} sets, ${m.counts.looseComponents} loose) · ${m.counts.variants} variants`,
    ""
  )
  L.push("> Figma is the source of truth. This file and `index-atoms.json` are the committed record of")
  L.push("> what it said on the measured date — they go stale the moment someone edits the file. Node ids are")
  L.push("> the only stable join key; page order and names both drift.")
  L.push("")

  L.push("## Selection rule", "")
  L.push(`A page is in this index only if **both** signals agree:`, "")
  L.push(`1. \`${m.selectionRule.inScope}\``)
  L.push(`2. \`${m.selectionRule.crossCheck}\` — the ✅ means *complete*, not *atom*, so this stops block pages leaking in once they are finished`)
  L.push("")
  L.push(`If the two ever disagree, **${m.selectionRule.onDisagreement}**.`)
  L.push("")
  L.push(`Excluded: ${m.selectionRule.excluded}.`, "")

  L.push("## Status legend", "")
  L.push(`> ⚠️ **Unconfirmed.** ${m.legend.note}`, "")
  L.push("| Mark | Where | Reading |", "|---|---|---|")
  for (const [k, v] of Object.entries(m.legend.status)) L.push(`| ${k} | status slot | ${v} |`)
  for (const [k, v] of Object.entries(m.legend.trailing)) L.push(`| ${k} | trailing | ${v} |`)
  for (const [k, v] of Object.entries(m.legend.initials)) L.push(`| \`${k}\` | owner slot | ${v} |`)
  L.push(`| ✦ | prefix | ${m.legend.prefix["✦"]} |`)
  L.push("")

  L.push("## Components", "")
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`
  L.push(
    `Of the **${m.counts.primary} primary** components — the ones a doc is expected for — ` +
      `${m.counts.primaryWithEnDoc} have an English doc and ${m.counts.primaryWithArDoc} an Arabic one. ` +
      `Across all ${m.counts.entries} entries, ${m.counts.withRtl} carry an RTL direction, ` +
      `${plural(m.counts.withDescription, "has", "have")} a Figma description, and ` +
      `${m.counts.mappedToCode} are implemented in the code registry.`,
    ""
  )
  L.push(`\`role\`: ${m.derivation.role}`, "")
  L.push("| Component | Page | Role | Variants | Axes | RTL | EN | AR | Code | Flags |")
  L.push("|---|---|---|---|---|---|---|---|---|---|")

  for (const pg of ix.pages) {
    if (pg.id === SKELETON_PAGE) {
      const ids = pg.entryIds
      const first = e[ids[0]]
      L.push(
        `| ${ids.length} × loading-skeleton placeholders *(collapsed — see JSON)* | [${pg.display}](${pg.url}) | part | ${ids.length * 2} | ` +
          `Direction | ${tick(first.rtl)} | ${tick(first.docs.en)} | ${tick(first.docs.ar)} | — | \`no-description\` |`
      )
      continue
    }
    for (const id of pg.entryIds) {
      const x = e[id]
      const axes = x.axisNames.length ? x.axisNames.join(", ") : "—"
      const note = notes[id] ? ` ${notes[id]}` : ""
      L.push(
        `| [${x.name}](${x.url})${note} | [${pg.display}](${pg.url}) | ${x.role} | ${x.variants} | ${axes} | ` +
          `${tick(x.rtl)} | ${x.docs.en ? `[✅](${x.docs.en.url})` : "—"} | ${x.docs.ar ? `[✅](${x.docs.ar.url})` : "—"} | ` +
          `${x.code ? `\`${x.code}\`` : "—"} | ${x.flags.filter((f) => f !== "no-description").map((f) => `\`${f}\``).join(" ") || "—"} |`
      )
    }
  }
  L.push("")

  const flagged = Object.entries(e).filter(([, x]) => x.flags.some((f) => f !== "no-description"))
  L.push("## Needs attention", "")
  if (!flagged.length) L.push("Nothing flagged.", "")
  else {
    const byFlag = {}
    for (const [id, x] of flagged)
      for (const f of x.flags) {
        if (f === "no-description") continue
        ;(byFlag[f] ??= []).push(`[${x.name}](${x.url})`)
      }
    L.push("| Flag | Components |", "|---|---|")
    for (const f of Object.keys(byFlag).sort()) {
      const v = byFlag[f]
      L.push(`| \`${f}\` | ${v.length > 10 ? `${v.length} components — see \`index-atoms.json\`` : v.join(", ")} |`)
    }
    L.push("")
  }

  const orphans = ix.pages.filter((p) => p.orphanDocs.length)
  if (orphans.length) {
    L.push("### Doc frames with no matching component set", "")
    L.push("| Doc frame | Page |", "|---|---|")
    for (const p of orphans) for (const d of p.orphanDocs) L.push(`| [${d.name}](${d.url}) | ${p.display} |`)
    L.push("")
  }

  const dupes = Object.values(e).filter((x) => x.docs.duplicates.length)
  if (dupes.length) {
    L.push("### Duplicate doc frames", "")
    L.push("A second frame documenting the same component in the same language — one of each pair should go.", "")
    L.push("| Component | Kept | Duplicate |", "|---|---|---|")
    for (const x of dupes)
      for (const d of x.docs.duplicates)
        L.push(`| [${x.name}](${x.url}) | ${x.docs.en?.name ?? x.docs.ar?.name} | [${d.name}](${d.url}) |`)
    L.push("")
  }

  const legacy = ix.pages.filter((p) => p.legacyDocSections.length)
  if (legacy.length) {
    L.push("### Leftover doc sections from the old naming scheme", "")
    L.push("| Section | Page |", "|---|---|")
    for (const p of legacy) for (const d of p.legacyDocSections) L.push(`| ${d.name} | ${p.display} |`)
    L.push("")
  }

  L.push("## Code registry with no in-scope Figma atom", "")
  L.push("Registry items that this index cannot point at — either they have no Figma counterpart at all")
  L.push("(the effects components), or their Figma page is out of scope under the selection rule.", "")
  L.push(ix.unmappedCode.map((c) => `\`${c}\``).join(" · "), "")

  return L.join("\n") + "\n"
}

/* ── CLI ── (skipped when imported, e.g. by the freshness test) */
const [, , target, arg] = process.argv
if (process.argv[1] === fileURLToPath(import.meta.url) && target) {
  if (target !== "atoms") { console.error(`unknown target "${target}" (only "atoms" exists today)`); process.exit(2) }
  const jsonPath = resolve(DESIGN, `index-${target}.json`)
  const mdPath = resolve(DESIGN, `index-${target}.md`)
  let ix
  if (arg === "--render-only") {
    ix = JSON.parse(readFileSync(jsonPath, "utf8"))
  } else {
    if (!arg) { console.error("usage: build-index.mjs atoms <capture.json> | --render-only"); process.exit(2) }
    try {
      ix = build(JSON.parse(readFileSync(resolve(REPO, arg), "utf8")))
    } catch (err) {
      if (err.conflicts || err.offRule) {
        console.error(`\n✗ ${err.message}\n`)
        if (err.conflicts?.length) { console.error("  Both a ✅ and a '- N Blocks' suffix:"); err.conflicts.forEach((c) => console.error(`    ${c.pageId}  ${c.name}`)) }
        if (err.offRule?.length) { console.error("  Captured but not 🟢+✅:"); err.offRule.forEach((c) => console.error(`    ${c.pageId}  ${c.name}`)) }
        process.exit(1)
      }
      throw err
    }
    writeFileSync(jsonPath, JSON.stringify(ix, null, 2) + "\n")
  }
  writeFileSync(mdPath, renderMarkdown(ix))
  const c = ix.$meta.counts
  console.log(`✓ ${target}: ${c.entries} components across ${c.pagesInScope} pages · ${c.variants} variants`)
  console.log(`  EN ${c.withEnDoc}  AR ${c.withArDoc}  RTL ${c.withRtl}  code ${c.mappedToCode}`)
}
