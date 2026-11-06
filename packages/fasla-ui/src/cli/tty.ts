/**
 * Whether a person can answer a prompt. False when stdin is piped or closed,
 * as it is for an agent or a CI job: a prompt there would wait for ever, or
 * end the run without a word. Its own module so tests can stand in for a
 * terminal.
 */
export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY)
}
