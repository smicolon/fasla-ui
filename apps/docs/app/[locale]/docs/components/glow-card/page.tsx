import { getTranslations, setRequestLocale } from "next-intl/server"
export default async function GlowCardPage({
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
        <h1 className="text-4xl font-bold tracking-tight">Glow Card</h1>
        <p className="text-xl text-muted-foreground">
          Cards with interactive glow effects that follow the mouse cursor.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/fasla-ui add glow-card</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("components")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>GlowCard - Card with radial glow effect</li>
          <li>GlowContainer - Container with animated border glow</li>
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("features")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Mouse-following glow effect</li>
          <li>Customizable glow color</li>
          <li>Hover-only or always-on modes</li>
          <li>Animated border variant</li>
          <li>Respects reduced motion</li>
        </ul>
      </div>
    </div>
  )
}
