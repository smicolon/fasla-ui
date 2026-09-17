# Audits — prove it with data, not screenshots

A screenshot shows layout. It does not show a wrong font, a stale hyperlink, a mis-anchored pin or a
literal `**` marker. Run these before saying a doc is done, and report the numbers.

## 1. Pin anchoring (Anatomy)

The designer caught mis-anchored pins once — a pin sat at the *centre* of a repeating group and
landed on an arbitrary row, reading as if it pointed at that one item.

Print each slot's real range and each pin's centre, then compare:

```js
const ib = inst.absoluteBoundingBox;
const geo = nm => { const n = inst.findOne(x => x.name === nm); if (!n) return null;
  const b = n.absoluteBoundingBox;
  return { top: b.y-ib.y, h: b.height, left: b.x-ib.x, right: (b.x-ib.x)+b.width }; };
// single-line slot  → pin at top + h/2
// repeating group   → pin at top + min(18, h/2)   ← heads the group
```

Then assert: every single-line pin centre lies inside its slot's `top..top+h`, and the group pin sits
within ~24px of the group's top edge.

## 2. Font and case audit (Arabic docs especially)

```js
const AR = /[؀-ۿ]/;
for (const t of doc.findAllWithCriteria({ types:['TEXT'] })) {
  const fam = t.fontName === figma.mixed ? 'mixed' : t.fontName.family;
  // every Arabic-bearing node must be Cairo (or mixed, for ✓/✗ overrides)
  // no node may have textCase === 'UPPER' — Arabic has no uppercase
}
```

Report: total texts · Arabic-bearing count · how many on Cairo · uppercase count · ✓/✗ glyph families.
The FAQ AR doc scored 164 texts / 115 Arabic / 115 Cairo / 0 uppercase — that is the bar.

## 3. Hyperlink audit (Composition manifest)

Setting a link is not proof. Read it back **and** resolve the target:

```js
t.setRangeHyperlink(0, t.characters.length, { type:'NODE', value: id });
t.getRangeHyperlink(0, t.characters.length);          // → { type:'NODE', value: id }
await figma.getNodeByIdAsync(id);                      // → must not be null
```

A dead link is worse than no link. Report the count and that all resolve, with the resolved names —
that also catches a wrong id that happens to exist.

## 4. Literal `**` markers

Any text set through a plain text helper renders `**bold**` as visible asterisks. This shipped once in
an Anatomy description. After building, scan for it:

```js
doc.findAllWithCriteria({ types:['TEXT'] }).filter(t => t.characters.includes('**'))
```
Must be empty.

## 5. Source integrity

The doc must never modify the component it documents.

```js
set.children.length            // variant count unchanged
Object.keys(set.componentPropertyDefinitions)   // axes unchanged
doc.findAllWithCriteria({ types:['INSTANCE'] }) // previews are INSTANCES, not detached copies
await inst.getMainComponentAsync()              // resolves back to the real set
```

## 6. Page hygiene

```js
page.children.filter(c => c.type !== 'SECTION')   // orphans — but a designer's loose note is not yours
// sort by absoluteBoundingBox.x and assert no [i].right > [i+1].left
```

## 7. Cross-reference integrity

After adding, removing or renumbering a section:
- frame name **and** the number TEXT inside it both updated
- `doc.findAllWithCriteria({types:['TEXT']}).filter(t => /section \d\d/i.test(t.characters))`
  — every hit still points at the right number
