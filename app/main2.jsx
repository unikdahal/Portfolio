/* global React, ReactDOM, DATA */
const { useState, useEffect, useRef } = React;

/* ── reveal on scroll ── */
function useReveal(dep) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
        }
      }),
      { threshold: 0.05 }
    );
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView && dep === null) {
          el.classList.add("in", "instant");
        }
        io.observe(el);
      });
    }, 30);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [dep]);
}

/* ── active section ── */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

/* ── local time ── */
function useTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hyd = new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000);
      setT(hyd.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    };
    tick(); const id = setInterval(tick, 10000); return () => clearInterval(id);
  }, []);
  return t;
}

/* ── skill bar visibility ── */
function useSkillsVisible(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return visible;
}

/* ═══════════════ NAV ═══════════════ */
const NAV_LINKS = [
  { id: "experience", label: "Work" },
  { id: "projects",   label: "Projects" },
  { id: "skills",     label: "Stack" },
  ...(DATA.posts && DATA.posts.length > 0 ? [{ id: "blog", label: "Blog" }] : []),
  { id: "contact",    label: "Contact" },
];

function Navbar({ theme, onToggle, activeBlogPost, onCloseBlogPost }) {
  const active = useActiveSection(["hero", "experience", "projects", "skills", "blog", "contact"]);
  return (
    <nav>
      <div className="nav-inner">
        <a href="#hero" className="nav-brand" onClick={activeBlogPost ? onCloseBlogPost : undefined}>
          Unik Dahal
        </a>
        <div className="nav-links">
          {activeBlogPost ? (
            <button className="nav-back" onClick={onCloseBlogPost}>
              ← Back
            </button>
          ) : (
            NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? "active" : ""}>{l.label}</a>
            ))
          )}
          <span className="nav-theme-wrap">
            <button className="nav-theme" onClick={onToggle} aria-label="Toggle theme">
              {theme === "dark" ? "☀" : "◐"}
            </button>
          </span>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero() {
  const time = useTime();
  return (
    <section id="hero" className="hero reveal">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-tag">
              <span className="hero-tag-dot"></span>
              Software Engineer
            </div>
            <h1 className="hero-name">
              Unik<br /><em>Dahal</em>
            </h1>
            <p className="hero-role">
              <strong>SDE at Highradius</strong> — backend &amp; distributed systems.
              Hyderabad, India · from Nepal.
            </p>
            <p className="hero-bio">
              I build <strong>backend infrastructure</strong> in production — Spark/Iceberg query
              layers, Arrow Flight SQL, multi-microservice orchestration. On the side:
              a <strong>Redis clone</strong> in Java 21 and <strong>Sutine</strong>, a
              full e-commerce platform I'm building solo.
            </p>
            <div className="hero-actions">
              <a href="mailto:unikdahal03@gmail.com" className="btn primary">Get in touch</a>
              <a href="https://github.com/unikdahal" target="_blank" rel="noreferrer" className="btn">
                GitHub <span className="icon">↗</span>
              </a>
              <a href="https://sutine.com" target="_blank" rel="noreferrer" className="btn">
                Sutine <span className="icon">↗</span>
              </a>
            </div>
          </div>

          <div className="hero-right">
            {DATA.stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-meta">
          <div className="meta-item">
            <div className="mk">Company</div>
            <div className="mv"><span className="dot"></span>Highradius</div>
          </div>
          <div className="meta-item">
            <div className="mk">Stack</div>
            <div className="mv">Java · Spring · Kafka</div>
          </div>
          <div className="meta-item">
            <div className="mk">Local time</div>
            <div className="mv">{time} IST</div>
          </div>
          <div className="meta-item">
            <div className="mk">Location</div>
            <div className="mv">Hyderabad, India</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ EXPERIENCE ═══════════════ */
function Experience() {
  return (
    <section id="experience" className="content reveal">
      <div className="wrap">
        <div className="sec-label">Experience</div>
        <div>
          {DATA.experience.map((e, i) => (
            <div className="exp-item" key={i}>
              <div className="exp-when">
                <div className="exp-period">{e.when}</div>
                <div className="exp-co">{e.where}</div>
                <div className="exp-loc">{e.loc}</div>
              </div>
              <div className="exp-body">
                <div className="exp-role">{e.role}</div>
                {e.note && <div className="exp-note">{e.note}</div>}
                <ul className="exp-bullets">
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <div className="exp-tags">
                  {e.stack.map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ SUTINE FEATURED ═══════════════ */
function SutineFeatured({ p }) {
  return (
    <div className="proj-featured reveal">
      <div className="proj-featured-inner">
        <div className="proj-featured-bg"></div>
        <div className="proj-featured-noise"></div>
        <div className="proj-featured-header">
          <span className="proj-featured-num">{p.num} — Featured</span>
          <span className="proj-featured-badge">Live · sutine.com</span>
        </div>
        <div className="proj-featured-body">
          <div>
            <div className="proj-featured-title">Sutine<em>.</em></div>
            <div className="proj-featured-sub">Full-stack e-commerce · 2025 → present</div>
            <p className="proj-featured-desc">{p.desc}</p>
          </div>
          <div className="proj-featured-grid">
            {p.kv.map((k, i) => (
              <div className="proj-featured-kv" key={i}>
                <div className="pk">{k.k}</div>
                <div className="pv">{k.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="proj-featured-footer">
          <div className="proj-featured-stack">
            {p.stack.map((s) => <span key={s}>{s}</span>)}
          </div>
          <a className="proj-featured-link" href={p.href} target="_blank" rel="noreferrer">
            Visit sutine.com ↗
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ PROJECTS ═══════════════ */
function Projects() {
  const sutine = DATA.projects.find((p) => p.id === "sutine");
  const rest   = DATA.projects.filter((p) => p.id !== "sutine");
  return (
    <section id="projects" className="content">
      <div className="wrap">
        <div className="sec-label reveal">Selected work</div>
        {sutine && <SutineFeatured p={sutine} />}
        <div style={{marginTop: "2px"}}>
          {rest.map((p) => (
            <div className="proj-item reveal" key={p.id}>
              <div className="proj-left">
                <div className="proj-num">{p.num}</div>
                <div className="proj-name">{p.name}</div>
                <div className="proj-kicker">{p.tag}</div>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.stack.map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
              <div className="proj-aside">
                {p.kv.slice(0, 3).map((k, i) => (
                  <div className="proj-kv" key={i}>
                    <div className="pk">{k.k}</div>
                    <div className="pv">{k.v}</div>
                  </div>
                ))}
                {p.href && p.href !== "#" && (
                  <a className="proj-link" href={p.href} target="_blank" rel="noreferrer">View ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ SKILLS ═══════════════ */
function Skills() {
  const ref = useRef(null);
  const visible = useSkillsVisible(ref);
  return (
    <section id="skills" className="content reveal">
      <div className="wrap">
        <div className="sec-label">Technical stack</div>
        <div className={"skills-grid" + (visible ? " visible" : "")} ref={ref}>
          {DATA.skills.map((col) => (
            <div key={col.h}>
              <div className="skill-group-name">{col.h} <span>{col.n}</span></div>
              <div className="skill-list">
                {col.items.map((it) => (
                  <div className="skill-item" key={it.k}>
                    <div className="skill-row">
                      <span className="skill-name">{it.k}</span>
                      <span className="skill-yr">{it.y}</span>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" style={{width: it.v + "%"}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ BLOG POST READER ═══════════════ */
function renderBlock(block, i) {
  switch (block.type) {
    case "h2":
      return <h2 className="post-h2" key={i}>{block.text}</h2>;
    case "h3":
      return <h3 className="post-h3" key={i}>{block.text}</h3>;
    case "p":
      return <p className="post-p" key={i}>{block.text}</p>;
    case "quote":
      return <blockquote className="post-quote" key={i}>{block.text}</blockquote>;
    case "ul":
      return (
        <ul className="post-ul" key={i}>
          {block.items.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      );
    case "code":
      return (
        <div className="post-code-wrap" key={i}>
          {block.lang && <div className="post-code-lang">{block.lang}</div>}
          <pre className="post-code"><code>{block.text}</code></pre>
        </div>
      );
    default:
      return null;
  }
}

function BlogPost({ post, onClose }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post]);

  return (
    <div className="post-page">
      <div className="post-hero">
        <div className="wrap">
          <div className="post-meta-top">
            <span className="post-tag">{post.tag}</span>
            <span className="post-date">{post.date}</span>
            <span className="post-read">{post.readTime}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-excerpt">{post.excerpt}</p>
        </div>
      </div>
      <div className="post-body">
        <div className="post-content wrap">
          {post.content.map((block, i) => renderBlock(block, i))}
          <div className="post-end">
            <button className="post-end-back" onClick={onClose}>← Back to writing</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ BLOG SECTION ═══════════════ */
function Blog({ onOpenPost }) {
  const posts = DATA.posts || [];
  if (!posts.length) return null;
  const featured = posts[0];
  const list = posts.slice(1, 5);

  return (
    <section id="blog" className="content">
      <div className="wrap">
        <div className="sec-label reveal">Writing</div>

        {featured && (
          <div className="blog-featured reveal" onClick={() => onOpenPost(featured)}>
            <div className="blog-featured-meta">
              <span className="blog-tag">{featured.tag}</span>
              <span className="blog-date">{featured.date}</span>
              <span className="blog-read">{featured.readTime}</span>
            </div>
            <h2 className="blog-featured-title">{featured.title}</h2>
            <p className="blog-featured-excerpt">{featured.excerpt}</p>
            <div className="blog-featured-cta">
              Read post <span className="blog-arrow">→</span>
            </div>
          </div>
        )}

        {list.length > 0 && (
          <div className="blog-list">
            {list.map((post, i) => (
              <div className="blog-item reveal" key={post.id} onClick={() => onOpenPost(post)}>
                <div className="blog-item-left">
                  <div className="blog-item-num">№{String(i + 2).padStart(3, "0")}</div>
                  <div className="blog-item-title">{post.title}</div>
                  <div className="blog-item-excerpt">{post.excerpt}</div>
                </div>
                <div className="blog-item-right">
                  <div className="blog-tag">{post.tag}</div>
                  <div className="blog-date">{post.date}</div>
                  <div className="blog-read">{post.readTime}</div>
                  <div className="blog-item-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="blog-viewall reveal">
          <a href="blog.html" className="blog-viewall-link">
            View all posts
            <span className="blog-viewall-count">{posts.length}</span>
            <span className="blog-viewall-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact() {
  return (
    <section id="contact" className="content reveal">
      <div className="wrap">
        <div className="sec-label">Contact</div>
        <div className="contact-block">
          <div>
            <h2 className="contact-heading">Let's build<br />something.</h2>
            <p className="contact-sub">
              Open to interesting backend and distributed systems problems.
              Best reached by email.
            </p>
            <a className="contact-email" href="mailto:unikdahal03@gmail.com">
              unikdahal03@gmail.com →
            </a>
          </div>
          <div className="contact-links">
            {DATA.contact.links.map((l) => (
              <a
                key={l.k}
                href={l.href}
                className={"contact-link" + (l.k === "Sutine" ? " sutine-link" : "")}
                target="_blank"
                rel="noreferrer"
              >
                <span>{l.k}</span>
                <span className="cl-r">{l.v} ↗</span>
              </a>
            ))}
          </div>
        </div>
        <footer>
          <span>© 2026 Unik Dahal</span>
          <span>Hyderabad · India</span>
        </footer>
      </div>
    </section>
  );
}

/* ═══════════════ TWEAKS ═══════════════ */
function TweaksPanel({ open, setOpen, theme, setTheme, accent, setAccent }) {
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent?.postMessage({ type: "__edit_mode_available" }, "*"); } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const accents = [
    { l: "Green",  v: "#16a34a", d: "#22c55e" },
    { l: "Blue",   v: "#2563eb", d: "#3b82f6" },
    { l: "Amber",  v: "#d97706", d: "#f59e0b" },
    { l: "Rose",   v: "#e11d48", d: "#f43f5e" },
  ];

  return (
    <aside className={"tw-panel" + (open ? " on" : "")}>
      <div className="tw-head">
        <span className="g">Tweaks</span>
        <button onClick={() => { setOpen(false); try { window.parent?.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch {} }}>×</button>
      </div>
      <div className="tw-body">
        <div className="tw-row">
          <span className="l">Theme</span>
          <div className="opts">
            <button className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>Light</button>
            <button className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>Dark</button>
          </div>
        </div>
        <div className="tw-row">
          <span className="l">Accent</span>
          <div className="opts">
            {accents.map((a) => (
              <button key={a.l} className={accent === a.v ? "on" : ""} onClick={() => setAccent(a.v, a.d)} title={a.l}>{a.l[0]}</button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════ APP ═══════════════ */
function App() {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem("ud-theme") || "light"; } catch { return "light"; }
  });
  const [accent, setAccentState] = useState("#16a34a");
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);
  useReveal(activePost);

  const setTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    setThemeState(t);
    try { localStorage.setItem("ud-theme", t); } catch {}
  };

  const setAccent = (light, dark) => {
    document.documentElement.style.setProperty("--accent", light);
    document.documentElement.style.setProperty("--accent-2", dark || light);
    document.documentElement.style.setProperty("--accent-dim", light + "22");
    setAccentState(light);
  };

  const openPost = (post) => {
    setActivePost(post);
    window.scrollTo({ top: 0 });
  };
  const closePost = () => {
    setActivePost(null);
    setTimeout(() => {
      const el = document.getElementById("blog");
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 64;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 80);
  };

  useEffect(() => { setTheme(theme); }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "t" || e.key === "T") setTweaksOpen((v) => !v);
      if (e.key === "Escape" && activePost) closePost();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [activePost]);

  return (
    <>
      <Navbar theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} activeBlogPost={activePost} onCloseBlogPost={closePost} />
      <main>
        {activePost ? (
          <BlogPost post={activePost} onClose={closePost} />
        ) : (
          <>
            <Hero />
            <Experience />
            <Projects />
            <Skills />
            <Blog onOpenPost={openPost} />
            <Contact />
          </>
        )}
      </main>
      <TweaksPanel open={tweaksOpen} setOpen={setTweaksOpen} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
