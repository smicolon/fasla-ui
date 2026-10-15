import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { blockRoutes, routeText } from "@/lib/seo-routes"
import { INVERSE_CSS } from "@/lib/inverse-tokens"
import type { Locale } from "@/i18n/routing"

/** The Blocks section's first page: what a block is, and how to install one. */
export default async function BlocksIntroductionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const b = await getTranslations("docs.blocksIntro")

  const rich = { code: (chunks: React.ReactNode) => <code>{chunks}</code> }
  const p = (path: string) => `/${locale}${path}`

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{b("title")}</h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("whatTitle")}</h2>
        <p className="text-muted-foreground">{b.rich("whatBody", rich)}</p>
        <ul className="list-disc space-y-2 ps-5 text-muted-foreground">
          <li>{b.rich("whatResponsive", rich)}</li>
          <li>{b.rich("whatDirection", rich)}</li>
          <li>{b.rich("whatContent", rich)}</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("installTitle")}</h2>
        <p className="text-muted-foreground">{b.rich("installBody", rich)}</p>
        <InstallCommand name="faq-classic-centered" />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("imagesTitle")}</h2>
        <p className="text-muted-foreground">{b.rich("imagesBody", rich)}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("inverseTitle")}</h2>
        <p className="text-muted-foreground">{b.rich("inverseBody", rich)}</p>
        <p className="text-muted-foreground">{b.rich("inverseManual", rich)}</p>
        <CodeBlock language="css">{INVERSE_CSS}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          {b.rich("inverseMore", {
            ...rich,
            link: (chunks) => (
              <Link href={p("/docs/installation/#inverse-tokens")} className="font-medium text-foreground underline underline-offset-4">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("familiesTitle")}</h2>
        <ul className="space-y-2">
          {blockRoutes.map((route) => (
            <li key={route.path}>
              <Link href={p(route.path)} className="font-medium underline underline-offset-4">
                {routeText(route, locale as Locale).h1}
              </Link>
              <span className="text-muted-foreground"> {routeText(route, locale as Locale).description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
