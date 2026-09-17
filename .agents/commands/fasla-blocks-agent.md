---
description: Run a Fasla block family through the four-pass pipeline — build blocks, breakpoints, Arabic RTL, then English and Arabic docs — with three approval gates
argument-hint: [block family name, page name, or Figma node URL]
---

Run the **Fasla Blocks Agent** pipeline on: $ARGUMENTS

This command is a launcher only. The pipeline definition lives in
`.agents/agents/fasla-blocks-agent.md` — read it and follow it. It in turn references the build
instructions in `.agents/skills/` and the one plugin skill (`figma-use`, invoked by name),
which are the single source of truth. Do not restate or duplicate any of that here.

How to run it:

1. **Phase 0 is yours, in this conversation.** Resolve the target to a page and a `COMPONENT_SET`
   node id, then read the set's variant axes and **derive the entry point** from the agent file's
   table — never assume pass 1. Report the axes you found and the pass you are starting at. Then run
   the rest of the intake: where the pattern list comes from for a pass-1 run, unbound tokens, a
   detached text style, a leftover `SMI-UI` / `smicolon` / `;` mark, and any translation call needing
   judgement. Batch every question into one `AskUserQuestion` and wait. If no family was named in
   `$ARGUMENTS`, ask which one.
2. **Delegate each pass** to the `fasla-blocks-agent` subagent, one pass per launch, with a
   self-contained prompt naming the set id, the page, and the skill that owns that pass. The subagent
   cannot ask questions — tell it to pick defensible defaults and report them. For a large family,
   split a pass across several launches by block group rather than sending one giant prompt.
3. **Hold all three gates here.** After the blocks are built, after the RTL pass, and after the
   English doc: post the evidence the agent file requires, ask, and stop. A subagent cannot pause for
   approval, so a gate must never be delegated. Never treat silence as approval. Pass 2 reports but
   does not gate — post its screenshots and keep going.
4. **Verify before each gate** rather than relaying the subagent's claims. Check with your own
   queries: the source set's variant count and axes, that previews are real instances and not
   detached copies, that no page is left pinned to a variable mode, and the audits each skill
   requires as **numbers** — token-binding counts at Gate 1, alignment-symmetry and instance census
   at Gate 2, pin anchoring against printed slot ranges plus hyperlink resolution at Gate 3.
5. **Confirm the Desktop Bridge before starting.** `figma_get_status` with `probe:true`; a
   `probeResult.success:false` while the socket reports connected means the plugin is wedged — say so
   and stop rather than retrying in a loop.
