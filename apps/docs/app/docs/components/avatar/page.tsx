export default function AvatarPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Avatar</h1>
        <p className="text-xl text-muted-foreground">
          An image element with a fallback for representing users.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/smi-ui add avatar</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Multiple sizes (xs, sm, default, lg, xl)</li>
          <li>Fallback initials when no image</li>
          <li>AvatarGroup for stacked avatars</li>
          <li>Status indicators support</li>
        </ul>
      </div>
    </div>
  )
}
