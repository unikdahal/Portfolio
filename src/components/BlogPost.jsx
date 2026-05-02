import { useEffect } from 'react'
import { useReadingProgress } from '../hooks.jsx'
import { posts, BLOG_SERIES } from '../posts.js'

function ReadingProgressBar() {
  const p = useReadingProgress()
  return <div className="read-progress-bar" style={{ width: p + '%' }} />
}

function renderBlock(block, i) {
  switch (block.type) {
    case 'h2':    return <h2 className="post-h2" key={i}>{block.text}</h2>
    case 'h3':    return <h3 className="post-h3" key={i}>{block.text}</h3>
    case 'p':     return <p  className="post-p"  key={i}>{block.text}</p>
    case 'quote': return <blockquote className="post-quote" key={i}>{block.text}</blockquote>
    case 'ul':
      return (
        <ul className="post-ul" key={i}>
          {block.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      )
    case 'code':
      return (
        <div className="post-code-wrap" key={i}>
          {block.lang && <div className="post-code-lang">{block.lang}</div>}
          <pre className="post-code"><code>{block.text}</code></pre>
        </div>
      )
    default: return null
  }
}

function SeriesNav({ post, onOpenPost }) {
  if (!post.series) return null
  const series = BLOG_SERIES[post.series.id]
  if (!series) return null

  const parts = posts
    .filter(p => p.series && p.series.id === post.series.id)
    .sort((a, b) => a.series.part - b.series.part)

  const idx  = parts.findIndex(p => p.id === post.id)
  const prev = idx > 0 && !parts[idx - 1].draft ? parts[idx - 1] : null
  const next = idx < parts.length - 1 ? parts[idx + 1] : null

  return (
    <div className="post-series-nav">
      <div className="psn-label">In this series · {series.name}</div>
      <div className="psn-parts">
        {parts.map(p => {
          const cur = p.id === post.id
          return (
            <div
              key={p.id}
              className={'psn-part ' + (cur ? 'current' : p.draft ? 'draft' : 'published')}
              onClick={!cur && !p.draft ? () => onOpenPost(p) : undefined}
            >
              <span className={'psn-dot ' + (cur ? 'current' : p.draft ? 'draft' : 'pub')} />
              <span className="psn-part-num">Part {p.series.part}</span>
              <span className="psn-title">{p.title}</span>
              {cur && <span className="psn-badge">Reading</span>}
              {p.draft && !cur && <span className="psn-badge">Soon</span>}
            </div>
          )
        })}
      </div>
      <div className="post-nav-row">
        {prev ? (
          <button className="post-nav-btn" onClick={() => onOpenPost(prev)}>
            <span className="pnb-dir">← Part {prev.series.part}</span>
            <span className="pnb-title">{prev.title}</span>
          </button>
        ) : <div />}
        {next ? (
          <button
            className={'post-nav-btn next' + (next.draft ? ' soon' : '')}
            onClick={!next.draft ? () => onOpenPost(next) : undefined}
          >
            <span className="pnb-dir">Part {next.series.part} →</span>
            <span className="pnb-title">{next.draft ? 'Coming soon' : next.title}</span>
          </button>
        ) : <div />}
      </div>
    </div>
  )
}

export default function BlogPost({ post, onClose, onOpenPost }) {
  useEffect(() => { window.scrollTo(0, 0) }, [post])

  const hasSeries   = !!post.series
  const series      = hasSeries ? BLOG_SERIES[post.series.id] : null
  const seriesParts = hasSeries
    ? posts.filter(p => p.series && p.series.id === post.series.id).sort((a, b) => a.series.part - b.series.part)
    : []

  return (
    <div className="post-page">
      <ReadingProgressBar />
      <div className="post-hero">
        <div className="wrap">
          {hasSeries && series && (
            <div className="post-series-band">
              <div className="post-series-crumb">
                <span className="psb-name">{series.name}</span>
                <span className="psb-sep"> · </span>
                <span className="psb-part">Part {post.series.part} of {series.totalParts}</span>
              </div>
              <div className="post-series-progress">
                {seriesParts.map(p => (
                  <span
                    key={p.id}
                    className={'psp-dot' + (p.id === post.id ? ' active' : (!p.draft ? ' pub' : ''))}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="post-meta-top">
            <span className="post-tag">{post.tag}</span>
            <span className="post-date">{post.date}</span>
            <span className="post-read">{post.readTime}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-excerpt">{post.excerpt}</p>
        </div>
      </div>
      <div className="post-body">
        <div className="post-content wrap">
          {post.content.map((block, i) => renderBlock(block, i))}
          {hasSeries && <SeriesNav post={post} onOpenPost={onOpenPost} />}
          <div className="post-end">
            <button className="post-end-back" onClick={onClose}>← Back to writing</button>
          </div>
        </div>
      </div>
    </div>
  )
}
