import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react'
import Fuse from 'fuse.js'

const postModules = import.meta.glob('../../content/blog/*.mdx', {
  eager: true,
})
const ALL_POSTS = Object.entries(postModules)
  .map(([path, mod]) => ({
    slug: path.split('/').pop().replace('.mdx', ''),
    ...(mod.frontmatter || {}),
  }))
  .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
const publishedCount = ALL_POSTS.filter((post) => !post.draft).length
const draftCount = ALL_POSTS.length - publishedCount
const categories = [
  'All',
  ...new Set(ALL_POSTS.map((post) => post.category).filter(Boolean)),
]
const fuseIndex = new Fuse(ALL_POSTS, {
  keys: ['title', 'excerpt', 'category', 'series'],
  threshold: 0.35,
  minMatchCharLength: 2,
})

export default function BlogIndex() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const visible = useMemo(() => {
    const matches = query.trim()
      ? fuseIndex.search(query.trim()).map((result) => result.item)
      : ALL_POSTS
    return matches.filter(
      (post) => category === 'All' || post.category === category,
    )
  }, [query, category])
  const series = useMemo(() => {
    const groups = new Map()
    for (const post of visible) {
      const name = post.series || 'Other writing'
      if (!groups.has(name)) groups.set(name, [])
      groups.get(name).push(post)
    }
    for (const posts of groups.values())
      posts.sort((a, b) => (a.part || 0) - (b.part || 0))
    return [...groups.entries()]
  }, [visible])

  return (
    <div className="bi-page wrap">
      <Helmet>
        <title>Writing | Unik Dahal</title>
        <meta
          name="description"
          content="Notes on building systems, understanding protocols, and learning by reading the source. By Unik Dahal."
        />
        <meta property="og:title" content="Writing | Unik Dahal" />
        <meta
          property="og:description"
          content="Notes on building systems, understanding protocols, and learning by reading the source."
        />
        <meta property="og:url" content="https://www.unikdahal.com.np/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Writing | Unik Dahal" />
        <meta
          name="twitter:description"
          content="Notes on building systems, understanding protocols, and learning by reading the source."
        />
        <link rel="canonical" href="https://www.unikdahal.com.np/blog" />
      </Helmet>
      <header className="bi-masthead">
        <div className="bi-masthead-row">
          <h1 className="bi-title">
            Notes from
            <br />
            <em>the build.</em>
          </h1>
          <span className="bi-total">
            {publishedCount} published
            <br />
            {draftCount} in progress
          </span>
        </div>
        <p className="bi-subtitle">
          Protocols, internals, and the things I learn by building them.
        </p>
      </header>
      <div className="bi-controls">
        <div className="bi-cats" role="group" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              className={`bi-cat${category === item ? ' active' : ''}`}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
              <span className="bi-cat-n">
                {
                  ALL_POSTS.filter(
                    (post) => item === 'All' || post.category === item,
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
        <div className="bi-search-wrap">
          <Search className="bi-search-icon" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search writing"
            placeholder="Search writing…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="bi-search"
          />
        </div>
      </div>
      <div className="bi-body" aria-live="polite">
        {visible.length === 0 && (
          <p className="bi-empty">
            No matches yet. Try another word or category.
          </p>
        )}
        {series.map(([name, parts]) => (
          <section className="bi-series" key={name}>
            <div className="bi-series-header">
              <div className="bi-series-meta">
                <span>{parts[0]?.series ? 'Series' : 'Articles'}</span>
                <span aria-hidden="true">/</span>
                <span>{parts[0]?.category}</span>
              </div>
              <h2 className="bi-series-name">{name}</h2>
            </div>
            <div className="bi-parts">
              {parts.map((part) =>
                part.draft ? (
                  <div key={part.slug} className="bi-part bi-part--draft">
                    <div className="bi-part-body">
                      <span className="bi-part-n">Part {part.part}</span>
                      <span className="bi-part-title">{part.title}</span>
                    </div>
                    <span className="bi-part-soon">In progress</span>
                  </div>
                ) : (
                  <Link
                    key={part.slug}
                    to={`/blog/${part.slug}`}
                    className="bi-part bi-part--pub"
                  >
                    <div className="bi-part-body">
                      <span className="bi-part-n">
                        {part.part ? `Part ${part.part}` : part.category}
                      </span>
                      <span className="bi-part-title">{part.title}</span>
                    </div>
                    <span className="bi-part-right">{part.readTime}</span>
                  </Link>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
