import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const workflowsDir = path.resolve(import.meta.dir, "../../../.github/workflows")

const STATUS_FUNCTION = /\b(success|always|failure|cancelled)\s*\(/

const load = (file) => Bun.YAML.parse(readFileSync(path.join(workflowsDir, file), "utf8"))

const needsOf = (job) => [job.needs ?? []].flat()

// Every job this job depends on, directly or through the chain.
function ancestors(jobs, name, seen = new Set()) {
  for (const parent of needsOf(jobs[name])) {
    if (!seen.has(parent)) {
      seen.add(parent)
      ancestors(jobs, parent, seen)
    }
  }
  return seen
}

// A job with an `if` can be skipped, and so can everything that depends on it
// without a status-check function. GitHub applies an implicit success() to an
// `if` that has none, and that is false when any job earlier in the chain was
// skipped, so the dependent job is skipped too. A job downstream of one that
// can be skipped has to say what it wants: success(), !cancelled(), always().
export function findSkipChainProblems(workflow) {
  const jobs = workflow.jobs ?? {}
  const problems = []
  for (const [name, job] of Object.entries(jobs)) {
    const skippable = [...ancestors(jobs, name)].filter((parent) => jobs[parent].if !== undefined)
    if (skippable.length === 0) continue
    const condition = job.if === undefined ? "" : String(job.if)
    if (!STATUS_FUNCTION.test(condition)) {
      problems.push(
        `job "${name}" depends on ${skippable.join(", ")}, which can be skipped, ` +
          `but its if: has no status-check function (success(), always(), !cancelled(), failure())`
      )
    }
  }
  return problems
}

describe("workflow skip chains", () => {
  const files = readdirSync(workflowsDir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))

  test("finds the workflow files", () => {
    expect(files).toContain("ci.yml")
    expect(files).toContain("release.yml")
  })

  for (const file of files) {
    test(`${file}: no job is silently skipped behind a skipped job`, () => {
      expect(findSkipChainProblems(load(file))).toEqual([])
    })
  }

  test("the check catches the manual dry-run bug", () => {
    const broken = {
      jobs: {
        "release-please": { if: "github.event_name == 'push'" },
        build: { needs: "release-please", if: "${{ !cancelled() }}" },
        dry: { needs: "build", if: "${{ github.event_name == 'workflow_dispatch' }}" },
      },
    }
    expect(findSkipChainProblems(broken)).toHaveLength(1)
    broken.jobs.dry.if = "${{ !cancelled() && github.event_name == 'workflow_dispatch' }}"
    expect(findSkipChainProblems(broken)).toEqual([])
  })
})

// `cmd | head` under pipefail fails the step when cmd writes more than head
// reads: head exits, cmd is killed by SIGPIPE. It passes on small output and
// breaks on a big one, so it is banned in scripts that set pipefail.
export function findPipefailHeadProblems(workflow) {
  const problems = []
  for (const [name, job] of Object.entries(workflow.jobs ?? {})) {
    for (const step of job.steps ?? []) {
      const script = String(step.run ?? "")
        .split("\n")
        .filter((line) => !line.trim().startsWith("#"))
        .join("\n")
      if (/set -[a-z]*o?[a-z]* ?pipefail|set -o pipefail/.test(script) && /\|\s*head\b/.test(script)) {
        problems.push(`job "${name}": a step pipes into head under pipefail`)
      }
    }
  }
  return problems
}

describe("workflow scripts", () => {
  const files = readdirSync(workflowsDir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
  for (const file of files) {
    test(`${file}: no pipe into head under pipefail`, () => {
      expect(findPipefailHeadProblems(load(file))).toEqual([])
    })
  }

  test("the check catches the pipe into head", () => {
    const broken = { jobs: { j: { steps: [{ run: "set -euo pipefail\ntar -tzf x.tgz | head -50" }] } } }
    expect(findPipefailHeadProblems(broken)).toHaveLength(1)
  })
})

describe("release.yml privileges", () => {
  const release = load("release.yml")
  const jobs = release.jobs

  test("only the publish job holds id-token: write", () => {
    expect(release.permissions?.["id-token"]).toBeUndefined()
    expect(jobs.publish.permissions).toEqual({ contents: "read", "id-token": "write" })
    for (const [name, job] of Object.entries(jobs)) {
      if (name !== "publish") expect(job.permissions?.["id-token"]).toBeUndefined()
    }
    expect(jobs["publish-dry-run"].permissions).toEqual({ contents: "read" })
  })

  test("the publish job runs only on a push, never on a manual run", () => {
    const condition = String(jobs.publish.if)
    expect(condition).toContain("github.event_name == 'push'")
    expect(condition).toContain("releases_created == 'true'")
    expect(condition).toContain("needs.build.result == 'success'")
    expect(condition).not.toContain("workflow_dispatch")
  })

  test("the publish job installs and builds nothing", () => {
    for (const step of jobs.publish.steps) {
      expect(String(step.uses ?? "")).not.toContain("setup-bun")
      expect(String(step.run ?? "")).not.toMatch(/\b(bun|yarn|pnpm)\b|npm (install|ci|i|run)\b/)
    }
  })

  test("the dry-run job runs only on a manual run", () => {
    expect(String(jobs["publish-dry-run"].if)).toContain("workflow_dispatch")
  })
})
