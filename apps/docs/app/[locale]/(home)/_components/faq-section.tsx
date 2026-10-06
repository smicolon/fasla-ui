"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { landingLinks } from "./links"
import { Stroked } from "./section-head"

type Item = { q: string; a: string }

/** Two speech bubbles asking each other a question; one wears the comma. Decorative. */
function QuestionArt() {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-[min(220px,60%)] text-foreground max-[960px]:w-[150px] max-[560px]:hidden"
    >
      <g className="l-bob">
        <path className="fill-[color:var(--l-bg-2)]" d="M18 30c0-11 9-20 20-20h86c11 0 20 9 20 20v52c0 11-9 20-20 20H72l-26 22 4-22H38c-11 0-20-9-20-20z" />
        <path d="M66 46c0-9 7-15 15-15s15 6 15 15c0 7-5 10-10 13-3 2-5 4-5 8M81 80v.5" />
      </g>
      <g className="l-bob [animation-direction:reverse]">
        <path className="fill-[color:var(--l-bg-2)]" d="M222 88c0-11-9-20-20-20h-86c-11 0-20 9-20 20v52c0 11 9 20 20 20h52l26 22-4-22h12c11 0 20-9 20-20z" />
        <path d="M174 104c0-9-7-15-15-15s-15 6-15 15c0 7 5 10 10 13 3 2 5 4 5 8M159 138v.5" />
        <path d="M196 150h-9v-17l9 9z" className="fill-fasla-red" stroke="none" />
      </g>
    </svg>
  )
}

/**
 * "Honest questions." Eight questions beside a sticky heading. One answer is
 * open at a time, the first to begin with. Fasla has no Accordion in code
 * yet, so this one is landing-only: a button that controls a region.
 */
export function FaqSection() {
  const t = useTranslations("landing.faq")
  const items = t.raw("items") as Item[]
  const [open, setOpen] = useState(0)
  const [first, last] = (t.raw("title") as string).split("<br></br>")

  return (
    <section aria-labelledby="faq-h" className="border-y py-[var(--l-section)] bg-[color:var(--l-bg-2)]">
      <div className="l-wrap">
        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-[clamp(32px,7vw,120px)] max-[960px]:grid-cols-1">
          <div className="sticky top-[104px] flex flex-col gap-7 max-[960px]:static max-[960px]:flex-row max-[960px]:flex-wrap max-[960px]:items-end max-[960px]:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.16em] text-muted-foreground rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("kicker")}</p>
              <h2
                id="faq-h"
                className="mt-4 text-[length:clamp(46px,5.6vw,84px)] font-medium leading-none tracking-[-0.035em] rtl:font-semibold rtl:leading-[1.25] rtl:tracking-normal"
              >
                {first}
                <br />
                <Stroked text={last} />
              </h2>
            </div>
            <QuestionArt />
            <p className="text-sm text-[color:var(--l-fg-2)]">
              {t("ask")}{" "}
              <a href={landingLinks.discussions} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-[3px]">
                {t("askLink")}
              </a>
            </p>
          </div>

          <div className="border-t border-foreground/15">
            {items.map((item, i) => {
              const isOpen = open === i
              const n = String(i + 1).padStart(2, "0")
              return (
                <div key={n} className="border-b border-foreground/15">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q${n}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a${n}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="group grid w-full grid-cols-[36px_minmax(0,1fr)_24px] items-center gap-3.5 py-6 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground max-[560px]:grid-cols-[28px_minmax(0,1fr)_20px] max-[560px]:gap-2.5"
                    >
                      <span dir="ltr" className="font-mono text-xs text-muted-foreground">
                        {n}
                      </span>
                      <span className="text-[length:clamp(18px,1.6vw,23px)] font-medium leading-[1.3] tracking-[-0.015em] rtl:font-semibold rtl:tracking-normal">
                        {item.q}
                      </span>
                      {/* A plus that turns into a cross. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative size-[18px] justify-self-end transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] before:absolute before:inset-0 before:m-auto before:h-[1.5px] before:w-[15px] before:rounded-sm before:bg-current before:content-[''] after:absolute after:inset-0 after:m-auto after:h-[1.5px] after:w-[15px] after:rotate-90 after:rounded-sm after:bg-current after:content-['']",
                          isOpen ? "rotate-45 text-foreground" : "text-[color:var(--l-fg-2)] group-hover:text-foreground"
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-a${n}`}
                    role="region"
                    aria-labelledby={`faq-q${n}`}
                    className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    {/* A closed answer is out of the tab order and the accessibility tree. */}
                    <div
                      className="overflow-hidden"
                      ref={(el) => {
                        if (el) el.inert = !isOpen
                      }}
                    >
                      <div
                        className={cn(
                          "pb-[26px] pe-[38px] ps-[50px] transition-[opacity,transform] duration-500 max-[560px]:pe-0 max-[560px]:ps-[38px]",
                          isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                        )}
                      >
                        <p className="max-w-[62ch] text-[15px] leading-[1.7] text-[color:var(--l-fg-2)] rtl:leading-[1.9]">
                          {t.rich(`items.${i}.a`, {
                            link: (chunks) => (
                              <a href="#pricing" className="text-foreground underline decoration-foreground/30 underline-offset-[3px] hover:decoration-current">
                                {chunks}
                              </a>
                            ),
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
