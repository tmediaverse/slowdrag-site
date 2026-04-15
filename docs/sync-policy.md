# Slowdrag Sync Policy

## Principle

The live creative folder and the GitHub repo are not mirrored automatically.

## Source Of Truth

- Creative source: `SlowDrag Studios\\Slowdrag website buillding`
- Engineering source of truth: this Git repo inside `vs_code\\projects\\slowdrag-site`

## Rules

- Pull updates from the creative folder into a dated local snapshot.
- Do not auto-overwrite the Git-tracked `site/` folder.
- Compare new snapshots to the previous snapshot before merging.
- Promote only the approved website-facing changes into `site/`.
- Keep heavy raw media in local snapshots unless a file is explicitly needed for the deployed site.

## Why

- Protects Sujith's live working folder.
- Prevents accidental deployment regressions.
- Keeps the GitHub repo small, fast, and deployment-friendly.
