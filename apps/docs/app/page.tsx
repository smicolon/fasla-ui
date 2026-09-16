import { redirect } from "next/navigation"
import { defaultLocale } from "@/i18n/routing"

// `output: "export"` rules out middleware, so the bare path is a real page that
// sends the visitor to the default locale.
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
