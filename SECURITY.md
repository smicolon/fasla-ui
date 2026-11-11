# Security policy

## Reporting a vulnerability

Please report security problems privately. **Do not open a public issue,
discussion or pull request for a vulnerability.** A public report tells
everyone about the problem before a fix exists.

Email **support@smicolon.com** with:

- what you found and which part of the project it affects
- the version you tested (`npx @smicolon/fasla-ui@latest --version`, or the
  package version in your lockfile)
- steps to reproduce, or a small proof of concept
- the impact as you understand it

If GitHub private vulnerability reporting is enabled for this repository, you
can use the **Report a vulnerability** button on the
[Security tab](https://github.com/smicolon/fasla-ui/security) instead. It is
optional and may not be switched on yet; email always works.

## What is in scope

- the `fasla-ui` command-line tool (`init`, `add`, `list`), including how it
  reads, writes and installs files in your project
- the published npm package `@smicolon/fasla-ui` and the component source it
  ships
- the documentation site at <https://fasla.smicolon.com>

Reports about third-party dependencies are welcome too, but the fix usually has
to come from that project; we will pass it on and update our dependency.

## What to expect

This is a small project, so these are intentions, not guarantees:

- we aim to acknowledge a report within a few working days
- we will tell you whether we can reproduce it and what we plan to do
- we will fix confirmed problems as soon as we reasonably can, and credit you
  in the release notes if you would like that

Please give us a fair chance to ship a fix before you disclose the issue
publicly.

## Supported versions

Only the latest published release of `@smicolon/fasla-ui` receives security
fixes. If you are on an older version, upgrade first and check whether the
problem is still there.
