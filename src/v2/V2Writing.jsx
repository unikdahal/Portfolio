import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'
import './v2.css'

const postModules = import.meta.glob('../content/blog/*.mdx')
const postModulesEager = import.meta.glob('../content/blog/*.mdx', { eager: true })

const POSTS = Object.entries(postModulesEager)
  .map(([path, mod]) => ({
    slug: path.split('/').pop().replace('.mdx', ''),
    ...(mod.frontmatter || {}),
  }))
  .sort((a, b) => (a.part || 0) - (b.part || 0))

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const saved = window.localStorage.getItem('unik-v2-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function ThemeIcon({ theme }) {
  return theme === 'dark' ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.35" />
      <path d="M10 2.1v2M10 15.9v2M2.1 10h2M15.9 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M15.7 12.7A6.2 6.2 0 0 1 7.3 4.3 6.2 6.2 0 1 0 15.7 12.7Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function V2Header({ theme, setTheme }) {
  return (
    <header className="v2-case-nav">
      <a className="v2-brand" href="/v2/" aria-label="Back to portfolio">
        <span className="v2-brand-mark">u.</span>
        <span>Unik Dahal</span>
      </a>

      <div className="v2-case-nav-right">
        <a href="/v2/#work">Work</a>
        <a href="/v2/#open-source">Open source</a>
        <a href="/v2/writing">Writing</a>
        <button
          className="v2-theme-toggle"
          type="button"
          onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
          aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}
        >
          <ThemeIcon theme={theme} />
        </button>
      </div>
    </header>
  )
}

function WritingIndex({ theme, setTheme }) {
  const series = useMemo(() => {
    const grouped = {}
    POSTS.forEach((post) => {
      const key = post.series || 'Notes'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(post)
    })
    return grouped
  }, [])

  return (
    <main className="v2-shell v2-writing-page" data-v2-theme={theme}>
      <Helmet>
        <title>Writing — Unik Dahal</title>
        <meta
          name="description"
          content="Notes on systems, protocols, query infrastructure, and things understood by building them."
        />
        <meta name="theme-color" content={theme === 'dark' ? '#101521' : '#f4f6fa'} />
      </Helmet>

      <V2Header theme={theme} setTheme={setTheme} />

      <section className="v2-writing-page-hero">
        <div className="v2-container">
          <span className="v2-writing-page-kicker">Writing</span>
          <h1>Notes from <em>underneath</em> the abstraction.</h1>
          <p>
            Systems, protocols, query engines, and the implementation details that become
            interesting once the high-level API stops being enough.
          </p>
        </div>
      </section>

      <section className="v2-writing-page-list">
        <div className="v2-container">
          {Object.entries(series).map(([name, posts], seriesIndex) => (
            <div className="v2-writing-page-series" key={name}>
              <div className="v2-writing-page-series-head">
                <span>{String(seriesIndex + 1).padStart(2, '0')}</span>
                <h2>{name}</h2>
                <p>{posts.length} parts</p>
              </div>

              <div className="v2-writing-page-parts">
                {posts.map((post) =>
                  post.draft ? (
                    <div className="v2-writing-page-row is-draft" key={post.slug}>
                      <span className="v2-writing-page-part">Part {post.part}</span>
                      <div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                      </div>
                      <span className="v2-writing-page-state">Draft</span>
                    </div>
                  ) : (
                    <a className="v2-writing-page-row" href={'/v2/writing/' + post.slug} key={post.slug}>
                      <span className="v2-writing-page-part">Part {post.part}</span>
                      <div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <small>{post.readTime}</small>
                      </div>
                      <ArrowIcon />
                    </a>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function V2Callout({ type = 'note', title, children }) {
  return (
    <aside className={'v2-prose-callout is-' + type}>
      <span className="v2-prose-callout-label">{title || type}</span>
      <div>{children}</div>
    </aside>
  )
}

function V2CodeBlock({ child }) {
  const props = child?.props || {}
  const code = String(props.children || '').replace(/\n$/, '')
  const language = props.className?.replace('language-', '') || 'text'
  const title = props.title

  return (
    <div className="v2-code-block">
      <div className="v2-code-block-head">
        <span>{title || language}</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

const mdxComponents = {
  h2: (props) => <h2 className="v2-prose-h2" {...props} />,
  h3: (props) => <h3 className="v2-prose-h3" {...props} />,
  p: (props) => <p className="v2-prose-p" {...props} />,
  ul: (props) => <ul className="v2-prose-list" {...props} />,
  ol: (props) => <ol className="v2-prose-list" {...props} />,
  li: (props) => <li {...props} />,
  blockquote: (props) => <blockquote className="v2-prose-quote" {...props} />,
  hr: () => <hr className="v2-prose-rule" />,
  table: (props) => <div className="v2-prose-table-wrap"><table className="v2-prose-table" {...props} /></div>,
  th: (props) => <th {...props} />,
  td: (props) => <td {...props} />,
  pre: ({ children }) => <V2CodeBlock child={children} />,
  code: (props) => <code className="v2-prose-code" {...props} />,
  a: (props) => <a className="v2-prose-link" {...props} />,
  Callout: V2Callout,
}

function WritingArticle({ slug, theme, setTheme }) {
  const meta = POSTS.find((post) => post.slug === slug)
  const [Post, setPost] = useState(null)

  useEffect(() => {
    const key = Object.keys(postModules).find((path) => path.endsWith('/' + slug + '.mdx'))
    if (!key) return
    postModules[key]().then((mod) => setPost(() => mod.default))
    window.scrollTo(0, 0)
  }, [slug])

  if (!meta) return <Navigate to="/v2/writing" replace />

  if (meta.draft) {
    return <Navigate to="/v2/writing" replace />
  }

  return (
    <main className="v2-shell v2-article" data-v2-theme={theme}>
      <Helmet>
        <title>{meta.title} — Unik Dahal</title>
        {meta.excerpt && <meta name="description" content={meta.excerpt} />}
        <meta name="theme-color" content={theme === 'dark' ? '#101521' : '#f4f6fa'} />
      </Helmet>

      <V2Header theme={theme} setTheme={setTheme} />

      <article>
        <header className="v2-article-head">
          <div className="v2-container">
            <a className="v2-article-back" href="/v2/writing">← Writing</a>
            <div className="v2-article-meta">
              <span>{meta.category}</span>
              <i />
              <span>{meta.series} · Part {meta.part}</span>
              <i />
              <span>{meta.readTime}</span>
            </div>
            <h1>{meta.title}</h1>
            {meta.excerpt && <p>{meta.excerpt}</p>}
          </div>
        </header>

        <div className="v2-article-body">
          <div className="v2-container">
            <div className="v2-prose">
              {Post ? <Post components={mdxComponents} /> : <div className="v2-article-loading">Loading…</div>}
            </div>
          </div>
        </div>

        <footer className="v2-article-footer">
          <div className="v2-container">
            <a href="/v2/writing">
              <span>Back to</span>
              <strong>Writing</strong>
            </a>
            <a href="/v2/">
              <span>Back to</span>
              <strong>Portfolio</strong>
            </a>
          </div>
        </footer>
      </article>
    </main>
  )
}

export default function V2Writing() {
  const { slug } = useParams()
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    try { window.localStorage.setItem('unik-v2-theme', theme) } catch {}
  }, [theme])

  if (slug) return <WritingArticle slug={slug} theme={theme} setTheme={setTheme} />
  return <WritingIndex theme={theme} setTheme={setTheme} />
}
