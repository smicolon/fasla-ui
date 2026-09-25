import { getTranslations, setRequestLocale } from "next-intl/server"
import { InstallCommand } from "@/components/install-command"
export default async function StatsCardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const t = await getTranslations("docs.sections")
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Stats Card</h1>
        <p className="text-xl text-muted-foreground">
          Display key metrics with trends and icons.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="stats-card" />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("features")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Title and value display</li>
          <li>Trend indicator (up/down with percentage)</li>
          <li>Optional icon</li>
          <li>Description text</li>
          <li>Loading state</li>
          <li>StatsGrid for layout</li>
        </ul>
      </div>
    </div>
  )
}
