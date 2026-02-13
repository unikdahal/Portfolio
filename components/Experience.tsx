import React from 'react';
import { UserProfile } from '../types';

interface ExperienceProps {
  data: UserProfile;
}

const renderBoldMarkdown = (text: string) => {
  // Very small parser for **bold** segments
  const parts = text.split('**');
  if (parts.length === 1) return text;

  const nodes: React.ReactNode[] = [];
  parts.forEach((part, index) => {
    if (!part) return;
    if (index % 2 === 1) {
      nodes.push(
        <span key={index} className="font-semibold text-white">
          {part}
        </span>
      );
    } else {
      nodes.push(part);
    }
  });
  return nodes;
};

const renderDescription = (text: string) => {
  // Treat leading **Label:** as a bold label, then handle any other **bold** segments
  const match = text.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
  if (match) {
    const [, label, rest] = match;
    return (
      <>
        <span className="font-semibold text-white">{label}:</span>{' '}
        {renderBoldMarkdown(rest)}
      </>
    );
  }
  return renderBoldMarkdown(text);
};

const Experience: React.FC<ExperienceProps> = ({ data }) => {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-sm font-bold text-accent mb-12 tracking-widest uppercase font-mono">02. Experience</h2>
        
        <div className="relative border-l border-white/10 ml-3 md:ml-6 space-y-12 pb-2">
          {data.experience.map((job) => (
            <div key={job.id} className="relative pl-8 md:pl-12 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-surfaceHighlight rounded-full border border-secondary/50 group-hover:border-accent group-hover:bg-accent group-hover:scale-125 transition-all duration-300 z-10"></div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-4">
                <div>
                   <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                     {job.role}
                   </h3>
                   <div className="text-lg text-secondary font-medium">{job.company}</div>
                </div>
                <div className="inline-flex items-center px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-xs font-mono text-secondary/80 whitespace-nowrap">
                  {job.period}
                </div>
              </div>
              
              <ul className="space-y-3">
                {job.description.map((desc, i) => (
                  <li key={i} className="text-secondary/80 leading-relaxed text-base pl-6 relative">
                    <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-accent/50 transition-colors"></span>
                    {renderDescription(desc)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;