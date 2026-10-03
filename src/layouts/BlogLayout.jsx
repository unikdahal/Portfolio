import { Outlet, Link } from 'react-router-dom'
export default function BlogLayout() {
  return (
    <>
      <main id="main-content" className="blog-main">
        <Outlet />
      </main>
      <footer className="site-footer wrap">
        <span>© {new Date().getFullYear()} Unik Dahal</span>
        <span>Notes from the build.</span>
        <Link to="/">Back to the portfolio</Link>
      </footer>
    </>
  )
}
