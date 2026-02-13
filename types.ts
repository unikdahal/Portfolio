export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface UserProfile {
  name: string;
  title: string;
  tagline: string;
  about: string;
  location: string;
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
}