# Localisation

The docs site ships in English and Arabic. Every page exists once per locale.

```
/en/...        English, ltr
/ar/...         العربية, rtl
/              redirects to /en
```

`apps/docs` uses [next-intl](https://next-intl.dev). There is no middleware —
the site is a static export (`output: "export"`), so each locale is a real
prerendered directory rather than a runtime rewrite.

---

## Where things live

| Path | What it is |
| --- | --- |
| `apps/docs/messages/en.json` | English strings. The source of truth. |
| `apps/docs/messages/ar.json` | Arabic strings. Same keys, always. |
| `apps/docs/i18n/routing.ts` | The locale list, default, and text direction. |
| `apps/docs/i18n/request.ts` | Loads the right message file per request. |
| `apps/docs/app/[locale]/` | Every route. The segment is the locale. |
| `apps/docs/components/locale-switcher.tsx` | The language toggle in the header. |

---

## Adding a string

**1. Add the key to `messages/en.json`**, inside the namespace that matches
where it is used.

```jsonc
{
  "home": {
    "hero": {
      "badge": "New in v1.0"
    }
  }
}
```

Namespaces mirror the page or component, not the visual position:
`nav`, `home`, `docs`, `footer`, `meta`. Nest by section (`home.registry.title`),
never by sentence. Key names describe the **role**, not the text — `readDocs`,
not `readTheDocsButton`.

**2. Add the same key to `messages/ar.json`.** A key missing from one locale
renders as the raw key path to the reader. A test fails the build if the two
files drift:

```
keeps every message key present in both locales
```

**3. Use it.**

In a **client** component:

```tsx
"use client"
import { useTranslations } from "next-intl"

export function Badge() {
  const t = useTranslations("home.hero")
  return <span>{t("badge")}</span>
}
```

In an **async server** component — and every page under `app/[locale]` that
reads params is one:

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)          // required, see below
  const t = await getTranslations("home.hero")
  return <span>{t("badge")}</span>
}
```

> `useTranslations` throws inside an async component. Use `getTranslations` and
> await it.

> `setRequestLocale(locale)` is **not optional**. Without it next-intl falls
> back to reading `headers()`, which drops the route out of the static export
> and fails the build with
> *"couldn't be rendered statically because it used `headers`"*.

---

## Adding a page

Create it under `app/[locale]/`, never under `app/`.

```
apps/docs/app/[locale]/docs/components/my-component/
  page.tsx
  layout.tsx
```

The layout supplies per-locale metadata:

```tsx
import { metadataForRoute } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return metadataForRoute("/docs/components/my-component/", locale as Locale)
}
```

Then register the route in `apps/docs/lib/seo-routes.ts`. That catalogue drives
the sitemap, the canonical URL and the hreflang alternates for **both** locales
at once — you do not write them per language.

Tests will fail if a route exists on disk but not in the catalogue.

---

## Adding a locale

1. Add the code to `locales` in `i18n/routing.ts`.
2. Add its direction to `localeDirection`.
3. Create `messages/<code>.json` with every key from `en.json`.
4. If it needs a different typeface, load it in `app/[locale]/layout.tsx` the
   way Cairo is loaded for Arabic.

Nothing else. `generateStaticParams`, the sitemap, hreflang and the switcher all
read from `locales`.

---

## Writing Arabic

These come from Brand Identity V2.5, sections 04 and 15. They are not style
preferences — a review will reject copy that breaks them.

**Write it, do not translate it.** Machine output reads as machine output.
Modern Standard Arabic, short sentences.

**Technical terms stay in Latin script**, inside the Arabic sentence:

```
✅  مبنيّة على مكوّنات shadcn/ui الأساسية
❌  مبنية على مكونات شادسي إن يو الأساسية
```

That covers `React`, `npm`, `MIT`, `TypeScript`, `CSS`, `Tailwind`, `AG-UI`,
`cva`, and every component name (`Button`, `Input`, `Card`…).

**Numerals are always Western.** `0 1 2 3 4 5 6 7 8 9`, never `٠١٢٣`. Versions,
counts, prices and dates included.

**The product name in Arabic is فاصلة.** Never `Fasla` in Latin letters inside
an Arabic sentence, and never transliterate it as a foreign word.

**Never letter-space Arabic.** Tracking is `0`. There is no all-caps in Arabic —
use weight. Italic is never used. `globals.css` enforces all three under
`[dir="rtl"]`, but do not fight it in a component.

**Line height is 1.7 minimum, 1.8 preferred** for body copy.

### Plurals

Arabic has six plural categories. A bare `{count} مكوّناً` only agrees for 11–99
and silently reads wrong everywhere else. Use ICU:

```jsonc
"eyebrow": "{count, plural, zero {لا مكوّنات} one {مكوّن واحد} two {مكوّنان} few {# مكوّنات} many {# مكوّناً} other {# مكوّن}} · نواة برخصة MIT"
```

English needs `one` and `other` only, but write the full set for Arabic.

---

## What mirrors in RTL, and what does not

Direction changes where things sit. It does not change how anything is drawn.

**Mirrors** — layout, reading order, logo position in the lockup, sidebar side,
text alignment, list indents, drawer origin, and chevrons that indicate
direction of travel (use `rtl:-scale-x-100`).

**Never mirrors** — the Fasla mark and its comma, the 45° cut in either
wordmark, any brand logo, icons of real objects (clock, camera), media transport
controls, charts with a time axis, code blocks, terminals, anything monospace,
and numerals.

The header swaps `fasla-lockup-ltr.svg` for `fasla-lockup-rtl.svg` — it does not
flip the LTR file. The RTL lockup is a different drawing, not a mirror, and its
minimum width is 100 px against the LTR lockup's 90 px.

`globals.css` already forces `direction: ltr` on `code`, `pre`, `kbd` and
`.font-mono` inside an RTL page.

---

## Checks

```bash
bun run test        # key parity, sitemap, canonical, one H1 per route
bun run build       # fails if a route cannot prerender in both locales
```

After building, both trees should be present and equal in size:

```bash
ls apps/docs/out/en apps/docs/out/ar
```
