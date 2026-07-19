import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import * as cheerio from "cheerio";

const SOURCE_URL = "https://samiam3d.com/";
const SOURCE_ORIGIN = new URL(SOURCE_URL).origin;
const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = process.env.SAMIAM3D_ROOT
  ? resolve(process.env.SAMIAM3D_ROOT)
  : resolve(scriptDir, "..");
const publicDir = join(rootDir, "public");
const imageDir = join(publicDir, "assets", "images");
const cssDir = join(publicDir, "assets", "css");
const fontDir = join(publicDir, "assets", "fonts");
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";

const imageExtension = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:$|[?#])/i;
const assetRecords = new Map();
const execFileAsync = promisify(execFile);

async function fetchBuffer(url) {
  const { stdout } = await execFileAsync(
    "curl.exe",
    ["--location", "--fail", "--silent", "--show-error", "--user-agent", userAgent, url],
    {
      encoding: "buffer",
      maxBuffer: 256 * 1024 * 1024,
      windowsHide: true,
    },
  );
  return Buffer.from(stdout);
}

async function fetchText(url) {
  return (await fetchBuffer(url)).toString("utf8");
}

async function fetchJson(url) {
  if (process.env.SAMIAM3D_SOURCE_JSON) {
    return JSON.parse(await readFile(resolve(process.env.SAMIAM3D_SOURCE_JSON), "utf8"));
  }
  return JSON.parse(await fetchText(url));
}

function contentTypeFor(sourceUrl) {
  const extension = extname(new URL(sourceUrl).pathname).toLowerCase();
  return {
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  }[extension] || "application/octet-stream";
}

function normalizeSourceUrl(value, base = SOURCE_URL) {
  if (!value) return null;
  const decoded = value
    .trim()
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&");
  if (!decoded || decoded.startsWith("data:") || decoded.startsWith("#")) {
    return null;
  }

  try {
    const url = new URL(decoded, base);
    if (url.hostname === "www.samiam3d.com") url.hostname = "samiam3d.com";
    if (url.hostname === "samiam3d.com") url.protocol = "https:";
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function highestSrcsetCandidate(srcset) {
  if (!srcset) return null;
  return srcset
    .split(",")
    .map((candidate) => {
      const [url, descriptor = "0w"] = candidate.trim().split(/\s+/);
      const score = Number.parseFloat(descriptor) || 0;
      return { url, score };
    })
    .sort((a, b) => b.score - a.score)[0]?.url;
}

function safeSegment(segment) {
  return segment
    .normalize("NFKD")
    .replace(/[<>:"|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function localImagePath(sourceUrl) {
  const url = new URL(sourceUrl);
  const uploadMarker = "/wp-content/uploads/";
  const markerIndex = url.pathname.indexOf(uploadMarker);
  let pathParts;

  if (url.origin === SOURCE_ORIGIN && markerIndex >= 0) {
    pathParts = url.pathname
      .slice(markerIndex + uploadMarker.length)
      .split("/")
      .filter(Boolean)
      .map(safeSegment);
  } else {
    pathParts = [
      "external",
      safeSegment(url.hostname),
      ...url.pathname.split("/").filter(Boolean).map(safeSegment),
    ];
  }

  let fileName = pathParts.at(-1) || "asset";
  if (!extname(fileName)) fileName += ".bin";
  pathParts[pathParts.length - 1] = fileName;
  const diskPath = join(imageDir, ...pathParts);
  const webPath = `/assets/images/${pathParts.join("/")}`;
  return { diskPath, webPath };
}

async function downloadAsset(sourceUrl, target, kind = "image") {
  if (assetRecords.has(sourceUrl)) return assetRecords.get(sourceUrl);

  const bytes = await fetchBuffer(sourceUrl);
  await mkdir(dirname(target.diskPath), { recursive: true });
  await writeFile(target.diskPath, bytes);

  const record = {
    source: sourceUrl,
    local: target.webPath,
    kind,
    bytes: bytes.length,
    contentType: contentTypeFor(sourceUrl),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
  assetRecords.set(sourceUrl, record);
  return record;
}

async function downloadFirstAvailable(candidates) {
  const unique = [
    ...new Set(candidates.map((candidate) => normalizeSourceUrl(candidate)).filter(Boolean)),
  ];
  let lastError;

  for (const sourceUrl of unique) {
    if (!imageExtension.test(new URL(sourceUrl).pathname)) continue;
    try {
      const target = localImagePath(sourceUrl);
      return await downloadAsset(sourceUrl, target);
    } catch (error) {
      lastError = error;
      console.warn(`Image fallback after failure: ${error.message}`);
    }
  }

  throw lastError || new Error(`No downloadable image candidate: ${candidates.join(", ")}`);
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function downloadFontStyles() {
  const fontRequests = [
    ["righteous", "https://fonts.googleapis.com/css2?family=Righteous&display=swap"],
    ["varela-round", "https://fonts.googleapis.com/css2?family=Varela+Round&display=swap"],
    [
      "open-sans",
      "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    ],
  ];

  const combined = [];
  for (const [familyKey, cssUrl] of fontRequests) {
    let css = await fetchText(cssUrl);
    const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
    for (let index = 0; index < urls.length; index += 1) {
      const sourceUrl = urls[index];
      const extension = extname(new URL(sourceUrl).pathname) || ".woff2";
      const fileName = `${familyKey}-${index + 1}${extension}`;
      const diskPath = join(fontDir, fileName);
      const webPath = `/assets/fonts/${fileName}`;
      await downloadAsset(sourceUrl, { diskPath, webPath }, "font");
      css = css.replaceAll(sourceUrl, webPath);
    }
    combined.push(css);
  }
  await writeFile(join(cssDir, "fonts.css"), combined.join("\n\n"));

  const fontAwesomeUrl =
    "https://samiam3d.com/wp-content/themes/eighties/fonts/fa/fontawesome-webfont.woff?v=4.1.0";
  const fontAwesomeTarget = {
    diskPath: join(fontDir, "fontawesome-webfont.woff"),
    webPath: "/assets/fonts/fontawesome-webfont.woff",
  };
  await downloadAsset(fontAwesomeUrl, fontAwesomeTarget, "font");

  const sourceCss = await fetchText(
    "https://samiam3d.com/wp-content/themes/eighties/fonts/fa/font-awesome.min.css",
  );
  const localFace =
    "@font-face{font-family:'FontAwesome';src:url('/assets/fonts/fontawesome-webfont.woff') format('woff');font-weight:normal;font-style:normal}";
  const localCss = sourceCss.replace(/@font-face\{[^}]+\}/, localFace);
  await writeFile(join(cssDir, "font-awesome.css"), localCss);
}

function stripTrackingAndWordPressRuntime($) {
  $("script, noscript").remove();
  $("link[rel='https://api.w.org/'], link[rel='EditURI'], link[rel='wlwmanifest']").remove();
  $(".site-info a[href*='wordpress.org']").attr("target", "_blank");
  $("a[href='https://samiam3d.com/'], a[href='http://samiam3d.com/']").attr("href", "/");

  $("a[href]").each((_, element) => {
    const anchor = $(element);
    const href = anchor.attr("href");
    if (!href) return;
    const absolute = normalizeSourceUrl(href);
    if (absolute && new URL(absolute).origin !== SOURCE_ORIGIN) {
      anchor.attr("rel", "noopener noreferrer");
    }
  });

  $(".site-toggles .main-navigation-toggle").attr("aria-label", "Open navigation");
  $("#site-navigation .main-navigation-toggle").attr("aria-label", "Close navigation");
  $(".site-toggles .widget-area-toggle").attr("aria-label", "Open contact details");
  $("#secondary .widget-area-toggle").attr("aria-label", "Close contact details");
}

async function main() {
  console.log(`Fetching ${SOURCE_URL}`);
  const page = await fetchJson("https://samiam3d.com/wp-json/wp/v2/pages/326?context=view");
  const sourceMarkup = `<!doctype html>
    <html lang="en-US"><head><title>samiam3d</title></head>
    <body class="home wp-singular page-template-default page page-id-326 wp-theme-eighties">
      <div id="page" class="hfeed site">
        <div class="site-toggles">
          <a href class="main-navigation-toggle"><i class="fa fa-bars"></i></a>
          <a href class="widget-area-toggle"><i class="fa fa-align-right"></i></a>
        </div>
        <nav id="site-navigation" class="main-navigation" role="navigation">
          <a href class="main-navigation-toggle"><i class="fa fa-times"></i></a>
          <h4 class="main-navigation-title">Menu</h4>
          <div class="menu"><ul><li class="current_page_item"><a href="/">Home</a></li></ul></div>
        </nav>
        <header id="masthead" class="site-header" role="banner">
          <a class="skip-link screen-reader-text" href="#content" data-backstretch="https://samiam3d.com/wp-content/uploads/2015/08/header_BLK.jpg">Skip to content</a>
          <div class="site-branding">
            <h1 class="site-title"><a href="/" rel="home">samiam3d</a></h1>
            <h2 class="site-description"></h2>
          </div>
        </header>
        <div id="content" class="site-content">
          <div id="primary" class="content-area">
            <main id="main" class="site-main" role="main">
              <article id="post-326" class="post-326 page type-page status-publish hentry">
                <header class="entry-header"><h1 class="entry-title">${page.title.rendered}</h1></header>
                <div class="entry-content">${page.content.rendered}</div>
              </article>
            </main>
          </div>
          <div id="secondary" class="widget-area" role="complementary">
            <a href class="widget-area-toggle"><i class="fa fa-times"></i></a>
            <div class="widgets-wrapper">
              <aside id="text-2" class="widget widget_text">
                <h4 class="widget-title">Sam Gutierrez</h4>
                <div class="textwidget"><li><a href="http://www.linkedin.com/in/samiam3d" target="_blank">www.linkedin.com/in/samiam3d</a></li><li><a href="mailto:samiam3d@gmail.com">samiam3d@gmail.com</a></li></div>
              </aside>
            </div>
          </div>
        </div>
        <footer id="colophon" class="site-footer" role="contentinfo">
          <div class="site-info">
            <a href="http://wordpress.org/">Built with WordPress</a>
            <span class="sep"> | </span>
            Theme: <a href="http://eighties.me/" rel="designer">Eighties</a> by <a href="http://kopepasah.com/" rel="designer">Kopepasah</a>.
          </div>
        </footer>
      </div>
    </body></html>`;
  const $ = cheerio.load(sourceMarkup, { decodeEntities: false });

  const selectedInlineStyles = `
    img:is([sizes=auto i],[sizes^="auto," i]){contain-intrinsic-size:3000px 1500px}
    html :where(img[class*=wp-image-]){height:auto;max-width:100%}
    :where(figure){margin:0 0 1em}
    .screen-reader-text{word-wrap:normal!important;border:0;clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}
    .screen-reader-text:focus{background-color:#ddd;clip-path:none;color:#444;display:block;font-size:1em;height:auto;left:5px;line-height:normal;padding:15px 23px 14px;text-decoration:none;top:5px;width:auto;z-index:100000}
  `;

  await rm(publicDir, { recursive: true, force: true });
  await Promise.all([
    mkdir(imageDir, { recursive: true }),
    mkdir(cssDir, { recursive: true }),
    mkdir(fontDir, { recursive: true }),
  ]);

  stripTrackingAndWordPressRuntime($);

  const imageJobs = [];
  $("img").each((_, element) => {
    const image = $(element);
    const linkedImage = image.closest("a[href]").attr("href");
    const highestSrcset = highestSrcsetCandidate(image.attr("srcset"));
    const source = image.attr("src");
    const lazySource = image.attr("data-src");
    imageJobs.push({ image, candidates: [linkedImage, highestSrcset, source, lazySource] });
  });

  console.log(`Localizing ${imageJobs.length} on-page image elements`);
  await mapWithConcurrency(imageJobs, 6, async ({ image, candidates }, index) => {
    const record = await downloadFirstAvailable(candidates);
    image.attr("src", record.local);
    image.removeAttr("srcset sizes data-src data-large-file data-orig-file data-orig-size");
    image.attr("decoding", "async");
    if (index > 5) image.attr("loading", "lazy");

    const linked = image.closest("a[href]");
    if (linked.length && imageExtension.test(linked.attr("href") || "")) {
      linked.attr("href", record.local);
    }
  });

  const headerSource = normalizeSourceUrl(
    $("#masthead .screen-reader-text").attr("data-backstretch") ||
      "https://samiam3d.com/wp-content/uploads/2015/08/header_BLK.jpg",
  );
  const headerRecord = await downloadFirstAvailable([headerSource]);
  $("#masthead .screen-reader-text").attr("data-backstretch", headerRecord.local);

  const faviconSources = [
    "https://samiam3d.com/wp-content/uploads/2024/01/cropped-HombreBatz1-32x32.png",
    "https://samiam3d.com/wp-content/uploads/2024/01/cropped-HombreBatz1-192x192.png",
    "https://samiam3d.com/wp-content/uploads/2024/01/cropped-HombreBatz1-180x180.png",
    "https://samiam3d.com/wp-content/uploads/2024/01/cropped-HombreBatz1-270x270.png",
  ];
  const faviconRecords = await mapWithConcurrency(faviconSources, 4, (url) =>
    downloadFirstAvailable([url]),
  );

  await Promise.all([
    writeFile(join(cssDir, "wordpress-blocks.css"), selectedInlineStyles),
    writeFile(
      join(cssDir, "eighties.css"),
      await fetchText("https://samiam3d.com/wp-content/themes/eighties/style.css"),
    ),
    downloadFontStyles(),
  ]);

  const sourceBodyClass = $("body").attr("class") || "home wp-theme-eighties";
  const bodyClass = `${sourceBodyClass} wp-embed-responsive`;
  const bodyHtml = $("body").html();
  const pageTitle = $("head title").text().trim() || "samiam3d";

  const outputHtml = `<!doctype html>
<html lang="en-US" class="no-js">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Sam Gutierrez — art direction, game development, 3D art, and interactive storytelling portfolio." />
    <meta name="theme-color" content="#000000" />
    <title>${pageTitle}</title>
    <link rel="icon" href="${faviconRecords[0].local}" sizes="32x32" />
    <link rel="icon" href="${faviconRecords[1].local}" sizes="192x192" />
    <link rel="apple-touch-icon" href="${faviconRecords[2].local}" />
    <link rel="stylesheet" href="/assets/css/fonts.css" />
    <link rel="stylesheet" href="/assets/css/font-awesome.css" />
    <link rel="stylesheet" href="/assets/css/wordpress-blocks.css" />
    <link rel="stylesheet" href="/assets/css/eighties.css" />
    <link rel="stylesheet" href="/styles.css" />
    <script>document.documentElement.className = 'js';</script>
  </head>
  <body class="${bodyClass}">
${bodyHtml}
    <script type="module" src="/site.js"></script>
  </body>
</html>
`;

  await writeFile(join(rootDir, "index.html"), outputHtml);

  const manifest = [...assetRecords.values()].sort((a, b) => a.local.localeCompare(b.local));
  const imageRecords = manifest.filter((item) => item.kind === "image");
  const totalImageBytes = imageRecords.reduce((sum, item) => sum + item.bytes, 0);
  await writeFile(
    join(publicDir, "assets", "asset-manifest.json"),
    `${JSON.stringify(
      {
        source: SOURCE_URL,
        syncedAt: new Date().toISOString(),
        onPageImageElements: imageJobs.length,
        uniqueDownloadedImages: imageRecords.length,
        imageBytes: totalImageBytes,
        assets: manifest,
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `Done: ${imageJobs.length} image elements, ${imageRecords.length} unique image files, ` +
      `${(totalImageBytes / 1024 / 1024).toFixed(1)} MiB`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
