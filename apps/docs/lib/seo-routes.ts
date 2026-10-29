import type { Metadata } from "next"
import { locales, defaultLocale, type Locale } from "@/i18n/routing"
import { registryCounts } from "@/lib/registry"

export const SITE_URL = "https://fasla.smicolon.com"

export type ComponentCategory = "UI Primitives" | "Blocks" | "Effects"

type CoreRoute = {
  kind: "core"
  path: "/" | "/docs/" | "/docs/installation/" | "/docs/blocks/" | "/docs/blocks/installation/"
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

/**
 * A block family's page in the Blocks section: every Type of the family on one
 * page, each previewed in a frame so its breakpoints change.
 */
type BlockRoute = {
  kind: "block"
  path: `/docs/blocks/${string}/`
  title: string
  description: string
  h1: string
  category: "Blocks"
  ar?: { title: string; description: string; h1: string }
}

export type SeoRoute = CoreRoute | ComponentRoute | BlockRoute

export const routes = [
  {
    kind: "core",
    path: "/",
    title: "Fasla — Arabic‑first blocks, components & templates",
    description: `${registryCounts.total} accessible React components — primitives, application blocks and motion effects for Tailwind CSS. The CLI copies the source into your project. MIT-licensed core.`,
    h1: "Arabic‑first blocks, components & templates",
    ar: {
      title: "كتل ومكوّنات وقوالب، بالعربية أولًا | فاصلة",
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
    kind: "core",
    path: "/docs/blocks/",
    title: "Fasla Blocks: Ready-Made React Page Sections",
    description:
      "What a Fasla block is: a whole page section built from Fasla components, responsive, mirrored for Arabic and filled from props.",
    h1: "Introduction",
    ar: {
      title: "كتل فاصلة: أقسام صفحات جاهزة",
      description:
        "تعرّف على كتل فاصلة: أقسام صفحات كاملة مبنية من مكوّنات فاصلة، متجاوبة ومعكوسة للعربية، ويأتي محتواها من خصائصها.",
    },
  },
  {
    kind: "core",
    path: "/docs/blocks/installation/",
    title: "Install Fasla Blocks in a React Project",
    description:
      "Set the project up once with init, then add a block with one command that brings the components it uses, and the CSS for inverted blocks.",
    h1: "Installation",
    ar: {
      title: "ثبّت كتل فاصلة في مشروع React",
      description:
        "اضبط مشروعك مرة واحدة بالأمر init، ثم أضف الكتلة بأمر واحد يثبّت معها المكوّنات التي تستخدمها، مع ما تحتاجه الكتل المعكوسة من CSS.",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/faq/",
    title: "FAQ Blocks for React and Tailwind CSS | Fasla",
    description:
      "Twenty-six FAQ sections, from a centred accordion to search, topic tabs and a support chat, responsive and mirrored for Arabic.",
    h1: "FAQ",
    ar: {
      title: "كتل الأسئلة الشائعة لمشاريع React | فاصلة",
      description:
        "ستة وعشرون قسمًا للأسئلة الشائعة، من قائمة أسئلة في الوسط إلى البحث والتبويبات ومحادثة الدعم، متجاوبة ومعكوسة للعربية.",
      h1: "الأسئلة الشائعة (FAQ)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/error-state/",
    title: "Error State Blocks for React and Tailwind CSS | Fasla",
    description:
      "Twenty-eight error pages, from a centred 404 to a server error, no access, offline and maintenance, responsive and mirrored for Arabic.",
    h1: "Error State",
    ar: {
      title: "كتل حالة الخطأ لمشاريع React | فاصلة",
      description:
        "ثمانٍ وعشرون صفحة خطأ، من صفحة غير موجودة في الوسط إلى خطأ الخادم ورفض الوصول وانقطاع الاتصال والصيانة، متجاوبة ومعكوسة للعربية.",
      h1: "حالة الخطأ (Error State)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/logo-cloud/",
    title: "Logo Cloud Blocks for React and Tailwind CSS | Fasla",
    description:
      "Twenty-two logo sections, from a single row of customer marks to a full wall, quotes, figures and a sector filter, responsive and mirrored for Arabic.",
    h1: "Logo Cloud",
    ar: {
      title: "كتل سحابة الشعارات لمشاريع React | فاصلة",
      description:
        "اثنان وعشرون قسمًا لشعارات العملاء، من صف واحد إلى جدار كامل، مع اقتباسات وأرقام وتصفية حسب القطاع، متجاوبة ومعكوسة للعربية.",
      h1: "سحابة الشعارات (Logo Cloud)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/authentications/",
    title: "Authentication Blocks for React and Tailwind CSS | Fasla",
    description:
      "Twenty-six sign-in and account screens, from a centred sign-in card to codes, two-factor, password recovery and onboarding, responsive and mirrored for Arabic.",
    h1: "Authentications",
    ar: {
      title: "كتل تسجيل الدخول لمشاريع React | فاصلة",
      description:
        "ست وعشرون شاشة لتسجيل الدخول والحساب، من بطاقة دخول في الوسط إلى رموز التحقق والتحقق بخطوتين واستعادة كلمة المرور والإعداد الأول، متجاوبة ومعكوسة للعربية.",
      h1: "تسجيل الدخول (Authentications)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/gallery/",
    title: "Gallery Blocks for React and Tailwind CSS | Fasla",
    description:
      "Twenty-two photo galleries, from a captioned grid and a masonry wall to carousels, a lightbox and a before-and-after slider, responsive and mirrored for Arabic.",
    h1: "Gallery",
    ar: {
      title: "كتل معرض الصور لمشاريع React | فاصلة",
      description:
        "اثنان وعشرون معرضًا للصور، من شبكة بتسميات وجدار متدرّج إلى العروض المتحركة وعارض الصور ومنزلق المقارنة قبل وبعد، متجاوبة ومعكوسة للعربية.",
      h1: "معرض الصور (Gallery)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/navbar/",
    title: "Navbar Blocks for React and Tailwind CSS | Fasla",
    description:
      "Seventeen navigation bars, from a logo and links to floating pills, search, an account menu and a shop header, responsive and mirrored for Arabic.",
    h1: "Navbar",
    ar: {
      title: "كتل شريط التنقّل لمشاريع React | فاصلة",
      description:
        "سبعة عشر شريط تنقّل، من شعار وروابط إلى أشرطة عائمة وبحث وقائمة للحساب وترويسة متجر، متجاوبة ومعكوسة للعربية.",
      h1: "شريط التنقّل (Navbar)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/pricing/",
    title: "Pricing Blocks for React and Tailwind CSS | Fasla",
    description:
      "Five pricing sections, from tier cards with a billing toggle and two plans side by side to a full feature matrix and a checkout step, responsive and mirrored for Arabic.",
    h1: "Pricing",
    ar: {
      title: "كتل الأسعار لمشاريع React | فاصلة",
      description:
        "خمسة أقسام للأسعار، من بطاقات الخطط مع مبدّل للفوترة وخطتين متجاورتين إلى جدول كامل للميزات وخطوة للدفع، متجاوبة ومعكوسة للعربية.",
      h1: "الأسعار (Pricing)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/hero/",
    title: "Hero Blocks for React and Tailwind CSS | Fasla",
    description:
      "Twenty-nine landing-page heroes, from split layouts and photo-led openers to card grids and moving type, video and counters, responsive and mirrored for Arabic.",
    h1: "Hero",
    ar: {
      title: "كتل الأقسام الافتتاحية لمشاريع React | فاصلة",
      description:
        "تسعة وعشرون قسمًا افتتاحيًا لصفحات الهبوط، من التخطيطات المقسّمة والافتتاحيات المصوّرة إلى شبكات البطاقات والكتابة المتحركة والفيديو والعدّادات، متجاوبة ومعكوسة للعربية.",
      h1: "القسم الافتتاحي (Hero)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/about/",
    title: "About Blocks for React and Tailwind CSS | Fasla",
    description:
      "Sections that introduce a company: statements and photo heroes, stories and values, letters, culture walls and figures, responsive and mirrored for Arabic.",
    h1: "About",
    ar: {
      title: "كتل من نحن لمشاريع React | فاصلة",
      description:
        "أقسام تعرّف بالشركة: بيانات وواجهات بالصور، وقصص وقيم، ورسائل، وجدران للثقافة وأرقام، متجاوبة ومعكوسة للعربية.",
      h1: "من نحن (About)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/careers/",
    title: "Careers Blocks for React and Tailwind CSS | Fasla",
    description:
      "Sections for a careers page: open roles as lists, cards, teams, tables and accordions, with filtering and paging, responsive and mirrored for Arabic.",
    h1: "Careers",
    ar: {
      title: "كتل الوظائف لمشاريع React | فاصلة",
      description:
        "أقسام لصفحة الوظائف: الوظائف المتاحة في قوائم وبطاقات وفرق وجداول ومطويات، مع التصفية والتنقل بين الصفحات، متجاوبة ومعكوسة للعربية.",
      h1: "كتلة الوظائف (Careers)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/team/",
    title: "Team Blocks for React and Tailwind CSS | Fasla",
    description:
      "Fourteen team sections, from leadership grids, portrait walls and cut-out lineups to directories, tables, a carousel and a hiring call to action, responsive and mirrored for Arabic.",
    h1: "Team",
    ar: {
      title: "كتل الفريق لمشاريع React | فاصلة",
      description:
        "أربعة عشر قسمًا للفريق، من شبكات القيادة وجدران الصور وصفوف الصور المقصوصة إلى الأدلة والجداول وعارض الأعضاء ودعوة إلى التوظيف، متجاوبة ومعكوسة للعربية.",
      h1: "الفريق (Team)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/social-proof/",
    title: "Social Proof Blocks for React and Tailwind CSS | Fasla",
    description:
      "Testimonial sections, from quote grids and walls to spotlights, carousels and stories backed by a figure, responsive and mirrored for Arabic.",
    h1: "Social Proof",
    ar: {
      title: "كتل آراء العملاء لمشاريع React | فاصلة",
      description:
        "أقسام لآراء العملاء، من شبكات الاقتباسات وجدرانها إلى الاقتباسات البارزة وعارضات الشرائح والقصص التي يدعمها رقم، متجاوبة ومعكوسة للعربية.",
      h1: "آراء العملاء (Social Proof)",
    },
  },
  {
    kind: "block",
    category: "Blocks",
    path: "/docs/blocks/blog-cards/",
    title: "Blog Cards Blocks for React and Tailwind CSS | Fasla",
    description:
      "Sections that show articles to readers: card grids, lead features, lists, panels beside a post and browsing controls, responsive and mirrored for Arabic.",
    h1: "Blog Cards",
    ar: {
      title: "كتل بطاقات المدونة لمشاريع React | فاصلة",
      description:
        "أقسام تعرض المقالات للقرّاء: شبكات بطاقات ومقالات مميزة وقوائم ولوحات بجانب المقال وأدوات للتصفح، متجاوبة ومعكوسة للعربية.",
      h1: "بطاقات المدونة (Blog Cards)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/button/",
    title: "Button React Component | Fasla",
    description:
      "Add an accessible React button in five types and three tones, four sizes and two radii, with a loading state and a link that is always underlined.",
    h1: "Button",
    ar: {
      title: "زر (Button) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن زر بخمسة أنماط وثلاثة ألوان دلالية وأربعة أحجام وشكلين للزوايا، مع حالة تحميل ورابط تحته خط دائمًا.",
      h1: "زر (Button)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/icon-button/",
    title: "Icon Button React Component | Fasla",
    description:
      "Add an accessible square React icon button in four types and three tones, four sizes and two radii, with a warning when it has no accessible name.",
    h1: "Icon Button",
    ar: {
      title: "زر الأيقونة (Icon Button) لتطبيقات React | فاصلة",
      description:
        "أضف زر أيقونة مربّعًا بأربعة أنماط وثلاثة ألوان دلالية وأربعة أحجام وشكلين للزوايا، مع تحذير إذا لم يكن له اسم يقرؤه قارئ الشاشة.",
      h1: "زر الأيقونة (Icon Button)",
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
    path: "/docs/components/input-number/",
    title: "Input Number React Component | Fasla",
    description:
      "Add a React number field with step buttons in five layouts, min and max limits, keyboard stepping, Western digits and RTL.",
    h1: "Input Number",
    ar: {
      title: "حقل الإدخال الرقمي (Input Number) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن حقل الإدخال الرقمي (Input Number) لإدخال الأعداد، مع أزرار زيادة وإنقاص بخمسة تخطيطات، وحدّين أدنى وأعلى، وأرقام لاتينية في اللغتين.",
      h1: "حقل الإدخال الرقمي (Input Number)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/input-otp/",
    title: "OTP Input React Component | Fasla",
    description:
      "Add a React one-time code field with a slot per digit, SMS autofill, paste and four layouts, built on input-otp and mirrored for RTL.",
    h1: "OTP Input",
    ar: {
      title: "حقل الرمز (OTP Input) لتطبيقات React | فاصلة",
      description:
        "أضف حقل الرمز (OTP Input) لإدخال رموز التحقق، بخانة لكل رقم مع الملء التلقائي من الرسائل النصية واللصق وأربعة تخطيطات، ويمتلئ من اليمين في الصفحات العربية.",
      h1: "حقل الرمز (OTP Input)",
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
      "Build a React select field for choosing one option or several, with badges, labels, keyboard support and RTL.",
    h1: "Select",
    ar: {
      title: "حقل الاختيار (Select) لتطبيقات React | فاصلة",
      description:
        "أنشئ مكوّن حقل الاختيار (Select) لاختيار خيار واحد أو عدة خيارات، مع شارات وتسميات ودعم لوحة المفاتيح والاتجاه من اليمين إلى اليسار.",
      h1: "حقل الاختيار (Select)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/calendar/",
    title: "Calendar React Component | Fasla",
    description:
      "Add an accessible React calendar for choosing a day or a range across up to three months, with month and year menus and a mirrored RTL layout.",
    h1: "Calendar",
    ar: {
      title: "تقويم (Calendar) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن تقويم لاختيار يوم أو مدة على ما يصل إلى ثلاثة أشهر، مع قائمتين للشهر والسنة، وأسماء الأشهر بالعربية، وأسبوع يبدأ يوم السبت في الصفحات العربية.",
      h1: "تقويم (Calendar)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/date-picker/",
    title: "Date Picker React Component | Fasla",
    description:
      "Build a React date field that opens a calendar for one day or a range, with labels, helper text, four sizes, keyboard support and RTL.",
    h1: "Date Picker",
    ar: {
      title: "منتقي التاريخ (Date Picker) لتطبيقات React | فاصلة",
      description:
        "أنشئ حقلًا للتاريخ يفتح تقويمًا لاختيار يوم أو مدة، مع تسمية ونص مساعد وأربعة أحجام ودعم لوحة المفاتيح والاتجاه من اليمين إلى اليسار.",
      h1: "منتقي التاريخ (Date Picker)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/dropdown-menu/",
    title: "Dropdown Menu React Component | Fasla",
    description:
      "Add accessible React dropdown menus with icons, shortcuts, checkbox and radio items, switches and submenus, mirrored for RTL.",
    h1: "Dropdown Menu",
    ar: {
      title: "قائمة منسدلة (Dropdown Menu) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن قائمة منسدلة للإجراءات، مع أيقونات واختصارات وصفوف اختيار ومفاتيح تبديل وقوائم فرعية، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "قائمة منسدلة (Dropdown Menu)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/textarea/",
    title: "Textarea React Component | Fasla",
    description:
      "Add a multi-line React text field that grows with its text, with a label, helper text, a character counter, and validation states.",
    h1: "Textarea",
    ar: {
      title: "منطقة النص (Textarea) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن منطقة النص (Textarea) لكتابة نص من عدة أسطر يزداد ارتفاعه مع النص، مع تسمية ونص مساعد وعدّاد للأحرف وحالات التحقق.",
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
    path: "/docs/components/tooltip/",
    title: "Tooltip React Component | Fasla",
    description:
      "Add accessible React tooltips in six styles, with an arrow, description, icon or avatar, placed on any side and mirrored for RTL.",
    h1: "Tooltip",
    ar: {
      title: "تلميح (Tooltip) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن تلميح بستة أنماط، مع سهم ووصف وأيقونة أو صورة رمزية، في أي جهة من العنصر، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "تلميح (Tooltip)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/alert/",
    title: "Alert React Component | Fasla",
    description:
      "Show accessible React alerts for news, guidance, success, warnings and errors: three types, an action and a close button, mirrored for RTL.",
    h1: "Alert",
    ar: {
      title: "تنبيه (Alert) لتطبيقات React | فاصلة",
      description:
        "اعرض رسائل الأخبار والإرشاد والنجاح والتحذير والأخطاء بمكوّن تنبيه بثلاثة أنواع، مع زر إجراء وزر إغلاق، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "تنبيه (Alert)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/pagination/",
    title: "Pagination React Component | Fasla",
    description:
      "Page through long lists with accessible React pagination built on Button: three variants, four sizes, an ellipsis, mirrored for RTL.",
    h1: "Pagination",
    ar: {
      title: "التنقّل بين الصفحات (Pagination) لتطبيقات React | فاصلة",
      description:
        "تنقّل بين صفحات القوائم الطويلة بمكوّن مبني على الزر، بثلاثة أنماط وأربعة أحجام ونقاط ثلاث للصفحات المحذوفة، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "التنقّل بين الصفحات (Pagination)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/progress/",
    title: "Progress React Component | Fasla",
    description:
      "Show task completion with an accessible React progress bar in three sizes, with an optional percentage label, mirrored for RTL.",
    h1: "Progress",
    ar: {
      title: "شريط التقدم (Progress) لتطبيقات React | فاصلة",
      description:
        "اعرض نسبة إنجاز المهام بمكوّن شريط التقدم، بثلاثة أحجام مع تسمية اختيارية للنسبة المئوية، ويمتلئ من بداية السطر في الصفحات العربية.",
      h1: "شريط التقدم (Progress)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/steps/",
    title: "Steps React Component | Fasla",
    description:
      "Show progress through a multi-step flow with an accessible React stepper: done, current and upcoming steps, in a row or a column, mirrored for RTL.",
    h1: "Steps",
    ar: {
      title: "مؤشر الخطوات (Steps) لتطبيقات React | فاصلة",
      description:
        "اعرض تقدّم المستخدم في عملية من عدة خطوات بمكوّن مؤشر الخطوات، بخطوات مكتملة وحالية وقادمة، في صف أو عمود، وينعكس في الصفحات العربية.",
      h1: "مؤشر الخطوات (Steps)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/accordion/",
    title: "Accordion React Component | Fasla",
    description:
      "Add accessible React accordions in four styles, with a chevron or plus indicator, one or several items open, and mirrored for RTL.",
    h1: "Accordion",
    ar: {
      title: "الأكورديون (Accordion) لتطبيقات React | فاصلة",
      description:
        "أضف مكوّن أكورديون بأربعة أنماط، مع سهم أو علامة زائد، وعنصر مفتوح واحد أو أكثر، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "الأكورديون (Accordion)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/alert-dialog/",
    title: "Alert Dialog React Component | Fasla",
    description:
      "Ask users to confirm or cancel an action in an accessible React alert dialog, with a destructive style, an icon, extra content and RTL.",
    h1: "Alert Dialog",
    ar: {
      title: "حوار التنبيه (Alert Dialog) لتطبيقات React | فاصلة",
      description:
        "اطلب من المستخدم تأكيد إجراء أو إلغاءه بمكوّن حوار التنبيه، مع نمط للإجراءات الخطرة وأيقونة ومحتوى إضافي، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "حوار التنبيه (Alert Dialog)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/dialog/",
    title: "Dialog React Component | Fasla",
    description:
      "Collect input without leaving the page in an accessible React dialog: three widths, a back and close button, scrolling content and RTL.",
    h1: "Dialog",
    ar: {
      title: "نافذة منبثقة (Dialog) لتطبيقات React | فاصلة",
      description:
        "اجمع مدخلات المستخدم دون مغادرة الصفحة بمكوّن النافذة المنبثقة، بثلاثة أحجام وزرّي رجوع وإغلاق ومحتوى يتمرّر، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "نافذة منبثقة (Dialog)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/breadcrumb/",
    title: "Breadcrumb React Component | Fasla",
    description:
      "Show where a page sits with an accessible React breadcrumb: chevron or slash separators, optional icons, a collapsed trail, mirrored for RTL.",
    h1: "Breadcrumb",
    ar: {
      title: "مسار التنقّل (Breadcrumb) لتطبيقات React | فاصلة",
      description:
        "اعرض موقع الصفحة بمكوّن مسار التنقّل، بفاصل سهم أو شرطة مائلة وأيقونات اختيارية ومسار مختصر، وينعكس تلقائيًا في الصفحات العربية.",
      h1: "مسار التنقّل (Breadcrumb)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/sheet/",
    title: "Sheet React Component | Fasla",
    description:
      "Slide a panel in from any edge with an accessible React sheet: top, bottom, or start and end that follow the reading direction, mirrored for RTL.",
    h1: "Sheet",
    ar: {
      title: "لوحة منزلقة (Sheet) لتطبيقات React | فاصلة",
      description:
        "أضف لوحة تنزلق من أي حافة للشاشة: من الأعلى أو الأسفل، أو من البداية والنهاية اللتين تتبعان اتجاه القراءة، وتنعكس تلقائيًا في الصفحات العربية.",
      h1: "لوحة منزلقة (Sheet)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/slider/",
    title: "Slider React Component | Fasla",
    description:
      "Pick a value or a range by dragging a thumb with an accessible React slider in three sizes, with keyboard support, mirrored for RTL.",
    h1: "Slider",
    ar: {
      title: "شريط تحديد القيمة (Slider) لتطبيقات React | فاصلة",
      description:
        "اختر قيمة أو نطاقًا من القيم بسحب مقبض على مسار، بثلاثة أحجام مع دعم كامل للوحة المفاتيح، ويمتلئ المسار من بداية السطر في الصفحات العربية.",
      h1: "شريط تحديد القيمة (Slider)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/sidebar/",
    title: "Sidebar React Component | Fasla",
    description:
      "Add a React app sidebar that collapses to icons, with grouped links, sub-items, tooltips and right-to-left support.",
    h1: "Sidebar",
    ar: {
      title: "شريط جانبي (Sidebar) لتطبيقات React | فاصلة",
      description:
        "أضف إلى تطبيقك شريطًا جانبيًا للتنقّل ينطوي إلى أيقونات، مع مجموعات من الروابط وعناصر فرعية وتلميحات ودعم كامل للعربية.",
      h1: "شريط جانبي (Sidebar)",
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
      title: "حقل الاختيار بالبحث (Combobox) لتطبيقات React | فاصلة",
      description:
        "أنشئ مكوّن حقل الاختيار بالبحث (Combobox) لاختيار خيار واحد أو عدة خيارات، مع عناصر تحكم تراعي إتاحة الوصول (accessibility).",
      h1: "حقل الاختيار بالبحث (Combobox)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/carousel/",
    title: "Carousel React Component | Fasla",
    description:
      "Build an accessible React carousel on CSS scroll snapping, with a dot stepper, controlled state, and RTL support with no extra code.",
    h1: "Carousel",
    ar: {
      title: "عارض الشرائح (Carousel) لتطبيقات React | فاصلة",
      description:
        "ابنِ مكوّن عارض الشرائح (Carousel) على خاصية CSS scroll-snap، مع مؤشرات الشرائح وتحكم بالحالة ودعم كامل للعربية دون أي شيفرة إضافية.",
      h1: "عارض الشرائح (Carousel)",
    },
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/content-carousel/",
    title: "Content Carousel React Component | Fasla",
    description:
      "Show cards in a React content carousel with previous and next arrows, one to three slots per view, and accessible keyboard control.",
    h1: "Content Carousel",
    ar: {
      title: "عارض المحتوى (Content Carousel) لتطبيقات React | فاصلة",
      description:
        "اعرض البطاقات في مكوّن عارض المحتوى (Content Carousel) بسهمي تنقّل، ومن بطاقة إلى ثلاث بطاقات في العرض الواحد، مع تحكم كامل من لوحة المفاتيح.",
      h1: "عارض المحتوى (Content Carousel)",
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

/** The block family pages, under /docs/blocks/. */
export const blockRoutes = routes.filter(
  (route): route is Extract<(typeof routes)[number], { kind: "block" }> => route.kind === "block"
)

/**
 * The catalogue by category, for the docs landing and sidebar. Blocks lists
 * the block family pages first, then the application blocks that still live
 * under /docs/components/: they moved to the Blocks section with their URLs
 * unchanged.
 */
export const componentRouteGroups = (
  ["UI Primitives", "Blocks", "Effects"] as const
).map((category) => ({
  category,
  routes: [
    ...(category === "Blocks" ? blockRoutes : []),
    ...componentRoutes.filter((route) => route.category === category),
  ],
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
