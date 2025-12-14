export default function TextareaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Textarea</h1>
        <p className="text-xl text-muted-foreground">
          A multi-line text input with character count and resize options.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add textarea</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Character count display</li>
          <li>Max length enforcement</li>
          <li>Resize control (none, vertical, horizontal, both)</li>
          <li>Error state styling</li>
        </ul>
      </div>
    </div>
  )
}
