---
name: figma-index
description: Regenerates the committed index of Fasla design-system components in Figma — design/index-atoms.json and design/index-atoms.md. Use whenever the index is stale, whenever a pass adds or changes a component in the Figma file, or when the index-freshness test fails. Read-only against Figma; it never writes to the design file.
---

# figma-index — regenerate the committed component index

The Figma file is the source of truth. `design/index-<target>.json` is the committed record of
what it said at the last sync, and `design/index-<target>.md` is rendered from that JSON.

**Regenerating is deliberately cheaper than reconciling** — about seven read-only `use_figma`
calls, two or three minutes. Never patch either file by hand. Re-run this skill and let
`git diff` show what moved: **a dirty `git status` afterwards _is_ the drift report.**

Targets: `atoms` (built). `blocks` is reserved — the per-block marketing pages are mid-
consolidation and get their own index later, with its own selection rule.

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
and ask the designer which index that page belongs to.** As of 2026-09-23 there are no
disagreements: 44 pages qualify, and every `- N Blocks` page lacks a `✅`.

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
const pick = figma.root.children.filter(p => p.name.indexOf('🟢') !== -1 && p.name.trim().slice(-1) === '✅')
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
