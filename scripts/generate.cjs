const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const rootDir = path.resolve(__dirname, "..");
const dataPath = path.join(rootDir, "assets", "data", "downloads-data.js");
const translationsPath = path.join(rootDir, "assets", "data", "translations.js");
const dataCode = fs.readFileSync(dataPath, "utf8");
const sandbox = { globalThis: {} };
vm.createContext(sandbox);
vm.runInContext(dataCode, sandbox, { filename: dataPath });
if (fs.existsSync(translationsPath)) {
  vm.runInContext(fs.readFileSync(translationsPath, "utf8"), sandbox, { filename: translationsPath });
}

const data = sandbox.globalThis.DOWNLOADS_DATA;
const translations = sandbox.globalThis.DOWNLOADS_TRANSLATIONS || { labels: {}, otherPlatforms: {}, pages: {} };
const langDir = path.resolve(rootDir, "..", "lang");
const localeMessages = new Map();

if (!data) {
  throw new Error("DOWNLOADS_DATA was not loaded.");
}

function mergeOverlay(base, overlay) {
  if (overlay === undefined || overlay === null) return base;
  if (Array.isArray(base) && Array.isArray(overlay)) {
    return base.map((item, idx) => overlay[idx] !== undefined ? mergeOverlay(item, overlay[idx]) : item);
  }
  if (base && typeof base === "object" && !Array.isArray(base) && overlay && typeof overlay === "object" && !Array.isArray(overlay)) {
    const out = { ...base };
    for (const key of Object.keys(overlay)) {
      out[key] = mergeOverlay(base[key], overlay[key]);
    }
    return out;
  }
  return overlay;
}

function getLocalizedPage(slug, localeCode) {
  const base = data.pages[slug];
  if (!base) return null;
  if (localeCode === data.defaultLocale) return base;
  const overlay = translations.pages?.[slug]?.[localeCode];
  return overlay ? mergeOverlay(base, overlay) : base;
}

function getLocalizedOtherPlatforms(localeCode) {
  const base = data.otherPlatforms;
  if (!base || localeCode === data.defaultLocale) return base;
  const overlay = translations.otherPlatforms?.[localeCode];
  return overlay ? mergeOverlay(base, overlay) : base;
}

const pageSlugs = ["", ...Object.keys(data.pages)];

for (const locale of data.locales) {
  for (const slug of pageSlugs) {
    const outputDir = path.join(rootDir, ...pathSegments(locale.code, slug));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), renderHtml(locale, slug), "utf8");
  }
}

fs.writeFileSync(
  path.join(rootDir, "index.html"),
  '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=downloads/"><link rel="canonical" href="downloads/">',
  "utf8",
);

function pathSegments(localeCode, slug) {
  const prefix = localeCode === data.defaultLocale ? [] : [localeCode];
  return [...prefix, "downloads", ...(slug ? [slug] : [])];
}

function depthFor(localeCode, slug) {
  return pathSegments(localeCode, slug).length;
}

function relativeRoot(localeCode, slug) {
  return "../".repeat(depthFor(localeCode, slug));
}

function renderHtml(locale, slug) {
  const page = slug ? getLocalizedPage(slug, locale.code) : null;
  const labels = localizedLabels(locale.code);
  const title = page?.seoTitle || labels.downloadsTitle;
  const description = page?.description || labels.downloadsLead;
  const root = relativeRoot(locale.code, slug);
  const body = renderBody(locale, slug, labels, root);
  const alternates = renderLocaleAlternates(slug, root);

  return `<!doctype html>
<html lang="${escapeAttr(locale.code)}" dir="${escapeAttr(locale.dir || "ltr")}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <link rel="stylesheet" href="${root}assets/css/downloads.css">
${alternates}
    <script src="${root}assets/data/downloads-data.js" defer></script>
    <script src="${root}assets/data/translations.js" defer></script>
    <script src="${root}assets/js/downloads.js" defer></script>
  </head>
  <body>
    <div data-downloads-app data-rendered="true" data-locale="${escapeAttr(locale.code)}" data-slug="${escapeAttr(slug)}">${body}</div>
    <noscript>
      <main class="downloads-page">
        <div class="downloads-container">
          <h1>${escapeHtml(page?.title || labels.downloadsTitle)}</h1>
          <p>${escapeHtml(description)}</p>
        </div>
      </main>
    </noscript>
  </body>
</html>
`;
}

function renderBody(locale, slug, labels, root) {
  const page = slug ? getLocalizedPage(slug, locale.code) : null;

  return [
    renderNavigation(locale, slug, root),
    renderLanguageMenu(locale, slug, labels, root),
    page ? renderDetailPage(locale, slug, labels, page, root) : renderIndexPage(locale, labels, root),
  ].join("");
}

function renderLocaleAlternates(slug, root) {
  return data.locales.map((item) => {
    const hrefLang = item.code === "ua" ? "uk" : item.code;
    return `    <link rel="alternate" hreflang="${escapeAttr(hrefLang)}" href="${escapeAttr(localPath(item.code, slug, root))}">`;
  }).join("\n");
}

function renderNavigation(locale, slug, root) {
  const groups = localizedNavigation(locale.code).map((group) => {
    const isActiveGroup = group.items.some((item) => item.slug === slug);
    const items = group.items.map((item) => {
      const href = item.externalPath ? externalPath(locale.code, item.externalPath) : localPath(locale.code, item.slug, root);
      const active = item.slug === slug ? " is-active" : "";
      const attrs = item.externalPath ? ' target="_blank" rel="noopener noreferrer"' : "";
      const icon = item.icon ? `<span class="downloads-nav__icon downloads-nav__icon--${escapeAttr(item.icon)}"></span>` : "";
      return `<a class="downloads-nav__item${active}" href="${escapeAttr(href)}"${attrs}>${icon}<span>${escapeHtml(item.label)}</span></a>`;
    }).join("");

    return `
      <div class="downloads-nav__group${isActiveGroup ? " is-active" : ""}">
        <button class="downloads-nav__button" type="button" aria-expanded="false">
          <span>${escapeHtml(group.title)}</span>
          <span class="downloads-nav__chevron" aria-hidden="true"></span>
        </button>
        <div class="downloads-nav__menu">${items}</div>
      </div>
    `;
  }).join("");

  return `<section class="downloads-nav"><div class="downloads-container"><nav class="downloads-nav__inner" aria-label="Choose platform">${groups}</nav></div></section>`;
}

function renderLanguageMenu(locale, slug, labels, root) {
  const links = data.locales.map((item) => {
    const active = item.code === locale.code ? " is-active" : "";
    return `<a class="downloads-language__link${active}" href="${escapeAttr(localPath(item.code, slug, root))}">${escapeHtml(item.label)}</a>`;
  }).join("");

  return `<section class="downloads-language-bar"><div class="downloads-container"><details class="downloads-language"><summary class="downloads-language__summary"><span>${escapeHtml(labels.language || "Language")}:</span><strong>${escapeHtml(locale.label)}</strong></summary><div class="downloads-language__menu">${links}</div></details></div></section>`;
}

function renderIndexPage(locale, labels, root) {
  const cards = Object.keys(data.pages).map((slug) => {
    const page = getLocalizedPage(slug, locale.code);
    return `
    <article class="downloads-card">
      <img class="downloads-card__icon" src="${escapeAttr(assetPath(page.icon, root))}" alt="">
      <h2 class="downloads-card__title">${escapeHtml(page.title)}</h2>
      <p class="downloads-card__text">${escapeHtml(page.description)}</p>
      <a class="downloads-card__link" href="${escapeAttr(localPath(locale.code, slug, root))}">${escapeHtml(labels.viewPlatform)}</a>
    </article>
  `;
  }).join("");

  return `
    <main class="downloads-page">
      <div class="downloads-container">
        <nav class="downloads-breadcrumbs" aria-label="Breadcrumbs">
          <a href="${escapeAttr(localPath(locale.code, "", root))}">${escapeHtml(labels.service)}</a>
          <span>›</span>
          <span>${escapeHtml(labels.download)}</span>
        </nav>
        <header class="downloads-index">
          <h1>${escapeHtml(labels.downloadsTitle)}</h1>
          <p>${escapeHtml(labels.downloadsLead)}</p>
        </header>
        <section class="downloads-grid">${cards}</section>
      </div>
    </main>
  `;
}

function localizedLabels(localeCode) {
  const base = data.labels[data.defaultLocale];
  const defaults = {
    featuresTitle: "Features",
    faqTitle: "Frequently Asked Questions.",
    manualsTitle: "Manuals:",
  };
  const overlay = (translations.labels && translations.labels[localeCode]) || {};
  const merged = { ...defaults, ...base, ...overlay };
  const choosePlatform = translate(localeCode, "ChoosePlatform", merged.choosePlatform);
  const downloads = translate(localeCode, "header.navigation.downloads", merged.download);

  return {
    ...merged,
    choosePlatform,
    download: downloads,
  };
}

function localizedNavigation(localeCode) {
  const groupTitleKeys = [
    "header.navigation.submenu.titleDeskLap",
    "header.navigation.submenu.titleMobile",
    "header.navigation.submenu.titleBrowsers",
    "header.navigation.submenu.titleStreaming",
    "header.navigation.submenu.titleManualConfiguration",
    "header.navigation.submenu.mobileListTelegramMenu",
  ];
  const itemKeys = new Map([
    ["macos", "header.navigation.submenu.deskLapListMacOs"],
    ["windows", "header.navigation.submenu.deskLapListWindows"],
    ["linux", "header.navigation.submenu.deskLapListLinux"],
    ["ios", "header.navigation.submenu.mobileListIos"],
    ["android", "header.navigation.submenu.mobileListAndroid"],
    ["Windows Phone", "header.navigation.submenu.mobileListWindowsPhone"],
    ["chrome", "header.navigation.submenu.browsersListChrome"],
    ["firefox", "header.navigation.submenu.browsersListFirefox"],
    ["opera", "header.navigation.submenu.browsersListOpera"],
    ["edge", "header.navigation.submenu.browsersListEdge"],
    ["Apple TV", "header.navigation.submenu.streamingListAppleTv"],
    ["Amazon Fire", "header.navigation.submenu.streamingListAmazonFire"],
    ["Roku", "header.navigation.submenu.streamingListRoku"],
    ["Google Chromecast", "header.navigation.submenu.streamingListGoogleChromecast"],
    ["Kodi", "header.navigation.submenu.streamingListKodi"],
    ["Routers", "header.navigation.submenu.ManualConfigurationListRouters"],
    ["NAS", "header.navigation.submenu.ManualConfigurationListNAS"],
    ["VPN Unlimited Bot", "header.navigation.submenu.mobileListTelegram"],
  ]);

  return data.navigation.map((group, index) => ({
    ...group,
    title: translate(localeCode, groupTitleKeys[index], group.title),
    items: group.items.map((item) => {
      const key = item.slug || item.label;
      return {
        ...item,
        label: translate(localeCode, itemKeys.get(key), item.label),
      };
    }),
  }));
}

function translate(localeCode, key, fallback) {
  if (!key) {
    return fallback;
  }

  const value = getNestedValue(readLocaleMessages(localeCode), key);
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  const defaultValue = getNestedValue(readLocaleMessages(data.defaultLocale), key);
  return typeof defaultValue === "string" && defaultValue.length > 0 ? defaultValue : fallback;
}

function readLocaleMessages(localeCode) {
  if (localeMessages.has(localeCode)) {
    return localeMessages.get(localeCode);
  }

  const filePath = path.join(langDir, `${localeCode}.json`);
  const value = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : {};
  localeMessages.set(localeCode, value);
  return value;
}

function getNestedValue(source, key) {
  return key.split(".").reduce((value, segment) => {
    if (!value || typeof value !== "object") {
      return undefined;
    }
    return value[segment];
  }, source);
}

function renderDetailPage(locale, slug, labels, page, root) {
  const buttons = page.primaryLinks.map((link) => {
    const storeClass = link.store ? ` downloads-hero__button--${link.store}` : "";
    const className = link.type === "store" ? `downloads-hero__button downloads-hero__button--store${storeClass}` : "downloads-hero__button";
    return `<a class="${className}" href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer nofollow">${renderStoreLabel(link)}</a>`;
  }).join("");
  const benefits = page.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("");
  const content = renderContentBlocks(locale, slug, labels, page, root);

  return `
    <main class="downloads-page">
      <div class="downloads-container">
        <nav class="downloads-breadcrumbs" aria-label="Breadcrumbs">
          <a href="${escapeAttr(localPath(locale.code, "", root))}">${escapeHtml(labels.service)}</a>
          <span>›</span>
          <a href="${escapeAttr(localPath(locale.code, "", root))}">${escapeHtml(labels.download)}</a>
          <span>›</span>
          <span>${escapeHtml(page.title)}</span>
        </nav>
        <section class="downloads-hero downloads-hero--${escapeAttr(slug)}">
          <div class="downloads-hero__content">
            <h1>${escapeHtml(page.title)}</h1>
            <div class="downloads-hero__buttons">${buttons}</div>
            <p class="downloads-hero__note">${escapeHtml(page.note)}</p>
            <p class="downloads-hero__compatibility">${escapeHtml(page.compatibility)}</p>
            <div class="downloads-rating" aria-label="${escapeAttr(labels.ratingLabel)} ${escapeAttr(page.rating)}">
              <strong>${escapeHtml(page.rating)}</strong>
              <span aria-hidden="true">★ ★ ★ ★ ★</span>
            </div>
            <h2 class="downloads-benefits__title">${escapeHtml(labels.benefits)}</h2>
            <ul class="downloads-benefits">${benefits}</ul>
            ${renderManuals(page, labels, locale.code)}
          </div>
          <div class="downloads-hero__media">
            <img src="${escapeAttr(assetPath(page.image, root))}" alt="${escapeAttr(page.imageAlt)}">
          </div>
        </section>
        ${content}
      </div>
    </main>
  `;
}

function renderManuals(page, labels, localeCode) {
  if (!Array.isArray(page.manuals) || page.manuals.length === 0) {
    return "";
  }

  const links = page.manuals.map((item) => `<a class="downloads-manuals__row" href="${escapeAttr(externalPath(localeCode, item.href))}" target="_blank" rel="noopener noreferrer"><span class="downloads-manuals__download" aria-hidden="true">↓</span><span>${escapeHtml(item.label)}</span><span class="downloads-manuals__chevron" aria-hidden="true"></span></a>`).join("");
  const title = (labels && labels.manualsTitle) || "Manuals:";
  return `<div class="downloads-manuals"><button class="downloads-manuals__row downloads-manuals__row--title" type="button"><span>${escapeHtml(title)}</span><span class="downloads-manuals__chevron" aria-hidden="true"></span></button>${links}</div>`;
}

function renderContentBlocks(locale, slug, labels, page, root) {
  const sectionTag = page.contentTitle ? "article" : "section";
  const sectionHeading = page.contentTitle ? "h3" : "h2";
  const sections = (page.sections || []).map((section) => `
    <${sectionTag} class="downloads-content__section">
      <${sectionHeading}>${escapeHtml(section.title)}</${sectionHeading}>
      ${section.body ? `<p>${escapeHtml(section.body)}</p>` : ""}
    </${sectionTag}>
  `).join("");
  const contentTitle = page.contentTitle ? `<h2 class="downloads-content__title">${escapeHtml(page.contentTitle)}</h2>` : "";

  return [
    sections ? renderStory(page, contentTitle, sections, root) : "",
    renderSteps(page, root, locale.code),
    renderFeatures(page, root, labels),
    renderOtherPlatforms(locale, slug, page, root),
    renderTrial(page, root),
    renderFaq(page, labels),
  ].join("");
}

function renderStory(page, contentTitle, sections, root) {
  if (!page.contentTitle) {
    return `<section class="downloads-content">${sections}</section>`;
  }

  const image = page.contentImage ? `<div class="downloads-story__image"><img src="${escapeAttr(assetPath(page.contentImage, root))}" alt=""></div>` : "";
  return `<section class="downloads-story">${image}<div class="downloads-story__copy">${contentTitle}${sections}</div></section>`;
}

function renderSteps(page, root, localeCode) {
  if (!page.howTo || !Array.isArray(page.howTo.steps)) {
    return "";
  }

  const steps = page.howTo.steps.map((item, index) => `
    <article class="downloads-steps__item">
      ${item.icon ? `<span class="downloads-steps__icon"><img src="${escapeAttr(assetPath(item.icon, root))}" alt=""></span>` : `<span class="downloads-steps__number">${index + 1}</span>`}
      <h3>${escapeHtml(item.title)}</h3>
      ${item.body ? `<p>${escapeHtml(item.body)}</p>` : ""}
    </article>
  `).join("");

  const store = page.primaryLinks.find((link) => link.type === "store") || page.primaryLinks[0];
  const storeButton = store ? `<a class="downloads-hero__button downloads-hero__button--store downloads-hero__button--${escapeAttr(store.store || "microsoft")}" href="${escapeAttr(store.href)}" target="_blank" rel="noopener noreferrer nofollow">${renderStoreLabel(store)}</a>` : "";
  const note = page.howTo.note ? `<p class="downloads-steps__note">${renderNoteWithLinks(page.howTo.note, page.howTo.noteLinks, localeCode)}</p>` : "";
  const label = page.howTo.storeLabel ? `<p class="downloads-steps__store-label">${escapeHtml(page.howTo.storeLabel)}</p>` : "";

  return `<section class="downloads-steps"><h2>${escapeHtml(page.howTo.title)}</h2><div class="downloads-steps__grid">${steps}</div><div class="downloads-steps__download">${storeButton}${label}</div>${note}</section>`;
}

function renderNoteWithLinks(note, noteLinks, localeCode) {
  const safe = escapeHtml(note);
  if (!noteLinks || typeof noteLinks !== "object") {
    return safe;
  }

  return safe.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (match, key) => {
    const link = noteLinks[key];
    if (!link || !link.href) {
      return match;
    }
    return `<a href="${escapeAttr(externalPath(localeCode, link.href))}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label || link.href)}</a>`;
  });
}

function renderStoreLabel(link) {
  if (link.type !== "store") {
    return escapeHtml(link.label);
  }

  const label = String(link.label || "");
  const normalizedLabel = label.replace(/^get it on\s+/i, "");
  const prefix = link.store === "apple" ? "Download on the" : "GET IT ON";

  return `<span class="downloads-store-badge__text"><span>${escapeHtml(prefix)}</span><strong>${escapeHtml(normalizedLabel)}</strong></span>`;
}

function renderFeatures(page, root, labels) {
  if (!Array.isArray(page.features) || page.features.length === 0) {
    return "";
  }

  const cards = page.features.map((item) => `
    <article class="downloads-feature-card downloads-feature-card--${escapeAttr(item.tone || "blue")}">
      ${item.icon ? `<img class="downloads-feature-card__icon" src="${escapeAttr(assetPath(item.icon, root))}" alt="">` : ""}
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `).join("");

  const title = (labels && labels.featuresTitle) || "Features";
  return `<section class="downloads-feature-section"><h2>${escapeHtml(title)}</h2><div class="downloads-feature-grid">${cards}</div></section>`;
}

function renderOtherPlatforms(locale, slug, page, root) {
  if (page.showOtherPlatforms === false) {
    return "";
  }

  const block = getLocalizedOtherPlatforms(locale.code);
  if (!block) {
    return "";
  }

  const stores = (block.stores || []).map((link) => {
    const variant = link.variant ? ` downloads-store-button--${escapeAttr(link.variant)}` : "";
    const storeMod = link.store ? ` downloads-hero__button--${escapeAttr(link.store)}` : "";
    const className = `downloads-hero__button downloads-hero__button--store downloads-store-button${variant}${storeMod}`;
    return `<a class="${className}" href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer nofollow">${renderStoreLabel(link)}</a>`;
  }).join("");

  const trust = (block.trustBadges || []).map((item) => `<span class="downloads-trust-badge downloads-trust-badge--${escapeAttr(item.icon || "check")}"><span class="downloads-trust-badge__icon" aria-hidden="true"></span><span>${escapeHtml(item.label)}</span></span>`).join("");

  return `
    <section class="downloads-other-platforms">
      <div class="downloads-other-platforms__inner">
        <h2>${escapeHtml(block.title)}</h2>
        <p>${escapeHtml(block.lead)}</p>
        <div class="downloads-store-row">${stores}</div>
        ${trust ? `<div class="downloads-trust-row">${trust}</div>` : ""}
      </div>
    </section>
  `;
}

function renderTrial(page, root) {
  if (!page.trial) {
    return "";
  }

  return `
    <section class="downloads-trial">
      <h2>${escapeHtml(page.trial.title)}</h2>
      <div class="downloads-trial__copy">
        <h3>${escapeHtml(page.trial.subtitle)}</h3>
        <p>${escapeHtml(page.trial.body)}</p>
        <h3>${escapeHtml(page.trial.secondaryTitle)}</h3>
        <p>${escapeHtml(page.trial.secondaryBody)}</p>
      </div>
      <img class="downloads-trial__image" src="${escapeAttr(assetPath(page.image, root))}" alt="">
    </section>
  `;
}

function renderFaq(page, labels) {
  if (!Array.isArray(page.faq) || page.faq.length === 0) {
    return "";
  }

  const items = page.faq.map((item) => `
    <details class="downloads-faq__item">
      <summary>${escapeHtml(item.question)}</summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>
  `).join("");

  const title = (labels && labels.faqTitle) || "Frequently Asked Questions.";
  return `<section class="downloads-faq"><h2>${escapeHtml(title)}</h2>${items}</section>`;
}

function localPath(localeCode, slug, root) {
  const prefix = localeCode === data.defaultLocale ? "" : `${localeCode}/`;
  const suffix = slug ? `${slug}/` : "";
  return `${root}${prefix}downloads/${suffix}`;
}

function assetPath(fileName, root) {
  return `${root}assets/img/${fileName}`;
}

function externalPath(localeCode, href) {
  if (localeCode === data.defaultLocale) {
    return href;
  }

  try {
    const url = new URL(href);
    if (url.hostname === "www.vpnunlimited.com") {
      url.pathname = `/${localeCode}${url.pathname}`;
    }
    return url.toString();
  } catch {
    return href;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
