import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './v2.css'

const GITHUB = 'https://github.com/unikdahal'
const LINKEDIN = 'https://www.linkedin.com/in/unikdahal'

const OSS_GROUPS = [
  {
    name: 'Apache DataFusion Comet',
    focus: 'Native Spark & Iceberg execution',
    items: [
      {
        pr: '#6587',
        title: 'Preserve Spark 4.2 write transactions',
        status: 'In review',
        href: 'https://github.com/apache/datafusion-comet/pull/6587',
      },
      {
        pr: '#6582',
        title: 'Close Iceberg cleanup ownership gap',
        status: 'In review',
        href: 'https://github.com/apache/datafusion-comet/pull/6582',
      },
      {
        pr: '#5318',
        title: 'Native MergeRowsExec for row-level MERGE',
        status: 'In review',
        href: 'https://github.com/apache/datafusion-comet/pull/5318',
      },
      {
        pr: '#5412',
        title: 'Iceberg reflection failure handling',
        status: 'Merged',
        href: 'https://github.com/apache/datafusion-comet/pull/5412',
      },
    ],
  },
  {
    name: 'Apache Arrow ADBC',
    focus: 'Flight SQL clients',
    items: [
      {
        pr: '#4747',
        title: 'Flight SQL session management',
        status: 'In review',
        href: 'https://github.com/apache/arrow-adbc/pull/4747',
      },
      {
        pr: '#4539',
        title: 'flightsql:// URI support',
        status: 'Merged',
        href: 'https://github.com/apache/arrow-adbc/pull/4539',
      },
    ],
  },
  {
    name: 'iceberg-rust',
    focus: 'Row-level write infrastructure',
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

const WRITING_SERIES = {
  name: 'Building Redis in Java',
  published: {
    part: '01',
    title: 'How Redis Talks: The RESP Protocol',
    excerpt: 'A byte-level look at the wire format behind Redis clients, pipelining, and streaming-safe parsing.',
    meta: '13 min read · Systems',
    href: '/blog/001-resp-protocol',
  },
  upcoming: [
    ['02', 'The Single-Threaded Myth: Redis Event Loop & Netty'],
    ['03', 'Transactions without ACID: MULTI/EXEC in Depth'],
    ['04', 'Replication & PSYNC2: How Replicas Catch Up'],
  ],
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  try {
    const saved = window.localStorage.getItem('unik-v2-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}

  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M4 10h11M11 6l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ThemeIcon({ theme }) {
  if (theme === 'dark') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.35" />
        <path
          d="M10 2.1v2M10 15.9v2M2.1 10h2M15.9 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M15.7 12.7A6.2 6.2 0 0 1 7.3 4.3 6.2 6.2 0 1 0 15.7 12.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SystemField() {
  return (
    <div className="v2-system-field" aria-hidden="true">
      <svg viewBox="0 0 1500 820" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <linearGradient id="v2-field-main" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" className="v2-field-gradient-start" />
            <stop offset="54%" className="v2-field-gradient-mid" />
            <stop offset="100%" className="v2-field-gradient-end" />
          </linearGradient>
          <filter id="v2-field-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <path className="v2-field-line v2-field-line-main" d="M690 706 C760 640 742 553 828 512 C915 471 934 398 1014 361 C1107 318 1120 224 1248 201 C1335 186 1407 134 1472 82" />
        <path className="v2-field-line" d="M828 512 C789 445 804 381 865 334 C916 294 929 234 910 164" />
        <path className="v2-field-line" d="M1014 361 C1075 422 1145 444 1235 425 C1336 404 1401 438 1477 500" />
        <path className="v2-field-line v2-field-line-dashed" d="M590 642 C683 595 707 521 691 448 C677 384 708 324 774 289" />
        <path className="v2-field-line v2-field-line-dashed" d="M1198 202 C1194 277 1241 315 1311 322 C1380 329 1434 366 1484 420" />
        <path className="v2-field-line v2-field-line-faint" d="M916 294 C1031 268 1088 199 1125 114" />

        {[
          [690, 706, 12],
          [828, 512, 13],
          [1014, 361, 14],
          [1248, 201, 12],
          [865, 334, 9],
          [1235, 425, 9],
          [774, 289, 8],
          [1311, 322, 8],
        ].map(([x, y, r], index) => (
          <g className="v2-field-node" transform={`translate(${x} ${y})`} key={index}>
            <circle className="v2-field-node-glow" r={r * 2.5} />
            <circle className="v2-field-node-ring" r={r} />
            <circle className="v2-field-node-core" r={Math.max(2.5, r * 0.28)} />
          </g>
        ))}

        <circle className="v2-field-packet v2-field-packet-one" r="4">
          <animateMotion
            dur="7.4s"
            repeatCount="indefinite"
            path="M690 706 C760 640 742 553 828 512 C915 471 934 398 1014 361 C1107 318 1120 224 1248 201 C1335 186 1407 134 1472 82"
          />
        </circle>
        <circle className="v2-field-packet v2-field-packet-two" r="3">
          <animateMotion
            begin="-3.2s"
            dur="7.4s"
            repeatCount="indefinite"
            path="M690 706 C760 640 742 553 828 512 C915 471 934 398 1014 361 C1107 318 1120 224 1248 201 C1335 186 1407 134 1472 82"
          />
        </circle>
      </svg>

      <span className="v2-field-label v2-field-label-scan">scan</span>
      <span className="v2-field-label v2-field-label-shuffle">shuffle</span>
      <span className="v2-field-label v2-field-label-merge">merge</span>
      <span className="v2-field-label v2-field-label-flight">flight</span>
      <span className="v2-field-label v2-field-label-write">write</span>
    </div>
  )
}

function QueryVisual() {
  return (
    <div className="v2-query-visual" aria-label="Fixed query overhead reduced from approximately 1.5 seconds to approximately 90 milliseconds">
      <div className="v2-query-caption">
        <span>Fixed transport overhead</span>
        <span>before / after</span>
      </div>

      <div className="v2-query-bars">
        <div className="v2-query-row">
          <div className="v2-query-row-label">
            <span>Before</span>
            <strong>JDBC / Thrift</strong>
          </div>
          <div className="v2-query-track">
            <i className="v2-query-bar v2-query-bar-before" />
            <b>~1.5s</b>
          </div>
        </div>

        <div className="v2-query-row">
          <div className="v2-query-row-label">
            <span>After</span>
            <strong>ADBC / Flight SQL</strong>
          </div>
          <div className="v2-query-track">
            <i className="v2-query-bar v2-query-bar-after" />
            <b>~90ms</b>
          </div>
        </div>
      </div>

      <div className="v2-query-route">
        <span>Data service</span>
        <i />
        <span>ADBC client</span>
        <i />
        <span>Flight SQL</span>
        <i />
        <span>Spark</span>
      </div>
    </div>
  )
}

function MigrationVisual() {
  return (
    <div className="v2-migration-visual" aria-label="Phased migration from Snowflake to Spark, Iceberg, and Polaris">
      <div className="v2-migration-visual-head">
        <span>Migration path</span>
        <span>compatibility-first · phased cutover</span>
      </div>

      <div className="v2-migration-lanes">
        <div className="v2-migration-lane v2-migration-lane-old">
          <span className="v2-migration-lane-label">Before</span>
          <div className="v2-migration-lane-content">
            <strong>Snowflake</strong>
            <span>warehouse path</span>
          </div>
        </div>

        <div className="v2-migration-transition" aria-hidden="true">
          <div className="v2-migration-transition-line">
            <i className="v2-migration-packet" />
          </div>
          <div className="v2-migration-transition-steps">
            <div>
              <b>01</b>
              <span>move ingestion</span>
            </div>
            <div>
              <b>02</b>
              <span>preserve compatibility</span>
            </div>
            <div>
              <b>03</b>
              <span>shift reads</span>
            </div>
          </div>
        </div>

        <div className="v2-migration-lane v2-migration-lane-new">
          <span className="v2-migration-lane-label">After</span>
          <div className="v2-migration-stack-row">
            <div>
              <span>Execution</span>
              <strong>Spark</strong>
            </div>
            <i />
            <div>
              <span>Table format</span>
              <strong>Iceberg</strong>
            </div>
            <i />
            <div>
              <span>Catalog</span>
              <strong>Polaris</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SagaVisual() {
  const services = ['prepare', 'metadata', 'content', 'workbook', 'publish', 'audit', 'finalize']

  return (
    <div className="v2-saga-visual" aria-label="Seven-service distributed Saga with compensation">
      <div className="v2-saga-path">
        {services.map((service, index) => (
          <div className="v2-saga-service" key={service}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{service}</strong>
            <i className={index < 4 ? 'is-complete' : index === 4 ? 'is-failure' : ''} />
          </div>
        ))}
      </div>

      <div className="v2-saga-compensation">
        <span>failure at service 05</span>
        <div>
          <i />
          <strong>compensate</strong>
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  )
}

function WorkCard({ index, eyebrow, title, accent, description, metrics, tags, children, className = '' }) {
  return (
    <article className={'v2-work-card v2-reveal ' + className}>
      <div className="v2-work-card-head">
        <div>
          <span className="v2-work-index">{index}</span>
          <span className="v2-work-eyebrow">{eyebrow}</span>
        </div>
        <span className="v2-work-year">HighRadius · Data Platform</span>
      </div>

      <div className="v2-work-card-grid">
        <div className="v2-work-copy">
          <h3>
            {title}
            {accent && <span>{accent}</span>}
          </h3>
          <p>{description}</p>

          <div className="v2-work-tags">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>

        <div className="v2-work-side">
          <div className="v2-work-metrics">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </article>
  )
}

function OpenSourceSection() {
  return (
    <section className="v2-section v2-oss" id="open-source">
      <div className="v2-container">
        <div className="v2-section-heading v2-reveal">
          <span>04 · Open source</span>
          <h2>Working closer to the engine.</h2>
          <p>
            Recent work across native Spark execution, Arrow Flight SQL clients,
            and Iceberg row-level write infrastructure.
          </p>
        </div>

        <div className="v2-oss-grid">
          {OSS_GROUPS.map((group) => (
            <article className="v2-oss-group v2-reveal" key={group.name}>
              <div className="v2-oss-head">
                <span>{group.focus}</span>
                <h3>{group.name}</h3>
              </div>

              <div className="v2-oss-items">
                {group.items.map((item) => (
                  <a href={item.href} target="_blank" rel="noreferrer" className="v2-oss-item" key={item.pr}>
                    <span className="v2-oss-pr">{item.pr}</span>
                    <span className="v2-oss-title">{item.title}</span>
                    <span className={'v2-oss-status ' + (item.status === 'Merged' ? 'is-merged' : 'is-review')}>
                      <i />
                      {item.status}
                    </span>
                    <ArrowIcon />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <a className="v2-inline-link v2-reveal" href={GITHUB} target="_blank" rel="noreferrer">
          See everything on GitHub
          <ArrowIcon />
        </a>
      </div>
    </section>
  )
}

function RedisSection() {
  return (
    <section className="v2-section v2-built">
      <div className="v2-container">
        <div className="v2-built-grid">
          <div className="v2-built-copy v2-reveal">
            <span>05 · From first principles</span>
            <h2>Sometimes I rebuild the system to understand it.</h2>
            <p>
              redis-java is a Redis-compatible server built around Netty and RESP,
              including replication, transactions, streams, persistence, and hundreds of tests.
            </p>
            <a className="v2-inline-link" href="https://github.com/unikdahal/redis-java" target="_blank" rel="noreferrer">
              Explore redis-java
              <ArrowIcon />
            </a>
          </div>

          <div className="v2-terminal v2-reveal" aria-label="Redis protocol example">
            <div className="v2-terminal-top">
              <span>RESP / session</span>
              <i />
            </div>
            <pre>
              <code>{`> SET engineer unik
+OK

> GET engineer
$4
unik

> INFO replication
role:master
connected_slaves:1`}</code>
            </pre>
            <div className="v2-terminal-foot">
              <span>Netty</span>
              <span>PSYNC2</span>
              <span>RDB</span>
              <span>Streams</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WritingSection() {
  return (
    <section className="v2-section v2-writing" id="writing">
      <div className="v2-container">
        <div className="v2-writing-grid">
          <div className="v2-section-heading v2-writing-heading v2-reveal">
            <span>06 · Writing</span>
            <h2>Notes from the engine room.</h2>
            <p>
              I write when implementing something forces me to understand the layer underneath it.
            </p>
            <a className="v2-inline-link" href="/blog">
              All writing
              <ArrowIcon />
            </a>
          </div>

          <div className="v2-writing-series v2-reveal">
            <div className="v2-writing-series-head">
              <span>Series</span>
              <strong>{WRITING_SERIES.name}</strong>
            </div>

            <a className="v2-writing-feature" href={WRITING_SERIES.published.href}>
              <span className="v2-writing-part">Part {WRITING_SERIES.published.part}</span>
              <div>
                <h3>{WRITING_SERIES.published.title}</h3>
                <p>{WRITING_SERIES.published.excerpt}</p>
                <span className="v2-writing-meta">{WRITING_SERIES.published.meta}</span>
              </div>
              <ArrowIcon />
            </a>

            <div className="v2-writing-upcoming">
              <span className="v2-writing-upcoming-label">Next in the series</span>
              {WRITING_SERIES.upcoming.map(([part, title]) => (
                <div className="v2-writing-upcoming-row" key={part}>
                  <span>{part}</span>
                  <p>{title}</p>
                  <small>Draft</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ElsewhereSection() {
  return (
    <section className="v2-section v2-elsewhere">
      <div className="v2-container">
        <div className="v2-elsewhere-grid">
          <div className="v2-elsewhere-heading v2-reveal">
            <span>07 · Elsewhere</span>
            <h2>I also like shipping the whole product.</h2>
          </div>

          <a className="v2-sutine v2-reveal" href="https://sutine.com" target="_blank" rel="noreferrer">
            <div className="v2-sutine-top">
              <span>Live product · 2025—present</span>
              <ArrowIcon />
            </div>

            <div className="v2-sutine-main">
              <h3>Sutine<em>.</em></h3>
              <p>
                A clothing label I co-own and the commerce platform behind it — storefront,
                inventory, checkout, payments, admin workflows, and production operations.
              </p>
            </div>

            <div className="v2-sutine-stack">
              <span>Spring Boot</span>
              <span>React / TypeScript</span>
              <span>MySQL</span>
              <span>Cloudflare R2</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section className="v2-section v2-experience">
      <div className="v2-container">
        <div className="v2-section-heading v2-section-heading-compact v2-reveal">
          <span>08 · Experience</span>
          <h2>Where the work happened.</h2>
          <p>
            From Nepal, now based in Hyderabad. I’m most interested in the boundaries
            between execution engines, storage formats, protocols, and distributed state.
          </p>
        </div>

        <div className="v2-experience-list">
          <div className="v2-experience-row v2-reveal">
            <span>2024 — now</span>
            <strong>HighRadius</strong>
            <p>Software Development Engineer · Data Platform</p>
          </div>
          <div className="v2-experience-row v2-reveal">
            <span>2024</span>
            <strong>ImmiHealth</strong>
            <p>Backend Engineer · telemedicine systems</p>
          </div>
          <div className="v2-experience-row v2-reveal">
            <span>2021 — 2025</span>
            <strong>KIIT</strong>
            <p>B.Tech Computer Science · Financial Economics minor</p>
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
      { threshold: 0.08, rootMargin: '0px 0px -7% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="v2-shell" data-v2-theme={theme} id="v2-top">
      <Helmet>
        <title>Unik Dahal — Data Infrastructure & Distributed Systems</title>
        <meta
          name="description"
          content="Unik Dahal builds data infrastructure, query execution systems, and distributed backends across Spark, Iceberg, Arrow, and Apache open source."
        />
        <meta name="theme-color" content={theme === 'dark' ? '#101521' : '#f4f6fa'} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Unik Dahal — Data Infrastructure & Distributed Systems" />
        <meta
          property="og:description"
          content="Production data infrastructure, native query execution, Apache open source, and systems built from first principles."
        />
        <meta property="og:url" content="https://www.unikdahal.com.np/v2/" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href="https://www.unikdahal.com.np/v2/" />
      </Helmet>

      <section className="v2-hero">
        <SystemField />

        <header className="v2-nav">
          <a className="v2-brand" href="/v2/" aria-label="Unik Dahal home">
            <span className="v2-brand-mark">u.</span>
            <span>Unik Dahal</span>
          </a>

          <div className="v2-nav-right">
            <div className="v2-nav-links" role="navigation" aria-label="Portfolio navigation">
              <a href="#work">Work</a>
              <a href="#open-source">Open source</a>
              <a href="#writing">Writing</a>
            </div>
            <button
              className="v2-theme-toggle"
              type="button"
              onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
              aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}
              title={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}
            >
              <ThemeIcon theme={theme} />
            </button>
          </div>
        </header>

        <div className="v2-hero-content">
          <div className="v2-hero-eyebrow">
            <span />
            Data infrastructure · distributed systems
          </div>

          <h1>
            I build systems
            <span>that <em>move</em> data.</span>
          </h1>

          <div className="v2-hero-support">
            <p>
              I’m Unik, a software engineer working on query execution,
              lakehouse infrastructure, and distributed backends.
            </p>
          </div>

          <div className="v2-hero-meta">
            <span>HighRadius · Data Platform</span>
            <i />
            <span>Hyderabad, India · from Nepal</span>
          </div>

          <a className="v2-hero-work-link" href="#work">
            <span>Selected work</span>
            <i aria-hidden="true" />
          </a>
        </div>

      </section>

      <section className="v2-section v2-work-section" id="work">
        <div className="v2-container">
          <div className="v2-section-heading v2-reveal">
            <span>01–03 · Selected work</span>
            <h2>Production systems, not portfolio demos.</h2>
            <p>
              A few pieces of infrastructure where the interesting work lived
              below the feature surface.
            </p>
          </div>

          <div className="v2-work-stack">
            <WorkCard
              index="01"
              eyebrow="Query infrastructure"
              title="1.5 seconds"
              accent="wasn’t the query."
              description="The fixed cost lived in the transport path. I owned the move from JDBC/Thrift to an ADBC Flight SQL client with connection pooling, taking fixed per-query overhead to roughly 90 ms."
              metrics={[
                { value: '~90ms', label: 'fixed overhead after migration' },
                { value: '~15×', label: 'less transport overhead' },
              ]}
              tags={['Arrow Flight SQL', 'ADBC', 'Apache Spark', 'Kyuubi']}
            >
              <QueryVisual />
            </WorkCard>

            <WorkCard
              index="02"
              eyebrow="Lakehouse migration"
              title="Changing the engine"
              accent="without changing the product."
              description="A phased move from Snowflake toward Spark + Iceberg: ingestion moved first, compatibility had to hold across both worlds, and analytical execution shifted progressively rather than through a flag-day cutover."
              metrics={[
                { value: '20M+', label: 'tables in migration scope' },
                { value: '~90%', label: 'compute reduction' },
              ]}
              tags={['Apache Spark', 'Apache Iceberg', 'Polaris', 'Snowflake']}
              className="v2-work-card-migration"
            >
              <MigrationVisual />
            </WorkCard>

            <WorkCard
              index="03"
              eyebrow="Distributed reliability"
              title="Failure should"
              accent="be reversible."
              description="A seven-service import/export flow needed to survive partial failure. I designed the orchestration around a distributed Saga with compensating actions and explicit ownership of rollback."
              metrics={[
                { value: '7', label: 'services in the workflow' },
                { value: '~70%', label: 'fewer related incidents' },
              ]}
              tags={['Saga', 'Kafka', 'Spring', 'Object storage']}
              className="v2-work-card-saga"
            >
              <SagaVisual />
            </WorkCard>
          </div>
        </div>
      </section>

      <OpenSourceSection />
      <RedisSection />
      <WritingSection />
      <ElsewhereSection />
      <ExperienceSection />

      <footer className="v2-footer">
        <div className="v2-container">
          <div className="v2-footer-top">
            <p>Still curious?</p>
            <h2>Let’s talk systems.</h2>
            <a href="mailto:unikdahal03@gmail.com">
              unikdahal03@gmail.com
              <ArrowIcon />
            </a>
          </div>

          <div className="v2-footer-bottom">
            <span>© 2026 Unik Dahal</span>
            <div>
              <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="/blog">Writing</a>
              <a href="/">V1</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
