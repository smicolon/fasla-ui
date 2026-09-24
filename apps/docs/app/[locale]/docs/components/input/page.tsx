"use client"

import { useTranslations } from "next-intl"

import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function InputPage() {
  const t = useTranslations("docs.sections")
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Input</h1>
          <p className="text-lg text-muted-foreground">
            A text input component with validation states and icon support.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold">{t("installation")}</h2>
            <div className="mt-4">
              <CodeBlock>npx fasla-ui add input</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("preview")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <Input placeholder="Enter text..." className="max-w-sm" />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("variants")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex flex-col gap-4 max-w-sm">
                  <Input variant="default" placeholder="Default" />
                  <Input variant="error" placeholder="Error state" />
                  <Input variant="success" placeholder="Success state" />
                </div>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("sizes")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex flex-col gap-4 max-w-sm">
                  <Input inputSize="sm" placeholder="Small" />
                  <Input inputSize="default" placeholder="Default" />
                  <Input inputSize="lg" placeholder="Large" />
                </div>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">With Icons</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex flex-col gap-4 max-w-sm">
                  <Input
                    startIcon={<span>🔍</span>}
                    placeholder="Search..."
                  />
                  <Input
                    endIcon={<span>✓</span>}
                    placeholder="With end icon"
                  />
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
                    <td className="px-4 py-2 font-mono text-xs">variant</td>
                    <td className="px-4 py-2 font-mono text-xs">default | error | success</td>
                    <td className="px-4 py-2 font-mono text-xs">default</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">inputSize</td>
                    <td className="px-4 py-2 font-mono text-xs">sm | default | lg</td>
                    <td className="px-4 py-2 font-mono text-xs">default</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">startIcon</td>
                    <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                    <td className="px-4 py-2 font-mono text-xs">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">endIcon</td>
                    <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                    <td className="px-4 py-2 font-mono text-xs">-</td>
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
