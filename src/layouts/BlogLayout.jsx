import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useReadingProgress } from '../hooks'

function ReadingProgressBar() {
  const p = useReadingProgress()
  const { pathname } = useLocation()
  
  if (!pathname.startsWith('/blog/')) return null
  return <div className="read-progress-bar" style={{ width: p + '%' }} />
}

export default function BlogLayout({ theme, setTheme, activePost, closePost }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="blog-layout">
      <ReadingProgressBar />
      <Navbar
        theme={theme}
        onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <main className="blog-main">
        <Outlet />
      </main>
    </div>
  )

}
