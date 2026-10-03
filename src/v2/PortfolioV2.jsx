import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './v2.css'

const GITHUB = 'https://github.com/unikdahal'
const LINKEDIN = 'https://www.linkedin.com/in/unikdahal'

const OSS_GROUPS = [
  {
    repo: 'Apache DataFusion Comet',
    eyebrow: 'Query execution',
    items: [
      {
        pr: '#5318',
        title: 'Native MergeRowsExec for row-level MERGE',
        status: 'In review',
        href: 'https://github.com/apache/datafusion-comet/pull/5318',
      },
      {
        pr: '#5412',
        title: 'Distinguish Iceberg reflection failures from absent accessors',
        status: 'Merged',
        href: 'https://github.com/apache/datafusion-comet/pull/5412',
      },
    ],
  },
  {
    repo: 'Apache Arrow ADBC',
    eyebrow: 'Flight SQL',
    items: [
      {
        pr: '#4747',
        title: 'Flight SQL session management for the Java driver',
        status: 'In review',
        href: 'https://github.com/apache/arrow-adbc/pull/4747',
      },
      {
        pr: '#4539',
        title: 'flightsql:// URI support for the Java driver',
        status: 'Merged',
        href: 'https://github.com/apache/arrow-adbc/pull/4539',
      },
    ],
  },
  {
    repo: 'iceberg-rust',
    eyebrow: 'Row-level writes',
    items: [
      {
        pr: '#3291',
        title: 'File-scoped position delete index loader',
        status: 'In review',
        href: 'https://github.com/apache/iceberg-rust/pull/3291',
      },
      {
        pr: '#3329',
        title: 'Sorting position-only delete writer',
        status: 'In review',
        href: 'https://github.com/apache/iceberg-rust/pull/3329',
      },
    ],
  },
]

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  try {
    const saved = window.localStorage.getItem('unik-v2-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}

  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function DataPathVisual() {
  return (
    <div className="v2-data-visual" aria-hidden="true">
      <svg viewBox="0 0 720 580" role="presentation">
        <defs>
          <linearGradient id="v2-path-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" className="v2-gradient-start" />
            <stop offset="56%" className="v2-gradient-mid" />
            <stop offset="100%" className="v2-gradient-end" />
          </linearGradient>
          <radialGradient id="v2-node-glow">
            <stop offset="0%" className="v2-glow-start" />
            <stop offset="100%" className="v2-glow-end" />
          </radialGradient>
          <filter id="v2-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <path className="v2-path v2-path-main" d="M74 386 C152 386 157 284 246 284 S347 362 429 294 S536 173 650 209" />
        <path className="v2-path" d="M246 284 C281 216 326 173 386 163" />
        <path className="v2-path" d="M429 294 C476 362 525 392 603 376" />
        <path className="v2-path v2-path-faint" d="M143 451 C213 451 224 410 278 410 S364 465 444 448" />

        {[
          [74, 386, 'a'],
          [246, 284, 'b'],
          [429, 294, 'c'],
          [650, 209, 'd'],
        ].map(([x, y, id]) => (
          <g className={'v2-node v2-node-' + id} transform={'translate(' + x + ' ' + y + ')'} key={id}>
            <circle className="v2-node-halo" r="28" />
            <circle className="v2-node-ring" r="9" />
            <circle className="v2-node-core" r="3" />
          </g>
        ))}

        {[
          [386, 163, 'e'],
          [603, 376, 'f'],
        ].map(([x, y, id]) => (
          <g className={'v2-node v2-node-' + id} transform={'translate(' + x + ' ' + y + ')'} key={id}>
            <circle className="v2-node-ring" r="7" />
            <circle className="v2-node-core" r="2.5" />
          </g>
        ))}

        <circle className="v2-traveller v2-traveller-one" r="4">
          <animateMotion
            dur="6.2s"
            repeatCount="indefinite"
            path="M74 386 C152 386 157 284 246 284 S347 362 429 294 S536 173 650 209"
          />
        </circle>
        <circle className="v2-traveller v2-traveller-two" r="3">
          <animateMotion
            begin="-2.4s"
            dur="6.2s"
            repeatCount="indefinite"
            path="M74 386 C152 386 157 284 246 284 S347 362 429 294 S536 173 650 209"
          />
        </circle>
      </svg>

      <span className="v2-data-label v2-data-label-scan">scan</span>
      <span className="v2-data-label v2-data-label-shuffle">shuffle</span>
      <span className="v2-data-label v2-data-label-flight">flight</span>
      <span className="v2-data-label v2-data-label-write">write</span>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ThemeIcon({ theme }) {
  if (theme === 'dark') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.35" />
        <path d="M10 2.1v2M10 15.9v2M2.1 10h2M15.9 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M15.7 12.7A6.2 6.2 0 0 1 7.3 4.3 6.2 6.2 0 1 0 15.7 12.7Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function QueryPathDiagram() {
  return (
    <div className="v2-query-visual v2-reveal">
      <div className="v2-query-visual-head">
        <span>Transport profile</span>
        <span>Fixed overhead · representative path</span>
      </div>

      <div className="v2-latency-comparison" aria-label="Query transport overhead reduced from approximately 1.5 seconds to approximately 90 milliseconds">
        <div className="v2-latency-row v2-latency-before">
          <div className="v2-latency-copy">
            <span className="v2-latency-state">Before</span>
            <strong>JDBC / Thrift</strong>
          </div>
          <div className="v2-latency-track">
            <div className="v2-latency-fill" />
            <span className="v2-latency-value">~1.5s</span>
          </div>
        </div>

        <div className="v2-latency-row v2-latency-after">
          <div className="v2-latency-copy">
            <span className="v2-latency-state">After</span>
            <strong>ADBC / Flight SQL</strong>
          </div>
          <div className="v2-latency-track">
            <div className="v2-latency-fill" />
            <span className="v2-latency-value">~90ms</span>
          </div>
        </div>
      </div>

      <div className="v2-route-pair">
        <div className="v2-route">
          <span className="v2-route-index">01</span>
          <div className="v2-route-flow">
            <span>Data service</span>
            <i />
            <span>JDBC</span>
            <i />
            <span>Kyuubi / Thrift</span>
            <i />
            <span>Spark</span>
          </div>
        </div>

        <div className="v2-route v2-route-new">
          <span className="v2-route-index">02</span>
          <div className="v2-route-flow">
            <span>Data service</span>
            <i />
            <span>ADBC client</span>
            <i />
            <span>Flight SQL</span>
            <i />
            <span>Spark</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MigrationVisual() {
  return (
    <div className="v2-migration-visual v2-reveal" aria-label="Phased migration from Snowflake to Spark and Iceberg">
      <div className="v2-migration-axis" aria-hidden="true">
        <span>Existing path</span>
        <i />
        <span>Phased transition</span>
        <i />
        <span>Lakehouse path</span>
      </div>

      <div className="v2-migration-map">
        <div className="v2-system-node v2-system-node-old">
          <span className="v2-system-label">Warehouse</span>
          <strong>Snowflake</strong>
          <small>existing analytical path</small>
        </div>

        <div className="v2-migration-bridge" aria-hidden="true">
          <div className="v2-bridge-line">
            <span className="v2-bridge-pulse" />
          </div>
          <div className="v2-bridge-note">
            <span>01</span>
            <p>Move ingestion first</p>
          </div>
          <div className="v2-bridge-note">
            <span>02</span>
            <p>Preserve compatibility</p>
          </div>
          <div className="v2-bridge-note">
            <span>03</span>
            <p>Shift reads progressively</p>
          </div>
        </div>

        <div className="v2-system-stack">
          <div className="v2-system-node v2-system-node-new">
            <span className="v2-system-label">Execution</span>
            <strong>Apache Spark</strong>
          </div>
          <div className="v2-stack-connector" />
          <div className="v2-system-node v2-system-node-new">
            <span className="v2-system-label">Table format</span>
            <strong>Apache Iceberg</strong>
          </div>
          <div className="v2-stack-connector" />
          <div className="v2-system-node v2-system-node-new">
            <span className="v2-system-label">Catalog</span>
            <strong>Polaris</strong>
          </div>
        </div>
      </div>

      <div className="v2-migration-foot">
        <span>Phased migration, not a flag day</span>
        <strong>~90% <small>compute reduction</small></strong>
      </div>
    </div>
  )
}

function OpenSourceLedger() {
  return (
    <section className="v2-oss" id="open-source">
      <div className="v2-oss-inner">
        <div className="v2-section-top v2-reveal">
          <span className="v2-section-index">03</span>
          <span className="v2-section-label">Working in public · Apache ecosystem</span>
          <span className="v2-section-year">2026</span>
        </div>

        <div className="v2-oss-layout">
          <div className="v2-oss-intro v2-reveal">
            <p className="v2-oss-overline">Open source</p>
            <h2>
              The stack doesn’t end
              <span>at the API.</span>
            </h2>
            <p className="v2-oss-copy">
              I contribute where the abstraction gets interesting: Spark-native execution,
              Flight SQL clients, and Iceberg row-level write infrastructure.
            </p>
            <a className="v2-inline-link" href={GITHUB} target="_blank" rel="noreferrer">
              github.com/unikdahal
              <ArrowIcon />
            </a>
          </div>

          <div className="v2-oss-ledger">
            {OSS_GROUPS.map((group) => (
              <div className="v2-oss-group v2-reveal" key={group.repo}>
                <div className="v2-oss-group-head">
                  <div>
                    <span>{group.eyebrow}</span>
                    <h3>{group.repo}</h3>
                  </div>
                  <span className="v2-oss-count">{String(group.items.length).padStart(2, '0')}</span>
                </div>

                <div className="v2-oss-items">
                  {group.items.map((item) => {
                    const merged = item.status === 'Merged'
                    return (
                      <a className="v2-oss-item" href={item.href} target="_blank" rel="noreferrer" key={item.pr}>
                        <span className="v2-oss-pr">{item.pr}</span>
                        <span className="v2-oss-title">{item.title}</span>
                        <span className={'v2-oss-status ' + (merged ? 'is-merged' : 'is-review')}>
                          <i />
                          {item.status}
                        </span>
                        <ArrowIcon />
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PortfolioV2() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    try {
      window.localStorage.setItem('unik-v2-theme', theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    const nodes = document.querySelectorAll('.v2-shell .v2-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <main className="v2-shell" data-v2-theme={theme}>
      <Helmet>
        <title>Unik Dahal — Data Infrastructure & Distributed Systems</title>
        <meta
          name="description"
          content="Unik Dahal builds data infrastructure, query execution systems, and distributed backends across Spark, Iceberg, Arrow, and Apache open source."
        />
        <meta name="theme-color" content={theme === 'dark' ? '#0d121a' : '#f3f5f8'} />
      </Helmet>

      <section className="v2-hero">
        <header className="v2-nav">
          <a className="v2-brand" href="/v2/" aria-label="Unik Dahal, V2 home">
            <span className="v2-brand-mark">u.</span>
            <span className="v2-brand-name">Unik Dahal</span>
          </a>

          <div className="v2-nav-right">
            <nav className="v2-nav-links" aria-label="Portfolio navigation">
              <a href="#selected-work">Work</a>
              <a href="#open-source">Open source</a>
              <a href="/blog">Writing</a>
              <a className="v2-nav-v1" href="/">V1</a>
            </nav>

            <button
              className="v2-theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}
              title={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}
            >
              <ThemeIcon theme={theme} />
            </button>
          </div>
        </header>

        <div className="v2-hero-ambient" aria-hidden="true" />
        <DataPathVisual />

        <div className="v2-hero-inner">
          <div className="v2-hero-kicker">
            <span className="v2-status-dot" />
            <span>Data infrastructure · distributed systems</span>
          </div>

          <h1 className="v2-hero-title">
            I build systems
            <span>that <em>move</em> data.</span>
          </h1>

          <div className="v2-hero-bottom">
            <p className="v2-hero-intro">
              I’m Unik, a software engineer working across query execution,
              lakehouse infrastructure, and distributed backends at production scale.
            </p>

            <div className="v2-hero-actions">
              <a className="v2-primary-link" href="#selected-work">
                Selected work
                <ArrowIcon />
              </a>
              <a className="v2-text-link" href="mailto:unikdahal03@gmail.com">Email me</a>
            </div>
          </div>
        </div>

        <div className="v2-hero-rail">
          <div>
            <span className="v2-rail-label">Working at</span>
            <strong>HighRadius · Data Platform</strong>
          </div>
          <div>
            <span className="v2-rail-label">Working with</span>
            <strong>Spark · Iceberg · Arrow · DataFusion</strong>
          </div>
          <div>
            <span className="v2-rail-label">Based in</span>
            <strong>Hyderabad · from Nepal</strong>
          </div>
        </div>
      </section>

      <section className="v2-proof-strip" aria-label="Selected impact">
        <div className="v2-proof-inner">
          <div className="v2-proof-item">
            <strong>~1.5s → ~90ms</strong>
            <span>fixed query overhead</span>
          </div>
          <div className="v2-proof-item">
            <strong>20M+</strong>
            <span>tables in migration scope</span>
          </div>
          <div className="v2-proof-item">
            <strong>~90%</strong>
            <span>compute reduction</span>
          </div>
        </div>
      </section>

      <section className="v2-work" id="selected-work">
        <div className="v2-work-inner">
          <div className="v2-section-top v2-reveal">
            <span className="v2-section-index">01</span>
            <span className="v2-section-label">Selected work · query infrastructure</span>
            <span className="v2-section-year">2025—26</span>
          </div>

          <div className="v2-work-title-grid">
            <div className="v2-work-heading v2-reveal">
              <p className="v2-work-overline">The query was fast.</p>
              <h2>
                <span>1.5 seconds</span>
                wasn’t the query.
              </h2>
            </div>

            <div className="v2-work-metric v2-reveal">
              <span>Fixed overhead</span>
              <strong>~90<small>ms</small></strong>
              <p>after moving the client path to ADBC Flight SQL with connection pooling.</p>
            </div>
          </div>

          <QueryPathDiagram />

          <div className="v2-work-story">
            <div className="v2-work-story-lead v2-reveal">
              <span className="v2-story-label">The constraint</span>
              <p>
                Analytical queries were paying roughly 1.5 seconds before useful execution work
                even began. The bottleneck lived in the transport path, not in the query itself.
              </p>
            </div>

            <div className="v2-work-story-body v2-reveal">
              <p>
                I owned the move from the JDBC/Thrift path to an ADBC Flight SQL client,
                including connection pooling and the surrounding query-path changes.
                The result was a much thinner handoff into Spark: roughly 90 ms of fixed
                overhead instead of ~1.5 seconds.
              </p>

              <div className="v2-work-tags" aria-label="Technologies used">
                <span>Arrow Flight SQL</span>
                <span>ADBC</span>
                <span>Apache Spark</span>
                <span>Kyuubi</span>
              </div>
            </div>
          </div>

          <a className="v2-next-chapter v2-reveal" href="#lakehouse">
            <span>02</span>
            <p>Changing the analytical engine</p>
            <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="v2-migration" id="lakehouse">
        <div className="v2-migration-inner">
          <div className="v2-section-top v2-reveal">
            <span className="v2-section-index">02</span>
            <span className="v2-section-label">Selected work · lakehouse migration</span>
            <span className="v2-section-year">2025—26</span>
          </div>

          <div className="v2-migration-heading">
            <div className="v2-migration-number v2-reveal">
              <strong>20M+</strong>
              <span>tables in scope</span>
            </div>

            <div className="v2-migration-title v2-reveal">
              <p>Phased, compatibility-first migration</p>
              <h2>
                Changing the engine
                <span>without changing the product.</span>
              </h2>
            </div>
          </div>

          <MigrationVisual />

          <div className="v2-migration-story">
            <p className="v2-migration-lead v2-reveal">
              The hard part wasn’t standing up Spark. It was moving a live analytical product
              while keeping existing workflows behaving as if nothing underneath had changed.
            </p>

            <div className="v2-migration-details v2-reveal">
              <p>
                The migration moved ingestion toward Spark and Iceberg first, retained compatibility
                while reads and user actions still crossed the old path, and progressively shifted
                analytical execution onto the lakehouse stack. The resulting architecture cut
                compute materially while preserving the product contract during the transition.
              </p>
              <div className="v2-work-tags">
                <span>Apache Spark</span>
                <span>Apache Iceberg</span>
                <span>Polaris</span>
                <span>Snowflake</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OpenSourceLedger />

      <div className="v2-preview-footer">
        <span>Unik Dahal · Portfolio V2</span>
        <div>
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="/blog">Writing</a>
        </div>
      </div>
    </main>
  )
}
