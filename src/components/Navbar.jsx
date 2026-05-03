import { Link, useLocation } from 'react-router-dom'
import { useActiveSection } from '../hooks.jsx'

const BASE_LINKS = [
  { id: 'experience', label: 'Work' },
  { id: 'projects',   label: 'Projects' },
  { id: 'skills',     label: 'Stack' },
  { id: 'blog',       label: 'Blog', isRoute: true },
  { id: 'contact',    label: 'Contact' },
]

export default function Navbar({ theme, onToggle }) {
  const { pathname } = useLocation()
  const active = useActiveSection(['hero', 'experience', 'projects', 'skills', 'blog', 'contact'])
  const isBlog = pathname.startsWith('/blog')

  return (
    <nav>
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          Unik Dahal
        </Link>
        <div className="nav-links">
          {isBlog && pathname !== '/blog' ? (
            <Link to="/blog" className="nav-back">← Back to writing</Link>
          ) : (
            BASE_LINKS.map(l => {
              if (l.isRoute) {
                return (
                  <Link 
                    key={l.id} 
                    to="/blog" 
                    className={pathname === '/blog' ? 'active' : ''}
                  >
                    {l.label}
                  </Link>
                )
              }
              
              // On the landing page, use hash links. On blog, link back to home + hash.
              const href = !isBlog ? `#${l.id}` : `/#${l.id}`
              return (
                <a 
                  key={l.id} 
                  href={href} 
                  className={active === l.id && !isBlog ? 'active' : ''}
                >
                  {l.label}
                </a>
              )
            })
          )}
          <span className="nav-theme-wrap">
            <button className="nav-theme" onClick={onToggle} aria-label="Toggle theme">
              {theme === 'dark' ? '☀' : '◐'}
            </button>
          </span>
        </div>
      </div>
    </nav>
  )
}
