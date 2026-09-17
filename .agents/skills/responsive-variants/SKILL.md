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
