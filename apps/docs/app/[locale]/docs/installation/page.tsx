import { getTranslations, setRequestLocale } from "next-intl/server"
import { metadataForRoute } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"

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

  // `init` writes lib/utils.ts, which imports these two, but installs
  // nothing; without them a fresh project fails tsc and the build.
  const cnDeps = [
    "npm install clsx tailwind-merge",
    "pnpm add clsx tailwind-merge",
    "yarn add clsx tailwind-merge",
    "bun add clsx tailwind-merge",
  ]

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
            <pre className="overflow-x-auto rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli init</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i.rich("cliDeps", rich)}</p>
            <div className="space-y-2">
              {cnDeps.map((command) => (
                <pre key={command} className="overflow-x-auto rounded-lg bg-terminal p-4">
                  <code className="text-green-400">{command}</code>
                </pre>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i("cliAdd")}</p>
            <pre className="overflow-x-auto rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli add button</code>
            </pre>
            <p className="text-sm font-medium mt-4 mb-2">{t("addSeveral")}</p>
            <pre className="overflow-x-auto rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli add card input badge</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{i("cliList")}</p>
            <pre className="overflow-x-auto rounded-lg bg-terminal p-4">
              <code className="text-green-400">npx @smicolon/cli list</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("manualTitle")}</h2>
        <p className="text-muted-foreground">{i("manualBody")}</p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{i("manualDeps")}</p>
            <pre className="overflow-x-auto rounded-lg bg-terminal p-4">
              <code className="text-green-400">npm install class-variance-authority clsx tailwind-merge framer-motion</code>
            </pre>
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

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("tailwindTitle")}</h2>
        <p className="text-muted-foreground">{i.rich("tailwindBody", rich)}</p>
        <pre className="overflow-x-auto rounded-lg bg-terminal p-4">
          <code className="text-green-400">npm install @smicolon/fasla-ui</code>
        </pre>
        <p className="text-muted-foreground">{i.rich("tailwindConfig", rich)}</p>
        <pre className="overflow-x-auto rounded-lg bg-terminal p-4 text-sm">
          <code className="text-gray-300">{`// tailwind.config.ts
import type { Config } from "tailwindcss"
import { tailwindSemanticColors } from "@smicolon/fasla-ui/tokens"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: tailwindSemanticColors,
    },
  },
}

export default config`}</code>
        </pre>
        <p className="text-muted-foreground text-sm">{i.rich("tailwindNote", rich)}</p>
      </div>
    </div>
  )
}
