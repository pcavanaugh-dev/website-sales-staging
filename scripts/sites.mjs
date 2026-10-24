// Shared helpers for reading the per-site manifests in public/<slug>/site.json.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

export const PUBLIC_DIR = new URL("../public/", import.meta.url).pathname;

export const REQUIRED_FIELDS = ["slug", "name", "city", "cuisine", "sourceUrl", "status", "builtAt", "summary"];
export const STATUSES = ["ready", "in-progress"];

// Every directory under public/ that is not reserved (leading "_" or ".") is a site.
export function siteDirs() {
  return readdirSync(PUBLIC_DIR)
    .filter((name) => !name.startsWith("_") && !name.startsWith("."))
    .filter((name) => statSync(join(PUBLIC_DIR, name)).isDirectory())
    .sort();
}

export function readManifest(dir) {
  const path = join(PUBLIC_DIR, dir, "site.json");
  if (!existsSync(path)) return { error: `${dir}: missing site.json` };
  try {
    return { manifest: JSON.parse(readFileSync(path, "utf8")) };
  } catch (err) {
    return { error: `${dir}: site.json is not valid JSON (${err.message})` };
  }
}
