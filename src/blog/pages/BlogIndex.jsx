import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import { useReveal } from '../../hooks'

const postModules = import.meta.glob('../../content/blog/*.mdx', { eager: true })

const ALL_POSTS = Object.entries(postModules)
  .map(([path, mod]) => ({
    slug: path.split('/').pop().replace('.mdx', ''),
    ...(mod.frontmatter || {}),
  }))
  .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))

const fuseIndex = new Fuse(ALL_POSTS, {
  keys: ['title', 'excerpt', 'category', 'series'],
  threshold: 0.35,
  minMatchCharLength: 2,
})

function fmt(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function BlogIndex() {
  useReveal([])
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')

  const categories = useMemo(() => {
    const uniq = [...new Set(ALL_POSTS.map(p => p.category).filter(Boolean))]
    return ['All', ...uniq]
  }, [])

  const visible = useMemo(() => {
    if (!query.trim()) {
      return cat === 'All' ? ALL_POSTS : ALL_POSTS.filter(x => x.category === cat)
    }
    const results = fuseIndex.search(query).map(r => r.item)
    return cat === 'All' ? results : results.filter(x => x.category === cat)
  }, [query, cat])

  const { seriesMap, standalone } = useMemo(() => {
    const seriesMap = {}
    const standalone = []
    visible.forEach(p => {
      if (p.series) {
        if (!seriesMap[p.series]) seriesMap[p.series] = []
        seriesMap[p.series].push(p)
      } else {
        standalone.push(p)
      }
    })
    Object.values(seriesMap).forEach(parts =>
      parts.sort((a, b) => (a.part || 0) - (b.part || 0))
    )
    return { seriesMap, standalone }
  }, [visible])

  const catCount = c =>
    c === 'All' ? ALL_POSTS.length : ALL_POSTS.filter(p => p.category === c).length

  return (
    <div className="bi-page wrap">
      <header className="bi-masthead reveal">
        <div className="bi-masthead-row">
          <h1 className="bi-title">Writing</h1>
          <span className="bi-total">{ALL_POSTS.length} articles</span>
        </div>
        <p className="bi-subtitle">
          Deep dives into systems, protocols, and data engineering.
        </p>
      </header>

      <div className="bi-controls reveal">
        <div className="bi-cats">
          {categories.map(c => (
            <button
              key={c}
              className={`bi-cat${cat === c ? ' active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
              <span className="bi-cat-n">{catCount(c)}</span>
            </button>
          ))}
        </div>
        <div className="bi-search-wrap">
          <svg className="bi-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search articles..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bi-search"
          />
        </div>
      </div>

      <div className="bi-body">
        {visible.length === 0 && (
          <p className="bi-empty reveal">No articles match your filter.</p>
        )}

        {Object.entries(seriesMap).map(([name, parts]) => {
          const allParts = ALL_POSTS
            .filter(p => p.series === name)
            .sort((a, b) => (a.part || 0) - (b.part || 0))

          return (
            <section className="bi-series reveal" key={name}>
              <div className="bi-series-header">
                <div className="bi-series-meta">
                  <span className="bi-series-label">Series</span>
                  <span className="bi-sep">·</span>
                  <span className="bi-series-cat">{parts[0]?.category}</span>
                  <span className="bi-sep">·</span>
                  <span className="bi-series-count">{allParts.length} parts</span>
                </div>
                <h2 className="bi-series-name">{name}</h2>
              </div>
              <div className="bi-parts">
                {allParts.map(part =>
                  part.draft ? (
                    <div key={part.slug} className="bi-part bi-part--draft">
                      <div className="bi-part-indicator draft" />
                      <div className="bi-part-body">
                        <span className="bi-part-n">Part {part.part}</span>
                        <span className="bi-part-title">{part.title}</span>
                      </div>
                      <span className="bi-part-soon">Soon</span>
                    </div>
                  ) : (
                    <Link key={part.slug} to={`/blog/${part.slug}`} className="bi-part bi-part--pub">
                      <div className="bi-part-indicator pub" />
                      <div className="bi-part-body">
                        <span className="bi-part-n">Part {part.part}</span>
                        <span className="bi-part-title">{part.title}</span>
                      </div>
                      <div className="bi-part-right">
                        <span className="bi-part-read">{part.readTime}</span>
                        <span className="bi-part-arr">→</span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </section>
          )
        })}

        {standalone.length > 0 && (
          <section className="bi-standalone">
            {Object.keys(seriesMap).length > 0 && (
              <div className="sec-label reveal">Articles</div>
            )}
            <div className="bi-articles">
              {standalone.map((post, i) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="bi-article reveal">
                  <div className="bi-article-num">№{String(i + 1).padStart(2, '0')}</div>
                  <div className="bi-article-body">
                    <div className="bi-article-meta">
                      {post.category && <span className="bi-article-cat">{post.category}</span>}
                      <span className="bi-article-dot">·</span>
                      <span className="bi-article-date">{fmt(post.date)}</span>
                    </div>
                    <h3 className="bi-article-title">{post.title}</h3>
                    {post.excerpt && <p className="bi-article-excerpt">{post.excerpt}</p>}
                  </div>
                  <div className="bi-article-aside">
                    <span className="bi-article-read">{post.readTime}</span>
                    <span className="bi-article-arr">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
