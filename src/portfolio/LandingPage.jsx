import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Check, Copy, Plus } from 'lucide-react'
import { DATA } from '../data'

const description =
  'Unik Dahal is a backend and data infrastructure engineer at HighRadius, building faster query paths and contributing to Apache DataFusion, Comet, and Arrow ADBC.'
const SectionLabel = ({ number, children }) => (
  <div className="section-label">
    <span>{number}</span>
    <span>{children}</span>
  </div>
)
const Tags = ({ items }) => (
  <ul className="tags" aria-label="Technologies">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

export default function LandingPage() {
  const [copyStatus, setCopyStatus] = useState('')
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DATA.email)
      setCopyStatus('Email copied')
    } catch {
      setCopyStatus(
        'Select the email address to copy it, or click it to open your email app.',
      )
    }
  }
  return (
    <>
      <Helmet>
        <title>Unik Dahal | Backend & Data Infrastructure Engineer</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://www.unikdahal.com.np/" />
        <meta
          property="og:title"
          content="Unik Dahal | Backend & Data Infrastructure Engineer"
        />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.unikdahal.com.np/" />
        <meta
          name="twitter:title"
          content="Unik Dahal | Backend & Data Infrastructure Engineer"
        />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <main id="main-content">
        <section className="hero wrap" id="hero" aria-labelledby="hero-heading">
          <div className="hero-topline">
            <span className="eyebrow">Backend / Data infrastructure</span>
            <span className="hero-edition">A little closer to the metal.</span>
          </div>
          <div className="hero-grid">
            <div>
              <p className="hero-intro">Hi, I’m Unik.</p>
              <h1 id="hero-heading">
                I make data
                <br />
                <em>move faster.</em>
              </h1>
            </div>
            <div className="hero-aside">
              <p>
                I build query infrastructure and backends at{' '}
                <strong>HighRadius</strong>. Outside work, I contribute to the
                open source systems I like getting lost in.
              </p>
              <a className="button" href="#experience">
                Explore my work
              </a>
              <span className="hero-location">
                From Nepal. Based in Hyderabad.
              </span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>Software Engineer, Data Platform</span>
            <span>Java / Rust / Distributed systems</span>
          </div>
        </section>
        <section
          id="experience"
          className="section wrap"
          aria-labelledby="work-heading"
        >
          <SectionLabel number="01">Selected work</SectionLabel>
          <div className="section-heading">
            <h2 id="work-heading">
              Less friction.
              <br />
              <em>More throughput.</em>
            </h2>
            <p>
              Some of the problems I’ve worked on at HighRadius.
              <br />
              <span className="muted">May 2024 — present</span>
            </p>
          </div>
          <div className="work-list">
            {DATA.work.map((item) => (
              <article className="work-item" key={item.number}>
                <span className="item-number">{item.number}</span>
                <div className="work-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Tags items={item.tags} />
                  <details className="work-details">
                    <summary>
                      The engineering <Plus size={15} aria-hidden="true" />
                    </summary>
                    <p>{item.detail}</p>
                  </details>
                </div>
                <div className="work-metric">
                  <span>
                    {item.metric}
                    <small>{item.unit}</small>
                  </span>
                  <p>{item.label}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="open-source"
          className="oss-section"
          aria-labelledby="oss-heading"
        >
          <div className="wrap section">
            <SectionLabel number="02">Open source</SectionLabel>
            <div className="section-heading">
              <h2 id="oss-heading">
                Good systems get
                <br />
                <em>better together.</em>
              </h2>
              <p>
                I use these tools, read their internals, and contribute fixes
                back. A few merged contributions:
              </p>
            </div>
            <div className="contributions">
              {DATA.contributions.map((item) => (
                <a
                  key={item.number}
                  className="contribution"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.project}: ${item.title} View merged pull request ${item.number}`}
                >
                  <div className="contribution-project">
                    <span>{item.project}</span>
                    <span className="contribution-language">
                      {item.language}
                    </span>
                  </div>
                  <div className="contribution-body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="contribution-status">
                    <span>
                      <Check size={13} aria-hidden="true" /> Merged
                    </span>
                    <span className="pr-number">{item.number}</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="oss-current">
              <span className="eyebrow">On my workbench</span>
              <p>
                Native Iceberg merge-on-read writes across Comet and Iceberg
                Rust.
              </p>
              <a
                href="https://github.com/unikdahal/datafusion-comet/pull/11"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Follow the work in progress
              </a>
            </div>
          </div>
        </section>
        <section
          id="projects"
          className="section wrap"
          aria-labelledby="projects-heading"
        >
          <SectionLabel number="03">Made out of curiosity</SectionLabel>
          <div className="section-heading">
            <h2 id="projects-heading">
              Sometimes, I just
              <br />
              <em>have to build it.</em>
            </h2>
            <p>
              One to understand the internals.
              <br />
              One to bring a business to life.
            </p>
          </div>
          <div className="project-grid">
            {DATA.projects.map((item) => (
              <article className="project" key={item.number}>
                <div className="project-topline">
                  <span className="eyebrow">{item.category}</span>
                  <span className="item-number">{item.number}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Tags items={item.tags} />
                <a
                  href={item.href}
                  className="text-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.link}
                </a>
              </article>
            ))}
          </div>
        </section>
        <section
          id="about"
          className="about-section wrap section"
          aria-labelledby="about-heading"
        >
          <SectionLabel number="04">The person behind the code</SectionLabel>
          <div className="about-grid">
            <h2 id="about-heading">
              Curious by default.
              <br />
              <em>Engineer by choice.</em>
            </h2>
            <div className="about-copy">
              <p>
                I’m from Nepal, now building data infrastructure in Hyderabad. I
                like the point where a clean abstraction meets a messy
                production problem. That’s usually where the interesting work
                starts.
              </p>
              <p>
                Before HighRadius, I worked on telemedicine backends at
                ImmiHealth. I studied computer science at KIIT, with a minor in
                financial economics. Apparently, one kind of system wasn’t
                enough.
              </p>
              <p>
                These days, I’m spending more time in Rust, query engines, and
                the Apache data ecosystem.
              </p>
            </div>
          </div>
          <div id="skills" className="stack-list">
            {DATA.stack.map((group) => (
              <div className="stack-row" key={group.label}>
                <h3>{group.label}</h3>
                <p>{group.value}</p>
              </div>
            ))}
          </div>
        </section>
        <section
          className="writing-section wrap section"
          aria-labelledby="writing-heading"
        >
          <SectionLabel number="05">Notes from the build</SectionLabel>
          <div className="writing-grid">
            <div>
              <h2 id="writing-heading">
                Learning, <em>out loud.</em>
              </h2>
              <p>
                The details I wish someone had explained
                <br className="desktop-break" /> before I started building.
              </p>
              <Link to="/blog" className="text-link">
                All writing
              </Link>
            </div>
            <Link to="/blog/001-resp-protocol" className="writing-feature">
              <span className="eyebrow">Building Redis in Java / Part 01</span>
              <h3>
                How Redis talks:
                <br />
                the RESP protocol.
              </h3>
              <p>
                Bytes on the wire, streaming parsers, and what it takes to speak
                Redis.
              </p>
              <span className="article-meta">
                May 2, 2026 <span>13 min read</span>
              </span>
            </Link>
          </div>
        </section>
        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-heading"
        >
          <div className="wrap contact-inner">
            <SectionLabel number="06">Get in touch</SectionLabel>
            <div className="contact-grid">
              <h2 id="contact-heading">
                Have a good
                <br />
                <em>systems problem?</em>
              </h2>
              <div>
                <p>
                  I’m always up for a conversation about data infrastructure,
                  open source, or something worth building.
                </p>
                <div className="email-row">
                  <a href={`mailto:${DATA.email}`} className="contact-email">
                    {DATA.email}
                  </a>
                  <button
                    className="icon-button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                  >
                    {copyStatus === 'Email copied' ? (
                      <Check size={19} />
                    ) : (
                      <Copy size={19} />
                    )}
                  </button>
                </div>
                <span className="copy-status" role="status">
                  {copyStatus}
                </span>
                <div className="social-links">
                  <a href={DATA.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <a href={DATA.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer wrap">
        <span>© {new Date().getFullYear()} Unik Dahal</span>
        <span>Built with care. And a lot of curiosity.</span>
        <a href="#hero">Back to top</a>
      </footer>
    </>
  )
}
