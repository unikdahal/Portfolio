import React from 'react';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { UserProfile } from '../types';

interface ProjectsProps {
  data: UserProfile;
}

const Projects: React.FC<ProjectsProps> = ({ data }) => {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
           <div>
             <h2 className="text-sm font-bold text-accent mb-4 tracking-widest uppercase font-mono">03. Featured Projects</h2>
             <h3 className="text-3xl md:text-5xl font-bold text-white">Latest Engineering Work</h3>
           </div>
           {data.socials.find(s => s.platform === 'GitHub') && (
             <a 
              href={data.socials.find(s => s.platform === 'GitHub')?.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-medium text-white bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
             >
               View Full GitHub <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </a>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {data.projects.map((project) => (
            <div key={project.id} className="group relative flex flex-col h-full bg-surfaceHighlight rounded-3xl border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
              
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden border-b border-white/5 bg-black">
                <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0"></div>
                {/* Fallback pattern if image fails or for styling */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-20"></div>
                
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                />
                
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                     {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10 hover:bg-white hover:text-black transition-all hover:scale-110" 
                          aria-label="View Source"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {project.link && project.link !== "#" && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10 hover:bg-white hover:text-black transition-all hover:scale-110" 
                          aria-label="Visit Site"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 flex flex-col flex-grow relative z-10">
                <div className="mb-4">
                   <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                     {project.title}
                   </h3>
                </div>
                
                <p className="text-secondary leading-relaxed mb-8 flex-grow text-base">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-semibold text-secondary/80 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;