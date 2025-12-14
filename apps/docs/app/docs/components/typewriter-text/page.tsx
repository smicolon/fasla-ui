export default function TypewriterTextPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Typewriter Text</h1>
        <p className="text-xl text-muted-foreground">
          Animated text that types out character by character.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add typewriter-text</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>TypewriterText - Single text animation</li>
          <li>TypewriterWords - Cycle through multiple words</li>
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Customizable typing speed</li>
          <li>Start delay</li>
          <li>Optional cursor</li>
          <li>Loop support</li>
          <li>Callback on completion</li>
        </ul>
      </div>
    </div>
  )
}
