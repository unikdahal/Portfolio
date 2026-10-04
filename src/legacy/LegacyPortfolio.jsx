import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import LandingPage from '../portfolio/LandingPage'
import TweaksPanel from '../components/TweaksPanel'
import '../styles.css'

export default function LegacyPortfolio() {
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
