#!/usr/bin/env node
// Reports content frontmatter completeness. Non-fatal by default (P0-P4);
// wire `--fail-on-warning` into CI once real content volume lands (P5+).
import fs from "node:fs";
import path from "node:path";

import { parse as parseYaml } from "yaml";

const collections = ["work", "writing", "ideas"];
const failOnWarning = process.argv.includes("--fail-on-warning");
let warnings = 0;

function parseFrontmatter(raw) {
  const match = /^---\s*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)\s*(?:\r?\n|$)/.exec(
    raw,
  );
  if (!match) return { data: {}, content: raw };
  const data = parseYaml(match[1]) ?? {};
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Frontmatter must be a YAML mapping");
  }
  return { data, content: raw.slice(match[0].length) };
}

for (const collection of collections) {
  const dir = path.join(process.cwd(), "content", collection);
  if (!fs.existsSync(dir)) continue;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx") || file.startsWith("_")) continue;

    const { data } = parseFrontmatter(
      fs.readFileSync(path.join(dir, file), "utf8"),
    );
    const missing = [];

    if (!data.summary) missing.push("summary");
    if (collection === "work" && data.featured && !data.cover) {
      missing.push("cover (required on featured items)");
    }

    if (missing.length > 0) {
      warnings += 1;
      console.warn(`⚠ ${collection}/${file}: missing ${missing.join(", ")}`);
    }
  }
}

if (warnings > 0) {
  console.log(`\n${warnings} warning(s).`);
  if (failOnWarning) process.exit(1);
} else {
  console.log("Content check passed with no warnings.");
}
