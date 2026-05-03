import { useState, useEffect } from 'react'

export function useReveal(deps) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.05 }
    )
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in', 'instant')
        }
        io.observe(el)
      })
    }, 50)
    return () => { clearTimeout(t); io.disconnect() }
  }, [deps])
}

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-35% 0px -60% 0px' }
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return active
}

export function useTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const hyd = new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000)
      setT(hyd.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])
  return t
}

export function useSkillsVisible(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold: 0.2 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return visible
}

export function useReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const d = document.documentElement
      const h = d.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  return progress
}
