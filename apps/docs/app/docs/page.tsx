import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to install and use SMI-UI components in your project.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4 space-y-4">
              <p className="text-muted-foreground">
                Use the CLI to install components into your project.
              </p>
              <pre className="overflow-x-auto rounded-lg border bg-muted p-4">
                <code>npx smi-ui init</code>
              </pre>
              <p className="text-muted-foreground">
                Then add components as needed:
              </p>
              <pre className="overflow-x-auto rounded-lg border bg-muted p-4">
                <code>npx smi-ui add button</code>
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Components</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* UI Primitives */}
              <div className="space-y-3">
                <h3 className="font-semibold">UI Primitives</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/docs/components/button" className="text-muted-foreground hover:text-foreground">
                      Button
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/input" className="text-muted-foreground hover:text-foreground">
                      Input
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/card" className="text-muted-foreground hover:text-foreground">
                      Card
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/badge" className="text-muted-foreground hover:text-foreground">
                      Badge
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/skeleton" className="text-muted-foreground hover:text-foreground">
                      Skeleton
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Blocks */}
              <div className="space-y-3">
                <h3 className="font-semibold">Blocks</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/docs/components/app-shell" className="text-muted-foreground hover:text-foreground">
                      App Shell
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/page-header" className="text-muted-foreground hover:text-foreground">
                      Page Header
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/empty-state" className="text-muted-foreground hover:text-foreground">
                      Empty State
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/form-section" className="text-muted-foreground hover:text-foreground">
                      Form Section
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/data-table" className="text-muted-foreground hover:text-foreground">
                      Data Table
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Effects */}
              <div className="space-y-3">
                <h3 className="font-semibold">Effects</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/docs/components/shimmer-button" className="text-muted-foreground hover:text-foreground">
                      Shimmer Button
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/animated-gradient" className="text-muted-foreground hover:text-foreground">
                      Animated Gradient
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/text-reveal" className="text-muted-foreground hover:text-foreground">
                      Text Reveal
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/border-beam" className="text-muted-foreground hover:text-foreground">
                      Border Beam
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/components/spotlight" className="text-muted-foreground hover:text-foreground">
                      Spotlight
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
