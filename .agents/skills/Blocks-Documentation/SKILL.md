---
name: Blocks-Documentation
description: Builds the house documentation frame for a finished Fasla block component set in Figma — a locked seven-section doc (What you get, Problem statement, Anatomy with numbered pins, How to use it, Composition manifest with live component links, Content limits, Do's & don'ts) opened by a Design system header masthead and a Block Header card. English/LTR frame first, then a separate mirrored Arabic (AR) frame in Modern Standard Arabic. Use whenever the user wants to document a block or pattern — "document the Hero block", "create docs for Pricing", "block documentation", "make a doc page for this block", "add the Arabic doc", "document these blocks like FAQ". For ATOM components (Button, Badge, Input) use component-doc-generator instead — blocks and atoms get different documents.
---

# Blocks-Documentation

Documents a **finished block** component set in the Fasla Figma file
(`yGEQmCZOvs7KptsYUdB0Xg`). Reference implementation — study it before building anything:

| | Frame | Node |
|---|---|---|
| English | `FAQ — Fasla UI Block Documentation (EN)` | `43269:15244` |
| Arabic | `FAQ — Fasla UI Block Documentation (AR)` | `43435:26778` |

Both sit inside the `FAQ Blocks Documentation` section on the FAQ page (`40935:42084`), beside the
motion frames.

**Blocks are not atoms.** A block doc is a decision document for someone using the block; an atom
doc is a props spec. They must not converge — atoms belong to `component-doc-generator`.

## Where this sits in the blocks pipeline

**Pass 4 of 4, and the last one.** A block family runs these as separate sessions; each hands off and
stops:

| Pass | Skill | Adds |
|---|---|---|
| 1 | `component-blocks-update` | the block itself — one component set, the `Type` axis |
| 2 | `responsive-variants` | `Breakpoint` = Desktop / Tablet / Mobile |
| 3 | `rtl-component-creator` | `Direction` = LTR / RTL |
| **4** | **`Blocks-Documentation`** ← this skill | the English doc frame, then the Arabic `(AR)` frame |

So by the time this skill runs, the set should already carry all three axes. **If `Breakpoint` or
`Direction` is missing, the earlier pass has not been run — stop and say which one**, rather than
documenting a set that is about to change shape. The Anatomy and Content limits both go stale the
moment an axis is added.

**Atoms do not come here.** An atom has a `Size` property rather than a `Breakpoint` axis, never runs
pass 2, and gets a props spec from `component-doc-generator` under the `fasla-atoms-agent` agent.

## Who it is written for

The designer who **licensed Fasla and is placing this block in their own file**. Write in plain
second person. They can choose, configure and fill — they cannot change the library. So:

- **Include** what they act on: which layout, how to use it, how much text fits, what breaks.
- **Include the Composition manifest** — not as internal trivia, but so they know what a library
  update touches and why detaching costs them those updates.
- **Exclude** what they cannot act on: ripple analysis, bound variable names, lifecycle status,
  agent/GenUI contracts, architecture notes, research sections.

## Prerequisites — verify, do not assume

1. **Desktop Bridge reachable.** `figma_get_status` with `probe:true`. A `probeResult.success:false`
   while the socket still reports connected means the plugin is wedged — tell the user to reopen
   **Plugins → Development → Figma Desktop Bridge**, and stop. Do not retry in a loop.
2. **Re-verify every node ID live** with `getNodeByIdAsync`. IDs in this skill, in memory, or in the
   user's prompt may be stale. Never build against a remembered ID.
3. **The block must be final.** Confirm the component set and report which variant axes exist
   (`Type` / `Breakpoint` / `Direction`). If `Breakpoint` or `Direction` is missing, **stop and say
   so** — the Anatomy and Content limits go stale the moment an axis is added later.
4. **Read the block before writing about it.** Walk a representative variant's tree for slot names,
   resolve every nested instance to its source set for the manifest, read the geometry at each
   breakpoint, and measure real text lengths. Everything in the doc comes from the file.
5. No `FIGMA_ACCESS_TOKEN` is configured — REST tools fail. Use the plugin bridge, and
   `figma_capture_screenshot` for verification.

## The locked structure

**Description is not a numbered section** — it merges into the Block Header card, under the title,
together with the variant-count line. The numbered run is **seven** sections, in this order:

| # | Section | Must answer |
|---|---|---|
| — | **Block Header card** | chip (category only) → block name → 2–3 description paragraphs ending in the variant maths |
| 01 | **What you get** | four-figure strip: layouts · screen sizes · themes · total variants |
| 02 | **Problem statement** | the user problem, in **one sentence**. Never three |
| 03 | **Anatomy** | numbered pins on a **live instance**, legend giving required / repeats / empty behaviour |
| 04 | **How to use it** | numbered steps from empty page to finished block |
| 05 | **Composition manifest** | Component (live link) · What it provides · Where it appears |
| 06 | **Content limits** | What · Required · Length · If yours is longer |
| 07 | **Do's & don'ts** | paired, enforceable rules |

Do not add, reorder or rename sections. **One document per direction** — the English frame covers
LTR/English only and carries no RTL section.

### Section notes that are easy to get wrong

- **02** is one sentence, set large as a pull-quote. If you have written three, cut two.
- **03 Anatomy** — the description must say what the numbers mark, that the legend gives
  required/repeat/empty behaviour, and that the other layouts share the structure. Naming the variant
  is not a description. Pins sit **beside the element they label**, not in a column; the container pin
  hangs **below** the block. Full geometry in `references/doc-spec.md`.
- **05 Composition manifest** — three columns, **no Node column**. The node ID becomes a live
  hyperlink on the component name, blue `#2563EB` + underline. Say "select a name to jump straight to
  that component" in the section description so the affordance is explained. Two targets need care:
  the icon set has no component set (point "Icon library" at the `Icon` frame `14580:339257`), and
  `" Button"` (`307:333`) has a **leading space** in its real name — display "Button", link the real
  id.
- **06 Content limits** — measured content plus roughly 25% headroom, expressed as words **and**
  characters, with an "if yours is longer" column rather than an overflow contract. **Limits are the
  designer's policy, not a fact in the file** — if you cannot derive one, ask, but ask once and in a
  single batch.
- **07** — every don't pairs with a do, and every line must be checkable by a reviewer who has never
  seen the block. "Don't overuse it" is not a rule.

### Excluded by design

No props table (that is an atom doc). No accessibility page — cite the W3C ARIA APG pattern and copy
its keyboard table verbatim; Fasla has no audit to publish and publishing a claim is worse than
publishing a link. No research & evidence section — there is no research team, and an empty section
lowers trust in every other section.

## Process

**Phase 1 — English frame.** Build sections 01–07 from the file. Verify (`references/audits.md`),
screenshot, hand it over, **stop for approval.**

**Phase 2 — Arabic frame.** Only after the English doc is approved. A separate frame, same structure,
mirrored and translated. See `references/arabic-doc.md`.

Between the two, expect a revision round on the English doc. Apply revisions **in place** on the same
frame rather than building a new version.

## Placement

- One doc frame per direction, each in its own section on the block's own page, or inside the block's
  existing documentation section beside the motion frames — match whatever that page already does.
- Name the frame `<Block> — Fasla UI Block Documentation` for English and `… (AR)` for Arabic. The
  block name stays Latin in both, matching the Figma set name.
- Place each frame **clear of everything already on the page**, including loose notes the designer
  left. If there is a collision, **move your own frame, never theirs.**
- Section-child coordinates are relative to the section — see `references/build-mechanics.md`, which
  is also where the timeout and `globalThis` traps live. Read it before your first build call.

## Never

- Modify, move or restyle the component set you are documenting. Previews are **instances**.
- Redraw a mock of the block. Every preview is a live instance of a real variant.
- Delete a node you did not create.
- Report a doc as finished on the strength of a screenshot. Run the audits and quote the numbers.

## References

- `references/doc-spec.md` — every measurement, colour and type setting
- `references/build-mechanics.md` — `figma_execute` traps: timeouts, `globalThis`, layout, placement
- `references/audits.md` — the seven data checks that catch what screenshots miss
- `references/arabic-doc.md` — Cairo, mirroring, what stays Latin, Arabic typesetting rules
