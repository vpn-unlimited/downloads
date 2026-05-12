# VPN Unlimited Downloads Static Mini Project

Standalone static downloads pages for GitHub Pages.

This folder is intentionally independent from the Nuxt runtime. It must work without CoMS, Nitro, Redis, internal API routes, or `.env` files.

## Generate Pages

From `apps/vpnunlimited/nuxt4/downloads-github`:

```bash
node scripts/generate.cjs
node scripts/validate.cjs
node scripts/serve.cjs
```

The generator reads `assets/data/downloads-data.js` and writes static HTML files for English plus the 14 prefixed active locales.
Generated HTML is pre-rendered. JavaScript is used only for dropdown behavior and as a fallback renderer if a page is opened without generated markup.

The local server is optional and is only for manual browser checks.

To simulate GitHub Pages under a repository subpath:

```bash
BASE_PATH=/repo-name node scripts/serve.cjs
```

Then open:

```text
http://127.0.0.1:4177/repo-name/windows/
```

`scripts/validate.cjs` verifies local links/assets and the full generated page matrix. It checks that every expected locale/page HTML file exists, that generated pages have the expected `lang`, `dir`, `data-locale`, `data-slug`, and that each page has all locale `hreflang` alternates.

## GitHub Pages

This folder can be pushed as the root of a standalone GitHub repository.
The included `.github/workflows/pages.yml` regenerates the static pages, runs validation, and publishes the runtime files through GitHub Pages.

Standalone push flow:

```bash
cd apps/vpnunlimited/nuxt4/downloads-github
git init
git remote add origin <github-repo-url>
git add .
git commit -m "Add static downloads site"
git push -u origin main
```

In GitHub, open `Settings -> Pages` and set `Build and deployment -> Source` to `GitHub Actions`.
The workflow runs on `main` and `master`, so push to one of those branches or update `.github/workflows/pages.yml`.

The Pages artifact contains only the generated site files: `index.html`, `.nojekyll`, `assets/`, platform directories, and locale-prefixed directories.

## Scope

- No global header.
- Downloads navigation panel is the first visible block.
- English paths are unprefixed.
- Non-English paths use a locale prefix, for example `ua/windows/`.
- All 15 locale trees are generated and linked with `hreflang` alternates in each page head.
- The page includes a compact language selector below the downloads navigation; it changes to the equivalent localized static page without adding the global site header.
- External manual/help links point to `www.vpnunlimited.com`.
- Existing Nuxt files must not be modified for this mini project.

## Updating Download Links

Update `assets/data/downloads-data.js`, then regenerate and validate.

Direct installer URLs are static snapshots. If the production site changes a URL in CoMS, this mini project must be updated manually or regenerated from a confirmed source.

Confirmed and pending URL sources are tracked in `download-link-audit.md`.

## Localization

The generator reads existing locale dictionaries from `../lang/*.json` for shared navigation labels where those translations exist.
Downloads-specific labels, other-platform blocks, and page overlays are defined in `assets/data/translations.js`.
English remains the base content in `assets/data/downloads-data.js`; the 14 non-English locales receive static overlays during generation.

Active locales: `en`, `ru`, `es`, `fr`, `de`, `ua`, `pt`, `fa`, `ar`, `jp`, `zh`, `sv`, `fi`, `no`, `ko`.

## Visual QA

Windows desktop/mobile screenshots and production comparison screenshots are stored in `qa/`.

The Windows page is the baseline for visual parity. Additional representative screenshots cover macOS, Android mobile, Chrome, Apple TV, Ukrainian Windows, and Arabic RTL Windows. Other platform pages share the same static template and should be spot-checked when page-specific assets or copy change.

The current standalone stylesheet ports the required downloads-specific visual rules from the Nuxt downloads components instead of importing the full Nuxt style stack. The ported baseline covers the platform navigation, compact language selector, hero/store badge, manuals rows, Windows why-use content block, setup steps, and feature cards.

Latest structural validation checked all 211 generated `index.html` files with 0 failures.
