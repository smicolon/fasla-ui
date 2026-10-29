import * as React from "react"
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  Isolated,
  SocialProofPhoto,
  SocialProofSection,
  type SocialProofLocale,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Case-Study Row.
 *
 * A header with an `All case studies` link at its end, over two tinted case
 * rows. Each row has a portrait cut to a leaf (two opposite corners fully
 * round), the company's wordmark in a `card` chip, two key figures with a
 * hairline between them, a quote with its mark, the author and a `Read more`
 * link. The second row is mirrored: its portrait is at the end. On Mobile the
 * portrait sits above the copy and the second row is no longer mirrored.
 *
 * Static: no motion, nothing to press but the links.
 */

export interface SocialProofCaseStudy {
  /** The key in `photos` for the portrait. */
  id: string
  /** The wordmark, in capitals. Up to 20 characters. */
  company: string
  /** Two key figures. */
  kpis: { value: string; label: React.ReactNode }[]
  /** Up to 154 characters in English, 136 in Arabic. */
  quote: React.ReactNode
  /** Up to 19 characters in English, 19 in Arabic. */
  name: string
  role: React.ReactNode
  /** The `info`, `success` tint. */
  tone?: "info" | "success"
}

export interface SocialProofCaseStudyRowCopy {
  /** Up to 46 characters in English, 40 in Arabic. */
  heading: React.ReactNode
  /** Up to 25 characters in English, 26 in Arabic. */
  allLink: React.ReactNode
  /** Up to 25 characters in English, 26 in Arabic. */
  readMore: React.ReactNode
  items: SocialProofCaseStudy[]
}

const COPY: Record<SocialProofLocale, SocialProofCaseStudyRowCopy> = {
  en: {
    heading: "Proof that compounds",
    allLink: "All case studies",
    readMore: "Read more",
    items: [
      {
        id: "bader-al-ghamdi",
        company: "BEACON ANALYTICS",
        kpis: [
          { value: "28%", label: "increase in activation rate" },
          { value: "2.1×", label: "faster dashboard delivery" },
        ],
        quote: "“Fasla became the heartbeat of our product UI — every squad speaks the same visual language now.”",
        name: "Bader Al-Ghamdi",
        role: "Chief Technology Officer",
        tone: "info",
      },
      {
        id: "majed-nouri",
        company: "ARCADIA HEALTH",
        kpis: [
          { value: "3.4×", label: "faster clinical screen reviews" },
          { value: "97%", label: "accessibility audit pass rate" },
        ],
        quote: "“Because every screen flows through one system, our patient tools adapt to what each clinic actually needs.”",
        name: "Majed Nouri",
        role: "Chief Operating Officer",
        tone: "success",
      },
    ],
  },
  ar: {
    heading: "نتائج تتضاعف",
    allLink: "كل دراسات الحالة",
    readMore: "اقرأ المزيد",
    items: [
      {
        id: "bader-al-ghamdi",
        company: "BEACON ANALYTICS",
        kpis: [
          { value: "28%", label: "زيادة في معدل التفعيل" },
          { value: "2.1×", label: "أسرع في تسليم لوحات المعلومات" },
        ],
        quote: "«صارت فاصلة أساس واجهة منتجنا، وصارت فرقنا كلها تتحدث اللغة البصرية نفسها.»",
        name: "بدر الغامدي",
        role: "الرئيس التقني",
        tone: "info",
      },
      {
        id: "majed-nouri",
        company: "ARCADIA HEALTH",
        kpis: [
          { value: "3.4×", label: "أسرع في مراجعة الشاشات السريرية" },
          { value: "97%", label: "معدل اجتياز تدقيق إمكانية الوصول" },
        ],
        quote: "«لأن كل شاشة تمر عبر نظام واحد، تتكيّف أدوات المرضى لدينا مع ما تحتاجه كل عيادة فعلًا.»",
        name: "ماجد نوري",
        role: "الرئيس التنفيذي للعمليات",
        tone: "success",
      },
    ],
  },
}

const TINT = { info: "bg-info/10", success: "bg-success/10" }

export interface SocialProofCaseStudyRowProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofCaseStudyRowCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Portraits by person id. Without them the leaf shows its `muted` ground. */
  photos?: SocialProofPhotos
  /** Where the links go. */
  href?: string
}

export function SocialProofCaseStudyRow({ locale = "en", heading, allLink, readMore, items, photos, href = "#", className, ...props }: SocialProofCaseStudyRowProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const link = "inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="items-stretch gap-10" {...props}>
      <header className="flex w-full items-center justify-between gap-6 [@container(min-width:64rem)]:gap-12">
        <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
          {heading ?? copy.heading}
        </h2>
        <a href={href} className={cn(link, "shrink-0")}>
          {allLink ?? copy.allLink}
          <ArrowUpRight aria-hidden size={16} className="rtl:-scale-x-100" />
        </a>
      </header>
      <div className="flex w-full flex-col gap-10">
        {(items ?? copy.items).map((item, i) => (
          <article
            key={item.id}
            className={cn(
              "flex flex-col gap-6 rounded-xl p-6 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-10 [@container(min-width:40rem)]:p-8",
              TINT[item.tone ?? "info"],
              i % 2 === 1 && "[@container(min-width:40rem)]:flex-row-reverse"
            )}
          >
            <SocialProofPhoto
              src={photos?.[item.id]}
              className={cn(
                "h-[140px] w-[180px] shrink-0 [@container(min-width:40rem)]:size-[200px] [@container(min-width:64rem)]:size-[280px]",
                // A leaf: two opposite corners fully round. It mirrors with the row.
                i % 2 === 0 ? "rounded-es-[100%] rounded-se-[100%]" : "rounded-ee-[100%] rounded-ss-[100%]"
              )}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:justify-between">
                <p className="w-fit rounded-md bg-card px-3 py-1.5 text-xs font-bold text-foreground">
                  <bdi dir="ltr">{item.company}</bdi>
                </p>
                <ul className="m-0 flex list-none gap-5 p-0">
                  {item.kpis.map((kpi, k) => (
                    <li key={k} className={cn("flex w-[140px] flex-col gap-0.5", k > 0 && "border-s border-border ps-5")}>
                      <span className="text-xl font-semibold text-foreground">
                        <Isolated>{kpi.value}</Isolated>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <Isolated>{kpi.label}</Isolated>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <figure className="m-0 flex flex-col gap-5">
                <Quote aria-hidden size={20} strokeWidth={1.5} className="text-foreground rtl:-scale-x-100" />
                <blockquote className="m-0 text-base text-foreground [@container(min-width:40rem)]:text-lg">
                  <p>
                    <Isolated>{item.quote}</Isolated>
                  </p>
                </blockquote>
                <figcaption className="flex items-end justify-between gap-4">
                  <span className="flex min-w-0 flex-col">
                    <cite className="text-sm font-medium not-italic text-foreground">{item.name}</cite>
                    <span className="text-xs text-muted-foreground">{item.role}</span>
                  </span>
                  <a href={href} className={cn(link, "shrink-0")}>
                    {readMore ?? copy.readMore}
                    <ArrowRight aria-hidden size={16} className="rtl:rotate-180" />
                  </a>
                </figcaption>
              </figure>
            </div>
          </article>
        ))}
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofCaseStudyRowCopy = COPY
