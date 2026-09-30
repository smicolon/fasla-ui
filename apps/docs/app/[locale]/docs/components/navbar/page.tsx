"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarLink,
  NavbarToggle,
} from "@fasla-ui/blocks/navbar/Navbar"
import { ComponentPreview } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const LINKS = ["home", "products", "orders"] as const
const PARTS = [
  ["Navbar", "navbar"],
  ["NavbarBrand", "brand"],
  ["NavbarContent", "content"],
  ["NavbarMenu", "menu"],
  ["NavbarLink", "link"],
  ["NavbarItem", "item"],
  ["NavbarToggle", "toggle"],
] as const

export default function NavbarPage() {
  const t = useTranslations("docs.sections")
  const n = useTranslations("docs.navbar")
  const [open, setOpen] = useState(false)

  const props: PropRow[] = [
    { prop: "sticky", type: "boolean", fallback: "true", description: n.rich("props.sticky", richCode) },
    { prop: "bordered", type: "boolean", fallback: "true", description: n.rich("props.bordered", richCode) },
    { prop: "children", type: "ReactNode", fallback: "", description: n.rich("props.children", richCode) },
    { prop: "NavbarContent", type: '{ align: "start" | "center" | "end" }', fallback: "", description: n.rich("props.content", richCode) },
    { prop: "className", type: "string", fallback: "", description: n.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/navbar/" /></h1>
        <p className="text-xl text-muted-foreground">{n("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="navbar" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="w-full overflow-hidden rounded-md border">
            <Navbar sticky={false}>
              <NavbarBrand>
                <span className="font-semibold">{n("brand")}</span>
              </NavbarBrand>
              <NavbarContent align="end">
                <NavbarMenu mobileMenu>
                  {LINKS.map((link, i) => (
                    <NavbarLink key={link} href="#" active={i === 0}>
                      {n(`links.${link}`)}
                    </NavbarLink>
                  ))}
                </NavbarMenu>
                <NavbarToggle
                  open={open}
                  onClick={() => setOpen(!open)}
                  aria-label={open ? n("close") : n("open")}
                  aria-controls="navbar-preview-menu"
                />
              </NavbarContent>
            </Navbar>
            {/* NavbarMenu hides below md, so a narrow screen shows the links here instead */}
            {open && (
              <div id="navbar-preview-menu" className="flex flex-col gap-3 border-t bg-background p-4 md:hidden">
                {LINKS.map((link, i) => (
                  <NavbarLink key={link} href="#" active={i === 0}>
                    {n(`links.${link}`)}
                  </NavbarLink>
                ))}
              </div>
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("components")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {PARTS.map(([name, key]) => (
            <li key={name}>
              <code className="text-sm">{name}</code>: {n(`parts.${key}`)}
            </li>
          ))}
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>
    </div>
  )
}
