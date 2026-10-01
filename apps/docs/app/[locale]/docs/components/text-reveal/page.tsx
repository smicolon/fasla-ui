"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { TextReveal, WordReveal } from "@fasla-ui/effects/text-reveal/text-reveal"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const A11Y = ["whole", "motion", "view"] as const

export default function TextRevealPage() {
  const t = useTranslations("docs.sections")
  const r = useTranslations("docs.textReveal")
  // A new key remounts the effect, so it plays again.
  const [run, setRun] = useState(0)

  const props: PropRow[] = [
    { prop: "text", type: "string", fallback: "", description: r.rich("props.text", richCode) },
    { prop: "delay", type: "number", fallback: "0.03", description: r.rich("props.delay", richCode) },
    { prop: "duration", type: "number", fallback: "0.3", description: r.rich("props.duration", richCode) },
    { prop: "triggerOnView", type: "boolean", fallback: "true", description: r.rich("props.triggerOnView", richCode) },
    { prop: "WordReveal", type: "{ text, delay, duration, triggerOnView }", fallback: "", description: r.rich("props.wordReveal", richCode) },
    { prop: "className", type: "string", fallback: "", description: r.rich("props.className", richCode) },
  ]

  const replay = (
    <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
      {r("replay")}
    </Button>
  )

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/text-reveal/" /></h1>
        <p className="text-xl text-muted-foreground">{r("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="text-reveal" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex flex-col items-center gap-6">
            <TextReveal key={run} text={r("preview")} className="text-4xl font-bold" />
            {replay}
          </div>
        </ComponentPreview>
      </section>

      {/* Word by word */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{r("wordTitle")}</h2>
        <p className="text-muted-foreground">{r.rich("wordBody", richCode)}</p>
        <ComponentPreview>
          <div className="flex flex-col items-center gap-6">
            <WordReveal key={run} text={r("word")} className="max-w-md text-center text-2xl font-semibold" />
            {replay}
          </div>
        </ComponentPreview>
      </section>

      {/* Joined scripts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{r("joinedTitle")}</h2>
        <p className="text-muted-foreground">{r.rich("joinedBody", richCode)}</p>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {A11Y.map((key) => (
            <li key={key}>{r.rich(`a11y.${key}`, richCode)}</li>
          ))}
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <CodeBlock>{`import { TextReveal, WordReveal } from "@/components/ui/text-reveal"

<TextReveal text="${r("preview")}" className="text-4xl font-bold" />

<WordReveal text="${r("word")}" delay={0.1} />`}</CodeBlock>
      </section>
    </div>
  )
}
