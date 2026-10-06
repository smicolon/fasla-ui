/**
 * The library's solid Switch paints its off thumb in primary-foreground, which
 * is black on the dark track in Dark and barely shows in Light. On the landing
 * page, as in the reference, the off thumb is white on a visible track; on keeps
 * the library's colours. Set on the Switch root, reaching its data-slot parts.
 */
export const visibleOffSwitch =
  "[&:has(:checked)_[data-slot=thumb]]:bg-primary-foreground [&_[data-slot=thumb]]:bg-fasla-white [&_[data-slot=thumb]]:shadow-sm [&_[data-slot=track]]:bg-foreground/20"
