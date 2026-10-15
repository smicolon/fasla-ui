"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `FAQ` (42359:9029), Type=Newsletter Close.
 *
 * The questions people ask before a trial, then a muted band for readers who
 * are not ready yet: a short sign-up for the monthly release note.
 *
 * The form is real. It validates the address itself, so the error is the
 * Input's own message, read out with the field, rather than the browser's
 * bubble. While `onSubmit` runs the button shows its loading state and the
 * fields are disabled; it then shows the success line, or the error line with
 * the form kept as it was so the reader can try again.
 *
 * Mobile first: the base classes are Figma's Mobile (360), where the form
 * stacks; `md:` is its Tablet (768) and `lg:` its Desktop (1440).
 */

export interface FaqNewsletterCloseItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqNewsletterCloseValues {
  email: string
  /** Empty when the reader left it out. */
  company?: string
}

export interface FaqNewsletterCloseCopy {
  heading: React.ReactNode
  items: FaqNewsletterCloseItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
  newsletterHeading: React.ReactNode
  newsletterDescription: React.ReactNode
  emailPlaceholder: string
  companyPlaceholder: string
  submitLabel: React.ReactNode
  /** Read out while the sign-up is sent. */
  pendingLabel: string
  /** Under the email field when it is empty or not an address. */
  emailError: React.ReactNode
  /** Shown once `onSubmit` resolves. */
  success: React.ReactNode
  /** Shown when `onSubmit` throws or rejects. */
  error: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqNewsletterCloseCopy> = {
  en: {
    heading: "Before you start your trial",
    items: [
      {
        question: "What does the trial include?",
        answer:
          "Fourteen days of the full library — every component, block and theme — with no card required. Nothing you build during the trial is locked if you decide not to continue.",
      },
      {
        question: "When does my trial start?",
        answer: "The moment you create your workspace. You can see the days left on your billing page.",
      },
      {
        question: "What are library credits?",
        answer: "Credits unlock premium templates. Every plan includes a monthly allowance, and unused credits roll over for one month.",
      },
      {
        question: "Why do you need my payment details?",
        answer: "We don’t, for the trial. We ask for them only when you choose a plan, so your work carries on without a gap.",
      },
      {
        question: "What happens after the trial ends?",
        answer: "Your workspace becomes read-only until you choose a plan. Nothing is deleted.",
      },
      {
        question: "What is your cancellation policy?",
        answer: "Cancel at any time from your billing page. Your plan runs to the end of the period you paid for.",
      },
      {
        question: "What if I do not use all my seats?",
        answer: "Remove a seat at any time and we credit the unused days to your next invoice.",
      },
    ],
    empty: "No questions yet.",
    newsletterHeading: "Not ready to start today?",
    newsletterDescription:
      "Get the monthly release note — new blocks, breaking changes and the occasional workflow tip. By subscribing you agree to receive email from Fasla.",
    emailPlaceholder: "Email address",
    companyPlaceholder: "Company (optional)",
    submitLabel: "Subscribe",
    pendingLabel: "Subscribing",
    emailError: "Enter an email address, like name@example.com.",
    success: "You’re subscribed. The next release note arrives at the start of the month.",
    error: "We couldn’t subscribe you just now. Check your connection and try again.",
  },
  ar: {
    heading: "قبل أن تبدأ فترتك التجريبية",
    items: [
      {
        question: "ماذا تشمل الفترة التجريبية؟",
        answer:
          "أربعة عشر يومًا من المكتبة كاملة: كل مكوّن وكتلة وسمة، دون الحاجة إلى بطاقة. ولا يُقفل أي شيء تبنيه خلال التجربة إن قرّرت عدم المتابعة.",
      },
      {
        question: "متى تبدأ فترتي التجريبية؟",
        answer: "لحظة إنشاء مساحة العمل. ترى الأيام المتبقية في صفحة الفوترة.",
      },
      {
        question: "ما أرصدة المكتبة؟",
        answer: "تفتح الأرصدة القوالب المميّزة. تشمل كل خطة رصيدًا شهريًا، ويُرحَّل غير المستخدم منه لشهر واحد.",
      },
      {
        question: "لماذا تحتاجون بيانات الدفع الخاصة بي؟",
        answer: "لا نحتاجها في الفترة التجريبية. نطلبها فقط حين تختار خطة، ليستمر عملك دون انقطاع.",
      },
      {
        question: "ماذا يحدث بعد انتهاء الفترة التجريبية؟",
        answer: "تصبح مساحة عملك للقراءة فقط حتى تختار خطة. لا يُحذف أي شيء.",
      },
      {
        question: "ما سياسة الإلغاء لديكم؟",
        answer: "ألغِ في أي وقت من صفحة الفوترة. تبقى خطتك فعّالة حتى نهاية المدة التي دفعت عنها.",
      },
      {
        question: "ماذا لو لم أستخدم كل مقاعدي؟",
        answer: "احذف أي مقعد في أي وقت، ونضيف الأيام غير المستخدمة رصيدًا إلى فاتورتك التالية.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
    newsletterHeading: "لست مستعدًا للبدء اليوم؟",
    newsletterDescription:
      "احصل على نشرة الإصدارات الشهرية: كتل جديدة وتغييرات جذرية ونصائح عملية بين الحين والآخر. باشتراكك توافق على تلقّي رسائل من فاصلة.",
    emailPlaceholder: "البريد الإلكتروني",
    companyPlaceholder: "الشركة (اختياري)",
    submitLabel: "اشترك",
    pendingLabel: "جارٍ الاشتراك",
    emailError: (
      <>
        أدخل بريدًا إلكترونيًا صحيحًا، مثل <bdi dir="ltr">name@example.com</bdi>.
      </>
    ),
    success: "تم اشتراكك. تصلك نشرة الإصدارات التالية في بداية الشهر.",
    error: "تعذّر اشتراكك الآن. تحقّق من اتصالك وحاول مرة أخرى.",
  },
}

type Status = "idle" | "pending" | "success" | "error"

export interface FaqNewsletterCloseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSubmit">,
    Partial<FaqNewsletterCloseCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /** Lets several questions stay open at once. */
  multiple?: boolean
  /**
   * Sends the sign-up. The form shows its pending state until the promise
   * settles, then success, or the error line if it rejects.
   */
  onSubmit?: (values: FaqNewsletterCloseValues) => Promise<void> | void
  /** Turns the sign-up off: the fields and the button are disabled. */
  disabled?: boolean
}

export function FaqNewsletterClose({
  locale = "en",
  heading,
  items,
  empty,
  newsletterHeading,
  newsletterDescription,
  emailPlaceholder,
  companyPlaceholder,
  submitLabel,
  pendingLabel,
  emailError,
  success,
  error,
  defaultValue = ["0"],
  multiple,
  onSubmit,
  disabled,
  className,
  ...props
}: FaqNewsletterCloseProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const newsletterId = React.useId()
  const list = items ?? copy.items
  const [status, setStatus] = React.useState<Status>("idle")
  const [emailInvalid, setEmailInvalid] = React.useState(false)
  const pending = status === "pending"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.elements.namedItem("email") as HTMLInputElement
    if (!email.checkValidity()) {
      setEmailInvalid(true)
      email.focus()
      return
    }
    setEmailInvalid(false)
    const company = (form.elements.namedItem("company") as HTMLInputElement).value.trim()
    setStatus("pending")
    try {
      await onSubmit?.({ email: email.value.trim(), company: company || undefined })
      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className={cn("bg-background", className)} {...props}>
      <section aria-labelledby={headingId} className="px-4 pb-20 pt-24 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[880px] flex-col gap-8">
          <h2 id={headingId} className="text-center text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h2>
          {list.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
          ) : (
            <Accordion defaultValue={defaultValue} multiple={multiple}>
              {list.map((item, index) => (
                <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
                  <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      <section aria-labelledby={newsletterId} className="bg-muted px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-5 text-center">
          <h2 id={newsletterId} className="text-xl font-semibold text-foreground md:text-2xl">
            {newsletterHeading ?? copy.newsletterHeading}
          </h2>
          <p className="w-full max-w-[720px] text-sm text-muted-foreground">
            {newsletterDescription ?? copy.newsletterDescription}
          </p>
          <form
            noValidate
            onSubmit={handleSubmit}
            aria-labelledby={newsletterId}
            className="flex w-full flex-col gap-2 text-start md:w-auto md:flex-row md:items-start"
          >
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={emailPlaceholder ?? copy.emailPlaceholder}
              aria-label={emailPlaceholder ?? copy.emailPlaceholder}
              invalid={emailInvalid}
              error={emailError ?? copy.emailError}
              disabled={disabled || pending}
              onChange={() => emailInvalid && setEmailInvalid(false)}
              className="md:w-[280px]"
            />
            <Input
              name="company"
              autoComplete="organization"
              placeholder={companyPlaceholder ?? copy.companyPlaceholder}
              aria-label={companyPlaceholder ?? copy.companyPlaceholder}
              disabled={disabled || pending}
              className="md:w-[220px]"
            />
            <Button type="submit" loading={pending} loadingLabel={pendingLabel ?? copy.pendingLabel} disabled={disabled}>
              {submitLabel ?? copy.submitLabel}
            </Button>
          </form>
          <p role="status" className="text-sm empty:hidden">
            {status === "success" && <span className="text-foreground">{success ?? copy.success}</span>}
            {status === "error" && <span className="text-destructive">{error ?? copy.error}</span>}
          </p>
        </div>
      </section>
    </div>
  )
}
