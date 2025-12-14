export default function SelectPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Select</h1>
        <p className="text-xl text-muted-foreground">
          A native select input with custom styling.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add select</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Multiple sizes (sm, default, lg)</li>
          <li>Error state styling</li>
          <li>Native select behavior</li>
          <li>Placeholder support</li>
        </ul>
      </div>
    </div>
  )
}
