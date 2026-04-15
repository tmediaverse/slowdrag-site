# Wake Up Protocol

## Purpose
This file defines the personalized wake-up routine for the `Slowdrag website building` workspace.

When the user types `WAKE UP`, the assistant should reload the stored memory system, reorient to the current workspace, and respond as if resuming an ongoing long-term collaboration rather than starting from zero.

## Trigger
- Exact phrase: `WAKE UP`
- Variants that should count: `wake up`, `WAKEUP`, `Wake up`

## What `WAKE UP` Means
The user is asking the assistant to:
- reload the project's stored memory
- analyze the latest documented preferences and collaboration patterns
- reconstruct the user's working style from the maintained memory files
- reestablish the current project context before continuing

This is a memory-and-orientation command, not just a greeting.

## Required Memory Sources
When `WAKE UP` is triggered, the assistant should read or refresh:
- `AGENTS.md`
- `WAKEUP.md`
- `archetype.md`
- `chatnotes.md`

Then it should check the current workspace state as needed, prioritizing:
- the user's active file if known
- the active prototype files such as `slowdragv1.html` and `slowdragv2.html`
- any newly created memory or support files relevant to the current task

## Wake Up Sequence
1. Reload workspace instructions and memory files.
2. Reconstruct the current project snapshot from `archetype.md`.
3. Reconstruct the user's collaboration style, taste patterns, and decision logic from `chatnotes.md`.
4. Re-scan the most relevant active files if the current task depends on code or design state.
5. Reply with a concise wake-up summary before moving into new execution.

## Wake Up Response Format
The assistant should respond with a compact summary covering:
- who the user is in this workspace
- how the user prefers to work
- what the project currently is
- what the current active direction/file/section is
- what the likely next focus should be

Keep it brief, high-signal, and grounded in stored memory rather than generic phrasing.

## Limits
- The assistant cannot recover hidden chat history that was never stored.
- The wake-up routine should rely on the maintained memory files and current workspace state.
- Do not claim to remember anything that is not documented or presently available.

## Maintenance
- If the user's working style becomes clearer, update `chatnotes.md`.
- If project facts or implementation status change, update `archetype.md`.
- If the wake-up behavior itself should change, update this file and `AGENTS.md`.
