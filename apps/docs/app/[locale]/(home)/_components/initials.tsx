/**
 * An initials circle, drawn here rather than with Avatar.
 *
 * Avatar takes no initials of its own: it uses the first letters of the first
 * and last words of `name`. For دار العقارية that is «دا», the ا of ال, and two
 * Arabic letters, kept apart by a ZWNJ, still sit flush and read as one word
 * («حش»). Letter-spacing cannot open the gap: browsers do not apply it to a
 * cursive script. The reference sets «د» and «ح ش» with a real space, smaller
 * and semibold, so this takes the initials as written.
 */
export function Initials({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold"
    >
      {children}
    </span>
  )
}
