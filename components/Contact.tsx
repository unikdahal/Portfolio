import React from 'react';
import { Mail, ArrowRight, Copy, Check, Github, Linkedin } from 'lucide-react';
import { UserProfile } from '../types';

interface ContactProps {
  data: UserProfile;
}

const Contact: React.FC<ContactProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for some contexts
      const textArea = document.createElement("textarea");
      textArea.value = data.email;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed', e);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h2 className="text-sm font-bold text-accent mb-8 tracking-widest uppercase font-mono">04. What's Next?</h2>
        
        <h2 className="text-5xl md:text-7xl font-bold mb-8 font-serif text-white leading-tight">
          Let's work together.
        </h2>
        
        <p className="text-lg text-secondary mb-12 max-w-xl mx-auto leading-relaxed">
          I'm currently open to new opportunities. Whether you have a question regarding my projects or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-30">
          <a 
            href={`mailto:${data.email}`} 
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center cursor-pointer shadow-xl shadow-white/5"
          >
            <Mail size={20} />
            Say Hello
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <button 
            onClick={copyEmail}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-medium text-lg rounded-full hover:bg-white/10 transition-all w-full sm:w-auto justify-center cursor-pointer active:scale-95 backdrop-blur-sm"
          >
            {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
            {copied ? 'Copied!' : 'Copy Email'}
          </button>
        </div>

        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-secondary/40 relative z-20">
           <div className="flex gap-6 items-center">
             {data.socials.map(s => {
                const Icon = s.platform === 'GitHub' ? Github : s.platform === 'LinkedIn' ? Linkedin : Mail;
                return (
                 <a 
                  key={s.platform} 
                  href={s.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full cursor-pointer"
                  aria-label={s.platform}
                 >
                   <Icon size={20} />
                 </a>
                );
             })}
           </div>
          <p className="font-mono text-xs">© {new Date().getFullYear()} {data.name}. Made with React & Tailwind.</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;