export default function CheckboxPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Checkbox</h1>
        <p className="text-xl text-muted-foreground">
          A control that allows the user to toggle between checked and not checked.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add checkbox</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Label and description support</li>
          <li>Indeterminate state</li>
          <li>Error state styling</li>
          <li>Disabled state</li>
        </ul>
      </div>
    </div>
  )
}
