import { useRef } from 'react'
import { useSkillsVisible } from '../hooks.jsx'
import { DATA } from '../data.js'

export default function Skills() {
  const ref = useRef(null)
  const visible = useSkillsVisible(ref)
  return (
    <section id="skills" className="content reveal">
      <div className="wrap">
        <div className="sec-label">Technical stack</div>
        <div className={'skills-grid' + (visible ? ' visible' : '')} ref={ref}>
          {DATA.skills.map(col => (
            <div key={col.h}>
              <div className="skill-group-name">{col.h} <span>{col.n}</span></div>
              <div className="skill-list">
                {col.items.map(it => (
                  <div className="skill-item" key={it.k}>
                    <div className="skill-row">
                      <span className="skill-name">{it.k}</span>
                      <span className="skill-yr">{it.y}</span>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" style={{ width: it.v + '%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
