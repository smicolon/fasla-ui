---
description: Run a finished Fasla atom component through RTL variants, English docs and Arabic docs, with approval gates
argument-hint: [component name or Figma node URL]
---

Run the **Fasla Atoms Agent** pipeline on: $ARGUMENTS

This command is a launcher only. The pipeline definition lives in
`.agents/agents/fasla-atoms-agent.md` — read it and follow it. It in turn references the build
instructions in `.agents/skills/`, which are the single source of truth. Do not restate or
duplicate any of that here.

How to run it:

1. **Phase 0 is yours, in this conversation.** Resolve the target to a `COMPONENT_SET` node id and
   run the agent file's intake checks — readiness, an existing `Direction` axis, an existing doc
   frame, unbound tokens, legacy names. Batch every question into one `AskUserQuestion` and wait.
   If no component was named in `$ARGUMENTS`, ask which one.
2. **Delegate each phase** to the `fasla-atoms-agent` subagent, one phase per launch, with a
   self-contained prompt. The subagent cannot ask questions — tell it to pick defensible defaults
   and report them.
3. **Hold both gates here.** After the RTL pass, and again after the English doc: post the evidence
   the agent file requires, ask, and stop. A subagent cannot pause for approval, so a gate must
   never be delegated. Never treat silence as approval.
4. **Verify before each gate** rather than relaying the subagent's claims — check the source set is
   untouched, previews are real instances, and no page is left pinned to a variable mode.
