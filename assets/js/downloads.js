(function () {
  const data = window.DOWNLOADS_DATA;
  const translations = window.DOWNLOADS_TRANSLATIONS || { labels: {}, otherPlatforms: {}, pages: {} };

  if (!data) {
    return;
  }

  const localeCodes = new Set(data.locales.map((locale) => locale.code));
  const mount = document.querySelector("[data-downloads-app]");
  const localeFromPath = mount?.getAttribute("data-locale") || data.defaultLocale;
  const locale = data.locales.find((item) => item.code === localeFromPath) || data.locales[0];
  const slug = mount?.getAttribute("data-slug") || "";
  const page = slug ? getLocalizedPage(slug, locale.code) : null;
  const labels = localizedLabels(locale.code);

  document.documentElement.lang = locale.code;
  document.documentElement.dir = locale.dir || "ltr";

  const app = mount;
  if (!app) {
    return;
  }

  if (app.getAttribute("data-rendered") === "true" && app.children.length > 0) {
    bindNav();
    return;
  }

  app.innerHTML = [
    renderNav(locale.code, slug),
    renderLanguageMenu(locale.code, slug, labels),
    page ? renderDetailPage(locale.code, labels, page, slug) : renderIndexPage(locale.code, labels),
  ].join("");

  bindNav();

  function localPath(localeCode, targetSlug) {
    const prefix = localeCode === data.defaultLocale ? "" : `${localeCode}/`;
    const suffix = targetSlug ? `${targetSlug}/` : "";
    return relativeToRoot(`${prefix}downloads/${suffix}`);
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

  function relativeToRoot(target) {
    const depth = (locale.code === data.defaultLocale ? 0 : 1) + 1 + (slug ? 1 : 0);
    const prefix = depth > 0 ? "../".repeat(depth) : "./";
    return `${prefix}${target}`;
  }

  function assetPath(fileName) {
    return relativeToRoot(`assets/img/${fileName}`);
  }

  function mergeOverlay(base, overlay) {
    if (overlay === undefined || overlay === null) return base;
    if (Array.isArray(base) && Array.isArray(overlay)) {
      return base.map((item, idx) => overlay[idx] !== undefined ? mergeOverlay(item, overlay[idx]) : item);
    }
    if (base && typeof base === "object" && !Array.isArray(base) && overlay && typeof overlay === "object" && !Array.isArray(overlay)) {
      const out = { ...base };
      Object.keys(overlay).forEach((key) => {
        out[key] = mergeOverlay(base[key], overlay[key]);
      });
      return out;
    }
    return overlay;
  }

  function getLocalizedPage(pageSlug, localeCode) {
    const base = data.pages[pageSlug];
    if (!base) return null;
    if (localeCode === data.defaultLocale) return base;
    const overlay = translations.pages?.[pageSlug]?.[localeCode];
    return overlay ? mergeOverlay(base, overlay) : base;
  }

  function getLocalizedOtherPlatforms(localeCode) {
    if (localeCode === data.defaultLocale) return data.otherPlatforms;
    const overlay = translations.otherPlatforms?.[localeCode];
    return overlay ? mergeOverlay(data.otherPlatforms, overlay) : data.otherPlatforms;
  }

  function localizedLabels(localeCode) {
    return {
      featuresTitle: "Features",
      faqTitle: "Frequently Asked Questions.",
      manualsTitle: "Manuals:",
      ...data.labels[data.defaultLocale],
      ...(data.labels[localeCode] || {}),
      ...(translations.labels?.[localeCode] || {}),
    };
  }

  function renderNav(currentLocale, currentSlug) {
    const groups = data.navigation.map((group) => {
      const isActiveGroup = group.items.some((item) => item.slug === currentSlug);
      const items = group.items.map((item) => {
        const isExternal = Boolean(item.externalPath);
        const href = isExternal ? externalPath(currentLocale, item.externalPath) : localPath(currentLocale, item.slug);
        const active = item.slug === currentSlug ? " is-active" : "";
        const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
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

  function renderLanguageMenu(currentLocale, currentSlug, text) {
    const current = data.locales.find((item) => item.code === currentLocale) || data.locales[0];
    const links = data.locales.map((item) => {
      const active = item.code === currentLocale ? " is-active" : "";
      return `<a class="downloads-language__link${active}" href="${escapeAttr(localPath(item.code, currentSlug))}">${escapeHtml(item.label)}</a>`;
    }).join("");

    return `<section class="downloads-language-bar"><div class="downloads-container"><details class="downloads-language"><summary class="downloads-language__summary"><span>${escapeHtml(text.language || "Language")}:</span><strong>${escapeHtml(current.label)}</strong></summary><div class="downloads-language__menu">${links}</div></details></div></section>`;
  }

  function renderIndexPage(localeCode, text) {
    const cards = Object.keys(data.pages).map((pageSlug) => {
      const item = getLocalizedPage(pageSlug, localeCode);
      return `
        <article class="downloads-card">
          <img class="downloads-card__icon" src="${escapeAttr(assetPath(item.icon))}" alt="">
          <h2 class="downloads-card__title">${escapeHtml(item.title)}</h2>
          <p class="downloads-card__text">${escapeHtml(item.description)}</p>
          <a class="downloads-card__link" href="${escapeAttr(localPath(localeCode, pageSlug))}">${escapeHtml(text.viewPlatform)}</a>
        </article>
      `;
    }).join("");

    return `
      <main class="downloads-page">
        <div class="downloads-container">
          <nav class="downloads-breadcrumbs" aria-label="Breadcrumbs">
            <a href="${escapeAttr(localPath(localeCode, ""))}">${escapeHtml(text.service)}</a>
            <span>›</span>
            <span>${escapeHtml(text.download)}</span>
          </nav>
          <header class="downloads-index">
            <h1>${escapeHtml(text.downloadsTitle)}</h1>
            <p>${escapeHtml(text.downloadsLead)}</p>
          </header>
          <section class="downloads-grid">${cards}</section>
        </div>
      </main>
    `;
  }

  function renderDetailPage(localeCode, text, page, slug) {
    const buttons = page.primaryLinks.map((link) => {
      const storeClass = link.store ? ` downloads-hero__button--${link.store}` : "";
      const className = link.type === "store" ? `downloads-hero__button downloads-hero__button--store${storeClass}` : "downloads-hero__button";
      return `<a class="${className}" href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer nofollow">${renderStoreLabel(link)}</a>`;
    }).join("");

    const benefits = page.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("");
    const content = renderContentBlocks(localeCode, slug, page);

    return `
      <main class="downloads-page">
        <div class="downloads-container">
          <nav class="downloads-breadcrumbs" aria-label="Breadcrumbs">
            <a href="${escapeAttr(localPath(localeCode, ""))}">${escapeHtml(text.service)}</a>
            <span>›</span>
            <a href="${escapeAttr(localPath(localeCode, ""))}">${escapeHtml(text.download)}</a>
            <span>›</span>
            <span>${escapeHtml(page.title)}</span>
          </nav>
          <section class="downloads-hero downloads-hero--${escapeAttr(slug)}">
            <div class="downloads-hero__content">
              <h1>${escapeHtml(page.title)}</h1>
              <div class="downloads-hero__buttons">${buttons}</div>
              <p class="downloads-hero__note">${escapeHtml(page.note)}</p>
              <p class="downloads-hero__compatibility">${escapeHtml(page.compatibility)}</p>
              <div class="downloads-rating" aria-label="${escapeAttr(text.ratingLabel)} ${escapeAttr(page.rating)}">
                <strong>${escapeHtml(page.rating)}</strong>
                <span aria-hidden="true">★ ★ ★ ★ ★</span>
              </div>
              <h2 class="downloads-benefits__title">${escapeHtml(text.benefits)}</h2>
              <ul class="downloads-benefits">${benefits}</ul>
              ${renderManuals(page, text, localeCode)}
            </div>
            <div class="downloads-hero__media">
              <img src="${escapeAttr(assetPath(page.image))}" alt="${escapeAttr(page.imageAlt)}">
            </div>
          </section>
          ${content}
        </div>
      </main>
    `;
  }

  function renderManuals(page, text, localeCode) {
    if (!Array.isArray(page.manuals) || page.manuals.length === 0) {
      return "";
    }

    const links = page.manuals.map((item) => `<a class="downloads-manuals__row" href="${escapeAttr(externalPath(localeCode, item.href))}" target="_blank" rel="noopener noreferrer"><span class="downloads-manuals__download" aria-hidden="true">↓</span><span>${escapeHtml(item.label)}</span><span class="downloads-manuals__chevron" aria-hidden="true"></span></a>`).join("");
    return `<div class="downloads-manuals"><button class="downloads-manuals__row downloads-manuals__row--title" type="button"><span>${escapeHtml(text.manualsTitle || "Manuals:")}</span><span class="downloads-manuals__chevron" aria-hidden="true"></span></button>${links}</div>`;
  }

  function renderContentBlocks(localeCode, currentSlug, page) {
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
      sections ? renderStory(page, contentTitle, sections) : "",
      renderSteps(page, localeCode),
      renderFeatures(page, text),
      renderOtherPlatforms(localeCode, currentSlug, page),
      renderTrial(page),
      renderFaq(page, text),
    ].join("");
  }

  function renderStory(page, contentTitle, sections) {
    if (!page.contentTitle) {
      return `<section class="downloads-content">${sections}</section>`;
    }

    const image = page.contentImage ? `<div class="downloads-story__image"><img src="${escapeAttr(assetPath(page.contentImage))}" alt=""></div>` : "";
    return `<section class="downloads-story">${image}<div class="downloads-story__copy">${contentTitle}${sections}</div></section>`;
  }

  function renderSteps(page, localeCode) {
    if (!page.howTo || !Array.isArray(page.howTo.steps)) {
      return "";
    }

    const steps = page.howTo.steps.map((item, index) => `
      <article class="downloads-steps__item">
        ${item.icon ? `<span class="downloads-steps__icon"><img src="${escapeAttr(assetPath(item.icon))}" alt=""></span>` : `<span class="downloads-steps__number">${index + 1}</span>`}
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

  function renderFeatures(page, text) {
    if (!Array.isArray(page.features) || page.features.length === 0) {
      return "";
    }

    const cards = page.features.map((item) => `
      <article class="downloads-feature-card downloads-feature-card--${escapeAttr(item.tone || "blue")}">
        ${item.icon ? `<img class="downloads-feature-card__icon" src="${escapeAttr(assetPath(item.icon))}" alt="">` : ""}
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");

    return `<section class="downloads-feature-section"><h2>${escapeHtml(text.featuresTitle || "Features")}</h2><div class="downloads-feature-grid">${cards}</div></section>`;
  }

  function renderOtherPlatforms(localeCode, currentSlug, page) {
    if (page.showOtherPlatforms === false) {
      return "";
    }

    const otherPlatforms = getLocalizedOtherPlatforms(localeCode);
    const cards = Object.keys(data.pages)
      .filter((targetSlug) => targetSlug !== currentSlug)
      .slice(0, 3)
      .map((targetSlug) => {
        const item = getLocalizedPage(targetSlug, localeCode);
        return `
        <a class="downloads-platform-card" href="${escapeAttr(localPath(localeCode, targetSlug))}">
          <img src="${escapeAttr(assetPath(item.icon))}" alt="">
          <span>${escapeHtml(item.title)}</span>
        </a>
      `;
      }).join("");

    return `<section class="downloads-other-platforms"><h2>${escapeHtml(otherPlatforms.title)}</h2><p>${escapeHtml(otherPlatforms.lead)}</p><div class="downloads-platform-grid">${cards}</div></section>`;
  }

  function renderTrial(page) {
    if (!page.trial) {
      return "";
    }

    return `
      <section class="downloads-trial">
        <div>
          <h2>${escapeHtml(page.trial.title)}</h2>
          <h3>${escapeHtml(page.trial.subtitle)}</h3>
          <p>${escapeHtml(page.trial.body)}</p>
          <h3>${escapeHtml(page.trial.secondaryTitle)}</h3>
          <p>${escapeHtml(page.trial.secondaryBody)}</p>
        </div>
        <img src="${escapeAttr(assetPath(page.image))}" alt="">
      </section>
    `;
  }

  function renderFaq(page, text) {
    if (!Array.isArray(page.faq) || page.faq.length === 0) {
      return "";
    }

    const items = page.faq.map((item) => `
      <details class="downloads-faq__item">
        <summary>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>
    `).join("");

    return `<section class="downloads-faq"><h2>${escapeHtml(text.faqTitle || "Frequently Asked Questions.")}</h2>${items}</section>`;
  }

  function bindNav() {
    document.querySelectorAll(".downloads-nav__button").forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.closest(".downloads-nav__group");
        const expanded = button.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".downloads-nav__button").forEach((item) => item.setAttribute("aria-expanded", "false"));
        document.querySelectorAll(".downloads-nav__group").forEach((item) => item.classList.remove("is-open"));
        if (!expanded) {
          button.setAttribute("aria-expanded", "true");
          group && group.classList.add("is-open");
        }
      });
    });
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
})();
