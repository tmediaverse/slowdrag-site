# Slowdrag Site

This repository is the GitHub-first working home for the Slowdrag website inside the TMC `vs_code` workspace.

## Purpose

- Keep website engineering independent from the live creative folder.
- Use GitHub as the source of truth for code and deployment.
- Preserve a controlled one-way sync from the creative source into the technical workspace.

## Current Baseline

- `site/index.html` is sourced from the approved `slowdragv1.html` prototype.
- `site/` contains the exact asset subset required by the current `v1` website baseline.
- `docs/reference/` stores the key source notes and the alternate prototype files for reference.
- `source_snapshot/` contains dated local snapshots of the live creative source and is intentionally ignored by Git.

## Structure

- `site/`: Git-tracked working site for deployment.
- `docs/`: Architecture notes, sync rules, and source references.
- `source_snapshot/`: Local-only dated imports from `SlowDrag Studios\\Slowdrag website buillding`.

## Workflow

1. Import a dated snapshot from the live creative folder into `source_snapshot/`.
2. Review differences against the previous snapshot.
3. Selectively merge approved changes into `site/`.
4. Commit and push `site/` and `docs/` to GitHub.
5. Deploy from GitHub.
