#!/usr/bin/env bash
#
# Proves the registry installs with the official shadcn CLI, the way a
# developer would: a fresh Next.js app, `shadcn init`, the registry added as
# the @fasla namespace, every item added, then `tsc`. Any step failing fails
# the run.
#
# It installs the registry built from this checkout, served locally, not the
# one deployed at ui.smicolon.com — so a PR is tested on its own items, and
# FASLA_REGISTRY_URL makes every dependency between items point at that server
# too.
#
# Each item is first resolved on its own with --dry-run, so an item whose
# dependency is missing can't pass just because another item in the same
# command brought that dependency along.
#
#   bash apps/docs/scripts/check-shadcn-install.sh
#
# SHADCN_VERSION and NEXT_VERSION pick the CLI versions; WORK_DIR keeps the app
# for a look afterwards.

set -euo pipefail

SHADCN_VERSION="${SHADCN_VERSION:-latest}"
NEXT_VERSION="${NEXT_VERSION:-16}"
PORT="${PORT:-8765}"

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

shadcn() { (cd "$APP" && CI=1 npx -y "shadcn@$SHADCN_VERSION" "$@"); }

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

echo "::group::Create a Next.js app (create-next-app@$NEXT_VERSION)"
(cd "$WORK_DIR" && CI=1 npx -y "create-next-app@$NEXT_VERSION" app \
  --ts --tailwind --app --no-src-dir --no-eslint --import-alias "@/*" --use-npm --yes)
echo "::endgroup::"

echo "::group::shadcn@$SHADCN_VERSION init"
shadcn init --defaults --no-monorepo
node -e '
  const fs = require("fs")
  const file = process.argv[1]
  const config = JSON.parse(fs.readFileSync(file, "utf8"))
  config.registries = { ...config.registries, "@fasla": process.argv[2] }
  fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n")
' "$APP/components.json" "$BASE/{name}.json"
echo "::endgroup::"

# The theme, each layer first, as a developer installs it. The base layer must
# add Fasla's classes without touching the project's own colours; the colours
# layer must then replace them with Fasla's.
CSS="$APP/app/globals.css"
BRAND="#ff0066"
mkdir -p "$APP/app/theme-check"
cat > "$APP/app/theme-check/page.tsx" <<'PAGE'
export default function ThemeCheck() {
  return (
    <main className="bg-success text-success-foreground">
      <p className="bg-success/10 text-xxs">.</p>
      <p className="bg-gradient-to-r from-soft-primary to-soft-primary text-info">.</p>
    </main>
  )
}
PAGE

# Compiles the app's stylesheet and fails for any class that produced no rule.
# Tailwind groups selectors, so a class may be followed by "," as well as "{".
check_classes() {
  local out="$WORK_DIR/$1.css"
  (cd "$APP" && npx -y @tailwindcss/cli@4 -i app/globals.css -o "$out" >/dev/null 2>&1)
  local missing=()
  for cls in 'bg-success' 'bg-success\\/10' 'text-xxs' 'from-soft-primary' 'text-success-foreground' 'text-info'; do
    grep -qE "\\.${cls}[,{ ]" "$out" || missing+=("$cls")
  done
  if [ ${#missing[@]} -gt 0 ]; then
    echo "::error::After $1, these classes produce no CSS: ${missing[*]}"
    exit 1
  fi
  echo "ok    every Fasla class has a rule after $1"
}

echo "::group::Theme: the base layer keeps the project's own colours"
# Give the app its own primary, the first --primary in the file (:root's).
node -e '
  const fs = require("fs")
  const [file, brand] = process.argv.slice(1)
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/--primary:[^;]+;/, `--primary: ${brand};`))
' "$CSS" "$BRAND"
shadcn add @fasla/theme-base --yes
if ! grep -q -- "--primary: $BRAND;" "$CSS"; then
  echo "::error::@fasla/theme-base changed the project's --primary"
  grep -n -- "--primary:" "$CSS"
  exit 1
fi
echo "ok    --primary is still $BRAND"
check_classes theme-base
echo "::endgroup::"

echo "::group::Theme: the colours layer"
FASLA_PRIMARY=$(node -e 'console.log(require(process.argv[1]).tokens.primary.light)' "$ROOT/design/tokens/mode.json")
shadcn add @fasla/theme @fasla/font-geist --yes
if ! grep -q -- "--primary: $FASLA_PRIMARY;" "$CSS"; then
  echo "::error::@fasla/theme did not set --primary to Fasla's $FASLA_PRIMARY"
  exit 1
fi
echo "ok    --primary is Fasla's $FASLA_PRIMARY"
check_classes theme
echo "::endgroup::"

NAMES=$(node -e 'console.log(require(process.argv[1]).items.map((i) => i.name).join(" "))' "$DOCS/public/r/registry.json")
COUNT=$(echo "$NAMES" | wc -w | tr -d ' ')

echo "::group::Resolve each of the $COUNT items on its own"
FAILED=()
for name in $NAMES; do
  if shadcn add "@fasla/$name" --dry-run --yes >"$WORK_DIR/dry-run.log" 2>&1; then
    echo "ok    @fasla/$name"
  else
    echo "FAIL  @fasla/$name"
    sed 's/^/      /' "$WORK_DIR/dry-run.log"
    FAILED+=("$name")
  fi
done
echo "::endgroup::"
if [ ${#FAILED[@]} -gt 0 ]; then
  echo "::error::shadcn could not resolve: ${FAILED[*]}"
  exit 1
fi

# --overwrite because Fasla's button, card, input and so on replace the
# shadcn ones `init` just wrote, at the same paths.
echo "::group::Add every item"
ARGS=()
for name in $NAMES; do ARGS+=("@fasla/$name"); done
shadcn add "${ARGS[@]}" --overwrite --yes
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

if grep -rlE 'from "\.[^"]*src/lib/utils"' "$APP/components" >/dev/null; then
  echo "::error::A component still imports cn from this repository's path:"
  grep -rlE 'from "\.[^"]*src/lib/utils"' "$APP/components"
  exit 1
fi

echo "::group::tsc --noEmit"
(cd "$APP" && npx tsc --noEmit)
echo "::endgroup::"

echo "All $COUNT items installed with shadcn@$SHADCN_VERSION and type-check."
