---
"@smicolon/cli": minor
---

Implement full registry integration for CLI

- Add registry fetching from ui.smicolon.com/r/
- `list` command now fetches available components from live registry
- `add` command downloads actual component source code
- Automatically transforms imports to match project configuration
- Shows required dependencies after adding components
- Shows correct import paths for added components
