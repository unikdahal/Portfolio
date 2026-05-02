import { DATA } from '../data.js'

function SutineFeatured({ p }) {
  return (
    <div className="proj-featured reveal">
      <div className="proj-featured-inner">
        <div className="proj-featured-bg"></div>
        <div className="proj-featured-noise"></div>
        <div className="proj-featured-header">
          <span className="proj-featured-num">{p.num} — Featured</span>
          <span className="proj-featured-badge">Live · sutine.com</span>
        </div>
        <div className="proj-featured-body">
          <div>
            <div className="proj-featured-title">Sutine<em>.</em></div>
            <div className="proj-featured-sub">Full-stack e-commerce · 2025 → present</div>
            <p className="proj-featured-desc">{p.desc}</p>
          </div>
          <div className="proj-featured-grid">
            {p.kv.map((k, i) => (
              <div className="proj-featured-kv" key={i}>
                <div className="pk">{k.k}</div>
                <div className="pv">{k.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="proj-featured-footer">
          <div className="proj-featured-stack">
            {p.stack.map(s => <span key={s}>{s}</span>)}
          </div>
          <a className="proj-featured-link" href={p.href} target="_blank" rel="noreferrer">
            Visit sutine.com ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const sutine = DATA.projects.find(p => p.id === 'sutine')
  const rest   = DATA.projects.filter(p => p.id !== 'sutine')
  return (
    <section id="projects" className="content">
      <div className="wrap">
        <div className="sec-label reveal">Selected work</div>
        {sutine && <SutineFeatured p={sutine} />}
        <div style={{ marginTop: '2px' }}>
          {rest.map(p => (
            <div className="proj-item reveal" key={p.id}>
              <div className="proj-left">
                <div className="proj-num">{p.num}</div>
                <div className="proj-name">{p.name}</div>
                <div className="proj-kicker">{p.tag}</div>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.stack.map(s => <span key={s}>{s}</span>)}
                </div>
              </div>
              <div className="proj-aside">
                {p.kv.slice(0, 3).map((k, i) => (
                  <div className="proj-kv" key={i}>
                    <div className="pk">{k.k}</div>
                    <div className="pv">{k.v}</div>
                  </div>
                ))}
                {p.href && p.href !== '#' && (
                  <a className="proj-link" href={p.href} target="_blank" rel="noreferrer">View ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
