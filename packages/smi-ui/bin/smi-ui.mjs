#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function usage() {
  console.log(`smi-ui (scaffold)
Usage:
  smi-ui add <registry-path> --to <target-dir>

Example:
  smi-ui add blocks/app-shell --to ../client/src/components/blocks
`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
  usage();
  process.exit(0);
}

const cmd = args[0];
if (cmd !== "add") {
  usage();
  process.exit(1);
}

const item = args[1];
const toIdx = args.findIndex((a) => a === "--to");
const targetDir = toIdx >= 0 ? args[toIdx + 1] : null;
if (!item || !targetDir) {
  usage();
  process.exit(1);
}

const registryRoot = path.resolve(process.cwd(), "packages/smi-ui/registry");
const srcDir = path.join(registryRoot, item);
if (!fs.existsSync(srcDir)) {
  console.error(`Registry path not found: ${srcDir}`);
  process.exit(1);
}

const destDir = path.resolve(process.cwd(), targetDir, path.basename(item));
copyDir(srcDir, destDir);
console.log(`Added ${item} -> ${destDir}`);
