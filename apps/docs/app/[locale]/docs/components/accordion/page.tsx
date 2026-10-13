"use client"

import { useTranslations } from "next-intl"
import { Bell, CreditCard, UserRound } from "lucide-react"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@fasla-ui/ui/accordion"
import { Avatar } from "@fasla-ui/ui/avatar"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const VARIANTS = ["default", "split", "outline", "table"] as const
const INDICATORS = ["chevron", "plus"] as const
const ICONS = [UserRound, Bell, CreditCard]
const PHOTO = "/samples/avatar-portrait.png"

type Qa = { q: string; a: string }

export default function AccordionPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.accordion")

  const faq = a.raw("sample.faq") as Qa[]
  const people = a.raw("sample.people") as { name: string; role: string }[]
  const settings = a.raw("sample.settings") as { title: string; body: string }[]
  const nested = a.raw("sample.nested") as { title: string; body: string; children: Qa[]; rest: Qa[] }

  /** The delivery questions, the first one open. */
  const group = (props: React.ComponentProps<typeof Accordion> = {}) => (
    <Accordion defaultValue={["0"]} className="w-full" {...props}>
      {faq.map((item, i) => (
        <AccordionItem key={item.q} value={String(i)}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )

  /** A caption: prop values are code, so they stay Latin in both locales. */
  const caption = (value: string) => <code className="w-fit text-sm text-muted-foreground">{value}</code>

  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "split" | "outline" | "table"', fallback: '"default"', description: a.rich("props.variant", richCode) },
    { prop: "indicator", type: '"chevron" | "plus"', fallback: '"chevron"', description: a.rich("props.indicator", richCode) },
    { prop: "multiple", type: "boolean", fallback: "false", description: a.rich("props.multiple", richCode) },
    { prop: "defaultValue", type: "string[]", fallback: "", description: a.rich("props.defaultValue", richCode) },
    { prop: "value", type: "string[]", fallback: "", description: a.rich("props.value", richCode) },
    { prop: "onValueChange", type: "(value, eventDetails) => void", fallback: "", description: a.rich("props.onValueChange", richCode) },
    { prop: "hiddenUntilFound", type: "boolean", fallback: "false", description: a.rich("props.hiddenUntilFound", richCode) },
    { prop: "AccordionItem", type: "{ value }", fallback: "", description: a.rich("props.item", richCode) },
    { prop: "AccordionTrigger", type: "ReactNode", fallback: "", description: a.rich("props.trigger", richCode) },
    { prop: "AccordionContent", type: "ReactNode", fallback: "", description: a.rich("props.content", richCode) },
    { prop: "className", type: "string", fallback: "", description: a.rich("props.className", richCode) },
  ]

  const items = (list: Qa[], indent = "    ") =>
    list
      .map(
        (item, i) => `${indent}<AccordionItem value="${i}">
${indent}  <AccordionTrigger>${item.q}</AccordionTrigger>
${indent}  <AccordionContent>${item.a}</AccordionContent>
${indent}</AccordionItem>`
      )
      .join("\n")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/accordion/" /></h1>
        <p className="text-xl text-muted-foreground">{a("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="accordion" />
        <p className="text-muted-foreground">{a.rich("installNote", richCode)}</p>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <p className="text-muted-foreground">{a("previewHint")}</p>
        <ComponentPreview>
          <div className="w-full max-w-md">{group()}</div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{a.rich("variantsBody", richCode)}</p>
        <ComponentPreview>
          <div className="grid w-full items-start gap-x-6 gap-y-8 sm:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex min-w-0 flex-col gap-3">
                {caption(variant)}
                {group({ variant })}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Indicator */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("indicator.title")}</h2>
        <p className="text-muted-foreground">{a.rich("indicator.body", richCode)}</p>
        <ComponentPreview>
          <div className="grid w-full items-start gap-x-6 gap-y-8 sm:grid-cols-2">
            {INDICATORS.map((indicator) => (
              <div key={indicator} className="flex min-w-0 flex-col gap-3">
                {caption(indicator)}
                {group({ indicator })}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Composition: avatar, icons, multi-level */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("composition.title")}</h2>
        <p className="text-muted-foreground">{a.rich("composition.body", richCode)}</p>
        <ComponentPreview>
          <div className="grid w-full items-start gap-x-6 gap-y-8 sm:grid-cols-2">
            <Accordion defaultValue={["0"]} className="min-w-0">
              {people.map((person, i) => (
                <AccordionItem key={person.name} value={String(i)}>
                  <AccordionTrigger>
                    <Avatar name={person.name} src={i === 0 ? PHOTO : undefined} aria-hidden="true" />
                    <span>{person.name}</span>
                  </AccordionTrigger>
                  <AccordionContent className="ps-11">{person.role}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion defaultValue={["0"]} className="min-w-0">
              {settings.map((item, i) => {
                const Icon = ICONS[i]!
                return (
                  <AccordionItem key={item.title} value={String(i)}>
                    <AccordionTrigger>
                      <Icon aria-hidden="true" strokeWidth={1.5} />
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>{item.body}</AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </ComponentPreview>
        <ComponentPreview>
          <Accordion variant="table" defaultValue={["parent"]} className="max-w-md">
            <AccordionItem value="parent">
              <AccordionTrigger>{nested.title}</AccordionTrigger>
              <AccordionContent className="-mx-5 pb-0">
                <p className="px-5 pb-4">{nested.body}</p>
                <Accordion defaultValue={["0"]} className="border-t border-border">
                  {nested.children.map((child, i) => (
                    <AccordionItem key={child.q} value={String(i)} className="px-10">
                      <AccordionTrigger>{child.q}</AccordionTrigger>
                      <AccordionContent>{child.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
            {nested.rest.map((item, i) => (
              <AccordionItem key={item.q} value={`rest-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={a("usage.basic")}>{`import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function DeliveryQuestions() {
  return (
    <Accordion defaultValue={["0"]}>
${items(faq)}
    </Accordion>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.variant")}>{`import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function DeliveryQuestionsTable() {
  return (
    <Accordion variant="table" indicator="plus">
${items(faq.slice(0, 2))}
    </Accordion>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.multiple")}>{`import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function DeliveryQuestionsOpen() {
  return (
    <Accordion multiple defaultValue={["0", "1"]}>
${items(faq.slice(0, 2))}
    </Accordion>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
