# CyberMark restaurant staging

One Cloudflare Worker (`cybermark-restaurant-staging`) serves every Phoenix-metro
restaurant prospect site from static assets:

| URL | What it is |
| --- | --- |
| `/` | Staging index: every site, with preview, status, and copy-link for sending to the client |
| `/<slug>/` | One prospect's redesigned site |

Prospects come from the **High-Confidence List** tab of the
*CyberMark Phoenix Toast Restaurant Prospects* Google Sheet.

## Layout

```
public/
  index.html          staging index (reads sites.json)
  sites.json          generated at build time from each site.json (gitignored)
  _headers            noindex + security headers on everything
  <slug>/
    index.html        the site (relative URLs only)
    site.json         manifest shown on the index
    preview.jpg       1280×800 thumbnail for the index
    NOTES.md          research sources, verified facts, open questions
    assets/           this site's own images, fonts, JS (incl. self-hosted GSAP)
prompts/site-build.md the reusable per-site build prompt
scripts/              build-index.mjs, validate.mjs
.claude/skills/ui-ux-pro-max/   vendored UI UX Pro Max skill (uipro-cli 2.2.3)
```

## Build process (per site)

1. Fill `prompts/site-build.md` with the prospect's name, city, URL, phone, and slug.
2. Run it in a **fresh agent with its own git worktree**, on branch `site/<slug>`.
   No context or design choices carry over from any other build.
3. The agent researches the restaurant, builds `public/<slug>/`, tests it in
   Chromium at desktop, tablet, and mobile sizes, runs `npm run validate <slug>`, and pushes `site/<slug>`.
4. The site branch is merged into the staging branch, which Cloudflare deploys.

## Commands

```sh
npm install
npm run build       # regenerate public/sites.json
npm run validate    # check every site (or: npm run validate <slug>)
npm run dev         # local Worker at http://localhost:8787
npm run deploy      # wrangler deploy (build runs automatically first)
```

## Cloudflare setup (one time, in the CyberMark account)

1. Workers & Pages → Create → Import a repository → `pcavanaugh-dev/website-sales-staging`.
2. Production branch: the staging integration branch (currently
   `claude/phoenix-restaurant-sites-r2r09b`, or `main` once merged).
3. Build command: leave empty. Deploy command: `npx wrangler deploy`
   (`wrangler.jsonc` runs `scripts/build-index.mjs` first).
4. Leave non-production branch builds on: each `site/<slug>` branch then gets its
   own preview URL for checking before merge.
5. Optional: add a custom domain such as `staging.cybermark.com`, and put the
   index (`/`) behind Cloudflare Access if it shouldn't be public.
