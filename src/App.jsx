import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './portfolio/LandingPage'
import BlogLayout from './layouts/BlogLayout'
import BlogIndex from './blog/pages/BlogIndex'
import BlogPost from './blog/pages/BlogPost'
import TweaksPanel from './components/TweaksPanel'

export default function App() {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('ud-theme') || 'light' } catch { return 'light' }
  })
  const [accent, setAccentState] = useState('#16a34a')
  const [tweaksOpen, setTweaksOpen] = useState(false)
  
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

  useEffect(() => { setTheme(theme) }, [])

  useEffect(() => {
    const fn = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 't' || e.key === 'T') setTweaksOpen(v => !v)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Portfolio Route */}
        <Route path="/" element={
          <>
            <Navbar 
              theme={theme} 
              onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            <LandingPage />
          </>
        } />

        {/* Blog Routes */}
        <Route path="/blog" element={<BlogLayout theme={theme} setTheme={setTheme} />}>
          <Route index element={<BlogIndex />} />
          <Route path=":slug" element={<BlogPost />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <TweaksPanel
        open={tweaksOpen} setOpen={setTweaksOpen}
        theme={theme} setTheme={setTheme}
        accent={accent} setAccent={setAccent}
      />
    </BrowserRouter>
  )
}
