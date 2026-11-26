// NusaData — Indonesia dalam Angka (Node 22, standard library only).
//
// The site is plain static files under app/ (index.html + ES modules + CSS,
// no build step, nothing loaded over the network) and the screenshots are
// real renders of it under screenshots/. This program hands the entry in: it
// copies app/ and screenshots/ beside this file into /output and writes
// /output/dossier.json with buildDossier from the vendored make.fun library.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's caps, as the competition's RULES.txt states them: at most 4
// screenshots of 256 KiB each, at most 993 files / 16 MiB under app/, and
// the dossier text capped at 160 KiB. Refuse early rather than hand in an
// entry the scorer would refuse.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function countAppFiles(dir) {
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = countAppFiles(path);
      files += sub.files;
      bytes += sub.bytes;
    } else if (entry.isFile()) {
      files += 1;
      bytes += statSync(path).size;
    }
  }
  return { files, bytes };
}

function checkApp(appDir) {
  const { files, bytes } = countAppFiles(appDir);
  if (files > CAPS.app_max_files) {
    throw new Error(`app/ holds ${files} files, over the ${CAPS.app_max_files} cap`);
  }
  if (bytes > CAPS.app_max_bytes) {
    throw new Error(`app/ holds ${bytes} bytes, over the ${CAPS.app_max_bytes} cap`);
  }
  if (!existsSync(join(appDir, 'index.html'))) {
    throw new Error('app/index.html is missing');
  }
}

function checkScreenshots(shotsDir) {
  if (!existsSync(shotsDir)) throw new Error('screenshots/ is missing');
  const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > CAPS.screenshots.max) {
    throw new Error(`screenshots/ holds ${shots.length} images, need 3 to 4`);
  }
  for (const name of shots) {
    const size = statSync(join(shotsDir, name)).size;
    if (size > CAPS.screenshots.max_bytes) {
      throw new Error(`screenshots/${name} is ${size} bytes, over the 256 KiB cap`);
    }
  }
}

function handIn() {
  const appDir = join(here, 'app');
  const shotsDir = join(here, 'screenshots');
  checkApp(appDir);
  checkScreenshots(shotsDir);

  mkdirSync(out, { recursive: true });
  cpSync(appDir, join(out, 'app'), { recursive: true });
  mkdirSync(join(out, 'screenshots'), { recursive: true });
  cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

  const dossier = buildDossier(out, CAPS);
  writeFileSync(join(out, 'dossier.json'), dossier);

  // Report what was handed in, so a run's log shows the entry's shape.
  const app = countAppFiles(join(out, 'app'));
  const shots = readdirSync(join(out, 'screenshots')).filter((n) => !n.startsWith('.'));
  console.log(
    `NusaData handed in to ${out}: app/ ${app.files} files, ${app.bytes} bytes; ` +
      `${shots.length} screenshots; dossier.json ${dossier.length} bytes`,
  );
}

handIn();
