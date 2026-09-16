export default function SidebarPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Sidebar</h1>
        <p className="text-xl text-muted-foreground">
          A collapsible sidebar navigation component for app layouts.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg bg-smi-neutral-950 p-4">
          <code className="text-green-400">npx @smicolon/fasla-ui add sidebar</code>
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Sidebar - Main container</li>
          <li>SidebarHeader - Header section</li>
          <li>SidebarContent - Scrollable content area</li>
          <li>SidebarFooter - Footer section</li>
          <li>SidebarGroup - Grouped items with label</li>
          <li>SidebarItem - Navigation item with icon</li>
          <li>SidebarCollapseButton - Toggle collapse state</li>
        </ul>
      </div>
    </div>
  )
}
