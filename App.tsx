import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { PORTFOLIO_DATA } from './data/portfolioData';

const App: React.FC = () => {
  return (
    <div className="bg-background text-white min-h-screen selection:bg-accent/30 selection:text-white relative">
      {/* Noise Texture Overlay - Z-index 0 from CSS */}
      <div className="bg-noise"></div>
      
      {/* Main Content - Z-index 10 to sit above noise */}
      <div className="relative z-10">
        <Navbar resumeUrl={PORTFOLIO_DATA.resumeUrl} />
        <main>
          <Hero data={PORTFOLIO_DATA} />
          <About data={PORTFOLIO_DATA} />
          <Experience data={PORTFOLIO_DATA} />
          <Projects data={PORTFOLIO_DATA} />
          <Contact data={PORTFOLIO_DATA} />
        </main>
      </div>
    </div>
  );
};

export default App;