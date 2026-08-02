import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const outputDir = join(root, ".output");
const distDir = join(root, "dist");
const publicDir = join(distDir, "public");
const serverDir = join(distDir, "server");

await rm(distDir, { recursive: true, force: true });

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(absolute)));
    else files.push(absolute);
  }
  return files;
}

function contentType(path) {
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js") || path.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (path.endsWith(".json")) return "application/json; charset=utf-8";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
}

await mkdir(publicDir, { recursive: true });
await mkdir(serverDir, { recursive: true });
await cp(join(outputDir, "public"), publicDir, { recursive: true, force: true });
await cp(join(outputDir, "server"), serverDir, { recursive: true, force: true });
await cp(join(outputDir, "server", "index.mjs"), join(serverDir, "index-base.mjs"));

const embeddedAssets = {};
for (const file of await collectFiles(publicDir)) {
  const pathname = `/${relative(publicDir, file).replaceAll("\\", "/")}`;
  embeddedAssets[pathname] = {
    type: contentType(file),
    body: (await readFile(file)).toString("base64"),
  };
}

const wrapper = `import baseHandler from "./index-base.mjs";

const embeddedAssets = ${JSON.stringify(embeddedAssets)};

function responseForAsset(asset) {
  const bytes = Uint8Array.from(atob(asset.body), (character) => character.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "content-type": asset.type,
    },
  });
}

export default {
  fetch(request, env, context) {
    const pathname = new URL(request.url).pathname;
    const asset = embeddedAssets[pathname];
    if (asset) return responseForAsset(asset);
    return baseHandler.fetch(request, env, context);
  },
};
`;

await writeFile(join(serverDir, "index.js"), wrapper);
