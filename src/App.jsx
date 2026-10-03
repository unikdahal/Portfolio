import { lazy, Suspense, useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import LandingPage from './portfolio/LandingPage'
import BlogLayout from './layouts/BlogLayout'

const BlogIndex = lazy(() => import('./blog/pages/BlogIndex'))
const BlogPost = lazy(() => import('./blog/pages/BlogPost'))

function ScrollToLocation() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function NotFound() {
  return (
    <main id="main-content" className="not-found wrap">
      <Helmet>
        <title>Page not found | Unik Dahal</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <span className="eyebrow">404 / A wrong turn</span>
      <h1>
        Nothing here.
        <br />
        <em>Plenty to explore.</em>
      </h1>
      <Link className="button" to="/">
        Back to the portfolio
      </Link>
    </main>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ud-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('ud-theme', theme)
    } catch {
      /* Storage is optional. */
    }
  }, [theme])
  return (
    <BrowserRouter>
      <ScrollToLocation />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar
        theme={theme}
        onToggle={() =>
          setTheme((value) => (value === 'dark' ? 'light' : 'dark'))
        }
      />
      <Suspense
        fallback={
          <main id="main-content" className="route-loading wrap" role="status">
            Loading the writing…
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<BlogIndex />} />
            <Route path=":slug" element={<BlogPost />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
