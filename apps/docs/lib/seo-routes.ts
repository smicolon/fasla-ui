import type { Metadata } from "next"
import { locales, defaultLocale, type Locale } from "@/i18n/routing"
import { registryCounts } from "@/lib/registry"

export const SITE_URL = "https://ui.smicolon.com"

export type ComponentCategory = "UI Primitives" | "Blocks" | "Effects"

type CoreRoute = {
  kind: "core"
  path: "/" | "/docs/" | "/docs/installation/"
  title: string
  description: string
  h1: string
  /** Arabic title and description, for routes whose page body is Arabic on /ar. */
  ar?: { title: string; description: string }
}

/** Arabic counted noun, matching the plural forms of home.eyebrow in ar.json. */
function arabicComponentCount(count: number): string {
  const forms: Record<Intl.LDMLPluralRule, string> = {
    zero: "لا مكوّنات",
    one: "مكوّنًا واحدًا",
    two: "مكوّنين",
    few: `${count} مكوّنات`,
    many: `${count} مكوّنًا`,
    other: `${count} مكوّن`,
  }
  return forms[new Intl.PluralRules("ar").select(count)]
}

type ComponentRoute = {
  kind: "component"
  path: `/docs/components/${string}/`
  title: string
  description: string
  h1: string
  category: ComponentCategory
  /**
   * Arabic name, title and description, for component pages whose body is
   * Arabic on /ar. The name follows design/content/arabic-glossary.md.
   */
  ar?: { title: string; description: string; h1: string }
}

export type SeoRoute = CoreRoute | ComponentRoute

export const routes = [
  {
    kind: "core",
    path: "/",
    title: "Fasla — React Component Library by Smicolon GmbH",
    description: `${registryCounts.total} accessible React components — primitives, application blocks and motion effects for Tailwind CSS. The CLI copies the source into your project. MIT-licensed core.`,
    h1: "Add a component،own the source.",
    ar: {
      title: "مكتبة فاصلة لمكوّنات React من Smicolon GmbH",
      description: `مكتبة تضمّ ${arabicComponentCount(registryCounts.total)} تراعي الوصولية: مكوّنات أساسية وكتل تطبيقات وتأثيرات حركية مبنيّة على Tailwind CSS. تنسخ أداة الأوامر الشيفرة المصدرية إلى مشروعك. النواة برخصة MIT.`,
    },
  },
  {
    kind: "core",
    path: "/docs/",
    title: "Fasla Documentation: React Components and Blocks",
    description:
      "Explore Fasla documentation for reusable React primitives, application blocks, animated effects, and copy-paste implementation guidance.",
    h1: "Introduction",
    ar: {
      title: "توثيق فاصلة: مكوّنات React والكتل",
      description:
        "استكشف توثيق فاصلة: مكوّنات أساسية قابلة لإعادة الاستخدام، وكتل تطبيقات، وتأثيرات حركية، وإرشادات تطبيق جاهزة للنسخ واللصق.",
    },
  },
  {
    kind: "core",
    path: "/docs/installation/",
    title: "Install Fasla for React and Tailwind CSS",
    description:
      "Install Fasla with the CLI or manually, then configure React, TypeScript, Tailwind CSS, and the shared component utilities.",
    h1: "Installation",
    ar: {
      title: "ثبّت فاصلة في مشروع React مع Tailwind CSS",
      description:
        "ثبّت فاصلة بأداة الأوامر (CLI) أو يدويًا، ثم اضبط إعدادات Tailwind CSS والدالة المساعدة cn في مشروعك.",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/button/",
    title: "Button React Component | Fasla",
    description:
      "Add an accessible React button with visual variants, responsive sizes, loading feedback, and composable child rendering.",
    h1: "Button",
    ar: {
      title: "زر (Button) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن زر (Button) مع أنماط (variant) مرئية وأحجام متجاوبة وحالة تحميل، ويمكنك وضع عناصر أخرى داخله.",
      h1: "زر (Button)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/input/",
    title: "Input React Component | Fasla",
    description:
      "Use a typed React text input with validation states, icon support, accessible focus styles, and Tailwind customization.",
    h1: "Input",
    ar: {
      title: "حقل الإدخال (Input) لتطبيقات React | فاصلة",
      description:
        "استخدم مكوّن حقل الإدخال (Input) لإدخال النص، مع حالات التحقق والأيقونات وحلقة تركيز واضحة، وتخصيص سهل عبر Tailwind.",
      h1: "حقل الإدخال (Input)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/card/",
    title: "Card React Component | Fasla",
    description:
      "Compose React card layouts from accessible header, title, description, content, and footer building blocks.",
    h1: "Card",
    ar: {
      title: "بطاقة (Card) لتطبيقات React | فاصلة",
      description:
        "ركّب مكوّن بطاقة (Card) من أجزاء جاهزة تراعي إتاحة الوصول (accessibility): الرأس والعنوان والوصف والمحتوى والتذييل.",
      h1: "بطاقة (Card)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/badge/",
    title: "Badge React Component | Fasla",
    description:
      "Display compact React status indicators and labels with reusable badge variants and semantic Tailwind styling.",
    h1: "Badge",
    ar: {
      title: "شارة (Badge) لتطبيقات React | فاصلة",
      description:
        "اعرض حالات وتسميات قصيرة بمكوّن شارة (Badge)، بأنماط (variant) قابلة لإعادة الاستخدام وألوان دلالية من Tailwind.",
      h1: "شارة (Badge)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/skeleton/",
    title: "Skeleton Loading Components for React | Fasla",
    description:
      "Create accessible React loading placeholders for text, avatars, cards, and custom content layouts with Fasla skeletons.",
    h1: "Skeleton",
    ar: {
      title: "هيكل التحميل (Skeleton) لتطبيقات React | فاصلة",
      description:
        "اعرض عناصر نائبة أثناء التحميل بمكوّن هيكل التحميل (Skeleton)، للنصوص والصور الرمزية والبطاقات وأي تخطيط آخر.",
      h1: "هيكل التحميل (Skeleton)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/avatar/",
    title: "Avatar React Component | Fasla",
    description:
      "Represent people with a React avatar: photo, initials or icon fallback, three sizes, an optional border and a presence dot.",
    h1: "Avatar",
    ar: {
      title: "صورة رمزية (Avatar) لتطبيقات React | فاصلة",
      description:
        "مثّل الأشخاص بمكوّن صورة رمزية (Avatar): صورة شخصية أو أحرف أولى أو أيقونة بديلة، بثلاثة أحجام، مع إطار ونقطة حالة اختياريين.",
      h1: "صورة رمزية (Avatar)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/status-indicator/",
    title: "Status Indicator React Component | Fasla",
    description:
      "Show online, away, busy or offline presence with a React status dot whose accessible name follows the page language.",
    h1: "Status Indicator",
    ar: {
      title: "مؤشر الحالة (Status Indicator) لتطبيقات React | فاصلة",
      description:
        "اعرض حالة الاتصال بمكوّن مؤشر الحالة (Status Indicator): متصل أو غائب أو مشغول أو غير متصل، باسم يتبع لغة الصفحة.",
      h1: "مؤشر الحالة (Status Indicator)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/checkbox/",
    title: "Checkbox React Component | Fasla",
    description:
      "Add an accessible React checkbox for binary selections with controlled state, labels, and keyboard interaction.",
    h1: "Checkbox",
    ar: {
      title: "خانة الاختيار (Checkbox) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن خانة الاختيار (Checkbox) للاختيارات الثنائية، مع التحكم بالحالة وتسمية واضحة ودعم لوحة المفاتيح.",
      h1: "خانة الاختيار (Checkbox)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/radio/",
    title: "Radio React Component | Fasla",
    description:
      "Add an accessible React radio for choosing one option from a set, with a plain control, a bordered card layout, and full RTL support.",
    h1: "Radio",
    ar: {
      title: "زر الاختيار (Radio) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن زر الاختيار (Radio) ليحدّد المستخدم خيارًا واحدًا من مجموعة خيارات. يأتي بنمطين (variant): بسيط، وبطاقة بإطار، ويدعم الكتابة العربية واتجاهها بالكامل.",
      h1: "زر الاختيار (Radio)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/switch/",
    title: "Switch React Component | Fasla",
    description:
      "Use an accessible React switch for on-off settings with controlled state, keyboard support, and clear visual feedback.",
    h1: "Switch",
    ar: {
      title: "مفتاح التبديل (Switch) لتطبيقات React | فاصلة",
      description:
        "استخدم مكوّن مفتاح التبديل (Switch) لإعدادات التشغيل والإيقاف، مع التحكم بالحالة ودعم لوحة المفاتيح ومؤشر مرئي واضح.",
      h1: "مفتاح التبديل (Switch)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/select/",
    title: "Select React Component | Fasla",
    description:
      "Build a typed React select control for choosing one option with accessible interaction and customizable styling.",
    h1: "Select",
    ar: {
      title: "قائمة منسدلة (Select) لتطبيقات React | فاصلة",
      description:
        "أنشئ مكوّن قائمة منسدلة (Select) لاختيار خيار واحد، مع تفاعل يراعي إتاحة الوصول (accessibility) وتنسيق قابل للتخصيص.",
      h1: "قائمة منسدلة (Select)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/textarea/",
    title: "Textarea React Component | Fasla",
    description:
      "Add a multi-line React text input with character counting, resize options, validation states, and accessible labels.",
    h1: "Textarea",
    ar: {
      title: "منطقة النص (Textarea) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن منطقة النص (Textarea) لإدخال نص متعدد الأسطر، مع عدّاد للأحرف وخيارات لتغيير الحجم وحالات التحقق.",
      h1: "منطقة النص (Textarea)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/tabs/",
    title: "Tabs React Component | Fasla",
    description:
      "Organize related React content into accessible tab lists, triggers, and keyboard-navigable panels.",
    h1: "Tabs",
    ar: {
      title: "علامات التبويب (Tabs) لتطبيقات React | فاصلة",
      description:
        "نظّم المحتوى المترابط بمكوّن علامات التبويب (Tabs)، مع قوائم وأزرار ولوحات تتنقّل بينها بلوحة المفاتيح.",
      h1: "علامات التبويب (Tabs)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/combobox/",
    title: "Combobox React Component | Fasla",
    description:
      "Create a searchable React combobox with single or multiple selection, accessible controls, and typed options.",
    h1: "Combobox",
    ar: {
      title: "قائمة منسدلة بالبحث (Combobox) لتطبيقات React | فاصلة",
      description:
        "أنشئ مكوّن قائمة منسدلة بالبحث (Combobox) لاختيار خيار واحد أو عدة خيارات، مع عناصر تحكم تراعي إتاحة الوصول (accessibility).",
      h1: "قائمة منسدلة بالبحث (Combobox)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/app-shell/",
    title: "App Shell React Layout | Fasla",
    description:
      "Structure React applications with a responsive app shell that composes navigation, sidebars, headers, and main content.",
    h1: "AppShell",
    ar: {
      title: "إطار التطبيق (AppShell) لتطبيقات React | فاصلة",
      description:
        "نظّم تطبيقك بكتلة إطار التطبيق (AppShell)، وهي تخطيط متجاوب يجمع التنقّل والشريط الجانبي والرأس والمحتوى الرئيسي.",
      h1: "إطار التطبيق (AppShell)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/page-header/",
    title: "Page Header React Block | Fasla",
    description:
      "Build consistent React page headers with titles, descriptions, breadcrumbs, and responsive action areas.",
    h1: "PageHeader",
    ar: {
      title: "رأس الصفحة (PageHeader) لتطبيقات React | فاصلة",
      description:
        "ابنِ رؤوس صفحات متّسقة بكتلة رأس الصفحة (PageHeader)، مع العنوان والوصف ومسار التنقّل (breadcrumb) ومنطقة للإجراءات.",
      h1: "رأس الصفحة (PageHeader)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/empty-state/",
    title: "Empty State React Block | Fasla",
    description:
      "Explain empty React views with contextual icons, helpful descriptions, search variants, and clear next actions.",
    h1: "EmptyState",
    ar: {
      title: "حالة فارغة (EmptyState) لتطبيقات React | فاصلة",
      description:
        "اشرح الشاشات الفارغة بكتلة حالة فارغة (EmptyState)، مع أيقونة ووصف مفيد وخطوة تالية واضحة.",
      h1: "حالة فارغة (EmptyState)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/form-section/",
    title: "Form Section React Block | Fasla",
    description:
      "Group related React form fields with headings, descriptions, validation-ready layout, and aligned action controls.",
    h1: "FormSection",
    ar: {
      title: "قسم النموذج (FormSection) لتطبيقات React | فاصلة",
      description:
        "اجمع حقول النموذج المترابطة بكتلة قسم النموذج (FormSection)، مع عنوان ووصف وتخطيط جاهز للتحقق وأزرار إجراءات مصطفّة.",
      h1: "قسم النموذج (FormSection)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/data-table/",
    title: "Data Table React Block | Fasla",
    description:
      "Present structured React data with typed columns, pagination, responsive controls, and reusable table states.",
    h1: "DataTable",
    ar: {
      title: "جدول البيانات (DataTable) لتطبيقات React | فاصلة",
      description:
        "اعرض بيانات منظّمة بكتلة جدول البيانات (DataTable)، مع أعمدة محددة الأنواع وترقيم للصفحات وحالات جاهزة للجدول.",
      h1: "جدول البيانات (DataTable)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/sidebar/",
    title: "Sidebar React Navigation Block | Fasla",
    description:
      "Add a responsive React sidebar for application navigation with collapsible structure and accessible links.",
    h1: "Sidebar",
    ar: {
      title: "شريط جانبي (Sidebar) لتطبيقات React | فاصلة",
      description:
        "أضف كتلة شريط جانبي (Sidebar) متجاوبة لتنقّل تطبيقك، مع بنية قابلة للطي وروابط تراعي إتاحة الوصول (accessibility).",
      h1: "شريط جانبي (Sidebar)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/navbar/",
    title: "Navbar React Navigation Block | Fasla",
    description:
      "Create a responsive React navigation bar with desktop links, mobile menu behavior, and flexible brand content.",
    h1: "Navbar",
    ar: {
      title: "شريط التنقّل (Navbar) لتطبيقات React | فاصلة",
      description:
        "أنشئ كتلة شريط التنقّل (Navbar) متجاوبة، مع روابط لسطح المكتب وقائمة للهاتف ومساحة مرنة لهوية المنتج.",
      h1: "شريط التنقّل (Navbar)",
    },
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/stats-card/",
    title: "Stats Card React Block | Fasla",
    description:
      "Display key React dashboard metrics with trend indicators, supporting context, icons, and consistent card layout.",
    h1: "Stats Card",
    ar: {
      title: "بطاقة الإحصاءات (Stats Card) لتطبيقات React | فاصلة",
      description:
        "اعرض المقاييس الأساسية للوحة التحكم بكتلة بطاقة الإحصاءات (Stats Card)، مع مؤشرات الاتجاه والسياق والأيقونات.",
      h1: "بطاقة الإحصاءات (Stats Card)",
    },
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/shimmer-button/",
    title: "Shimmer Button React Effect | Fasla",
    description:
      "Draw attention to React calls to action with a polished shimmer animation that respects reduced-motion preferences.",
    h1: "Shimmer Button",
    ar: {
      title: "زر اللمعان (Shimmer Button) لتطبيقات React | فاصلة",
      description:
        "اجذب الانتباه إلى أزرار الإجراء الرئيسية بتأثير زر اللمعان (Shimmer Button)، بحركة لمعان تحترم إعداد تقليل الحركة.",
      h1: "زر اللمعان (Shimmer Button)",
    },
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/animated-gradient/",
    title: "Animated Gradient React Effect | Fasla",
    description:
      "Add a configurable animated gradient background to React hero sections and cards with smooth motion behavior.",
    h1: "AnimatedGradient",
    ar: {
      title: "تدرّج متحرك (AnimatedGradient) لتطبيقات React | فاصلة",
      description:
        "أضف خلفية بتأثير تدرّج متحرك (AnimatedGradient) إلى الأقسام الرئيسية والبطاقات، بحركة سلسة قابلة للضبط.",
      h1: "تدرّج متحرك (AnimatedGradient)",
    },
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/text-reveal/",
    title: "Text Reveal React Effect | Fasla",
    description:
      "Reveal React text character by character with reusable animation controls and reduced-motion support.",
    h1: "TextReveal",
    ar: {
      title: "ظهور النص (TextReveal) لتطبيقات React | فاصلة",
      description:
        "أظهر النص حرفًا حرفًا بتأثير ظهور النص (TextReveal)، مع عناصر تحكم بالحركة ودعم تقليل الحركة.",
      h1: "ظهور النص (TextReveal)",
    },
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/border-beam/",
    title: "Border Beam React Effect | Fasla",
    description:
      "Highlight React cards and containers with a configurable animated beam that travels around the border.",
    h1: "BorderBeam",
    ar: {
      title: "شعاع الإطار (BorderBeam) لتطبيقات React | فاصلة",
      description:
        "أبرز البطاقات والحاويات بتأثير شعاع الإطار (BorderBeam)، وهو شعاع متحرك قابل للضبط يدور حول الإطار.",
      h1: "شعاع الإطار (BorderBeam)",
    },
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/spotlight/",
    title: "Spotlight React Effect | Fasla",
    description:
      "Create cursor-responsive spotlight backgrounds for React interfaces with controlled glow and positioning.",
    h1: "Spotlight",
    ar: {
      title: "بقعة الضوء (Spotlight) لتطبيقات React | فاصلة",
      description:
        "أنشئ خلفيات تتبع المؤشر في واجهاتك بتأثير بقعة الضوء (Spotlight)، مع التحكم بالتوهج وموضعه.",
      h1: "بقعة الضوء (Spotlight)",
    },
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/typewriter-text/",
    title: "Typewriter Text React Effect | Fasla",
    description:
      "Animate React copy with a configurable typewriter sequence for product messages, headings, and demonstrations.",
    h1: "Typewriter Text",
    ar: {
      title: "نص الآلة الكاتبة (Typewriter Text) لتطبيقات React | فاصلة",
      description:
        "حرّك النصوص بتأثير نص الآلة الكاتبة (Typewriter Text)، لرسائل المنتج والعناوين والعروض التوضيحية.",
      h1: "نص الآلة الكاتبة (Typewriter Text)",
    },
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/glow-card/",
    title: "Glow Card React Effect | Fasla",
    description:
      "Build interactive React cards with pointer-following glow effects, layered content, and adaptable surface styling.",
    h1: "Glow Card",
    ar: {
      title: "بطاقة متوهجة (Glow Card) لتطبيقات React | فاصلة",
      description:
        "ابنِ بطاقات تفاعلية بتأثير بطاقة متوهجة (Glow Card)، مع توهج يتبع المؤشر ومحتوى متعدد الطبقات.",
      h1: "بطاقة متوهجة (Glow Card)",
    },
  },
] as const satisfies readonly SeoRoute[]

export type RoutePath = (typeof routes)[number]["path"]

export const componentRoutes = routes.filter(
  (route): route is Extract<(typeof routes)[number], { kind: "component" }> =>
    route.kind === "component"
)

export const componentRouteGroups = (
  ["UI Primitives", "Blocks", "Effects"] as const
).map((category) => ({
  category,
  routes: componentRoutes.filter((route) => route.category === category),
}))

/**
 * The name and description a component route shows in the sidebar and on the
 * /docs/ landing: Arabic on /ar when the route has an `ar` block, else English.
 */
export function routeText(
  route: { h1: string; description: string; ar?: { h1: string; description: string } },
  locale: Locale
): { h1: string; description: string } {
  return locale === "ar" && route.ar ? route.ar : route
}

/** Every route exists once per locale, so the canonical carries the prefix. */
export function localisedPath(path: RoutePath, locale: Locale): string {
  return `/${locale}${path === "/" ? "/" : path}`.replace(/\/{2,}/g, "/")
}

export function metadataForRoute(path: RoutePath, locale: Locale = defaultLocale): Metadata {
  const route = routes.find((candidate) => candidate.path === path)

  if (!route) {
    throw new Error(`Unknown canonical route: ${path}`)
  }

  const canonical = new URL(localisedPath(path, locale), SITE_URL).toString()
  // A page without an `ar` block is still English on /ar, so its metadata
  // stays English there too, matching the page it describes.
  const { title, description } =
    locale === "ar" && "ar" in route && route.ar ? route.ar : route

  // hreflang tells a crawler these are the same page in another language, and
  // x-default names the one to serve when no language matches.
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, new URL(localisedPath(path, l), SITE_URL).toString()]),
  )
  languages["x-default"] = new URL(localisedPath(path, defaultLocale), SITE_URL).toString()
  // The RTL lockup is its own drawing, not a mirrored copy, so each direction
  // shares its own card.
  const image = new URL(
    locale === "ar" ? "/brand/fasla-og-rtl.png" : "/brand/fasla-og.png",
    SITE_URL,
  ).toString()

  return {
    title,
    description,
    alternates: { canonical, languages },
    icons: {
      icon: [
        { url: "/brand/fasla-favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "48x48" },
      ],
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      url: canonical,
      siteName: "Fasla",
      images: [{ url: image, alt: locale === "ar" ? "فاصلة من Smicolon" : "Fasla by Smicolon" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
