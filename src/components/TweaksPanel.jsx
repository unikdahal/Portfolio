import { useEffect } from 'react'

const ACCENTS = [
  { l: 'Green', v: '#16a34a', d: '#22c55e' },
  { l: 'Blue',  v: '#2563eb', d: '#3b82f6' },
  { l: 'Amber', v: '#d97706', d: '#f59e0b' },
  { l: 'Rose',  v: '#e11d48', d: '#f43f5e' },
]

export default function TweaksPanel({ open, setOpen, theme, setTheme, accent, setAccent }) {
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return
      if (e.data.type === '__activate_edit_mode') setOpen(true)
      if (e.data.type === '__deactivate_edit_mode') setOpen(false)
    }
    window.addEventListener('message', onMsg)
    try { window.parent?.postMessage({ type: '__edit_mode_available' }, '*') } catch {}
    return () => window.removeEventListener('message', onMsg)
  }, [])

  return (
    <aside className={'tw-panel' + (open ? ' on' : '')}>
      <div className="tw-head">
        <span className="g">Tweaks</span>
        <button onClick={() => {
          setOpen(false)
          try { window.parent?.postMessage({ type: '__edit_mode_dismissed' }, '*') } catch {}
        }}>×</button>
      </div>
      <div className="tw-body">
        <div className="tw-row">
          <span className="l">Theme</span>
          <div className="opts">
            <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>Light</button>
            <button className={theme === 'dark'  ? 'on' : ''} onClick={() => setTheme('dark')}>Dark</button>
          </div>
        </div>
        <div className="tw-row">
          <span className="l">Accent</span>
          <div className="opts">
            {ACCENTS.map(a => (
              <button key={a.l} className={accent === a.v ? 'on' : ''} onClick={() => setAccent(a.v, a.d)} title={a.l}>{a.l[0]}</button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
