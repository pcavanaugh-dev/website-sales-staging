// Checks every site directory before it is merged or deployed:
//   - has index.html and a complete site.json whose slug matches the directory
//   - declared preview image exists
//   - stays self-contained: no root-absolute URLs and no references to other sites
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { PUBLIC_DIR, REQUIRED_FIELDS, STATUSES, siteDirs, readManifest } from "./sites.mjs";

const only = process.argv[2];
const dirs = siteDirs().filter((d) => !only || d === only);
const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const dir of dirs) {
  const root = join(PUBLIC_DIR, dir);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dir)) errors.push(`${dir}: slug must be lowercase kebab-case`);
  if (!existsSync(join(root, "index.html"))) errors.push(`${dir}: missing index.html`);

  const { manifest, error } = readManifest(dir);
  if (error) {
    errors.push(error);
  } else {
    for (const field of REQUIRED_FIELDS) {
      if (!manifest[field]) errors.push(`${dir}: site.json missing "${field}"`);
    }
    if (manifest.slug && manifest.slug !== dir) errors.push(`${dir}: site.json slug "${manifest.slug}" does not match directory`);
    if (manifest.status && !STATUSES.includes(manifest.status)) errors.push(`${dir}: status must be one of ${STATUSES.join(", ")}`);
    if (manifest.preview && !existsSync(join(root, manifest.preview))) errors.push(`${dir}: preview "${manifest.preview}" not found`);
  }

  const others = siteDirs().filter((d) => d !== dir);
  for (const file of walk(root).filter((f) => [".html", ".css", ".js"].includes(extname(f)))) {
    const text = readFileSync(file, "utf8");
    const rel = file.slice(PUBLIC_DIR.length);
    // Root-absolute paths break when the site is served under /<slug>/.
    for (const m of text.matchAll(/(?:href|src|action|srcset)\s*=\s*["'](\/(?!\/)[^"']*)["']|url\(\s*["']?(\/(?!\/)[^)"']*)/g)) {
      errors.push(`${rel}: root-absolute URL "${m[1] ?? m[2]}" (use a relative path)`);
    }
    for (const other of others) {
      if (text.includes(`../${other}/`)) errors.push(`${rel}: references another site (${other})`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${dirs.length} site(s) valid`);
