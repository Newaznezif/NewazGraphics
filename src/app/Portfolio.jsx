'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Mail, ChevronRight, ArrowUpRight, Menu, X, Palette, FileText, User, Sparkles, Download } from 'lucide-react';
import data from '../data/portfolio.json';

/* ======================================
   CUSTOM ICONS
  ====================================== */
const LinkedInIcon = ({ size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ======================================
   SMART UTILITIES (Magnetic & Tilt)
 ====================================== */
const MagneticButton = ({ children, className, href, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {href ? (
        <a href={href} className={className}>{children}</a>
      ) : (
        <button onClick={onClick} className={className}>{children}</button>
      )}
    </motion.div>
  );
};

const TiltCard = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 20; // 20 deg max
    const yPct = (mouseY / height - 0.5) * -20;
    setRotateX(yPct);
    setRotateY(xPct);
  };

  const reset = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

/* ======================================
   NAVBAR
====================================== */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Work', href: '#work' },
    { label: 'Writing', href: '#writing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <a href="#" className="navbar-logo"><span>N</span>N.</a>
          <ul className="navbar-links">
            {links.map(l => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
            <li><a href="#contact" className="navbar-cta">Let's Talk</a></li>
          </ul>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
            >
              {links.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

/* ======================================
   HERO
====================================== */
const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 50;
    const y = (clientY / window.innerHeight - 0.5) * 50;
    setMousePos({ x, y });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      let contentHtml = `
        <div style="width: 800px; background: #ffffff; color: #000000;">
      `;
      
      data.projects.forEach((project, index) => {
        const imgUrl = window.location.origin + project.image;
        
        // Force a new page only after every two images
        const pageBreak = (index > 0 && index % 2 === 0) ? '<div class="html2pdf__page-break"></div>' : '';
        
        contentHtml += `
          ${pageBreak}
          <div style="page-break-inside: avoid; break-inside: avoid; padding: 20px 40px 30px 40px; text-align: center; box-sizing: border-box; width: 100%;">
            <img src="${imgUrl}" style="max-width: 100%; max-height: 400px; border-radius: 12px; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto; object-fit: contain;" crossorigin="anonymous" />
            <h2 style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; margin: 0; color: #111; padding-top: 10px;">${project.title}</h2>
          </div>
        `;
      });
      
      contentHtml += `
        </div>
      `;
      
      const opt = {
        margin:       0.5,
        filename:     'NewazNezif_SelectedWorks.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(contentHtml).save();
      
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const blobs = Array.from({ length: 6 });

  return (
    <section className="hero" onMouseMove={handleMouseMove}>
      {/* Dynamic Motion Graphic Background */}
      <div className="hero-motion-graphic">
        <div className="mesh-gradient" />
        {blobs.map((_, i) => (
          <motion.div
            key={i}
            className={`motion-blob blob-${i + 1}`}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              x: mousePos.x * (i + 1) * 0.1,
              y: mousePos.y * (i + 1) * 0.1,
            }}
          />
        ))}
        <div className="glass-noise-overlay" />
      </div>

      <div className="container hero-container">
        <motion.div
          className="hero-inner-3d"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-content-3d">
            <motion.div 
              className="hero-badge-smart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {data.profile.role}
            </motion.div>
            
            <h1 className="hero-title-super">
              <span className="name-layer">{data.profile.name.split(' ')[0]}</span>
              <span className="name-layer-accent">{data.profile.name.split(' ')[1]}</span>
            </h1>
            
            <p className="hero-bio-smart">
              {data.profile.bio}
            </p>
            
            <div className="hero-actions-super">
              <MagneticButton href="#work" className="btn-super-primary">
                Explore Work <ChevronRight size={20} />
              </MagneticButton>
              <MagneticButton href="#contact" className="btn-super-outline">
                Let&apos;s Connect
              </MagneticButton>
              <MagneticButton onClick={handleDownloadPDF} className="btn-super-outline">
                {isDownloading ? "Generating PDF..." : "Download Works"} <Download size={18} style={{ marginLeft: '8px' }} />
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hero-3d-footer">
        <div className="scroll-hint-3d">
          <div className="mouse-icon">
            <div className="wheel" />
          </div>
          <span>Discover</span>
        </div>
      </div>
    </section>
  );
};

/* ======================================
   CANVA EMBED
====================================== */
const CanvaEmbed = ({ url, title, image, isCard = false }) => {
  return (
    <div className={`canva-embed-wrap ${isCard ? 'is-card' : ''}`}>
      <div className="canva-visual-layer">
        <img 
          src={image}
          alt={title}
          className="canva-thumbnail"
          loading="lazy"
        />
        <div className="canva-glass-overlay" />
        <div className="canva-view-badge">
          <Palette size={14} />
          <span>Case Study</span>
        </div>
      </div>
    </div>
  );
};

/* ======================================
   PROJECT CARD + MODAL
====================================== */
const ProjectCard = ({ project }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TiltCard
        className="project-card"
        onClick={() => setOpen(true)}
      >
        <div className="project-image-wrap">
          {project.canva_link ? (
            <CanvaEmbed 
              url={project.canva_link} 
              title={project.title} 
              image={project.image} 
              isCard={true} 
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
            />
          )}
          <div className="project-overlay">
            <div className="project-overlay-icon">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>
        <div className="project-body">
          <span className="project-cat">{project.category}</span>
          <h3 className="project-title">{project.title}</h3>
          <p className="project-desc">{project.description}</p>
        </div>
      </TiltCard>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="modal-storytelling"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header-sticky">
                <div className="modal-header-inner">
                  <span className="modal-cat-badge">{project.category}</span>
                  <h2 className="modal-title-main">{project.title}</h2>
                  <button className="modal-close-btn" onClick={() => setOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="modal-content-story">
                <section className="modal-story-hero">
                  {project.canva_link
                    ? <CanvaEmbed url={project.canva_link} title={project.title} image={project.image} />
                    : <img src={project.image} alt={project.title} className="modal-hero-img" />
                  }
                </section>

                <div className="modal-story-grid">
                  <aside className="modal-story-sidebar">
                    <div className="sticky-sidebar-content">
                      <div className="meta-item">
                        <p className="meta-label">Role</p>
                        <p className="meta-value">{project.role}</p>
                      </div>
                      <div className="meta-item">
                        <p className="meta-label">Industry</p>
                        <p className="meta-value">{project.category}</p>
                      </div>
                      <div className="meta-item">
                        <p className="meta-label">Tools</p>
                        <div className="meta-tags">
                          {project.tools.map(t => <span key={t} className="tag-minimal">{t}</span>)}
                        </div>
                      </div>
                      <a href={project.canva_link} target="_blank" rel="noreferrer" className="btn-story-cta">
                        View Full Design <ExternalLink size={16} />
                      </a>
                    </div>
                  </aside>

                  <main className="modal-story-main">
                    <div className="story-block">
                      <h3>The Objective</h3>
                      <p>{project.description}</p>
                    </div>
                    <div className="story-block accent">
                      <h3>Impact & Outcome</h3>
                      <p>{project.outcome}</p>
                    </div>
                    <div className="story-image-placeholder">
                      <div className="live-preview-label">
                        <Sparkles size={16} /> Live Preview Ready
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ======================================
   WORK SECTION
====================================== */
const WorkSection = () => (
  <section id="work" className="section">
    <div className="container">
      <div className="work-header">
        <div>
          <span className="section-eyebrow">Portfolio</span>
          <h2 className="section-title">Selected<br /><em>Design Works</em></h2>
        </div>
      </div>
      <div className="portfolio-grid">
        {data.projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  </section>
);

/* ======================================
   WRITING SECTION
====================================== */
const WritingSection = () => (
  <section id="writing" className="section section-alt">
    {/* Analytical Motion Graphic Background */}
    <div className="writing-motion-bg">
      <div className="analytical-grid" />
      <motion.div 
        className="writing-blob"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="typo-pattern">JOURNALISM ANALYSIS REPORTING RESEARCH DATA JOURNALISM ANALYSIS REPORTING RESEARCH DATA</div>
    </div>

    <div className="container relative z-10">
      <div className="writing-header">
        <div>
          <span className="section-eyebrow">Journalism &amp; Analysis</span>
          <h2 className="section-title">Writing &amp;<br /><em>Reporting</em></h2>
        </div>
        <p className="writing-header-desc">
          Investigative pieces and editorial features focused on design, urbanism, and technology.
        </p>
      </div>

      <div className="writing-list">
        {data.writing.map((article, i) => (
          <motion.div
            key={article.id}
            className="writing-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="writing-left">
              <span className="writing-type">{article.type}</span>
              <h3 className="writing-title">{article.title}</h3>
              <p className="writing-excerpt">{article.excerpt}</p>
            </div>
            <div className="writing-right">
              <span className="writing-date">{article.date}</span>
              <a href={article.link} className="writing-arrow" aria-label="Read article">
                <ArrowUpRight size={22} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ======================================
   ABOUT SECTION
====================================== */
const AboutSection = () => (
  <section id="about" className="section section-about">
    {/* Magnetic Motion Graphic Background */}
    <div className="about-motion-bg">
      <motion.div 
        className="about-glow-1"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="about-glow-2"
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    <div className="container relative z-10">
      <div className="about-grid">
        {/* Experience */}
        <div>
          <h2 className="about-title">
            Building Narratives<br />Through <em>Visuals</em>
          </h2>
          <div className="exp-list">
            {data.profile.experience.map(exp => (
              <div key={exp.company} className="exp-item">
                <span className="exp-period">{exp.period}</span>
                <h4 className="exp-company">{exp.company}</h4>
                <p className="exp-role">{exp.role}</p>
                <p className="exp-desc">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="skills-grid">
          <div className="skill-card">
            <h3 className="skill-card-title">
              <Palette size={20} /> Design Expertise
            </h3>
            <div className="skill-tags">
              {data.profile.skills.design.map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="skill-card">
            <h3 className="skill-card-title">
              <FileText size={20} /> Writing & Reporting
            </h3>
            <div className="skill-tags">
              {data.profile.skills.writing.map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
            <div className="tools-divider">
              <span className="tools-label">Tech Stack</span>
              <div className="tools-list">
                {data.profile.skills.tools.map(t => (
                  <span key={t} className="tool-item">
                    <span className="tool-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ======================================
   CONTACT SECTION
====================================== */
const ContactSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setMousePos({ x: clientX - left, y: clientY - top });
  };

  return (
    <section id="contact" className="contact-section" onMouseMove={handleMouseMove}>
      {/* Smart Interactive Background */}
      <motion.div 
        className="contact-glow"
        animate={{
          left: mousePos.x,
          top: mousePos.y,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, restDelta: 0.001 }}
      />
      
      <div className="container">
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="contact-content text-center">
            <span className="contact-eyebrow">Let's Create</span>
            <h2 className="contact-title">Ready to<br /><em>Collaborate?</em></h2>
            <p className="contact-desc mx-auto">
              Whether you have a design project or an investigative piece in mind,
              let&apos;s build something that makes an impact.
            </p>
            <div className="contact-actions flex justify-center gap-6">
              <MagneticButton onClick={() => window.location.href = `mailto:${data.profile.email}`} className="btn-contact">
                <Mail size={22} /> Get in Touch
              </MagneticButton>
              <MagneticButton href={data.profile.linkedin} className="btn-social-premium">
                <LinkedInIcon size={28} />
              </MagneticButton>
            </div>
          </div>
          
          <div className="contact-footer-note">
            <span className="availability-dot" />
            Available for new opportunities
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ======================================
   FOOTER
====================================== */
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-inner">
        <p className="footer-copy">© 2024 {data.profile.name}. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
        <span className="footer-badge">Designed for Excellence</span>
      </div>
    </div>
  </footer>
);

/* ======================================
   PORTFOLIO (CLIENT ROOT)
====================================== */
export default function Portfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WorkSection />
        <WritingSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
