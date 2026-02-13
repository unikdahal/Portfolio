import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Briefcase } from 'lucide-react';

interface NavbarProps {
  resumeUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({ resumeUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b
          ${scrolled 
            ? 'bg-background/70 backdrop-blur-xl border-white/5 py-4 shadow-lg' 
            : 'bg-transparent border-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* 1. Logo Section */}
          <a 
            href="#" 
            className="text-xl font-extrabold tracking-tighter text-white z-50 hover:text-white/80 transition-colors relative"
            aria-label="Home"
          >
            UNIK<span className="text-accent">.</span>
          </a>

          {/* 2. Centered Navigation (Desktop) */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 space-x-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-5 py-2 text-sm font-medium text-secondary hover:text-white transition-all rounded-full hover:bg-white/10"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* 3. Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href={resumeUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-secondary hover:text-white transition-colors flex items-center gap-2 group px-3 py-2"
            >
              Resume <Download size={15} className="group-hover:translate-y-0.5 transition-transform text-accent" />
            </a>
            <a 
              href="#contact" 
              className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/5"
            >
              Hire Me <Briefcase size={15} />
            </a>
          </div>

          {/* 4. Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 z-50 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`
          fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center gap-8
          transition-all duration-300 md:hidden
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-4xl font-bold text-secondary hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
        
        <div className="w-16 h-px bg-white/10 my-4"></div>
        
        <div className="flex flex-col items-center gap-5">
          <a 
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg font-medium text-white/80 hover:text-accent transition-colors"
          >
            <Download size={20} /> Download Resume
          </a>
          <a 
            href="#contact" 
            onClick={() => setIsOpen(false)}
            className="px-10 py-4 bg-white text-black font-bold text-lg rounded-full"
          >
            Hire Me
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;