import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Introduction</h1>
        <p className="text-xl text-muted-foreground">
          SMI-UI is a beautiful, animated component library built with React, Tailwind CSS, and Framer Motion.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">What is SMI-UI?</h2>
        <p className="text-muted-foreground leading-relaxed">
          SMI-UI provides a collection of reusable components that you can copy and paste into your apps.
          It&apos;s not a traditional component library - you own the code and can customize it however you want.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
        <ul className="grid gap-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">✓</span>
            <span><strong className="text-foreground">22+ Components</strong> - UI primitives, app blocks, and stunning effects</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">✓</span>
            <span><strong className="text-foreground">Accessible</strong> - Built with accessibility in mind, keyboard navigation included</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">✓</span>
            <span><strong className="text-foreground">Animated</strong> - Smooth animations with Framer Motion, respects reduced motion</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">✓</span>
            <span><strong className="text-foreground">TypeScript</strong> - 100% TypeScript with full type safety</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">✓</span>
            <span><strong className="text-foreground">Dark Mode</strong> - Beautiful dark mode support out of the box</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">✓</span>
            <span><strong className="text-foreground">Customizable</strong> - Built with Tailwind CSS, easy to customize</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Component Categories</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/docs/components/button"
            className="group rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            <h3 className="font-semibold group-hover:text-primary">UI Primitives</h3>
            <p className="mt-1 text-sm text-muted-foreground">12 components</p>
          </Link>
          <Link
            href="/docs/components/app-shell"
            className="group rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            <h3 className="font-semibold group-hover:text-primary">Blocks</h3>
            <p className="mt-1 text-sm text-muted-foreground">8 components</p>
          </Link>
          <Link
            href="/docs/components/shimmer-button"
            className="group rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            <h3 className="font-semibold group-hover:text-primary">Effects</h3>
            <p className="mt-1 text-sm text-muted-foreground">7 components</p>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="font-semibold">Quick Start</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by installing the CLI and adding your first component.
        </p>
        <Link
          href="/docs/installation"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Go to Installation
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
