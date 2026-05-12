# Visual QA Notes

Generated on 2026-05-11 for the standalone static downloads mini project.

## Screenshots

- `local-windows-desktop.png` - static mini project at `http://127.0.0.1:4177/downloads/windows/`, viewport `1542x595`.
- `local-windows-mobile.png` - static mini project at `http://127.0.0.1:4177/downloads/windows/`, viewport `390x844`.
- `prod-windows-desktop.png` - production `https://www.vpnunlimited.com/downloads/windows`, viewport `1542x595`.
- `prod-windows-mobile.png` - production `https://www.vpnunlimited.com/downloads/windows`, viewport `390x844`.
- `feedback-windows-desktop.png` - static mini project after feedback fixes for content, image sizing, and language switching, viewport `1542x900`.
- `feedback-windows-mobile.png` - static mini project after feedback fixes for content, image sizing, and language switching, viewport `390x900`.
- `cleanup-windows-desktop.png` - static mini project after moving language out of the platform navigation row, viewport `1589x760`.
- `polished-windows-desktop.png` - static mini project after styling language as a compact dropdown control, viewport `1589x760`.
- `prodlike-windows-long.png` - static mini project after adding production-like Windows content blocks, viewport `1589x2600`.
- `style-port-windows-desktop.png` - static mini project after porting additional Nuxt downloads component styles, viewport `1589x2600`.
- `style-port-windows-mobile.png` - static mini project after porting additional Nuxt downloads component styles, viewport `390x1600`.
- `spot-macos-desktop.png` - desktop platform representative page, viewport `1365x1400`.
- `spot-chrome-desktop.png` - browser extension representative page, viewport `1365x1400`.
- `spot-apple-tv-desktop.png` - streaming/TV representative page, viewport `1365x1400`.
- `spot-android-mobile.png` - mobile platform representative page, viewport `390x1400`.
- `spot-ua-windows-desktop.png` - localized Ukrainian Windows page, viewport `1365x1400`.
- `spot-ar-windows-mobile.png` - RTL Arabic Windows page, viewport `390x1400`.

## Result

- The static mini project intentionally omits the global site header, matching the requested no-header scope.
- The downloads navigation is the first visible block.
- A compact language selector is rendered below the downloads navigation so all 15 locale trees can be reached from the page UI without adding it as a seventh platform-nav item.
- All 15 locale trees remain generated and connected with `hreflang` links.
- Desktop Windows hero alignment was adjusted after comparing against the production downloads area without the global header.
- Windows page content was expanded beyond the hero to include manuals, why-use sections, setup steps, feature cards, other-platform cards, trial copy, and FAQ.
- Windows copy now follows the current production Windows downloads page text instead of paraphrased placeholder copy.
- Additional standalone styles were ported from `DownloadsPlatformsNav.vue`, `DownloadsHowToBlock.vue`, `DownloadsBigBlock.vue`, and `MainBenefitsBlock.vue` for the nav, store badge, hero sizing, manuals, setup steps, and feature cards.
- Mobile QA caught and fixed the `Why use Windows VPN` heading overflow at `390px` viewport.
- Representative non-Windows spot QA passed for desktop, mobile, browser-extension, streaming/TV, localized Ukrainian, and RTL Arabic pages.
- RTL pages keep `dir="rtl"` at the document level, while the page content area renders left-to-right where page-specific copy still falls back to English. This prevents mixed-direction clipping until full localized page copy is added.
- Full local HTTP smoke under `/repo-name/` checked all 196 generated `index.html` URLs and returned 0 failures.
- The validator now checks the expected generated matrix, including locale/page file presence, `lang`, `dir`, `data-locale`, `data-slug`, and `hreflang` alternate count.

## Remaining Manual Checks

- Full production pixel comparison remains deepest for Windows as the baseline page.
- Other page families now have representative local screenshot QA and shared link/asset validation, but each individual platform has not been pixel-compared against production one by one.
