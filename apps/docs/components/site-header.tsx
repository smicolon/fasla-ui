"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-3 group">
            {mounted && (
              <Image
                src={resolvedTheme === "dark" ? "/Logo-dark.svg" : "/Logo-light.svg"}
                alt="Smicolon"
                width={32}
                height={32}
                className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">SMI-UI</span>
              <span className="text-xs text-muted-foreground">by Smicolon</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/docs"
              className="transition-colors hover:text-primary text-foreground/70"
            >
              Docs
            </Link>
            <Link
              href="/docs/components/button"
              className="transition-colors hover:text-primary text-foreground/70"
            >
              Components
            </Link>
            <Link
              href="/docs/components/shimmer-button"
              className="transition-colors hover:text-primary text-foreground/70"
            >
              Effects
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="https://github.com/smicolon/smi-ui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:text-primary text-foreground/70 h-9 w-9"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://smicolon.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:text-primary text-foreground/70 h-9 px-3"
            >
              smicolon.com
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
