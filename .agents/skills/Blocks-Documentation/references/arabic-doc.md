# The Arabic (AR) document

A separate frame, built **only after the English doc is approved**. Same seven sections, same
measurements — mirrored, and translated into Modern Standard Arabic. Reference implementation:
`43435:26778`.

Naming follows the house convention: English takes **no suffix**, Arabic takes **`(AR)`** —
`<Block> — Fasla UI Block Documentation (AR)`.

## Fonts

- `Tailwind AR/*` resolves to **Cairo** — Light / Regular / **Medium** / **SemiBold** / **Bold**.
  Not Almarai. (A legacy `Almarai/*` style set exists and is the source of that confusion.)
- Style-name mapping differs from Inter: Inter uses `Semi Bold`, Cairo uses `SemiBold`. Map it:
  `{'Regular':'Regular','Medium':'Medium','Semi Bold':'SemiBold','SemiBold':'SemiBold','Bold':'Bold'}`
- **Load one family per `figma_execute` call.** Four Inter faces + four Cairo faces in one call times
  out and installs nothing.

## Non-negotiable Arabic typesetting rules

1. **Never set `textCase='UPPER'` on Arabic.** Arabic has no uppercase, and leaving `textCase=UPPER`
   detaches the style anyway. Set `textCase='ORIGINAL'` explicitly — an uppercase Latin label copied
   over will otherwise keep it.
2. **Never add positive letter-spacing to Arabic.** Arabic letters join; tracking them apart breaks
   the joins and reads as broken type. (The FAQ block itself already complies — its eyebrow is 0% in
   both directions. Do not "fix" that to match a Latin eyebrow.)
3. **Cairo does not carry ✓ / ✗ / ℹ.** Keep those glyphs on **Inter** via a single-character range
   override (`setRangeFontName(0, 1, {family:'Inter', style:'Semi Bold'})`) and leave the rest of the
   label in Cairo.
4. **Never glue an Arabic waw conjunction to a Latin word** — `وTextarea` renders as a stray glyph
   fused to the Latin run. Separate Latin runs with the doc's own `·` separator instead:
   `Default Input · Textarea · Button`.
5. **Avoid `=` and `×` inside Arabic prose.** Both reorder badly under bidi. Write the variant maths
   as words: «26 تخطيطًا في 3 مقاسات شاشة، أي 78 نسخة عربية».
6. **Isolate Latin runs** inside Arabic text so bidi does not reorder the punctuation around them.
7. **Line height must clear Arabic diacritics** — run Cairo a few px looser than Inter at the same
   size (the reference uses 27 vs 24.75 for body, 42 vs 39 for H2, 38 vs 32 for the statement).

## What stays Latin

- the **block name** in the header card — it matches the Figma set name for traceability
- **property names and values** — `Type`, `Breakpoint`, `Direction`, `LTR`, `RTL`, `Desktop`,
  `Tablet`, `Mobile`
- **every nested component name** — `Accordion Item`, `Default Input`, `Tabs Component`, …
- **every layout / Type name** — `Classic Centered`, `Masonry Cards`, `Help Hero + Popular`, …
- **product and technology nouns** — Figma, Tailwind, shadcn/ui, Dev Mode, Code Connect, CSS, JSON
- **all numerals** — Western digits 0–9, in both directions. Verified: the FAQ block renders `Q.001`
  and `01` identically in LTR and RTL, so this is the file's policy, not a locale switch.
- the terms designers actually say in English — tokens, dark mode, handoff
- Figma panel names the reader will look for — `Assets`

Everything else translates.

## Mirroring the document chrome

The doc is not a mirrored component — you build it RTL from the start. There is no RTL flag in
auto-layout, so mirroring means **reversing append order** plus explicit alignment:

| Element | LTR | AR |
|---|---|---|
| all text | default | `textAlignHorizontal='RIGHT'` |
| hugging children in a VERTICAL frame (pill, big number) | default | parent `counterAxisAlignItems='MAX'` |
| table columns | col 1 first | **append reversed** — col 1 lands on the right |
| table cell text | inherits | **must be re-set to RIGHT explicitly** |
| stat-strip divider | `strokeLeftWeight` | `strokeRightWeight` |
| step number badge | first child | **last child** — badge on the right |
| info callout `ℹ` | first child | **last child** — glyph on the right |
| Do / Don't cards | Do, then Don't | **Don't, then Do** — Do on the right |
| Anatomy columns | stage, then legend | **legend, then stage** — stage on the right |
| Anatomy pins | left of each element | **right of each element**, leaders point left |

## Anatomy: use the RTL variant, and its own geometry

Re-read every dimension from the **RTL** variant — do not inherit the LTR numbers. The FAQ RTL
variant is **712** tall against the LTR's **720**, because Arabic prose reflows, and every derived
position changes with it. In the reference the scaled instance is 446 tall in AR vs 451 in EN.

## Content limits carry Arabic ranges only

Measure the Arabic variants and give Arabic numbers. **Arabic does not expand uniformly** — measured
on FAQ Classic Centered, the Arabic *answer* runs **longer** than English (180 vs 158 characters)
while the Arabic *intro* runs **shorter** (109 vs 148). That asymmetry is exactly why the two
documents cannot share one limits table. Close the section with a note saying the figures are for
Arabic only and pointing at the English document.

## Audit before shipping

Every Arabic-bearing text node on Cairo, zero uppercase nodes, ✓/✗ on Inter, all hyperlinks
resolving. The reference scored **164 texts / 115 Arabic / 115 Cairo / 0 uppercase**. See
`references/audits.md`.

## The isolation convention — measured off Checkout AR `44133:46162`, 2026-09-10

Rule 6 above says "isolate Latin runs". This is *how*, and it is not optional — a missed isolate is
visible in every screenshot and no font/case audit catches it.

- Prefix **every** Arabic string with **U+200F (RLM)**. The reference does this on all 272 of its
  Arabic nodes.
- Wrap a plain Latin or numeral run in **U+200E … U+200E (LRM)**: `‎Type‎`, `‎20‎`, `‎Order Detail Page‎`.
- Wrap a run carrying **`#` or `$`** in the stronger embedding **U+202A … U+202C**. `#` and `$` are
  bidi *neutrals*: `الطلب #FSL-2481-0937` renders `FSL-2481-0937#` without it. Verified rendering
  correctly with the embedding on both `#FSL-2481-0937` and `$1,024.00`.
- A run whose **leading characters are Latin letters** anchors any following EN digit groups to LTR,
  so `التتبع FSL-EX-9924 5518 03` renders in order even unisolated. Isolate it anyway; do not treat
  a detector hit on that shape as a real defect without a screenshot.
- A `·` separator **inside** a wrapped run is part of the run. A naive
  `/[A-Za-z0-9][A-Za-z0-9 ]*/` detector splits at it and reports false positives — put `·` in the
  run's character class.

One helper does all of it:

```js
ar = s => '‏' + s.replace(/~([^~]+)~/g,
      (m,p) => /[#$]/.test(p) ? '‪'+p+'‬' : '‎'+p+'‎');
```

Write the copy with `~Latin~` markers and never hand-place a mark.

## Reset letter-spacing to 0 after any Latin-derived helper

Rule 2 says never track Arabic. The way it gets violated is **inheritance**: an EN table-header
helper carries `letterSpacing: 0.77`, and porting it to AR silently tracks the Arabic labels.
Checkout AR's own headers read `ls 0`. Sweep before shipping:

```js
doc.findAll(n => n.type==='TEXT' && /[؀-ۿ]/.test(n.characters)
   && n.letterSpacing !== figma.mixed && n.letterSpacing.value > 0)   // must be empty
```

## Two more mirroring rows the table above omits

| Element | LTR | AR |
|---|---|---|
| stat-strip **cells** | cell 1 first | **append reversed** — cell 1 lands on the right, then `strokeRightWeight` on every cell **but the rightmost** |
| every wrapper between a section and a FILL text (`Header`, `H2`, `P`, `t`, `hcell`, `cell`) | — | must itself be `layoutSizingHorizontal='FILL'`, or its FILL children collapse to a hug-width column and the section comes out 3–4× too tall |

## Rich-text base weight in the AR docs

Checkout AR sets rich-text nodes (legend descriptions, Do/Don't items) to **Cairo SemiBold** base
with a **Cairo Bold** lead-in, where the EN twin uses Regular base + Semi Bold lead-in. `Order
summary (AR)` matched the reference so the two AR docs read alike. It is probably a helper artefact
rather than a decision — if Yasmin ever calls it, change both docs, not one.

## Audit nine: the waw/Latin fusion — add this to the standing set (2026-09-13, Offers AR)

Rule 4 above bans gluing an Arabic waw to a Latin word. It is stated as a *writing* rule, but it is
really a **content-file** trap: the marked-up copy for a new family will keep carrying `و~Latin~`,
because the conjunction is correct Arabic and only breaks at the script boundary. On Offers AR it
shipped **6 fused runs** past the font, case, RLM *and* letter-spacing audits — every one of them
green — and the fusion is plainly visible in each screenshot (`Product Listو`).

**Detector — run it over the doc's own nodes, alongside the other AR audits:**

```js
const FUSE = /[؀-ۿـ][‎‪][A-Za-z]/;
doc.findAllWithCriteria({types:['TEXT']}).filter(t => FUSE.test(t.characters))   // must be empty
```

Note it must match **after** isolation, i.e. the Arabic letter followed by the LRM/LRE mark and then
a Latin letter — the raw `و~Latin~` form is gone by then.

**The remedy is rule 4's own:** replace the conjunction with the doc's `·` separator —
«تلك تخص Banners · Product List · Shopping Cart» — verified against a probe frame comparing
`~A~ و~B~` (fuses), `~A~ · ~B~` (clean) and `~A~ و ~B~` (clean). Where the prose genuinely needs the
waw, a space before the Latin run also works.

**Do not "fix" waw or `الـ` followed by a numeral** (`و2`, `الـ15`) — that is correct orthography and
renders correctly.

**Patch a rich-text node with `insertCharacters(i, ' ')`, never by assigning `.characters`** — an
assignment flattens the Cairo Bold lead-in back to the base weight. Verify the lead-in range survived.

**One narrower finding, proved by probe:** a leading `−` before digits inside an LRM run does **not**
need the stronger U+202A…U+202C embedding, unlike `#` and `$`. `−40%` renders identically either way,
so the helper's `/[#$]/` condition is correct as written and should not be widened.

## Do not "improve" the isolation helper's `/[#$]/` condition (2026-09-15, Gift Cards AR)

A numeric range inside Arabic — `2–6 كلمات · 11–35 حرفًا` — looks like it must need the stronger
U+202A…U+202C embedding, because this family's own note records `3–5` inside `أيام عمل` rendering as
`5–3`. It does not. That bug was an **unisolated** run. A plain LRM on each side is sufficient, and
the reason is UAX#9 rule **W7**: LRM is a strong L, so the digit run that follows it resolves to L,
the next digit run searches backward and finds that L, and the neutral dash between two L runs
resolves L by N1. The whole run renders LTR.

Verified on `44691:18910`: every range cell carries `{LRM}2–6{LRM}` and renders in the correct order
in the exported PNG. The same holds for `FSL-GC-••••-9XQ7` — bullets between Latin runs are fine.

So the helper is right exactly as written. `#` and `$` genuinely need the embedding (they are ET and
ON with no strong L in front of them); **a run whose first character is a Latin letter or a digit
preceded by LRM does not.** Widening the condition to catch dashes, slashes or bullets is a null
change that makes the two AR docs in a family disagree — I made it, proved it unnecessary against a
screenshot, and reverted it.

**One trap this hunt did surface: patching an installed helper's export does not patch the helper.**
`globalThis.GCAR.ar = …` rebinds only the exported reference; `TX` and `RTX` keep calling the `ar`
closure they were created with. Probe by rendering a string through `TX`, never by calling the export.

## Audit ten: tatweel before a Latin run

`arabic-doc.md` already says avoid tatweel, and [[fasla-ar-waw-latin-fusion]] rightly exempts `الـ`
before a numeral (`الـ 20`) as correct orthography. But the exemption is narrower than it looks:
**`بـ` / `كـ` / `لـ` glued in front of a Latin or currency run is a defect** — «وأخرى بـ ‪$50.00‬» —
and the waw-fusion detector misses it because the isolation mark is preceded by a space, not by the
tatweel. It shipped past font, case, RLM, letter-spacing and fusion audits, all green.

```js
own.forEach(t => { const c = t.characters.replace(/[‎‏‪‬]/g,'');
  let i=-1; while((i=c.indexOf('ـ', i+1))>-1) hits.push(c.slice(i-6, i+8)); });
// every hit must match /الـ\s*[0-9]/  — i.e. الـ + numeral, nothing else
```

The remedy is a real word, not a mark: «وأخرى **قيمتها** ‪$50.00‬».
