# INSTRUCTIONS.md — Fasla UI

Every standing instruction Yasmin has given on this project, collected from the Fasla sessions
(2026-07-11 → 2026-09-06) and the project memory files. This is the **register of what she asked for**;
[FIGMA.md](FIGMA.md) is the technical reference for how the file and tooling work.

Rules here are **standing** unless she changes them — they carry from one session to the next and from
one block family to the next. Where a rule came from a correction, that is noted: those are the
expensive ones.

---

## 1. The three standing prompts

She reuses the same three briefs for every block family, changing only the family name and the page
link. Treat them as the spec even when a skill wants to ask more.

### 1.1 Build (pass 1 — desktop, LTR)

> Use component-blocks skill to build **{Family}** components on this page {figma link}
>
> - You can use some websites for inspiration like mobbin, awwwards, dribbble, behance, and any other
>   websites. You can search real websites as well. **I need you to build as many different types &
>   styles & design layouts as you can.** Ask me if needed.
> - **Build the components on the "component name" section.** Widen it or increase the height if you
>   need. **Do not include the component names on the section** — the components are already with their
>   names and that's enough.
> - If the components need any motion, **add motion chips similar to the ones on the "About" page** and
>   in other pages for other blocks components.
> - Use "Unsplash" plugin to add any free images if needed.

### 1.2 Responsive (pass 2 — Tablet + Mobile)

> Apply responsive-variants skill to the components.
>
> - **Make sure the new variants are added beside the current variants, not below them.**
> - **If any of the breakpoints will be identical or almost identical to the desktop variant, design
>   them anyway.** We need to set what the other breakpoints would look like even if they're the same.
> - **Also update the motion** if they're gonna have any differences than the original desktop variant,
>   so they would have the motion of all breakpoints altogether.

### 1.3 RTL (pass 3 — Arabic)

> Apply figma-rtl-variant skill on the components you built.
>
> - Make sure the variants are **beside the current variants, not below them**.
> - **Also update the motion** if they're gonna have any differences than the LTR variants, so they
>   would have the motion of all breakpoints & directions altogether.
> - **Always review the alignment and make sure it mirrors correctly.**

---

## 2. How she wants to be worked with

- **Build directly. Do not open approval gates.** When a skill prescribes an "approve directions
  first" checkpoint, she skips it — she chose "Build directly" twice by name on the Features session,
  and when the RTL skill's mandatory pre-build checkpoint was raised as a question batch she
  **rejected the tool call and re-sent her original instruction verbatim**. If she re-sends an
  instruction unchanged after a question, that means *stop asking and build*.
- **Her up-front bullets are the spec.** Re-asking her to choose between options she has already
  constrained reads as not having listened.
- **Ask only what genuinely blocks work or is irreversible** — a variant-axis name that would break
  instance overrides later, a token that doesn't exist, a missing Social Icons platform. Batch those
  into one short set, early.
- **Never open with "should I proceed?"** She has already said proceed.
- **Show progress as screenshots per block**, not as requests for sign-off.
- **Raise a problem the moment it happens, not in the final report.** The report must contain zero
  surprises.
- **She often works from what is on her screen** — "check the page I am currently opening now",
  "check the file I'm opening". Read the live selection/page rather than assuming.
- **"Continue from where you left off" / "please continue your work"** is a frequent instruction after
  a timeout or interruption; pick up mid-pass without re-planning.
- **Fix it properly and don't repeat it.** On misaligned Arabic docs: *"why all of those issues and
  misalignment here? please fix all of this and don't repeat that issue again."*
- She sometimes asks you to **remember the conversation** before continuing — write the durable parts
  to memory, don't just acknowledge.

---

## 3. Brand & naming

- **The project is Fasla.** English/LTR content says **Fasla**; Arabic/RTL content says **فاصلة**.
  Never mix scripts within one direction.
- **Never invent a filler brand** — no Acme, Company Inc., Your Brand, SMI.
- **Legacy names are a stop-and-ask, never a silent fix.** Anything reading `SMI-UI`, `SMI UI`, `SMI`,
  `smicolon`, `Semicolon`, a `;` used as a logo, or `فاصلة منقوطة` gets raised with its exact location
  and quoted text; she decides rename / keep as intentional exception / defer.
  - She has already ordered one sweep explicitly: *"check all the frames called 'SMI UI Component
    Documentation' … remove this 'SMI UI' from all frames"* → *"keep them all frames naming that have
    SMI UI to be Fasla instead."* That was a scoped instruction for those frames, not a licence to
    sweep the file. **111 occurrences across 2 pages remain unresolved** and must not be swept.
- **Use the real `Fasla Logo` component set** for any mark — never draw one, never leave a text
  placeholder. It has its own `Direction` prop and swaps to the فاصلة lockup in RTL.
- Sample company/person data is fictional (Northwind, Meridian, Alex Rahman, Nadia, Omar) — but a slot
  that belongs to *the product* says Fasla.

---

## 4. Component structure

- **One component set per block family.** *"When you start creating any blocks, it should create only
  one component that has all type variations — not create each type as a component itself."* Her
  instruction, which is why the skill was renamed to `component-blocks-update`.
  - She also had the already-built FAQ page retro-fitted: *"merge all the components in only one
    component set, add a property that will be called 'Type' to set a name for each type of sections."*
- **Variant values are descriptive, never numbered** — `Type=Centered Minimal`, not `Type=1`.
- **Build as many distinct types, styles and layouts as possible.** Range is the point; near-duplicates
  are not.
- **Build inside the "Component Name" section.** Widen or heighten the section as needed. **Do not add
  component name labels** into the section — the components carry their own names.
- **Variants go beside each other, never below.** With all three axes: LTR trio, gap, RTL trio, one row
  per `Type`, row height = tallest of the six.
- **Never clone existing work in the file as a deliverable**, and never modify existing work or
  component internals — instance overrides only.
- **Reuse the design system.** Rebuilding by hand something that exists as a component is a defect.

---

## 5. Tokens & design system

- **Everything is token-bound** — no raw values where a token exists: fills/strokes → `theme/*`;
  padding and gaps → `spacing/*`; radius → `border radius/*` on all four corners; type → text styles;
  shadows → effect styles.
- **Light is the default mode. Standing rule, given as a correction on the FAQ page:** *"please make
  the light mood the main default mood for all components — I see now FAQ are all in dark mood, please
  keep them all as default mood which is light not dark, **and this rule will be applied going
  forward**."* Never pin a page or component to Dark. A deliberately dark block gets that from
  `theme/background-inverse`, not a mode override.
- **Arabic type is Cairo**, via `Tailwind AR/*`. Given as an explicit correction: *"just one small
  change in the arabic document — change the font to be Cairo. Please update that also inside the
  skill."* When her spec notes and the file disagree, **the file wins** (her own ruling on the
  Almarai/Cairo conflict).
- **Brand/social marks come only from the Social Icons component set** — never the loose decoy glyphs,
  never drawn, never a lookalike from the general icon set. A missing platform is a stop-and-ask.
  - Where the set genuinely has no mark (Visa/Mastercard/Amex/PayPal), her call was: generic
    `credit-card` glyph + the brand in text. Nothing is ever left as a placeholder.

---

## 6. Motion chips

- **Every block that needs motion gets a chip**, matching the ones on the About page.
- Chips sit **outside** the component set, at x=246, top-aligned with their row.
- **A chip documents all six variants of its type**: summary · choreography · **breakpoint behaviour**
  · **RTL behaviour**.
- **Update the chip after every pass.** Her responsive and RTL briefs both say so explicitly — the
  breakpoint line is rewritten after the responsive pass and the RTL line after the RTL pass, so each
  chip describes what actually shipped rather than what was planned.

---

## 7. Imagery

- **Use Unsplash for free photos** where a block needs them.
- Reuse image hashes across variants and across families rather than re-uploading.
- **Photographs are never mirrored** in RTL — only the frame they sit in moves.
- Photo scrims: she chose **token-compliance over a real gradient** — one flat
  `theme/background-inverse` fill at reduced `node.opacity`. Where partial opacity doesn't composite,
  pick an already-dark photo instead of shipping a scrim you cannot see.
- Billing-type product UI is deliberately **photo-free** except where a block genuinely needs imagery.

---

## 8. RTL / Arabic

Her original brief when the RTL work started (2026-07-11), still the governing spec:

> - Read and study each component I give you first.
> - Add a new property called **"Direction"** with two options: **LTR** and **RTL**.
> - Create new RTL variants by **flipping the direction** — instead of left-to-right, flip everything
>   to right-to-left.
> - **Change the naming itself** — e.g. a placeholder called "Header" becomes "العنوان", in **Modern
>   Standard Arabic**.
> - Use the **"Tailwind AR"** styles folder for Arabic text.
> - All RTL variants live **on the same component**.
> - **Consider all the hidden properties** — they follow the same rules.

Refinements she added afterwards:

- **Grouping (correction):** *"I want all the LTR variants and then all RTL variants inside the
  component — first organize all the LTR variants, then take a space, then put all the RTL variants."*
  Not interleaved. This replaced her first instruction that each RTL twin sit under its LTR twin.
- **Containers must flip too (correction):** *"each container that contains multiple LTR variants
  should also be flipped — instead of having the auto-layout to the left I want it to the right …
  please review all the RTL components that you created and fix this issue."* Reversing child order
  alone is not mirroring; the alignment/anchor flips are required.
- **Demo person names translate** — default **"محمد حسين"**. Later families transliterate the actual
  demo name instead (Nadia Rahman → نادية رحمن) rather than substituting the generic one.
- **Never change colors.** States keep identical colors across directions.
- **Cover every property combination**, including hidden and secondary props. RTL count must equal
  LTR count.
- **Always review the alignment and make sure it mirrors correctly** — her line, in every RTL brief.
  Prove it with the alignment-symmetry audit and the instance census, not by eye.
- Stay Latin inside Arabic copy: brand, product and technology names (Figma, Tailwind, shadcn/ui, API,
  SSO, SCIM, GDPR, SOC 2, App Store), emails, domains, dial codes, codes, and all numerals.
- Never mirror: photographs, QR codes, pictograms, code/terminal windows.
- **Button icon slots are mirrored by toggling the Left/Right icon props** — her call, because the
  atom's own RTL variant does not move them.

---

## 9. Responsive

- **Beside, not below** — same as RTL.
- **Design every breakpoint explicitly, even when it is identical to Desktop.** *"We need to set what
  the other breakpoints would look like even if they're the same."* Never leave a breakpoint implicit.
- **Update the motion chip** with the breakpoint behaviour.
- Only run this pass on **final, approved desktop blocks** — never during a build session.

---

## 10. Documentation (`component-doc-generator`)

Built to her spec across the 2026-08/09 doc sessions. Her instructions:

- **Match the house style exactly.** She repeatedly compared her existing doc against the generated one
  and asked for the generated one to be adjusted to hers: *"please follow the same style as we have
  inside our file"*, *"I want to make sure that all are consistent so please follow the same direction
  that we already have in our design system."*
- **Anatomy section:** number each item in the component with **numbered pins and arrows**, and list
  all the atoms down the right side, each with its own color — as in her design system.
- **Layout & spacing section:** draw the spacing as **lines with the pixel number on top of each**, a
  different color per spacing type (Horizontal padding · Vertical padding · Item Gap), then list the
  spacing the way she does (Layout · MD Spacing · Shape).
- **Use the real components, don't attach/detach them** — *"please use the same component for this
  header frame as I already used in my previous documentation, and don't attach it."* Use live
  instances of the real variants; never move or alter the source component.
- **Remove** the "Documentation" header you invent, and **remove the direction section** — RTL gets its
  own whole document.
- Keep the header **centered**; add white space at the bottom so the frame isn't cropped.
- **Self-review pass:** after the doc is applied, the skill must **review itself again and do a final
  retouch** — confirm every required section exists, carries correct information, and is designed
  exactly like the reference.
- **English first, then Arabic.** *"Always ask me after finalizing the English documentation if it is
  okay to start the Arabic documentation, because I want first to finalize and approve the English
  one."* The Arabic doc goes in a **separate frame**, uses the **RTL variants**, **Modern Standard
  Arabic**, and **Cairo**.
- **Do not document hover** — Default and Active/Pressed only.
- When she adjusts a component (new sizes, new variants), the instruction is to **re-run the skill and
  refine the existing docs in both languages**, including the Do's & Don'ts section.

---

## 10b. The atoms pipeline — `/fasla-atoms-agent`

Requested 2026-09-06. One command for a **finished atom component**: RTL variants → English
documentation → Arabic documentation.

**Two approval gates, both explicitly asked for:**
- after the RTL variants are built, **before** any documentation starts;
- after the English documentation, **before** the Arabic documentation.

**Why this matters:** it is the one deliberate exception to [§2](#2-how-she-wants-to-be-worked-with)
"build directly, no approval gates". She specified these gates by name when she specified the
pipeline. A future session must not remove them on the grounds that Fasla work skips checkpoints —
the general rule is about *not re-asking questions she has already answered*, and these two gates are
her answer, not a question. Everything between the gates still follows the build-directly rule.

**Architecture (her spec, 2026-09-06):** two folders, no duplicated text.
- `~/.claude/skills/` — the original skill files (`rtl-component-creator`, `component-doc-generator`,
  and any other atom-related skill). **Single source of truth.**
- `~/.claude/agents/fasla-atoms-agent.md` — the agent. It must **not** contain a copy of the skill
  instructions; it references them by path only. It holds just the upfront question phase, the phase
  order with its gates, and the final report format. Any edit is made in `skills/` and applies to the
  agent automatically — no syncing.

The gates run in the main conversation, because a subagent cannot pause to ask. Phase work may be
delegated to a subagent; the gate that follows it may not.

Atoms never run `responsive-variants` — they carry a `Size` property rather than a `Breakpoint` axis.

---

## 11. The pipeline

The four skills she studied and set up, in her own numbering:

1. **`component-blocks-update`** — build the block components (one set, all types)
2. **`responsive-variants`** — add Tablet & Mobile breakpoints
3. **`figma-rtl-variant` / `rtl-component-creator`** — add RTL variants for all LTR variants
4. **`genui-component-docs`** / **`component-doc-generator`** — documentation ("still needs work → V2")

Each is a **separate session**. A build session ends by naming the next skill and stopping — it does
not roll into the next pass, even when she would obviously want it.

---

## 12. Settled decisions — do not re-litigate

- **Copy is generic SaaS**, not Fasla-product marketing. Brand appears only where a product name
  genuinely belongs (nav wordmarks, "Sign in to Fasla", `app.fasla.com`, a referral code).
- **`Breakpoint` values are `Desktop` / `Tablet` / `Mobile`**, even though the `💻 Responsive`
  collection names that mode `🖥️ Web`. A mode and a variant value are different things. Closed.
- **RTL keeps the same photos as LTR**, including photos with English UI baked into them.
- **Scrims are one flat token-bound fill**, not a gradient.
- The **Lightbox Viewer is bespoke**, not the Modal component — a lightbox is a different pattern.
- The **Error State family deliberately covers sibling states** (500, 403, offline, maintenance, empty
  search), because the section is named "Error States Documentation".
- **Billing/Auth pages are built at marketing 1440 geometry** even though the content is product UI, so
  the responsive and RTL passes attach later without a rebuild.
- **Terminal/code blocks use `Tailwind En/SM/Regular`** — the file has no monospace style, and that was
  flagged rather than invented.
- **`Button` Solid/primary is unreadable in Dark mode** — her call was *report it, don't patch
  instances*. It needs its own session.
- **Marquee text clipped by its band is intentional** (that's the overflow), not a defect to fix.

---

## 13. Open items she is aware of

- **111 legacy `SMI UI` occurrences** across two pages (`Navigation Bars…`, `Onboarding &
  Walkthroughs…`) — layer names and body copy, including one half-finished rename that broke a
  sentence. Raised, unresolved, **not** to be swept.
- **`COMPONENT SMI-UI Logo`** on the `🟢 Logo` page — raised, deliberately left alone.
- **Button Solid/primary Dark-mode contrast** — reported, unpatched.
- **`Hero` set (56 types)** — Desktop/LTR only; responsive and RTL passes still open.
- **Documentation / content contracts** for the newer block families (Banners, Billing, Auth, Error
  State, Gallery, Features) — the `component-doc-generator` and `genui-component-docs` passes have not
  been run on them.
- **Category Chip Grid** (FAQ) has zero component instances — needs rebuilding from design-system
  components. **Accordion Item layer names** are stale placeholders — need renaming. Both logged by her
  as follow-up, not to fix inline.

---

## 14. Where this came from

Reconstructed from the Fasla UI session group (30 sessions, 2026-07-11 → 2026-09-06) and the project
memory files in `~/.claude/projects/-Users-jasmine-Desktop/memory/`. Quoted lines are hers, verbatim
from the transcripts; light punctuation only. Technical mechanics live in [FIGMA.md](FIGMA.md); the
build process lives in `~/.claude/skills/component-blocks-update/SKILL.md`.
