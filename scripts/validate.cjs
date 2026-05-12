const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const rootDir = path.resolve(__dirname, "..");
const data = loadDownloadsData();
const htmlFiles = walk(rootDir).filter((file) => file.endsWith(".html"));
const missing = [];
const workstationRefs = [];
const matrixErrors = [];

validateGeneratedMatrix();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  if (/C:\\Users\\|OneDrive|Рабочий стол|keepsolid-monorepo/i.test(html)) {
    workstationRefs.push(path.relative(rootDir, file));
  }

  const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (isExternal(ref) || ref.startsWith("#") || ref.startsWith("mailto:") || ref.startsWith("tel:")) {
      continue;
    }

    const target = path.resolve(path.dirname(file), ref.split("#")[0].split("?")[0]);
    const exists = fs.existsSync(target) || fs.existsSync(path.join(target, "index.html"));
    if (!exists) {
      missing.push(`${path.relative(rootDir, file)} -> ${ref}`);
    }
  }
}

if (matrixErrors.length || workstationRefs.length || missing.length) {
  if (matrixErrors.length) {
    console.error("Generated page matrix errors:");
    matrixErrors.forEach((item) => console.error(`- ${item}`));
  }
  if (workstationRefs.length) {
    console.error("Workstation path references found:");
    workstationRefs.forEach((item) => console.error(`- ${item}`));
  }
  if (missing.length) {
    console.error("Missing local references:");
    missing.forEach((item) => console.error(`- ${item}`));
  }
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files.`);

function loadDownloadsData() {
  const dataPath = path.join(rootDir, "assets", "data", "downloads-data.js");
  const translationsPath = path.join(rootDir, "assets", "data", "translations.js");
  const dataCode = fs.readFileSync(dataPath, "utf8");
  const sandbox = { globalThis: {} };
  vm.createContext(sandbox);
  vm.runInContext(dataCode, sandbox, { filename: dataPath });
  if (fs.existsSync(translationsPath)) {
    vm.runInContext(fs.readFileSync(translationsPath, "utf8"), sandbox, { filename: translationsPath });
  }

  if (!sandbox.globalThis.DOWNLOADS_DATA) {
    throw new Error("DOWNLOADS_DATA was not loaded.");
  }

  const result = sandbox.globalThis.DOWNLOADS_DATA;
  result.__translations = sandbox.globalThis.DOWNLOADS_TRANSLATIONS || { pages: {} };
  return result;
}

function expectedTitle(slug, localeCode) {
  const base = data.pages[slug];
  if (!base) return "";
  if (localeCode === data.defaultLocale) return base.title;
  const overlay = data.__translations?.pages?.[slug]?.[localeCode];
  return (overlay && overlay.title) || base.title;
}

function validateGeneratedMatrix() {
  const slugs = ["", ...Object.keys(data.pages)];
  const expectedFiles = new Set([path.join(rootDir, "index.html")]);

  for (const locale of data.locales) {
    for (const slug of slugs) {
      const file = path.join(rootDir, ...pathSegments(locale.code, slug), "index.html");
      expectedFiles.add(file);

      if (!fs.existsSync(file)) {
        matrixErrors.push(`Missing generated page: ${path.relative(rootDir, file)}`);
        continue;
      }

      const html = fs.readFileSync(file, "utf8");
      assertContains(html, `lang="${locale.code}"`, file);
      assertContains(html, `dir="${locale.dir || "ltr"}"`, file);
      assertContains(html, `data-rendered="true"`, file);
      assertContains(html, `data-locale="${locale.code}"`, file);
      assertContains(html, `data-slug="${slug}"`, file);

      const alternateCount = countMatches(html, /rel="alternate"/g);
      if (alternateCount !== data.locales.length) {
        matrixErrors.push(`${path.relative(rootDir, file)} has ${alternateCount} alternate links, expected ${data.locales.length}`);
      }

      if (slug) {
        const title = expectedTitle(slug, locale.code);
        if (!html.includes(title)) {
          matrixErrors.push(`${path.relative(rootDir, file)} does not include page title "${title}"`);
        }
      }
    }
  }

  const extraFiles = htmlFiles.filter((file) => !expectedFiles.has(file));
  for (const file of extraFiles) {
    matrixErrors.push(`Unexpected HTML file: ${path.relative(rootDir, file)}`);
  }
}

function assertContains(html, needle, file) {
  if (!html.includes(needle)) {
    matrixErrors.push(`${path.relative(rootDir, file)} does not include ${needle}`);
  }
}

function countMatches(value, regex) {
  return [...value.matchAll(regex)].length;
}

function pathSegments(localeCode, slug) {
  const prefix = localeCode === data.defaultLocale ? [] : [localeCode];
  return [...prefix, ...(slug ? [slug] : [])];
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function isExternal(ref) {
  return /^(?:[a-z]+:)?\/\//i.test(ref);
}
