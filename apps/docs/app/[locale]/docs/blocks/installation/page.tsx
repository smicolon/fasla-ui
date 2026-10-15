import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { inlineCode } from "@/components/inline-code"
import { CodeBlock } from "@/components/component-preview"
import { PackageManagerTabs } from "@/components/package-manager-tabs"
import { shadcnAdd } from "@/lib/package-managers"
import { INVERSE_CSS } from "@/lib/inverse-tokens"

/** Installing a block: the one-time setup, the command, and the inverse CSS. */
export default async function BlocksInstallationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const b = await getTranslations("docs.blocksInstall")

  const rich = inlineCode
  const docLink = (path: string, chunks: React.ReactNode) => (
    <Link href={`/${locale}${path}`} className="font-medium text-foreground underline underline-offset-4">
      {chunks}
    </Link>
  )

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{b("title")}</h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b.rich("initTitle", rich)}</h2>
        <p className="text-muted-foreground">{b.rich("initBody", rich)}</p>
        <CodeBlock language="bash">npx @smicolon/fasla-ui@latest init</CodeBlock>
        <p className="text-sm text-muted-foreground">{b.rich("initMore", { ...rich, link: (chunks) => docLink("/docs/installation/", chunks) })}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("addTitle")}</h2>
        <p className="text-muted-foreground">{b.rich("addBody", rich)}</p>
        <CodeBlock language="bash">npx @smicolon/fasla-ui@latest add faq-classic-centered</CodeBlock>
        <p className="text-muted-foreground">{b.rich("addShadcn", rich)}</p>
        <PackageManagerTabs run={shadcnAdd("faq-classic-centered")} />
      </section>

      <section className="space-y-4">
        <h2 id="inverse-css" className="scroll-mt-24 text-2xl font-semibold">
          {b("inverseTitle")}
        </h2>
        <p className="text-muted-foreground">{b.rich("inverseBody", rich)}</p>
        <CodeBlock language="css">{INVERSE_CSS}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          {b.rich("inverseMore", { ...rich, link: (chunks) => docLink("/docs/installation/#inverse-tokens", chunks) })}
        </p>
      </section>
    </div>
  )
}
