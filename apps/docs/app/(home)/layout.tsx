import { metadataForRoute } from "@/lib/seo-routes"

export const metadata = metadataForRoute("/")

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
