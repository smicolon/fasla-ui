/** What the copy button shows: nothing yet, copied, or the clipboard was refused. */
export type CopyStatus = "idle" | "copied" | "failed"

/** How long "Copied" stays before the button goes back to "Copy prompt". */
export const COPIED_MS = 2000

/** The browser pieces copying touches, passed in so a test can stand in for them. */
export type CopyEnv = {
  clipboard?: { writeText: (text: string) => Promise<void> }
  document?: Pick<Document, "createElement" | "body" | "execCommand" | "activeElement">
}

/**
 * Puts text on the clipboard and says whether it worked. navigator.clipboard
 * first; when it is missing (an insecure context) or refuses (no permission),
 * a hidden textarea and execCommand("copy"), which still works there.
 */
export async function copyText(text: string, env: CopyEnv = browserEnv()): Promise<boolean> {
  try {
    if (env.clipboard) {
      await env.clipboard.writeText(text)
      return true
    }
  } catch {
    // Blocked: fall through to the older way.
  }
  return copyWithTextarea(text, env.document)
}

function copyWithTextarea(text: string, doc: CopyEnv["document"]): boolean {
  if (!doc?.body || typeof doc.execCommand !== "function") return false
  const area = doc.createElement("textarea")
  area.value = text
  area.setAttribute("readonly", "")
  area.setAttribute("aria-hidden", "true")
  area.style.position = "fixed"
  area.style.insetBlockStart = "0"
  area.style.opacity = "0"
  const previous = doc.activeElement as HTMLElement | null
  doc.body.appendChild(area)
  try {
    area.select()
    return doc.execCommand("copy")
  } catch {
    return false
  } finally {
    area.remove()
    previous?.focus?.()
  }
}

function browserEnv(): CopyEnv {
  return {
    clipboard: typeof navigator === "undefined" ? undefined : navigator.clipboard,
    document: typeof document === "undefined" ? undefined : document,
  }
}

/** The timer pieces, passed in for the same reason. */
export type Timers = {
  set: (fn: () => void, ms: number) => unknown
  clear: (id: unknown) => void
}

/**
 * Copies, reports the status, and puts "copied" back to idle after
 * COPIED_MS. Returns the handle that cancels the pending reset: a second click
 * before it fires restarts the two seconds, and unmounting stops it.
 */
export async function copyWithStatus(
  text: string,
  {
    setStatus,
    copy = copyText,
    timers = { set: (fn, ms) => setTimeout(fn, ms), clear: (id) => clearTimeout(id as ReturnType<typeof setTimeout>) },
    previous,
  }: {
    setStatus: (status: CopyStatus) => void
    copy?: (text: string) => Promise<boolean>
    timers?: Timers
    previous?: unknown
  }
): Promise<unknown> {
  if (previous !== undefined) timers.clear(previous)
  const ok = await copy(text)
  setStatus(ok ? "copied" : "failed")
  return ok ? timers.set(() => setStatus("idle"), COPIED_MS) : undefined
}
