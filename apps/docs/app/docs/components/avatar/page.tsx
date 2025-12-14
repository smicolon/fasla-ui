"use client"

import { Avatar, AvatarGroup } from "../../../../../../packages/smi-ui/registry/ui/avatar"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function AvatarPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Avatar</h1>
        <p className="text-xl text-muted-foreground">
          An image element with a fallback for representing users.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <CodeBlock>npx @smicolon/smi-ui add avatar</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="John Doe"
            />
            <Avatar alt="Jane Smith" />
            <Avatar fallback="AB" />
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <Avatar size="xs" alt="XS" />
            <Avatar size="sm" alt="SM" />
            <Avatar size="default" alt="MD" />
            <Avatar size="lg" alt="LG" />
            <Avatar size="xl" alt="XL" />
          </div>
        </ComponentPreview>
      </section>

      {/* With Images */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Images</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="User 1"
            />
            <Avatar
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="User 2"
            />
            <Avatar
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              alt="User 3"
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Avatar Group */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatar Group</h2>
        <ComponentPreview>
          <AvatarGroup max={3}>
            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User 1" />
            <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 2" />
            <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User 3" />
            <Avatar alt="User 4" />
            <Avatar alt="User 5" />
          </AvatarGroup>
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`import { Avatar, AvatarGroup } from "@/components/ui/avatar"

// Basic avatar with image
<Avatar
  src="/path/to/image.jpg"
  alt="John Doe"
/>

// Avatar with fallback initials
<Avatar alt="John Doe" />

// Avatar group
<AvatarGroup max={3}>
  <Avatar src="/user1.jpg" alt="User 1" />
  <Avatar src="/user2.jpg" alt="User 2" />
  <Avatar src="/user3.jpg" alt="User 3" />
</AvatarGroup>`}</CodeBlock>
      </section>
    </div>
  )
}
