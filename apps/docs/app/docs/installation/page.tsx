export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
        <p className="text-xl text-muted-foreground">
          How to install and set up SMI-UI in your project.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Requirements</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>React 18 or later</li>
          <li>Tailwind CSS 3.4 or later</li>
          <li>TypeScript (recommended)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Using the CLI</h2>
        <p className="text-muted-foreground">
          The easiest way to add components is using our CLI:
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Initialize SMI-UI in your project:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
              <code className="text-green-400">npx @smicolon/smi-ui init</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Add components:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
              <code className="text-green-400">npx @smicolon/smi-ui add button</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Add multiple components:</p>
            <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
              <code className="text-green-400">npx @smicolon/smi-ui add button card input badge</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Manual Installation</h2>
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
        <h2 className="text-2xl font-semibold tracking-tight">Tailwind Configuration</h2>
        <p className="text-muted-foreground">
          Make sure your Tailwind config includes the necessary colors and animations:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4 text-sm">
          <code className="text-gray-300">{`// tailwind.config.ts
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        // ... other colors
      },
    },
  },
}`}</code>
        </pre>
      </div>
    </div>
  )
}
