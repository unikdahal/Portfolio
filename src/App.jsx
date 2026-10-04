import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PortfolioV2 from './v2/PortfolioV2'

const CaseStudy = lazy(() => import('./v2/CaseStudy'))
const V2Writing = lazy(() => import('./v2/V2Writing'))
const LegacyPortfolio = lazy(() => import('./legacy/LegacyPortfolio'))

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

function RouteFallback() {
  return (
    <div className="v2-route-fallback" role="status" aria-label="Loading page">
      <span />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Canonical portfolio */}
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
      </Suspense>
    </BrowserRouter>
  )
}
