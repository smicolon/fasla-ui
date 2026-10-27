---
name: figma-index
description: Regenerates the committed indexes of the Fasla Figma file — design/index-atoms.{json,md} (atoms) and design/index-blocks.{json,md} (block families). Use whenever an index is stale, whenever a pass adds or changes a component or block in the Figma file, or when an index-freshness test fails. Read-only against Figma; it never writes to the design file.
---

# figma-index — regenerate the committed component index

The Figma file is the source of truth. `design/index-<target>.json` is the committed record of
what it said at the last sync, and `design/index-<target>.md` is rendered from that JSON.

**Regenerating is deliberately cheaper than reconciling** — about seven read-only `use_figma`
calls, two or three minutes. Never patch either file by hand. Re-run this skill and let
`git diff` show what moved: **a dirty `git status` afterwards _is_ the drift report.**

Targets: `atoms` (the steps below) and `blocks` (its own scope rule, builder and verification —
see **Target: blocks** at the end). Run the target whose pages changed; they are independent.

## Split of responsibility — do not blur it

| Half | Lives in | Owns |
|---|---|---|
| **Capture** — which pages, which nodes, which fields | this file | reading Figma |
| **Derivation** — roles, flags, doc pairing, code map, Markdown | `design/scripts/build-index.mjs` | shaping the data |

Keeping them apart means a change of reading and a change of interpretation show up as
separate diffs. Put no derivation in the capture script and no Figma calls in the builder.

## Selection rule (atoms)

A page is in scope only if **both** signals agree:

1. the page name contains `🟢` **and** ends with `✅`
2. the page name does **not** match `/[-–—]\s*\d+\s*Blocks?/i`

Signal 1 alone is not enough: `✅` means *complete*, not *atom*, so a block page would leak in
the moment it is finished. Signal 2 is the guard.

**If the two ever disagree on a page — a `🟢…✅` page that also carries a `- N Blocks` suffix —
`build-index.mjs` throws and names it. Do not override it, do not hand-edit the capture. Stop
and ask the designer which index that page belongs to.** A settled answer goes into
`EXCLUDED_BLOCK_PAGES` in `build-index.mjs`, by page id, and into the `SKIP` list of the step 3
snippet below, so the builder drops the page and the verification hash skips it too. Settled so
far: `Error State - 28 Blocks` (`40935:43028`) is a block page — Yasmin, 2026-10-15; `Navbar`
(`4108:1605`) is a block page — Yasmin, 2026-10-27. Every other
`- N Blocks` page lacks a `✅`.

Out of scope, deliberately: test and scratch pages, section dividers, `⚛️ Component Atoms`, the
Lucide icon page (1,542 loose icons), and every block page.

Three pages are atoms by shape but excluded because their trailing marker is not `✅` —
`Footer 🔸`, `Card 🔸`, `File Input 🔺🔺`. That is the rule working as specified. If the
designer wants them in, the rule changes; do not special-case them.

## Steps

### 1. Capture (read-only)

Load the `figma-use` skill first. Then run this against `fileKey` `yGEQmCZOvs7KptsYUdB0Xg`,
in **two calls** — `k < 22` and `k >= 22`. One call over all 44 pages risks the internal timeout.

```js
const pick = figma.root.children.filter(
  p => p.name.indexOf('🟢') !== -1 && p.name.trim().slice(-1) === '✅'
)
const out = []
for (let k = 0; k < 22; k++) {            // second call: k = 22 … pick.length
  const p = pick[k]
  await p.loadAsync()                      // REQUIRED — an unloaded page returns a partial
  const sets = [], loose = [], docs = []   // and shrinking child list, so counts come out low
  const walk = (n, d) => {
    if (d > 5) return
    if (n.type === 'COMPONENT_SET') {
      const vg = n.variantGroupProperties || {}
      const axes = {}
      Object.keys(vg).forEach(a => { axes[a] = vg[a].values })
      sets.push({ id: n.id, name: n.name, variants: n.children.length, axes,
                  desc: (n.description || '').trim().length })
      return
    }
    if (n.type === 'COMPONENT') { loose.push({ id: n.id, name: n.name, desc: (n.description || '').trim().length }); return }
    if (n.type === 'INSTANCE') return      // never recurse into instances
    if ((n.type === 'FRAME' || n.type === 'SECTION') && /documentation/i.test(n.name))
      docs.push({ id: n.id, name: n.name, type: n.type })
    if ('children' in n) { for (const c of n.children) walk(c, d + 1) }
  }
  for (const c of p.children) walk(c, 0)
  out.push({ pageId: p.id, page: p.name, sets, loose, docs })
}
return out
```

Names carry leading and trailing spaces (` Button`, `alert `) and double spaces. **Capture them
verbatim** — the builder trims for display and flags the whitespace. Do not tidy them here.

Concatenate the two results into one JSON array and write it to your scratchpad. The array is
the capture; nothing else is.

### 2. Build

```bash
node design/scripts/build-index.mjs atoms /path/to/capture.json
```

Writes `design/index-atoms.json` and `design/index-atoms.md`. It throws rather than guesses if
the selection rule disagrees with itself or if a captured doc frame would be dropped.

### 3. Verify against Figma — mandatory

The capture passes through a chat transcript, so prove the committed file matches the live one.
Run this read-only, then compare to `$meta.counts` and the hashes:

```js
const SKIP = ['40935:43028', '4108:1605']              // EXCLUDED_BLOCK_PAGES in design/scripts/build-index.mjs
const pick = figma.root.children.filter(p => p.name.indexOf('🟢') !== -1 && p.name.trim().slice(-1) === '✅' && SKIP.indexOf(p.id) === -1)
const rows = [], docs = []
for (const p of pick) {
  await p.loadAsync()
  const walk = (n, d) => {
    if (d > 5) return
    if (n.type === 'COMPONENT_SET') { rows.push(n.id + '|' + n.name + '|' + n.children.length + '|' + Object.keys(n.variantGroupProperties || {}).join(',')); return }
    if (n.type === 'COMPONENT') { rows.push(n.id + '|' + n.name + '|1|'); return }
    if (n.type === 'INSTANCE') return
    if ((n.type === 'FRAME' || n.type === 'SECTION') && /documentation/i.test(n.name)) docs.push(n.id + '|' + n.name)
    if ('children' in n) { for (const c of n.children) walk(c, d + 1) }
  }
  for (const c of p.children) walk(c, 0)
}
rows.sort(); docs.sort()
const h = a => { let v = 0; const s = a.join('\n'); for (let i = 0; i < s.length; i++) v = (v * 31 + s.charCodeAt(i)) | 0; return v }
return { pages: pick.length, components: rows.length, docFrames: docs.length, componentHash: h(rows), docHash: h(docs) }
```

```bash
node design/scripts/verify-index.mjs atoms      # prints the same two hashes from the committed JSON
```

Both hashes must match. **If they do not, the transcription is wrong — fix the capture and
rebuild. Do not commit a mismatch and do not "explain" it in the PR.**

### 4. Run the test, then commit

```bash
bun run --cwd packages/fasla-ui test
```

Commit both generated files together with whatever moved in Figma. If nothing changed, there is
no diff and nothing to commit — that is a clean result, not a failed run.

## Things that will bite you

- **`await page.loadAsync()` per page.** Without it `page.children` is partial and shrinking, so
  the walk under-counts and it looks like work vanished.
- **Never recurse into `INSTANCE`.** It inflates counts and can damage the instance.
- **Ids are the only stable key.** Page order, page names and component names all drift. Three
  pages were deleted and two renamed *during* the session that first built this index.
- **`node.description` is the Figma description field.** 1 of 158 atoms has one — that is real,
  not a capture bug.
- **The family-page threshold is explicit** (`FAMILY_MIN` in the builder). Only
  `Components Skeleton` trips it today, with 87 interchangeable placeholders under one doc.
- **`CODE_MAP` is hand-maintained** and keyed on `{set, page}`, not name: the skeleton page holds
  placeholders literally named `button`, `input`, `badge`. Update it when a registry component is
  added or renamed — the builder cannot infer it.
- **Ask rather than guess.** Anything the rules cannot decide surfaces as `role: "unclassified"`
  or a flag. That is the intended output, not a defect to paper over.

## Optional: hand-written notes

If `design/index-atoms.notes.json` exists — `{ "<nodeId>": "note text" }` — the renderer appends
each note to that component's row. It is the only hand-authored input, and regeneration never
touches it. Everything else in both output files is generated.

---

## Target: blocks

`design/index-blocks.json` and `.md` — every block family under the two section headers, every
block (Type) linked to its Desktop/LTR variant, with status, owner, docs, code and flags.
Builder: `design/scripts/build-blocks-index.mjs` (imports the shared legend and page-name parsing
from `build-index.mjs`). Test: `packages/fasla-ui/src/design-index/index-blocks.test.ts`.

**Scope rule.** Every page after `🟡 Marketing UI Components ↴` (`40935:41137`) and after
`🟡 E-commerce UI Components ↴` (`43164:51148`), up to the next header (a name ending in `↴`) or
divider page (blank or `---`). The E-commerce section must end on `Gift Cards` (`43164:52345`).
The builder re-derives the scope from the page list, checks the capture against it, and throws if
a page appears after Gift Cards — ask the designer, do not move the anchor on your own.

**Ready** = the page's status emoji is 🟢, nothing else (Yasmin, 2026-10-16). There is no ✅
rule for blocks; it is deliberately different from the atom rule.

**Shape.** Each page must hold exactly one set with `Type × Breakpoint × Direction`. Sets with
neither `Type` nor `Breakpoint` are helper parts (Download's `Device Mockup`, `Store Badge`). Any
other set stops the build unless it is in `EXTRA_SETS` (today: `Banners — New Direction`, not
counted as blocks). The 14 set-per-block pages were consolidated on 2026-10-16; if a page ever
comes back in that shape the build names it and stops.

### B1. Capture (read-only) — about 8 calls

1. The page list, in order: `return figma.root.children.map(p => [p.id, p.name])`
2. The pages in scope, in **six calls** (`FROM/TO` = 0/6, 6/12, 12/18, 18/24, 24/31, 31/99) —
   larger batches exceed the 20 KB return limit:

```js
const FROM = 0, TO = 6
const HEADERS = ['40935:41137', '43164:51148']
const isHeader = n => n.trim().endsWith('↴')
const isDivider = n => n.trim() === '' || /^-+$/.test(n.trim())
const all = figma.root.children
const scope = []
for (const h of HEADERS) {
  let i = all.findIndex(p => p.id === h) + 1
  while (i < all.length && !isHeader(all[i].name) && !isDivider(all[i].name)) scope.push({ header: h, page: all[i++] })
}
const out = []
for (const { header, page: p } of scope.slice(FROM, TO)) {
  await p.loadAsync()
  const sets = [], docs = []
  const walk = (n, d) => {
    if (d > 6) return
    if (n.type === 'COMPONENT_SET') {
      const vg = n.variantGroupProperties || {}
      const axes = {}; for (const a of Object.keys(vg)) axes[a] = vg[a].values
      const types = []
      if (vg.Type) for (const t of vg.Type.values) {
        const vs = n.children.filter(v => v.variantProperties && v.variantProperties.Type === t)
        const dl = vs.find(v => v.variantProperties.Breakpoint === 'Desktop' && (v.variantProperties.Direction || 'LTR') === 'LTR') || vs[0]
        types.push([t, vs.length, dl ? dl.id : null])
      }
      sets.push({ id: n.id, name: n.name, parent: n.parent.id, variants: n.children.length, axes, types, desc: (n.description || '').trim().length })
      return
    }
    if (n.type === 'INSTANCE') return
    if (n.type === 'FRAME' && /documentation/i.test(n.name)) docs.push({ id: n.id, name: n.name })
    if ('children' in n) for (const c of n.children) walk(c, d + 1)
  }
  for (const c of p.children) walk(c, 0)
  const sections = p.children.filter(c => c.type === 'SECTION' && /documentation/i.test(c.name))
    .map(s => ({ id: s.id, name: s.name, children: s.children.map(c => [c.id, c.type, c.name]) }))
  out.push({ header, pageId: p.id, page: p.name, top: p.children.map(c => [c.id, c.type, c.name]), sections, sets, docs })
}
return { scopeSize: scope.length, from: FROM, to: TO, pages: out }
```

Write the capture as `{ "pageList": [...], "pages": [...] }` — the six `pages` arrays concatenated
in order. Copy names verbatim (trailing and double spaces are data; the builder flags them). A
set's `Type` values may be dropped from `axes` when writing it out, since `types` holds them in
the same order; the builder rebuilds `axes.Type` from `types`.

### B2. Build

```bash
node design/scripts/build-blocks-index.mjs /path/to/capture.json
```

It throws rather than guesses when the scope rule and the capture disagree, when a page is not
in the type-axis shape, when an unknown extra set appears, or when `CODE_PREFIX` and the registry
disagree. `design/index-blocks.notes.json` (`{ "<nodeId>": "note" }`) is the one hand-written
input; its notes are appended to the matching block row.

### B3. Verify against Figma — mandatory

```js
const HEADERS = ['40935:41137', '43164:51148']
const EXTRA = ['44907:354325']                       // EXTRA_SETS in design/scripts/build-blocks-index.mjs
const isHeader = n => n.trim().endsWith('↴')
const isDivider = n => n.trim() === '' || /^-+$/.test(n.trim())
const all = figma.root.children
const scope = []
for (const h of HEADERS) { let i = all.findIndex(p => p.id === h) + 1; while (i < all.length && !isHeader(all[i].name) && !isDivider(all[i].name)) scope.push(all[i++]) }
const sets = [], types = [], docs = []
for (const p of scope) {
  await p.loadAsync()
  const walk = (n, d) => {
    if (d > 6) return
    if (n.type === 'COMPONENT_SET') {
      const vg = n.variantGroupProperties || {}
      sets.push(n.id + '|' + n.name + '|' + n.children.length + '|' + Object.keys(vg).join(','))
      if (vg.Type && EXTRA.indexOf(n.id) === -1) for (const t of vg.Type.values) {
        const vs = n.children.filter(v => v.variantProperties && v.variantProperties.Type === t)
        const dl = vs.find(v => v.variantProperties.Breakpoint === 'Desktop' && (v.variantProperties.Direction || 'LTR') === 'LTR') || vs[0]
        types.push(n.id + '|' + t + '|' + vs.length + '|' + (dl ? dl.id : ''))
      }
      return
    }
    if (n.type === 'INSTANCE') return
    if (n.type === 'FRAME' && /documentation/i.test(n.name)) docs.push(n.id + '|' + n.name)
    if ('children' in n) for (const c of n.children) walk(c, d + 1)
  }
  for (const c of p.children) walk(c, 0)
}
sets.sort(); types.sort(); docs.sort()
const h = a => { let v = 0; const s = a.join('\n'); for (let i = 0; i < s.length; i++) v = (v * 31 + s.charCodeAt(i)) | 0; return v }
return { pages: scope.length, sets: sets.length, blocks: types.length, docFrames: docs.length, setHash: h(sets), typeHash: h(types), docHash: h(docs) }
```

```bash
node design/scripts/verify-index.mjs blocks
```

All three hashes must match. A mismatch means the transcription is wrong — fix the capture and
rebuild; never commit a mismatch.

### B4. Test, then commit

`bun run --cwd packages/fasla-ui test` — then commit `index-blocks.json` and `.md` together.

**Block-specific traps.** A page's `Component Name` panels can hold helper sets beside the
family set (Download). `CODE_PREFIX` is hand-maintained per family set id — add a family when its
blocks ship in code. Doc frames are named both with and without "(EN)"; the builder flags the
minority style instead of pairing by name, and pairs a misnamed doc (Order summary) with the
page's only family set.

