import Hero from '../components/Hero'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks'

export default function LandingPage() {
  useReveal([])
  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      
      <section className="blog-teaser content">
        <div className="wrap">
          <div className="sec-label reveal">Writing</div>
          <div className="blog-teaser-content reveal">
            <h2 className="teaser-title">I write about systems, data engineering, and the internals of tools we use daily.</h2>
            <Link to="/blog" className="teaser-btn">
              Explore the Journal →
              <span className="teaser-count">Recent updates available</span>
            </Link>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}
