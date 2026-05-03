import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useReveal } from '../../hooks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

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

function extractText(node) {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node?.props?.children) return extractText(node.props.children)
  return ''
}

function toSlug(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
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

function CodeBlock({ children, className, title }) {
  const [copied, setCopied] = useState(false)
  const theme = useDocTheme()
  const language = className?.replace('language-', '') || 'text'
  const code = String(children).replace(/\n$/, '')

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
  useReveal([PostComponent])

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

  return (
    <article className="bp-page">
      <div
        className="bp-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

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
        </div>

        <h1 className="bp-title">{meta.title}</h1>
        {meta.excerpt && <p className="bp-excerpt">{meta.excerpt}</p>}
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
        <div className="bp-end">
          <Link to="/blog" className="bp-back-link">← Back to Writing</Link>
        </div>
      </footer>
    </article>
  )
}
