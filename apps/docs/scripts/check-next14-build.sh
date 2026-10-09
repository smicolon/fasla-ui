#!/usr/bin/env bash
#
# Proves every registry item builds in the oldest stack Fasla supports: a fresh
# Next.js 14 app on React 18 and Tailwind 3, with Next's own ESLint config. It
# installs every item with the CLI in @smicolon/fasla-ui, `init` then `add
# --all`, imports every installed file from a page so the bundler compiles it,
# then runs `tsc` and `next build` with lint on. Any step failing fails the run.
#
# Next 14 matters because its tsconfig sets no target, so TypeScript checks
# for ES5, and because `next build` stops on ESLint errors — two things the
# Next 16 check (check-shadcn-install.sh) never sees. That check installs with
# the shadcn CLI; this one can't, because `shadcn@latest init` writes Tailwind
# 4 CSS and a Geist import that Next 14's next/font/google doesn't have, so it
# breaks a Next 14 app before any Fasla item is added.
#
# The CLI and the registry are both built from this checkout, and the registry
# is served locally, so a PR is tested on its own items. Needs bun (for the CLI
# build), node 22 and python3.
#
#   bash apps/docs/scripts/check-next14-build.sh
#
# WORK_DIR keeps the app for a look afterwards.

set -euo pipefail

PORT="${PORT:-8766}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
DOCS="$ROOT/apps/docs"
BASE="http://127.0.0.1:$PORT/r"
KEEP_WORK_DIR="${WORK_DIR:+1}"
WORK_DIR="${WORK_DIR:-$(mktemp -d)}"
APP="$WORK_DIR/app"

cleanup() {
  [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null || true
  [ -z "$KEEP_WORK_DIR" ] && rm -rf "$WORK_DIR"
  return 0
}
trap cleanup EXIT

fasla() { (cd "$APP" && FASLA_UI_REGISTRY_URL="$BASE" node "$ROOT/packages/fasla-ui/dist/cli/index.js" "$@"); }

# The installed major version of a package in the app, or "none".
major() {
  node -e '
    try { console.log(require(require.resolve(process.argv[1] + "/package.json", { paths: [process.argv[2]] })).version.split(".")[0]) }
    catch { console.log("none") }
  ' "$1" "$APP"
}

echo "::group::Build the CLI"
(cd "$ROOT/packages/fasla-ui" && bun run build)
echo "::endgroup::"

echo "::group::Build the registry against $BASE"
FASLA_REGISTRY_URL="$BASE" node "$DOCS/scripts/build-registry.mjs"
echo "::endgroup::"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$DOCS/public" >/dev/null 2>&1 &
SERVER_PID=$!
for _ in $(seq 1 50); do
  curl -sf "$BASE/registry.json" >/dev/null && break
  sleep 0.2
done
curl -sf "$BASE/registry.json" >/dev/null || { echo "::error::Registry server did not start on $BASE"; exit 1; }

echo "::group::Create a Next.js 14 app"
(cd "$WORK_DIR" && CI=1 npx -y "create-next-app@14" app \
  --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm)
echo "::endgroup::"

echo "::group::fasla-ui init"
fasla init --yes
echo "::endgroup::"

COUNT=$(node -e 'console.log(require(process.argv[1]).items.length)' "$DOCS/public/r/registry.json")

echo "::group::fasla-ui add --all ($COUNT items)"
fasla add --all --yes
echo "::endgroup::"

MISSING=()
for target in $(node -e '
  for (const item of require(process.argv[1]).items) for (const f of item.files) console.log(f.target)
' "$ROOT/packages/fasla-ui/registry.json"); do
  [ -f "$APP/$target" ] || MISSING+=("$target")
done
if [ ${#MISSING[@]} -gt 0 ]; then
  echo "::error::Added, but not written: ${MISSING[*]}"
  exit 1
fi

# add prints the packages the items import rather than installing them; install
# the same set, as a developer following its output would.
DEPS=$(node -e '
  const deps = new Set()
  for (const item of require(process.argv[1]).items) for (const d of item.dependencies ?? []) deps.add(d)
  console.log([...deps].sort().join(" "))
' "$DOCS/public/r/registry.json")
echo "::group::npm install $DEPS"
(cd "$APP" && npm install $DEPS)
echo "::endgroup::"

# The stack under test, after every item's dependencies went in: an item that
# pulls in a newer React, Next or Tailwind would otherwise pass on the wrong one.
STACK="next=$(major next) react=$(major react) react-dom=$(major react-dom) tailwindcss=$(major tailwindcss)"
echo "Stack: $STACK"
if [ "$STACK" != "next=14 react=18 react-dom=18 tailwindcss=3" ]; then
  echo "::error::Expected Next 14, React 18 and Tailwind 3, got $STACK"
  exit 1
fi

# A page that imports every file the items wrote, so `next build` compiles
# each one rather than only linting and type-checking it.
TARGETS=$(node -e '
  for (const item of require(process.argv[1]).items)
    for (const f of item.files) if (/\.tsx?$/.test(f.target)) console.log(f.target)
' "$ROOT/packages/fasla-ui/registry.json" | sort -u)
mkdir -p "$APP/app/registry"
node -e '
  const targets = process.argv[1].split("\n").filter(Boolean)
  const imports = targets.map((t, i) => `import * as m${i} from "@/${t.replace(/\.tsx?$/, "")}"`)
  const names = targets.map((t, i) => `  ["${t}", Object.keys(m${i})],`)
  process.stdout.write([
    "\"use client\"",
    "",
    ...imports,
    "",
    "const modules: [string, string[]][] = [",
    ...names,
    "]",
    "",
    "export default function RegistryPage() {",
    "  return (",
    "    <ul>",
    "      {modules.map(([file, exports]) => (",
    "        <li key={file}>{file}: {exports.join(\", \")}</li>",
    "      ))}",
    "    </ul>",
    "  )",
    "}",
    "",
  ].join("\n"))
' "$TARGETS" >"$APP/app/registry/page.tsx"

echo "::group::tsc --noEmit"
(cd "$APP" && npx tsc --noEmit)
echo "::endgroup::"

# next build lints too, but skips it without saying so if it finds no config.
# Running it first, on its own, makes a lint failure the first thing in the log.
echo "::group::next lint"
(cd "$APP" && npx next lint)
echo "::endgroup::"

echo "::group::next build"
(cd "$APP" && npx next build) 2>&1 | tee "$WORK_DIR/build.log"
echo "::endgroup::"
if ! grep -q "Linting" "$WORK_DIR/build.log"; then
  echo "::error::next build did not lint"
  exit 1
fi

echo "All $COUNT items build on Next.js 14, React 18 and Tailwind 3 with lint on."
