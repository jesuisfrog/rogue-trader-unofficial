/**
 * add-ids.mjs
 *
 * Adds missing _id and _key fields to all compendium source JSON files.
 * Run once from the system root directory:
 *
 *   node add-ids.mjs
 *
 * Safe to re-run — only touches files that are missing _id or _key.
 * Existing IDs are never overwritten.
 *
 * _key format per document type:
 *   Items   → !items!{_id}
 *   Actors  → !actors!{_id}
 *   Macros  → !macros!{_id}
 *   Tables  → !tables!{_id}
 */

import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join, extname } from "path";

// ---------------------------------------------------------------------------
// Config — edit these if your folder layout differs
// ---------------------------------------------------------------------------

const PACKS_SOURCE = "./packs/_source";

// Map each source subfolder name to its Foundry document type key prefix
const PACK_TYPES = {
  weapons: "items",
  armour: "items",
  skills: "items",
  talents: "items",
  macros: "macros",
  psychicPowers: "items",
};

// ---------------------------------------------------------------------------
// ID generation — 16-char alphanumeric, same character set as Foundry
// ---------------------------------------------------------------------------

const ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateId() {
  let id = "";
  for (let i = 0; i < 16; i++) {
    id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return id;
}

// ---------------------------------------------------------------------------
// Process a single JSON file
// ---------------------------------------------------------------------------

async function processFile(filePath, keyPrefix) {
  const raw = await readFile(filePath, "utf8");
  let doc;

  try {
    doc = JSON.parse(raw);
  } catch (e) {
    console.error(`  ✗ JSON parse error in ${filePath}: ${e.message}`);
    return;
  }

  let changed = false;

  // Generate _id if missing
  if (!doc._id) {
    doc._id = generateId();
    changed = true;
  }

  // Generate or fix _key if missing or mismatched
  const correctKey = `!${keyPrefix}!${doc._id}`;
  if (!doc._key || doc._key !== correctKey) {
    doc._key = correctKey;
    changed = true;
  }

  if (!changed) {
    console.log(`  – skipped (already has _id + _key): ${filePath}`);
    return;
  }

  // Write back with consistent formatting
  await writeFile(filePath, JSON.stringify(doc, null, 2) + "\n", "utf8");
  console.log(`  ✓ updated: ${filePath}`);
  console.log(`      _id:  ${doc._id}`);
  console.log(`      _key: ${doc._key}`);
}

// ---------------------------------------------------------------------------
// Walk a directory recursively
// ---------------------------------------------------------------------------

async function walkDir(dir, keyPrefix) {
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      await walkDir(fullPath, keyPrefix);
    } else if (extname(entry) === ".json") {
      await processFile(fullPath, keyPrefix);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const packFolders = await readdir(PACKS_SOURCE);

  for (const folder of packFolders) {
    if (folder.startsWith(".")) continue;

    const keyPrefix = PACK_TYPES[folder];
    if (!keyPrefix) {
      console.warn(`\nWarning: no type mapping for pack "${folder}" — skipping.`);
      console.warn(`  Add it to the PACK_TYPES object in this script.`);
      continue;
    }

    console.log(`\nProcessing pack: ${folder} (prefix: !${keyPrefix}!)`);
    await walkDir(join(PACKS_SOURCE, folder), keyPrefix);
  }

  console.log("\nDone. Now re-run compilePack to rebuild the LevelDB files.");
}

main().catch(console.error);
