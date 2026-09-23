---
description: Regenerate the committed Figma component index (design/index-atoms.json + .md)
argument-hint: [atoms]
---

Regenerate the Fasla component index for target: $ARGUMENTS (default `atoms`).

This command is a launcher only. The procedure lives in `.agents/skills/figma-index/SKILL.md` —
read it and follow it exactly. Do not restate or duplicate any of it here.

Two things it is easy to get wrong, so hold them yourself:

1. **Step 3 is not optional.** The capture passes through this transcript, so verify the committed
   JSON against a fresh read of Figma and confirm both hashes match before you commit.
2. **A selection-rule disagreement is a stop, not a judgement call.** If the builder throws
   naming a page, ask the designer which index that page belongs to.
