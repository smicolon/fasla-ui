import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Combobox, ComboboxOption } from "../../../../packages/fasla-ui/registry/ui/combobox"

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Combobox>

/**
 * Sample copy, per script. Option values stay Latin identifiers; labels,
 * placeholders and the component's own text change. The Arabic follows
 * design/content/.
 */
const COPY = {
  ltr: {
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "solid", label: "Solid" },
      { value: "qwik", label: "Qwik" },
      { value: "next", label: "Next.js" },
      { value: "nuxt", label: "Nuxt" },
      { value: "astro", label: "Astro" },
    ] as ComboboxOption[],
    first: "react",
    second: "next",
    select: "Select framework...",
    searchFrameworks: "Search frameworks...",
    selectMany: "Select frameworks...",
    create: "Select or create...",
    createTags: "Select or create tags...",
    disabled: "Disabled...",
    loading: "Loading...",
    someDisabled: "Some options disabled...",
    disabledOption: "Disabled Option",
    anotherDisabled: "Another Disabled",
    text: {},
  },
  rtl: {
    options: [
      { value: "sa", label: "السعودية" },
      { value: "ae", label: "الإمارات" },
      { value: "eg", label: "مصر" },
      { value: "jo", label: "الأردن" },
      { value: "ma", label: "المغرب" },
      { value: "kw", label: "الكويت" },
      { value: "qa", label: "قطر" },
      { value: "om", label: "عُمان" },
      { value: "bh", label: "البحرين" },
    ] as ComboboxOption[],
    first: "sa",
    second: "qa",
    select: "اختر دولة…",
    searchFrameworks: "ابحث عن دولة…",
    selectMany: "اختر دول الشحن…",
    create: "اختر دولة أو أضف واحدة…",
    createTags: "اختر وسومًا أو أضف واحدًا…",
    disabled: "الدولة محددة من حسابك",
    loading: "جارٍ تحميل الدول…",
    someDisabled: "بعض الدول غير متاحة للشحن…",
    disabledOption: "لبنان، قريبًا",
    anotherDisabled: "العراق، قريبًا",
    text: {
      searchPlaceholder: "ابحث…",
      emptyText: "لا توجد دولة مطابقة.",
      createText: "إضافة",
      loadingText: "جارٍ التحميل…",
      openLabel: "فتح القائمة",
      closeLabel: "إغلاق القائمة",
      removeLabel: (label: string) => `إزالة ${label}`,
    },
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [value, setValue] = useState<string>("")
    return (
      <div className="w-[300px]">
        <Combobox
          options={c.options} {...c.text}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder={c.select}
        />
      </div>
    )
  },
}

export const WithSearch: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [value, setValue] = useState<string>(c.first)
    return (
      <div className="w-[300px]">
        <Combobox
          options={c.options} {...c.text}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder={c.select}
          searchPlaceholder={c.searchFrameworks}
        />
      </div>
    )
  },
}

export const Multiple: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [value, setValue] = useState<string[]>([c.first, c.second])
    return (
      <div className="w-[300px]">
        <Combobox
          options={c.options} {...c.text}
          value={value}
          onChange={(v) => setValue(v as string[])}
          placeholder={c.selectMany}
          multiple
        />
      </div>
    )
  },
}

export const Creatable: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [options, setOptions] = useState<ComboboxOption[]>(c.options)
    const [value, setValue] = useState<string>("")

    return (
      <div className="w-[300px]">
        <Combobox
          options={options} {...c.text}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder={c.create}
          creatable
          onCreate={(newValue) => {
            const newOption = { value: newValue.toLowerCase(), label: newValue }
            setOptions([...options, newOption])
            setValue(newOption.value)
          }}
        />
      </div>
    )
  },
}

export const CreatableMultiple: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [options, setOptions] = useState<ComboboxOption[]>(c.options)
    const [value, setValue] = useState<string[]>([])

    return (
      <div className="w-[300px]">
        <Combobox
          options={options} {...c.text}
          value={value}
          onChange={(v) => setValue(v as string[])}
          placeholder={c.createTags}
          multiple
          creatable
          onCreate={(newValue) => {
            const newOption = { value: newValue.toLowerCase(), label: newValue }
            setOptions([...options, newOption])
            setValue([...value, newOption.value])
          }}
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="w-[300px]">
        <Combobox options={c.options} {...c.text} value={c.first} placeholder={c.disabled} disabled />
      </div>
    )
  },
}

export const Loading: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="w-[300px]">
        <Combobox options={[]} {...c.text} placeholder={c.loading} loading />
      </div>
    )
  },
}

export const WithDisabledOptions: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [value, setValue] = useState<string>("")
    const optionsWithDisabled: ComboboxOption[] = [
      ...c.options.slice(0, 3),
      { value: "disabled1", label: c.disabledOption, disabled: true },
      ...c.options.slice(3, 6),
      { value: "disabled2", label: c.anotherDisabled, disabled: true },
      ...c.options.slice(6),
    ]

    return (
      <div className="w-[300px]">
        <Combobox
          options={optionsWithDisabled} {...c.text}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder={c.someDisabled}
        />
      </div>
    )
  },
}
