# Slowdrag Vercel Audit

Date: 2026-04-15
Scope: legacy Vercel setup for the old Slowdrag website only
Prepared from: authenticated Vercel API inspection, live DNS checks, and live HTTP header checks

## A. Current Vercel State Summary

- Authenticated Vercel user: `tmediaverse` (`tenetmediaversepvtltd@gmail.com`)
- Active Vercel team scope: `the prosper dome's projects`
- Personal Vercel scope projects: `0`
- Team projects found: `slowdrag`, `wedding-invite`, `prosperdome`, `prosperdome-hqex`, `prosperdome-ftlv`

### Legacy Slowdrag Project

- Project name: `slowdrag`
- Project id: `prj_SzDwlCbUP9oVw1VTj8ReEJJYLHrX`
- Framework: `nextjs`
- Node version: `24.x`
- Created: `2025-12-26 08:50:48 UTC`
- Last updated: `2026-02-23 21:20:23 UTC`
- Linked Git repo: `narasimhareddyputta94/slowdrag`
- Linked production branch: `main`
- Deploy hooks: none
- Environment variables: `0`

### Current Domain Attachments In Vercel

- `slowdragstudio.com`
  - verified: yes
  - configured as redirect to `www.slowdragstudio.com`
- `www.slowdragstudio.com`
  - verified: yes
  - active custom domain
- `slowdrag-five.vercel.app`
  - verified: yes
  - legacy Vercel domain

### Current Deployment State

- Latest production deployment created: `2026-02-23 21:19:52 UTC`
- Latest production deployment URL: `slowdrag-k69pecuh5-the-prosper-domes-projects.vercel.app`
- Latest production deployment status: `READY / PROMOTED`
- Latest production deployment source repo: `narasimhareddyputta94/slowdrag`
- Latest preview deployment still exists:
  - alias: `slowdrag-git-perf-cls-fix-the-prosper-domes-projects.vercel.app`
  - branch: `perf/cls-fix`

### Live Routing Behavior Confirmed

- `https://slowdragstudio.com` returns `307 Temporary Redirect`
  - destination: `https://www.slowdragstudio.com/`
  - server: `Vercel`
- `https://www.slowdragstudio.com` returns `200 OK`
  - server: `Vercel`
  - content is being served from the old Vercel deployment

## B. What Matters Vs What Does Not

### Still Active / Material

- The legacy Vercel `slowdrag` project is still active enough to serve production traffic.
- `www.slowdragstudio.com` is still attached to the legacy Vercel project and currently serves the old site.
- `slowdragstudio.com` redirects to `www.slowdragstudio.com` through Vercel.
- The old project is linked to the old GitHub repository `narasimhareddyputta94/slowdrag`, not the new `tmediaverse/slowdrag-site` repo.

### Legacy / Irrelevant To Preserve

- Old production deployment history in Vercel
- The preview deployment and preview alias
- The old Git-linked deployment chain from `narasimhareddyputta94/slowdrag`
- The `slowdrag-five.vercel.app` domain unless you specifically want to keep a Vercel fallback hostname

### Low-Value But Worth Recording Once

- The old project used `Next.js`
- The legacy project had no environment variables and no deploy hooks
- The apex-to-www redirect behavior exists and may need to be replicated elsewhere after migration

## C. DNS / Domain Implications

### What The Live DNS Shows

- `slowdragstudio.com` currently resolves to `76.76.21.21`
  - this is Vercel's apex A record
- `www.slowdragstudio.com` currently resolves as a `CNAME` to `cname.vercel-dns.com`
- Authoritative nameservers:
  - `ns1.dns-parking.com`
  - `ns2.dns-parking.com`

### Meaning

- DNS is not delegated to Vercel.
- Vercel is still the live traffic target because the external DNS records point to Vercel.
- This is good news for migration because DNS can be changed without first deleting anything inside Vercel.

### Migration Risk

- If the legacy Vercel project or its custom domain attachments are deleted before DNS is moved away from Vercel, `slowdragstudio.com` and `www.slowdragstudio.com` can break.
- The current old site remains live until the external DNS records are changed.

## D. Safe Cleanup Plan

1. Document the current state.
   - Keep this audit note.
   - Save the old project id, linked repo, attached domains, and current DNS records.

2. Deploy the new static Slowdrag site on Hostinger first.
   - Verify the site loads correctly on the Hostinger temporary or final target.

3. Change DNS at the authoritative DNS provider.
   - Update the apex and `www` records to Hostinger's required values.
   - Recreate the apex-to-www redirect behavior if desired.

4. Wait for DNS cutover verification.
   - Confirm both `slowdragstudio.com` and `www.slowdragstudio.com` no longer return `Server: Vercel`.
   - Confirm traffic reaches Hostinger consistently.

5. Only after cutover, clean up Vercel.
   - Remove `slowdragstudio.com` and `www.slowdragstudio.com` from the old Vercel project.
   - Optionally remove `slowdrag-five.vercel.app`.
   - Optionally delete the old `slowdrag` project.

6. Retain only what has future value.
   - If you may later return to Vercel, keep a short note that the old setup used a `www` canonical domain pattern.
   - Otherwise prefer full cleanup.

## E. Whether Full Deletion Is Safe

### Right Now

- No. Full deletion is not safe yet.
- Reason: live DNS still points to Vercel, and the old Vercel project is still serving the public site.

### After Hostinger Cutover

- Yes, full deletion should be safe after:
  - DNS is updated away from Vercel
  - live checks confirm the public domain is no longer served by Vercel
  - you no longer need the legacy `vercel.app` URLs

## F. Whether Anything Impacts Hostinger Deployment

- Yes, the current DNS records matter.
- Hostinger deployment itself is not blocked by Vercel.
- Public traffic will continue reaching Vercel until DNS records are changed at the current authoritative DNS provider.
- The old Vercel project being linked to the old GitHub repo has no impact on Hostinger once DNS is moved away.
- The lack of Vercel environment variables means there is no hidden runtime secret dependency to carry over.

## Recommended Conservative Decision

- Do not delete anything in Vercel yet.
- Do not preserve the old deployment chain for restoration purposes.
- Preserve only this audit, the domain-routing knowledge, and the fact that the old project is tied to `narasimhareddyputta94/slowdrag`.
- Perform deletion only after explicit confirmation and successful Hostinger cutover.
