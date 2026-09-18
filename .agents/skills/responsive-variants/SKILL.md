---
name: responsive-variants
description: Create Tablet and Mobile variants of final, approved desktop block components in the SMI-UI Figma file. Use when the designer asks to make blocks/components responsive, add tablet or mobile versions, adapt layouts to breakpoints, or add a Breakpoint variant. Runs ONLY on final-approved desktop components — never during a component-blocks build session. Adds Desktop/Tablet/Mobile as a Breakpoint variant property on each block's component set, bound to the 💻 Responsive collection.
---

# Responsive Variants — SMI-UI breakpoint pass (team skill)

Turns **final, approved** desktop block components into responsive component sets with a
`Breakpoint` variant property (Desktop / Tablet / Mobile). It is the responsive sibling of
the RTL variant skill and follows the same lifecycle: **build → approve → variant pass**.
"The designer" means whoever invoked the skill — ask them via AskUserQuestion.

**Prerequisites**: load `figma-use` (mandatory before any `use_figma` call) and
`figma-generate-design`. Token rules are identical to `component-blocks` — colors and
radius bind ONLY to the `☾  Mode` collection (`VariableCollectionId:82:3`), spacing to
`💨 Tailwind` (`VariableCollectionId:82:261`), NEVER to `🌈 Themes` (identically-named
variables exist in both ☾ Mode and 🌈 Themes — always resolve within a collection by
`v.variableCollectionId === collection.id`, never by bare name).

---

## The 💻 Responsive collection (the source of breakpoint truth)

`VariableCollectionId:9118:18734`, modes **🖥️ Web / 💻 Tablet / 📱 Mobile**:

| Variable | Web | Tablet | Mobile | Notes |
|---|---|---|---|---|
| `block-width` | 1440 | 768 | 360 | direct FLOAT values |
| `horizontal-padding` | →spacing/8 (32) | →spacing/6 (24) | →spacing/4 (16) | aliases into 💨 Tailwind |
| `vertical-padding` | →spacing/24 | →spacing/16 | →spacing/8 | aliases |
| `section-spacing` | →spacing/24 | →spacing/16 | →spacing/12 | aliases |
| `font-size`, `line-hight` | per-breakpoint aliases | | | use where a text's size should step down |
| `button-size` | "lg" | "lg" | "lg" | informational (STRING — not bindable to variant props) |
| `❌ …`-prefixed vars | | | | deprecated — ignore |

**Mechanism**: bind block width / outer paddings to these variables, then give each variant
an explicit collection mode: `node.setExplicitVariableModeForCollection(respCollection,
modeId)` — Web mode on the Desktop variant, Tablet on Tablet, Mobile on Mobile. Bound
properties then re-flow automatically if the collection's values ever change.

---

## Non-negotiables

1. **The desktop design is frozen.** Never modify the desktop component's internals —
   tablet/mobile are built on CLONES. (Re-parenting the desktop component into the new
   component set via `combineAsVariants` is allowed and expected — it preserves the design
   pixel-for-pixel and keeps existing instances linked.)
2. **Explicit final-approval gate** (Phase 0): list the exact target components and get the
   designer's confirmation that they are final before touching anything.
3. All `component-blocks` build rules apply to the new variants: no layer named "Frame"
   (use semantic names or `Container`), nested frames FILL by default, texts FILL whenever
   the parent has defined width, colors/radius from ☾ Mode, spacing from 💨 Tailwind,
   instances for everything the design system provides.
4. Adaptations are **proposed and approved before building** — one proposal round for all
   blocks, ≤3 lines per block per breakpoint.
5. Raise problems the moment they happen (AskUserQuestion) — the report has zero surprises.
6. Re-discover target components **by name**, never by stored ids — ids change when frames
   are converted to components or content is reorganized between sessions.

---

## Phase 0 — Scope & final-approval gate

1. Ask which components to make responsive (or confirm the list the designer gave).
2. Locate each by name; screenshot the set of targets (thumbnails) and confirm:
   "These desktop components are final — no further desktop changes expected?" If anything
   is still in flux, stop; run this skill after it settles.
3. Confirm both breakpoints are wanted (Tablet 768 + Mobile 360) or a subset.

## Phase 1 — Read the desktop truth

Per target component (read-only): structure via `get_metadata`/inspection — child order,
sizing modes, bindings, internal grids/rails, text styles. This is the source for
adaptation decisions; never work from memory of a past session.

## Phase 2 — Adaptation proposals (approved before building)

Propose per block × breakpoint, using this playbook as the default vocabulary:

**Tablet (768)**
- Side rails: drop below the main column (or 2-col grid if content allows).
- Outer horizontal padding steps to `horizontal-padding` (24); section gaps to
  `section-spacing`.
- Multi-tile rows: 2-up wrap. Cards/lists go full-width. Banners keep aspect ratio.
- Type scale: unchanged unless a heading visibly overpowers the narrower column.

**Mobile (360)**
- Single column, everything stacks; rails under content.
- Date-gutter rows → stacked meta (date chip inline with title block).
- Button rows → full-width stacked buttons; trailing actions wrap under content.
- Thumbnails: move above/below text or shrink; avatar stacks shrink (24px, −8 overlap).
- Day tabs / segmented controls: allow horizontal scroll or reduce visible tabs — propose.
- Headings step down one size (e.g. 3XL→2XL); body stays; long meta lines wrap.
- Outer padding 16 via `horizontal-padding`.

Present via AskUserQuestion in batches; build only what is approved.

## Phase 3 — Build (one variant per use_figma call)

For each approved block × breakpoint:
1. Clone the desktop component's content (`comp.clone()` gives a frame copy) — never edit
   the original. Guard against duplicates from timed-out calls (search by name first).
2. Resize the clone to the breakpoint width; apply the approved adaptation (reorder,
   re-wrap, restack). Remember: clones keep `layoutPositioning:"ABSOLUTE"` → set `"AUTO"`
   after re-parenting; `resize()` resets FILL → resize first, then re-apply sizing modes.
3. Bind the variant's width to `block-width` and outer paddings to `horizontal-padding` /
   `vertical-padding` where the block has them; set the explicit 💻 Responsive mode for the
   variant (Tablet or Mobile).
4. `get_screenshot` at native width; check clipped text, overflow, wrap quality, dead
   whitespace. Fix before moving on.

## Phase 4 — Combine into component sets

1. Rename: desktop component → `Breakpoint=Desktop`, clones → `Breakpoint=Tablet`,
   `Breakpoint=Mobile` (the `Prop=Value` name format is what `combineAsVariants` reads).
2. `figma.combineAsVariants([desktop, tablet, mobile], parent)` — the set takes the block's
   name; keep it at the desktop component's canvas position.
3. Set the Desktop variant's explicit 💻 Responsive mode to Web.
4. Verify existing instances of the desktop component survived linked and unchanged
   (spot-check one if any exist).
5. If the block later gets RTL variants, `Direction` composes with `Breakpoint` on the same
   set — coordinate property names with the RTL skill.

## Phase 4.5 — Automated audit (mandatory)

Same audit as `component-blocks` over every NEW variant, plus responsive checks:
zero "Frame" names; FILL rules; colors/radius on ☾ Mode; spacing on 💨 Tailwind;
width/padding bound to 💻 Responsive vars where approved; explicit modes set per variant
(Web/Tablet/Mobile); desktop variant byte-identical in design (only re-parented).
Fix everything before reporting.

## Phase 5 — Review & report

Full screenshots of each component set (all three variants side by side), audit counts,
what was adapted per block, and any approved deviations — all previously raised.

---

## Corrections — verified 2026-09-17 on `Creative Hero` ⚠️

This section overrides anything above it that contradicts it.

**1. There is no approval gate in this pass.** Phases 0 and 2 above describe a final-approval gate and
an adaptation-proposal round. Neither applies in this repo: `design/FIGMA.md` ("Working style") says to
build directly, and `fasla-blocks-agent` explicitly makes pass 2 *report without gating* because its
output is re-verified by the Gate 2 audits after RTL. Pick a defensible default, state it in one line,
keep moving. Keep the read-only Phase 1 — it is still mandatory.

**2. A block family is already one set — do not `combineAsVariants`.** Phase 4 above assumes loose
desktop components. A family that came through `component-blocks-update` is a single `COMPONENT_SET`
with a `Type` axis, so the path is: rename each existing variant to `Type=X, Breakpoint=Desktop`
(which creates the axis), then `variant.clone()` → rename → `SET.appendChild` → pin the mode → place on
the grid. The desktop variants keep their node ids and every existing instance stays linked.

**3. Bind block padding to `block-horizontal-padding`, not `horizontal-padding`.** The table above
lists `horizontal-padding` (32 / 24 / 16) — that is the *inner* control padding. Marketing block roots
use **`block-horizontal-padding`** `VariableID:42351:296148` (**96 / 64 / 32**) with
`vertical-padding` `VariableID:9118:18911` (96 / 64 / 32) and `block-width`
`VariableID:10288:173929` (1440 / 768 / 360). Content widths after padding: **1248 / 640 / 296**.
`block()` already binds all of these, so cloning and pinning the mode re-resolves them for free — a
correctly built family needs **no** padding or width edits in this pass.

**4. A padding audit must accept `VariableCollectionId:9118:18734`.** Those root paddings are bound
into `💻 Responsive` by design. An audit that only accepts `💨 Tailwind` reports 4 false failures per
variant. Audit padding as `if (!boundVariables[k])` — never `if (n[k] > 0 && !boundVariables[k])`, or a
raw zero is invisible.

**5. Step type with a HUG measurement.** `textAutoResize = 'WIDTH_AND_HEIGHT'` is silently ignored on a
TEXT that FILLs an auto-layout parent, so a stepper that reads `width` after setting it always returns
the largest size in the ramp. Set `layoutSizingHorizontal = 'HUG'`, read `width`, then restore FILL
(or `resize(maxW, h)` for a FIXED text). Hug width respects explicit `\n`, so it measures the longest
authored line.

**6. Screenshot new variants through the Desktop Bridge.** `figma_capture_screenshot` renders freshly
appended set children correctly (live runtime `exportAsync`); the official `get_screenshot` returns 1×1
and inline `node.screenshot()` returns blank until Figma saves. `format` **and** `scale` are both
required. Resize the set explicitly after appending — a set clips, and anything past its bottom edge
exports as a blank ~149-byte PNG.

**7. Order the reflow: structure → type step → explicit sizes → stale-height pin → audits.** Explicit
sizes go **last** — a height set before the reflow is recomputed from the desktop ratio and silently
reset. After any `layoutMode` flip, re-assert every child's `layoutSizingHorizontal/Vertical`: FILL
children freeze at a collapsed height and no overflow detector sees it. Never `HUG` a
`layoutMode: 'NONE'` frame (it collapses to 1px and deletes the photo) — `resize()` it explicitly.
`resize()` also reverts FILL to FIXED, so re-apply sizing after every resize, then re-assert the height.

**8. Photographs must be re-cropped per breakpoint, not just resized.** `scaleMode: 'FILL'` centres the
crop, so a near-square hero stacked into a landscape frame loses the subject's head. Use
`scaleMode: 'CROP'` with a top-anchored `imageTransform` on the clone; read the natural size with
`figma.getImageByHash(hash).getSizeAsync()`. Nothing in the token or overflow audits catches this —
only a screenshot does.

**9. A stage that scales cards cannot scale text.** When a `layoutMode: 'NONE'` composition wraps a
copy column, scaling every coordinate by one factor destroys the column's clearance, because text
height does not shrink with the stage. Scale card *size* and *x* by `contentW / 1248`, then solve the
vertical factor `f` from the clearance you need — e.g. `cardBottom·f + 24 ≤ (stageH·f − contentH) / 2`.
Position rotated children by **bounding box** (`n.x += (parentAbs.x + tx) − n.absoluteBoundingBox.x`),
never by `x`/`y`, and re-read `absoluteBoundingBox` to verify.
