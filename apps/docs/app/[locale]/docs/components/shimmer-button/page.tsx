"use client"

import { useTranslations } from "next-intl"

import { ShimmerButton } from "@fasla-ui/effects/shimmer-button"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"

export default function ShimmerButtonPage() {
  const t = useTranslations("docs.sections")
  return (
    <div>
      <div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Shimmer Button</h1>
          <p className="text-lg text-muted-foreground">
            A button with an animated shimmer effect that respects prefers-reduced-motion.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {/* Installation */}
          <section>
            <h2 className="text-2xl font-bold">{t("installation")}</h2>
            <div className="mt-4">
              <InstallCommand name="shimmer-button" />
            </div>
          </section>

          {/* Preview */}
          <section>
            <h2 className="text-2xl font-bold">{t("preview")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <ShimmerButton>Get Started</ShimmerButton>
              </ComponentPreview>
            </div>
          </section>

          {/* Custom Colors */}
          <section>
            <h2 className="text-2xl font-bold">Custom Colors</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex flex-col gap-4">
                  <ShimmerButton
                    shimmerColor="rgba(255, 255, 255, 0.3)"
                    background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  >
                    Purple Gradient
                  </ShimmerButton>
                  <ShimmerButton
                    shimmerColor="rgba(255, 255, 255, 0.4)"
                    background="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  >
                    Pink Gradient
                  </ShimmerButton>
                </div>
              </ComponentPreview>
            </div>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-2xl font-bold">{t("usage")}</h2>
            <div className="mt-4">
              <CodeBlock>{`import { ShimmerButton } from "@/components/ui/shimmer-button"

export function Example() {
  return (
    <ShimmerButton
      shimmerColor="rgba(255, 255, 255, 0.3)"
      background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      Get Started
    </ShimmerButton>
  )
}`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section>
            <h2 className="text-2xl font-bold">{t("props")}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-start font-semibold">Prop</th>
                    <th className="px-4 py-2 text-start font-semibold">Type</th>
                    <th className="px-4 py-2 text-start font-semibold">Default</th>
                    <th className="px-4 py-2 text-start font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">shimmerColor</td>
                    <td className="px-4 py-2 font-mono text-xs">string</td>
                    <td className="px-4 py-2 font-mono text-xs">color-mix(in oklch, var(--primary) 20%, transparent)</td>
                    <td className="px-4 py-2">Color of the shimmer effect</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">shimmerDuration</td>
                    <td className="px-4 py-2 font-mono text-xs">string</td>
                    <td className="px-4 py-2 font-mono text-xs">2s</td>
                    <td className="px-4 py-2">Duration of shimmer animation</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">background</td>
                    <td className="px-4 py-2 font-mono text-xs">string</td>
                    <td className="px-4 py-2 font-mono text-xs">var(--primary)</td>
                    <td className="px-4 py-2">Background color or gradient</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">borderRadius</td>
                    <td className="px-4 py-2 font-mono text-xs">string</td>
                    <td className="px-4 py-2 font-mono text-xs">0.5rem</td>
                    <td className="px-4 py-2">Border radius of the button</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Accessibility */}
          <section>
            <h2 className="text-2xl font-bold">{t("accessibility")}</h2>
            <div className="mt-4">
              <p className="text-muted-foreground">
                The shimmer animation automatically respects the user&apos;s{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                  prefers-reduced-motion
                </code>{" "}
                setting. When reduced motion is preferred, the shimmer effect is disabled
                while maintaining the button&apos;s visual appearance.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
