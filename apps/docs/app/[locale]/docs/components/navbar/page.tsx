import { getTranslations, setRequestLocale } from "next-intl/server"
export default async function NavbarPage({
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
        <h1 className="text-4xl font-bold">Navbar</h1>
        <p className="text-xl text-muted-foreground">
          A responsive navigation bar with mobile menu support.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/fasla-ui add navbar</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("components")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Navbar - Main container</li>
          <li>NavbarBrand - Logo/brand area</li>
          <li>NavbarContent - Content sections</li>
          <li>NavbarMenu - Navigation menu</li>
          <li>NavbarLink - Navigation links</li>
          <li>NavbarItem - Generic navbar items</li>
          <li>NavbarToggle - Mobile menu toggle</li>
        </ul>
      </div>
    </div>
  )
}
