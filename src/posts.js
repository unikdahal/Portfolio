import { BLOG_SERIES } from './series.js'

// Auto-discovers every file in src/posts/*.jsx
// To add a new post: create src/posts/NNN-your-slug.jsx — nothing else needed.
const modules = import.meta.glob('./posts/*.jsx', { eager: true })
export const posts = Object.values(modules).map(m => m.default)

export { BLOG_SERIES }
