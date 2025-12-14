import type { MDXComponents } from "mdx/types"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ComponentPreview,
    CodeBlock,
  }
}
