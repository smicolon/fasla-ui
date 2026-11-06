import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const page = readFileSync(path.join(docsRoot, "app/[locale]/docs/installation/page.tsx"), "utf8")
const messages = (lang) => JSON.parse(readFileSync(path.join(docsRoot, `messages/${lang}.json`), "utf8")).docs.installation
// The block, from its heading to the closing note.
const block = page.slice(page.indexOf('id="without-questions"'), page.indexOf('i.rich("cliFlagsEnd"'))

describe("Installation: Without questions block", () => {
  test("is an h3 with a stable anchor, so it shows under On this page, after the list command", () => {
    expect(page).toMatch(/<h3 id="without-questions" className="scroll-mt-24 text-xl font-semibold[^"]*">\s*\{i\("cliFlagsTitle"\)\}/)
    expect(page.indexOf('id="without-questions"')).toBeGreaterThan(page.indexOf("npx @smicolon/fasla-ui@latest list"))
    expect(page.indexOf('id="without-questions"')).toBeLessThan(page.indexOf('i("themeTitle")'))
  })

  test("shows the example in a block that scrolls sideways, is focusable and never wraps", () => {
    const pre = block.slice(block.indexOf("<pre"), block.indexOf("</pre>"))
    expect(pre).toContain('dir="ltr"')
    expect(pre).toContain("tabIndex={0}")
    expect(pre).toContain("overflow-x-auto")
    expect(pre).toContain("whitespace-pre")
    expect(pre).not.toMatch(/whitespace-pre-wrap|break-words|break-all/)
    expect(pre).toContain("focus-visible:ring-2")
    for (const line of [
      "npx @smicolon/fasla-ui@latest init --yes",
      "npx @smicolon/fasla-ui@latest init --path src/components --style default --theme fasla",
      "npx @smicolon/fasla-ui@latest add button --yes",
    ]) {
      expect(pre).toContain(line)
    }
  })

  test("keeps a flag or a path in the text on one line", () => {
    expect(page).toMatch(/const flagCode = \{[\s\S]*whitespace-nowrap/)
    for (const key of ["cliFlagsBody", "cliFlagYes", "cliFlagPath", "cliFlagStyle", "cliFlagTheme", "cliFlagNoInstall", "cliFlagsEnd"]) {
      expect(page).toContain(`i.rich("${key}", flagCode)`)
    }
  })

  test("leaves the page's other code blocks as they were", () => {
    expect(page.match(/whitespace-pre-wrap break-words rounded-lg bg-terminal p-4/g)?.length).toBe(4)
  })

  test("English: pass all three flags, and -y is the short form of --yes", () => {
    const t = messages("en")
    expect(t.cliFlagsBody).toContain("or pass all three of <code>--path</code>, <code>--style</code> and <code>--theme</code>")
    expect(t.cliFlagsBody).not.toContain("give each choice")
    expect(t.cliFlagYes).toBe("<code>--yes</code> (<code>-y</code>) accepts every default and asks nothing.")
  })

  test("Arabic: the agreed wording, code spans untouched", () => {
    const t = messages("ar")
    expect(t.cliFlagsTitle).toBe("بلا أسئلة: لوكلاء الذكاء الاصطناعي وأنظمة التكامل المستمر (CI)")
    expect(t.cliFlagsBody).toContain("لا يطرح الأمر <code>init</code> أسئلة إلا إذا كان يعمل في طرفية (terminal) يتفاعل معها مستخدم.")
    expect(t.cliFlagsBody).toContain("أو مرّر الخيارات الثلاثة كلها: <code>--path</code>، <code>--style</code>، <code>--theme</code>.")
    expect(t.cliFlagsBody).toContain("وإذا غاب أيٌّ منها، يعرض الأمر <code>init</code> الخيارات الناقصة")
    expect(t.cliFlagsBody).toContain("كما يفعل وكيل ذكاء اصطناعي أو مهمة تكامل مستمر")
    expect(t.cliFlagsBody).not.toContain("وكيل برمجي")
    expect(t.cliFlagTheme).toContain("<code>--theme</code> هو طبقة المظهر")
    expect(t.cliFlagYes).toBe("<code>--yes</code> (<code>-y</code>) يقبل كل القيم الافتراضية ولا يطرح أي سؤال.")
    expect(t.cliFlagNoInstall).toBe("<code>--no-install</code> يطبع أوامر التثبيت بدلًا من تنفيذها.")
    expect(t.cliFlagsExample).toBe("أمثلة:")
  })
})
