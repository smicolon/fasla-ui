// Cloudflare Pages Function: POST /api/waitlist. Pages finds this folder at the
// repository root (the project's root directory); build:pages only touches
// apps/docs/out, so the Function ships with each deployment untouched.
// All the logic is in apps/docs/lib/waitlist.ts, where the tests reach it.
import { handleWaitlist, type WaitlistEnv } from "../../apps/docs/lib/waitlist"

export const onRequest = ({ request, env }: { request: Request; env: WaitlistEnv }) => handleWaitlist(request, env)
