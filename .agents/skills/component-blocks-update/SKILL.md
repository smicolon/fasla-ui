---
name: component-blocks-update
description: The mandatory process for designing and building any new component blocks in the Fasla UI Figma file (the project formerly called SMI-UI / smicolon) — dashboard blocks, marketing/landing-page blocks, onboarding patterns, empty states, settings screens, or any other UI pattern set. Use whenever the user asks to build, design, add, or redesign blocks/patterns/screens in Figma. Covers research, design-system inventory, direction approval, token-bound building, brand naming (Fasla / فاصلة), social icon sourcing, and validation.
---

# Component Blocks — Fasla UI build process

This is the standing agreement for how new component blocks get designed and built in the
Fasla UI Figma file (`yGEQmCZOvs7KptsYUdB0Xg`). Follow the phases in order. Do not skip phases.

The project was renamed from **SMI-UI / smicolon** to **Fasla**. Everything you build carries
the new name — see [Brand naming](#brand-naming--fasla--فاصلة).

**Prerequisites**: load the `figma-use` skill (mandatory before any `use_figma` call) and
`figma-generate-design`.

**Roles** — two different things hide behind "who do I ask", so keep them apart:
- **the designer** — the user who asked for this work. They answer every stop-and-ask and
  approve every direction. Address every question to them.
- **existing work** — anything already in the file that you did not create in this session,
  whoever authored it. Never clone it as a deliverable and never modify it, regardless of who
  made it or who is asking.

---

## Scope & handoffs

This skill builds **new desktop block components**, and it stops there. Each of the following
is a separate session with its own skill. When a build finishes, name the next skill and
stop — do not roll into it, even when the designer would obviously want it next.

| Follow-up work | Skill | When |
|---|---|---|
| Tablet / Mobile breakpoint variants | `responsive-variants` | Only after the desktop blocks are final-approved. Never during a build session. |
| RTL / Arabic `Direction` variants | `rtl-component-creator` | After the LTR blocks are approved. Blocks are built LTR-first. |
| Component doc pages, spec sheets | `component-doc-generator` | After the component is final. |
| Agent-ready docs, content contracts | `genui-component-docs` | After the component is final. |

RTL is out of scope here, with one exception: if the designer explicitly asks for a block
*as* an RTL block, build it RTL and follow the Arabic script rule in
[Brand naming](#brand-naming--fasla--فاصلة). Adding a `Direction` axis to an existing
component set is always the handoff, never this skill.

---

## Non-negotiables (learned the hard way — violations are defects)

**Keep doing (validated as right):**
1. Bind every color via `setBoundVariableForPaint` to `theme/*` variables.
2. Reuse design-system components as instances (Buttons, Badges, Inputs, Progress, …).
3. Design unprovided patterns yourself from research.
4. Validate visually with `get_screenshot` after every block.

**Never do again (each of these happened once):**
1. **Never clone existing work in the file as a deliverable.** Existing drafts and the
   inspiration section show *style and intent*, not the answer. Inspiration ≠ duplication.
   Always produce an original design grounded in the design system + research. (Cloning is
   only allowed when the designer explicitly says "reuse/copy this design".)
2. **Never hardcode padding or gap numbers.** Every `paddingTop/Right/Bottom/Left` and
   `itemSpacing` must be bound to the `💨 Tailwind` collection `spacing/*` variables via
   `setBoundVariable`. (spacing/1=4, 1,5=6, 2=8, 2,5=10, 3=12, 4=16, 5=20, 6=24, 8=32 …)
3. **Text fills the width — not hug.** Every text in a vertical or fill-width container gets
   `layoutSizingHorizontal = "FILL"` so it wraps to the container. HUG is only for inline
   labels inside HUG rows (badges, buttons, counters).
4. **Check the full component inventory before building anything manually.** Modal (its
   content `SLOT` accepts children on instances), Modal Header, Footer Actions, Carousel
   (= stepper dots, `No. of items` 2–4 + `Active Item`), Accordion / Accordion Item, Steps
   (Horizontal / Vertical / Step item with Done/Current/Upcoming + tails), Tooltip, Popover,
   Progress (sm/md/lg, 0–100% in 5% steps), Badge, Avatar, Inputs, Tabs, Alert, Separator,
   Skeleton, icons page, **Social Icons (separate from the general icon components)**.
   Manually rebuilding something that exists as a component is a defect.
5. **Radius, typography, shadows are tokens too**: `border radius/*` vars on all four corners
   (none=0, xs=2, sm=6, md=8, lg=10, xl=14, rounded=9999), text styles `Tailwind En/*`,
   effect styles `Light/shadow/*`. No raw values where a token exists.
6. **Raise problems the moment they happen — never in the final report.** If anything must
   change, gets skipped, fails, or a capability is missing: stop and ask the designer right
   then (AskUserQuestion). The final report must contain zero surprises.
7. **Never ship a brand name other than Fasla / فاصلة, and never silently rewrite an old
   one.** Any company or product name you type is `Fasla` (`فاصلة` in Arabic). Any leftover
   `SMI-UI` / `smicolon` you find is a question for the designer, not a fix you make on your
   own — see below.
8. **Brand/social icons come from the Social Icons component — never from the general icon
   components, never drawn, never imported.** If the platform you need isn't there, stop and
   ask the designer to add it, then continue — see below.
9. **Never create one component per block type.** A block family is **one component set**
   whose `Type` variants carry every variation — not N standalone components sitting next to
   each other. See below.

---

## One component set per block family

Every block family ships as **a single component set** whose `Type` property carries all the
variations. Twelve hero layouts are one `Hero` set with twelve `Type` values — never twelve
components sitting side by side on the page.

This is a hard rule because **a set is the only place the later axes can go.**
`responsive-variants` adds `Breakpoint` and `rtl-component-creator` adds `Direction`, and both
attach to an existing set. Ship N standalone components and someone has to rebuild the whole
family as a set before either handoff can even start.

### How to build it

1. Build the first type as a frame. Screenshot-validate it, then
   `figma.createComponentFromNode(frame)`.
2. **Name it for its axis before combining** — `Type=Centered`. Figma derives the property
   name and value from that `Name=Value` string, so the name is the API.
3. Build each remaining type the same way, each named `Type=<value>`.
4. `figma.combineAsVariants([c1, c2, c3, ...], page)` → the set. Rename the set to the family
   name (`Hero`, `Footer`, `Pricing`): the set name is the component name, the variant values
   are the types.
5. Read back `set.componentPropertyDefinitions` and confirm exactly one property exists with
   every value present.

### Rules for the axis

- **One property, named for what actually varies.** `Type` is the default; use a truer name
  when there is one (`Layout`, `Alignment`, `Columns`). Never `Variant`, `Style`, `Option`,
  or `Component`.
- **Values are descriptive, never numbered.** `Type=Centered`, `Type=Split with image`,
  `Type=Left aligned` — not `Type=1`, `Type=2`, `Type=Hero 3`. The value is what a designer
  reads in a dropdown, and a number tells them nothing.
- **Every variant must declare the same property keys**, or Figma rejects the set as
  incomplete. Add a type later by naming the new component `Type=<value>` and appending it
  into the existing set — never by starting a second set.
- **A second axis is a second property on the same set**, never a second set. If a family
  genuinely needs two (`Type` × `Density`), say so in the Phase 3 proposal and get it approved
  first — the variant count multiplies.
- Variants may differ in size; the set frame resizes around them.

---

## Social & brand icons

Every third-party brand mark comes from the **Social Icons** component set
(`40334:57763`, properties `Platform` × `Color`). It sits on the Icons page (`3637:6775`) —
the *same* page as the general UI glyphs, which is exactly what makes this easy to get
wrong. The general icon components are UI glyphs (check, x, chevrons, minimize, …) and are
not interchangeable with brand marks: brand marks have their own artwork, proportions, and
colors that must stay consistent everywhere they appear.

That page also holds **loose single-colour glyph copies** of facebook, instagram, linkedin,
twitter, youtube, github and dribbble. Those are decoys — instantiate the set and set
`Platform`, never pull a mark by name. `references/file-inventory.md` lists the decoy ids
and the 13 platforms the set actually offers. **Google, Apple and Behance are not among
them**, so any sign-in / SSO row is a stop-and-ask before you start building it.

1. Re-verify the set in Phase 2 (`40334:57763`) and check the platforms your blocks need
   against the list in `references/file-inventory.md`. Do this **before** you design any
   block with a social row — footers, sign-in / SSO buttons, share rows, contact cards,
   team/profile cards, marketing CTAs — not after you've laid one out.
2. Place them as **instances of that component**, then switch the platform via its variant
   property. Do not copy a mark out of the component, do not rebuild one with vectors, and do
   not pull a similar-looking glyph from the general icon set as a stand-in.
3. **A missing platform is a stop-and-ask, not a workaround.** If the block needs a platform
   the Social Icons component doesn't have, stop right there (non-negotiable #6) and ask via
   AskUserQuestion:
   - list exactly which platforms are missing and which block/section needs each one;
   - ask the designer to add the missing icon(s) to the Social Icons component in the file,
     and say you'll continue as soon as they confirm;
   - offer the alternatives explicitly in case they'd rather not add it: **I'll add it and
     you continue** · **Drop that platform from the block** · **Substitute another platform**.
4. After they confirm they added it, re-query the component set (fresh `get_metadata` — the
   variant list and ids change) and continue with the real instance. Never leave a
   placeholder box, a text label, or a wrong-platform icon in place "for now" — that is
   exactly the kind of surprise the final report must not contain.
5. Icon colors follow the same token rule as everything else: bind fills to `theme/*` unless
   the mark's own brand color is intentional and the component already provides it as a
   variant.

---

## Brand naming — Fasla / فاصلة

The project is now **Fasla**. Use exactly these forms:

| Context | Name |
|---|---|
| English / LTR content | **Fasla** |
| Arabic / RTL content | **فاصلة** |

1. **Every company or product name that appears in a block is Fasla.** Nav brand slots,
   sidebar headers, logos and logo text, page and email titles, empty-state and onboarding
   copy, avatars/initials, sample data, placeholder copy, and the names of frames you create.
   Never invent a filler brand (`Acme`, `Company Inc.`, `Your Brand`, `SMI`), and never mix
   scripts — an RTL block says فاصلة, not "Fasla" in Latin letters, and an LTR block says
   Fasla, not فاصلة. Product-name mentions inside body copy follow the same rule.
2. **A legacy name is a stop-and-ask, not a silent fix.** The old names have already been
   renamed in the file, so anything still reading `SMI-UI`, `SMI UI`, `SMIUI`, `SMI`,
   `smicolon`, `Smicolon`, `Semicolon`, a `;` used as the logo, or Arabic `فاصلة منقوطة` is
   either a leftover that was missed or a deliberate exception. Both are possible — that is
   why you ask instead of deciding.
3. **When one turns up** — in an inspiration screen, the structure/size reference frame, an
   existing component or instance, a page / variable / style / layer name, or copy you were
   about to reuse — stop right there (non-negotiable #6) and ask via AskUserQuestion:
   - say exactly where it is (page, frame, node id, layer name) and quote the exact text;
   - offer: **Rename to Fasla / فاصلة** · **Keep as-is (intentional exception)** ·
     **Leave it, decide later**;
   - then do exactly what they picked. "Keep as-is" is a legitimate answer — record it.
4. **Only change what the designer approves.** Rename inside your own work; do not do a
   file-wide sweep unless they ask for one. Never edit component internals or existing frames
   to fix a name — instance overrides only (Phase 4 rule).
5. Batch the finds if several show up at once so they answer in one pass rather than being
   interrupted per layer, but never batch them all the way to the final report.

---

## Phase 0 — Intake & questions

1. Restate the request: list every block type to build and where.
2. Ask clarifying questions immediately (AskUserQuestion) — before touching the canvas:
   - Target page/section? Replace existing frames or add alongside?
   - Is there an inspiration section/screens link? A structure/size reference screen?
   - Does the designer want direction proposals approved first? (Default: yes — propose first.)
   - Anything ambiguous in the request itself.
3. Never assume on ambiguity. When confused mid-task, stop and ask — that is the agreed
   process, not an interruption.

## Phase 1 — Research

- **Inspiration provided** (a Figma section of collected screenshots): `get_metadata` the
  section, download EVERY screenshot (`get_screenshot` → curl, batched), view them all, and
  name the pattern each one shows. Study them well — they define intent and taste.
- **No inspiration provided**: skip asking — research the web directly: Mobbin, Dribbble,
  Behance, real products, pattern galleries (WebSearch/WebFetch for each pattern name).
- Either way, do a web pass on the pattern names for anatomy and best practices.
- Output: a short per-type anatomy note (parts, states, common variants) that the proposals
  in Phase 3 will cite.

## Phase 2 — Design-system inventory (before ANY building)

Start from `references/file-inventory.md`. **It is a cache, not truth** — every id in it was
read on a past date and Figma ids drift. Re-query each id you intend to use before you rely
on it; when one has drifted, correct it in that file and list the correction in the final
report, so the next session starts from better data than this one did.

Run read-only `use_figma` scripts to record, with IDs:
- Pages map; the structure/size reference frame.
- Component sets + variant props + text-prop keys (create a temp instance to read
  `componentProperties` when unsure; remove it after).
- Variable collections: `theme/*` colors, `💨 Tailwind` `spacing/*`, `border radius/*`,
  `typography/*`, `shadow/*`, `opacity/*` — names, ids, values.
- The `theme/*` collection's **mode ids** (Light / Dark) if it is multi-mode. Phase 4 needs
  them to screenshot each block in both modes.
- Text styles (`Tailwind En/{size}/{weight}`) and effect styles (`Light/shadow/default/*`).
- An existing built screen to read authoritative bindings from.
- The Social Icons set (`40334:57763`) — re-confirm its `Platform` values against what your
  blocks need, and remember the decoy glyphs share its page (see
  [Social & brand icons](#social--brand-icons)).
- While you have the map open, note any legacy name (`SMI-UI`, `smicolon`, `;` logo,
  `فاصلة منقوطة`) sitting in the pages, components, variables, styles, or reference frames
  you are about to work from. Collect them and raise them together before you start building
  — see [Brand naming](#brand-naming--fasla--فاصلة).

## Phase 3 — Propose directions, get approval

- For each block type: 1–2 direction options, ≤3 lines each, naming the layout idea, the
  reference it draws from, and which design-system components it uses.
- State the variant axis for each family: the property name and every value you intend to
  ship (see [One component set per block family](#one-component-set-per-block-family)). The
  designer approves the axis, not just the look — renaming a property after the set exists
  breaks the instances already placed from it.
- Present via AskUserQuestion and build only what the designer approves. (Skip only if they
  chose "build directly" in Phase 0.)

## Phase 4 — Build (incremental)

- One block/section per `use_figma` call. Return created node ids from every script.
- **A family is built as one set**: each type as a component named `Type=<value>`, screenshot-
  validated, then `combineAsVariants` into a single set — never a component per type.
  See [One component set per block family](#one-component-set-per-block-family).
- Base frames come from the structure reference (clone it), positioned under the block's
  heading, matching the page's existing layout rhythm.
- Compose from instances; override text via component text props (LTR key starts with `¶ `)
  or the TEXT child when no prop exists.
- Bind everything per the non-negotiables (spacing, radius, colors, styles).
- Every brand name you type is `Fasla` (`فاصلة` in RTL blocks). If a legacy name appears in
  anything you are reusing or overriding, stop and ask before continuing.
- **RTL is already built into the atoms**: every design-system set carries a `Direction` =
  LTR/RTL property, and some (Modal Header, Button) carry separate RTL text props. For an
  RTL block, set `Direction` on each instance — never rebuild or mirror a component by hand.
- Social/brand icons: instances of the Social Icons component, platform set via its variant.
  Missing platform → stop and ask the designer to add it, then re-query and continue.
- `get_screenshot` after each block; fix before moving on. Look for clipped text, overlap,
  placeholder text, wrong variants.
- **Then screenshot the same block in the other theme mode.** Every fill is bound to
  `theme/*`, so flipping the mode is a free audit of that binding: any element whose colour
  does not change is an unbound fill or stroke. Fix it before moving on — this is the
  cheapest check there is on the colour-binding rule, and it catches what the eye misses
  when you only ever look at one mode.
- Never modify existing work in the file unless asked; never edit component internals —
  instance overrides only.
- Images: reuse in-file imagery (screenshots, pattern overlays) per house style. For photos,
  Unsplash → download → `upload_assets` (Figma plugins can't be run through the MCP —
  if the upload path fails, stop and ask the designer to run the Unsplash plugin).

### Technical gotchas (all hit in practice)
- Scrim/overlay: paint-level opacity may not render — use an opaque dark fill
  (`{r:0.02,g:0.02,b:0.055}`) with `node.opacity = 0.5`.
- Clones keep `layoutPositioning:"ABSOLUTE"` from their old parent → set to `"AUTO"` after
  appending into an auto-layout frame, or they land outside the row.
- `resize()` after `layoutSizingHorizontal="FILL"` resets it to FIXED → prefer
  `primaryAxisAlignItems="SPACE_BETWEEN"` over spacer frames.
- Hiding a prop-bound layer flips its component BOOLEAN (can delete sibling text) → blank
  unwanted component text with `characters = ""` instead of `visible = false`.
- A timed-out `use_figma` call may still have executed → re-query for the nodes by name
  before re-running, or you'll create duplicates.
- `combineAsVariants` needs every component to already share one parent → append them all to
  the same page or frame first, and pass COMPONENT nodes, not frames.
- Renaming a variant property after instances exist drops their overrides → get the axis
  approved in Phase 3 and name it right the first time.
- Set `layoutSizing*` only AFTER `appendChild`; position top-level nodes away from (0,0);
  load Geist fonts (`Regular`/`Medium`/`SemiBold` — no space) before text edits;
  `await figma.setCurrentPageAsync()` to switch pages.

## Phase 5 — Review & report

1. Full-section screenshot; run the checklist below; fix everything before reporting.
2. Naming pass: read back the text of everything you created and confirm each brand mention
   is `Fasla` / `فاصلة`, in the right script for the block's direction.
3. Report: what was built and where (frame names + positions), which components and tokens
   were used, the research sources, a one-line naming note (legacy names found, and what the
   designer decided for each — renamed / kept as an exception / deferred), any id corrections
   written back to `references/file-inventory.md`, and the follow-up work now unblocked with
   the skill that owns it (see [Scope & handoffs](#scope--handoffs)).
4. The report contains no surprises — every deviation was already raised and resolved
   during the process (non-negotiable #6).

### Final checklist
- [ ] Every padding/gap bound to `spacing/*`
- [ ] Every fill/stroke bound to `theme/*`
- [ ] Radius bound to `border radius/*`; typography via text styles; shadows via effect styles
- [ ] Texts set to FILL (except inline labels in HUG rows)
- [ ] Every applicable design-system component used as an instance — nothing rebuilt manually
- [ ] All social/brand marks are Social Icons instances — none taken from the general icon set,
      drawn, or left as placeholders; any missing platform was added by the designer before
      shipping
- [ ] Each block family is ONE component set — no family split into standalone components
- [ ] Variant property named for what varies, values descriptive (not numbered), every variant
      sharing the same property keys, verified via `componentPropertyDefinitions`
- [ ] Designs are original — nothing cloned from existing work in the file
- [ ] Each block screenshot-validated; full section screenshot-validated
- [ ] Each block screenshot-validated in **both** Light and Dark modes — nothing kept the same
      colour across the two (anything that did is an unbound fill)
- [ ] Every brand mention reads `Fasla` (`فاصلة` in Arabic blocks) — no invented filler brands,
      no mixed scripts
- [ ] No legacy name (`SMI-UI`, `SMI`, `smicolon`, `;` logo, `فاصلة منقوطة`) left unaddressed —
      each one found was raised and resolved by the designer's decision
- [ ] Any drifted id corrected in `references/file-inventory.md` and named in the report
- [ ] Directions were approved up front; all mid-process questions resolved
- [ ] Follow-up work (responsive, RTL, docs) named and left to its own skill — not started here
