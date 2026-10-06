import { getTranslations } from "next-intl/server"
import { Avatar } from "@fasla-ui/ui/avatar/avatar"
import { Button } from "@fasla-ui/ui/button/button"
import { Card } from "@fasla-ui/ui/card/card"
import { Select } from "@fasla-ui/ui/select/select"
import { PageHeader } from "@fasla-ui/blocks/page-header/PageHeader"
import { Sidebar, SidebarFooter, SidebarGroup, SidebarItem } from "@fasla-ui/blocks/sidebar/Sidebar"
import { StatsCard, StatsGrid } from "@fasla-ui/blocks/stats-card/StatsCard"
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
import { SanadChart } from "./sanad-chart"
import { SanadTable } from "./sanad-table"
import { xrayTag as tag } from "./xray-tag"

/**
 * Sanad, a fictional finance product, assembled from Fasla components. It is a
 * picture in the hero: XrayStage makes it inert and names it.
 */
export async function SanadWindow() {
  const t = await getTranslations("landing.sanad")

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
          <SidebarItem active icon={<OverviewIcon />}>
            {t("nav1")}
          </SidebarItem>
          <SidebarItem icon={<TransactionsIcon />}>{t("nav2")}</SidebarItem>
          <SidebarItem icon={<CardIcon />}>{t("nav3")}</SidebarItem>
          <SidebarItem icon={<ArrowEndIcon />}>{t("nav4")}</SidebarItem>
          <SidebarItem icon={<TargetIcon />}>{t("nav5")}</SidebarItem>
          <SidebarGroup label={t("secAcc")} className="mt-2.5">
            <SidebarItem icon={<SettingsIcon />}>{t("nav6")}</SidebarItem>
          </SidebarGroup>
          <SidebarFooter className="mt-auto flex items-center gap-2.5 px-2.5 pb-1 pt-3 text-[13px]">
            <Avatar variant="initials" name={t("user")} radius="rounded" />
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
            {...tag("PageHeader", 1)}
            title={t("title")}
            description={t("greet")}
            headingLevel={3}
            bordered={false}
            className="bg-transparent p-0 md:p-0 [view-transition-name:p-head]"
            actions={
              <>
                <span {...tag("Select", 2)} className="inline-flex max-[560px]:hidden">
                  <Select
                    selectSize="sm"
                    aria-label={t("rangeLabel")}
                    options={[{ value: "2025", label: t("range") }]}
                    defaultValue="2025"
                    className="bg-background tabular-nums"
                  />
                </span>
                <Button {...tag("Button", 3)} variant="outline" size="sm">
                  <DownloadIcon />
                  {t("export")}
                </Button>
              </>
            }
          />

          <StatsGrid columns={3} className="[view-transition-name:p-stats]">
            <StatsCard
              {...tag("StatsCard", 4)}
              title={t("s1")}
              value={t("s1v")}
              icon={<WalletIcon />}
              trend={{ value: 4.2, direction: "up" }}
              description={t("vsNov")}
              className="p-5"
            />
            <StatsCard
              {...tag("StatsCard", 5)}
              title={t("s2")}
              value={t("s2v")}
              icon={<BagIcon />}
              trend={{ value: -3.1, direction: "down" }}
              description={t("vsNov")}
              className="p-5"
            />
            <StatsCard
              {...tag("StatsCard", 6)}
              title={t("s3")}
              value={t("s3v")}
              icon={<TargetIcon />}
              description={t("goal")}
              className="p-5"
            />
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
