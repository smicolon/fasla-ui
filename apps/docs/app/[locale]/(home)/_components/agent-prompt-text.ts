/**
 * The prompt the landing page's "Copy prompt" button puts on the clipboard.
 *
 * One constant, in English in both locales: agents follow English instructions
 * best, and the commands are English anyway. Only open-source commands, as the
 * CLI publishes them: the CLI does not check a licence key, so nothing here
 * mentions licences or premium blocks. No secrets, no private URLs.
 *
 * tests/agent-prompt.test.mjs holds every command in here to the CLI's own.
 */
export const agentPrompt = `Set up Fasla in this project. Fasla is an Arabic-first, RTL-ready React component library built on shadcn/ui and Tailwind CSS (docs: https://fasla.smicolon.com).

1. Check that this is a React (18 or 19) and Tailwind CSS (3.4 or 4) project, such as Next.js or Vite, and tell me what you find.
2. Run \`npx @smicolon/fasla-ui@latest init\` and follow the prompts. It asks where components go and which theme to use ("fasla" for Fasla's colours, "brand" to keep mine): ask me before you choose.
3. Run \`npx @smicolon/fasla-ui@latest list\` to see the available components, then add the ones I ask for, for example \`npx @smicolon/fasla-ui@latest add button\`.
4. Fasla copies component source into my project, so I can edit the files freely.
5. Use CSS logical properties (margin-inline-start, not margin-left) and keep both LTR and RTL working. Set dir="rtl" on the root for Arabic pages.
6. Do not change my existing components unless I ask, and show me your plan before you install anything.

Ask me which components I want first.`
