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
    meeting: "Design sync — weekly planning and launch",
    person: "Yasmin Haddad-Mansouri (you)",
    slide: "Q3 activation funnel and plan",
    panelTitle: "In this meeting, everyone invited",
    role: "Co-host and note taker",
  },
  ar: {
    heading: "كل شيء في متناول إبهامك على كل مقاس شاشة تطلقه",
    description:
      "شريط واحد بثلاث كثافات. تبقى الإجراءات الحرجة معزولة في الطرف حتى لا يخرج أحد من المكالمة بالخطأ، حتى حين تطول المكالمة ويتعب الفريق.",
    speaker: "آدم فاروق المنصوري",
    caption: "باختصار، نطلق غرفة الانتظار أولاً، ثم مسار التسجيل، وبقية القائمة تنتظر الدورة التالية بعد أن نراجع نتائج الأسبوع.",
    reply: "موافقة. سأتولى حالات غرفة الانتظار وحالات أذونات الأجهزة، وتتولى منى بقية القائمة كاملة.",
    meeting: "مزامنة التصميم الأسبوعية وخطة الإطلاق",
    person: "ياسمين حداد المنصوري (أنت)",
    slide: "مسار التنشيط وخطة الربع الثالث",
    panelTitle: "في هذا الاجتماع، كل المدعوين",
    role: "منظّم مشارك وكاتب المحضر",
  },
} as const

/**
 * Props that only assistive technology reads (an aria-label, a tooltip, an
 * alt): changing one moves nothing on screen, so they have no Controls row in
 * any Video Call story. The docs-site Props table still describes them.
 */
const ASSISTIVE = [
  "pinLabel", "tileLabel", "thumbLabel", "playLabel", "ratingLabel", "starLabel", "chipsLabel", "admitLabel", "denyLabel",
  "moreLabel", "listLabel", "downloadLabel", "shareRecordingLabel", "qrLabel", "pickerLabel", "pillLabel", "clearHand",
  "selfPreview", "fullscreen", "people", "label", "settings",
]

/**
 * Messages a Type shows only once the visitor acts (stops the share, holds
 * Leave, copies the link, opens the QR, shares the recap) or while the camera
 * is pending. A row for them changes nothing until then, so only the story
 * that opens on that state lists the prop in `show`.
 */
const AFTER_ACTION = ["stopped", "start", "leaveConfirm", "leaveHint", "joining", "copied", "hideQr", "sharedToast"]

/** The ids of a list of people, meetings or moments, for a select that offers only the valid ones. */
export const idsOf = (items: readonly { id: string }[] = []) => items.map((item) => item.id)

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family, plus the Video Call rules above. `hide`
 * lists this story's props that change nothing on screen beyond the shared
 * rules, or that Controls can't edit (a tuple of labels); `show` keeps a
 * message row for a story that opens on that state; `selects` turns a prop
 * with a few valid values into a select with exactly those options.
 */
export const videoCallArgTypes = (
  component: unknown,
  copy?: BlockCopy,
  hide: string[] = [],
  show: string[] = [],
  selects: Record<string, readonly (string | number)[]> = {}
): ArgTypes => {
  const argTypes = blockArgTypes(component, copy, {
    hide: [...hide, ...ASSISTIVE, ...AFTER_ACTION.filter((name) => !show.includes(name))],
    show,
  })
  for (const [name, options] of Object.entries(selects)) {
    if (argTypes[name] && !argTypes[name].table?.disable) argTypes[name] = { ...argTypes[name], control: "select", options: [...options] }
  }
  return argTypes
}
