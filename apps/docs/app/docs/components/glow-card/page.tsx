export default function GlowCardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Glow Card</h1>
        <p className="text-xl text-muted-foreground">
          Cards with interactive glow effects that follow the mouse cursor.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add glow-card</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>GlowCard - Card with radial glow effect</li>
          <li>GlowContainer - Container with animated border glow</li>
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Mouse-following glow effect</li>
          <li>Customizable glow color</li>
          <li>Hover-only or always-on modes</li>
          <li>Animated border variant</li>
          <li>Respects reduced motion</li>
        </ul>
      </div>
    </div>
  )
}
