"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex items-center gap-2 rounded-full border border-border/40 bg-background/80 px-3 sm:px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-md">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Fasla — home"
          className="flex items-center pr-4 sm:pr-6 border-r border-border/40 mr-1 sm:mr-2"
        >
          {/* Drawn lockup, never re-set type (§11). 30px tall = 93px wide, above the
              90px minimum (§10). Wordmark is ink on light, white on dark (§08). */}
          <Image
            src="/brand/fasla-lockup-ltr.svg"
            alt="Fasla"
            width={93}
            height={30}
            priority
            className="h-[26px] w-auto sm:h-[30px] dark:hidden"
          />
          <Image
            src="/brand/fasla-lockup-ltr-onDark.svg"
            alt="Fasla"
            width={93}
            height={30}
            priority
            className="hidden h-[26px] w-auto sm:h-[30px] dark:block"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/docs"
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            Docs
          </Link>
          <Link
            href="/docs/components/button"
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            Components
          </Link>
          <Link
            href="/docs/components/shimmer-button"
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            AG&#8209;UI events
          </Link>
          <Link
            href="https://github.com/smicolon/fasla-ui"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            GitHub
          </Link>
        </div>

        {/* Right: Theme + Get Started + Mobile Menu */}
        <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-border/40">
          <ThemeToggle />
          <Link
            href="/docs"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-foreground px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Get started
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl border border-border/40 bg-background/95 backdrop-blur-md shadow-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/docs/components/button"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors"
            >
              Components
            </Link>
            <Link
              href="/docs/components/shimmer-button"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors"
            >
              Effects
            </Link>
            <Link
              href="https://github.com/smicolon/fasla-ui"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors"
            >
              GitHub
            </Link>
            <div className="border-t border-border/40 mt-2 pt-2">
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-foreground px-4 py-3 text-sm font-medium text-foreground"
              >
                Get started
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
