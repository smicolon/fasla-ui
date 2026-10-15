"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Error State` (42556:548), Type=Empty Search Results.
 *
 * The search that found nothing: the field still holding the query, an
 * illustration, a heading that names the query, and suggested searches to
 * try instead. Mobile first: the base classes are Figma's Mobile (360), `md:`
 * its Tablet (768) and `lg:` its Desktop (1440). Direction is the page's
 * `dir`; every side is a logical one, so the Search button and the
 * suggestions swap ends in Arabic on their own. The illustration is artwork,
 * not a directional glyph, so it is never mirrored; every colour in it is a
 * theme token.
 *
 * The search is real: submitting the field, pressing a suggestion or removing
 * a filter calls `onSearch` with the query and the filters left. Return a
 * promise and the Search button shows its pending state until it settles.
 * The block is the empty state, so the app swaps it for its results.
 */

export interface ErrorStateEmptySearchResultsFilter {
  /** The chip's text. */
  label: string
  /** Identifies the filter in `onSearch` and `onFiltersChange`. Defaults to `label`. */
  value?: string
}

export interface ErrorStateEmptySearchResultsCopy {
  /** The query that found nothing: the field's value, and the heading's subject. */
  query: string
  /** The heading, an `h1`, built from the query. */
  heading: (query: string) => React.ReactNode
  /** The line under the heading: what to try next. */
  description: React.ReactNode
  /** The Search button's label, and the field's accessible name. */
  searchLabel: string
  /** Searches to try instead, as chips under the copy. Hidden when empty. */
  suggestions: string[]
  /** The accessible name of the suggestions list. */
  suggestionsLabel: string
  /** The accessible name of the active filters list. */
  filtersLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateEmptySearchResultsCopy> = {
  en: {
    query: "anual reprot",
    heading: (query) => <>No results for “{query}”</>,
    description: "Check the spelling, remove a filter, or try one of the searches below.",
    searchLabel: "Search",
    suggestions: ["board deck", "quarterly report", "revenue summary"],
    suggestionsLabel: "Suggested searches",
    filtersLabel: "Active filters",
  },
  ar: {
    query: "التقرير السنوى",
    heading: (query) => <>لا نتائج لـ ”{query}“</>,
    description: "تحقق من الإملاء، أو أزل أحد عوامل التصفية، أو جرّب أحد عمليات البحث أدناه.",
    searchLabel: "بحث",
    suggestions: ["عرض مجلس الإدارة", "التقرير الربع سنوي", "ملخص الإيرادات"],
    suggestionsLabel: "عمليات بحث مقترحة",
    filtersLabel: "عوامل التصفية النشطة",
  },
}

export interface ErrorStateEmptySearchResultsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<ErrorStateEmptySearchResultsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Filters applied to the search, as removable chips between the field and
   * the results. Removing one runs the search again without it.
   * @default none
   */
  filters?: ErrorStateEmptySearchResultsFilter[]
  /**
   * Turns the field, the button, the suggestions and the filter chips off.
   * @default false
   */
  disabled?: boolean
  /** Called with the query and the filters left when the search runs. Return a promise to show the pending state. */
  onSearch?: (query: string, filters: ErrorStateEmptySearchResultsFilter[]) => void | Promise<unknown>
  /** Called with the filters left when a filter chip is removed. */
  onFiltersChange?: (filters: ErrorStateEmptySearchResultsFilter[]) => void
}

/** Figma's `File Search` illustration, 308×220, drawn in theme tokens. */
function FileSearchArt({ className }: { className?: string }) {
  // useId's colons are not safe in a url() reference.
  const clipId = `error-state-art-${React.useId().replace(/[^\w-]/g, "")}`
  return (
    <svg viewBox="0 0 308 220" fill="none" aria-hidden="true" focusable="false" className={className}>
      <g clipPath={`url(#${clipId})`}>
        <path d="M158.003 168.043L50.3308 195.769C46.6784 196.706 42.8038 196.155 39.5571 194.238C36.3104 192.321 33.9567 189.194 33.0122 185.544L0.451122 59.0912C-0.484967 55.4389 0.0659201 51.5643 1.98293 48.3176C3.89994 45.0709 7.02651 42.7171 10.6767 41.7727L110.848 15.9775L136.486 27.4549L168.229 150.724C169.165 154.376 168.614 158.251 166.697 161.498C164.78 164.745 161.654 167.098 158.003 168.043Z" className="fill-muted"/>
        <path d="M11.6958 45.738C9.09639 46.4105 6.86985 48.0866 5.50468 50.3987C4.1395 52.7107 3.74718 55.4699 4.41376 58.0708L36.9769 184.524C37.6494 187.123 39.3255 189.35 41.6376 190.715C43.9496 192.08 46.7088 192.472 49.3097 191.806L156.982 164.08C159.582 163.407 161.808 161.731 163.173 159.419C164.539 157.107 164.931 154.348 164.264 151.747L133.013 30.3868L110.481 20.2998L11.6958 45.738Z" className="fill-background"/>
        <path d="M136.212 28.1092L119.548 32.4004C118.332 32.7136 117.041 32.5308 115.959 31.8921C114.877 31.2533 114.094 30.2111 113.781 28.9946L110.611 16.6869C110.597 16.6331 110.599 16.5764 110.616 16.5235C110.633 16.4705 110.664 16.4234 110.707 16.3875C110.749 16.3515 110.801 16.3283 110.856 16.3204C110.911 16.3125 110.967 16.3202 111.018 16.3427L136.259 27.552C136.315 27.577 136.362 27.6188 136.393 27.6717C136.424 27.7246 136.439 27.7859 136.433 27.8471C136.428 27.9084 136.404 27.9665 136.365 28.0135C136.325 28.0604 136.272 28.0939 136.212 28.1092Z" className="fill-muted"/>
        <path d="M127.446 136.096L78.4239 148.72C77.817 148.873 77.1744 148.779 76.6364 148.46C76.0984 148.14 75.7089 147.62 75.5528 147.014C75.3968 146.408 75.487 145.765 75.8036 145.225C76.1203 144.686 76.6377 144.293 77.2428 144.134L126.265 131.509C126.566 131.429 126.881 131.41 127.19 131.453C127.5 131.495 127.797 131.598 128.067 131.756C128.336 131.914 128.571 132.124 128.759 132.373C128.947 132.622 129.084 132.906 129.162 133.208C129.239 133.511 129.257 133.825 129.213 134.134C129.168 134.443 129.063 134.741 128.904 135.009C128.745 135.277 128.534 135.511 128.283 135.698C128.033 135.884 127.748 136.02 127.446 136.096Z" className="fill-muted-foreground"/>
        <path d="M138.899 141.4L80.4167 156.46C80.1149 156.539 79.8003 156.558 79.4911 156.516C79.1818 156.473 78.884 156.37 78.6148 156.212C78.3456 156.054 78.1103 155.845 77.9223 155.595C77.7344 155.346 77.5976 155.062 77.5198 154.76C77.4419 154.458 77.4246 154.143 77.4688 153.834C77.513 153.525 77.6179 153.228 77.7773 152.96C77.9368 152.691 78.1477 152.457 78.398 152.271C78.6483 152.084 78.9329 151.949 79.2356 151.873L137.718 136.813C138.325 136.66 138.967 136.754 139.505 137.074C140.043 137.393 140.433 137.913 140.589 138.519C140.745 139.125 140.655 139.768 140.338 140.308C140.021 140.848 139.504 141.24 138.899 141.4Z" className="fill-muted-foreground"/>
        <path d="M57.2917 161.334C61.0886 161.334 64.1667 158.256 64.1667 154.459C64.1667 150.662 61.0886 147.584 57.2917 147.584C53.4947 147.584 50.4167 150.662 50.4167 154.459C50.4167 158.256 53.4947 161.334 57.2917 161.334Z" className="fill-destructive"/>
        <path d="M122.233 114.189L57.1267 130.948C55.2451 131.431 53.2491 131.147 51.5766 130.159C49.9041 129.171 48.6918 127.56 48.2055 125.68L34.5622 72.6769C34.0805 70.7955 34.3647 68.8 35.3524 67.1278C36.3401 65.4557 37.9507 64.2436 39.8308 63.7573L104.937 46.9981C106.818 46.516 108.814 46.7999 110.487 47.7877C112.159 48.7754 113.372 50.3862 113.858 52.2668L127.502 105.27C127.983 107.151 127.699 109.147 126.711 110.819C125.724 112.491 124.113 113.703 122.233 114.189Z" className="fill-background"/>
        <path d="M122.233 114.189L57.1267 130.948C55.2451 131.431 53.2491 131.147 51.5766 130.159C49.9041 129.171 48.6918 127.56 48.2055 125.68L34.5622 72.6769C34.0805 70.7955 34.3647 68.8 35.3524 67.1278C36.3401 65.4557 37.9507 64.2436 39.8308 63.7573L104.937 46.9981C106.818 46.516 108.814 46.7999 110.487 47.7877C112.159 48.7754 113.372 50.3862 113.858 52.2668L127.502 105.27C127.983 107.151 127.699 109.147 126.711 110.819C125.724 112.491 124.113 113.703 122.233 114.189ZM40.0455 64.5905C38.3865 65.02 36.9657 66.0899 36.0945 67.5656C35.2234 69.0413 34.9731 70.8023 35.3986 72.4622L49.0424 125.465C49.4719 127.124 50.5418 128.545 52.0175 129.416C53.4932 130.287 55.2541 130.538 56.9141 130.112L122.019 113.354C123.678 112.925 125.098 111.855 125.97 110.379C126.841 108.904 127.091 107.143 126.666 105.483L113.023 52.4798C112.594 50.8208 111.524 49.4 110.048 48.5288C108.572 47.6577 106.811 47.4074 105.151 47.8329L40.0455 64.5905Z" className="fill-border"/>
        <path d="M101.634 64.8186L68.7764 73.2767C68.4892 73.3569 68.1823 73.3251 67.9176 73.1877C67.653 73.0503 67.4504 72.8176 67.3507 72.5365C67.3043 72.3896 67.2884 72.2348 67.3038 72.0816C67.3192 71.9283 67.3657 71.7798 67.4405 71.6451C67.5152 71.5104 67.6166 71.3924 67.7385 71.2982C67.8603 71.204 68.0001 71.1356 68.1493 71.0972L101.597 62.4873C102.948 63.172 102.592 64.5722 101.634 64.819L101.634 64.8186Z" className="fill-muted"/>
        <path d="M103.116 70.5813L70.259 79.0394C69.9718 79.1196 69.6648 79.0878 69.4002 78.9504C69.1355 78.813 68.9329 78.5803 68.8332 78.2992C68.7869 78.1523 68.7709 77.9975 68.7863 77.8443C68.8018 77.691 68.8483 77.5425 68.923 77.4078C68.9977 77.2731 69.0991 77.1551 69.221 77.0609C69.3429 76.9667 69.4827 76.8983 69.6318 76.8599L103.079 68.25C104.43 68.9347 104.075 70.3349 103.117 70.5817L103.116 70.5813Z" className="fill-muted"/>
        <path d="M64.0008 84.1512L53.973 86.7317C53.8108 86.7735 53.642 86.7829 53.4762 86.7594C53.3104 86.7359 53.1508 86.68 53.0066 86.5949C52.8624 86.5097 52.7364 86.397 52.6358 86.2631C52.5352 86.1292 52.4619 85.9768 52.4202 85.8146L49.3738 73.9836C49.332 73.8214 49.3226 73.6526 49.3461 73.4867C49.3696 73.3209 49.4255 73.1614 49.5106 73.0171C49.5958 72.8729 49.7085 72.7469 49.8424 72.6463C49.9763 72.5457 50.1287 72.4725 50.2909 72.4308L60.3187 69.8495C60.6462 69.7656 60.9936 69.8151 61.2847 69.987C61.5758 70.1589 61.7868 70.4392 61.8715 70.7665L64.9179 82.6004C64.9597 82.7626 64.9691 82.9314 64.9456 83.0973C64.9222 83.2631 64.8663 83.4226 64.7811 83.5668C64.6959 83.711 64.5832 83.8371 64.4493 83.9377C64.3154 84.0383 64.163 84.1115 64.0008 84.1532V84.1512Z" className="fill-destructive"/>
        <path d="M106.059 82.4078L55.912 95.3163C55.6248 95.3965 55.3178 95.3647 55.0532 95.2273C54.7885 95.0899 54.5859 94.8572 54.4862 94.5761C54.4399 94.4292 54.4239 94.2744 54.4394 94.1212C54.4548 93.9679 54.5013 93.8194 54.576 93.6847C54.6508 93.55 54.7522 93.432 54.874 93.3378C54.9959 93.2436 55.1357 93.1752 55.2849 93.1368L106.022 80.0762C107.374 80.7609 107.017 82.1611 106.059 82.4078Z" className="fill-muted"/>
        <path d="M107.544 88.173L57.3961 101.082C57.1089 101.162 56.802 101.13 56.5373 100.993C56.2727 100.856 56.07 100.623 55.9704 100.342C55.924 100.195 55.9081 100.04 55.9235 99.8868C55.9389 99.7335 55.9854 99.585 56.0602 99.4503C56.1349 99.3157 56.2363 99.1976 56.3582 99.1034C56.48 99.0092 56.6198 98.9408 56.769 98.9024L107.506 85.8418C108.858 86.5265 108.502 87.9267 107.544 88.1735L107.544 88.173Z" className="fill-muted"/>
        <path d="M109.026 93.9342L58.879 106.843C58.5918 106.923 58.2848 106.891 58.0202 106.754C57.7555 106.616 57.5529 106.384 57.4532 106.102C57.4069 105.956 57.3909 105.801 57.4063 105.648C57.4218 105.494 57.4683 105.346 57.543 105.211C57.6177 105.076 57.7191 104.958 57.841 104.864C57.9629 104.77 58.1027 104.702 58.2518 104.663L108.989 91.6025C110.34 92.2872 109.984 93.6875 109.026 93.9342Z" className="fill-muted"/>
        <path d="M110.511 99.6998L60.3631 112.608C60.0759 112.689 59.769 112.657 59.5043 112.519C59.2397 112.382 59.037 112.149 58.9374 111.868C58.891 111.721 58.875 111.566 58.8905 111.413C58.9059 111.26 58.9524 111.111 59.0272 110.977C59.1019 110.842 59.2033 110.724 59.3251 110.63C59.447 110.536 59.5868 110.467 59.736 110.429L110.473 97.3682C111.824 98.0529 111.469 99.4531 110.511 99.6998Z" className="fill-muted"/>
        <path d="M111.994 105.462L61.8464 118.37C61.5592 118.45 61.2523 118.418 60.9876 118.281C60.723 118.144 60.5204 117.911 60.4207 117.63C60.3743 117.483 60.3584 117.328 60.3738 117.175C60.3892 117.022 60.4357 116.873 60.5105 116.738C60.5852 116.604 60.6866 116.486 60.8085 116.391C60.9303 116.297 61.0701 116.229 61.2193 116.191L111.957 103.13C113.308 103.815 112.952 105.215 111.994 105.462Z" className="fill-muted"/>
        <path d="M59.5897 151.714C59.7128 151.591 59.9122 151.591 60.0353 151.714C60.1583 151.837 60.1583 152.037 60.0353 152.16L57.7372 154.458L60.0353 156.756C60.1583 156.879 60.1583 157.079 60.0353 157.202C59.9122 157.325 59.7128 157.325 59.5897 157.202L57.2917 154.904L54.9936 157.202C54.8706 157.325 54.6711 157.325 54.548 157.202C54.425 157.079 54.425 156.879 54.548 156.756L56.8461 154.458L54.548 152.16C54.425 152.037 54.425 151.837 54.548 151.714C54.6711 151.591 54.8706 151.591 54.9936 151.714L57.2917 154.012L59.5897 151.714Z" className="fill-foreground-inverse"/>
        <path d="M263.698 201.31L154.555 180.095C150.854 179.371 147.592 177.209 145.484 174.083C143.375 170.956 142.593 167.122 143.309 163.419L168.224 35.2405C168.948 31.5401 171.11 28.2779 174.235 26.1694C177.361 24.061 181.196 23.2786 184.898 23.9939L286.437 43.7311L304.66 65.1098L280.372 190.062C279.648 193.762 277.486 197.025 274.361 199.134C271.235 201.242 267.4 202.025 263.698 201.31Z" className="fill-border"/>
        <path d="M184.117 28.0125C181.48 27.5031 178.75 28.0603 176.524 29.5617C174.298 31.0632 172.758 33.3863 172.243 36.0214L147.328 164.2C146.818 166.837 147.375 169.567 148.877 171.793C150.378 174.019 152.701 175.559 155.337 176.074L264.479 197.289C267.115 197.798 269.846 197.241 272.072 195.74C274.298 194.238 275.837 191.915 276.353 189.28L300.264 66.2647L284.25 47.4765L184.117 28.0125Z" className="fill-background"/>
        <path d="M264.786 82.3727L215.095 72.7137C214.478 72.5939 213.935 72.234 213.584 71.7133C213.232 71.1925 213.102 70.5536 213.222 69.9371C213.342 69.3205 213.702 68.7768 214.223 68.4256C214.743 68.0743 215.382 67.9443 215.999 68.0642L265.691 77.7234C266.308 77.8432 266.851 78.2031 267.203 78.7238C267.554 79.2445 267.684 79.8835 267.564 80.5C267.444 81.1166 267.084 81.6603 266.564 82.0115C266.043 82.3628 265.404 82.4927 264.787 82.3729L264.786 82.3727Z" className="fill-destructive"/>
        <path d="M272.851 92.0834L213.57 80.5604C212.953 80.4405 212.41 80.0807 212.058 79.5599C211.707 79.0392 211.577 78.4003 211.697 77.7837C211.817 77.1672 212.177 76.6235 212.698 76.2722C213.218 75.921 213.857 75.791 214.474 75.9109L273.754 87.4339C274.371 87.5537 274.915 87.9136 275.266 88.4343C275.617 88.955 275.747 89.594 275.627 90.2105C275.507 90.8271 275.148 91.3708 274.627 91.722C274.106 92.0732 273.467 92.2032 272.851 92.0834Z" className="fill-destructive"/>
        <path d="M258.856 112.884L209.166 103.225C208.549 103.105 207.911 103.235 207.39 103.587C206.869 103.938 206.509 104.481 206.39 105.098C206.27 105.715 206.4 106.353 206.751 106.874C207.102 107.395 207.646 107.755 208.262 107.874L257.952 117.533C258.565 117.644 259.197 117.509 259.711 117.157C260.224 116.806 260.579 116.266 260.698 115.654C260.817 115.043 260.69 114.41 260.345 113.891C260.001 113.373 259.465 113.011 258.856 112.884Z" className="fill-muted-foreground"/>
        <path d="M266.921 122.594L207.641 111.071C207.334 111.007 207.017 111.005 206.709 111.065C206.401 111.124 206.108 111.244 205.847 111.418C205.586 111.592 205.362 111.815 205.188 112.076C205.014 112.337 204.893 112.63 204.833 112.938C204.774 113.246 204.776 113.563 204.839 113.87C204.903 114.177 205.027 114.468 205.204 114.727C205.381 114.986 205.607 115.207 205.871 115.378C206.134 115.548 206.428 115.665 206.737 115.72L266.016 127.243C266.324 127.307 266.64 127.309 266.948 127.25C267.256 127.19 267.549 127.07 267.81 126.897C268.071 126.723 268.296 126.499 268.47 126.238C268.643 125.977 268.764 125.684 268.824 125.376C268.884 125.069 268.882 124.752 268.818 124.445C268.755 124.138 268.631 123.846 268.454 123.587C268.276 123.329 268.05 123.107 267.787 122.937C267.523 122.766 267.229 122.65 266.921 122.594Z" className="fill-muted-foreground"/>
        <path d="M251.117 152.695L201.426 143.036C200.809 142.916 200.265 142.556 199.914 142.036C199.563 141.515 199.433 140.876 199.553 140.259C199.673 139.643 200.032 139.099 200.553 138.748C201.074 138.397 201.713 138.267 202.329 138.386L252.022 148.046C252.638 148.165 253.182 148.525 253.533 149.046C253.884 149.567 254.014 150.206 253.895 150.822C253.775 151.439 253.415 151.983 252.894 152.334C252.373 152.685 251.734 152.815 251.118 152.695L251.117 152.695Z" className="fill-muted-foreground"/>
        <path d="M259.181 162.406L199.901 150.883C199.284 150.763 198.74 150.403 198.389 149.882C198.038 149.361 197.908 148.723 198.028 148.106C198.148 147.489 198.507 146.946 199.028 146.595C199.549 146.243 200.188 146.113 200.804 146.233L260.085 157.756C260.702 157.876 261.245 158.236 261.597 158.757C261.948 159.277 262.078 159.916 261.958 160.533C261.838 161.149 261.478 161.693 260.958 162.044C260.437 162.396 259.798 162.526 259.181 162.406Z" className="fill-muted-foreground"/>
        <path d="M192.494 78.5063C197.032 79.3884 201.426 76.4247 202.308 71.8867C203.191 67.3487 200.227 62.9549 195.689 62.0728C191.151 61.1907 186.757 64.1544 185.875 68.6924C184.993 73.2304 187.956 77.6242 192.494 78.5063Z" className="fill-destructive"/>
        <path d="M196.352 67.5493C196.475 67.4263 196.675 67.4263 196.798 67.5493C196.921 67.6724 196.921 67.8718 196.798 67.9949L194.5 70.2929L196.798 72.591C196.921 72.714 196.921 72.9135 196.798 73.0366C196.675 73.1596 196.475 73.1596 196.352 73.0366L194.054 70.7385L191.756 73.0366C191.633 73.1596 191.434 73.1596 191.311 73.0366C191.187 72.9135 191.187 72.714 191.311 72.591L193.609 70.2929L191.311 67.9949C191.187 67.8718 191.187 67.6724 191.311 67.5493C191.434 67.4263 191.633 67.4263 191.756 67.5493L194.054 69.8474L196.352 67.5493Z" className="fill-foreground-inverse"/>
        <path d="M196.318 107.212C196.109 108.291 195.689 109.319 195.083 110.236C194.476 111.153 193.695 111.941 192.784 112.556C191.873 113.171 190.849 113.6 189.772 113.82C188.695 114.039 187.585 114.044 186.505 113.835C186.435 113.822 186.365 113.806 186.296 113.785C184.688 113.43 183.221 112.608 182.078 111.423C180.935 110.238 180.167 108.742 179.87 107.123C179.573 105.504 179.761 103.833 180.408 102.319C181.056 100.806 182.136 99.5168 183.513 98.6139C184.89 97.7111 186.502 97.2343 188.148 97.2432C189.794 97.2521 191.402 97.7463 192.768 98.6641C194.135 99.5818 195.201 100.882 195.832 102.403C196.464 103.923 196.633 105.596 196.318 107.212Z" className="fill-destructive"/>
        <path d="M178.825 148.829C183.363 149.711 187.757 146.747 188.639 142.209C189.521 137.671 186.557 133.277 182.019 132.395C177.481 131.513 173.088 134.477 172.205 139.015C171.323 143.553 174.287 147.946 178.825 148.829Z" className="fill-destructive"/>
        <path d="M304.132 65.5821L287.241 62.2988C286.008 62.0591 284.92 61.3394 284.218 60.2979C283.516 59.2565 283.256 57.9786 283.495 56.7455L285.92 44.27C285.931 44.2154 285.957 44.1649 285.995 44.1242C286.033 44.0836 286.082 44.0546 286.135 44.0404C286.189 44.0262 286.246 44.0274 286.299 44.0439C286.352 44.0605 286.399 44.0916 286.436 44.1339L304.414 65.0977C304.454 65.1443 304.478 65.2023 304.484 65.2635C304.489 65.3246 304.476 65.386 304.445 65.4391C304.414 65.4922 304.367 65.5344 304.311 65.5598C304.255 65.5852 304.193 65.5926 304.133 65.5809L304.132 65.5821Z" className="fill-muted-foreground"/>
        <path d="M204.009 190.322C203.489 191.175 202.651 191.786 201.68 192.021C200.71 192.257 199.685 192.097 198.833 191.577L154.892 164.774C154.039 164.254 153.428 163.417 153.192 162.446C152.957 161.475 153.117 160.451 153.637 159.598C154.158 158.745 154.995 158.134 155.966 157.899C156.937 157.664 157.961 157.824 158.814 158.344L202.754 185.146C203.607 185.666 204.218 186.504 204.453 187.475C204.689 188.445 204.529 189.47 204.009 190.322Z" className="fill-foreground"/>
        <path d="M160.068 163.518C156.965 168.606 152.423 172.659 147.017 175.165C141.611 177.671 135.583 178.517 129.695 177.597C123.808 176.678 118.325 174.033 113.941 169.997C109.557 165.961 106.468 160.716 105.065 154.925C103.661 149.134 104.007 143.056 106.058 137.461C108.108 131.867 111.772 127.005 116.585 123.493C121.399 119.98 127.146 117.974 133.1 117.727C139.053 117.48 144.946 119.005 150.034 122.108C153.412 124.168 156.351 126.873 158.683 130.069C161.016 133.265 162.696 136.89 163.627 140.735C164.559 144.58 164.724 148.571 164.114 152.481C163.503 156.39 162.128 160.141 160.068 163.518ZM115.055 136.061C112.728 139.876 111.585 144.296 111.77 148.761C111.955 153.227 113.459 157.537 116.094 161.147C118.729 164.757 122.374 167.505 126.571 169.043C130.767 170.581 135.325 170.84 139.668 169.788C144.012 168.735 147.946 166.419 150.973 163.13C153.999 159.842 155.983 155.73 156.673 151.315C157.363 146.899 156.728 142.378 154.848 138.323C152.968 134.269 149.929 130.862 146.113 128.535C140.997 125.415 134.85 124.454 129.026 125.866C123.201 127.277 118.176 130.944 115.055 136.061Z" className="fill-foreground"/>
        <path d="M126.379 169.68C138.621 173.895 151.962 167.388 156.177 155.146C160.392 142.904 153.886 129.563 141.644 125.348C129.402 121.133 116.061 127.64 111.846 139.882C107.631 152.123 114.137 165.464 126.379 169.68Z" className="fill-soft-destructive"/>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="308" height="188.045" transform="translate(0 15.9775)" />
        </clipPath>
      </defs>
    </svg>
  )
}

const filterValue = (filter: ErrorStateEmptySearchResultsFilter) => filter.value ?? filter.label

export function ErrorStateEmptySearchResults({
  locale = "en",
  query,
  heading,
  description,
  searchLabel,
  suggestions,
  suggestionsLabel,
  filtersLabel,
  filters,
  disabled = false,
  onSearch,
  onFiltersChange,
  className,
  ...props
}: ErrorStateEmptySearchResultsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const initialQuery = query ?? copy.query
  const [value, setValue] = React.useState(initialQuery)
  const [searched, setSearched] = React.useState(initialQuery)
  const [activeFilters, setActiveFilters] = React.useState(filters ?? [])
  const [pending, setPending] = React.useState(false)
  const label = searchLabel ?? copy.searchLabel
  const tries = suggestions ?? copy.suggestions

  // A new `query` or `filters` from the app replaces what the block holds.
  React.useEffect(() => {
    setValue(initialQuery)
    setSearched(initialQuery)
  }, [initialQuery])
  // By their values, so a new array with the same filters keeps the chips as they are.
  const filtersKey = (filters ?? []).map(filterValue).join("\u0000")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setActiveFilters(filters ?? []), [filtersKey])

  const run = async (next: string, nextFilters = activeFilters) => {
    setSearched(next)
    const result = onSearch?.(next, nextFilters)
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setPending(true)
      try {
        await result
      } finally {
        setPending(false)
      }
    }
  }

  const removeFilter = (filter: ErrorStateEmptySearchResultsFilter) => {
    const next = activeFilters.filter((item) => filterValue(item) !== filterValue(filter))
    setActiveFilters(next)
    onFiltersChange?.(next)
    void run(searched, next)
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex flex-col gap-8 bg-background p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-3">
        <form
          role="search"
          className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            void run(value.trim())
          }}
        >
          <Input
            type="search"
            size="lg"
            aria-label={label}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
            startIcon={<Search strokeWidth={1.5} />}
            className="md:flex-1"
          />
          <Button type="submit" size="lg" disabled={disabled} loading={pending} className="w-full md:w-auto">
            {label}
          </Button>
        </form>
        {activeFilters.length > 0 ? (
          <ul aria-label={filtersLabel ?? copy.filtersLabel} className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <li key={filterValue(filter)}>
                <Badge
                  variant="soft"
                  tone="secondary"
                  size="lg"
                  onClose={disabled ? undefined : () => removeFilter(filter)}
                >
                  {filter.label}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-6 py-6 lg:py-2">
        <FileSearchArt className="h-36 w-[202px] shrink-0 md:h-44 md:w-[246px] lg:h-[220px] lg:w-[308px]" />
        <div className="flex w-full flex-col gap-2.5 text-center">
          <h1 id={headingId} aria-live="polite" className="text-xl font-semibold text-foreground md:text-2xl">
            {(heading ?? copy.heading)(searched)}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>
        {tries.length > 0 ? (
          <ul aria-label={suggestionsLabel ?? copy.suggestionsLabel} className="flex w-full flex-wrap justify-center gap-2">
            {tries.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setValue(suggestion)
                    void run(suggestion)
                  }}
                  className="group/suggestion flex rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Badge
                    variant="outline"
                    size="lg"
                    icon={<Search strokeWidth={1.5} />}
                    className="cursor-pointer transition-colors group-hover/suggestion:bg-soft-primary group-disabled/suggestion:cursor-not-allowed"
                  >
                    {suggestion}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateEmptySearchResultsCopy = COPY
