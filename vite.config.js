import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'

function rehypeCodeMeta() {
  return (tree) => {
    walk(tree)
    function walk(node) {
      if (node.type === 'element' && node.tagName === 'pre') {
        const code = node.children?.[0]
        if (code?.type === 'element' && code.tagName === 'code') {
          const meta = code.properties?.metastring || ''
          if (meta) {
            const tm = meta.match(/title="([^"]+)"/)
            if (tm) code.properties.title = tm[1]
            const hm = meta.match(/\{([\d,\-\s]+)\}/)
            if (hm) code.properties['data-highlight'] = hm[1]
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
      rehypePlugins: [rehypeCodeMeta],
    }),
    react(),
  ],
  optimizeDeps: {
    exclude: ['mermaid'],
  },
})
