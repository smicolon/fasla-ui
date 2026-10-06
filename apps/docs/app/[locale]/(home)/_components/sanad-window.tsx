import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { Button } from "@fasla-ui/ui/button/button"
import { Card } from "@fasla-ui/ui/card/card"
import { Select } from "@fasla-ui/ui/select/select"
import { PageHeader } from "@fasla-ui/blocks/page-header/PageHeader"
import { Sidebar, SidebarFooter, SidebarGroup, SidebarItem } from "@fasla-ui/blocks/sidebar/Sidebar"
import { StatsCard, StatsGrid } from "@fasla-ui/blocks/stats-card/StatsCard"
import { cn } from "@/lib/utils"
import {
  ArrowEndIcon,
  BagIcon,
  CardIcon,
  ChevronEndIcon,
  DownloadIcon,
  OverviewIcon,
  SettingsIcon,
  TargetIcon,
  TransactionsIcon,
  WalletIcon,
} from "./icons"
import { Initials } from "./initials"
import { SanadChart } from "./sanad-chart"
import { SanadTable } from "./sanad-table"
import { xrayTag as tag } from "./xray-tag"

/** Sidebar rows as the reference draws them: muted until active, the active one a raised pill. */
const navItem = "h-9 gap-2.5 px-2.5 py-0 font-normal text-foreground/70 hover:bg-muted hover:text-foreground"
const navActive = "border bg-card font-medium text-foreground shadow-sm hover:bg-card"

/**
 * Sanad, a fictional finance product, assembled from Fasla components. It is a
 * picture in the hero: XrayStage makes it inert and names it.
 */
export async function SanadWindow() {
  const t = await getTranslations("landing.sanad")
  const currency = { "--l-cur": `"${t("cur")}"` } as CSSProperties

  return (
    <div className="relative overflow-hidden rounded-2xl border border-foreground/15 bg-card text-start shadow-2xl [view-transition-name:product] [.is-xray_&]:overflow-visible">
      <div className="flex h-11 items-center gap-3.5 border-b bg-muted/50 px-4">
        <span dir="ltr" className="flex gap-[7px]">
          {[0, 1, 2].map((i) => (
            <i key={i} className="size-[11px] rounded-full bg-foreground/15" />
          ))}
        </span>
        <span className="flex flex-1 justify-center">
          <span dir="ltr" className="rounded-md border bg-background px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
            {t("url")}
          </span>
        </span>
      </div>

      <div className="grid min-h-[640px] grid-cols-[232px_minmax(0,1fr)] max-[1100px]:grid-cols-[200px_minmax(0,1fr)] max-[900px]:min-h-0 max-[900px]:grid-cols-1">
        <Sidebar
          {...tag("Sidebar", 0)}
          className="l-tag-in h-auto w-auto gap-1 bg-muted/50 px-3.5 py-[18px] [view-transition-name:p-side] max-[900px]:hidden"
        >
          <div className="flex items-center gap-2.5 px-2 pb-[18px] pt-1 text-base font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
              {t("mono")}
            </span>
            {t("brand")}
          </div>
          <SidebarItem active icon={<OverviewIcon />} className={cn(navItem, navActive)}>
            {t("nav1")}
          </SidebarItem>
          <SidebarItem icon={<TransactionsIcon />} className={navItem}>
            {t("nav2")}
          </SidebarItem>
          <SidebarItem icon={<CardIcon />} className={navItem}>
            {t("nav3")}
          </SidebarItem>
          <SidebarItem icon={<ArrowEndIcon />} className={navItem}>
            {t("nav4")}
          </SidebarItem>
          <SidebarItem icon={<TargetIcon />} className={navItem}>
            {t("nav5")}
          </SidebarItem>
          {/* The group label is uppercase in the library; the reference sets it as written. */}
          <SidebarGroup
            label={t("secAcc")}
            className="mt-2.5 [&>div:first-child]:mb-1 [&>div:first-child]:px-2.5 [&>div:first-child]:font-normal [&>div:first-child]:normal-case"
          >
            <SidebarItem icon={<SettingsIcon />} className={navItem}>
              {t("nav6")}
            </SidebarItem>
          </SidebarGroup>
          <SidebarFooter className="mt-auto flex items-center gap-2.5 px-2.5 pb-1 pt-3 text-[13px]">
            <Initials>{t("userIni")}</Initials>
            <span>
              {t("user")}
              {/* Isolated LTR, so the mask stays ahead of the digits in Arabic. */}
              <small className="block text-xs tabular-nums text-muted-foreground">
                <bdi dir="ltr">{t("card")}</bdi>
              </small>
            </span>
          </SidebarFooter>
        </Sidebar>

        <div className="flex min-w-0 flex-col gap-5 px-[clamp(16px,2.4vw,32px)] pb-8 pt-7 max-[560px]:gap-3.5 max-[560px]:px-3.5 max-[560px]:pb-5 max-[560px]:pt-[18px]">
          <PageHeader
            {...tag("PageHeader", 1, { space: "roomy" })}
            title={t("title")}
            description={t("greet")}
            headingLevel={3}
            bordered={false}
            className="bg-transparent p-0 md:p-0 [view-transition-name:p-head] [&>div]:items-center"
            actions={
              <>
                <span {...tag("Select", 2, { space: "tight" })} className="inline-flex max-[560px]:hidden">
                  <Select
                    selectSize="sm"
                    aria-label={t("rangeLabel")}
                    options={[{ value: "2025", label: t("range") }]}
                    defaultValue="2025"
                    className="bg-background tabular-nums"
                  />
                </span>
                <Button {...tag("Button", 3, { space: "tight" })} variant="outline" size="sm">
                  <DownloadIcon />
                  {t("export")}
                </Button>
              </>
            }
          />

          {/* StatsCard's value is text only, so landing.css draws the small
              currency before it from --l-cur (.l-cur). */}
          <StatsGrid columns={3} className="[view-transition-name:p-stats]">
            <StatsCard
              {...tag("StatsCard", 4, { style: currency })}
              title={t("s1")}
              value="184,320.50"
              icon={<WalletIcon />}
              trend={{ value: 4.2, direction: "up" }}
              description={t("vsNov")}
              className="l-cur p-5"
            />
            {/* Spending less is good news, so the change reads neutral, not red. */}
            <StatsCard
              {...tag("StatsCard", 5, { style: currency })}
              title={t("s2")}
              value="12,940"
              icon={<BagIcon />}
              trend={{ value: -3.1, direction: "neutral" }}
              description={t("vsNov")}
              className="l-cur p-5"
            />
            {/* StatsCard has no place for a bar, so this one is composed from Card
                in the same layout. Fasla has no Progress component yet. */}
            <Card {...tag("Card", 6)} className="p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("s3")}</p>
                  <p className="text-2xl font-bold">68%</p>
                </div>
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <TargetIcon />
                </div>
              </div>
              <div className="mb-2 mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[68%] rounded-full bg-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{t("goal")}</p>
            </Card>
          </StatsGrid>

          <Card {...tag("Card", 7)} className="px-5 pb-3 pt-[18px] [view-transition-name:p-chart]">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h4 className="text-[15px] font-semibold">{t("chartT")}</h4>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <i className="h-[3px] w-3.5 rounded-sm bg-chart-2" />
                {t("legend")}
              </span>
            </div>
            <SanadChart label={t("chartT")} months={t("months")} thousands={t("k")} tip={t("tip")} />
          </Card>

          <Card className="[view-transition-name:p-table]">
            <div className="flex items-center justify-between border-b px-5 py-3.5">
              <h4 className="text-[15px] font-semibold">{t("tblT")}</h4>
              <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground">
                {t("all")}
                <ChevronEndIcon className="size-3.5" />
              </span>
            </div>
            <SanadTable />
          </Card>
        </div>
      </div>
    </div>
  )
}
