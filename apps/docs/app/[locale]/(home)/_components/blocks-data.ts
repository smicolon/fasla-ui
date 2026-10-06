/**
 * Plain data about the block previews, importable from server components
 * (block-library.tsx is a client module).
 */
export type BlockKey =
  | "hero" | "dhero" | "feat" | "gallery" | "ban" | "auth" | "price" | "checkout" | "order" | "dash" | "prod"
  | "chat" | "ai" | "faq" | "err" | "cal" | "toast" | "stats" | "app" | "mag" | "read" | "news"

/** Blocks that are dark in both themes, as in the reference. */
export const DARK_BLOCKS: BlockKey[] = ["ai", "dash"]
