import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './portfolio/LandingPage'
import PortfolioV2 from './v2/PortfolioV2'
import CaseStudy from './v2/CaseStudy'
import V2Writing from './v2/V2Writing'
import TweaksPanel from './components/TweaksPanel'

function LegacyPortfolio() {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('ud-theme') || 'light' } catch { return 'light' }
  })
  const [accent, setAccentState] = useState('#16a34a')
  const [tweaksOpen, setTweaksOpen] = useState(false)

  const setTheme = (value) => {
    document.documentElement.setAttribute('data-theme', value)
    setThemeState(value)
    try { localStorage.setItem('ud-theme', value) } catch {}
  }

  const setAccent = (light, dark) => {
    document.documentElement.style.setProperty('--accent', light)
    document.documentElement.style.setProperty('--accent-2', dark || light)
    document.documentElement.style.setProperty('--accent-dim', light + '22')
    setAccentState(light)
  }

  useEffect(() => {
    setTheme(theme)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return
      if (event.key === 't' || event.key === 'T') setTweaksOpen((value) => !value)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <Navbar
        homePath="/v1"
        theme={theme}
        onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <LandingPage />
      <TweaksPanel
        open={tweaksOpen}
        setOpen={setTweaksOpen}
        theme={theme}
        setTheme={setTheme}
        accent={accent}
        setAccent={setAccent}
      />
    </>
  )
}

function CompatibilityRedirect({ from, to }) {
  const location = useLocation()
  const suffix = location.pathname.slice(from.length)
  const targetPath = (to + suffix).replace(/\/+/g, '/') || '/'

  return (
    <Navigate
      to={targetPath + location.search + location.hash}
      replace
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Current portfolio */}
        <Route path="/" element={<PortfolioV2 />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/writing/:slug" element={<V2Writing />} />
        <Route path="/writing" element={<V2Writing />} />

        {/* Temporary legacy fallback while V2 settles as the canonical site */}
        <Route path="/v1" element={<LegacyPortfolio />} />

        {/* Backward-compatible URLs */}
        <Route path="/v2/*" element={<CompatibilityRedirect from="/v2" to="" />} />
        <Route path="/blog/*" element={<CompatibilityRedirect from="/blog" to="/writing" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
