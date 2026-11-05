"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const STAT_TARGETS = { years: 3, products: 10, success: 100 };
const SECTIONS = ["home", "projects", "experience", "tools", "education", "contact"];

const SKILL_GROUPS = [
  {
    title: "Backend",
    items: [
      { name: "Node.js", detail: "Backend runtime", color: "#5fa04e", icon: "nodedotjs/5FA04E" },
      { name: "TypeScript", detail: "Typed JavaScript", color: "#3178c6", icon: "typescript/3178C6" },
      { name: "NestJS", detail: "Backend framework", color: "#e0234e", icon: "nestjs/E0234E" },
      { name: "Express", detail: "HTTP framework", color: "#ffffff", icon: "express/FFFFFF" },
      { name: "Fastify", detail: "Fast HTTP framework", color: "#ffffff", icon: "fastify/FFFFFF" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", detail: "UI library", color: "#61dafb", icon: "react/61DAFB" },
      { name: "Next.js", detail: "React framework", color: "#ffffff", icon: "nextdotjs/FFFFFF" },
    ],
  },
  {
    title: "Data",
    items: [
      { name: "MongoDB", detail: "Document database", color: "#47a248", icon: "mongodb/47A248" },
      { name: "PostgreSQL", detail: "Relational database", color: "#4169e1", icon: "postgresql/4169E1" },
      { name: "MySQL", detail: "Relational database", color: "#4479a1", icon: "mysql/4479A1" },
      { name: "Redis", detail: "Cache and queues", color: "#ff4438", icon: "redis/FF4438" },
      { name: "Firebase", detail: "Auth and notifications", color: "#ffca28", icon: "firebase/FFCA28" },
    ],
  },
  {
    title: "Realtime",
    items: [
      { name: "Socket.IO", detail: "Realtime sockets", color: "#ffffff", icon: "socketdotio/FFFFFF" },
      { name: "Kafka", detail: "Event streaming", color: "#ffffff", icon: "apachekafka/FFFFFF" },
      { name: "MQTT", detail: "Device messaging", color: "#660066", icon: "mqtt/660066" },
      { name: "WebSockets", detail: "Live connections", color: "#3c790a", src: "/icons/websocket.svg" },
    ],
  },
  {
    title: "Cloud & delivery",
    items: [
      { name: "Docker", detail: "Containers", color: "#2496ed", icon: "docker/2496ED" },
      { name: "Nginx", detail: "Reverse proxy", color: "#009639", icon: "nginx/009639" },
      { name: "AWS", detail: "EC2 and S3", color: "#ff9900", src: "/icons/aws.svg" },
      { name: "PM2", detail: "Process manager", color: "#2b037a", icon: "pm2/2B037A" },
      { name: "GitHub Actions", detail: "CI/CD", color: "#2088ff", icon: "githubactions/2088FF" },
      { name: "Jenkins", detail: "CI pipelines", color: "#d24939", icon: "jenkins/D24939" },
      { name: "Sentry", detail: "Error monitoring", color: "#8d5494", icon: "sentry/8D5494" },
      { name: "Dokploy", detail: "Deployments", color: "#ffffff", src: "/icons/dokploy.svg" },
    ],
  },
  {
    title: "Payments & auth",
    items: [
      { name: "Stripe", detail: "Payments", color: "#635bff", icon: "stripe/635BFF" },
      { name: "RevenueCat", detail: "Subscriptions", color: "#f2545b", icon: "revenuecat/F2545B" },
      { name: "JWT", detail: "Auth tokens", color: "#ffffff", icon: "jsonwebtokens/FFFFFF" },
      { name: "OAuth", detail: "Sign-in", color: "#ffffff", src: "/icons/oauth.svg" },
    ],
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function Portfolio() {
  const rootRef = useRef(null);
  const revealedRef = useRef(new Set());
  const [active, setActive] = useState("home");
  const [counts, setCounts] = useState({ years: 0, products: 0, success: 0 });
  const [sent, setSent] = useState(false);
  const [theme, setTheme] = useState("dark");
  const year = new Date().getFullYear();

  useLayoutEffect(() => {
    revealedRef.current.forEach((el) => el.classList.add("is-in"));
  });

  useLayoutEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const siblings = [...el.parentElement.children].filter((child) =>
            child.classList.contains("reveal")
          );
          el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
          el.classList.add("is-in");
          revealedRef.current.add(el);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    root.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    let counted = false;
    const countObserver = new IntersectionObserver(
      (entries) => {
        if (counted || !entries.some((entry) => entry.isIntersecting)) return;
        counted = true;
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setCounts({
            years: Math.round(STAT_TARGETS.years * eased),
            products: Math.round(STAT_TARGETS.products * eased),
            success: Math.round(STAT_TARGETS.success * eased),
          });
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.disconnect();
      },
      { threshold: 0.6 }
    );
    const stats = root.querySelector(".stats");
    if (stats) countObserver.observe(stats);

    const sectionNodes = SECTIONS.map((id) => document.getElementById(id));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sectionNodes.forEach((section) => section && sectionObserver.observe(section));

    const tools = [...root.querySelectorAll(".tool")];
    const onMove = (event) => {
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    tools.forEach((card) => card.addEventListener("pointermove", onMove));

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      sectionObserver.disconnect();
      tools.forEach((card) => card.removeEventListener("pointermove", onMove));
    };
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Project inquiry from ${data.get("name")}`;
    const body = `${data.get("message")}\n\nFrom: ${data.get("name")} <${data.get("email")}>`;
    window.location.href = `mailto:zainulislamzia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div ref={rootRef}>
      <div className="grain" aria-hidden="true" />

      <nav className="dock" aria-label="Primary">
        <a href="#home" className={`dock__item${active === "home" ? " is-active" : ""}`} data-label="Home" aria-label="Home">
          <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
        </a>
        <a href="#projects" className={`dock__item${active === "projects" ? " is-active" : ""}`} data-label="Projects" aria-label="Projects">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </a>
        <a href="#experience" className={`dock__item${active === "experience" ? " is-active" : ""}`} data-label="Experience" aria-label="Experience">
          <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
        </a>
        <a href="#tools" className={`dock__item${active === "tools" ? " is-active" : ""}`} data-label="Skills" aria-label="Skills">
          <svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></svg>
        </a>
        <a href="#education" className={`dock__item${active === "education" ? " is-active" : ""}`} data-label="Education" aria-label="Education">
          <svg viewBox="0 0 24 24"><path d="M3 9 12 4l9 5-9 5-9-5z" /><path d="M7 12v5c0 .6 2.2 2 5 2s5-1.4 5-2v-5" /></svg>
        </a>
        <button
          type="button"
          className="dock__item"
          onClick={toggleTheme}
          data-label={theme === "light" ? "Dark mode" : "Light mode"}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <svg className="fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.02 4.94a8.2 8.2 0 1 0 0 14.12 7.1 7.1 0 0 1 0-14.12z" transform="rotate(-40 12 12)" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          )}
        </button>
        <span className="dock__sep" />
        <a href="#contact" className={`dock__item dock__item--cta${active === "contact" ? " is-active" : ""}`} data-label="Contact" aria-label="Contact">
          <svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg>
        </a>
      </nav>

      <div className="layout">
        <aside className="profile reveal">
          <div className="profile__card">
            <div className="profile__photo">
              <img src="/me.jpg" alt="Zain Ul Islam Zia" />
              <span className="profile__badge"><i />Available for work</span>
            </div>
            <h2 className="profile__name">Zain Ul Islam Zia</h2>
            <p className="profile__bio">A full stack developer who designs scalable backends, microservices, and production-ready products.</p>
            <p className="profile__meta">
              <svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
              Lahore, Pakistan
            </p>
            <div className="profile__social">
              <a href="https://linkedin.com/in/zain-ul-islam-zia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" className="fill"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" /></svg>
              </a>
              <a href="mailto:zainulislamzia@gmail.com" aria-label="Email">
                <svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg>
              </a>
              <a href="tel:+923126911405" aria-label="Phone">
                <svg viewBox="0 0 24 24"><path d="M6.5 3.5h3L11 8l-2 1.5a12 12 0 0 0 5.5 5.5L16 13l4.5 1.5v3A2 2 0 0 1 18.5 20 16 16 0 0 1 4 5.5a2 2 0 0 1 2.5-2z" /></svg>
              </a>
            </div>
            <a href="#contact" className="btn btn--primary btn--block">
              Let&apos;s talk
              <Arrow />
            </a>
          </div>
        </aside>

        <main className="content">
          <section id="home" className="hero">
            <h1 className="display reveal">
              <span>Full Stack</span>
              <span className="muted">Developer</span>
            </h1>
            <p className="lead reveal">Backend-focused software engineer with 3 years designing scalable architecture and microservices. I ship production systems with solid data layers, CI/CD, and the kind of reliability teams can trust.</p>

            <div className="stats reveal">
              <div className="stat">
                <span className="stat__num">+<b>{counts.years}</b></span>
                <span className="stat__label">Years of<br />experience</span>
              </div>
              <div className="stat">
                <span className="stat__num">+<b>{counts.products}</b></span>
                <span className="stat__label">Products<br />shipped</span>
              </div>
              <div className="stat">
                <span className="stat__num"><b>{counts.success}</b>%</span>
                <span className="stat__label">Success rate<br />and trust</span>
              </div>
            </div>

            <div className="features">
              <a href="#projects" className="feature feature--orange reveal">
                <svg className="feature__icon" viewBox="0 0 24 24"><path d="m12 2 2.4 6.9H22l-6 4.4 2.3 7.1L12 16l-6.3 4.4L8 13.3 2 8.9h7.6z" /></svg>
                <span className="feature__title">Recent<br />projects</span>
                <span className="feature__arrow"><Arrow /></span>
              </a>
              <a href="#tools" className="feature feature--lime reveal">
                <svg className="feature__icon" viewBox="0 0 24 24"><path d="m8 6-6 6 6 6M16 6l6 6-6 6" /></svg>
                <span className="feature__title">Core<br />skills</span>
                <span className="feature__arrow"><Arrow /></span>
              </a>
            </div>
          </section>

          <div className="marquee reveal" aria-hidden="true">
            <div className="marquee__track">
              <span>Microservices</span><i>✦</i><span>Payments</span><i>✦</i><span>Real-time</span><i>✦</i><span>AWS</span><i>✦</i><span>CI/CD</span><i>✦</i><span>Kafka</span><i>✦</i>
              <span>Microservices</span><i>✦</i><span>Payments</span><i>✦</i><span>Real-time</span><i>✦</i><span>AWS</span><i>✦</i><span>CI/CD</span><i>✦</i><span>Kafka</span><i>✦</i>
            </div>
          </div>

          <section id="projects" className="section">
            <h2 className="display display--md reveal"><span>Recent</span> <span className="muted">Projects</span></h2>
            <div className="projects">
              <a href="https://dexremit.com" target="_blank" rel="noopener noreferrer" className="project reveal">
                <div className="project__thumb">
                  <img className="project__shot" src="/projects/dexremit.jpg" alt="DEX Remit homepage" />
                </div>
                <div className="project__info">
                  <div>
                    <h3>DEX Remit</h3>
                    <p>Cross-border money transfer · Banking &amp; payment APIs</p>
                  </div>
                  <span className="project__arrow"><Arrow /></span>
                </div>
              </a>
              <a href="https://ownmdm.com/" target="_blank" rel="noopener noreferrer" className="project reveal">
                <div className="project__thumb">
                  <img className="project__shot" src="/projects/ownmdm.jpg" alt="ownMDM homepage" />
                </div>
                <div className="project__info">
                  <div>
                    <h3>ownMDM</h3>
                    <p>Self-hosted Mac management · Munki, admin console, self-service</p>
                  </div>
                  <span className="project__arrow"><Arrow /></span>
                </div>
              </a>
              <a href="https://foori.pk/" target="_blank" rel="noopener noreferrer" className="project reveal">
                <div className="project__thumb">
                  <img className="project__shot" src="/projects/foori.jpg" alt="Foori homepage" />
                </div>
                <div className="project__info">
                  <div>
                    <h3>Foori</h3>
                    <p>Multi-tenant food ordering · React, Next.js, Kafka</p>
                  </div>
                  <span className="project__arrow"><Arrow /></span>
                </div>
              </a>
              <a href="https://www.linkedin.com/company/alowaa" target="_blank" rel="noopener noreferrer" className="project reveal">
                <div className="project__thumb thumb--3">
                  <div className="mock">
                    <div className="mock__bar"><i /><i /><i /></div>
                    <div className="mock__body mock__body--split"><div><b /><b className="w60" /><b className="w40" /></div><div className="mock__img" /></div>
                  </div>
                </div>
                <div className="project__info">
                  <div>
                    <h3>Alowaa</h3>
                    <p>Events &amp; social platform · MERN, Stripe, Firebase</p>
                  </div>
                  <span className="project__arrow"><Arrow /></span>
                </div>
              </a>
            </div>
          </section>

          <section id="experience" className="section">
            <h2 className="display display--md reveal"><span>3 Years of</span> <span className="muted">Experience</span></h2>
            <div className="list">
              <a href="https://devsoul.net/" target="_blank" rel="noopener noreferrer" className="row reveal">
                <div className="row__main">
                  <h3>Full Stack Developer · Devsoul Technologies</h3>
                  <p>Lead developer on the company product. Designed the database layer, ran production on AWS EC2 with PM2 and Nginx, and shipped releases through GitHub Actions.</p>
                  <span className="row__site">devsoul.net</span>
                </div>
                <span className="row__date">Oct 2023 — Present</span>
              </a>
              <a href="https://ownmdm.com/" target="_blank" rel="noopener noreferrer" className="row reveal">
                <div className="row__main">
                  <h3>Full Stack Developer · ownMDM</h3>
                  <p>Self-hosted Mac management built on Munki: admin console, self-service app store, helpdesk, and device monitoring on a server you own.</p>
                  <span className="row__site">ownmdm.com</span>
                </div>
                <span className="row__date">Present</span>
              </a>
              <a href="https://foori.pk/" target="_blank" rel="noopener noreferrer" className="row reveal">
                <div className="row__main">
                  <h3>Full Stack Developer · Foori</h3>
                  <p>Multi-tenant food ordering with real-time sync on Sockets, Redis, and Kafka, plus a React and Next.js ordering experience.</p>
                  <span className="row__site">foori.pk</span>
                </div>
                <span className="row__date">Sep 2025 — Present</span>
              </a>
            </div>
          </section>

          <section id="tools" className="section">
            <h2 className="display display--md reveal"><span>Core</span> <span className="muted">Skills</span></h2>
            <div className="skill-groups">
              {SKILL_GROUPS.map((group) => (
                <div className="skill-group" key={group.title}>
                  <h3 className="skill-group__title reveal">{group.title}</h3>
                  <div className="tools">
                    {group.items.map((tool) => (
                      <div className="tool reveal" key={tool.name}>
                        <span className="tool__icon" style={{ "--c": tool.color }}>
                          <img
                            src={tool.src || `https://cdn.simpleicons.org/${tool.icon}`}
                            alt=""
                            loading="lazy"
                          />
                        </span>
                        <div>
                          <h3>{tool.name}</h3>
                          <p>{tool.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="education" className="section">
            <h2 className="display display--md reveal"><span>Education &amp;</span> <span className="muted">Awards</span></h2>
            <div className="list">
              <article className="post reveal">
                <h3>Bachelor&apos;s in Computer Science</h3>
                <p>University of the Punjab.</p>
                <span className="post__meta">2020 — 2024 · CGPA 3.22 / 4.00</span>
              </article>
              <article className="post reveal">
                <h3>Multi-Project Maestro</h3>
                <p>Recognized for running several projects at once while keeping code quality high and delivery timelines consistent.</p>
                <span className="post__meta">Award</span>
              </article>
            </div>
          </section>

          <section id="contact" className="section">
            <h2 className="display display--md reveal"><span>Let&apos;s work</span> <span className="muted">together</span></h2>
            <div className="contact__reach reveal">
              <a href="mailto:zainulislamzia@gmail.com">zainulislamzia@gmail.com</a>
              <a href="tel:+923126911405">+92 312 6911405</a>
            </div>
            <form className={`form reveal${sent ? " is-sent" : ""}`} onSubmit={onSubmit}>
              <div className="form__row">
                <label><span>Name</span><input name="name" type="text" placeholder="Your name" required /></label>
                <label><span>Email</span><input name="email" type="email" placeholder="you@company.com" required /></label>
              </div>
              <label><span>Message</span><textarea name="message" rows={5} placeholder="Tell me about your project" required /></label>
              <button type="submit" className="btn btn--primary btn--block">
                {sent ? "Thanks — opening your mail app " : "Send message"}
                <Arrow />
              </button>
            </form>
          </section>

          <footer className="footer">
            <span>© {year} Zain Ul Islam Zia</span>
            <a href="#home" className="footer__top">Back to top ↑</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
