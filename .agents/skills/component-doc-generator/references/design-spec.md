# Fasla Documentation — Design Spec

Exact measurements for the doc template, reverse-engineered from the finished Button doc and cross-checked against Avatar/Badge/Carousel/Alert Dialog/Modal. When a value you need isn't here, open a reference doc (IDs below) and read the real node — never guess.

## Reference doc frame IDs (file-stable — safe to open and measure)

| Component | Doc frame ID | Width |
|-----------|--------------|-------|
| Button | `38807:10828` | 895 |
| Icon Button | `38812:16225` | 895 |
| Avatar | `40612:126718` | 895 |
| Badge | `38832:4920` | 895 |
| Default Input (Text Input) | `40600:101319` | 895 |
| Form | `43001:338129` | 1136 |
| Carousel | `38948:6088` | 1130 |
| Alert Dialog | `38958:1872` | 1130 |
| Modal | `38975:2941` | 1204 |

*Verified 2026-09-06: every ID above resolves except the old Avatar entry `38830:44141`, which was dead and has been
corrected to `40612:126718`. Re-query before trusting any of them.*

**Button is the canonical, most complete reference** (has every section). Use it as your structural model; use a wider one (Modal) when your component needs large previews.

## Fonts — preload ALL before setting any `.characters`

```js
for (const s of ['Regular','Medium','Semi Bold','Bold']) await figma.loadFontAsync({family:'Inter', style:s});
await figma.loadFontAsync({family:'Geist', style:'Medium'});
for (const s of ['Regular','Medium','SemiBold','Bold']) await figma.loadFontAsync({family:'Cairo', style:s}); // Arabic doc chrome (Cairo, not Almarai)
```

## Typography (chrome text is raw font settings, NOT shared styles)

| Role | Font | Size | Weight | Line height | Color hex |
|------|------|------|--------|-------------|-----------|
| Masthead wordmark "Documentation" (rendered by the `Design system header` component at the top — don't set manually beyond the `Heading` text) | Geist | 72 | Medium | auto | `#0A0A0A` |
| Component Header pill badge ("Component") | Inter | 11 | Medium | 17 | `#71717A` |
| Category eyebrow (other uses) | Inter | 11 | Semi Bold | 16.5 | `#71717A` |
| Component title | Inter | 40 | Bold | 60 | `#09090B` |
| Intro paragraph | Inter | 16 | Regular | 27.2 | `#52525B` |
| Section heading (H2) | Inter | 26 | Bold | 39 | `#09090B` |
| Section description | Inter | 15 | Regular | 24.75 | `#52525B` |
| Table column header (uppercase, tracked) | Inter | 11 | Semi Bold | 16.5 | `#A1A1AA` |
| Do ✓ label | Inter | 12 | Semi Bold | 18 | `#16A34A` |
| Don't ✗ label | Inter | 12 | Semi Bold | 18 | `#DC2626` |
| Info callout icon ℹ + text | Inter | 15 | Regular | 22.5 | `#1E40AF` |

**Preview labels use shared text styles** (so they inherit theme/typography), not raw fonts:
- `Tailwind En/SM/Medium` (14px) — button-sized labels
- `Tailwind En/XS/Medium` (12px) — badge-sized labels
- `Tailwind AR/SM/Medium`, `Tailwind AR/XS/Medium` — Arabic equivalents (Almarai)

Get style IDs via `getLocalTextStylesAsync()` and match by `.name`, then `node.setTextStyleIdAsync(id)`.

## Colors

**Doc chrome — hardcoded hex** (zinc scale; these are NOT theme tokens):
- Page background: `#FCFCFC`
- Title / heading text: `#09090B` (zinc-950)
- Body / description text: `#52525B` (zinc-600)
- Eyebrow / muted label: `#71717A` (zinc-500)
- Table header label: `#A1A1AA` (zinc-400)
- Card / table / rule border: `#E4E4E7` (zinc-200)
- Do green: `#16A34A` · Don't red: `#DC2626`
- Info callout: text/icon `#1E40AF`, background pale blue (`#EFF6FF`-ish; sample from reference)

**Component previews — theme/* semantic tokens (bound variables).** Because previews are real instances, they self-style from bound variables. You control light vs dark by setting the **mode** of the wrapping preview frame, not by editing fills. The light/dark modes live in the collection that OWNS the `theme/*` variables — in Fasla that is **"☾  Mode"** (`VariableCollectionId:82:3`, modes ⚪️ Light = `82:0`, 🌑 Dark = `3686:0`), NOT the collection literally named "🌈 Themes" (which has a single "Default" mode). Resolve it dynamically via the `themeCollection()` recipe rather than by name. Tokens the components use: `theme/background`, `theme/foreground`, `theme/card`, `theme/border`, `theme/primary`, `theme/primary-foreground`, `theme/secondary`, `theme/secondary-foreground`, `theme/muted`, `theme/destructive`, `colors/base/white`.

## Spacing & layout

**Outer doc frame:** VERTICAL auto-layout · itemSpacing **72** · padding top **222**, left/right **56**, bottom **140** · fill `#FCFCFC` · corner radius 0 · `counterAxisSizingMode='FIXED'` (width), `primaryAxisSizingMode='AUTO'` (hugs height). Width = content-column width + 112. Pick the column to fit the widest preview: 895 → 783 column (Button/Icon Button/Avatar/Badge/Default Input), 1130 → 1018, 1204 → 1092, 1136 → 1024 (Form, whose 448-wide previews sit two-up in Light + Dark).

**There is NO content-wrapper frame.** Verified 2026-09-06 against the finished Default Input doc (`40600:101319`) and corrected here — an earlier revision of this spec described a transparent "Frame 4" wrapper with 36px padding, and that does not exist in any shipped doc. The doc's children are, in order: the **masthead instance** then the `📃 Component Header` card then one `Section` frame per section, all direct children set to `layoutSizingHorizontal='FILL'`.

*Correction 2026-09-07 (Command Menu pass): the "NO wrapper" rule above is true of Default Input
but is NOT the house-wide pattern — it was generalised from a single doc. **Both shapes ship.**
Re-verified live against three finished docs:*

| *Doc* | *Id* | *Shape* |
|---|---|---|
| *Modal* | `38975:2941` | *masthead ABSOLUTE + one `Container` wrapper (1148 wide, gap 72)* |
| *Button* | `38807:10828` | *has a `Container` wrapper (895 wide, gap 72, 8 children), plus two stray empty `Container`s* |
| *Default Input* | `40600:101319` | *no wrapper — masthead + `📃 Component Header` + 8 `Section`s as direct children* |

*So **always traverse into a `Container` child if one is present** before concluding a doc has no
sections — a Step 6 section inventory that assumes direct children finds nothing on a wrapped doc.
When building, follow whichever reference you are modelling: the wide/Modal-shaped docs wrap, the
895-wide Default Input does not. The Command Menu doc (`43188:522`) wraps, matching its Modal model.*

**The masthead is positioned ABSOLUTELY, not in flow.** Append the `Design system header` instance to the doc, then set `layoutPositioning='ABSOLUTE'`, `resize(docWidth-40, h)`, `x=20`, `y=20`. It renders 156px tall, so the doc's 222px top padding clears it with a 46px gap and the body column below starts at the 56px inset — which is what makes the masthead read full-bleed (wider than the body) without any wrapper.

**Top = Design system header masthead, then the Component Header title card.**

*Masthead (opens the doc)* — a LINKED instance of the house **`Design system header`** component set (`38817:8061`), variant **`Type=Component Header`** (`38817:8062`), via `variant.createInstance()` — never detached. Set its big `Heading` text layer (Geist 72) to **"Documentation"** (`const h=inst.findOne(n=>n.type==='TEXT'&&n.name==='Heading'); await figma.loadFontAsync(h.fontName); h.characters='Documentation';`), then set `layoutPositioning='ABSOLUTE'`, `resize(docWidth-40, inst.height)`, `x=20`, `y=20` (see above — it is NOT an in-flow child, so `layoutSizingHorizontal='FILL'` does not apply). Keep default boolean props (Logo/Chips/Description). Resolve the set by name (`Design system header`) via search in case IDs differ, falling back to these IDs. (In the shipped docs it is child index 0 with `layoutPositioning='ABSOLUTE'` at `(20,20)`. There is no separate footer.)

*Component Header title card (`📃 Component Header`, directly below the masthead)* — hand-built to match the reference exactly: an outer VERTICAL frame (gap 16, `primaryAxisAlignItems='CENTER'`) → a `Title` card (HORIZONTAL, padding `16/24`, corner radius 14, fill `#ffffff`, border `#e5e5e5`) → a `Frame 1` (VERTICAL, gap 15) containing:
- a **pill badge** `Text` (HORIZONTAL, padding ~`4/11`, corner radius 6, fill `#f4f4f5`) with the category label **"Component"** (Inter Medium 11, `#71717a`);
- the component **name** (Inter Bold 40, line-height 60, `#09090b`);
- the **intro** paragraph (Inter Regular 16, line-height 27.2, `#52525b`) ending in the variant math — set it to `FILL` width.

The "Documentation" wordmark appears ONCE, in the masthead at the top. There is no bottom footer.

**Section wrapper:** VERTICAL auto-layout · itemSpacing **28** (header block → content). Contains a header Container then content Container(s). Horizontal rules (1px `#E4E4E7`) separate stacked variant blocks inside the Variants section.

**Section header block:** VERTICAL, gap 16 — an H2 frame then a Paragraph frame. (Component Header block gap is also 16: eyebrow → title → intro.)

**Property table:** outer Container VERTICAL, padding 1 (the 1px = border), corner radius **14**, border `#E4E4E7`. First row is a GRID header, padding `11/18/12/18`, 3 equal columns (Property · Values · Default). Each data row is a Container of 3 Text cells, same column widths, ~1px divider between rows.

**Info callout:** HORIZONTAL, gap 10, padding `14/18/…/18`, corner radius 10, pale-blue fill; ℹ glyph + one line of blue text. Used to state the total variant count and any key rule.

**Do's & Don'ts:** two **tinted cards** side by side (16px gap), each VERTICAL gap 14, padding `23/23/1/23`, corner radius 12, 1px border:
- ✓ Do card — fill `#f0fdf4` (green-50), border `#bbf7d0` (green-200), label `#16a34a`
- ✗ Don't card — fill `#fff1f2` (rose-50), border `#fecdd3` (rose-200), label `#dc2626`

Column label is a `Heading 4`: `✓ Do` / `✗ Don't`, Inter Semi Bold 12, **UPPERCASE** (`textCase='UPPER'`), letter-spacing `0.96px`. Below it a `List` (VERTICAL, gap 0) of `List Item` rows: no per-row box/fill — just body text (Inter 13 / line-height 19.5 / `#3f3f46`) with `13px` top+bottom padding and a **hairline bottom divider** (`#000000` at 5% opacity, bottom side only), omitted on the last row. **Bold the key term** in each line (variant name, property, or core concept) using the `richText` `**marker**` helper — this is a defining detail of the house style, don't skip it.

**Sizes table:** like the property table but columns are Size · Preview · Height · Padding X · Padding Y · Gap · Font · Radius (adapt columns to the component). The Preview cell holds a live instance of that size.

## Section content patterns (what each section says)

- **Component Properties** — one row per property: `Values` = the option list joined with ` · `; `Default` = the quoted default. Follow with the info callout stating total variant count = product of all variant-option counts.
- **Anatomy** — a two-column card (fill `#fafafa`, border `#e4e4e7`, radius 14, HORIZONTAL gap 56). LEFT: a live instance inside a `Stage` (NONE-layout) frame, wrapped by a **dashed container box** (stroke `#f97316`, dash `[3,2]`, radius ~18) and overlaid with **numbered colored pins** (circular frames, white 2px ring on-component) each joined to its part by a **dashed leader line** in the pin's color. RIGHT: a legend `List` (VERTICAL gap 20) of rows = a 22px colored number badge + (bold 15 `#09090b` title / 14 `#52525b` desc). **Pin palette, in order:** `#e11d48` `#7c3aed` `#0ea5e9` `#f59e0b` `#f97316` (rose, violet, sky, amber, orange). Number the sub-regions 1..n and give the whole-component Container the last number + the dashed box. Compute each pin's Y from the real region geometry (`region.y + region.height/2`), don't eyeball.
- **Layout & Spacing** — same two-column card (HORIZONTAL, `primaryAxisAlignItems='SPACE_BETWEEN'`). LEFT: an annotated `Stage` — the instance inside a **fuchsia dashed bounding box** (stroke `#d946ef` dash `[5,4]`, fill `#fdf4ff`, radius 20), with **colored dimension lines + px labels** drawn as thin rectangles: **Horizontal padding = red `#ef4444`**, **Vertical padding = blue `#3b82f6`**, **Item/region gap = green `#22c55e`** (dashed), plus a **height bracket in violet `#7c3aed`** (line + end caps + `<h>` / `px` labels). Below the stage, a swatch **legend**: three 9px squares + labels (`#71717a` 11px) for Horizontal padding / Vertical padding / Item gap. RIGHT: a **grouped spec list** (see below). Draw dimension lines from real geometry.

**Spec list (Layout & Spacing right column)** — VERTICAL gap 20 of groups. Each group: an UPPERCASE header (Inter Semi Bold 11, `#a1a1aa`, letter-spacing 0.77) then key/value rows. Row = HORIZONTAL `SPACE_BETWEEN`, padding `6/0/0/0`, hairline bottom divider `#f4f4f5` (omit on the group's last row), **key** in Inter Regular 13 `#52525b`, **value** in **JetBrains Mono Medium 12 `#18181b`**. House groups: **LAYOUT** (Direction, Alignment, H/V Resizing), **SPACING** (the paddings + gaps; call it "MD SPACING" only if the component has sizes), **SHAPE** (border radius, key dimension). Load `JetBrains Mono` (fallback to Inter if unavailable).
- **Sizes** — intro sentence recommending a default size; table row per size with real numbers pulled from each size variant.
- **Variants** — one block per `Type` value. Each block: a `Type: X` label + one-sentence rationale, then previews across the other axes (Style, and Light/Dark). Keep LTR only — RTL is documented separately. Include icons/badges where the component supports them.
- **States** — one instance per state using a fixed reference variant (e.g. Solid Primary md), each captioned with the visual effect: Enabled "Default state", Hover "brightness(0.88)", Focus "2px ring offset", Disabled "opacity: 0.5", Clicked "scale(0.96)".
- **Border Radius** — Standard vs Fully previews with captions and the CSS value (`border-radius: 8px` / `border-radius: 9999px`).
- **Do's & Don'ts** — paired lines; cover: one-primary-per-view hierarchy, secondary/tertiary usage, destructive/semantic consistency, accessibility (labels/tooltips), RTL/direction matching, and not-relying-on-color-alone.

## Component sets used as live previews inside a doc

The Button doc instantiates: ` Button`, `Badge`, `Avatar`, and icon sets `heart`, `star`, `x`. Your doc will instantiate the **target** set plus, where relevant, `Badge`/`Avatar`/icons for slots. Look up sets by name with `figma_search_components` or by walking pages. Note some set names have a leading space (e.g. ` Button`).
