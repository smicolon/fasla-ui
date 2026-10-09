"use client"

import { useTranslations } from "next-intl"

import { TypewriterText, TypewriterWords } from "@fasla-ui/effects/typewriter-text/typewriter-text"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const A11Y = ["cursor", "motion", "reading"] as const
const WORDS = ["a", "b", "c"] as const

export default function TypewriterTextPage() {
  const t = useTranslations("docs.sections")
  const w = useTranslations("docs.typewriterText")
  const words = WORDS.map((key) => w(`words.${key}`))

  const props: PropRow[] = [
    { prop: "text", type: "string", fallback: "", description: w.rich("props.text", richCode) },
    { prop: "speed", type: "number", fallback: "50", description: w.rich("props.speed", richCode) },
    { prop: "delay", type: "number", fallback: "0", description: w.rich("props.delay", richCode) },
    { prop: "cursor", type: "boolean", fallback: "true", description: w.rich("props.cursor", richCode) },
    { prop: "cursorChar", type: "string", fallback: '"|"', description: w.rich("props.cursorChar", richCode) },
    { prop: "loop", type: "boolean", fallback: "false", description: w.rich("props.loop", richCode) },
    { prop: "loopDelay", type: "number", fallback: "2000", description: w.rich("props.loopDelay", richCode) },
    { prop: "onComplete", type: "() => void", fallback: "", description: w.rich("props.onComplete", richCode) },
    { prop: "TypewriterWords", type: "{ words, speed, deleteDelay, wordDelay, cursor }", fallback: "", description: w.rich("props.typewriterWords", richCode) },
    { prop: "className", type: "string", fallback: "", description: w.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/typewriter-text/" /></h1>
        <p className="text-xl text-muted-foreground">{w("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="typewriter-text" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <p className="text-2xl font-semibold">
            <TypewriterText text={w("preview")} loop />
          </p>
        </ComponentPreview>
      </section>

      {/* Cycling words */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{w("wordsTitle")}</h2>
        <p className="text-muted-foreground">{w.rich("wordsBody", richCode)}</p>
        <ComponentPreview>
          <p className="text-2xl font-semibold">
            {w("wordsPrefix")} <TypewriterWords words={words} className="text-primary" />
          </p>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {A11Y.map((key) => (
            <li key={key}>{w.rich(`a11y.${key}`, richCode)}</li>
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
        <UsageExample title="TypewriterText">{`import { TypewriterText } from "@/components/ui/typewriter-text"

export function OrderStatus() {
  return <TypewriterText text="${w("preview")}" speed={60} loop />
}`}</UsageExample>
        <UsageExample title="TypewriterWords">{`import { TypewriterWords } from "@/components/ui/typewriter-text"

export function NewIn() {
  return (
    <p>
      ${w("wordsPrefix")} <TypewriterWords words={[${words.map((word) => `"${word}"`).join(", ")}]} />
    </p>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
