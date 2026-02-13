import React from 'react';
import { UserProfile } from '../types';
import { Layout, Server, Database, Box } from 'lucide-react';

interface AboutProps {
  data: UserProfile;
}

const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm font-bold text-accent mb-4 tracking-widest uppercase font-mono">01. About Me</h2>
          <h3 className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight text-white">
            Engineering robust <span className="text-secondary">systems</span> and crafting seamless <span className="text-secondary">interfaces</span>.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Bio Card */}
          <div className="md:col-span-8 p-8 md:p-10 rounded-3xl bg-surfaceHighlight border border-white/5 hover:border-white/10 transition-colors">
            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-8">
              {data.about}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-secondary/60 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Hyderabad, India
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Backend & Frontend</span>
              <span className="hidden sm:inline">•</span>
              <span>System Design</span>
            </div>
          </div>

          {/* Education Card - Removed CGPA */}
          <div className="md:col-span-4 p-8 md:p-10 rounded-3xl bg-surfaceHighlight border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors group relative overflow-hidden min-h-[280px]">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <span className="text-xl">🎓</span>
                </div>
                <h4 className="text-xs text-accent uppercase tracking-widest mb-3 font-bold">Education</h4>
                <div className="text-2xl font-bold text-white mb-2 leading-tight">KIIT University</div>
                <div className="text-secondary font-medium">B.Tech in Computer Science</div>
             </div>
             
             <div className="relative z-10 pt-6 mt-6 border-t border-white/5">
                <div className="text-sm text-secondary/80">2021 — 2025</div>
             </div>
          </div>

          {/* Skills Grid - now fully data-driven */}
          <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {data.skills.map((group) => {
              const label = group.category.toLowerCase();
              let icon: React.ReactNode = <Layout className="text-blue-400" size={24} />;

              if (label.includes('backend') || label.includes('server')) {
                icon = <Server className="text-purple-400" size={24} />;
              } else if (
                label.includes('database') ||
                label.includes('data') ||
                label.includes('infrastructure')
              ) {
                icon = <Database className="text-emerald-400" size={24} />;
              } else if (label.includes('devops') || label.includes('tools')) {
                icon = <Box className="text-orange-400" size={24} />;
              }

              return (
                <SkillCard
                  key={group.category}
                  icon={icon}
                  title={group.category}
                  skills={group.items}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillCard: React.FC<{ icon: React.ReactNode; title: string; skills: string[] }> = ({ icon, title, skills }) => (
  <div className="p-6 rounded-3xl bg-surfaceHighlight border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 h-full group">
    <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h4 className="text-lg font-bold mb-4 text-white">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {skills.map(skill => (
        <span key={skill} className="text-xs font-medium text-secondary/90 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

export default About;