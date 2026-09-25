"use client"

import { useTranslations } from "next-intl"

import { TextReveal } from "@fasla-ui/effects/text-reveal/text-reveal"
import { ComponentPreview } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"

export default function TextRevealPage() {
  const t = useTranslations("docs.sections")
  return (
    <div>
      <div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">TextReveal</h1>
          <p className="text-lg text-muted-foreground">
            Character-by-character text reveal animation effect.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold">{t("installation")}</h2>
            <div className="mt-4">
              <InstallCommand name="text-reveal" />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("preview")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <TextReveal text="Hello, World!" className="text-4xl font-bold" />
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
                    <td className="px-4 py-2 font-mono text-xs">text</td>
                    <td className="px-4 py-2 font-mono text-xs">string</td>
                    <td className="px-4 py-2 font-mono text-xs">required</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">delay</td>
                    <td className="px-4 py-2 font-mono text-xs">number</td>
                    <td className="px-4 py-2 font-mono text-xs">0.05</td>
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
