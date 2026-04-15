# Slowdrag Site Operations

## Project Identity

- Project key: slowdrag-site
- Project type: static-site
- Source folder: C:\Users\tenet\OneDrive - Tenet Mediaverse\Tenet Mediaverse\SlowDrag Studios\Slowdrag website buillding
- Public URL: https://slowdragstudio.com/
- Repo URL: https://github.com/tmediaverse/slowdrag-site

## Default Commands

### Bootstrap / refresh config

```powershell
powershell -ExecutionPolicy Bypass -File .\vs_code\scripts\bootstrap-static-site-project.ps1 -ProjectName "Slowdrag Site" -ProjectKey "slowdrag-site"
```

### Scan source updates and create a reviewed snapshot

```powershell
powershell -ExecutionPolicy Bypass -File .\vs_code\scripts\sync-static-site-source.ps1 -ProjectKey slowdrag-site
```

### Deploy the Git-tracked site folder to Hostinger

```powershell
powershell -ExecutionPolicy Bypass -File .\vs_code\scripts\deploy-static-site-hostinger.ps1 -ProjectKey slowdrag-site
```

## Shared Protocols

- `vs_code/docs/tmc-default-project-todo.md`
- `vs_code/docs/static-site-deployment-protocol.md`
