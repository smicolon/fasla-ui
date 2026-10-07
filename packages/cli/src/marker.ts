/**
 * Every Fasla registry file starts with this line (see the docs app's
 * build-registry.mjs). `add` reads it to tell a Fasla file from another
 * library's file with the same name — shadcn's button.tsx, say — and asks
 * before replacing that one.
 */
export const FASLA_MARKER = /^\/\/ From Fasla UI \(@fasla\//

/**
 * Whether a file already in the project is a Fasla file: it has the marker,
 * or it is exactly `incoming` without it — a Fasla file installed before the
 * marker existed.
 */
export function isFaslaFile(existing: string, incoming: string): boolean {
  if (FASLA_MARKER.test(existing)) return true
  const withoutMarker = FASLA_MARKER.test(incoming) ? incoming.slice(incoming.indexOf("\n") + 1) : incoming
  return existing === withoutMarker
}
