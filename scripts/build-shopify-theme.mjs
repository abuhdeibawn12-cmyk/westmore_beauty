import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const assetsDirectory = path.join(root, "assets");
const mediaCdnBase =
  "https://cdn.jsdelivr.net/gh/abuhdeibawn12-cmyk/westmore_beauty@main/media/videos";

const sourcePages = {
  home: "home.html",
  product: "index.html",
  brush: "brush.html",
  exclusive: "exclusive-offer.html",
};

const sourceStyles = {
  base: "styles.css",
  home: "home.css",
  brush: "brush.css",
  exclusive: "exclusive.css",
};

const sourceScripts = {
  cart: "cart.js",
  home: "home.js",
  product: "script.js",
  brush: "brush.js",
  exclusive: "exclusive.js",
};

const assetMap = new Map();

async function collectNestedAssets(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.posix.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      await collectNestedAssets(absolutePath, relativePath);
      continue;
    }

    if (!relativeDirectory) {
      assetMap.set(`assets/${relativePath}`, relativePath);
      continue;
    }

    const flattenedName = relativePath.replaceAll("/", "-");
    assetMap.set(`assets/${relativePath}`, flattenedName);
    await copyFile(absolutePath, path.join(assetsDirectory, flattenedName));
  }
}

function replaceStaticRoutes(source) {
  return source
    .replaceAll("exclusive-offer.html#offer", "/pages/bodycoverageperfector-exclusiveoffer#offer")
    .replaceAll("exclusive-offer.html", "/pages/bodycoverageperfector-exclusiveoffer")
    .replaceAll("home.html#", "/#")
    .replaceAll("home.html", "/")
    .replaceAll("index.html#", "/products/body-coverage-perfector#")
    .replaceAll("index.html", "/products/body-coverage-perfector")
    .replaceAll("brush.html", "/products/blend-blur-body-brush");
}

function replaceAssetReferences(source) {
  let result = source;
  const mappings = [...assetMap.entries()].sort(([left], [right]) => right.length - left.length);

  for (const [staticPath, shopifyName] of mappings) {
    result = result.replaceAll(staticPath, `{{ '${shopifyName}' | asset_url }}`);
  }

  return result;
}

function replaceMediaReferences(source) {
  return source.replaceAll("media/videos/", `${mediaCdnBase}/`);
}

function convertSource(source) {
  return replaceStaticRoutes(replaceMediaReferences(replaceAssetReferences(source)));
}

function extractBody(html, filename) {
  const match = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) {
    throw new Error(`Could not find the body element in ${filename}`);
  }

  return match[1].trim();
}

await Promise.all([
  mkdir(path.join(root, "layout"), { recursive: true }),
  mkdir(path.join(root, "templates"), { recursive: true }),
  mkdir(path.join(root, "snippets"), { recursive: true }),
  mkdir(path.join(root, "config"), { recursive: true }),
  mkdir(path.join(root, "locales"), { recursive: true }),
]);

await collectNestedAssets(assetsDirectory);

for (const [name, filename] of Object.entries(sourcePages)) {
  const html = await readFile(path.join(root, filename), "utf8");
  const body = convertSource(extractBody(html, filename));
  await writeFile(path.join(root, "snippets", `westmore-${name}.liquid`), `${body}\n`, "utf8");
}

for (const [name, filename] of Object.entries(sourceStyles)) {
  const css = await readFile(path.join(root, filename), "utf8");
  await writeFile(path.join(assetsDirectory, `westmore-${name}.css.liquid`), convertSource(css), "utf8");
}

for (const [name, filename] of Object.entries(sourceScripts)) {
  const javascript = await readFile(path.join(root, filename), "utf8");
  await writeFile(path.join(assetsDirectory, `westmore-${name}.js.liquid`), convertSource(javascript), "utf8");
}

console.log(`Generated Shopify theme files with ${assetMap.size} mapped assets.`);
