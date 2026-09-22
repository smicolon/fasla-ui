import { metadataForRoute } from "@/lib/seo-routes"

export const metadata = metadataForRoute("/docs/installation/")

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Installation</h1>
        <p className="text-xl text-muted-foreground">
          How to install and set up Fasla in your project.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Requirements</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>React 18 or later</li>
          <li>Tailwind CSS 3.4 or later</li>
          <li>TypeScript (recommended)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Using the CLI</h2>
        <p className="text-muted-foreground">
          The easiest way to add components is using our CLI:
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Initialize Fasla in your project:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
              <code className="text-green-400">npx @smicolon/fasla-ui init</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Add components:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
              <code className="text-green-400">npx @smicolon/fasla-ui add button</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Add multiple components:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
              <code className="text-green-400">npx @smicolon/fasla-ui add button card input badge</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Manual Installation</h2>
        <p className="text-muted-foreground">
          You can also copy components directly from the source code.
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">1. Install dependencies:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
              <code className="text-green-400">npm install class-variance-authority clsx tailwind-merge framer-motion</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">2. Add the cn utility to your project:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4 text-sm">
              <code className="text-gray-300">{`// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">3. Copy the component source code from each component page.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tailwind Configuration</h2>
        <p className="text-muted-foreground">
          Map the semantic tokens into your Tailwind theme. The package exports
          the whole set, already wrapped so that opacity modifiers keep working:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4 text-sm">
          <code className="text-gray-300">{`// tailwind.config.ts
import { tailwindSemanticColors } from "@smicolon/fasla-ui/tokens"

module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: tailwindSemanticColors,
    },
  },
}`}</code>
        </pre>
        <p className="text-muted-foreground text-sm">
          Then declare the matching CSS variables as full colours (hex or oklch)
          on <code>:root</code> and <code>.dark</code>. Mapping a token as a bare{" "}
          <code>var(--primary)</code> looks correct but silently drops Tailwind&rsquo;s
          opacity modifiers &mdash; <code>bg-primary/10</code> compiles to no rule at
          all. That is why the exported map wraps each token in{" "}
          <code>color-mix()</code>.
        </p>
      </div>
    </div>
  )
}
