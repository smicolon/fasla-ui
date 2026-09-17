# Doc spec — exact measurements

Reverse-engineered from the finished FAQ docs (2026-09-08), which are the reference implementation:
- **EN** `43269:15244` · **AR** `43435:26778`, both on the FAQ page inside the `FAQ Blocks
  Documentation` section.

When a value you need is not here, **open the reference doc and measure the real node** — never guess.

## Shell

**Doc frame** — VERTICAL · gap **64** · padding **[20, 20, 120, 20]** · fill `#FCFCFC` · radius 0 ·
width **1552** · `counterAxisSizingMode='FIXED'` · **`primaryAxisSizingMode='AUTO'`**.
Exactly two children: the masthead instance, then the body wrapper.

**Masthead** — a linked instance of `Design system header` (`38817:8061`), variant
**`Type=Component Header`** (`38817:8062`), created with `variant.createInstance()`, never detached.
Set its `Heading` TEXT layer to **"Documentation"** (AR: **«التوثيق»**, and switch that layer to
Cairo Medium with `textCase='ORIGINAL'`). First in-flow child, `layoutSizingHorizontal='FILL'`.

**Body wrapper** — name `Body` · VERTICAL · gap **64** · padding **[0, 36, 0, 36]** · no fill ·
`layoutSizingHorizontal='FILL'`. Everything except the masthead lives here. Sections measure **1440**
wide — which is what this spec's own arithmetic gives (1552 − 2×20 doc padding = 1512 body;
1512 − 2×36 body padding = 1440).

> **Canon, settled by Yasmin 2026-09-10:** **no frame stroke**, body **1512** / sections **1440** —
> as shipped by `Checkout` (EN `44096:26625`, AR `44133:46162`), `Logo Cloud` and `Order summary`
> (EN `44227:12463`). The older **FAQ** doc uses a 10 px inside stroke with body 1492 / sections 1420;
> that is the previous look and is **not** to be copied. Where FAQ and Checkout disagree, Checkout wins.

## Section shell

VERTICAL · gap **24**. First child `Header` (VERTICAL · gap **12**):
1. number TEXT — Inter Semi Bold **11**, `#A1A1AA`, letter-spacing 0.77 (AR: right-aligned)
2. `H2` frame → title — Inter Bold **26** / lh 39 (AR: Cairo Bold 26 / lh 42)
3. `P` frame → description — **15** / lh 24.75, `#52525B` (AR: Cairo 15 / lh 27)

**The description MUST go through the rich-text helper**, or `**bold**` renders as literal asterisks.
This bug shipped once.

## Block Header card (the Description — not a numbered section)

Outer VERTICAL · gap 16 · `primaryAxisAlignItems='CENTER'`
→ `Title` card: HORIZONTAL · padding **[16, 24, 16, 24]** · radius **14** · fill `#FFFFFF` ·
  1px border `#E5E5E5`
→ `Frame 1`: VERTICAL · gap **12** (AR also `counterAxisAlignItems='MAX'`) containing:
- **pill** — HORIZONTAL · padding [4, 11, 4, 11] · radius 6 · fill `#F4F4F5`; text Inter Medium 11 /
  lh 17, `#71717A`. Content is the **category only** — `Marketing block`. Never append the language.
- **block name** — Inter Bold **40** / lh 60, `#09090B`. **Stays Latin** and matches the Figma set
  name exactly, for traceability, in both language docs.
- **2–3 description paragraphs** — 16 / lh 27.2, `#52525B` (AR: Cairo 16 / lh 29). The variant-count
  line folds into the last paragraph; it is not a separate stat line.

## Stat strip (What you get)

HORIZONTAL · padding 1 (the 1px is the border) · radius 14 · `clipsContent` · fill `#FFFFFF` ·
border `#E4E4E7`. Four cells, each `layoutGrow=1` · VERTICAL · gap 6 · padding [22, 24, 22, 24]:
- big number — Inter Bold **34** / lh 40
- label — 13 / lh 19, `#52525B`
- divider: `strokeLeftWeight=1` `#F1F1F3` on every cell except the first
  (**AR: `strokeRightWeight` instead**, and cells `counterAxisAlignItems='MAX'`)

## Problem statement — one sentence

VERTICAL · padding [30, 34, 30, 34] · radius 14 · fill `#FAFAFA` · border `#E4E4E7`.
Text set larger so it reads as a statement: Inter Medium **20** / lh 32, `#18181B`
(AR: Cairo Medium 20 / lh 38). **One sentence. Never three.**

## Anatomy — the designer's layout, use this

Section VERTICAL gap 24 → **`Stage wrap`** directly (an earlier version of this line described an
intermediate `Container` HORIZONTAL wrapper — **neither the FAQ, Checkout nor Order summary docs, EN
or AR, has one**; corrected 2026-09-10 against `44227:12463` and `44133:46162`):
- `Stage wrap` — **1420 × 640** · `layoutMode='NONE'` · fill `#FAFAFA` · 1px border `#E4E4E7` ·
  radius 14
- inside it, **`Frame 3`** positioned at **(34, 64)** — 1353 × 511 · HORIZONTAL · gap **39**
- `Frame 3` children, in reading order:
  - **LTR:** `Frame 2` (stage, **943** × 511) then `Legend` (**371** × 488)
  - **AR:** `Legend` (**362**) then `Frame 2` — legend left, stage right
- the block **instance** is `rescale`d to **900** wide (factor 0.625 from 1440) and sits ~(21, 19)
  inside `Frame 2`
- **`Block bounds`** — 943 × 486 frame, no fill, 1.5px `#f97316`, `dashPattern=[3, 2]`, wrapping the
  instance

**Pin placement — this is the part that matters.** Pins do **not** sit in a rigid column. Each pin
sits **immediately beside the element it labels**, joined by a short dashed leader (**43 × 1**
rectangle, coloured to match the pin), so the pins fan diagonally as the content steps down. The
**container pin (last number) hangs BELOW the block** with a vertical leader running up to the
dashed bounds.

- pin size **24** in the stage, **22** in the legend badge
- palette, in order: `#e11d48` rose · `#7c3aed` violet · `#0ea5e9` sky · `#f59e0b` amber ·
  `#f97316` orange (orange is the container, matching `Block bounds`)
- **Vertical anchoring:** single-line slots → the slot's vertical **centre**; a repeating group →
  **top + ~14–18px**, so the pin heads the group instead of landing on an arbitrary row.
- Compute every position from `absoluteBoundingBox` relative to the instance, then **verify pin
  centres against the printed slot ranges** (see `references/audits.md`).
- **AR mirrors the x axis**: pins sit on the right of each element, leaders point left.

**Legend row** — HORIZONTAL · gap 12 · badge 22px + `t` (VERTICAL · gap 3):
- title — Inter Bold 14.5 / lh 21 (AR: Cairo Bold 14.5 / lh 24, and the slot's Latin layer name in
  brackets, e.g. «العنوان التمهيدي (Eyebrow)», so the designer can find the layer)
- description — rich text 13.5 / lh 20, `#52525b`, with the verdict **bolded as a lead-in**:
  `**Optional.** A short category label…` / `**Required. Repeats 4–10 times.** Each row is…`
- AR rows: append `t` **then** the badge, and `t.counterAxisAlignItems='MAX'`

## Steps (How to use it)

Outer VERTICAL · padding 1 · radius 14 · `clipsContent` · fill `#FFFFFF` · border `#E4E4E7`.
Each `Step` row: HORIZONTAL · gap 18 · padding [20, 24, 20, 24] · `counterAxisAlignItems='MIN'` ·
`strokeTopWeight=1` `#F1F1F3` on all but the first.
- number badge — 26px circle, fill `#18181B`, Inter Bold 12 white, centred
- title — Inter Bold 15 / lh 22 · description — 13.5 / lh 20.5, `#52525B`
- **AR: append the text column first, then the badge** (badge on the right)

## Tables

Outer VERTICAL · padding 1 · radius 14 · `clipsContent` · fill `#FFFFFF` · border `#E4E4E7`.
- head — HORIZONTAL · padding [12, 20, 13, 20] · fill `#FAFAFA`; labels Inter Semi Bold 11 / lh 16.5,
  `#A1A1AA`, letter-spacing 0.77, `textCase='UPPER'`
  (**AR: Cairo SemiBold 11, `textCase='ORIGINAL'` — Arabic has no uppercase**)
- rows — HORIZONTAL · padding [14, 20, 14, 20]; `strokeTopWeight=1` `#F1F1F3` on all but the first
- cells — fixed width: `c.counterAxisSizingMode='FIXED'; c.resize(w,10); c.primaryAxisSizingMode='AUTO'`
- cell text — 13.5 / lh 20; first column `#09090B` Medium, the rest `#52525B` Regular
- **AR: append columns in reverse so column 1 lands on the right, and every cell text must be
  explicitly `textAlignHorizontal='RIGHT'`** — a FIXED-width LEFT-aligned cell does not move when the
  row mirrors, it stacks on its neighbour.

Reference column widths (EN): manifest **260 / 500 / 642** · content limits **360 / 130 / 400 / 512**.

## Info callout

HORIZONTAL · gap 10 · padding [14, 18, 14, 18] · radius 10 · fill `#EFF6FF` ·
`counterAxisAlignItems='CENTER'`; `ℹ` glyph + text 15 / lh 22.5, `#1E40AF`.
**AR: append the text first, then the `ℹ`** so the glyph sits on the right. Keep `ℹ` on **Inter**.

## Do's & don'ts

HORIZONTAL · gap 16 · `counterAxisAlignItems='MIN'`. Two cards, each `layoutGrow=1` · VERTICAL ·
gap 12–14 · padding 22–23 · radius 12:
- **✓ Do** — fill `#f0fdf4` · border `#bbf7d0` · label `#16a34a`
- **✗ Don't** — fill `#fff1f2` · border `#fecdd3` · label `#dc2626`
- label — Inter Semi Bold 12, letter-spacing 0.96, `textCase='UPPER'`
  (**AR: Cairo, no uppercase, and the ✓ / ✗ glyph kept on Inter** — Cairo does not carry them)
- items — rich text 13 / lh 19.5, `#3f3f46`, each with a hairline bottom divider (black at 5%
  opacity, bottom side only), omitted on the last row. **Bold the key term in every line.**
- **AR: append the Don't card first, then Do** — Do ends up on the right

## Palette

| Role | Hex |
|---|---|
| page ground | `#FCFCFC` |
| card / table fill | `#FFFFFF` |
| sunken panel / stage | `#FAFAFA` |
| title, ink | `#09090B` · statement `#18181B` |
| body text | `#52525B` · list items `#3f3f46` |
| muted label | `#71717A` · table header `#A1A1AA` |
| border | `#E4E4E7` · card border `#E5E5E5` · row divider `#F1F1F3` |
| link | `#2563EB` |
| callout | fill `#EFF6FF` · text `#1E40AF` |

Doc chrome is **hardcoded hex, not `theme/*` tokens** — the previews are real instances and
self-style from their own bound variables. Never edit a preview's fills; if you need dark mode, set
the `☾ Mode` collection (`82:3`, Light `82:0` / Dark `3686:0`) on the wrapping frame.
