import { useState, useEffect } from 'react'
import { useReveal } from './hooks.jsx'
import Navbar      from './components/Navbar.jsx'
import Hero        from './components/Hero.jsx'
import Experience  from './components/Experience.jsx'
import Projects    from './components/Projects.jsx'
import Skills      from './components/Skills.jsx'
import Blog        from './components/Blog.jsx'
import BlogPost    from './components/BlogPost.jsx'
import Contact     from './components/Contact.jsx'
import TweaksPanel from './components/TweaksPanel.jsx'

export default function App() {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('ud-theme') || 'light' } catch { return 'light' }
  })
  const [accent, setAccentState] = useState('#16a34a')
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [activePost, setActivePost] = useState(null)
  useReveal(activePost)

  const setTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t)
    setThemeState(t)
    try { localStorage.setItem('ud-theme', t) } catch {}
  }

  const setAccent = (light, dark) => {
    document.documentElement.style.setProperty('--accent', light)
    document.documentElement.style.setProperty('--accent-2', dark || light)
    document.documentElement.style.setProperty('--accent-dim', light + '22')
    setAccentState(light)
  }

  const openPost = (post) => {
    if (post.draft) return
    setActivePost(post)
    window.scrollTo({ top: 0 })
  }

  const closePost = () => {
    setActivePost(null)
    setTimeout(() => {
      const el = document.getElementById('blog')
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 64
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 80)
  }

  useEffect(() => { setTheme(theme) }, [])

  useEffect(() => {
    const fn = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 't' || e.key === 'T') setTweaksOpen(v => !v)
      if (e.key === 'Escape' && activePost) closePost()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [activePost])

  return (
    <>
      <Navbar
        theme={theme}
        onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        activeBlogPost={activePost}
        onCloseBlogPost={closePost}
      />
      <main>
        {activePost ? (
          <BlogPost post={activePost} onClose={closePost} onOpenPost={openPost} />
        ) : (
          <>
            <Hero />
            <Experience />
            <Projects />
            <Skills />
            <Blog onOpenPost={openPost} />
            <Contact />
          </>
        )}
      </main>
      <TweaksPanel
        open={tweaksOpen} setOpen={setTweaksOpen}
        theme={theme} setTheme={setTheme}
        accent={accent} setAccent={setAccent}
      />
    </>
  )
}
