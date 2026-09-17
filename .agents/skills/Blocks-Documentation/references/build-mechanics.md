# Build mechanics — figma-console `figma_execute`

Everything here was learned by hitting the failure. Read it before writing a build call.

## The builder pattern, and how it betrays you

Long scripts time out even when the work takes milliseconds. The workaround is to install helpers
onto `globalThis` once, then send short calls. Two traps:

1. **`globalThis` does NOT survive a timed-out call.** A timeout resets the plugin sandbox and wipes
   every installed helper, while helpers installed by *later* calls survive — so a surviving helper
   calling an erased one throws `TypeError: not a function`, far from the real cause.
   **Probe first, in every call that depends on helpers:**
   ```js
   const G = globalThis;
   const need = ['C','af','T','rt','SET'];
   const missing = need.filter(k => typeof G[k] === 'undefined');
   if (missing.length) return { REINSTALL: missing };
   ```
2. **Installed functions must be fully self-contained.** A helper that closes over a `const` from the
   installing call loses it — the function object survives but `typeof AR` inside it is `undefined`.
   Reference `globalThis.X` for every dependency, or inline the literal. Never a local.

**`loadFontAsync` in bulk is itself a timeout risk.** Eight faces (4 Inter + 4 Cairo) in one call
timed out twice and installed nothing. Load **one family per call**, then install helpers in a
separate call containing **no `await` at all**.

## Layout traps

- **`layoutSizingHorizontal='FILL'` throws unless the node is already a child** of an auto-layout
  frame. Always `parent.appendChild(n)` then `n.layoutSizingHorizontal='FILL'` — never
  `parent.appendChild(fill(make()))`.
- **`layoutGrow = 1` on a child of a VERTICAL container locks that child's height.** It means "fill
  the primary axis", so a card freezes at its label height and clips everything below. Setting
  `layoutGrow = 0` does **not** release it — you must set `child.layoutSizingVertical = 'HUG'`.
  Only use `layoutGrow` to distribute width in HORIZONTAL rows.
- **Apply `layoutSizingVertical='FILL'` as a post-pass**, after the whole tree is built, outermost
  first. During construction it freezes the parent's hug height at a stale measurement.
- **`resize()` locks the axis to FIXED.** After sizing an outer frame, restore
  `primaryAxisSizingMode='AUTO'` and keep `counterAxisSizingMode='FIXED'` to hold the width.
- **`layoutGrow` is 0 or 1 only** — not a flex weight. Unequal columns need fixed widths:
  `c.counterAxisSizingMode='FIXED'; c.resize(w,10); c.primaryAxisSizingMode='AUTO'`.

## Placement traps

- **A SECTION child's `x`/`y` are relative to the section origin**, not the canvas. Order matters:
  set `sect.x` → `sect.appendChild(doc)` → `doc.x = 80; doc.y = 80`.
- **Never move a section after appending** — the child's relative coordinate goes stale and the doc
  ends up thousands of px outside its own section. If you must move it, re-set `doc.x/​y` after.
- **Always verify placement with `absoluteBoundingBox`**, not `x`. Confirm
  `doc.absoluteBoundingBox.x - sect.absoluteBoundingBox.x === 80` before believing it.
- **Never guess a node id you did not return.** Assuming `body = docId + 2` landed an `appendChild`
  inside the masthead *instance* → `Cannot move node. New parent is an instance or is inside of an
  instance`, after the section had already been built, leaving an orphan. Return every id you will
  need later (doc, body, section) from the call that creates it.
- **Place each new doc clear of everything already on the page.** List `page.children`, sort by
  `absoluteBoundingBox.x`, and check for overlaps — including loose TEXT nodes the designer left
  lying around. **Move your own frame, never theirs.**

## Housekeeping

- New nodes attach to the current page the moment they are created. If a call throws partway, the
  half-built nodes are orphaned. **Clean up before retrying** — and never delete a node you did not
  create (a loose note is the designer's).
- Rebuild a section **in place** with `body.insertChild(idx, node)`, not `appendChild`, or the order
  scrambles.
- After a timeout, **re-query before retrying** — the write often lands late and you get duplicates.

## Verification

- Use `figma_capture_screenshot` (plugin `exportAsync`), **not** `mcp__figma__get_screenshot`, which
  reads the saved cloud version and 404s on nodes just created.
- No `FIGMA_ACCESS_TOKEN` is configured in this environment, so REST-based image and file tools fail.
  The plugin bridge is the only reliable path.
- Screenshots prove layout. They do **not** prove fonts, alignment, links, or pin anchoring —
  audit those with data. See `references/audits.md`.

## Two traps found building the Offers doc (2026-09-13)

**`"a string".link` is truthy.** `String.prototype.link()` is a legacy Annex B method that every
string carries, so a table helper branching on `if (cell.link)` sends **every plain string cell**
down the hyperlink path and dies with
`in set_characters: Property "characters" failed validation: Required value missing` — a message
that points nowhere near the cause. Guard on the shape, not on truthiness:
`typeof v === 'object' && typeof v.link === 'string'`. This cost six failed calls.

**A throw inside `figma_execute` is not always catchable by your own `try/catch`.** The bridge can
surface it as a whole-call failure while your `catch` never runs, which reads exactly like a
concurrent-session collision. Log into a `globalThis` array and read it back in the *next* call to
localise it.

## Table column widths in `doc-spec.md` overflow — give the last column `layoutGrow`

The reference widths (manifest **260 / 500 / 642**, content limits **360 / 130 / 400 / 512**) are
measured off the FAQ doc, whose sections are **1420** wide because of its 10px stroke. Applied to a
canon **1440** section they overflow the row and the last column is silently clipped.

Build it as: every column except the last at its specified width, each non-last cell carrying
`paddingRight = 24` as the gutter, and the **last column `layoutGrow = 1`**. It then lands at
**636** (manifest) and **506** (content limits), the total is exact, and no text touches. Do this
rather than editing the numbers — the grow keeps it correct if the section width ever changes.
