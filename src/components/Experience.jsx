import { DATA } from '../data.js'

export default function Experience() {
  return (
    <section id="experience" className="content reveal">
      <div className="wrap">
        <div className="sec-label">Experience</div>
        <div>
          {DATA.experience.map((e, i) => (
            <div className="exp-item" key={i}>
              <div className="exp-when">
                <div className="exp-period">{e.when}</div>
                <div className="exp-co">{e.where}</div>
                <div className="exp-loc">{e.loc}</div>
              </div>
              <div className="exp-body">
                <div className="exp-role">{e.role}</div>
                {e.note && <div className="exp-note">{e.note}</div>}
                <ul className="exp-bullets">
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <div className="exp-tags">
                  {e.stack.map(s => <span key={s}>{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
