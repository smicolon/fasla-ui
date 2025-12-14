export default function TabsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Tabs</h1>
        <p className="text-xl text-muted-foreground">
          A set of layered sections of content that display one panel at a time.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add tabs</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Controlled and uncontrolled modes</li>
          <li>Keyboard navigation</li>
          <li>Disabled tabs support</li>
          <li>Accessible</li>
        </ul>
      </div>
    </div>
  )
}
