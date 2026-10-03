import { useTime } from '../hooks.jsx'
import { DATA } from '../data.js'

export default function Hero() {
  const time = useTime()
  return (
    <section id="hero" className="hero reveal">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-tag">
              <span className="hero-tag-dot"></span>
              Software Engineer
            </div>
            <h1 className="hero-name">
              Unik<br /><em>Dahal</em>
            </h1>
            <p className="hero-role">
              <strong>SDE at Highradius</strong> — backend &amp; distributed systems.
              Hyderabad, India · from Nepal.
            </p>
            <p className="hero-bio">
              I build <strong>backend infrastructure</strong> in production — Spark/Iceberg query
              layers, Arrow Flight SQL, multi-microservice orchestration. On the side:
              a <strong>Redis clone</strong> in Java 21 and <strong>Sutine</strong>, a
              full e-commerce platform I'm building solo.
            </p>
            <div className="hero-actions">
              <a href="mailto:unikdahal03@gmail.com" className="btn primary">Get in touch</a>
              <a href="https://github.com/unikdahal" target="_blank" rel="noreferrer" className="btn">
                GitHub <span className="icon">↗</span>
              </a>
              <a href="https://sutine.com" target="_blank" rel="noreferrer" className="btn">
                Sutine <span className="icon">↗</span>
              </a>
            </div>
          </div>
          <div className="hero-right">
            {DATA.stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-meta">
          <div className="meta-item">
            <div className="mk">Company</div>
            <div className="mv"><span className="dot"></span>Highradius</div>
          </div>
          <div className="meta-item">
            <div className="mk">Stack</div>
            <div className="mv">Java · Spring · Kafka</div>
          </div>
          <div className="meta-item">
            <div className="mk">Local time</div>
            <div className="mv">{time} IST</div>
          </div>
          <div className="meta-item">
            <div className="mk">Location</div>
            <div className="mv">Hyderabad, India</div>
          </div>
        </div>
      </div>
    </section>
  )
}
