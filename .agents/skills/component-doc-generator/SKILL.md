---
name: component-doc-generator
description: Generates a full Fasla component documentation page in Figma for an atom component, matching the house template used by Button, Badge, Avatar and Modal. The user names a component (e.g. "document the Tooltip", "make a documentation page for Select") and this builds the complete doc frame - Component Header card, properties table, anatomy (numbered pins + legend), layout & spacing (dimension lines + spec list), sizes, variant showcase (Light/Dark), states, radius and Do's & Don'ts, opened by a Design system header masthead - from live instances of the real variants, without altering the source component, then self-reviews against a reference doc. Produces English and Arabic (RTL, Modern Standard Arabic) docs, the Arabic in a separate frame built only after the English is approved. Use whenever the user wants a documentation page, spec sheet, or "documentation like the other components" for a design-system component. For blocks or patterns use blocks-documentation instead.
---

# Component Doc Generator

Builds a complete component documentation page in the Fasla Figma file, matching the exact template already used on the green-circle pages (Button, Icon Button, Avatar, Badge, Carousel, Alert Dialog, Modal). The user just names a component; you produce the full doc.

Requires the **Figma Console MCP** (`mcp__figma-console__figma_execute`) with the Desktop Bridge plugin connected. If a call returns "Cannot connect to Figma Desktop", ask the user to reopen **Plugins → Development → Figma Desktop Bridge**, then retry.

**Read `references/design-spec.md` and `references/build-recipes.md` before building** — they hold the exact type scale, colors, tokens, node structures, reference-doc IDs, and the `figma_execute` helper library you will paste into every build call. This SKILL.md is the workflow and judgment; those files are the precise measurements and code.

## The golden principle: match the house style exactly

These docs are a coherent set. A new doc that is 90% right but uses the wrong grey, a 24px heading instead of 26px, or 60px section gaps instead of 72px looks *off* next to the others. Fidelity is the whole point. Two habits keep you honest:

1. **Measure, don't guess.** Every value you need is in `design-spec.md`. When something isn't there, open the closest existing doc (IDs in the spec) and read the real node with `figma_execute` — never invent a number.
2. **Reuse real variants, don't redraw them.** Every component preview is a live **instance** of the actual component set's variant — never a hand-drawn rectangle. This is what the user means by "using the main component variants without attaching it": the source component set stays untouched in place; the doc only holds instances of it.

## All Figma API calls are async (dynamic-page)

Use `getNodeByIdAsync`, `getStyleByIdAsync`, `getLocalTextStylesAsync`, `getMainComponentAsync`, `setTextStyleIdAsync`, `variables.getVariableByIdAsync`, `variables.getLocalVariableCollectionsAsync`, `figma.loadAllPagesAsync()` before touching pages. Preload every font before setting `.characters` or you get a runtime error (see spec).

## Workflow

### Step 1 — Identify the component and gather its data

Given the component name, find its component set:
- `figma_search_components` or scan the pages (`figma.root.children`) for a page/section matching the name, then locate the `COMPONENT_SET` node.
- Confirm with the user if the name is ambiguous or you find several candidates (e.g. "Button" vs "Icon Button").

Then **read the set's structure** in one `figma_execute` — this is the raw material for the whole doc:
- `set.componentPropertyDefinitions` → property names, each `type`, `variantOptions`, `defaultValue`. This becomes the **Component Properties** table and drives which sections exist.
- The child variant names (`set.children[].name`) → the full `Prop=Val, …` matrix, so you know every combination available to instantiate.
- Walk one representative variant for **anatomy**: nested layers, TEXT nodes, nested INSTANCEs (via `getMainComponentAsync` + parent COMPONENT_SET name) → the parts to label.
- Auto-layout of one variant (`layoutMode`, padding, `itemSpacing`, `cornerRadius`, size) per size option → the **Layout & Spacing** and **Sizes** numbers.

Also note sub-components the doc should cover (e.g. Avatar's `Modifier / Indicator`, Badge's icon/avatar/close slots, Modal's Header + Footer Actions) — these get their own mini-section.

### Step 2 — Decide the section list

The canonical order is below. **Include a section only if the component actually has that dimension** — a component with no `Size` property gets no Sizes section; one with no `State` property gets no States section. Adapt, don't pad.

| # | Section | Include when |
|---|---------|--------------|
| 0 | **Masthead** — the "Documentation" wordmark, rendered by a LINKED instance of the `Design system header` component (`Type=Component Header`), placed at the TOP as the first flow child. Instantiate it, don't rebuild or detach. (In the reference it's technically the last child but `layoutPositioning='ABSOLUTE'` pins it to the top — placing it as the first in-flow child gives the same result and is simpler.) | always |
| 1 | **Component Header** (the `📃 Component Header` card) — directly below the masthead: a bordered white title card (radius 14, border `#e5e5e5`, padding `16/24`) holding a `#f4f4f5` **"Component" pill**, the component **name** (Inter Bold 40), and the 1-paragraph intro | always |
| 2 | **Component Properties** — table + variant-count info callout | always |
| 3 | **Anatomy** — numbered colored pins on a real instance + legend | always |
| 4 | **Layout & Spacing** — colored dimension lines + grouped spec list | always |
| 5 | **Sizes** — table, one row per size, with a live preview each | has a Size property |
| 6 | **Variants** — per-Type blocks: styles × Light/Dark | always (the heart of the doc) |
| 7 | **States** — one preview per state + effect caption | has a State property |
| 8 | **Border Radius** — Standard vs Fully previews + captions | has a Radius property |
| — | **Sub-component / Optional Slots** — mini-section | component has notable sub-parts/slots |
| 9 | **Do's & Don'ts** — 2-column tinted green/red grid; the last section (no separate footer — the masthead is the only `Design system header` instance) | always |

**RTL / Direction:** the English doc is LTR-only — do NOT add a standalone "Direction" section and keep the Variants previews in LTR. RTL lives in its own **separate Arabic documentation frame**, built in **Step 7 only after the English doc is approved**.

The intro paragraph should, like the originals, state what the component is for and end with the **variant math** ("… 5 types × 3 styles × 4 sizes … = 1,200 unique variants"). Compute the real product from the property definitions.

### Step 3 — Write the copy first

Draft all text before building, so the build call is pure assembly. For each section write: the H2, the one-sentence description, table cell values, anatomy legend lines, spacing key/values, and the Do/Don't pairs. Study how the existing docs phrase these — confident, specific, design-system voice (see the Button/Badge/Modal copy for tone). Do/Don't lists are **paired and semantic**: each "Do" has a matching "Don't", covering hierarchy, when-to-use, accessibility, direction/RTL, and misuse.

Keep the doc in LTR (RTL gets its own separate documentation — see the RTL note above). Only if a specific instruction asks for inline RTL, use real Modern Standard Arabic in the **Cairo** font (see Step 7) with the house translations: Submit→إرسال, Badge→شارة, Cancel→إلغاء, Continue/Delete→حذف, Title→عنوان, Description→محتوى الوصف.

### Step 4 — Build the frame

Place the doc on the component's own page (or a page the user names), inside a **Section**, to the right of existing content with clear space — never overlap (Figma Console housekeeping rule). Size the width so the body column fits the widest preview comfortably (Card = 1087 frame → 975 column; small components can be narrower).

**Structure the frame in two children** (see spec): the **masthead instance** first (fills the doc's inner width — full-bleed), then a transparent **content wrapper frame** with 36px horizontal padding that holds the Component Header card + every section. The masthead therefore spans wider than the indented body column.

Build with the helper library and per-section recipes in `references/build-recipes.md`. The reliable path:
- Paste the helper library at the top of each `figma_execute` call (define the `mk*` functions), build 2–3 sections per call with `timeout: 30000`, working top-down.
- For every preview, **instantiate the target set's variant** with `variantByProps(set, {…})` — never draw a mock. Frame Light and Dark previews side by side; set the Dark frame to the theme collection's Dark mode (see recipe `setMode`).
- Outer frame: VERTICAL, gap 72, padding top 20 / sides 20 / bottom 140, page-bg fill. Content wrapper: VERTICAL, gap 72, horizontal padding 36, transparent. Both masthead and wrapper are `FILL` width; sections inside the wrapper are `FILL` too.

### Step 5 — Verify (do not assume)

1. **Screenshot** the finished frame with `figma_take_screenshot` / `figma_capture_screenshot`. Check against a reference doc opened side by side: section rhythm (72px gaps), heading sizes, greys, table alignment, that Light/Dark previews actually differ, and that RTL previews mirror.
2. **Data audit**: confirm every preview is an INSTANCE of the target set (not a stray rectangle), the property table row count equals the real property count, and the variant-count math in the intro is correct.
3. Iterate up to ~3 passes fixing spacing/color/alignment drift, then show the user a screenshot.

### Step 6 — Self-review against the reference, then final retouch (do this every time)

Building the doc is not the end. Once it's assembled, **review the whole doc against a reference frame and correct anything that drifts** — this is where a good doc becomes an exact one. Treat the reference as the source of truth for structure and design; treat the target component's own property definitions as the source of truth for *which* sections apply and *what* the content says.

**Pick the reference.** Use the frame the user names; otherwise the canonical Button doc (`38807:10828`) or the closest finished green-circle doc by shape (small vs large-preview). Open it and read its structure with `figma_execute`.

Then walk this checklist, building an explicit discrepancy list (finding → reference says → doc has → fix), and fix every item before reporting:

1. **Section inventory & order.** Note the doc's two direct children are the masthead and the content wrapper — the sections live *inside* the wrapper, so traverse into it. List the reference's sections in order and the doc's sections in order. Every *required* section must be present and in the same relative order. Required = every "always" section (Component Header card, Properties, Anatomy, Layout & Spacing, Variants, Do's & Don'ts, Footer) **plus** each conditional section the component's properties call for (Sizes if it has a Size prop, States if a State prop, Border Radius if a Radius prop, a Sub-component/Slots mini-section if it has notable sub-parts). A conditional section the component doesn't need is correctly *absent* — don't add it, but do confirm the reason. Flag any missing required section, any extra section that shouldn't be there, and any out-of-order section.
2. **Top.** The doc must OPEN with the `Design system header` masthead instance (heading "Documentation", linked — verify visually via lowest `y`, not child index, since the reference pins it with `layoutPositioning='ABSOLUTE'`), immediately followed by the `📃 Component Header` title card (pill + name + intro). If the masthead is missing, hand-built instead of the real component, or sitting at the bottom, fix it. There is no separate footer.
3. **Per-section content correctness.** For each section, verify the information is right for *this* component, not copied from the reference: the Properties table lists the component's real properties/options/defaults; the variant-count math equals the true product; Anatomy pins/legend name this component's real regions; Layout & Spacing numbers come from this component's real geometry; Variants shows every real Type in Light+Dark using live instances; Do/Don't pairs are about this component.
4. **Design fidelity.** Compare against the reference: 26px bold H2s, the grey scale (`#09090b`/`#52525b`/`#71717a`/`#a1a1aa`), 72px section gaps, 14px card radii, the property-table/​info-callout/​pin-palette/​dimension-line/​spec-list/​Do-Don't treatments all matching the spec. Screenshot the doc and the reference and eyeball them side by side.
5. **Fix, then re-verify.** Apply every fix from the discrepancy list (rebuild sections *in place* with `insertChild(index, …)` so order is preserved — see the orphan/append gotchas in the recipes), re-screenshot, and confirm the discrepancy list is now empty. Finally, report the discrepancy list and what you changed.

The bar: someone placing the new doc next to the reference should not be able to tell they were made by different hands.

### Step 7 — Arabic (RTL) documentation — ONLY after the English doc is approved

Every component gets documentation in **both English and Arabic**. But these are two separate deliverables with a hard gate between them: the Arabic doc is built in its **own separate frame**, and only **after the English doc has been finalized, reviewed, and explicitly approved by the user.**

**The gate (do not skip).** When the English doc passes Step 6, stop and **ask the user**: *"The English documentation is finalized and self-reviewed. Do you want me to start the Arabic (RTL) version now?"* Then wait. Do **not** begin the Arabic doc until the user gives an explicit yes — they want to review and sign off on the English one first. If they say not yet, leave it; they'll ask when ready.

**Once approved, build the Arabic doc** as a brand-new frame (do not modify the English one) placed beside it, named e.g. `<Component> — Fasla Component Documentation (AR)`. It mirrors the English doc section-for-section, fully right-to-left and in **Modern Standard Arabic**:

- **Same structure, mirrored.** Same masthead → Component Header card → sections → (no footer), the same content-wrapper layout. Apply RTL to every frame: reverse horizontal auto-layout child order, flip `primaryAxisAlignItems` MIN↔MAX, on VERTICAL frames flip `counterAxisAlignItems` MIN↔MAX (right-align), swap asymmetric padding/corner-radii, and right-align text (`textAlignHorizontal='RIGHT'`). The `/figma:rtl-component-creator` skill has the exact `mirror()` recipe and font/style rules — reuse them.
- **Mirror `layoutMode:'NONE'` frames too — this is the #1 RTL bug.** Section header blocks, anatomy stages, and layout-annotation stages position their children *absolutely*, so the auto-layout `mirror()` never touches them and their headings/pins/dimension-lines stay stuck on the LEFT. Run a second pass over every NONE-layout frame flipping each child's x: `child.x = frame.width - child.x - child.width` (skip INSTANCE subtrees — they self-mirror). Without this, headings and diagram overlays do not move to the right even though the text is right-aligned.
- **When an approved English doc already exists, clone-and-transform instead of rebuilding:** clone the English frame, set `Direction=RTL` on every component-set preview instance (via `setProperties({Direction:'RTL'})` — skip sets with no Direction prop, e.g. Icon Button, which is symmetric), translate all free (non-instance) text to MSA (set `fontName` to **Cairo**, weight-mapped — do NOT swap to Tailwind AR/Almarai styles) + right-align, then run BOTH mirror passes (auto-layout + absolute). Far fewer calls than rebuilding ~10 sections, and it inherits the exact approved styling.
- **Real RTL variants.** Every preview instantiates the component's **`Direction=RTL`** variant (e.g. `Type=X, Direction=RTL`), not the LTR one flipped by hand. Same Light/Dark treatment.
- **Modern Standard Arabic text in the Cairo font.** Set `fontName` to **Cairo** directly on every translated doc-chrome node and on instance text you override (like the masthead `Heading`) — Geist/Inter don't render Arabic. Weight-map from the source font: `Semi Bold`→`SemiBold`, `Bold`→`Bold`, `Medium`→`Medium`, `Light`→`Light`, else `Regular` (preload those Cairo weights first). Do **not** swap to the `Tailwind AR/*` styles — those use Almarai; Cairo is the chosen doc font. Keep numeric measurements and units (`24px`, `14px`, `382px`) as-is; translate only words. Keep brand names, code tokens, and property option keywords (`LTR`, `RTL`, `Solid`…) untranslated where they're API values.
- **Doc-chrome translations** (Modern Standard Arabic):

  | English | Arabic |
  |---|---|
  | Documentation | التوثيق |
  | Component (pill) | مكوّن |
  | Component Properties | خصائص المكوّن |
  | Anatomy | البنية |
  | Layout & Spacing | التخطيط والتباعد |
  | Sizes | الأحجام |
  | Variants | المتغيّرات |
  | States | الحالات |
  | Border Radius | استدارة الحواف |
  | Usage Guidelines | إرشادات الاستخدام |
  | Property / Values / Default | الخاصية / القيم / الافتراضي |
  | ✓ Do / ✗ Don't | ✓ افعل / ✗ لا تفعل |
  | Direction / Alignment | الاتجاه / المحاذاة |
  | H Resizing / V Resizing | تحجيم أفقي / تحجيم عمودي |
  | Horizontal padding / Vertical padding | الحشو الأفقي / الحشو العمودي |
  | Region gap / Item gap | المسافة بين الأقسام / المسافة بين العناصر |
  | Border radius / Default width / Shape | استدارة الحواف / العرض الافتراضي / الشكل |
  | Light mode / Dark mode | الوضع الفاتح / الوضع الداكن |

  Translate section descriptions, anatomy part names/legend, spec labels, and the Do/Don't lines into natural MSA (not word-for-word). For component UI strings inside previews (Submit, Cancel, Title…) reuse the house translations in Step 3 / the rtl-component-creator skill.
- **Rebuild legends and annotation labels — don't rely on mirroring for them.** The mirror passes handle structural frames, but *loose/absolute annotation nodes collide when flipped*: the anatomy number-badge list (rows that wrap a NONE text container) ends up with badges overlapping titles, and the layout dimension-line swatch legend + height-bracket labels land off-frame or on top of each other. After mirroring, **rebuild these cleanly in RTL**: anatomy legend rows = HORIZONTAL `[right-aligned text column (fixed width), 22px number badge]` with the badge on the right and ~18px row spacing; the dimension-line swatch legend = a right-aligned row of `[label, colored 8px swatch]` items; reposition bracket labels just inside the frame beside their line (never at negative x). Verify by screenshot — badges/labels must never touch their text.
- **Self-review the Arabic doc too** (Step 6), comparing against the finished English doc as the reference: same sections in the same order, mirrored correctly (headings on the RIGHT — check by lowest-x, and confirm NONE-layout headers/pins actually flipped), every preview a real `Direction=RTL` instance (or unchanged if the set has no Direction), legends/annotations rebuilt with no overlaps, no leftover English UI text, and no text still on a `Tailwind En/*` (Latin) style.

## Cleanup on failed runs

Remove partial artifacts before retrying so you never leave orphaned frames:
```js
// remove a half-built doc by name
const p = figma.currentPage;
p.findAll(n => n.name.endsWith('— Fasla Component Documentation') && n.id !== keepId).forEach(n => n.remove());
```
Never create a second doc frame for the same component — edit the one in progress.
