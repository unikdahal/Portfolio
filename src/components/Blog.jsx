import { useState } from 'react'
import { posts, BLOG_SERIES } from '../posts.js'

function CategoryFilter({ categories, counts, active, onChange }) {
  return (
    <div className="blog-cats">
      {['All', ...categories].map(cat => (
        <button
          key={cat}
          className={'blog-cat' + (active === cat ? ' active' : '')}
          onClick={() => onChange(cat)}
        >
          {cat}
          <span className="blog-cat-count">
            {cat === 'All' ? counts.total : (counts[cat] || 0)}
          </span>
        </button>
      ))}
    </div>
  )
}

function SeriesCard({ seriesId, onOpenPost }) {
  const series = BLOG_SERIES[seriesId]
  const parts = posts
    .filter(p => p.series && p.series.id === seriesId)
    .sort((a, b) => a.series.part - b.series.part)

  if (!series || !parts.length) return null
  const published = parts.filter(p => !p.draft).length

  return (
    <div className="series-card reveal">
      <div className="series-top">
        <div className="series-meta">
          <span className="series-label">Series</span>
          <span className="series-sep">·</span>
          <span className="series-cat-tag">{series.category}</span>
          <span className="series-parts-count">{published}/{series.totalParts} published</span>
        </div>
        <h3 className="series-name">{series.name}</h3>
        <p className="series-desc">{series.desc}</p>
      </div>
      <div className="series-parts-list">
        {parts.map(part => (
          <div
            key={part.id}
            className={'series-part ' + (part.draft ? 'draft' : 'published')}
            onClick={!part.draft ? () => onOpenPost(part) : undefined}
          >
            <span className={'sp-indicator ' + (part.draft ? 'draft' : 'pub')} />
            <div className="sp-body">
              <div className="sp-num">Part {part.series.part}</div>
              <div className="sp-title">{part.title}</div>
            </div>
            <div className="sp-right">
              {part.draft ? (
                <span className="sp-soon">Soon</span>
              ) : (
                <>
                  <span className="sp-date">{part.date}</span>
                  <span className="sp-read">{part.readTime}</span>
                  <span className="sp-arrow">→</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Blog({ onOpenPost }) {
  const [activeCat, setActiveCat] = useState('All')

  if (!posts.length) return null

  const allCats = [...new Set(posts.map(p => p.category).filter(Boolean))]
  const counts = { total: posts.length }
  allCats.forEach(cat => { counts[cat] = posts.filter(p => p.category === cat).length })

  const filtered   = activeCat === 'All' ? posts : posts.filter(p => p.category === activeCat)
  const seriesIds  = [...new Set(filtered.filter(p => p.series).map(p => p.series.id))]
  const standalone = filtered.filter(p => !p.series && !p.draft)

  return (
    <section id="blog" className="content">
      <div className="wrap">
        <div className="sec-label reveal">Writing</div>

        {allCats.length > 0 && (
          <div className="reveal">
            <CategoryFilter categories={allCats} counts={counts} active={activeCat} onChange={setActiveCat} />
          </div>
        )}

        {seriesIds.map(id => (
          <SeriesCard key={id} seriesId={id} onOpenPost={onOpenPost} />
        ))}

        {standalone.length > 0 && (
          <div className="blog-standalone">
            {standalone.map((post, i) => (
              <div className="blog-item reveal" key={post.id} onClick={() => onOpenPost(post)}>
                <div className="blog-item-left">
                  <div className="blog-item-num">№{String(i + 1).padStart(3, '0')}</div>
                  <div className="blog-item-title">{post.title}</div>
                  <div className="blog-item-excerpt">{post.excerpt}</div>
                </div>
                <div className="blog-item-right">
                  <div className="blog-tag">{post.tag}</div>
                  <div className="blog-date">{post.date}</div>
                  <div className="blog-read">{post.readTime}</div>
                  <div className="blog-item-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
