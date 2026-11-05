"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { mahaamPhotoProps } from "@/components/blocks/mahaam-photos"

const MahaamTemplate = dynamic(() => import("@fasla-ui/templates/mahaam/mahaam-template").then((m) => m.MahaamTemplate))

/**
 * The whole Mahaam template, full width, and nothing else, for the docs page's
 * frames and for the full-page link. The page's `dir` and the locale come from
 * the route; the viewport is the frame's.
 */
export function MahaamTemplatePreview({ locale }: { locale: "en" | "ar" }) {
  return (
    <main className="w-full">
      <MahaamTemplate locale={locale} photos={mahaamPhotoProps} />
    </main>
  )
}
