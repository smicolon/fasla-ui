import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"
import { videoCallPhotoProps } from "../../../../docs/components/blocks/video-call-photos"

/**
 * For VideoCall.stories.tsx, beside it. The blocks bring their own English and
 * Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction. The photo
 * is one the repo already has, with alt text in the same language.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const videoCallViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/** The props that give a Type its demo photo, described in the toolbar's language. */
export const photoPropsOf = (type: string, context: StoryContext) => videoCallPhotoProps(type, localeOf(context))

/**
 * A line as long as the block's content limits allow, in each language, for
 * the Long text stories: it fills the slot to its measured maximum.
 */
export const LONG = {
  en: {
    heading: "Everything within thumb reach, on every screen size you ship",
    description:
      "One dock, three densities. Destructive actions stay isolated at the end so nobody leaves a call by accident, even when the call runs long and the team is tired.",
    speaker: "Adam Farouk-Al-Mansouri",
    caption: "— so the short version is we ship the lobby first, then the recording pipeline, and the rest waits for the next cycle.",
    reply: "Agreed. I'll take the lobby states and the device permission states, and Mona takes the rest of the list.",
  },
  ar: {
    heading: "كل شيء في متناول إبهامك على كل مقاس شاشة تطلقه",
    description:
      "شريط واحد بثلاث كثافات. تبقى الإجراءات الحرجة معزولة في الطرف حتى لا يخرج أحد من المكالمة بالخطأ، حتى حين تطول المكالمة ويتعب الفريق.",
    speaker: "آدم فاروق المنصوري",
    caption: "باختصار، نطلق غرفة الانتظار أولاً، ثم مسار التسجيل، وبقية القائمة تنتظر الدورة التالية بعد أن نراجع نتائج الأسبوع.",
    reply: "موافقة. سأتولى حالات غرفة الانتظار وحالات أذونات الأجهزة، وتتولى منى بقية القائمة كاملة.",
  },
} as const

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that
 * change nothing on screen beyond the shared rules, or that Controls can't
 * edit (a tuple of labels); `show` keeps a message row for a story that opens
 * on that state.
 */
export const videoCallArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = [], show: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide, show })
