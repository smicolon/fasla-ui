"use client"

import * as React from "react"
import { ChevronDown, LifeBuoy, Send } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import {
  CONTACT_US_TEXTAREA_88,
  ContactUsField,
  ContactUsForm,
  ContactUsHeader,
  ContactUsSection,
  ContactUsSubmit,
  contactUsFormMessages,
  prefersReducedMotion,
  splitCopy,
  useContactUsForm,
  useReveal,
  type ContactUsFieldDef,
  type ContactUsFormBlockProps,
  type ContactUsFormMessages,
  type ContactUsLocale,
  type ContactUsOption,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Form with FAQ.
 *
 * Left (the start side, 744px on Desktop): an eyebrow in capitals, an h2
 * (36px; 30px on Tablet; 24px on Mobile), a line, then Name and Email side by
 * side, a Topic select, a Message textarea (its group 88px tall), a "Send me a
 * copy" checkbox and a Solid Primary "Send message" Button with a send icon.
 * Right: the FAQ sidebar, 440px, `muted` with 10px corners and 24px of
 * padding: the label BEFORE YOU WRITE, a bordered `card` of five question rows
 * (a chevron after each) and a "Still stuck?" help link with a life-buoy icon.
 * In Arabic the two swap sides and the chevrons sit at the start of each row,
 * because the page's `dir` flips both.
 *
 * Tablet: the sidebar drops below the form at full width and stops being
 * sticky; Name and Email stay side by side. Mobile: Name and Email stack, and
 * the FAQ moves ABOVE the send button, inside the form's column, so it is read
 * before sending. That is ONE element: the form's `<form>` is `display:
 * contents`, so the header, the fields, the actions and the FAQ are all items
 * of one grid, and `order` puts the FAQ where each size wants it.
 *
 * Real: the form validates on the client and calls `onSubmit(values)` with
 * name, email, topic, message and copy (a boolean). Email is required (it
 * shows the word "Required"); name, topic, message and the copy box are not.
 * Each FAQ row is a disclosure: a button with `aria-expanded` that opens its
 * answer (rows open independently). The sidebar is `position: sticky` on
 * Desktop, CSS only. The smart nudge reads the message as it is typed and the
 * topic as it is picked, matches them against each FAQ's `keywords` and
 * highlights the rows that fit, with a "Might this help?" chip; it never
 * blocks sending.
 *
 * Static: Figma draws no answers, no open row and no chip; the answers and the
 * chip's look (Badge, Soft Primary, sm) are ours.
 *
 * Motion: once, when the block is in view, the header and fields rise and the
 * sidebar slides 16px in from the end side. A row opens by a grid-template-rows
 * transition 0fr to 1fr over 260ms and the chevron turns 180 degrees over the
 * same 260ms. A nudged row's `muted` background fades in over 260ms and its chip
 * fades in over 260ms. Reduced motion: opening and closing are instant, no
 * background tween, the chip appears without a fade.
 *
 * Content limits: heading up to 24 characters, line up to 90, question up to 40,
 * answer up to 180, up to 5 questions, 5 topics, 6 keywords a question.
 */

export interface ContactUsFaq {
  question: string
  answer: string
  /** Words that, found in the message or the topic, nudge this question. Lower case. */
  keywords: string[]
}

export interface ContactUsFormWithFaqCopy extends ContactUsFormMessages {
  /** The small line above the heading. */
  eyebrow: string
  /** The h2. */
  heading: string
  /** The line under it. */
  description: string
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  topic: string
  topicPlaceholder: string
  /** The topic choices. A topic's label also feeds the nudge. */
  topics: ContactUsOption[]
  message: string
  messagePlaceholder: string
  /** The checkbox: send the visitor a copy. */
  copyMe: string
  submit: string
  /** The sidebar's label. */
  sidebarLabel: string
  /** The questions, in order. */
  faqs: ContactUsFaq[]
  /** The help link's text. */
  helpLabel: string
  /** The chip on a nudged question. */
  nudge: string
}

const COPY: Record<ContactUsLocale, ContactUsFormWithFaqCopy> = {
  en: {
    ...contactUsFormMessages.en,
    eyebrow: "SEND A MESSAGE",
    heading: "Ask us anything",
    description: "Before you write, the answers on the right solve most questions in under a minute.",
    name: "Name",
    namePlaceholder: "Sara Al Mansouri",
    email: "Email",
    emailPlaceholder: "sara@company.com",
    topic: "Topic",
    topicPlaceholder: "Choose a topic",
    topics: [
      { value: "general", label: "General question" },
      { value: "billing", label: "Billing and invoices" },
      { value: "education", label: "Education licence" },
      { value: "bug", label: "Report a bug" },
      { value: "other", label: "Something else" },
    ],
    message: "Message",
    messagePlaceholder: "What can we help with?",
    copyMe: "Send me a copy of this message.",
    submit: "Send message",
    sidebarLabel: "BEFORE YOU WRITE",
    faqs: [
      {
        question: "How long does a reply take?",
        answer: "We answer within one working day, and usually within a few hours between 09:00 and 18:00 Gulf time, Sunday to Thursday.",
        keywords: ["reply", "response", "how long", "wait", "slow", "urgent", "hours"],
      },
      {
        question: "Can I get an invoice in AED?",
        answer: "Yes. We invoice in AED or USD. Tell us which, and your company's tax details, and the billing team will send it.",
        keywords: ["invoice", "aed", "billing", "payment", "vat", "tax", "receipt", "price", "pricing"],
      },
      {
        question: "Do you offer an education licence?",
        answer: "We do. Schools, universities and students use Fasla at a reduced rate. Send us the name of your institution and we will confirm the discount.",
        keywords: ["education", "student", "university", "school", "licence", "license", "discount", "academic"],
      },
      {
        question: "Where do I report a bug?",
        answer: "Describe what happened, the steps to repeat it and a screenshot in the message here, or use the report link in the help centre.",
        keywords: ["bug", "error", "broken", "crash", "issue", "problem", "not working", "fix"],
      },
      {
        question: "Can I book a call instead?",
        answer: "Of course. Pick a time that suits you on our booking page and we will send a calendar invite with the meeting link.",
        keywords: ["call", "book", "meeting", "schedule", "demo", "talk", "phone"],
      },
    ],
    helpLabel: "Still stuck? Visit the help centre",
    nudge: "Might this help?",
  },
  ar: {
    ...contactUsFormMessages.ar,
    eyebrow: "أرسل رسالة",
    heading: "اسألنا عن أي شيء",
    description: "قبل أن تكتب، الإجابات المجاورة تحلّ معظم الأسئلة خلال أقل من دقيقة.",
    name: "الاسم",
    namePlaceholder: "سارة المنصوري",
    email: "البريد الإلكتروني",
    emailPlaceholder: "sara@company.com",
    topic: "الموضوع",
    topicPlaceholder: "اختر موضوعًا",
    topics: [
      { value: "general", label: "سؤال عام" },
      { value: "billing", label: "الفواتير والدفع" },
      { value: "education", label: "الترخيص التعليمي" },
      { value: "bug", label: "الإبلاغ عن خلل" },
      { value: "other", label: "شيء آخر" },
    ],
    message: "الرسالة",
    messagePlaceholder: "بماذا يمكننا مساعدتك؟",
    copyMe: "أرسل لي نسخة من هذه الرسالة.",
    submit: "إرسال الرسالة",
    sidebarLabel: "قبل أن تكتب",
    faqs: [
      {
        question: "كم يستغرق الردّ؟",
        answer: "نرد خلال يوم عمل واحد، وغالبًا خلال ساعات قليلة بين 09:00 و18:00 بتوقيت الخليج، من الأحد إلى الخميس.",
        keywords: ["رد", "الرد", "ردّ", "كم يستغرق", "انتظار", "عاجل", "ساعات", "reply"],
      },
      {
        question: "هل يمكنني الحصول على فاتورة بالدرهم؟",
        answer: "نعم. نصدر الفواتير بالدرهم أو بالدولار. أخبرنا بالعملة وببيانات شركتك الضريبية وسيرسلها فريق الفواتير.",
        keywords: ["فاتور", "درهم", "الدفع", "دفع", "ضريب", "إيصال", "سعر", "أسعار", "aed"],
      },
      {
        question: "هل تقدّمون ترخيصًا تعليميًا؟",
        answer: "نعم. تستخدم المدارس والجامعات والطلاب فاصلة بسعر مخفّض. أرسل لنا اسم مؤسستك وسنؤكد لك الخصم.",
        keywords: ["تعليم", "طالب", "طلاب", "جامعة", "مدرسة", "ترخيص", "خصم", "أكاديمي"],
      },
      {
        question: "أين أبلّغ عن خلل؟",
        answer: "اشرح ما حدث وخطوات تكراره وأرفق وصفًا للشاشة في الرسالة هنا، أو استخدم رابط الإبلاغ في مركز المساعدة.",
        keywords: ["خلل", "خطأ", "عطل", "مشكلة", "لا يعمل", "تعطل", "إبلاغ", "أبلغ"],
      },
      {
        question: "هل يمكنني حجز مكالمة بدلًا من ذلك؟",
        answer: "بالطبع. اختر الوقت المناسب لك في صفحة الحجز وسنرسل لك دعوة التقويم مع رابط الاجتماع.",
        keywords: ["مكالم", "حجز", "احجز", "اجتماع", "موعد", "عرض", "اتصال", "هاتف"],
      },
    ],
    helpLabel: "ما زلت عالقًا؟ زر مركز المساعدة",
    nudge: "هل يفيدك هذا؟",
  },
}

export interface ContactUsFormWithFaqProps extends ContactUsFormBlockProps, Partial<ContactUsFormWithFaqCopy> {
  /** Where the help link goes. */
  helpHref?: string
}

/** The questions whose keywords appear in what the visitor has typed or picked. */
export function matchContactUsFaqs(faqs: readonly ContactUsFaq[], ...texts: string[]) {
  const haystack = texts.join(" ").toLowerCase()
  if (haystack.trim().length < 3) return new Set<number>()
  const found = new Set<number>()
  faqs.forEach((faq, index) => {
    if (faq.keywords.some((word) => word.trim() !== "" && haystack.includes(word.toLowerCase()))) found.add(index)
  })
  return found
}

const STANDARD = "ease-[cubic-bezier(0.2,0,0,1)]"

function NudgeChip({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion() || typeof node.animate !== "function") return
    node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "cubic-bezier(0.2, 0, 0, 1)" })
  }, [])
  return (
    <span ref={ref} className="shrink-0">
      <Badge variant="soft" tone="primary" size="sm">
        {children}
      </Badge>
    </span>
  )
}

function FaqRow({ faq, nudged, nudge, last }: { faq: ContactUsFaq; nudged: boolean; nudge: string; last: boolean }) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  return (
    <div className={cn(!last && "border-b border-border")}>
      <h3 className="m-0">
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-start text-sm font-medium text-foreground outline-none rtl:leading-6 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50",
            "motion-safe:transition-colors motion-safe:duration-[260ms]",
            STANDARD,
            nudged ? "bg-muted" : "bg-transparent"
          )}
        >
          <span className="min-w-0 flex-1">{faq.question}</span>
          {nudged ? <NudgeChip>{nudge}</NudgeChip> : null}
          <ChevronDown
            aria-hidden
            size={16}
            strokeWidth={1.5}
            className={cn("shrink-0 text-muted-foreground motion-safe:transition-transform motion-safe:duration-[260ms]", STANDARD, open && "rotate-180")}
          />
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={cn(
          "grid motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-[260ms]",
          STANDARD,
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-muted-foreground rtl:leading-6">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}

export function ContactUsFormWithFaq({ locale = "en", ...given }: ContactUsFormWithFaqProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, helpHref = "/help", className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    name: { name: "name", kind: "text", label: copy.name, placeholder: copy.namePlaceholder, autoComplete: "name" },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    topic: { name: "topic", kind: "select", label: copy.topic, placeholder: copy.topicPlaceholder, options: copy.topics },
    message: { name: "message", kind: "textarea", label: copy.message, placeholder: copy.messagePlaceholder, groupClassName: CONTACT_US_TEXTAREA_88 },
    copy: { name: "copy", kind: "checkbox", label: copy.copyMe, size: "sm" },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  // The smart nudge: what is typed and what is picked, against each FAQ's keywords.
  const topicValue = typeof form.values.topic === "string" ? form.values.topic : ""
  const topicLabel = copy.topics.find((option) => option.value === topicValue)?.label ?? ""
  const typed = typeof form.values.message === "string" ? form.values.message : ""
  const nudged = React.useMemo(() => matchContactUsFaqs(copy.faqs, typed, topicLabel, topicValue), [copy.faqs, typed, topicLabel, topicValue])

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div ref={reveal} className="grid grid-cols-1 gap-x-16 gap-y-5 [@container(min-width:64rem)]:grid-cols-[minmax(0,1fr)_27.5rem]">
        <ContactUsHeader
          headingId={headingId}
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          description={copy.description}
          data-reveal="rise"
          className="order-1 mb-1 min-w-0 gap-6"
          eyebrowClassName="text-sm font-semibold text-foreground rtl:leading-6"
          headingClassName="text-2xl leading-8 rtl:leading-10 [@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem] [@container(min-width:64rem)]:text-4xl"
          descriptionClassName="rtl:leading-7"
        />
        {/* The form's own box vanishes, so the fields, the actions and the FAQ share one grid. */}
        <ContactUsForm form={form} className="contents [&>[role=alert]]:order-4 [&>[role=status]]:order-2">
          <div data-reveal="rise" className="order-2 flex min-w-0 flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2">
              <ContactUsField field={f.name} />
              <ContactUsField field={f.email} />
            </div>
            <ContactUsField field={f.topic} />
            <ContactUsField field={f.message} />
          </div>
          <div className="order-4 flex min-w-0 flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
            <ContactUsField field={f.copy} />
            <ContactUsSubmit size="md" className="w-full [@container(min-width:40rem)]:w-auto">
              {copy.submit}
              <Send aria-hidden className="rtl:-scale-x-100" />
            </ContactUsSubmit>
          </div>
        </ContactUsForm>
        <aside
          data-reveal="slide"
          data-reveal-from="end"
          aria-label={copy.sidebarLabel}
          className={cn(
            "order-3 flex min-w-0 flex-col gap-5 rounded-[10px] bg-muted p-6",
            "[@container(min-width:40rem)]:order-5 [@container(min-width:40rem)]:mt-11",
            "[@container(min-width:64rem)]:sticky [@container(min-width:64rem)]:top-24 [@container(min-width:64rem)]:col-start-2 [@container(min-width:64rem)]:row-span-3 [@container(min-width:64rem)]:row-start-1 [@container(min-width:64rem)]:mt-0 [@container(min-width:64rem)]:self-start"
          )}
        >
          <p className="text-xs font-semibold text-muted-foreground rtl:leading-5">{copy.sidebarLabel}</p>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {copy.faqs.map((faq, index) => (
              <FaqRow key={faq.question} faq={faq} nudged={nudged.has(index)} nudge={copy.nudge} last={index === copy.faqs.length - 1} />
            ))}
          </div>
          <a
            href={helpHref}
            className="flex items-center gap-2 rounded-sm text-sm font-medium text-foreground outline-none rtl:leading-6 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <LifeBuoy aria-hidden size={16} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
            {copy.helpLabel}
          </a>
        </aside>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsFormWithFaqCopy = COPY
