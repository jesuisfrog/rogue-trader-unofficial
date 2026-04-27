// build-packs.mjs — run with: node build-packs.mjs
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { readdir, rm } from "fs/promises";
import { join } from "path";

const SOURCE = "packs/_source";
const OUTPUT = "packs";

const packs = (await readdir(SOURCE, { withFileTypes: true }))
    .filter(d => d.isDirectory())
    .map(d => d.name);

for (const pack of packs) {
    const src = join(SOURCE, pack);
    const dest = join(OUTPUT, pack);
    console.log(`Packing ${pack}...`);
    await compilePack(src, dest, { log: true });
}