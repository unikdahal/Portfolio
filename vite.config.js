import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'

function rehypeCodeTitle() {
  return (tree) => {
    walk(tree)
    function walk(node) {
      if (node.type === 'element' && node.tagName === 'pre') {
        const code = node.children?.[0]
        if (code?.type === 'element' && code.tagName === 'code') {
          const meta = code.properties?.metastring || ''
          if (meta) {
            const m = meta.match(/title="([^"]+)"/)
            if (m) code.properties.title = m[1]
          }
        }
      }
      node.children?.forEach(walk)
    }
  }
}

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
      rehypePlugins: [rehypeCodeTitle],
    }),
    react(),
  ],
})
