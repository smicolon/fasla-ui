---
name: rtl-component-creator
description: Creates RTL (right-to-left) variants for a Figma component set that has existing LTR variants. For each LTR variant it adds a Direction=LTR/RTL property, clones an RTL twin, mirrors the auto-layout, swaps Tailwind En text styles to Tailwind AR (Cairo), flips form sub-component instances to their RTL variants, translates UI text to Modern Standard Arabic, and proves the result with an alignment-symmetry audit plus an instance census. Use when the user wants to add RTL variants to a Figma component set.
---

# RTL Component Creator

Adds matching RTL variants to a Figma component set that has LTR variants. Works for any component (navbars, inputs, selects, cards, buttons, …), not just one shape. Follow the steps in order and **verify with a data audit + screenshots**, not by assumption.

Requires the Figma Console MCP (`mcp__figma-console__figma_execute`) with the Desktop Bridge plugin connected. If a call returns "Cannot connect to Figma Desktop", ask the user to reopen **Plugins → Development → Figma Desktop Bridge**, then retry.

## Prerequisites — confirm before running

Ask, unless already known from context:
1. Which component set(s) to convert (node URL / name). The set must have `Tailwind AR/*` text styles available (this file does).
2. Any labels needing a specific Arabic translation, and whether demo proper nouns (e.g. "Chris Doe") should be translated or left as-is.
3. Arrangement is **settled, do not re-ask**: all LTR grouped first, a gap, then all RTL grouped. (This replaced an earlier rule that paired each RTL twin directly under its LTR original.) Where the set already carries a `Breakpoint` axis, the six variants of a type sit **beside** each other in one row — LTR trio, gap, RTL trio — never below.

## Golden rules

- **Cover every property combination**, including hidden/secondary props (State, Size, Shape, Filled …). RTL count must equal LTR count.
- **Never change colors.** States keep identical fills/strokes.
- **Translate UI labels** to Modern Standard Arabic and rename the layer to its Arabic. **Leave** brand names, emails, URLs, numbers, and symbols (+ − ▾) unchanged. **Demo person names** (e.g. "Chris Doe") ARE translated to an Arabic demo name — default **محمد حسين** (also swap that node's En→AR style).
- **Text styles**: swap `Tailwind En/<size>/<weight>` → `Tailwind AR/<size>/<weight>`. **`Tailwind AR/*` is Cairo, NOT Almarai** — the legacy `Almarai/*` style set still in the file is not the Arabic ramp. Load **Cairo** (and Geist) before any text edit.
- **Never copy the English line-height across.** The En and AR ramps deliberately carry different leading — Arabic sits at ~1.5 throughout, English tightens to 1.22 at `4XL`. Bind the AR style and let it bring its own rung from `typography/line-height/L-*`.
- All Figma API calls are **async** under dynamic-page: use `getNodeByIdAsync`, `getStyleByIdAsync`, `getLocalTextStylesAsync`, `getMainComponentAsync`, `setTextStyleIdAsync`.

## Step 1 — Inspect

Use `mcp__figma__get_metadata` for the variant list, then `figma_execute` to walk one LTR variant and its structure: auto-layout modes (`layoutMode`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `layoutGrow`/`layoutSizingHorizontal`), every TEXT node (name, characters, `textStyleId` → style name), and every nested INSTANCE (`getMainComponentAsync`, its parent COMPONENT_SET name, and `componentProperties`). Collect all unique text strings so you can build the translation table and spot which labels live **inside instances** (those aren't free text — see Step 4).

## Step 2 — Structure pass (clone + mirror)

In one `figma_execute` (timeout 30000):

1. Append `, Direction=LTR` to each original variant name lacking a `Direction=` token → registers the `Direction` property.
2. For each LTR variant: `clone()`, rename `Direction=LTR`→`Direction=RTL`. **`clone()` on a variant lands at page level — you MUST `set.insertChild(idx+1, rtl)` or `set.appendChild(rtl)` to move it back into the set.**
3. **Mirror the layout — all three steps (reversing order alone is NOT enough):**
   ```js
   function mirror(node){
     if (node.type === 'INSTANCE') return;               // instances self-mirror via their own Direction prop
     if ('layoutMode' in node && node.layoutMode === 'HORIZONTAL') {
       // (a) reverse child order — flow children only, then re-append ABSOLUTE ones ON TOP.
       // Reversing with appendChild leaves an ABSOLUTE child at index 0 (bottom of z-order), so a
       // floating card/tag/tab renders BEHIND its siblings and vanishes. No audit sees this:
       // node count, instance census, alignment transpose and absoluteRenderBounds are all unchanged.
       // Use appendChild, never insertChild(n,k) — it clamps after its own implicit remove().
       const abs = node.children.filter(k => k.layoutPositioning === 'ABSOLUTE');
       const flow = node.children.filter(k => k.layoutPositioning !== 'ABSOLUTE');
       for (const k of flow.slice().reverse()) node.appendChild(k);
       for (const k of abs) node.appendChild(k);
       const a = node.primaryAxisAlignItems;                                    // (b) flip packing edge
       if (a === 'MIN') node.primaryAxisAlignItems = 'MAX';
       else if (a === 'MAX') node.primaryAxisAlignItems = 'MIN';
       // leave CENTER / SPACE_BETWEEN
       // mirror asymmetric padding / corner radii
       if (node.paddingLeft !== node.paddingRight){ const l=node.paddingLeft; node.paddingLeft=node.paddingRight; node.paddingRight=l; }
       const {topLeftRadius:tl,topRightRadius:tr,bottomLeftRadius:bl,bottomRightRadius:br}=node;
       if (tl!==tr||bl!==br){ node.topLeftRadius=tr; node.topRightRadius=tl; node.bottomLeftRadius=br; node.bottomRightRadius=bl; }
     }
     if ('layoutMode' in node && node.layoutMode === 'VERTICAL') {              // (c) horizontal pos in a vertical
       const a = node.counterAxisAlignItems;                                    //     frame = COUNTER axis.
       if (a === 'MIN') node.counterAxisAlignItems = 'MAX';                      //     A growing wrapper (logo with
       else if (a === 'MAX') node.counterAxisAlignItems = 'MIN';                 //     layoutGrow:1) stays glued left
     }                                                                          //     without this flip.
     if ('children' in node) for (const c of node.children) mirror(c);
   }
   ```
4. **Flip Direction on FORM instances only.** Set `Direction=RTL` on nested instances whose component-set name matches Button / Input / Select. **Do NOT flip decorative instances** (Dot Badge, Avatar, icons) — e.g. a Dot Badge's RTL variant renders a visible "شارة" label where LTR shows only a dot. If unsure, flip only form instances and leave the rest LTR.

## Corrections verified 2026-09-07 (Command Menu pass)

- **A bare COMPONENT with no variants needs `combineAsVariants`, not a rename.** Step 2.1 assumes a
  COMPONENT_SET already exists, so appending `, Direction=LTR` to a lone component registers nothing.
  For a single finished atom: rename the original `Direction=LTR`, `clone()` it as `Direction=RTL`,
  then `figma.combineAsVariants([ltr, rtl], page)` and name **the set** after the component. Verify
  `variantGroupProperties` reads `{Direction:{values:['LTR','RTL']}}` before going on.
- **`mirror()` must also flip `textAlignHorizontal`.** The recipe in Step 2.3 does not touch text
  alignment, but Step 5b's audit demands a LEFT/RIGHT transpose — and any text node that is `FILL`
  width or `layoutAlign:'STRETCH'` genuinely hugs the wrong edge without the flip. Add
  `if (node.type === 'TEXT') node.textAlignHorizontal = {LEFT:'RIGHT', RIGHT:'LEFT'}[node.textAlignHorizontal] || node.textAlignHorizontal;`
  and keep excluding the SPACE_BETWEEN trailing-text case the audit note describes.
- **Mirror asymmetric padding by swapping the VARIABLE BINDINGS, not the raw numbers.** Step 2.3
  swaps `paddingLeft`/`paddingRight` values, which silently **detaches** a token-bound padding and
  breaks the token rule the same way `textCase`/`letterSpacing` detach a text style. Read
  `node.boundVariables.paddingLeft` / `.paddingRight` and re-bind them crosswise with
  `setBoundVariable`; only fall back to swapping numbers when a side is genuinely unbound.

## Step 3 — Reorder into blocks

Group the set's children so all LTR come first (original Type order), then all RTL: `for (const v of [...ltr, ...rtl]) set.appendChild(v)`. If the set is manual (`layoutMode === 'NONE'`), position an LTR block from the top, add a ~200px gap, then the RTL block, and `set.resize(width, newHeight)`. (If the set is auto-layout, reordering alone stacks them; a visible gap needs manual layout.)

## Step 4 — Text pass (translate + restyle)

In one `figma_execute` (timeout 30000). **Preload fonts first** or `.characters` throws — but
load only the styles actually in use:
```js
for (const st of ['Light','Regular','Medium','SemiBold','Bold'])
  await figma.loadFontAsync({family:'Cairo', style:st});
for (const st of ['Regular','Medium','SemiBold'])          // NOT Light / Bold — see below
  await figma.loadFontAsync({family:'Geist', style:st});
```
**⚠️ `Geist/Light` and `Geist/Bold` never resolve under the Desktop Bridge.** `loadFontAsync`
returns a promise that neither settles nor rejects, even though both styles are listed by
`listAvailableFontsAsync()`. The old five-styles-per-family loop therefore hangs on the very first
Geist Light, burns the full 30s cap, and reads as "the engine is too slow" — the `Tailwind En/*`
ramp only ever uses Regular / Medium / SemiBold. Worse, a hung font promise **blocks the plugin's
execute channel**: the next call or two also time out *while their work still commits*, and the
hung call's own work lands later, after your re-query. Never re-run a non-idempotent step (an icon
side-swap, a toggle) after a timeout without reading the node's current state first. Once the
file's fonts are warm in the session, dropping `loadFontAsync` altogether is the safest option.
Build an En→AR style-id map from `getLocalTextStylesAsync()` (`name.replace('Tailwind En/','Tailwind AR/')`). Then walk each RTL variant:
- **Free TEXT nodes**: if the string is in your translation table → `await node.setTextStyleIdAsync(arId)`, set `node.characters = arabic`, and `node.name = arabic`.
- **Instance text** (Button/Input): set via `setProperties`, not `.characters` (which fails silently on instances). These components expose separate LTR/RTL text props, e.g. Button `¶ label#310:196` (LTR) + `label ¶#38555:0` (RTL); Default Input `LTR Placeholder#38613:0` + `RTL Placeholder#369:47`. Read the LTR prop to pick the Arabic, set the RTL prop.
- Leave brand/email/number/proper-noun strings untouched.

Reference translations: Home→الرئيسية, Services→الخدمات, Products→المنتجات, About Us→من نحن, Pricing→التسعير, Get Started→ابدأ الآن, Log in→تسجيل الدخول, Sign up→إنشاء حساب, Type here→اكتب هنا, Search/placeholder→اكتب هنا, Title→عنوان, "Select item"→اختر عنصرًا, "Selected item"→العنصر المختار, Label→تسمية, License→الترخيص, "More Themes"→المزيد من السمات, Documentation→التوثيق, Support→الدعم, "Top Right label"→عنوان إضافي علوي, "Bottom Left label"→عنوان يسار إضافي, "Bottom Right label"→عنوان يمين إضافي. E-commerce: Art & craft→الفنون والحِرف, Study→الدراسة, Electronics→الإلكترونيات, Sport→الرياضة, Toys→الألعاب, Painting→الرسم, House accessories→مستلزمات المنزل, Computer→الكمبيوتر. Demo name: "Chris Doe"→محمد حسين.

## Step 5 — Verify

1. **Data audit**: for each RTL variant list visible text; flag any leftover English UI label (allow brand/email/number/proper-noun) and any node still on a `Tailwind En/` style. Note: a hidden badge text can have `node.visible===true` while an ancestor is hidden — check ancestor/effective visibility, not just `node.visible`.
2. **Screenshots**: `mcp__figma__get_screenshot` per variant. The renderer sometimes returns a stale 1×1 PNG for very wide nodes (≈1440px) — if so, verify those by data audit instead.
3. Confirm: logo/anchor on the right, content flows RTL, form instances show Arabic, colors unchanged, LTR count === RTL count.

## Step 2b — Traps that have each cost a rebuild

Learned on the scripted passes over the Gallery, Error State, Authentications, Banners and
Billing & Payments sets. The `mirror()` above is the skeleton; these are what make it survive
contact with real components.

- **Snapshot every English string BEFORE `setProperties({Direction:'RTL'})`.** Flipping an instance's
  Direction resets its text to the RTL component defaults, wiping all LTR overrides — Inputs fall back
  to "عنوان", placeholders to "اكتب هنا", Buttons to "إرسال", Badge to "شارة". Read the English values
  first, then re-apply the translations after the flip. Two mechanisms are needed together:
  (a) component TEXT props — Button `¶ label#310:196`→`label ¶#38555:0`, Input
  `LTR Placeholder#38613:0`→`RTL Placeholder#369:47`, Select `Text#369:40`→`RTL Text#38672:322` and
  `Placeholder text#369:47`→`RTL Placeholder Text#38672:161`, Textarea `LTR Text#369:40`→`RTL Text#38663:21`,
  Switch `LTR Label#40410:0`→`RTL Label#40410:73`; (b) plain text layers with no prop (Input `Label`,
  Checkbox `Label`, Alert `Title`/`Description`, Tabs `{label}`, Step `step-text`) — snapshot by layer
  name + ordinal.
- **Snapshot and re-apply only EFFECTIVELY VISIBLE text layers.** Each direction carries the other's
  hidden layers, so `findAll` ordinals shift between twins and a name+ordinal match silently lands on
  the wrong node. Walk ancestors for `visible === false`, not just the node itself.
- **Guard glyph swaps by component-set membership, never by layer name.** Icon Button instances are
  usually named after their icon (`arrow-right`), so a name-based `swapComponent` replaces the whole
  button with a bare 16px icon — silently, and it looks like a missing button. Order the handling: if
  the instance's `mainComponent.parent` is a known FORM set (Button / Input / Select / Textarea /
  Badge / Breadcrumbs / Progress / Switch / Tabs / `Fasla Logo`), set `Direction=RTL` + its RTL text
  prop and **return**. Only fall through to a name-based swap for genuine icon instances.
- **Re-fetch instances by id.** `findAll(n => n.type==='INSTANCE')` also returns instances nested
  inside instances; their ids go stale after a `swapComponent` and `mainComponent` then throws "node
  does not exist". Collect ids first, skip nested instances, re-fetch by id.
- ` Button` does **not** swap its own icon slots in RTL: turn the Right Icon boolean off, the Left Icon
  on, and set the left INSTANCE_SWAP to the mirrored glyph.
- **Wrapped grids reverse WITHIN each row, not across the whole child list.** Full reversal of a
  `layoutWrap='WRAP'` container also flips row order, so a 2×2 reading 1,2 / 3,4 comes out 3,4 / 1,2.
  Recover the LTR row grouping by rounded `y`, map RTL position `j` back to LTR index `n-1-j`, then
  re-append. Handles uneven last rows, which a plain row-order fix does not.
- **Manual-layout and ABSOLUTE children**: `x = parent.width - x - width`, and flip
  `constraints.horizontal` MIN↔MAX. **Zero any rotation before mirroring `x`, then restore it** — `x`
  on a rotated node is not the bounding-box left edge.
- **Directional glyphs**: `chevron-right`↔`chevron-left`, `arrow-right`↔`arrow-left`,
  `arrow-up-right`↔`arrow-up-left`. `send` has no mirrored twin — flip via `relativeTransform`
  `[[-1,0,x+w],[0,1,y]]`. `chevron-up`/`down`, plus/minus/×, and object pictograms do **not** flip.
  `swapComponent` drops fill overrides — re-bind the theme colour after swapping.
- **Never mirror**: photographs, QR codes (a mirrored code will not scan), pictograms (telescope,
  compass, signpost), and code/terminal windows — logs, URLs and request IDs stay LTR. To restore a
  code window inside a mirrored variant, run `mirror()` on that subtree a second time; applying it
  twice is an identity.
- **Do not flip `Direction`** on `Avatar`, `Dot Badge` or other decorative instances, and leave
  `Social Icons` alone entirely — brand marks never mirror.
- **Arabic runs longer than English** in body copy. Re-run the row layout after the pass so each row
  is sized to the tallest variant, or RTL variants overlap the next row.
- **Latin stays Latin** inside MSA copy: brand, product and technology names (Figma, Tailwind,
  shadcn/ui, API, SSO, SCIM, GDPR, SOC 2, App Store), emails, domains, dial codes, OTP digits, codes,
  and all numerals. Demo people transliterate rather than being swapped for the generic demo name
  where the original name matters (Nadia Rahman → نادية رحمن).
- **Arabic has no uppercase.** An uppercase Latin block becomes normal-case Arabic at the same density.
- Setting `textCase='UPPER'` or a direct `letterSpacing` on a styled text node **clears `textStyleId`**
  and detaches the token. Type uppercase literally.

## Corrections verified 2026-09-09 (Order summary blocks pass)

- **Pair instance texts by CONTENT, not by ordinal.** Step 4's snapshot/restore matches the
  pre-flip strings against post-flip TEXT nodes by document order. A horizontal
  `Steps / Step item` **reverses its own children** on `Direction=RTL`, so the ordinal match
  writes the label into the number slot and the number into the label — five times per stepper,
  with no error and no obvious tell in a downscaled screenshot. Filter both sides to strings that
  contain letters (`/[A-Za-z\u0600-\u06FF]/`) before pairing, and leave numerals, currency and
  codes out of the pairing entirely: they need no translation and the flip does not disturb them.
  This also retires the per-atom ordering special cases (`Tabs` sorted by descending x, etc.).
- **When Arabic copy overflows, fix the wording before the structure.** The usual responsive fix —
  flip the row to VERTICAL and FILL both children — adds a frame with no LTR counterpart, which
  breaks the Step 5b alignment transpose and leaves the RTL twin structurally different. Redundant
  MSA phrasing is the more common cause: `Tax (VAT 20%)` rendered as
  `الضريبة (ضريبة القيمة المضافة 20%)` says "tax" twice and over-subscribed a 296px
  `SPACE_BETWEEN` row; `ضريبة القيمة المضافة (20%)` fits with structure untouched.
- **Widen the component set before cloning, or every RTL variant exports blank.** A COMPONENT_SET
  clips its content, so an RTL column placed beyond the set's current width renders nothing and
  `absoluteRenderBounds` comes back null. Resize the set to the final grid width first; the height
  is a separate question owned by the row relayout.
- **Fingerprint the LTR variants before you start.** `[nodeCount, x, y, w, h, hash(name+geometry
  of every node)]` per variant, cached in shared plugin data, turns "I did not touch the LTR side"
  into a number. Cheap to compute, and the only honest way to report zero drift.
- **Check the Desktop Bridge's `connectedFile.currentPage` before trusting it.** `figma_get_status`
  can report `setup.valid = true` while the bridge is attached to another session's page, and
  `figma_capture_screenshot` then times out. `use_figma`'s inline `await node.screenshot()` (omit
  `scale`) needs no bridge and works on nodes created moments earlier.

## Corrections verified 2026-09-09 (Order summary, Group B — types 8–14)

Four more failures, each of which survived the Group-A corrections above.

- **A numeral-only instance override is destroyed by the flip, and the letter-filter refuses to
  restore it.** The Group-A rule (pair by letter-bearing content, never by ordinal) leaves a hole:
  a `Table Cell` whose only text is `$1,024.00` yields an **empty** `src`, while `dst` holds the
  RTL component default `عنوان`. The counts differ, `restore()` returns false, and the cell keeps
  the placeholder — silently. Fix: **before** the letter filter, handle the single-slot case,
  where positional restore is provably unambiguous:
  `if(rec.texts.length===1 && ts.length===1){ ts[0].characters = tr(rec.texts[0]); return true; }`
  It cannot reintroduce the Step-item ordinal bug, because a step item always has ≥2 texts.
  **Detector:** scan RTL variants for effectively-visible TEXT equal to any component default
  (`عنوان` · `اكتب هنا` · `شارة` · `إرسال` · `تسمية` · `اختر عنصرًا` · `العنصر المختار`).
- **A width difference between an LTR and an RTL instance of the same atom is not automatically
  stale sizing — read the component first.** `Steps / Step item` authors
  `Direction=RTL, Orientation=Vertical, Has tail=False` at **89px with its content contained**,
  while `Has tail=True` is **38px with the label overflowing**. Forcing the RTL instance to
  `layoutSizingHorizontal='HUG'` so it matched its LTR twin's `38/HUG` looked like the textbook
  stale-sizing fix and made the render far worse. Compare against the **main component's own
  geometry**, not against the LTR twin, before "correcting" an inherited width.
- **Audit instance content against the instance's own box, not just against auto-layout parents.**
  The absolute-edge overflow detector skips everything inside an instance, so it cannot see an atom
  whose content escapes its own frame. Per top-level instance, compare the extents of its visible
  descendants to its box and flag `max(outRight, outLeft) > 12`. Raw counts are meaningless — a
  vertical `Steps / Step item` legitimately renders its label outside its 38px marker box — so read
  it as a **transpose**: LTR escapes must be `R>0, L=0` and their RTL twins `R=0, L>0`. That is what
  isolated a genuine component defect (the tail-less RTL vertical step item lays out
  `[label][marker]` left-to-right and throws its marker outside the card) from 91 correct escapes.
  When the arithmetic says copy cannot fix it — that variant reserves 89px for label + 38px marker,
  so the label would need to be ≤51px, shorter than `تم الطلب` — **report the component defect
  instead of mangling the MSA or hacking the instance**.
- **An Arabic sentence must not END on a Latin token.** Sentence-final punctuation after a Latin run
  reorders to the wrong side: `… مع Fasla.` renders as `.Fasla`. Same family as the `وTextarea` waw
  problem. Rephrase so the sentence closes on Arabic — `… مع Fasla في آخر اثني عشر شهرًا.` Audit
  with `/[A-Za-z0-9)]\s*[.،؛:]$/` over mixed-script strings.

Also confirmed this pass: `Input Number` and `Default Input` both mirror themselves completely from
`Direction=RTL` alone (`minus@16, plus@98` → `plus@16, minus@98`; a prefix icon moving `x=12` →
`x=272` of a 300px field) — but **a layer-name probe cannot see it**, because both stepper controls
are named `left-icon` at unchanged x offsets in both directions. Only
`getMainComponentAsync()` on the nested glyph reveals the swap. And **make the clone driver
idempotent** — have it return early if the RTL twin already exists — which is what makes a
timed-out `use_figma` call safe to simply re-run.

## Step 5b — Prove it with data, not screenshots

Both audits are mandatory before reporting the pass complete.

1. **Alignment-symmetry audit.** For every LTR/RTL pair, compare counts of `textAlignHorizontal` LEFT
   vs RIGHT, `counterAxisAlignItems` MIN vs MAX on VERTICAL frames, and `primaryAxisAlignItems` MIN vs
   MAX on HORIZONTAL frames. Each must be the exact transpose of its twin, with CENTER counts
   unchanged. It catches a missed flip instantly.
2. **Instance census.** Count non-nested instances per variant by main-component-set name, LTR vs RTL.
   Totals must match exactly and every per-key difference must be a directional glyph pair. Anything
   else means a `swapComponent` ate a component.

A `textAlignHorizontal = LEFT` inside an RTL variant is usually **correct**, not a bug — text that sat
at the trailing end of a SPACE_BETWEEN row is right-aligned in LTR and left-aligned in RTL. Exclude
those from the audit rather than "fixing" them.

## Tooling notes

Either bridge works. `mcp__figma-console__figma_execute` persists `globalThis` between calls — install
a helper/builder object once, then send short calls. `mcp__figma__use_figma` does **not** persist
`globalThis`, but `figma.root.setSharedPluginData` and `new Function`/`eval` do work, so cache the
builder source in the file instead. Either way: long scripts time out even when the work is fast, and
**a timed-out call often still commits** — re-query by name before retrying or you create duplicates.
The plugin sandbox rejects spread in array literals (`[...a, b]`); use `push`/`concat`.

Verify fresh work with `figma_capture_screenshot` (plugin export) or an inline `node.screenshot()` —
the official `get_screenshot` reads the saved cloud version and 404s on nodes just created locally.

## Cleanup on failed runs

Remove stray page-level clones from aborted attempts:
```js
figma.currentPage.children.filter(n => n.type==='COMPONENT' && n.name.includes('Direction=RTL')).forEach(n => n.remove());
```

## Corrections verified 2026-09-09 (Order summary, Group C — types 15–20)

Four more, each of which survived both the Group-A and Group-B corrections above.

- **`Textarea` is missing from the `FORM` map, and the omission fails silently in the worst
  direction.** The map in Step 2b's guard covers Button / Input / Select / Badge / Breadcrumbs /
  Progress / Switch / Tabs / Logo but not `Textarea` `3928:2374`. With `kind === undefined` the
  engine never sets `Direction=RTL`, so `restore()` writes the Arabic into the still-visible **LTR**
  layers — and any later `Direction` flip wipes exactly those overrides. **Add `Textarea` to `FORM`**
  and handle it like Input: flip `Direction` first, then restore, then the placeholder. Its RTL prop
  name **carries a space before the hash** — `LTR Placeholder#369:47` → `RTL Placeholder #38663:0`,
  `LTR Text#369:40` → `RTL Text#38663:21`. Without the space `setProperties` throws.
- **`rebindIcon()` must re-assert the button's OWN foreground token, not `theme/primary-foreground`.**
  Hardcoding primary-foreground is right for `Style=primary` and **silently wrong for
  `Style=destructive`**, which is authored against `theme/destructive-foreground`. Both resolve
  near-white, so the regression is invisible in a screenshot and passes every unbound-fill audit —
  only a token read catches it. The robust form is **preserve, don't guess**: snapshot each Button's
  nested VECTOR `boundVariables.color` id before the flip and re-assert that exact id after the
  icon-slot swap. That also covers `Outline`/`destructive` (`theme/destructive`) and Ghost
  (`theme/foreground`) with no per-style table to maintain.
- **The tail-less vertical `Steps / Step item` IS workable from an instance** — the Group-B note
  saying otherwise is superseded. The component defect is real, but the fix needs no atom change:
  `setProperties({'Has tail':'True'})` (that variant mirrors correctly) → hide the instance's direct
  `Divider` child → `instance.layoutSizingVertical = 'HUG'`, which collapses the reserved tail space
  so the height returns to exactly **38px**, identical to `Has tail=False`. Snapshot and restore the
  item's text around the property change. Still do **not** touch `layoutSizingHorizontal` — forcing
  `HUG` there is the move that makes it worse.
- **The instance-content escape audit must be orientation-aware.** Group B's rule (LTR escapes
  `R>0, L=0`, RTL twins `R=0, L>0`) holds only for a **vertical** rail, where the label sits beside
  the marker. A **horizontal** step item centres its label under its 38px box, so it escapes both
  sides — or left in LTR and right in RTL, the exact opposite. Applied as written the rule reported
  23 false failures across three types. Classify `two-sided` (both > 12px) as legitimate and compare
  only its per-pair count; test one-sided escapes against the item's `Orientation`. The 12px
  threshold is also unstable across languages — an LTR label escaping 17px can return 11px in
  Arabic and silently leave the count — so compare magnitudes per pair rather than requiring equal
  counts.

Also confirmed this pass: a **numeral-only override is not always an instance problem.** Group B's
`SINGLETEXT` branch covers the `Table Cell` case, but `Refund Issued` and `Gift Order Recap` hold
their amounts in **plain TEXT nodes**, which the flip never touches — verify with a multiset compare
of the LTR and RTL amount strings (15/15 identical on `Refund Issued|Desktop`) rather than assuming
either that they are safe or that they are broken. And **check the LTR fingerprint's comparable
fields before calling drift**: only `nodeCount`, `x`, `width`, `height` reproduce across launches;
the geometry hash depends on the string format each launch chose, and `y` legitimately moves when
the designer repitches rows centrally.

## Corrections verified 2026-09-09 (Order summary, Group C re-verification)

A second launch was briefed to **rebuild** Group C after its node work was reported lost to another
session's undo. The work was never lost. Three corrections, all about *verification* rather than
mirroring.

- **Prove "lost work" by node id, never by a count or a name scan.** The set already held all 120
  variants, and the 18 supposedly-missing RTL twins were present **under the exact ids the previous
  run recorded**. Identical ids prove they are the original nodes — a rebuild mints new ones. The
  second half of the same claim ("all six chips still read `Intent —`") was the same error: the
  chips' paragraph-4 slot *always* opens with the literal string `Intent —`, so the prefix survives
  the rewrite and its presence proves nothing. **Resolve the recorded ids and compare geometry
  before rebuilding**; a blind rebuild here would have created 18 duplicate variants, with only the
  driver's idempotency guard standing between the brief and a corrupted set.
- **When rewriting one paragraph of a multi-paragraph note, address the slot by role, not by
  index.** The previous run wrote its shipped-RTL description into paragraph **3** (breakpoint
  behaviour) on two of six chips, destroying that paragraph and leaving paragraph 4 holding a stale
  pre-build prediction — including a glyph claim the run's own write-up said it had corrected. The
  correction was recorded but never shipped. **Tell:** p3 and p4 opening with the same words.
  Assert the roles after writing (p3 names a breakpoint, p4 describes mirroring), and re-read both,
  because the two failure modes — wrote nothing, wrote the right text into the wrong slot — look
  identical from a prefix scan.
- **Mid-sentence Latin-then-punctuation is correct; only the sentence-FINAL case is broken.** The
  `… مع Fasla.` bug is real, but a broader mid-string scan
  (`/[A-Za-z0-9)]+[.،؛:](?=\s+\S)/`) surfaces `2026.`, `6B.`, `6B،` and friends, all of which
  render correctly — the following Arabic run anchors the neutral to paragraph direction, so the
  period lands to the *left* of the Latin token, which is the correct RTL sentence-end position.
  Verified at 4× magnification. **Keep the audit anchored to `$`** and do not rephrase mid-sentence
  hits; "fixing" them mangles good MSA to chase a non-bug.

Also confirmed: a Bridge attached to **another session's page** does not predict capture failure.
The previous run inferred from that reading that `figma_capture_screenshot` was unusable and fell
back to inline screenshots throughout; this launch every capture succeeded, including a 4× capture
of a TEXT node nested inside an instance. Attempt one capture, then fall back.

## Corrections verified 2026-09-11 (Gift Cards, launch 3 — types 11–15)

Two of these supersede earlier notes. Both are about **child-order reversal inside instances**,
which the Group-A correction named for horizontal `Steps / Step item` but which is far more general.

- **Any positional text restore is unsafe for an instance whose RTL variant reverses its own
  children — restore by LAYER PATH instead.** Group A's fix (pair by letter-bearing content) and
  Group B's fix (positional when there is exactly one text) both leave a hole: an instance with
  ≥2 letter-bearing texts whose order reverses. Two live cases, neither caught by any audit in
  this file because node count, component, width and census are all unchanged:
  *`Steps / Step item` with `Orientation=Vertical`* — number and label swap, and
  *`Alert` with `Show Actions=true`* — a three-way rotation,
  LTR `[Content/Title, Content/Description, Button/label]` →
  RTL `[Button/label, Content/Title, Content/Description]`.
  The robust restore snapshots each LTR text under the **path of ancestor layer names** from the
  instance root (`Content / Title`, ` Button / label`), then writes into the RTL twin by that key.
  Paths are stable across the flip; document order is not. Pair the LTR and RTL instances by host
  set name, LTR sorted `(y asc, x asc)` and RTL `(y asc, x desc)`. **Run it in dry mode first** —
  it is a detector as well as a repair, and it is the only check that sees this failure.
- **A vertical `Steps / Step item` rendering its marker outside the box is NOT automatically the
  known component defect.** The Group-B/C note pins that on `Has tail=False`; before applying the
  Has-tail=True + hide-Divider + HUG workaround, **read a shipped correct instance and compare**.
  A correct RTL vertical item has the number at `left ≈ +14` inside its 38px box and the label at
  `left ≈ -67` escaping left. If the item instead shows the number at `left ≈ -19` with the label
  straddling the box, the geometry is a symptom, not the cause — the *label text has been written
  into the number property*. Tell: `Step Number Text#40649:359` holds the label string. Height is
  not involved; forcing `layoutSizingVertical='HUG'` changes nothing.
- **A `SKIPMIRROR`/artwork guard anchored on one name form silently misses its siblings.** A guard
  matching `Gift card —` (em dash) did not protect `Gift card back`, a depiction of a physical
  object (magnetic stripe, signature strip). Anchor each form explicitly, and add the same name to
  the **audit's** exclusion too — an intentionally unmirrored subtree otherwise fails the alignment
  transpose and invites someone to "fix" it by mirroring it.
- **A multi-group number inside Arabic reverses without a bidi isolate; a standalone one does not.**
  `رقم البطاقة 6000 1494 3245 1609` renders as `1609 3245 1494 6000` — the spaces between digit
  groups are neutrals that resolve to R in an RTL paragraph. Wrap the run in `U+202A…U+202C`. The
  same number alone in its own TEXT node is safe: no strong RTL character, so the paragraph is LTR.
  Verify this class of fix by rendering a control pair (isolated vs not) side by side rather than
  trying to read bidi out of a screenshot.
- **Check the FORM map against the actual instance census before running, not against the brief.**
  `Table Cell`, `Alert`, `Accordion Item` and `Steps / Step item` were all absent from a FORM map
  that a hand-off document described as containing them. A missing entry does not error — the
  instance falls through to the glyph branch, matches no mirrored id, and is skipped whole: no
  flip, no restore, no translation, and the free-text pass cannot reach inside it either.

## Corrections verified 2026-09-17 (Creative Hero — marketing blocks with a manual scatter stage)

- **`mirror()` has no branch for a `layoutMode: 'NONE'` parent, and the generic advice
  (`x = parent.width - x - width`) is wrong for a rotated child.** A scatter stage of rotated,
  absolutely-placed cards mirrors by **reflecting each child's bounding-box centre** across the
  parent's vertical axis and **negating its rotation** — never by reversing the child list (there is
  no flow order to reverse, and reversal is what buries an ABSOLUTE child). Negate `rotation` first,
  then correct position from `absoluteBoundingBox`, because `x` on a rotated node is not its
  bounding-box left edge:
  ```js
  const sa = stage.absoluteBoundingBox;
  const recs = stage.children.map(k => { const a = k.absoluteBoundingBox;
    return {k, cx: a.x + a.width/2 - sa.x, cy: a.y + a.height/2 - sa.y}; });   // read ALL first
  for (const r of recs){
    const targetCx = stage.width - r.cx;
    if (Math.abs(r.k.rotation) > 0.01) r.k.rotation = -r.k.rotation;
    const b = r.k.absoluteBoundingBox;
    r.k.x += targetCx - (b.x + b.width/2 - sa.x);
    r.k.y += r.cy  - (b.y + b.height/2 - sa.y);
  }
  ```
  A mirror preserves which card is in front, so leaving z-order alone **is** the correct mirror.
  Verified to 0.001px on 15 rotated cards across three breakpoints.
- **The structural-mirror audit must pair children by layer name PLUS the instance's variant string.**
  Two sibling ` Button` layers share the layer name; after the row reverses, name+ordinal pairing
  matches the LTR primary against the RTL secondary and reports a 159px phantom failure on a row that
  is perfectly mirrored. Key on `name + '|' + mainComponent.name.replace(/Direction=(LTR|RTL), /,'')`.
- **Report the mirror deviation as the MINIMUM of two metrics, or translation looks like a defect.**
  Centre-reflection (`|(Acx − leftEdge) − (rightEdge − Bcx)|`) is the right metric for a centred
  element; leading-edge (`|(A.x − leftEdge) − (rightEdge − B.right)|`) is the right one for a MIN/MAX
  anchored one. A narrower Arabic label breaks whichever metric does not apply — a centred CTA whose
  Arabic label is 58px narrower reports a 29px "error" under the leading-edge metric and 0 under the
  centre one. Neither is a bug; quote the label width delta alongside the residual.
- **Applying the AR twin to a detached eyebrow re-attaches `textStyleId`**, because the style resets
  the 8% tracking that detached it. Expect RTL text-style coverage to come out *better* than LTR
  (21/21 against 15/21 here) and do not treat the asymmetry as a defect. Map a detached node to its
  rung by `fontSize` + `fontName.style`, not by its missing style id.
- **`setProperties({Direction:'RTL'})` did NOT discard nested fill overrides on ` Button`** — all 12
  buttons kept their label `boundVariables.fills`, including a deliberate `theme/foreground-inverse`
  rebind. Keep the snapshot-and-re-assert step as a detector, but read the result: "repaired 0 of 12"
  is the honest report, not "the override was restored".
- **Do not translate structural layer names in a block.** The skill's "rename the layer to its Arabic"
  rule was written for placeholder-named atoms (`Header` → `العنوان`). In a block, layer names are
  roles (`Copy panel`, `Work card — 1`) and both the structural-mirror audit and the documentation
  pass pair LTR↔RTL by layer path. Translate the copy, keep the path.
- **Re-break Arabic headings by measurement, not by copying the English break.** A three-line English
  Mobile heading needed only two lines in Cairo at the same rung, which made that RTL variant
  *shorter* than its LTR twin (356 vs 404). Conversely Cairo's taller line box (144px at 8XL against
  Geist's 125) grew the Desktop twin 626 → 668, which forces a **row re-pitch**: recompute each row's
  y from the tallest of its six variants, resize the set, and move the motion chips with their rows.

---

**After this pass, refresh the component index.** It is what other agents read to find
components, and it goes stale silently. Run the `figma-index` skill — about seven read-only
Figma calls — and commit the diff. Do not hand-edit `design/index-atoms.*`.
