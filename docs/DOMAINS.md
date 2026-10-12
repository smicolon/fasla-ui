# Domains

Fasla is served from one Cloudflare Pages project under two hostnames.

| Host | What it does |
| --- | --- |
| `fasla.smicolon.com` | The canonical site: docs, landing page, Storybook at `/components/`, and the registry at `/r/*`. |
| `ui.smicolon.com` | The old host. It serves `/r/*` itself, with no redirect, and 301s everything else to the same path on `fasla.smicolon.com`. |

Both hostnames stay attached to the Pages project as custom domains. Removing
`ui.smicolon.com` from it would break the registry for everyone still pointed
there.

---

## Why `/r/*` stays on ui.smicolon.com

Everything published before the move fetches the registry from
`ui.smicolon.com/r`: the `@smicolon/cli` and `@smicolon/fasla-ui` CLIs on npm,
and every developer's `components.json` (`"@fasla": "https://ui.smicolon.com/r/{name}.json"`).
Those can't be updated, so `/r/*` keeps answering on that host for good, with
no redirect in between.

## Why the registry's dependency links stay on ui.smicolon.com

Registry items depend on each other by full URL: `avatar` lists
`https://ui.smicolon.com/r/status-indicator.json`, and the theme chains
`theme` → `theme-base` → `font-cairo` the same way. The shadcn CLI follows any
URL, but the published Fasla CLIs (`@smicolon/cli` 0.4.0–0.5.2 and
`@smicolon/fasla-ui` 0.5.0–0.5.1) only treat a dependency as Fasla's when it is
under `https://ui.smicolon.com/r`. Point one at `fasla.smicolon.com` and those
CLIs skip it: `fasla-ui add avatar` writes an `avatar.tsx` whose
`./status-indicator` import doesn't resolve.

So `DEPENDENCY_REGISTRY_URL` in `apps/docs/scripts/build-registry.mjs` stays
`https://ui.smicolon.com/r`, and `apps/docs/tests/registry-build.test.mjs`
fails if any built item's `registryDependencies` link points at
`fasla.smicolon.com`. Everything else in the registry, the file markers and
`homepage` included, says `fasla.smicolon.com`. The current CLI accepts both
hosts, so it resolves these links either way.

Moving the links is safe only once no one runs a CLI older than the one that
accepts both hosts, which in practice means never.

---

## The redirect rule

Cloudflare Pages `_redirects` can't match on hostname, so the redirect is a
Cloudflare **Single Redirect** rule on the `smicolon.com` zone, not something
in this repo. It runs at the edge before Pages, so it costs no Worker calls.

Dashboard: **smicolon.com → Rules → Redirect Rules → Create rule**.

| Field | Value |
| --- | --- |
| Rule name | `ui.smicolon.com → fasla.smicolon.com (except /r)` |
| When incoming requests match | Custom filter expression, below |
| Then | Dynamic redirect |
| Expression | `concat("https://fasla.smicolon.com", http.request.uri.path)` |
| Status code | `301` |
| Preserve query string | On |

Filter expression:

```
(http.host eq "ui.smicolon.com" and not starts_with(http.request.uri.path, "/r/") and http.request.uri.path ne "/r")
```

A 301 is cached by browsers with no expiry, so a mistake in the rule sticks in
visitors' browsers. To try it first, create it with `302`, check it, then edit
it to `301`.

### Checking it

```bash
# The registry still answers on the old host: 200, no Location.
curl -sI https://ui.smicolon.com/r/registry.json
curl -sI https://ui.smicolon.com/r/button.json

# Everything else moves, path and query string kept.
curl -sI "https://ui.smicolon.com/docs/installation/?ref=x"
#   location: https://fasla.smicolon.com/docs/installation/?ref=x
curl -sI https://ui.smicolon.com/
#   location: https://fasla.smicolon.com/
curl -sI https://ui.smicolon.com/robots.txt
#   location: https://fasla.smicolon.com/robots.txt
```
