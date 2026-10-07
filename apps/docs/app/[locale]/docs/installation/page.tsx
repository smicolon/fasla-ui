import { getTranslations, setRequestLocale } from "next-intl/server"
import { metadataForRoute } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"
import { PackageManagerTabs } from "@/components/package-manager-tabs"
import { shadcnAdd } from "@/lib/package-managers"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return metadataForRoute("/docs/installation/", locale as Locale)
}

export default async function InstallationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const t = await getTranslations("docs")
  const i = await getTranslations("docs.installation")

  // Commands, file names and code stay Latin in both locales; the sentence
  // around them is the locale's.
  const rich = { code: (chunks: React.ReactNode) => <code>{chunks}</code> }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{i("title")}</h1>
        <p className="text-xl text-muted-foreground">{i("lead")}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("requirementsTitle")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>{i("requirements.react")}</li>
          <li>{i("requirements.tailwind")}</li>
          <li>{i("requirements.typescript")}</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("cliTitle")}</h2>
        <p className="text-muted-foreground">{i.rich("cliBody", rich)}</p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{i.rich("cliInit", rich)}</p>
            <pre className="whitespace-pre-wrap break-words rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli init</code>
            </pre>
          </div>

          <div>
            {/* init installs these itself; this is the fallback when that fails. */}
            <p className="text-sm text-muted-foreground mb-2">{i.rich("cliDepsFallback", rich)}</p>
            <PackageManagerTabs packages="clsx tailwind-merge" />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i("cliAdd")}</p>
            <pre className="whitespace-pre-wrap break-words rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli add button</code>
            </pre>
            <p className="text-sm font-medium mt-4 mb-2">{t("addSeveral")}</p>
            <pre className="whitespace-pre-wrap break-words rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli add card input badge</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i("cliList")}</p>
            <pre className="whitespace-pre-wrap break-words rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli list</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("themeTitle")}</h2>
        <p className="text-muted-foreground">{i.rich("themeBody", rich)}</p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{i.rich("themeFasla", rich)}</p>
            <PackageManagerTabs run={shadcnAdd("theme", "font-geist")} />
            <p className="text-sm text-muted-foreground mt-2">{i.rich("themeNext14", rich)}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i.rich("themeBrand", rich)}</p>
            <PackageManagerTabs run={shadcnAdd("theme-base")} />
          </div>

          {/* shadcn's own question, which defaults to No and stops the install. */}
          <p className="text-sm text-muted-foreground">{i.rich("themeConfirm", rich)}</p>

          <p className="text-sm text-muted-foreground">{i.rich("themeArabicFont", rich)}</p>
        </div>

        {/* Said plainly, before anyone adds a component to a shadcn project. */}
        <p className="rounded-lg border border-border p-4 text-sm">{i.rich("themeReplaces", rich)}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("manualTitle")}</h2>
        <p className="text-muted-foreground">{i("manualBody")}</p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{i("manualDeps")}</p>
            <PackageManagerTabs packages="class-variance-authority clsx tailwind-merge framer-motion" />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i.rich("manualCn", rich)}</p>
            <pre className="overflow-x-auto rounded-lg bg-terminal p-4 text-sm">
              <code className="text-gray-300">{`// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i("manualCopy")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
