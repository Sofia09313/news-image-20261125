// news-image-20261125 — "Sum up 25 November's world news in one image"
//
// The entry is a single self-contained front page, entry.png, sitting next to
// this file. The program's whole job is to deliver those exact bytes to the
// grader's output directory, unchanged, so the judged image is the one in the
// repository. It runs offline with the Node 22 standard library only and is
// fully deterministic: same input file, same output bytes, every run.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const MAX_BYTES = 1024 * 1024; // the gate accepts at most 1 MiB

const sourcePath = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(sourcePath);

// Fail loudly rather than ship a broken entry: the file must be a real PNG
// and small enough for the gate before we copy anything.
const looksLikePng = PNG_SIGNATURE.every((byte, i) => bytes[i] === byte);
if (!looksLikePng) {
  throw new Error('entry.png is missing its PNG signature — refusing to copy');
}
if (bytes.byteLength > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.byteLength} bytes, over the 1 MiB gate limit`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
copyFileSync(sourcePath, join(outputDir, 'entry.png'));

console.log(`entry.png delivered: ${bytes.byteLength} bytes -> ${join(outputDir, 'entry.png')}`);
