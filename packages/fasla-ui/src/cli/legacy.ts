/**
 * Repairs a project set up with @smicolon/cli 0.3.x.
 *
 * 0.3 wrote a `"smicolon": { "url" }` registry entry, which the shadcn CLI
 * rejects as an invalid components.json, and treated `@/` as `src/` whatever
 * the tsconfig said. Its prompts defaulted to `src/components`, stored as
 * `@/src/components`, so files landed in src/src/components; with `--yes` it
 * stored `@/components` but still wrote under src/. In a project whose `@/`
 * is the root, neither resolves, and 0.4's `add` then wrote a second copy to
 * where the old alias does point.
 *
 * The repair rewrites components.json, moves Fasla's files to where the new
 * aliases point, and updates the imports that pointed at the old places. It
 * never overwrites: a file whose destination is taken is deleted only when it
 * is the same file, and otherwise kept beside it as `.bak`.
 *
 * Every change is planned first and written, whole, to `.fasla-repair.json`
 * before the first one is made. Each step can tell whether it already
 * happened, so a run that dies part way resumes from the file; a run that
 * hits an error undoes what it did and removes the file.
 */
import fs from "fs-extra"
import { rename } from "fs/promises"
import path from "path"
import { aliasToPath, resolveInsideProject, resolveWritableFile, writeFileIfAbsent, writeFileNoFollow } from "./paths.js"
import { NAMESPACE, namespaceUrl } from "./registry.js"

export interface ComponentsConfig {
  aliases?: Record<string, string | undefined>
  registries?: Record<string, unknown>
  tailwind?: { css?: unknown; [key: string]: unknown }
  [key: string]: unknown
}

/** The registry key 0.3 wrote: no `@`, and a `{ url }` with no `{name}`. */
export const LEGACY_REGISTRY_KEY = "smicolon"

/** The repair's plan and progress, at the project root while it runs. */
export const REPAIR_FILE = ".fasla-repair.json"

/** Held by the one run repairing the project, so two never work on one plan. */
export const LOCK_FILE = ".fasla-repair.lock"

/** The file names `add` writes: kebab-case, .ts or .tsx. */
const COMPONENT_FILE = /^[a-z0-9][a-z0-9-]*\.tsx?$/

/** The folders `add` writes registry files into, under the components alias. */
const TYPE_DIRS = ["ui", "blocks", "effects"]

/** Folders never searched for imports to update. */
const SKIP_DIRS = new Set(["node_modules", "dist", "build", "out", "coverage"])
const SOURCE_FILE = /\.(tsx?|jsx?|mjs|cjs|mts|cts|mdx)$/

/**
 * Whether components.json came from 0.3: it has the old registry key, or its
 * aliases go through `@/src/` and the src/src folder 0.3 made is there.
 */
export async function isLegacyConfig(cwd: string, config: ComponentsConfig): Promise<boolean> {
  const registries = config.registries
  if (registries && typeof registries === "object" && LEGACY_REGISTRY_KEY in registries) return true
  const { components, utils } = config.aliases ?? {}
  const throughSrc = [components, utils].some((alias) => typeof alias === "string" && alias.startsWith("@/src/"))
  return throughSrc && (await fs.pathExists(path.join(cwd, "src", "src")))
}

/** `@/src/components` → `@/components`; anything else as it is. */
function withoutSrc(alias: string): string {
  return alias.startsWith("@/src/") ? `@/${alias.slice("@/src/".length)}` : alias
}

/** Where 0.3 wrote an alias: it replaced `@/` with `src/`, always. */
function legacyPath(alias: string): string {
  return alias.replace(/^@\//, "src/")
}

export interface Move {
  /** Relative to the project root. */
  from: string
  to: string
  /** `move`: nothing at `to` yet. `duplicate`: the same file is there, so `from` goes. `conflict`: a different file is there, so `from` is kept as `backup`. */
  action: "move" | "duplicate" | "conflict"
  /** For a conflict, where `from` is kept. */
  backup?: string
}

/**
 * One change. Each one can tell, from the files alone, whether it has
 * already been made, and can be undone. Paths are relative to the project.
 */
export type RepairStep =
  /** Create a folder the moves need. Undone by removing it once it is empty. */
  | { op: "mkdir"; dir: string }
  | { op: "move"; from: string; to: string }
  /** Remove a file that holds `before` — a duplicate. Undone by writing it back. */
  | { op: "delete"; file: string; before: string }
  /** Replace `before` (null: no file) with `after`. Undone by putting `before` back. */
  | { op: "write"; file: string; before: string | null; after: string }
  /** Remove a folder if the moves left it empty. Nothing to undo: moving back recreates it. */
  | { op: "rmdir"; dir: string }

export interface RepairPlan {
  config: ComponentsConfig
  moves: Move[]
  /** Import specifiers to update across the project, old → new. */
  specifiers: [string, string][]
  /** Every change, in the order it is made. components.json comes last. */
  steps: RepairStep[]
}

/** What `.fasla-repair.json` holds: the steps and how many are done. */
export interface RepairJournal {
  version: 1
  config: ComponentsConfig
  steps: RepairStep[]
  done: number
}

/**
 * Where a 0.3 project's files are and where the repair puts them, from its
 * components.json and the folder `@/` points to. The planner builds its steps
 * from these, and a resumed plan is checked against them.
 */
function repairPaths(config: ComponentsConfig, root: string) {
  const aliases = config.aliases ?? {}
  const oldComponents = aliases.components ?? "@/components"
  const oldUtils = aliases.utils ?? "@/lib/utils"
  const newComponents = withoutSrc(oldComponents)
  const newUtils = withoutSrc(oldUtils)
  return {
    oldComponents,
    oldUtils,
    newComponents,
    newUtils,
    newDir: aliasToPath(newComponents, root),
    // Where files may be, newest first: where 0.4 wrote with the old aliases,
    // then where 0.3 did.
    sourceDirs: unique([aliasToPath(oldComponents, root), legacyPath(oldComponents)]),
    utilsSources: unique([`${aliasToPath(oldUtils, root)}.ts`, `${legacyPath(oldUtils)}.ts`]),
    newUtilsFile: `${aliasToPath(newUtils, root)}.ts`,
  }
}

/** The components.json the repair writes for a 0.3 one. */
async function repairedConfig(cwd: string, config: ComponentsConfig, root: string): Promise<ComponentsConfig> {
  const aliases = config.aliases ?? {}
  const { oldComponents, newComponents, newUtils } = repairPaths(config, root)

  const registries = { ...(config.registries ?? {}) }
  delete registries[LEGACY_REGISTRY_KEY]
  registries[NAMESPACE] = namespaceUrl()

  const tailwind = { ...(config.tailwind ?? {}) }
  // 0.3 always wrote src/app/globals.css. Point it at the real file when that
  // one is missing and the usual place has one.
  const usualCss = root ? `${root}/app/globals.css` : "app/globals.css"
  if (typeof tailwind.css === "string" && !(await fs.pathExists(path.join(cwd, tailwind.css))) && (await fs.pathExists(path.join(cwd, usualCss)))) {
    tailwind.css = usualCss
  }

  return {
    ...config,
    tailwind,
    aliases: {
      ...aliases,
      components: newComponents,
      utils: newUtils,
      ui: withoutSrc(aliases.ui ?? `${oldComponents}/ui`),
    },
    registries,
  }
}

/**
 * What the repair will do, without doing any of it, so it can be shown before
 * anyone agrees to it. `root` is the folder `@/` points to now.
 */
export async function planLegacyRepair(cwd: string, config: ComponentsConfig, root: string): Promise<RepairPlan> {
  const { oldComponents, oldUtils, newComponents, newUtils, newDir, sourceDirs, utilsSources, newUtilsFile } = repairPaths(config, root)
  const newConfig = await repairedConfig(cwd, config, root)

  const specifiers = new Map<string, string>()
  if (oldUtils !== newUtils) specifiers.set(oldUtils, newUtils)

  // The first copy of a file to reach its destination keeps it.
  const claimed = new Map<string, string>()
  const moves: Move[] = []
  const rewrite = (text: string) => rewriteSpecifiers(text, [...specifiers])
  const taken = new Set<string>()

  const consider = async (from: string, to: string) => {
    if (from === to) return
    const raw = await readPlainFile(cwd, from)
    if (raw === undefined) return
    const content = rewrite(raw)
    let existing = claimed.get(to)
    if (existing === undefined) {
      const there = await readPlainFile(cwd, to)
      if (there !== undefined) {
        existing = rewrite(there)
        claimed.set(to, existing)
      }
    }
    if (existing === undefined) {
      claimed.set(to, content)
      moves.push({ from, to, action: "move" })
    } else if (existing === content) {
      moves.push({ from, to, action: "duplicate" })
    } else {
      let backup = `${from}.bak`
      for (let n = 2; taken.has(backup) || (await lexists(path.join(cwd, backup))); n++) backup = `${from}.bak${n}`
      taken.add(backup)
      moves.push({ from, to, action: "conflict", backup })
    }
  }

  // Specifiers first, so files compare equal once their imports are updated.
  for (const dir of sourceDirs) {
    for (const type of TYPE_DIRS) {
      for (const name of await plainFiles(path.join(cwd, dir, type))) {
        const bare = name.replace(/\.[^.]+$/, "")
        const oldSpec = `${oldComponents}/${type}/${bare}`
        const newSpec = `${newComponents}/${type}/${bare}`
        if (oldSpec !== newSpec) specifiers.set(oldSpec, newSpec)
      }
    }
  }
  for (const dir of sourceDirs) {
    for (const type of TYPE_DIRS) {
      for (const name of await plainFiles(path.join(cwd, dir, type))) {
        await consider(`${dir}/${type}/${name}`, `${newDir}/${type}/${name}`)
      }
    }
  }
  for (const from of utilsSources) {
    await consider(from, newUtilsFile)
  }

  const pairs = [...specifiers]
  const steps: RepairStep[] = []
  // The folders the moves need that aren't there yet, outermost first, so
  // undoing the repair can take them away again.
  const needed = new Set<string>()
  for (const move of moves) {
    const to = move.action === "conflict" ? move.backup! : move.to
    for (let dir = path.posix.dirname(to); dir !== "." && dir !== ""; dir = path.posix.dirname(dir)) {
      if (!(await lexists(path.join(cwd, dir)))) needed.add(dir)
    }
  }
  for (const dir of [...needed].sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b))) {
    steps.push({ op: "mkdir", dir })
  }
  for (const move of moves) {
    if (move.action === "move") steps.push({ op: "move", from: move.from, to: move.to })
    else if (move.action === "conflict") steps.push({ op: "move", from: move.from, to: move.backup! })
    else steps.push({ op: "delete", file: move.from, before: (await readPlainFile(cwd, move.from))! })
  }

  // Imports, in each file where it will be once the moves are done. Files
  // that are deleted or kept as .bak keep what they said.
  const finalPath = new Map(moves.map((m) => [m.from, m.action === "move" ? m.to : undefined]))
  if (pairs.length > 0) {
    for (const file of await sourceFiles(cwd)) {
      const destination = finalPath.has(file) ? finalPath.get(file) : file
      if (destination === undefined) continue
      const before = (await readPlainFile(cwd, file))!
      const after = rewriteSpecifiers(before, pairs)
      if (after !== before) steps.push({ op: "write", file: destination, before, after })
    }
  }

  // The folders the moves may empty, deepest first, up to (not including) the root.
  const dirs = new Set<string>()
  for (const move of moves) {
    for (let dir = path.posix.dirname(move.from); dir !== "." && dir !== ""; dir = path.posix.dirname(dir)) dirs.add(dir)
  }
  for (const dir of [...dirs].sort((a, b) => b.split("/").length - a.split("/").length || a.localeCompare(b))) {
    steps.push({ op: "rmdir", dir })
  }

  // Last, so an interrupted repair still reads as one and is picked up again.
  const configBefore = await readPlainFile(cwd, "components.json")
  steps.push({ op: "write", file: "components.json", before: configBefore ?? null, after: `${JSON.stringify(newConfig, null, 2)}\n` })

  return { config: newConfig, moves, specifiers: pairs, steps }
}

/** The repair didn't finish and was undone; the project is as it was. */
export class RepairRolledBackError extends Error {}

/**
 * The repair didn't finish and couldn't be undone completely. The journal is
 * kept, so running the command again finishes it.
 */
export class RepairStoppedError extends Error {}

/** `.fasla-repair.json` is there but can't be used; the message says what to do. */
export class RepairJournalError extends Error {}

/**
 * A file the repair would change no longer holds what the plan expected —
 * edited since the plan was made. The repair stops rather than overwrite it.
 */
export class RepairConflictError extends Error {}

/**
 * Carries out a plan: checks every path first, writes the journal, then makes
 * each change. On an error, undoes everything and removes the journal.
 * Returns the files whose imports changed and the backups kept.
 */
export async function applyLegacyRepair(cwd: string, plan: RepairPlan): Promise<{ rewritten: string[]; backups: string[] }> {
  await runJournal(cwd, await beginLegacyRepair(cwd, plan))
  return summarise(plan.steps)
}

/**
 * The part of a repair before the first change: checks every path, then
 * writes the whole plan to `.fasla-repair.json`. From here on, a run that
 * dies can be finished by the next one.
 */
export async function beginLegacyRepair(cwd: string, plan: RepairPlan): Promise<RepairJournal> {
  await preflight(cwd, plan.steps)
  const journal: RepairJournal = { version: 1, config: plan.config, steps: plan.steps, done: 0 }
  await saveJournal(cwd, journal)
  return journal
}

/** Reads `.fasla-repair.json`, or undefined when there is none. */
export async function readJournal(cwd: string): Promise<RepairJournal | undefined> {
  const file = path.join(cwd, REPAIR_FILE)
  if (!(await lexists(file))) return undefined
  let journal: RepairJournal
  try {
    journal = JSON.parse(await fs.readFile(await resolveWritableFile(cwd, REPAIR_FILE), "utf8"))
  } catch {
    throw new RepairJournalError(`${REPAIR_FILE} can't be read. Delete it and run the command again.`)
  }
  if (journal?.version !== 1 || !Array.isArray(journal.steps) || typeof journal.done !== "number") {
    throw new RepairJournalError(`${REPAIR_FILE} isn't a repair this version can finish. Delete it and run the command again.`)
  }
  return journal
}

/**
 * Finishes a repair a previous run left in `.fasla-repair.json`, from the
 * step it reached, with the same undo on error. Only for a journal that
 * `validateJournal` accepted; `config` is what it returned.
 */
export async function resumeLegacyRepair(
  cwd: string,
  journal: RepairJournal,
  config: ComponentsConfig
): Promise<{ config: ComponentsConfig; rewritten: string[]; backups: string[] }> {
  await preflight(cwd, journal.steps)
  await runJournal(cwd, journal)
  return { config, ...summarise(journal.steps) }
}

/**
 * Checks a journal found on disk before anything resumes it. It is a file in
 * the project, so anyone who can commit to the repository can write one: it is
 * a request, not a record. Every step must be one the 0.3 repair of this
 * project's own components.json could make — a component file moved from the
 * exact 0.3 path to its repaired path or a `.bak` beside it, a duplicate of
 * one deleted, a folder on those paths, an import of a moved component
 * updated, or components.json rewritten to exactly the repaired config.
 * Returns that config; throws a `RepairJournalError` naming the first step
 * that isn't, before anything changes.
 */
export async function validateJournal(cwd: string, journal: RepairJournal, root: string): Promise<ComponentsConfig> {
  const configText = await readPlainFile(cwd, "components.json")
  const config: ComponentsConfig | undefined = configText === undefined ? undefined : (() => {
    try {
      return JSON.parse(configText)
    } catch {
      return undefined
    }
  })()
  // Stopped after writing components.json, its last step, but before the
  // journal went: nothing is left to change, so there is nothing to trust.
  const left = Array.isArray(journal.steps) && Number.isInteger(journal.done) ? journal.steps.slice(journal.done) : []
  const finished = left.every((step) => step?.op === "write" && step.file === "components.json" && step.after === configText)
  if (config && finished && !(await isLegacyConfig(cwd, config))) return config
  // A config that is 0.3 only by its `@/src/` aliases stops looking like one
  // once the repair's rmdir steps remove src/src. It still is the config this
  // plan started from when the plan's own components.json write is still to
  // come from exactly this text — and the aliases must still go through
  // `@/src/`, so a plan can't vouch for a config that was never 0.3.
  const throughSrc = [config?.aliases?.components, config?.aliases?.utils].some((a) => typeof a === "string" && a.startsWith("@/src/"))
  const plannedFromThis = left.some((step) => step?.op === "write" && step.file === "components.json" && step.before === configText)
  if (!config || (!(throughSrc && plannedFromThis) && !(await isLegacyConfig(cwd, config)))) {
    throw new RepairJournalError(
      `${REPAIR_FILE} is here, but components.json isn't one from 0.3, so there is nothing to repair and nothing was changed. ` +
        `If a repair has finished, or you didn't start one, delete ${REPAIR_FILE}.`
    )
  }
  const reject = (why: string): never => {
    throw new RepairJournalError(
      `${REPAIR_FILE} asks to ${why}, which a 0.3 repair never does, so it was not resumed and nothing was changed. ` +
        `If you didn't start a repair in this project, delete ${REPAIR_FILE}.`
    )
  }
  const steps: unknown[] = journal.steps
  if (!Number.isInteger(journal.done) || journal.done < 0 || journal.done > steps.length) {
    reject(`record ${journal.done} of ${steps.length} steps as done`)
  }

  const paths = repairPaths(config, root)
  const expected = await repairedConfig(cwd, config, root)
  const expectedText = `${JSON.stringify(expected, null, 2)}\n`

  // Every file the repair may take from, and where it goes.
  const destinationOf = (from: string): string | undefined => {
    if (paths.utilsSources.includes(from) && from !== paths.newUtilsFile) return paths.newUtilsFile
    for (const dir of paths.sourceDirs) {
      for (const type of TYPE_DIRS) {
        const prefix = `${dir}/${type}/`
        const name = from.slice(prefix.length)
        if (from.startsWith(prefix) && COMPONENT_FILE.test(name)) {
          const to = `${paths.newDir}/${type}/${name}`
          return to === from ? undefined : to
        }
      }
    }
    return undefined
  }
  const ancestors = (file: string) => {
    const out: string[] = []
    for (let dir = path.posix.dirname(file); dir !== "." && dir !== ""; dir = path.posix.dirname(dir)) out.push(dir)
    return out
  }
  const newDirs = new Set([...TYPE_DIRS.flatMap((type) => ancestors(`${paths.newDir}/${type}/x`)), ...ancestors(paths.newUtilsFile)])
  const oldDirs = new Set([
    ...paths.sourceDirs.flatMap((dir) => TYPE_DIRS.flatMap((type) => ancestors(`${dir}/${type}/x`))),
    ...paths.utilsSources.flatMap(ancestors),
  ])

  // The imports the repair may update: one per component file it moves.
  const specifiers = new Map<string, string>()
  if (paths.oldUtils !== paths.newUtils) specifiers.set(paths.oldUtils, paths.newUtils)
  const isString = (value: unknown): value is string => typeof value === "string"

  for (const raw of steps) {
    const step = raw as Partial<Record<string, unknown>>
    if (step?.op === "move" && isString(step.from) && isString(step.to)) {
      const to = destinationOf(step.from)
      const backup = new RegExp(`^${step.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.bak\\d*$`)
      if (!to || (step.to !== to && !backup.test(step.to))) reject(`move ${step.from} to ${step.to}`)
      noteSpecifier(step.from as string)
    } else if (step?.op === "delete" && isString(step.file) && isString(step.before)) {
      if (!destinationOf(step.file)) reject(`delete ${step.file}`)
      noteSpecifier(step.file as string)
    } else if (step?.op === "mkdir" && isString(step.dir)) {
      if (!newDirs.has(step.dir)) reject(`create the folder ${step.dir}`)
    } else if (step?.op === "rmdir" && isString(step.dir)) {
      if (!oldDirs.has(step.dir)) reject(`remove the folder ${step.dir}`)
    } else if (step?.op === "write" && isString(step.file) && isString(step.after) && (step.before === null || isString(step.before))) {
      // Checked below, once every move has added its import.
    } else {
      reject(`run a step it doesn't recognise (${JSON.stringify(raw).slice(0, 80)})`)
    }
  }
  function noteSpecifier(from: string) {
    for (const type of TYPE_DIRS) {
      for (const dir of paths.sourceDirs) {
        const prefix = `${dir}/${type}/`
        if (!from.startsWith(prefix)) continue
        const bare = from.slice(prefix.length).replace(/\.[^.]+$/, "")
        const oldSpec = `${paths.oldComponents}/${type}/${bare}`
        const newSpec = `${paths.newComponents}/${type}/${bare}`
        if (oldSpec !== newSpec) specifiers.set(oldSpec, newSpec)
      }
    }
  }

  const pairs = [...specifiers]
  for (const step of journal.steps) {
    if (step.op !== "write") continue
    if (step.file === "components.json") {
      if (step.after !== expectedText) reject(`write a components.json other than the repaired one`)
      continue
    }
    const parts = step.file.split("/")
    const isSource = SOURCE_FILE.test(step.file) && parts.every((part) => part && !part.startsWith(".") && part !== ".." && !SKIP_DIRS.has(part))
    if (!isSource || step.before === null || step.after === step.before || step.after !== rewriteSpecifiers(step.before, pairs)) {
      reject(`write ${step.file} with anything but updated component imports`)
    }
  }
  return expected
}

/** The steps still to do, one line each, to show before asking to resume. */
export function describeSteps(journal: RepairJournal): string[] {
  return journal.steps.slice(journal.done).map((step) => {
    if (step.op === "move") return /\.bak\d*$/.test(step.to) ? `keep ${step.from} as ${step.to}` : `move ${step.from} → ${step.to}`
    if (step.op === "delete") return `delete ${step.file}, a copy of the file already at the new place`
    if (step.op === "mkdir") return `create the folder ${step.dir}`
    if (step.op === "rmdir") return `remove the folder ${step.dir} if it is empty`
    return step.file === "components.json" ? "write the repaired components.json" : `update the imports in ${step.file}`
  })
}

/** Another run holds the lock; the message says which and what to do. */
export class RepairLockedError extends Error {}

/**
 * Runs `work` while holding `.fasla-repair.lock`, so only one run plans,
 * resumes or undoes a repair at a time. The lock is created only if it isn't
 * there, in one step, and records this process. A lock whose process has
 * ended — a run that was killed — is cleared; one whose process is still
 * running stops this run with a `RepairLockedError`.
 */
export async function withRepairLock<T>(cwd: string, work: () => Promise<T>): Promise<T> {
  const lock = await resolveWritableFile(cwd, LOCK_FILE)
  const owner = `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })}\n`
  if (!(await writeFileIfAbsent(lock, owner))) {
    const held: { pid?: unknown } = await fs.readJson(lock).catch(() => ({}))
    const pid = typeof held.pid === "number" ? held.pid : undefined
    if (pid === undefined || isRunning(pid)) {
      throw new RepairLockedError(
        `Another fasla-ui run${pid ? ` (process ${pid})` : ""} is repairing this project. ` +
          `Wait for it to finish and run this again. If no other run is going, delete ${LOCK_FILE}.`
      )
    }
    // The run that held it is gone, killed part way. Take its place.
    await fs.remove(lock)
    if (!(await writeFileIfAbsent(lock, owner))) {
      throw new RepairLockedError(`Another fasla-ui run started repairing this project just now. Wait for it to finish and run this again.`)
    }
  }
  // process.exit skips finally blocks; this still removes the lock.
  const release = () => {
    try {
      fs.removeSync(lock)
    } catch {
      // Already gone.
    }
  }
  process.once("exit", release)
  try {
    return await work()
  } finally {
    process.removeListener("exit", release)
    release()
  }
}

/** Whether a process with this id is running. */
function isRunning(pid: number): boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    // EPERM: it runs, as another user.
    return (error as NodeJS.ErrnoException).code === "EPERM"
  }
}

/**
 * Makes the steps from `journal.done` on, recording progress after each.
 * `afterStep` runs once a step is recorded; the tests use it to stop a run
 * part way, as a crash would. No undo here — `runJournal` adds that.
 */
export async function executeJournal(
  cwd: string,
  journal: RepairJournal,
  { afterStep }: { afterStep?: (index: number) => void | Promise<void> } = {}
): Promise<void> {
  for (let i = journal.done; i < journal.steps.length; i++) {
    await doStep(cwd, journal.steps[i]!)
    journal.done = i + 1
    await saveJournal(cwd, journal)
    await afterStep?.(i)
  }
  await fs.remove(path.join(cwd, REPAIR_FILE))
}

/**
 * `executeJournal`, undoing everything on an error. When the undo is complete
 * the journal goes; when it isn't, the journal stays, reset to step 0, so the
 * next run redoes each step from what the files show.
 */
async function runJournal(cwd: string, journal: RepairJournal): Promise<void> {
  try {
    await executeJournal(cwd, journal)
  } catch (error) {
    const reason = (error as Error).message
    const leftovers = await rollback(cwd, journal.steps, journal.done)
    if (leftovers.length === 0) {
      await fs.remove(path.join(cwd, REPAIR_FILE))
      throw new RepairRolledBackError(reason)
    }
    // Every step checks the files before it acts, so starting over is safe.
    journal.done = 0
    await saveJournal(cwd, journal).catch(() => undefined)
    throw new RepairStoppedError(
      `${reason} Undoing it couldn't put back ${leftovers.join(", ")}, changed since the repair wrote ${leftovers.length === 1 ? "it" : "them"} or not writable.`
    )
  }
}

/** Makes one step, or does nothing when the files show it is already made. */
async function doStep(cwd: string, step: RepairStep): Promise<void> {
  if (step.op === "mkdir") {
    await fs.ensureDir(await resolveInsideProject(cwd, step.dir))
  } else if (step.op === "move") {
    const from = await resolveInsideProject(cwd, step.from)
    const to = await resolveWritableFile(cwd, step.to)
    const fromThere = await lexists(from)
    const toThere = await lexists(to)
    if (!fromThere && toThere) return
    if (!fromThere) throw new RepairConflictError(`${step.from} is gone, and ${step.to} isn't there either.`)
    if (toThere) throw new RepairConflictError(`${step.to} appeared after the repair was planned.`)
    await fs.ensureDir(path.dirname(to))
    await fs.move(from, to, { overwrite: false })
  } else if (step.op === "delete") {
    const current = await readPlainFile(cwd, step.file)
    if (current === undefined) return
    // Checked again now, not only when planned: only the same file goes.
    if (current !== step.before) throw new RepairConflictError(`${step.file} changed after the repair was planned.`)
    await fs.remove(await resolveWritableFile(cwd, step.file))
  } else if (step.op === "write") {
    const current = await readPlainFile(cwd, step.file)
    if (current === step.after) return
    if ((current ?? null) !== step.before) throw new RepairConflictError(`${step.file} changed after the repair was planned.`)
    await writeAtomically(cwd, step.file, step.after)
  } else {
    const dir = await resolveInsideProject(cwd, step.dir)
    const entries = await fs.readdir(dir).catch(() => undefined)
    if (entries && entries.length === 0) await fs.rmdir(dir)
  }
}

/**
 * Undoes the steps up to and including `failedAt`, last first, where the files
 * show each was made. Returns what it couldn't put back — a file someone else
 * changed after the repair wrote it. The failed step may not have happened at
 * all, so a file it would have changed that doesn't match is simply left.
 */
async function rollback(cwd: string, steps: RepairStep[], failedAt: number): Promise<string[]> {
  const leftovers: string[] = []
  for (let i = Math.min(failedAt, steps.length - 1); i >= 0; i--) {
    const step = steps[i]!
    try {
      if (step.op === "mkdir") {
        const dir = await resolveInsideProject(cwd, step.dir)
        const entries = await fs.readdir(dir).catch(() => undefined)
        if (entries && entries.length === 0) await fs.rmdir(dir)
      } else if (step.op === "move") {
        const from = await resolveInsideProject(cwd, step.from)
        const to = await resolveInsideProject(cwd, step.to)
        if (!(await lexists(from)) && (await lexists(to))) await fs.move(to, from, { overwrite: false })
      } else if (step.op === "delete") {
        if ((await readPlainFile(cwd, step.file)) === undefined && !(await lexists(path.join(cwd, step.file)))) {
          await writeAtomically(cwd, step.file, step.before)
        }
      } else if (step.op === "write") {
        const current = await readPlainFile(cwd, step.file)
        if ((current ?? null) === step.before) continue
        if (current !== step.after) {
          if (i < failedAt) leftovers.push(step.file)
          continue
        }
        if (step.before === null) await fs.remove(await resolveWritableFile(cwd, step.file))
        else await writeAtomically(cwd, step.file, step.before)
      }
    } catch {
      leftovers.push(step.op === "rmdir" || step.op === "mkdir" ? step.dir : step.op === "move" ? step.from : step.file)
    }
  }
  return leftovers
}

/**
 * Checks every path the steps touch before anything changes: each inside the
 * project, none written through a symlink. A path that fails stops the repair
 * while nothing has been written, not after the first moves.
 */
async function preflight(cwd: string, steps: RepairStep[]): Promise<void> {
  await resolveWritableFile(cwd, REPAIR_FILE)
  for (const step of steps) {
    if (step.op === "move") {
      await resolveInsideProject(cwd, step.from)
      await resolveWritableFile(cwd, step.to)
    } else if (step.op === "rmdir" || step.op === "mkdir") {
      await resolveInsideProject(cwd, step.dir)
    } else {
      await resolveWritableFile(cwd, step.file)
    }
  }
}

/** The files a plan rewrites and the backups it keeps, for the report. */
function summarise(steps: RepairStep[]): { rewritten: string[]; backups: string[] } {
  return {
    rewritten: steps.filter((s): s is Extract<RepairStep, { op: "write" }> => s.op === "write" && s.file !== "components.json").map((s) => s.file),
    backups: steps.filter((s): s is Extract<RepairStep, { op: "move" }> => s.op === "move" && /\.bak\d*$/.test(s.to)).map((s) => s.to),
  }
}

/** Writes the journal whole, so a crash never leaves it half written. */
async function saveJournal(cwd: string, journal: RepairJournal): Promise<void> {
  await writeAtomically(cwd, REPAIR_FILE, `${JSON.stringify(journal, null, 2)}\n`)
}

/**
 * Writes a file whole or not at all: a temporary file beside it, then a
 * rename over it, so a crash never leaves components.json or the journal
 * half written. Neither path may be a symlink.
 */
async function writeAtomically(cwd: string, rel: string, content: string): Promise<void> {
  const target = await resolveWritableFile(cwd, rel)
  const temp = await resolveWritableFile(cwd, `${rel}.fasla-tmp`)
  await fs.ensureDir(path.dirname(target))
  await writeFileNoFollow(temp, content)
  await rename(temp, target)
}

/** Replaces each old import specifier, quoted exactly, with its new one. */
export function rewriteSpecifiers(text: string, specifiers: [string, string][]): string {
  let out = text
  for (const [from, to] of specifiers) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    out = out.replace(new RegExp(`(["'])${escaped}\\1`, "g"), `$1${to}$1`)
  }
  return out
}

/** The plan in a few lines, to show before asking. */
export function describeRepair(plan: RepairPlan, oldConfig: ComponentsConfig): string[] {
  const lines: string[] = []
  if (oldConfig.registries && LEGACY_REGISTRY_KEY in oldConfig.registries) {
    lines.push(`- registries: "${LEGACY_REGISTRY_KEY}" becomes "${NAMESPACE}", so the shadcn CLI can read components.json`)
  }
  const before = oldConfig.aliases ?? {}
  const after = plan.config.aliases ?? {}
  for (const key of ["components", "utils"]) {
    if (before[key] !== after[key]) lines.push(`- aliases.${key}: ${before[key]} → ${after[key]}`)
  }
  const count = (action: Move["action"]) => plan.moves.filter((m) => m.action === action).length
  if (count("move") > 0) lines.push(`- move ${count("move")} file(s) to where those aliases point`)
  if (count("duplicate") > 0) lines.push(`- delete ${count("duplicate")} duplicate file(s) already at the new place`)
  if (count("conflict") > 0) lines.push(`- keep ${count("conflict")} older, different file(s) as .bak beside them`)
  if (plan.specifiers.length > 0) lines.push(`- update imports of the old paths in your code`)
  return lines
}

/** Each item once, in first-seen order. */
function unique(items: string[]): string[] {
  return [...new Set(items)]
}

/** Whether anything, a symlink included, is at `p`. */
async function lexists(p: string): Promise<boolean> {
  return Boolean(await fs.lstat(p).catch(() => undefined))
}

/**
 * A regular file's text, or undefined when there is none — or when the path
 * is a symlink, which the repair neither reads through nor moves.
 */
async function readPlainFile(cwd: string, rel: string): Promise<string | undefined> {
  const full = path.join(cwd, rel)
  const stat = await fs.lstat(full).catch(() => undefined)
  if (!stat?.isFile()) return undefined
  return fs.readFile(full, "utf8")
}

/** Regular files in a folder, not symlinks; none when it doesn't exist. */
async function plainFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  return entries.filter((e) => e.isFile()).map((e) => e.name).sort()
}

/**
 * Source files under the project, relative and with forward slashes,
 * skipping dependencies, build output, dot-folders and symlinks.
 */
async function sourceFiles(cwd: string, rel = ""): Promise<string[]> {
  const out: string[] = []
  for (const entry of await fs.readdir(path.join(cwd, rel), { withFileTypes: true })) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue
    const child = rel ? `${rel}/${entry.name}` : entry.name
    if (entry.isDirectory()) out.push(...(await sourceFiles(cwd, child)))
    else if (entry.isFile() && SOURCE_FILE.test(entry.name)) out.push(child)
  }
  return out
}
