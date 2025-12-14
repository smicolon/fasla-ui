"use client"

import { AnimatedGradient } from "../../../../../../packages/smi-ui/registry/effects/animated-gradient/animated-gradient"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function AnimatedGradientPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AnimatedGradient</h1>
          <p className="text-lg text-muted-foreground">
            Animated gradient background effect for hero sections and cards.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx smi-ui add animated-gradient</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
            <div className="mt-4">
              <ComponentPreview>
                <AnimatedGradient className="h-48 rounded-lg" />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">With Content</h2>
            <div className="mt-4">
              <ComponentPreview>
                <AnimatedGradient className="relative h-48 rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-white">Hero Title</h2>
                  </div>
                </AnimatedGradient>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Custom Colors</h2>
            <div className="mt-4">
              <ComponentPreview>
                <AnimatedGradient
                  className="h-48 rounded-lg"
                  colors={["#ff0080", "#7928ca", "#0070f3"]}
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Props</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-semibold">Prop</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">colors</td>
                    <td className="px-4 py-2 font-mono text-xs">string[]</td>
                    <td className="px-4 py-2 font-mono text-xs">default gradient</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">speed</td>
                    <td className="px-4 py-2 font-mono text-xs">slow | normal | fast</td>
                    <td className="px-4 py-2 font-mono text-xs">normal</td>
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
