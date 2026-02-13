import React from 'react';
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import { UserProfile } from '../types';

interface HeroProps {
  data: UserProfile;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-40 md:pt-32 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto animate-slide-up">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-colors cursor-default hover:bg-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-secondary/90 tracking-wide">Available for new projects</span>
        </div>

        {/* Main Headings */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[1] md:leading-[0.9]">
            {data.name}
          </h1>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-light tracking-wide text-secondary/80">
            {data.title}
          </h2>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto leading-relaxed">
          {data.tagline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full sm:w-auto relative z-30">
          <a 
            href="#projects"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10 cursor-pointer text-center"
          >
            View Work
          </a>
          <a 
            href={data.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-surfaceHighlight text-white font-bold text-lg rounded-full border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <Download size={20} /> Resume
          </a>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-6 pt-10 border-t border-white/5 w-full justify-center max-w-md relative z-30">
           {data.socials.map((social) => (
             <SocialLink key={social.platform} {...social} />
           ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-secondary/40 hidden md:block z-10">
        <ArrowDown size={24} />
      </div>
    </section>
  );
};

const SocialLink: React.FC<{ platform: string; url: string }> = ({ platform, url }) => {
  const icons = {
    GitHub: <Github size={24} />,
    LinkedIn: <Linkedin size={24} />,
    Email: <Mail size={24} />
  };
  
  // @ts-ignore
  const Icon = icons[platform] || <Mail size={24} />;

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-secondary hover:text-white transition-colors hover:scale-110 transform duration-200 p-2 hover:bg-white/5 rounded-full cursor-pointer"
      aria-label={platform}
    >
      {Icon}
    </a>
  );
};

export default Hero;