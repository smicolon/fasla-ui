export default function StatsCardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Stats Card</h1>
        <p className="text-xl text-muted-foreground">
          Display key metrics with trends and icons.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/fasla-ui add stats-card</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Title and value display</li>
          <li>Trend indicator (up/down with percentage)</li>
          <li>Optional icon</li>
          <li>Description text</li>
          <li>Loading state</li>
          <li>StatsGrid for layout</li>
        </ul>
      </div>
    </div>
  )
}
