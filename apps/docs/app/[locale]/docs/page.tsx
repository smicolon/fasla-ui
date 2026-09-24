import Link from "next/link"
import { componentRouteGroups } from "@/lib/seo-routes"
import { registryCounts } from "@/lib/registry"
import { getTranslations, setRequestLocale } from "next-intl/server"

/** Category keys as they appear in seo-routes, mapped to message keys. */
const categoryKeys: Record<string, string> = {
  "UI Primitives": "primitives",
  Blocks: "blocks",
  Effects: "effects",
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)

  const t = await getTranslations("docs.landing")
  const tSidebar = await getTranslations("docs.sidebar")

  // Every catalogue path is locale-agnostic, so the prefix is added here.
  const p = (path: string) => `/${locale}${path}`.replace(/\/{2,}/g, "/")

  // Bold runs come from the message, so a translator controls where the
  // emphasis falls rather than the markup dictating it.
  const rich = { strong: (chunks: React.ReactNode) => <strong className="text-foreground">{chunks}</strong> }

  const featureKeys = [
    "components",
    "accessible",
    "animated",
    "typescript",
    "darkMode",
    "customizable",
  ] as const

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{t("introTitle")}</h1>
        <p className="text-xl leading-relaxed text-muted-foreground">{t("introBody")}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("featuresTitle")}</h2>
        <ul className="grid gap-3 text-muted-foreground">
          {featureKeys.map((key) => (
            <li key={key} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fasla-red/10 text-xs text-fasla-red"
              >
                ✓
              </span>
              <span>
                {key === "components"
                  ? t.rich(`features.${key}`, { ...rich, count: registryCounts.total })
                  : t.rich(`features.${key}`, rich)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("categoriesTitle")}</h2>
        {componentRouteGroups.map((group) => (
          <section key={group.category} className="space-y-3">
            <h3 className="font-semibold">
              {categoryKeys[group.category]
                ? tSidebar(categoryKeys[group.category])
                : group.category}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.routes.map((route) => (
                <Link
                  key={route.path}
                  href={p(route.path)}
                  className="group rounded-lg border border-border/50 p-4 transition-colors hover:border-fasla-red/50 hover:bg-accent/50"
                >
                  {/* Component names are technical terms and stay Latin (§15). */}
                  <span className="font-semibold group-hover:text-fasla-red">{route.h1}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {route.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="rounded-lg border border-fasla-red/20 bg-fasla-red/5 p-6">
        <h2 className="text-2xl font-semibold">{t("getStartedTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("getStartedBody")}</p>
        <Link
          href={p("/docs/installation/")}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fasla-red hover:underline"
        >
          {tSidebar("installation")}
          {/* Indicates direction of travel, so it mirrors in RTL (§15). */}
          <svg
            className="h-4 w-4 rtl:-scale-x-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
