import { DATA } from '../data.js'

export default function Contact() {
  return (
    <section id="contact" className="content reveal">
      <div className="wrap">
        <div className="sec-label">Contact</div>
        <div className="contact-block">
          <div>
            <h2 className="contact-heading">Let's build<br />something.</h2>
            <p className="contact-sub">
              Open to interesting backend and distributed systems problems.
              Best reached by email.
            </p>
            <a className="contact-email" href="mailto:unikdahal03@gmail.com">
              unikdahal03@gmail.com →
            </a>
          </div>
          <div className="contact-links">
            {DATA.contact.links.map(l => (
              <a
                key={l.k}
                href={l.href}
                className={'contact-link' + (l.k === 'Sutine' ? ' sutine-link' : '')}
                target="_blank"
                rel="noreferrer"
              >
                <span>{l.k}</span>
                <span className="cl-r">{l.v} ↗</span>
              </a>
            ))}
          </div>
        </div>
        <footer>
          <span>© 2026 Unik Dahal</span>
          <span>Hyderabad · India</span>
        </footer>
      </div>
    </section>
  )
}
