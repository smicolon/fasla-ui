export default function ComboboxPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Combobox</h1>
        <p className="text-xl text-muted-foreground">
          A searchable dropdown with autocomplete, multi-select, and create-new functionality.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add combobox</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Searchable dropdown</li>
          <li>Multi-select support</li>
          <li>Create new items on the fly</li>
          <li>Keyboard navigation</li>
          <li>Empty state handling</li>
          <li>Loading state</li>
        </ul>
      </div>
    </div>
  )
}
