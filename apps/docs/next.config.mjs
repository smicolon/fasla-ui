import createMDX from "@next/mdx"
import createNextIntlPlugin from "next-intl/plugin"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: "github-dark",
  keepBackground: true,
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  transpilePackages: ["@smicolon/fasla-ui"],
  // Storybook will be copied to /components during build
  trailingSlash: true,
}

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

export default withNextIntl(withMDX(nextConfig))
