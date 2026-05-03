import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useReveal } from '../../hooks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Link2 } from 'lucide-react'
import Giscus from '@giscus/react'
import { Helmet } from 'react-helmet-async'

const postModules = import.meta.glob('../../content/blog/*.mdx')
const postModulesEager = import.meta.glob('../../content/blog/*.mdx', { eager: true })

function getSeriesParts(seriesName) {
  return Object.entries(postModulesEager)
    .map(([path, mod]) => ({
      slug: path.split('/').pop().replace('.mdx', ''),
      ...(mod.frontmatter || {}),
    }))
    .filter(p => p.series === seriesName)
    .sort((a, b) => (a.part || 0) - (b.part || 0))
}

function useDocTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setTheme(document.documentElement.getAttribute('data-theme') || 'light')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return theme
}

function useReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  return pct
}

function useTOC(PostComponent) {
  const [headings, setHeadings] = useState([])
  useEffect(() => {
    if (!PostComponent) return
    const timer = setTimeout(() => {
      const prose = document.querySelector('.prose')
      if (!prose) return
      const els = prose.querySelectorAll('h2[id], h3[id]')
      setHeadings(Array.from(els).map(el => ({
        id: el.id,
        text: el.textContent.replace(/#\s*$/, '').trim(),
        level: el.tagName === 'H2' ? 2 : 3,
      })))
    }, 150)
    return () => clearTimeout(timer)
  }, [PostComponent])
  return headings
}

function useActiveHeading(headings) {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!headings.length) return
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    )
    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [headings])
  return active
}

function useWordCount(PostComponent) {
  const [words, setWords] = useState(0)
  useEffect(() => {
    if (!PostComponent) return
    const timer = setTimeout(() => {
      const prose = document.querySelector('.prose')
      if (!prose) return
      const text = prose.textContent || ''
      setWords(text.trim().split(/\s+/).filter(Boolean).length)
    }, 200)
    return () => clearTimeout(timer)
  }, [PostComponent])
  return words
}

function extractText(node) {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node?.props?.children) return extractText(node.props.children)
  return ''
}

function toSlug(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function parseHighlightLines(str) {
  if (!str) return new Set()
  const set = new Set()
  String(str).split(',').forEach(part => {
    part = part.trim()
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number)
      for (let i = a; i <= b; i++) set.add(i)
    } else if (part) {
      set.add(Number(part))
    }
  })
  return set
}

function AnchoredH2({ children, ...p }) {
  const id = toSlug(extractText(children))
  return (
    <h2 id={id} className="mdx-h2" {...p}>
      {children}
      <a href={`#${id}`} className="mdx-anchor" aria-hidden="true">#</a>
    </h2>
  )
}

function AnchoredH3({ children, ...p }) {
  const id = toSlug(extractText(children))
  return (
    <h3 id={id} className="mdx-h3" {...p}>
      {children}
      <a href={`#${id}`} className="mdx-anchor" aria-hidden="true">#</a>
    </h3>
  )
}

const CALLOUT_META = {
  note:    { icon: 'ℹ', label: 'Note' },
  tip:     { icon: '◆', label: 'Tip' },
  warning: { icon: '⚠', label: 'Warning' },
  danger:  { icon: '✕', label: 'Danger' },
}

function Callout({ type = 'note', title, children }) {
  const meta = CALLOUT_META[type] || CALLOUT_META.note
  return (
    <div className={`mdx-callout mdx-callout-${type}`}>
      <div className="callout-header">
        <span className="callout-icon">{meta.icon}</span>
        <span className="callout-label">{title || meta.label}</span>
      </div>
      <div className="callout-body">{children}</div>
    </div>
  )
}

function MermaidBlock({ children }) {
  const theme = useDocTheme()
  const [svg, setSvg] = useState('')
  const [loading, setLoading] = useState(true)
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    const code = String(children).trim()
    setLoading(true)
    import('mermaid').then(m => {
      const mermaid = m.default
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'neutral',
        securityLevel: 'loose',
      })
      idRef.current = `mermaid-${Math.random().toString(36).slice(2)}`
      mermaid.render(idRef.current, code)
        .then(({ svg: s }) => { setSvg(s); setLoading(false) })
        .catch(() => setLoading(false))
    })
  }, [children, theme])

  if (loading) return <div className="mdx-mermaid-loading">Rendering diagram...</div>
  return <div className="mdx-mermaid" dangerouslySetInnerHTML={{ __html: svg }} />
}

function CodeBlock({ children, className, title, 'data-highlight': highlight }) {
  const [copied, setCopied] = useState(false)
  const theme = useDocTheme()
  const language = className?.replace('language-', '') || 'text'
  const code = String(children).replace(/\n$/, '')

  if (language === 'mermaid') return <MermaidBlock>{code}</MermaidBlock>

  const highlightSet = parseHighlightLines(highlight)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mdx-code-block">
      <div className="mdx-code-header">
        <span className={title ? 'mdx-code-title' : 'mdx-code-lang'}>
          {title || language}
        </span>
        <button onClick={copy} className="mdx-copy-btn">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? vscDarkPlus : oneLight}
        PreTag="div"
        wrapLines={highlightSet.size > 0}
        lineProps={highlightSet.size > 0
          ? ln => {
              const hl = highlightSet.has(ln)
              return {
                style: {
                  display: 'block',
                  backgroundColor: hl
                    ? (theme === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)')
                    : 'transparent',
                  borderLeft: hl ? '3px solid var(--accent)' : '3px solid transparent',
                  paddingLeft: '6px',
                  marginLeft: '-9px',
                },
              }
            }
          : undefined}
        customStyle={{
          margin: 0,
          padding: '20px 24px',
          background: 'transparent',
          fontSize: '13.5px',
          lineHeight: '1.7',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

function TableOfContents({ headings, active }) {
  if (headings.length < 3) return null
  return (
    <nav className="bp-toc" aria-label="Table of contents">
      <div className="bp-toc-label">On this page</div>
      <ul className="bp-toc-list">
        {headings.map(h => (
          <li key={h.id} className={`bp-toc-item level-${h.level}`}>
            <a
              href={`#${h.id}`}
              className={`bp-toc-link${active === h.id ? ' active' : ''}`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function ShareBar({ title }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  return (
    <div className="bp-share">
      <span className="bp-share-label">Share</span>
      <button onClick={copyLink} className="bp-share-btn">
        {copied ? <Check size={13} /> : <Link2 size={13} />}
        <span>{copied ? 'Copied!' : 'Copy link'}</span>
      </button>
      <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="bp-share-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.728-8.835L1.254 2.25H8.08l4.262 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
        <span>Share on X</span>
      </a>
    </div>
  )
}

const mdxComponents = {
  h2: AnchoredH2,
  h3: AnchoredH3,
  p:  p => <p  className="mdx-p"  {...p} />,
  ul: p => <ul className="mdx-ul" {...p} />,
  ol: p => <ol className="mdx-ol" {...p} />,
  li: p => <li className="mdx-li" {...p} />,
  blockquote: p => <blockquote className="mdx-quote" {...p} />,
  hr: () => <hr className="mdx-hr" />,
  table: p => <div className="mdx-table-wrap"><table className="mdx-table" {...p} /></div>,
  thead: p => <thead {...p} />,
  tbody: p => <tbody {...p} />,
  tr:    p => <tr    {...p} />,
  th:    p => <th className="mdx-th" {...p} />,
  td:    p => <td className="mdx-td" {...p} />,
  pre: ({ children }) => {
    const childProps = children?.props || {}
    if (childProps.className?.includes('language-')) {
      return <CodeBlock {...childProps} />
    }
    return <pre className="mdx-pre">{children}</pre>
  },
  code: ({ className, ...props }) => {
    if (className?.includes('language-')) return <CodeBlock className={className} {...props} />
    return <code className="mdx-inline-code" {...props} />
  },
  Callout,
}

function fmtLong(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [PostComponent, setPostComponent] = useState(null)
  const [meta, setMeta] = useState(null)
  const progress = useReadingProgress()
  const theme = useDocTheme()
  const headings = useTOC(PostComponent)
  const activeHeading = useActiveHeading(headings)
  const wordCount = useWordCount(PostComponent)
  useReveal([PostComponent])

  const minutesLeft = (() => {
    if (!wordCount || progress >= 95) return null
    const wordsLeft = Math.ceil(wordCount * (1 - progress / 100))
    const mins = Math.ceil(wordsLeft / 200)
    return mins <= 1 ? '< 1 min left' : `~${mins} min left`
  })()

  useEffect(() => {
    const key = Object.keys(postModules).find(p => p.endsWith(`${slug}.mdx`))
    if (!key) { navigate('/blog', { replace: true }); return }
    postModules[key]()
      .then(mod => {
        setPostComponent(() => mod.default)
        setMeta(mod.frontmatter || {})
      })
      .catch(() => navigate('/blog', { replace: true }))
    window.scrollTo(0, 0)
  }, [slug])

  if (!PostComponent || !meta) {
    return (
      <div className="bp-loading wrap">
        <div className="bp-loading-dot" />
      </div>
    )
  }

  const seriesParts = meta.series ? getSeriesParts(meta.series) : []
  const totalParts = seriesParts.length
  const currentIdx = seriesParts.findIndex(p => p.slug === slug)
  const prevPart = currentIdx > 0 ? seriesParts[currentIdx - 1] : null
  const nextPart = currentIdx >= 0 && currentIdx < totalParts - 1 ? seriesParts[currentIdx + 1] : null

  const canonicalUrl = `https://www.unikdahal.com.np/blog/${slug}`

  return (
    <article className="bp-page">
      <Helmet>
        <title>{meta.title} — Unik Dahal</title>
        {meta.excerpt && <meta name="description" content={meta.excerpt} />}
        <meta property="og:title" content={meta.title} />
        {meta.excerpt && <meta property="og:description" content={meta.excerpt} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        {meta.excerpt && <meta name="twitter:description" content={meta.excerpt} />}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="bp-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <TableOfContents headings={headings} active={activeHeading} />

      <header className="bp-header wrap reveal">
        <Link to="/blog" className="bp-back">← Writing</Link>

        <div className="bp-meta-row">
          {meta.category && <span className="bp-cat">{meta.category}</span>}
          {meta.series && (
            <>
              <span className="bp-sep">·</span>
              <span className="bp-series-crumb">
                {meta.series} &middot; Part {meta.part} of {totalParts}
              </span>
            </>
          )}
          <span className="bp-sep">·</span>
          <span className="bp-date">{fmtLong(meta.date)}</span>
          <span className="bp-sep">·</span>
          <span className="bp-read">{meta.readTime}</span>
          {minutesLeft && (
            <>
              <span className="bp-sep">·</span>
              <span className="bp-time-left">{minutesLeft}</span>
            </>
          )}
        </div>

        <h1 className="bp-title">{meta.title}</h1>
        {meta.excerpt && <p className="bp-excerpt">{meta.excerpt}</p>}

        <ShareBar title={meta.title} />
      </header>

      {meta.series && totalParts > 1 && (
        <div className="bp-series-nav wrap reveal">
          <div className="bsn-label">In this series</div>
          <div className="bsn-parts">
            {seriesParts.map(part =>
              part.draft ? (
                <div key={part.slug} className="bsn-part draft">
                  <div className="bsn-dot draft" />
                  <span className="bsn-n">Part {part.part}</span>
                  <span className="bsn-title">{part.title}</span>
                  <span className="bsn-soon">Soon</span>
                </div>
              ) : (
                <Link
                  key={part.slug}
                  to={`/blog/${part.slug}`}
                  className={`bsn-part${part.slug === slug ? ' current' : ' pub'}`}
                >
                  <div className={`bsn-dot${part.slug === slug ? ' current' : ' pub'}`} />
                  <span className="bsn-n">Part {part.part}</span>
                  <span className="bsn-title">{part.title}</span>
                  {part.slug === slug && <span className="bsn-you">Reading</span>}
                </Link>
              )
            )}
          </div>
        </div>
      )}

      <div className="bp-content wrap reveal">
        <div className="prose">
          <PostComponent components={mdxComponents} />
        </div>
      </div>

      <footer className="bp-footer wrap reveal">
        {meta.series && totalParts > 1 && (
          <div className="bp-nav-row">
            {prevPart && !prevPart.draft ? (
              <Link to={`/blog/${prevPart.slug}`} className="bp-nav-btn prev">
                <span className="bp-nav-dir">← Previous</span>
                <span className="bp-nav-title">{prevPart.title}</span>
              </Link>
            ) : <div />}
            {nextPart ? (
              nextPart.draft ? (
                <div className="bp-nav-btn next disabled">
                  <span className="bp-nav-dir">Next →</span>
                  <span className="bp-nav-title">{nextPart.title}</span>
                  <span className="bp-nav-soon">Coming soon</span>
                </div>
              ) : (
                <Link to={`/blog/${nextPart.slug}`} className="bp-nav-btn next">
                  <span className="bp-nav-dir">Next →</span>
                  <span className="bp-nav-title">{nextPart.title}</span>
                </Link>
              )
            ) : <div />}
          </div>
        )}

        <div className="bp-comments">
          <div className="bp-comments-label">Discussion</div>
          <Giscus
            repo="unikdahal/Portfolio"
            repoId="R_kgDOJCt_kQ"
            category="General"
            categoryId="DIC_kwDOJCt_kc4C8PIO"
            mapping="pathname"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={theme === 'dark' ? 'dark' : 'light'}
            lang="en"
            loading="lazy"
          />
        </div>

        <div className="bp-end">
          <Link to="/blog" className="bp-back-link">← Back to Writing</Link>
        </div>
      </footer>
    </article>
  )
}
