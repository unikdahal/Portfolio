import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'
import './v2.css'

const CASES = {
  'query-path': {
    index: '01',
    eyebrow: 'Query infrastructure',
    title: ['The query was fast.', 'The path to it wasn’t.'],
    summary:
      'A fixed transport cost was dominating short analytical queries. I owned the move from JDBC/Thrift to an ADBC Flight SQL client with pooling, reducing fixed per-query overhead from roughly 1.5 seconds to roughly 90 ms.',
    metrics: [
      ['~1.5s → ~90ms', 'fixed transport overhead'],
      ['~15×', 'less fixed overhead'],
      ['ADBC', 'client protocol'],
      ['Flight SQL', 'transport'],
    ],
    problemTitle: 'The query engine was not the bottleneck.',
    problem:
      'For short analytical queries, a large part of perceived latency arrived before meaningful execution even began. The request path crossed a JDBC/Thrift boundary through Kyuubi, so fast queries still paid a fixed cost that was disproportionate to the work being done.',
    ownership:
      'I owned the client-side migration, connection lifecycle, pooling behavior, and the surrounding query-path changes needed to make the new transport usable in production.',
    decisions: [
      {
        title: 'Change the transport, not the workload',
        body:
          'The goal was not to “optimize Spark.” The expensive part was outside the engine. Moving the path to ADBC Flight SQL attacked the fixed cost directly.',
      },
      {
        title: 'Treat connection lifecycle as part of latency',
        body:
          'A faster wire protocol is not enough if every request pays connection setup. Pooling and lifecycle behavior were part of the design, not an afterthought.',
      },
      {
        title: 'Keep the migration observable',
        body:
          'The new path had to be measurable independently of query execution so regressions in transport, pooling, or server handoff could be isolated quickly.',
      },
    ],
    outcome:
      'The resulting path reduced fixed per-query overhead to roughly 90 ms. The most important lesson was architectural: when a fast query still feels slow, measure everything around the engine before changing the engine.',
    next: 'lakehouse-migration',
  },
  'lakehouse-migration': {
    index: '02',
    eyebrow: 'Lakehouse migration',
    title: ['Change the engine.', 'Keep the product stable.'],
    summary:
      'A phased migration moved analytical workloads from Snowflake toward Spark + Iceberg without requiring a flag-day cutover. The migration spanned more than 20 million tables and materially reduced compute cost.',
    metrics: [
      ['20M+', 'tables in migration scope'],
      ['~90%', 'compute reduction'],
      ['Iceberg', 'table format'],
      ['Polaris', 'catalog'],
    ],
    problemTitle: 'The migration boundary was the product boundary.',
    problem:
      'Standing up Spark was the easy part. The hard part was preserving product behavior while ingestion, metadata, user actions, and reads moved at different speeds. During the transition, both worlds had to remain compatible.',
    ownership:
      'My work covered the compatibility path around Spark-managed Iceberg tables, phased migration behavior, and the engineering needed to keep existing workflows working while execution moved underneath them.',
    decisions: [
      {
        title: 'Move ingestion first',
        body:
          'New data started landing on the lakehouse path while existing user-facing behavior could still depend on the previous warehouse path. This reduced migration blast radius.',
      },
      {
        title: 'Preserve compatibility during the middle state',
        body:
          'The system had to tolerate a mixed world. Compatibility mattered more than architectural purity while traffic and responsibilities were still split.',
      },
      {
        title: 'Make the catalog boring',
        body:
          'The catalog is infrastructure that should disappear operationally. Moving away from unstable commit/cache behavior toward Polaris was about reducing failure modes, not adding another feature.',
      },
    ],
    outcome:
      'The migration reduced analytical compute cost by roughly 90% while keeping the product usable through the transition. The key design choice was treating migration as a long-lived system state, not a deployment event.',
    next: 'saga-orchestration',
  },
  'saga-orchestration': {
    index: '03',
    eyebrow: 'Distributed reliability',
    title: ['A distributed workflow', 'needs a way back.'],
    summary:
      'A workbook import/export flow crossed seven services. I designed the orchestration around a distributed Saga so partial failure could be compensated rather than leaving the system in an unknown state.',
    metrics: [
      ['~6mo → ~1mo', 'environment recreation'],
      ['~70%', 'fewer related incidents'],
      ['7', 'services in the workflow'],
      ['Saga', 'failure model'],
    ],
    problemTitle: 'Partial success was worse than failure.',
    problem:
      'The workflow touched multiple independently deployed services. A failure after several successful steps could leave metadata, content, and downstream state out of sync. Retrying blindly was not enough because some operations had already committed.',
    ownership:
      'I designed the orchestration model, compensation flow, and the import/export packaging needed to make the workflow reproducible across environments.',
    decisions: [
      {
        title: 'Make every forward action explain its rollback',
        body:
          'A step was not complete from the orchestrator’s perspective until its compensating behavior was defined. That made recovery part of the workflow contract.',
      },
      {
        title: 'Centralize progress, decentralize ownership',
        body:
          'The orchestrator knew which stage the workflow had reached, while each service remained responsible for the correctness of its own forward and compensating operations.',
      },
      {
        title: 'Package state for repeatability',
        body:
          'Exported metadata and content were structured so environments could be recreated from an explicit artifact rather than weeks of manual reconstruction.',
      },
    ],
    outcome:
      'Environment recreation dropped from roughly six months to around one month, while related incidents fell by about 70%. The larger lesson was that distributed workflows need an explicit failure model before they need more retries.',
    next: 'query-path',
  },
}

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

function CaseDiagram({ type }) {
  if (type === 'query-path') {
    return (
      <div className="v2-case-diagram v2-case-query" role="img" aria-label="Before and after query transport path">
        <div className="v2-case-diagram-head">
          <span>Request path</span>
          <span>fixed overhead, not execution time</span>
        </div>
        <div className="v2-case-query-row">
          <div className="v2-case-query-label">
            <span>Before</span>
            <strong>~1.5s</strong>
          </div>
          <div className="v2-case-flow is-old">
            <span>Data service</span><i /><span>JDBC</span><i /><span>Kyuubi / Thrift</span><i /><span>Spark</span>
          </div>
        </div>
        <div className="v2-case-query-row">
          <div className="v2-case-query-label">
            <span>After</span>
            <strong>~90ms</strong>
          </div>
          <div className="v2-case-flow is-new">
            <span>Data service</span><i /><span>ADBC client</span><i /><span>Flight SQL</span><i /><span>Spark</span>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'lakehouse-migration') {
    return (
      <div className="v2-case-diagram v2-case-migration" role="img" aria-label="Phased Snowflake to Spark Iceberg migration">
        <div className="v2-case-diagram-head">
          <span>Migration state</span>
          <span>phased, compatibility-first</span>
        </div>
        <div className="v2-case-migration-grid">
          <div className="v2-case-system is-old">
            <small>Existing path</small>
            <strong>Snowflake</strong>
          </div>
          <div className="v2-case-migration-bridge">
            <div><b>01</b><span>Ingestion moves</span></div>
            <i />
            <div><b>02</b><span>Compatibility holds</span></div>
            <i />
            <div><b>03</b><span>Reads shift</span></div>
          </div>
          <div className="v2-case-system-stack">
            <div><small>Execution</small><strong>Spark</strong></div>
            <i />
            <div><small>Table format</small><strong>Iceberg</strong></div>
            <i />
            <div><small>Catalog</small><strong>Polaris</strong></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="v2-case-diagram v2-case-saga" role="img" aria-label="Distributed Saga forward and compensation flow">
      <div className="v2-case-diagram-head">
        <span>Failure model</span>
        <span>forward actions + compensation</span>
      </div>
      <div className="v2-case-saga-forward">
        {['prepare', 'metadata', 'content', 'workbook', 'publish', 'audit', 'finalize'].map((name, index) => (
          <div key={name} className={index < 4 ? 'is-done' : index === 4 ? 'is-failed' : ''}>
            <small>{String(index + 1).padStart(2, '0')}</small>
            <span>{name}</span>
          </div>
        ))}
      </div>
      <div className="v2-case-saga-back">
        <span>failure</span>
        <i />
        <strong>compensate completed steps</strong>
        <i />
        <span>known state</span>
      </div>
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const data = CASES[slug]
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    try { window.localStorage.setItem('unik-v2-theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!data) return <Navigate to="/v2/" replace />

  return (
    <main className="v2-shell v2-case" data-v2-theme={theme}>
      <Helmet>
        <title>{data.title.join(' ')} — Unik Dahal</title>
        <meta name="description" content={data.summary} />
        <meta name="theme-color" content={theme === 'dark' ? '#101521' : '#f4f6fa'} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={data.title.join(' ') + ' — Unik Dahal'} />
        <meta property="og:description" content={data.summary} />
        <meta property="og:url" content={'https://www.unikdahal.com.np/work/' + slug} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={'https://www.unikdahal.com.np/work/' + slug} />
      </Helmet>

      <header className="v2-case-nav">
        <a className="v2-brand" href="/" aria-label="Back to portfolio">
          <span className="v2-brand-mark">u.</span>
          <span>Unik Dahal</span>
        </a>

        <div className="v2-case-nav-right">
          <a href="/#work">All work</a>
          <a href="/#open-source">Open source</a>
          <a href="/#writing">Writing</a>
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

      <section className="v2-case-hero">
        <div className="v2-container">
          <div className="v2-case-kicker">
            <span>{data.index}</span>
            <span>{data.eyebrow}</span>
            <span>HighRadius · Data Platform</span>
          </div>

          <h1>
            {data.title[0]}
            <span>{data.title[1]}</span>
          </h1>

          <div className="v2-case-summary-grid">
            <p>{data.summary}</p>
            <div className="v2-case-metrics">
              {data.metrics.map(([value, label]) => (
                <div key={label}>
                  <strong className={value.length > 10 ? 'is-long' : ''}>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <CaseDiagram type={slug} />
        </div>
      </section>

      <section className="v2-case-body">
        <div className="v2-container">
          <div className="v2-case-section">
            <div className="v2-case-section-label">
              <span>01</span>
              <p>The problem</p>
            </div>
            <div className="v2-case-prose">
              <h2>{data.problemTitle}</h2>
              <p>{data.problem}</p>
            </div>
          </div>

          <div className="v2-case-section">
            <div className="v2-case-section-label">
              <span>02</span>
              <p>Ownership</p>
            </div>
            <div className="v2-case-prose v2-case-prose-large">
              <p>{data.ownership}</p>
            </div>
          </div>

          <div className="v2-case-section">
            <div className="v2-case-section-label">
              <span>03</span>
              <p>Design decisions</p>
            </div>
            <div className="v2-case-decisions">
              {data.decisions.map((decision, index) => (
                <article key={decision.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="v2-case-outcome">
            <div>
              <span>04 · Outcome</span>
              <h2>What changed.</h2>
            </div>
            <p>{data.outcome}</p>
          </div>
        </div>
      </section>

      <footer className="v2-case-footer">
        <div className="v2-container">
          <a href="/">
            <span>Back to portfolio</span>
            <strong>Selected work</strong>
          </a>
          <a href={'/work/' + data.next}>
            <span>Next case study</span>
            <strong>{CASES[data.next].eyebrow}</strong>
            <ArrowIcon />
          </a>
        </div>
      </footer>
    </main>
  )
}
