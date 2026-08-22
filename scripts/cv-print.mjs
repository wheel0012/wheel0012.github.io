import { spawnSync } from "node:child_process";
import {
  accessSync,
  createReadStream,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PDFDocument } from "pdf-lib";
import { chromium } from "playwright";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const docsDirectory = path.join(repositoryRoot, "docs");
const siteDirectory = path.join(docsDirectory, "_site");
const artifactDirectory = path.join(repositoryRoot, "artifacts");
const defaultOutput = path.join(artifactDirectory, "Taejun_Lee_CV.pdf");
const minimumScale = 0.92;
const scaleStep = 0.01;

const modes = new Set(["check", "pdf", "fit"]);
const mode = process.argv[2] ?? "check";

if (!modes.has(mode)) {
  console.error("Usage: node scripts/cv-print.mjs <check|pdf|fit>");
  process.exit(2);
}

function canExecute(command) {
  const result = spawnSync(command, ["--version"], { stdio: "ignore" });
  return !result.error && result.status === 0;
}

function findBundler() {
  if (process.env.BUNDLE_BIN) {
    accessSync(process.env.BUNDLE_BIN);
    return process.env.BUNDLE_BIN;
  }

  if (canExecute("bundle")) {
    return "bundle";
  }

  const rubyRoot = path.join(homedir(), ".local", "share", "gem", "ruby");
  try {
    const candidates = readdirSync(rubyRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(rubyRoot, entry.name, "bin", "bundle"))
      .sort()
      .reverse();

    for (const candidate of candidates) {
      if (canExecute(candidate)) {
        return candidate;
      }
    }
  } catch {
    // Fall through to the actionable error below.
  }

  throw new Error(
    "Bundler was not found. Install Bundler or set BUNDLE_BIN to its executable path.",
  );
}

function buildSite() {
  const result = spawnSync(findBundler(), ["exec", "jekyll", "build"], {
    cwd: docsDirectory,
    stdio: "inherit",
  });

  if (result.error || result.status !== 0) {
    throw new Error("Jekyll build failed.");
  }
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

function startStaticServer() {
  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    let relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");

    if (!relativePath || relativePath.endsWith("/")) {
      relativePath += "index.html";
    }

    const filePath = path.resolve(siteDirectory, relativePath);
    if (!filePath.startsWith(`${siteDirectory}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const stream = createReadStream(filePath);
    stream.on("open", () => {
      response.writeHead(200, {
        "Content-Type": contentTypes.get(path.extname(filePath)) ?? "application/octet-stream",
      });
      stream.pipe(response);
    });
    stream.on("error", () => response.writeHead(404).end("Not found"));
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, url: `http://127.0.0.1:${address.port}/cv/` });
    });
  });
}

async function renderPdf(page, scale) {
  const pdf = await page.pdf({
    displayHeaderFooter: false,
    format: "A4",
    preferCSSPageSize: true,
    printBackground: true,
    scale,
  });
  const document = await PDFDocument.load(pdf, { updateMetadata: false });
  return { pdf, pages: document.getPageCount() };
}

async function main() {
  buildSite();
  const { server, url } = await startStaticServer();
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    let scale = 1;
    let result = await renderPdf(page, scale);

    if (mode === "fit") {
      while (result.pages > 1 && scale - scaleStep >= minimumScale - 1e-9) {
        scale = Number((scale - scaleStep).toFixed(2));
        result = await renderPdf(page, scale);
      }
    }

    if (result.pages !== 1) {
      throw new Error(
        mode === "fit"
          ? `CV still uses ${result.pages} pages at the minimum allowed scale (${minimumScale}). Edit the content or print CSS.`
          : `CV uses ${result.pages} A4 pages at 100% scale. Run npm run cv:fit or edit the content or print CSS.`,
      );
    }

    console.log(`CV check passed: 1 A4 page at ${Math.round(scale * 100)}% scale.`);

    if (mode !== "check") {
      mkdirSync(artifactDirectory, { recursive: true });
      writeFileSync(defaultOutput, result.pdf);
      console.log(`PDF written to ${path.relative(repositoryRoot, defaultOutput)}.`);
    }
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
