#!/usr/bin/env node
/**
 * Prints the fingerprints of a committed index so they can be compared against a fresh
 * read of Figma (step 3 of the `figma-index` skill).
 *
 *   node design/scripts/verify-index.mjs atoms
 *   node design/scripts/verify-index.mjs blocks
 *
 * The capture travels through a chat transcript to reach this repo, so "the numbers look
 * about right" is not evidence. These two hashes are.
 */
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const DESIGN = resolve(dirname(fileURLToPath(import.meta.url)), "..")

/** Same cheap rolling hash the Figma-side snippet uses; they must agree exactly. */
export const hash = (rows) => {
  const s = rows.join("\n")
  let v = 0
  for (let i = 0; i < s.length; i++) v = ((v * 31 + s.charCodeAt(i)) | 0)
  return v
}

/** Rebuilds the exact strings the Figma walk produces, so the two sides are comparable.
 *  Figma reports raw node names; the index stores them trimmed, so put the original back. */
export function fingerprints(ix) {
  const rows = Object.entries(ix.entries)
    .map(([id, x]) => `${id}|${x.rawName ?? x.name}|${x.variants}|${x.axisNames.join(",")}`)
    .sort()
  const docs = new Set()
  for (const p of ix.pages) {
    for (const d of p.legacyDocSections) docs.add(`${d.id}|${d.name}`)
    for (const d of p.orphanDocs) docs.add(`${d.id}|${d.name}`)
  }
  for (const x of Object.values(ix.entries)) {
    if (x.docs.en) docs.add(`${x.docs.en.id}|${x.docs.en.name}`)
    if (x.docs.ar) docs.add(`${x.docs.ar.id}|${x.docs.ar.name}`)
    for (const d of x.docs.duplicates) docs.add(`${d.id}|${d.name}`)
  }
  const docRows = [...docs].sort()
  return {
    pages: ix.pages.length,
    components: rows.length,
    docFrames: docRows.length,
    componentHash: hash(rows),
    docHash: hash(docRows),
  }
}

/** The blocks index, rebuilt into the rows the Figma-side snippet produces (skill, "Target:
 *  blocks", step 3). Sets: every captured set — family, helper parts and extra sets. Types: the
 *  family sets' Type values with their variant count and Desktop/LTR node. Docs: doc frames. */
export function fingerprintsBlocks(ix) {
  const sets = [], types = [], docs = []
  for (const f of ix.families) {
    for (const s of [f.set, ...f.parts, ...f.extraSets]) sets.push(`${s.id}|${s.name}|${s.variants}|${Object.keys(s.axes).join(",")}`)
    for (const b of f.blocks) types.push(`${f.set.id}|${b.name}|${b.variants}|${b.nodeId}`)
    for (const d of [f.docs.en, f.docs.ar, ...f.docs.duplicates]) if (d) docs.push(`${d.id}|${d.name}`)
  }
  sets.sort(); types.sort(); docs.sort()
  return { pages: ix.families.length, sets: sets.length, blocks: types.length, docFrames: docs.length, setHash: hash(sets), typeHash: hash(types), docHash: hash(docs) }
}

const target = process.argv[2] ?? "atoms"
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ix = JSON.parse(readFileSync(resolve(DESIGN, `index-${target}.json`), "utf8"))
  const f = target === "blocks" ? fingerprintsBlocks(ix) : fingerprints(ix)
  console.log(`index-${target}.json  (measured ${ix.$meta.measured})`)
  for (const [k, v] of Object.entries(f)) console.log(`  ${k.padEnd(14)} ${v}`)
  console.log(`\nThese must equal the values returned by step 3 of the figma-index skill${target === "blocks" ? " (target: blocks)" : ""}.`)
}
