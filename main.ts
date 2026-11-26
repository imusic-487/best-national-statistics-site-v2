// Japan in Numbers — the hand-in program (Node 22, standard library only).
//
// The site lives in app/ beside this file: plain static files, no build
// step, nothing loaded over the network. This program hands it in: it
// copies app/ and screenshots/ into the output directory and writes
// /output/dossier.json with buildDossier from the kit's vendored library
// (vendor/makefun-frontend.ts, copied from the kit unchanged — the scorer
// rebuilds the dossier with its own copy and compares byte for byte).
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(root, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(root, 'screenshots'))) {
  cpSync(join(root, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The gate's caps, as the scorer states them: the dossier text is capped
// at 160 KiB; at most 4 screenshots, each at most 256 KiB; app/ holds at
// most 993 files and directories and 16 MiB in all. buildDossier refuses
// anything past those limits, so a successful run is itself a check.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`wrote ${join(outDir, 'dossier.json')} (${statSync(join(outDir, 'dossier.json')).size} bytes)`);
