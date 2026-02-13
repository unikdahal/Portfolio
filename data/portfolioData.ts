import { UserProfile } from '../types';

export const PORTFOLIO_DATA: UserProfile = {
  name: "Unik Dahal",
  title: "Software Engineer | Backend Specialist",
  tagline: "Engineering scalable distributed systems from first principles.",
  location: "Hyderabad, India",
  email: "unikdahal03@gmail.com",
  resumeUrl: "https://drive.google.com/uc?export=download&id=14O5txsEXICj6izr6akh9gmtWA6dKpfMT",
  about: "I am a Software Development Engineer driven by a curiosity for how things work under the hood. My approach is rooted in first principles—whether I'm dissecting the internals of a Key-Value store to understand concurrency or optimizing database locks to slash API latency. At Highradius, I build high-throughput distributed systems that power enterprise-grade financial solutions. I bridge the gap between complex backend architecture and practical, scalable application delivery.",
  socials: [
    { platform: "GitHub", url: "https://github.com/unikdahal", icon: "github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/unikdahal", icon: "linkedin" },
    { platform: "Email", url: "mailto:unikdahal03@gmail.com", icon: "mail" }
  ],
  skills: [
    { 
      category: "Core Engineering", 
      items: ["System Design", "Distributed Systems", "Data Structures & Algorithms", "Concurrency", "Design Patterns"] 
    },
    { 
      category: "Backend Ecosystem", 
      items: ["Java 17/21", "Spring Boot", "Spring Cloud", "Netty", "Hibernate/JPA", "Microservices Architecture"] 
    },
    { 
      category: "Data & Infrastructure", 
      items: ["PostgreSQL", "Redis", "Apache Kafka", "AWS (S3, SQS, EC2)", "Snowflake", "Docker", "Kubernetes"] 
    },
    { 
      category: "Frontend & Tools", 
      items: ["React.js", "TypeScript", "Redux Saga", "Tailwind CSS", "CI/CD Pipelines", "Git"] 
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Software Development Engineer I",
      company: "Highradius Corporation",
      period: "June 2025 – Present",
      description: [
        "**Performance Engineering:** Diagnosed critical InnoDB gap-locking contention in a high-traffic financial module, successfully reducing P95 API latency by **82%** (from 450ms to 80ms).",
        "**Distributed Systems Design:** Architected a SAGA orchestration framework to handle distributed transactions across microservices, ensuring eventual consistency and reducing data anomalies by **70%**.",
        "**Developer Experience:** Built a custom Java-based migration service to automate client onboarding, which slashed manual configuration time by **95%** and accelerated production deployments."
      ]
    },
    {
      id: "exp-2",
      role: "Product Engineering Intern",
      company: "Highradius Corporation",
      period: "May 2024 – June 2025",
      description: [
        "**Event-Driven Architecture:** Engineered a scalable event streaming pipeline using Apache Kafka to asynchronously capture and process high-volume user activity logs.",
        "**API Development:** Owned the lifecycle of multiple enterprise RESTful APIs, maintaining a **90%** on-time delivery rate while ensuring strict adherence to code quality standards.",
        "**Testing Strategy:** Enhanced system reliability by establishing a comprehensive unit testing suite using JUnit and Mockito, catching potential regressions early in the development cycle."
      ]
    },
    {
      id: "exp-3",
      role: "Backend Engineer (Remote)",
      company: "ImmiHealth",
      period: "Jan 2024 – April 2024",
      description: [
        "**Secure Systems:** Architected the server-side logic for a telemedicine platform, implementing rigorous HIPAA-compliant data handling protocols.",
        "**Database Design:** Designed normalized database schemas capable of handling complex, multi-timezone appointment scheduling logic for international patients."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Redis-Like In-Memory Store",
      description: "A deep-dive into system internals. I engineered a high-performance, multithreaded Key-Value store from scratch using Java and Netty NIO. The system features a custom thread-safe transaction engine (MULTI/EXEC) with strict ACID compliance, demonstrating a mastery of low-level concurrency and network I/O.",
      tags: ["Java", "Netty", "Concurrency", "System Internals"],
      link: "#",
      github: "https://github.com/unikdahal/redis-java",
      image: "https://blog.eduonix.com/wp-content/uploads/2019/01/california-organic-farming-1-e1548159443571.jpg"
    },
    {
      id: "proj-2",
      title: "Sutíne E-Commerce Platform",
      description: "A full-scale e-commerce solution focusing on security and scalability. Implemented Role-Based Access Control (RBAC) with stateless JWT authentication and a robust server-side inventory management system using Spring Boot and PostgreSQL to prevent overselling during high-traffic events.",
      tags: ["Spring Boot", "React", "PostgreSQL", "Microservices"],
      link: "#",
      github: "",
      image: "/images/projects/sutine.png"
    }
  ]
};