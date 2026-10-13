import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { Form } from "@base-ui/react/form"
import { Textarea, type TextareaProps } from "../../../../packages/fasla-ui/registry/ui/textarea"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<TextareaProps> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    status: { control: "inline-radio", options: ["default", "success"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    labelEnd: { control: "text" },
    description: { control: "text" },
    descriptionEnd: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    // Controlled state and escape hatches, not props a reader drives here.
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    style: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: { status: "default", invalid: false, disabled: false },
}

export default meta
type Story = StoryObj<TextareaProps>

/**
 * Sample copy, per script: delivery notes at checkout, and a support request.
 * Only the rendered text changes; prop names stay English everywhere. The
 * Arabic is written in Modern Standard Arabic from design/content/, not
 * translated.
 */
const COPY = {
  ltr: {
    notes: "Delivery notes",
    optional: "Optional",
    notesPlaceholder: "Gate code or a landmark",
    notesValue: "Leave it with the building guard.",
    notesHelp: "The driver sees this on arrival.",
    notesOk: "The driver will see your note.",
    notesError: "Tell the driver where to leave the parcel.",
    problem: "Describe the problem",
    required: "Required",
    problemPlaceholder: "What did you order, and what went wrong?",
    problemHelp:
      "Tell us what you ordered, what went wrong and what you would like us to do.",
    problemValue:
      "I ordered the oak side table on 3 May and it arrived yesterday with a deep scratch across the top. The box was not damaged, so I think it happened before packing.\n\nI would like a replacement rather than a refund. I am home every afternoon this week if a driver can collect the damaged one.",
    problemShort: "Write at least 20 characters so we can help.",
    send: "Send",
  },
  rtl: {
    notes: "ملاحظات التوصيل",
    optional: "اختياري",
    notesPlaceholder: "رمز البوابة أو معلم قريب",
    notesValue: "اترك الطلب عند حارس المبنى.",
    notesHelp: "يرى المندوب ملاحظتك عند وصوله.",
    notesOk: "سيرى المندوب ملاحظتك.",
    notesError: "أخبر المندوب أين يترك الطلب.",
    problem: "صف المشكلة",
    required: "مطلوب",
    problemPlaceholder: "ماذا طلبت؟ وما الخطأ الذي حدث؟",
    problemHelp:
      "أخبرنا بما طلبته وما الخطأ الذي حدث وما تريد منا فعله.",
    problemValue:
      "طلبت طاولة جانبية من خشب البلوط يوم 3 مايو، ووصلت أمس وعلى سطحها خدش عميق. الصندوق سليم، لذلك أظن أن الخدش حدث قبل التغليف.\n\nأفضّل استبدال الطاولة على استرداد المبلغ. أنا في البيت كل يوم بعد الظهر هذا الأسبوع إن أمكن للمندوب استلام الطاولة المخدوشة.",
    problemShort: "اكتب 20 حرفًا على الأقل لنتمكن من مساعدتك.",
    send: "إرسال",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

/** A character counter for the end of the helper row. */
const NOTES_MAX = 200
const count = (text = "", max = NOTES_MAX) => `${text.length}/${max}`

const STATES = ["default", "focus", "success", "error", "disabled"] as const
type State = (typeof STATES)[number]
const FILLS = ["empty", "filled"] as const

/** The props that put a field in one of Figma's States. Focus is forced by the pseudo-states addon. */
const stateProps = (state: State): Partial<TextareaProps> =>
  state === "success"
    ? { status: "success" }
    : state === "error"
      ? { invalid: true }
      : state === "disabled"
        ? { disabled: true }
        : {}

const title = (s: string) => s[0]!.toUpperCase() + s.slice(1)

/**
 * A column header or a caption over a field: Figma property names, so
 * English and left-to-right in both directions. It never wraps.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A side row label centred on the field's box, not on its label or helper
 * text. A zero-width strut as tall as the label row — 4px padding round one
 * `text-sm` line, so it matches in either script — sits over a strip as
 * tall as the box's 60px minimum, and the caption centres in the strip.
 * Left-aligned in both directions: the caption is an English property name.
 */
const BoxLineHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="flex flex-col whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    <span aria-hidden className="p-1 text-sm">
      {"\u200b"}
    </span>
    <span className="flex h-[60px] items-center">{children}</span>
  </span>
)

/**
 * The frame round every story but Default. It centres the content in the
 * canvas in either direction, and scrolls it sideways when it is wider than
 * the canvas (a phone), in the story's own direction. 4px of padding keeps
 * the focus halo of a field at the edge clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/** Cells forced into Focus: the pseudo-states addon applies the real `:focus-visible` to their textareas. */
const FOCUS_CELLS = ["[data-state-cell=focus] [data-slot=textarea]"]

/** A field whose counter follows the text, and which grows as you type. */
function CountedNotes({ c, ...props }: { c: Copy } & Partial<TextareaProps>) {
  const [value, setValue] = React.useState<string>(props.defaultValue ?? "")
  return (
    <Textarea
      label={c.notes}
      labelEnd={c.optional}
      description={c.notesHelp}
      placeholder={c.notesPlaceholder}
      maxLength={NOTES_MAX}
      {...props}
      defaultValue={undefined}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      descriptionEnd={count(value)}
    />
  )
}

/** The playground: every prop on the Controls panel. */
export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <Textarea
        {...args}
        className="w-72"
        label={args.label ?? c.notes}
        placeholder={args.placeholder ?? c.notesPlaceholder}
        description={args.description ?? c.notesHelp}
      />
    )
  },
}

/**
 * The five States, empty and filled, with every optional part on: the label,
 * the note at the end of its row, the helper text and the character counter.
 * Success and Error recolour them all; Error shows its message in place of
 * the helper text. Focus is the real `:focus-visible`, forced by the
 * pseudo-states addon. Disabled has no grip: it cannot be resized.
 */
export const States: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusVisible: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(2,18rem)] items-start gap-x-6 gap-y-5">
        <span />
        {FILLS.map((fill) => (
          <Head key={fill}>{title(fill)}</Head>
        ))}
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <BoxLineHead>{title(state)}</BoxLineHead>
            {FILLS.map((fill) => {
              const value = fill === "filled" ? c.notesValue : undefined
              return (
                <div key={fill} data-state-cell={state}>
                  <Textarea
                    {...stateProps(state)}
                    label={c.notes}
                    labelEnd={c.optional}
                    description={state === "success" ? c.notesOk : c.notesHelp}
                    descriptionEnd={count(value)}
                    error={c.notesError}
                    placeholder={c.notesPlaceholder}
                    defaultValue={value}
                  />
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Each optional part on its own, then all together. Flip the Direction
 * toolbar: the notes at the ends of the rows and the resize grip swap sides.
 */
export const Parts: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const cells: [string, React.ReactNode][] = [
      ["label", <Textarea label={c.notes} placeholder={c.notesPlaceholder} />],
      ["label + labelEnd", <Textarea label={c.notes} labelEnd={c.optional} placeholder={c.notesPlaceholder} />],
      ["description", <Textarea label={c.notes} description={c.notesHelp} placeholder={c.notesPlaceholder} />],
      [
        "descriptionEnd (live counter)",
        <CountedNotes c={c} labelEnd={undefined} description={undefined} defaultValue={c.notesValue} />,
      ],
      [
        "error",
        <Textarea label={c.notes} invalid error={c.notesError} descriptionEnd={count()} placeholder={c.notesPlaceholder} />,
      ],
      ["Every part", <CountedNotes c={c} defaultValue={c.notesValue} />],
      ["No label (aria-label)", <Textarea aria-label={c.notes} placeholder={c.notesPlaceholder} />],
      [
        "No label, description only",
        <Textarea aria-label={c.notes} description={c.notesHelp} placeholder={c.notesPlaceholder} />,
      ],
    ]
    return (
      <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,20rem)]">
        {cells.map(([caption, field]) => (
          <div key={caption} className="flex flex-col gap-1.5">
            <Head>{caption}</Head>
            {field}
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Long text. The field starts at its 60px minimum and grows a line at a time
 * with the text, with no scrollbar; drag the grip to make it taller by hand.
 * The first field is live: type into it and watch it and its counter grow.
 * The second holds two paragraphs, under a label row and helper text that
 * wrap; the notes at the ends of the rows stay on their first lines.
 */
export const LongText: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,20rem)]">
        <div className="flex flex-col gap-1.5">
          <Head>Type to grow</Head>
          <CountedNotes c={c} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Head>Grown to fit</Head>
          <Textarea
            label={c.problem}
            labelEnd={c.required}
            description={c.problemHelp}
            descriptionEnd={count(c.problemValue, 1000)}
            maxLength={1000}
            defaultValue={c.problemValue}
          />
        </div>
      </div>
    )
  },
}

/**
 * Base UI's validation, live. Send the empty form: the field turns invalid
 * and the error replaces the helper text. Writing 20 characters or more
 * clears it.
 */
export const Validation: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Form className="flex w-[17rem] flex-col items-start gap-3 sm:w-80" onSubmit={(event) => event.preventDefault()}>
        <Textarea
          name="problem"
          required
          minLength={20}
          label={c.problem}
          description={c.problemPlaceholder}
          error={c.problemShort}
        />
        <Button type="submit">{c.send}</Button>
      </Form>
    )
  },
}

const DIRECTIONS = [
  { dir: "ltr", lang: "en", name: "LTR", c: COPY.ltr, font: "" },
  { dir: "rtl", lang: "ar", name: "RTL", c: COPY.rtl, font: "font-arabic" },
] as const

/**
 * LTR and RTL side by side, whatever the Direction toolbar says. Each panel
 * sets its own `dir`, `lang` and font, as the toolbar does for a whole story.
 * In RTL the label row, the helper row and the resize grip mirror; nothing in
 * the component reads the direction.
 */
export const LtrAndRtl: Story = {
  name: "LTR And RTL",
  decorators: [framed],
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,20rem)]">
      {DIRECTIONS.map(({ dir, lang, name, c, font }) => (
        <div key={dir} className="flex flex-col gap-1.5">
          <Head>{name}</Head>
          <div dir={dir} lang={lang} className={["flex flex-col gap-5", font].join(" ")}>
            <CountedNotes c={c} defaultValue={c.notesValue} />
            <Textarea label={c.notes} invalid error={c.notesError} descriptionEnd={count()} placeholder={c.notesPlaceholder} />
          </div>
        </div>
      ))}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme: the `light` or `dark` class re-points every token for
 * that subtree. Language and direction follow the Direction toolbar.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusVisible: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4">
        {THEMES.map((theme) => (
          <div key={theme} className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
            <Head className="block pb-4">{title(theme)}</Head>
            <div className="grid grid-cols-[14rem] items-start gap-x-6 gap-y-5 sm:grid-cols-[repeat(3,15rem)]">
              {STATES.map((state) => {
                const value = state === "default" ? undefined : c.notesValue
                return (
                  <div key={state} data-state-cell={state} className="flex flex-col gap-1.5">
                    <Head>{title(state)}</Head>
                    <Textarea
                      {...stateProps(state)}
                      label={c.notes}
                      description={state === "success" ? c.notesOk : c.notesHelp}
                      descriptionEnd={count(value)}
                      error={c.notesError}
                      placeholder={c.notesPlaceholder}
                      defaultValue={value}
                    />
                  </div>
                )
              })}
              <div className="flex flex-col gap-1.5">
                <Head>Placeholder only</Head>
                <Textarea aria-label={c.notes} placeholder={c.notesPlaceholder} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
