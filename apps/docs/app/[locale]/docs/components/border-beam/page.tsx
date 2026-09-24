"use client"

import { useTranslations } from "next-intl"

import { BorderBeam } from "@fasla-ui/effects/border-beam/border-beam"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function BorderBeamPage() {
  const t = useTranslations("docs.sections")
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">BorderBeam</h1>
          <p className="text-lg text-muted-foreground">
            Animated border beam effect for cards and containers.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold">{t("installation")}</h2>
            <div className="mt-4">
              <CodeBlock>npx fasla-ui add border-beam</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("preview")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="relative h-32 w-64 rounded-xl border bg-card">
                  <BorderBeam />
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm">Hover me</span>
                  </div>
                </div>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("props")}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-start font-semibold">Prop</th>
                    <th className="px-4 py-2 text-start font-semibold">Type</th>
                    <th className="px-4 py-2 text-start font-semibold">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">size</td>
                    <td className="px-4 py-2 font-mono text-xs">number</td>
                    <td className="px-4 py-2 font-mono text-xs">200</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">duration</td>
                    <td className="px-4 py-2 font-mono text-xs">number</td>
                    <td className="px-4 py-2 font-mono text-xs">15</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">borderWidth</td>
                    <td className="px-4 py-2 font-mono text-xs">number</td>
                    <td className="px-4 py-2 font-mono text-xs">1.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
