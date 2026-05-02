import { useActiveSection } from '../hooks.jsx'
import { posts } from '../posts.js'

const BASE_LINKS = [
  { id: 'experience', label: 'Work' },
  { id: 'projects',   label: 'Projects' },
  { id: 'skills',     label: 'Stack' },
  { id: 'contact',    label: 'Contact' },
]

export default function Navbar({ theme, onToggle, activeBlogPost, onCloseBlogPost }) {
  const active = useActiveSection(['hero', 'experience', 'projects', 'skills', 'blog', 'contact'])

  const navLinks = posts.length > 0
    ? [...BASE_LINKS.slice(0, 3), { id: 'blog', label: 'Blog' }, BASE_LINKS[3]]
    : BASE_LINKS

  return (
    <nav>
      <div className="nav-inner">
        <a href="#hero" className="nav-brand" onClick={activeBlogPost ? onCloseBlogPost : undefined}>
          Unik Dahal
        </a>
        <div className="nav-links">
          {activeBlogPost ? (
            <button className="nav-back" onClick={onCloseBlogPost}>← Back</button>
          ) : (
            navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'active' : ''}>{l.label}</a>
            ))
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
