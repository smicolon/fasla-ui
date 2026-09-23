# FIGMA.md — Fasla UI

Technical reference for the Fasla design system **as it exists in Figma** — the file, its collections,
the tooling and the traps. It describes Figma work, not this repository's code; it is read when an
agent is pointed at it, not loaded automatically. The standing instructions that go with it are in
[INSTRUCTIONS.md](INSTRUCTIONS.md); the visual system itself is in [DESIGN.md](DESIGN.md).

## What this project is

**Fasla** (Arabic: **فاصلة**) — a Tailwind + shadcn/ui design system built **in Figma**, not in code.
It has light/dark theming and full LTR/RTL (English/Arabic) support. The project was renamed from
**SMI-UI / smicolon**; every new artifact carries the Fasla name.

- Figma fileKey: `yGEQmCZOvs7KptsYUdB0Xg`
- 922 variables / 5 collections · 140 text styles
- **Component counts here were stale by roughly 4× and have been removed.** The atoms are now
  indexed and verified in [`index-atoms.md`](index-atoms.md) (44 pages, 158 components, measured
  2026-09-23). File-wide totals including blocks are not yet verified — do not quote a number for
  them; walk the file or wait for `index-blocks.*`.

There is no npm project, no build, no test suite. "Running" this project means driving Figma through
MCP tools and verifying with screenshots. Do not look for package.json — the deliverable is Figma nodes.

## Working style (established, do not re-litigate)

Yasmin gives detailed directives up front; those *are* the spec. **Build directly** — do not open
approval checkpoints even when a skill prescribes one. Pick a defensible default, state it in one line,
and keep going; show progress as screenshots per block. Ask only what genuinely blocks work or is
irreversible (a variant axis name that would break instance overrides, a token that doesn't exist), and
batch those into one short question set early. If she re-sends an instruction unchanged after a
question, that means stop asking and build.

## The blocks build pipeline — four skills, in order

A block family goes through these as **separate sessions** — each skill hands off and stops — or
as one orchestrated run via the **`fasla-blocks-agent`** agent
(`~/.claude/agents/fasla-blocks-agent.md`), which chains all four with three approval gates:
after the blocks are built (before breakpoints and RTL multiply each one by six), after the RTL
pass (before documentation freezes the set), and after the English doc (before the Arabic one).
The agent resolves its own entry point from the axes already on the set, so it can pick up a
part-finished family rather than always starting at pass 1.

| Pass | Skill | Adds |
|---|---|---|
| 1. Desktop LTR blocks | `component-blocks-update` | the `Type` axis |
| 2. Breakpoints | `responsive-variants` | `Breakpoint` = Desktop / Tablet / Mobile |
| 3. Arabic | `rtl-component-creator` (or `figma-rtl-variant`) | `Direction` = LTR / RTL |
| 4. Docs | `Blocks-Documentation` | the English doc frame, then the Arabic `(AR)` doc frame |

**Docs are the one pass where blocks and atoms use different skills.** Blocks go to
`Blocks-Documentation` (seven locked sections, English frame then a mirrored Arabic frame; the FAQ
page is the reference implementation). Atoms go to `component-doc-generator`. A block doc is a
decision document for someone *using* the block; an atom doc is a props spec. They must not
converge — do not point a block at the atom skill, or an atom at this one.

**Atoms take a different route.** An atom has a `Size` property, not a `Breakpoint` axis, so it never
goes through `responsive-variants`. A finished atom runs the **`fasla-atoms-agent`** agent
(`~/.claude/agents/fasla-atoms-agent.md`) — RTL variants → English doc → Arabic doc, with designer
approval gates after the RTL pass and after the English doc. Those gates are the one deliberate
exception to the no-approval-gates rule; do not strip them.

**Skills are the source of truth; the agent is only an orchestrator.** The agent file holds no build
instructions — it names the phase order, the gates and the report format, and points at
`~/.claude/skills/{rtl-component-creator, component-doc-generator}/` by path. Fix a technique in the
skill and the agent picks it up with no syncing. Never copy skill content into the agent file.

`~/.claude/skills/component-blocks-update/SKILL.md` is the authoritative process document and
`references/file-inventory.md` next to it is the id cache. **The cache is not truth** — Figma ids drift;
re-query every id before relying on it, and write corrections back into that file.

## Non-negotiables

1. **Everything is token-bound.** Fills/strokes → `☾  Mode` `theme/*` via `setBoundVariableForPaint`.
   Padding + `itemSpacing` → `💨 Tailwind` `spacing/*`. Radius → `☾  Mode` `border radius/*` (all four
   corners). Type → `Tailwind En/*` styles. Shadows → `Light/shadow/*` effect styles. Never a raw value
   where a token exists; never bind to `html.to.design` or to a `❌`-prefixed deprecated variable.
2. **One component set per block family.** Twelve hero layouts = one `Hero` set with twelve `Type`
   values, never twelve components side by side. The set is the only place `Breakpoint` and `Direction`
   can attach later. Variant values are descriptive, never numbered.
3. **Reuse design-system components as instances.** Rebuilding something that exists (Modal, Accordion,
   Steps, Carousel, Progress, Tabs, Badge, Avatar, Inputs, Alert, Skeleton) by hand is a defect.
4. **Brand marks come from the `Social Icons` set (`40334:57763`)**, via its `Platform` property — never
   from the loose single-colour decoy glyphs that share the Icons page (`3637:6775`), never drawn.
   Google, Apple and Behance are **not** in the set — an SSO row is a stop-and-ask before you lay it out.
5. **Every brand name is `Fasla` (LTR) / `فاصلة` (RTL).** Never an invented filler brand (Acme, Your
   Brand), never mixed scripts. A leftover `SMI-UI` / `smicolon` / `;` logo is a **stop-and-ask, not a
   silent fix** — 111 known occurrences remain unresolved on two pages; do not sweep them.
6. **Light is the default mode.** Leave components on `inherit` for `☾  Mode`; fix any page-level pin
   with `page.clearExplicitVariableModeForCollection`. A block that should read dark gets that from
   `theme/background-inverse` + `foreground-inverse`, never from a Dark mode override.
7. **Never modify existing work in the file**, never edit component internals — instance overrides only.
8. **Raise problems the moment they happen**, not in the final report.

## Collections and modes

| Collection | Id | Modes |
|---|---|---|
| `☾  Mode` (note the two spaces) — semantic theme + radius | `VariableCollectionId:82:3` | `⚪️ Light` `82:0` (default) · `🌑 Dark` `3686:0` |
| `💨 Tailwind` — primitives | `VariableCollectionId:82:261` | `Default` `82:1` |
| `💻 Responsive` | `VariableCollectionId:9118:18734` | `🖥️ Web` `9118:0` · `💻 Tablet` `9118:1` · `📱 Mobile` `10280:0` |
| `🌈 Themes` — concrete values | `VariableCollectionId:16984:20528` | `Default` |
| `html.to.design` — import leftovers | `VariableCollectionId:39099:32071` | never bind |

`theme/*` is a **path inside `☾  Mode`**, not a collection. Colour/effect *styles* need
`FIGMA_ACCESS_TOKEN`, which is not configured — read them through variables or the Desktop Bridge.

Fonts: **Geist** (`Regular`/`Medium`/`SemiBold`, no space) for `Tailwind En/*`; **Cairo** for
`Tailwind AR/*` (XS–9XL × Light/Regular/Medium/SemiBold/Bold, 1:1 with the English ramp). The legacy
`Almarai/*` set is not the Arabic ramp — a past note saying Almarai was wrong.

## Layout conventions

**Marketing block geometry** (not the `Dashboard` frame — that's for dashboard blocks):
variant frame 1440 wide × HUG, `clipsContent = true`; 96 padding all sides (`spacing/24`); content
container 1248; root gap 48 (`spacing/12`); root fill `theme/background`. House type scale: eyebrow
`XS/Medium` + 8% tracking uppercase, heading `4XL`–`5XL/SemiBold` on `theme/foreground`, body
`Base/Regular` on `theme/muted-foreground`; separators are a 1px FILL-width frame filled `theme/border`.

**Page layout:** the component set sits at **x=696**; `⚡ Motion — {Type}` chips sit at **x=246**,
outside the set, top-aligned to their row (cloned from `41102:2027` — card fill, 3px `theme/chart-3`
stroke, radius md, shadow lg, zap icon + "Motion — dev notes"). Each chip carries four paragraphs:
summary · choreography · breakpoint behaviour · RTL behaviour, rewritten after each pass so it
describes what actually shipped.

**Variant grid — beside, never below.** With all three axes, one `Type` is one row of six: LTR at
x 40 / 1528 / 2344, a gap, RTL at x 3505 / 4993 / 5809 (set width 6316). Row pitch = tallest of the six
+ 40. Some sets use the wider 40/1560/2408 · 3008/4528/5376 grid — match the set you're extending.

**`Breakpoint` values are `Desktop` / `Tablet` / `Mobile`** even though the `💻 Responsive` collection
names that mode `🖥️ Web`. A mode and a variant value are different things; the mismatch is deliberate
and settled. Content widths after padding: Desktop 1248 · Tablet 640 · Mobile 296.

## Tooling: two MCP paths

**`mcp__figma__use_figma`** (official) — the main build path. Load the `figma-use` skill first; it is
mandatory before every call.

- `globalThis` does **not** persist between calls. Cache the builder in the file instead:
  `figma.root.setSharedPluginData('fasla','builder', src)` where `src` ends in `return {mk, block, btn, …}`,
  then start each later call with
  `const B = await (new Function('figma','return (async()=>{'+figma.root.getSharedPluginData('fasla','builder')+'})()'))(figma);`
  This cut an 18 KB per-call prefix to ~200 bytes. It survives between sessions — re-read before assuming
  it must be reinstalled. Put the page switch, `loadFonts()` and the token lookups inside the stored source.
- Keep to **≤1 dense block per call**; ~150 nodes hits an internal timeout. Timed-out calls often still
  commit, sometimes *after* your re-query — re-query, wait, query again before rebuilding, or you get duplicates.
- The sandbox rejects **spread in array literals** (`[...a, b]`) — use `push`/`concat`. Arrow functions,
  template literals and async/await are fine.
- `node.screenshot({scale})` returns nothing above ~1024px — omit `scale`. Reading a node's property
  after `remove()` throws and rolls back the whole call (atomic).

**`mcp__figma-console__*`** (Desktop Bridge plugin, file must be open in Figma Desktop) — use when the
official MCP can't see something: emoji-named pages, full resolved multi-mode variables, gradient stops,
and screenshots of nodes not yet saved to the cloud (`figma_capture_screenshot`; the official
`get_screenshot` reads the **saved cloud** version and 404s on fresh local work).

- `figma_execute` **does** persist `globalThis` — install a builder once, then send ~10-line calls. Long
  scripts stall even when the work takes <1s.
- `figma.createImageAsync` needs the domain in `~/.figma-console-mcp/plugin/manifest.json`
  (`networkAccess.allowedDomains` **and** `devAllowedDomains`), then `figma_reload_plugin`. The edit is
  **not durable** — re-check it before blaming a URL. Reloading wipes `globalThis`.
- Never fire-and-forget an async job and poll it — `loadFontAsync` never resolves once the execute
  handler has returned.

**Photos:** Browser pane → `unsplash.com/s/photos/<query>` → collect `images.unsplash.com/photo-…` srcs →
`curl ?w=1400&q=78&fm=jpg` → `upload_assets(count)` → `curl -F "file=@x.jpg"` per submitUrl; the response
carries `imageHash`. Upload URLs expire in 10 min, are single-use, and must be POSTed ≤6 in parallel from
a background script (an 8-parallel foreground loop hung and lost 40 URLs). Uploads land as stray frames
named after the jpg on the current page — delete them afterwards. Reuse `imageHash`es across variants.

**Partial opacity does not composite in this file's render paths.** A scrim frame over a photo renders
fully opaque at `1` and invisible at `0.45`/`0.5`, in both the plugin export and the cloud render.
Paint-level opacity behaves the same. Pick an already-dark photo instead of relying on a scrim you can't see.

## RTL pass — the engine and its traps

Per node, **skipping INSTANCE subtrees** (instances self-mirror via their own `Direction` prop): reverse
the children of every HORIZONTAL auto-layout row; flip `primaryAxisAlignItems` MIN↔MAX on HORIZONTAL and
`counterAxisAlignItems` MIN↔MAX on VERTICAL; swap left/right padding **and their bound variables**; swap
`topLeft/topRight` and `bottomLeft/bottomRight` radii; for `layoutMode==='NONE'` parents and ABSOLUTE
children set `x = parent.width - x - width` and flip `constraints.horizontal`.

- **Snapshot English strings BEFORE `setProperties({Direction:'RTL'})`.** The flip resets an instance's
  text to the RTL component defaults, wiping every LTR override. Re-apply translations after. Snapshot
  only **effectively visible** text layers (walk ancestors for `visible === false`) — each direction
  carries the other's hidden layers, so name+ordinal matching silently lands on the wrong node.
- **Guard glyph swaps by component-set membership, never by layer name.** Icon Buttons are named after
  their icon (`arrow-right`), so a name-based `swapComponent` silently replaces the whole button with a
  bare 16px icon. Handle FORM sets first (Button / Input / Select / Badge / Breadcrumbs / Progress /
  `Fasla Logo`) → set `Direction` + the RTL text prop → **return**; only then fall through to icon swaps.
- **Wrapped grids reverse *within* each row, not across the whole child list** — full reversal flips row
  order too (a 2×2 reads 3,4 / 1,2). Recover LTR row grouping by rounded `y`, map RTL index `j` → `n-1-j`.
- ` Button` does not swap its icon slots in RTL — turn Right Icon off, Left Icon on, set the mirrored glyph.
- Do **not** flip `Direction` on Avatar, Dot Badge or decorative instances; leave `Social Icons` alone.
- Never mirror: photographs, QR codes, pictograms (telescope, compass, signpost), code/terminal windows
  (mirror the subtree a second time — it's an identity — so it returns to LTR inside a mirrored block).
- Set the AR text style **before** writing `.characters`, then re-apply `fontSize`/`lineHeight` bindings.
  Load Cairo and Geist first.
- Latin stays Latin inside MSA copy: brand/product/technology names (Figma, Tailwind, shadcn/ui, API,
  SSO, SCIM, GDPR, SOC 2, Okta, App Store), emails, domains, dial codes, OTP digits, codes, and all
  numerals. Demo people transliterate (Nadia Rahman → نادية رحمن).
- **Prove it, don't eyeball it.** (a) *Alignment-symmetry audit*: per LTR/RTL pair, counts of
  `textAlignHorizontal` LEFT↔RIGHT, `counterAxisAlignItems` MIN↔MAX on VERTICAL, `primaryAxisAlignItems`
  MIN↔MAX on HORIZONTAL must be exact transposes, CENTER unchanged. (b) *Instance census*: non-nested
  instances per variant by main-set name must match exactly, the only deltas being directional glyph
  pairs. Anything else means a `swapComponent` ate a component.
- Arabic body copy runs longer — re-run the row layout afterwards or RTL variants overlap the next row.
- `textAlignHorizontal = LEFT` inside an RTL variant is usually correct (trailing text in a
  SPACE_BETWEEN row) — exclude it from audits rather than "fixing" it.

## Responsive pass — the mechanism and its traps

Cloning the Desktop component and calling `setExplicitVariableModeForCollection(💻 Responsive, mode)`
re-resolves bound width and padding immediately, so a correctly sized Tablet/Mobile frame comes free.
The real work is overflow and restructuring:

- **Text styles win over the `font-size` variable** — a `Tailwind En/*` style carries its own binding, so
  `setBoundVariable('fontSize', …)` is a no-op. Headings do not auto-step: step the *style* explicitly
  (−1 notch at Tablet for ≥4XL; −2 at Mobile for ≥5XL, −1 for 2XL–4XL) to stay token-bound.
- **Changing `layoutMode` leaves stale sizing** — after flipping a row to VERTICAL, set
  `primaryAxisSizingMode='AUTO'`, clear `layoutGrow=0`, and re-hug children, or one child expands to
  thousands of px. A wrapping row needs a fixed/FILL width before `layoutWrap='WRAP'` does anything.
- Set `layoutSizingVertical='FILL'` **after** the whole tree is built, outermost first — doing it during
  construction freezes the parent's hug height at a stale measurement.
- Every tree walk needs an **instance-ancestor guard**; recursing into an instance destroys it.
- Design every breakpoint explicitly even where it is near-identical to Desktop — Yasmin's standing instruction.

## Known token traps

- `theme/primary` is **near-black**; a `Solid`/`primary` Button on a `theme/background-inverse` band is
  invisible. Use `Outline`/`secondary` on inverse sections, and `muted-foreground-inverse` for eyebrows.
- `theme/accent`, `theme/muted` and `theme/secondary` all resolve to `#f5f5f5` (light) / `#262626` (dark).
  The only saturated tokens are `theme/chart-1…5` and the status colours — use `background-inverse` for a
  genuinely bold band.
- Button `Solid`/`primary` is unreadable in **Dark** mode (near-white fill, light grey label). Known,
  reported, unpatched — do not patch instances around it.
- Setting `textCase='UPPER'` or any direct override on a styled TEXT (e.g. `letterSpacing`) **clears
  `textStyleId`**, silently detaching the token. Type uppercase literally. Audit with
  `findAll(n => n.type==='TEXT' && !n.textStyleId)` before shipping.
- Paint-level opacity (`{type:'SOLID', opacity:0.12}`) does not render as a tint — put the tint on its own
  sibling layer with `node.opacity`, keeping icons out of that layer.
- `Default Input` (`414:12784`): `Icon (Prefix)#14769:0` is the INSTANCE_SWAP and `Prefix-icon#14769:81`
  is the BOOLEAN — swapped from what the names suggest. Always read `componentPropertyDefinitions` first.
- `Steps Horizontal` (`3793:70328`) is fixed at 5 steps and its children can't be removed — compose from
  `Steps / Step item` (`405:7832`). Select's label layer is `Title`, not `Label`, and
  `- Top Right label#364:24` defaults true.
- `Accordion Item` (`324:856`) ships its own 1px bottom divider — never add separator frames between rows.
- The file has **no monospace text style**; terminal blocks use `Tailwind En/SM/Regular`.

## Useful node ids

`Social Icons` `40334:57763` · `Fasla Logo` set `41668:149234` (lockup `41668:149232` 272×88, icon-only
`41790:164277` 88×88, `rescale(h/88)` to size; has its own `Direction` prop → فاصلة lockup; no colour
variant, recolour vectors to `theme/foreground-inverse` on dark) · motion chip template `41102:2027` ·
Icons page `3637:6775` · Brand Guideline page `41681:159746` · authoritative bindings source
`Dashboard | Home Checklist` `40949:43854`.

Page names encode status and owner: `✦  {status} {owner} | {Name}` — 🟢 done · 🟡 in progress ·
🟠 marketing blocks · 🔴 not started · ❌ canceled. Never ship into the scratch pages
(`😎 Claude Code Test` `38711:5051`, `❌ Drafts` `38515:144`, `❌ ❌ Canceled/Removed` `40465:55648`).

## Block sets shipped so far

| Set | Page | Types | Passes done |
|---|---|---|---|
| `Features` `42367:57765` | `✦ 🟡 Y \| Features` `40935:41730` | 24 | Type × Breakpoint × Direction = 144 ✅ |
| `Gallery` `42478:479` | `✦ 🟡 Y \| Gallery` `42413:38378` | 22 | 132 ✅ |
| `Error State` `42556:548` | `✦ 🟡 Y \| Error State (404)` `40935:43028` | 28 | 168 ✅ |
| `Banners` `42590:535` | `✦  🟡 Y \| Banners [CTAs]` `42510:68728` | 22 | 132 ✅ |
| `Authentications` `42586:4669` | `✦  🟡 Y \| Authentications` `42415:39805` | 29 | 174 ✅ |
| `Billing & Payments` `42603:215226` | `✦  🟡 Y \| Billing & Payments` `42415:39932` | 16 | 96 ✅ |
| `Hero` `42618:13567` | `🧪🧪🧪🧪🧪 Testing Claude` `42458:4023` | 56 | Desktop/LTR only — responsive + RTL open |
| `Checkout` `43933:9213` | `✦  🟡 Y \| Checkout` `43164:52067` | 10 | 60 ✅ + EN doc `44096:26625` + AR doc `44133:46162` |
| `Order summary` `43623:378` | `✦  🟡 Y \| Order summary \| Test Fasla Agent` `43164:51788` | 17 | 102 ✅ + EN doc `44227:12463` + AR doc `44248:15124` |

Copy in these sets is **generic SaaS**, with deliberate Fasla mentions only where a product name belongs.
Sample people are fictional and transliterate in RTL rather than being swapped for a generic demo name.

## Related docs on disk

- `~/.claude/skills/component-blocks-update/SKILL.md` + `references/file-inventory.md` — process + id cache
- `~/.claude/skills/Blocks-Documentation/SKILL.md` — pass 4 for blocks; project copy in `skills/`
- `~/.claude/agents/fasla-blocks-agent.md` — orchestrates passes 1–4 for a block family, three gates
- `~/.claude/agents/fasla-atoms-agent.md` — the atom equivalent: RTL → EN doc → AR doc, two gates
- `~/Desktop/Creative- Blocks.md` — the hero/block pattern catalogue the `Hero` set was built from
- `~/.claude/projects/-Users-jasmine-Desktop/memory/` — per-page project memories, richer than this summary
- [`index-atoms.md`](index-atoms.md) / `index-atoms.json` — every atom in the file, generated and
  dated; rebuilt by `.agents/skills/figma-index/SKILL.md`, guarded by a staleness test
