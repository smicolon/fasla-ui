import { createRequire } from "module"

/**
 * The version in this package's package.json. Read at run time, not written
 * into the source, so `--version` can't fall behind a release again: it said
 * 0.1.0 through 0.4.0. From src/ in tests and from dist/ when published,
 * package.json is one folder up either way.
 */
export function cliVersion(): string {
  return (createRequire(import.meta.url)("../package.json") as { version: string }).version
}
