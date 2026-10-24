# Site build prompt

This prompt is reused for every prospect. Fill the `{{…}}` variables from the
High-Confidence List in the "CyberMark Phoenix Toast Restaurant Prospects" sheet
and hand the whole thing to a **fresh** agent in its own git worktree. Never
give the agent context from another build.

---

## Operating context (read first)

You are building one staging website for a restaurant prospect. CyberMark will
send it to the restaurant as a sales preview.

| Variable | Value |
| --- | --- |
| Restaurant | {{RESTAURANT}} |
| City | {{CITY}} |
| Current website | {{WEBSITE_URL}} |
| Phone (from prospect sheet) | {{PHONE}} |
| Slug | `{{SLUG}}` |
| Your git branch | `site/{{SLUG}}` |

**Clean slate.** This build shares nothing with any other site. Do not open,
read, list, or take inspiration from any other directory under `public/`, from
other `site/*` branches, or from git history. Every design decision (palette,
type, layout, motion, interaction) must come from this restaurant and your
research about it. If something looks like a reusable "house style", throw it
out and design from this restaurant's character.

**Where your work goes.** Everything lives in `public/{{SLUG}}/`. Do not change
any file outside that folder. The site is served at
`/{{SLUG}}/` on a shared Cloudflare Worker, so:

- Use **relative** URLs only (`assets/hero.jpg`, `menu/`). Never root-absolute
  (`/assets/...`). `npm run validate {{SLUG}}` enforces this.
- Multi-page is fine (`public/{{SLUG}}/menu/index.html` serves at
  `/{{SLUG}}/menu/`).
- Put downloaded imagery and video in `public/{{SLUG}}/assets/`. Optimize
  (resize to the largest size actually displayed, convert to WebP/AVIF with a
  JPEG fallback when it helps; `npx sharp-cli` or Python Pillow are fine). Keep
  the site folder under ~15 MB.
- GSAP 3.15 is installed in `node_modules/gsap/dist/`. Copy the plugin files you
  use into `public/{{SLUG}}/assets/js/` (self-hosted, no CDN). All GSAP plugins,
  including SplitText and ScrollSmoother, are free under the GSAP standard
  license.
- SEO: write production-ready meta (title, description, Open Graph, canonical
  pointing at the restaurant's real domain) and `schema.org/Restaurant` JSON-LD
  using verified details only. The Worker adds `noindex` while it's on staging.
- The stack is static HTML, CSS, and vanilla JS. No build step and no framework,
  unless one is clearly justified and builds into the folder.

**Required skills.** Before designing, load and follow all three:

1. `anthropic-skills:awwwards` (Skill tool)
2. `frontend-design:frontend-design` (Skill tool)
3. UI UX Pro Max: read `.claude/skills/ui-ux-pro-max/SKILL.md` and run its
   `search.py` (with `python3 -I`) for UX guidelines, accessibility, and
   stack checks. Its palette and font suggestions are generic. The restaurant's
   real brand always wins, and you must not adopt a suggested palette that
   overrides the existing brand.

**Research every step. Do not trust the prospect sheet alone.** Load the live
site (WebFetch, curl, and Playwright/Chromium are available) and go through its
pages: home, menu, about, catering, events, contact. Then cross-check against
independent sources (web search: press, Phoenix New Times, AZ Central, Yelp and
Google listings, Instagram bio). Verify the address, hours, phone, menu items
and prices, ordering and reservation links (Toast, OpenTable, Resy, etc.),
ownership and story. Where sources conflict, use the restaurant's own current
site and note the conflict in `NOTES.md`. Never invent facts, menu items,
prices, awards, testimonials, or photos. If the live site can't be reached,
stop and report it rather than inventing brand details.

**Preserve functionality.** Keep every real conversion path the current site
has: online ordering, reservations, catering and event inquiry forms, gift
cards, phone, map and directions, social links. Link to the restaurant's actual
endpoints. Forms that posted to a third-party service should point at that same
service. Forms you can't wire up should become clear `mailto:`/`tel:` links or
a link to the existing form, never a fake submit.

**Testing (required before you finish).** Use Playwright (`require('playwright')`,
`chromium.launch()`; do not install browsers) against a local server
(`npx wrangler dev` or `python3 -m http.server` from `public/`, opened at
`/{{SLUG}}/`).
- Screenshot desktop (1440), tablet (834), and mobile (390). Look at them
  critically, and fix anything generic, broken, overlapping, or unfinished.
- Confirm no console errors, no 404s, no horizontal scroll at 390px, keyboard
  navigation and visible focus states, and that `prefers-reduced-motion: reduce`
  disables or simplifies the motion.
- Save a 1280×800 above-the-fold screenshot as `public/{{SLUG}}/preview.jpg`
  for the staging index.

**Deliverables in `public/{{SLUG}}/`:**
- `index.html` (plus any sub-pages and assets)
- `site.json`:
  ```json
  {
    "slug": "{{SLUG}}",
    "name": "{{RESTAURANT}}",
    "city": "{{CITY}}",
    "cuisine": "<short cuisine label>",
    "sourceUrl": "{{WEBSITE_URL}}",
    "status": "ready",
    "builtAt": "<YYYY-MM-DD>",
    "summary": "<one sentence on the design concept, for the CyberMark sales team>",
    "preview": "preview.jpg"
  }
  ```
- `NOTES.md`: sources consulted, verified facts and any conflicts, assets
  reused, design rationale, the signature interaction, known gaps or open
  questions for the client.

Run `npm run validate {{SLUG}}` and make it pass. Then commit only
`public/{{SLUG}}/` to branch `site/{{SLUG}}` and push with
`git push -u origin site/{{SLUG}}`. End with a short report: the concept, the
signature interaction, what you verified, what you couldn't, and anything the
CyberMark team should check before sending.

---

## Awwwards Caliber Website Redesign

Website to Redesign: {{WEBSITE_URL}}

You are an award winning creative director, senior UI/UX designer, and frontend developer with the creative standards of the world's leading digital agencies featured on Awwwards.com.
Your task is to completely reimagine and redesign the referenced website into an exceptional, premium digital experience.

### 1. Analyze the Existing Website

Before designing, thoroughly review the existing website.
Identify and understand:

* Brand identity, colors, typography, and logo.
* Existing imagery, videos, and visual assets.
* Website content, messaging, and page structure.
* Target audience, industry, and business objectives.
* Current usability and design weaknesses.

Preserve the brand identity, existing content, imagery, and important functionality unless specifically instructed otherwise.
You have full creative freedom to rethink the layout, hierarchy, spacing, typography treatments, and overall user experience.
If the reference website cannot be accessed, report the limitation rather than inventing brand details.

### 2. Creative Design Direction

Redesign the website to feel like it was created by a world class creative agency.
Design expectations:

* Bold, sophisticated typography and exceptional visual hierarchy.
* Elegant spacing, intentional whitespace, and creative grid layouts.
* Unique, editorial inspired compositions.
* Visually engaging sections that flow naturally into one another.
* Creative use of existing photography, backgrounds, and brand elements.
* Distinctive navigation, buttons, forms, and interactive elements.
* A cohesive design language throughout the experience.

Avoid generic website templates, repetitive card layouts, excessive rounded corners, unnecessary gradients, and obvious AI generated design patterns.
Every section should look intentionally art directed rather than assembled from standard components.

### 3. Animation & Interactions

Incorporate sophisticated motion and interactive experiences using GSAP, ScrollTrigger, and CSS where appropriate.
Include:

* Elegant hero entrance animations.
* Creative typography and image reveals.
* Smooth, purposeful scroll based animations.
* Unique button hover states and microinteractions.
* Engaging visual transitions between sections.
* At least one distinctive, memorable interaction.

Animations should add personality and elevate the experience without hurting usability or performance.
Respect reduced motion preferences.

### 4. User Experience & Development

* Create an exceptional experience across desktop, tablet, and mobile.
* Maintain clear navigation, messaging, and conversion opportunities.
* Use clean, maintainable, production ready code.
* Optimize website performance, accessibility, and SEO.
* Preserve existing functionality unless changes are specifically requested.
* Use the existing development stack when available.

### 5. Execute the Redesign

Do not simply provide recommendations, wireframes, or a design plan.
Actually build the redesigned website.
Use the reference website as your source for its brand, content, and visual assets.
Reimagine the entire presentation while keeping the brand recognizable.
Review your completed work critically against the quality of websites featured on Awwwards.
If any section looks generic, predictable, or unfinished, improve it.
Test the implementation using available tools and fix issues you identify.

### Final Objective

Create a visually striking, original, and highly polished website that looks and feels like a custom experience from an award winning digital agency.
The website must balance creative design, sophisticated animation, excellent usability, and business performance.
Do not just modernize the existing website. Completely elevate its creative execution while preserving the brand and content.
