// Collects public/<slug>/site.json manifests into public/sites.json, which the
// staging index (public/index.html) renders. Runs automatically on wrangler deploy.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { PUBLIC_DIR, siteDirs, readManifest } from "./sites.mjs";

const sites = [];
for (const dir of siteDirs()) {
  const { manifest, error } = readManifest(dir);
  if (error) {
    console.warn(`skipping ${error}`);
    continue;
  }
  sites.push({ ...manifest, slug: dir, url: `/${dir}/` });
}

sites.sort((a, b) => String(b.builtAt).localeCompare(String(a.builtAt)) || a.name.localeCompare(b.name));

writeFileSync(
  join(PUBLIC_DIR, "sites.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), sites }, null, 2) + "\n",
);
console.log(`sites.json: ${sites.length} site(s)`);
