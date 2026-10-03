import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'

export default function Navbar({ theme, onToggle }) {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  useEffect(() => setOpen(false), [pathname, hash])
  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        document.getElementById('menu-toggle')?.focus()
      }
    }
    if (open) document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open])
  return (
    <header className="site-header">
      <div className="nav-inner wrap">
        <Link to="/" className="nav-brand" aria-label="Unik Dahal, home">
          <span className="brand-mark" aria-hidden="true">
            u.
          </span>
          <span>Unik Dahal</span>
        </Link>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`nav-links${open ? ' is-open' : ''}`}
        >
          <Link to="/#experience" onClick={() => setOpen(false)}>
            Work
          </Link>
          <Link to="/#open-source" onClick={() => setOpen(false)}>
            Open source
          </Link>
          <Link
            to="/blog"
            aria-current={pathname.startsWith('/blog') ? 'page' : undefined}
          >
            Writing
          </Link>
          <Link
            to="/#contact"
            className="nav-contact"
            onClick={() => setOpen(false)}
          >
            Say hello
          </Link>
        </nav>
        <div className="nav-actions">
          <button
            className="icon-button theme-toggle"
            onClick={onToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <button
            id="menu-toggle"
            className="icon-button menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-controls="primary-navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}
