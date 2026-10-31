import { projects as initialProjects, type Project } from './data/projects';
import { articles as initialArticles, type Article } from './data/articles';

import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  PenTool,
  Sun,
  X,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import Admin from './components/Admin';
import SocialProfile from './social-profile/SocialProfile';

const loadContent = <T,>(key: string, fallback: T): T => {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch { return fallback; }
};
const loadProjects = () => loadContent<Project[]>('hoang-profile-projects', initialProjects).map(project => {
  const migrated = initialProjects.find(item => item.id === project.id);
  const legacyTitles = ['Chiến dịch truyền thông thương hiệu', 'Kế hoạch nội dung website', 'Website & SEO', 'Bộ nhận diện thương hiệu'];
  return legacyTitles.includes(project.title) && migrated ? migrated : project;
});
const loadArticles = () => loadContent<Article[]>('hoang-profile-articles', initialArticles).map(article => {
  const migrated = initialArticles.find(item => item.id === article.id);
  const legacyTitles = ['Website phục vụ Marketing: những điểm cần ưu tiên', 'SEO cơ bản: từ nghiên cứu từ khóa đến nội dung on-page', 'Lập kế hoạch nội dung cho website', 'Thông điệp thương hiệu nhất quán trên các kênh'];
  return legacyTitles.includes(article.title) && migrated ? migrated : article;
});

const skills = [
  {
    title: 'Thiết kế Website',
    description: 'Thiết kế website chuyên nghiệp, cá nhân hóa, tối ưu chuyển đổi, thân thiện trên di động, tải nhanh và bảo mật.',
    items: ['Responsive Design', 'Tối ưu SEO chuẩn', 'Tốc độ tải nhanh', 'Bảo mật cao cấp'],
  },
  {
    title: 'SEO Marketing',
    description: 'Tối ưu khả năng hiển thị trên Google để website tiếp cận khách hàng tiềm năng từ nhu cầu tìm kiếm.',
    items: ['Nghiên cứu từ khóa', 'Tối ưu SEO On-page', 'Link Building chất lượng', 'Theo dõi và báo cáo chi tiết'],
  },
];
const defaultSiteContent = {
  aboutLabel: 'Về tôi', aboutTitle: 'Giới thiệu về tôi',
  skillsLabel: 'Kỹ năng', skillsTitle: 'Kỹ năng chuyên môn',
  projectsLabel: 'Dự án nổi bật', projectsTitle: 'Dự án Website & SEO',
  blogLabel: 'Blog', blogTitle: 'Kiến thức Website & SEO', contactTitle: 'Liên hệ',
  headingStyles: {
    about: { font: 'Inter', color: '#202b3a', sizePt: 14, bold: true, italic: false },
    skills: { font: 'Inter', color: '#202b3a', sizePt: 14, bold: true, italic: false },
    projects: { font: 'Inter', color: '#202b3a', sizePt: 14, bold: true, italic: false },
    blog: { font: 'Inter', color: '#202b3a', sizePt: 14, bold: true, italic: false },
    contact: { font: 'Inter', color: '#202b3a', sizePt: 10, bold: true, italic: false },
  },
  about: 'Mình là Phạm Nguyễn Huy Hoàng, tập trung vào thiết kế website và SEO. Mình hướng đến những website chuyên nghiệp, dễ sử dụng, hiển thị tốt trên thiết bị di động và có cấu trúc thuận lợi cho công cụ tìm kiếm.',
  aboutFont: 'Inter', aboutFontSizePt: 11,
  aboutPoints: [
    { text: 'Thiết kế website thân thiện với người dùng', font: 'Inter', sizePt: 12 },
    { text: 'SEO và tối ưu nội dung tìm kiếm', font: 'Inter', sizePt: 12 },
  ],
  skills,
  blogIntro: 'Chia sẻ kinh nghiệm về thiết kế website, tối ưu trải nghiệm trên di động và cải thiện khả năng hiển thị trên Google.',
  contactPhone: '0383 246 740', contactEmail: 'huyhoangpn.nasani@gmail.com', contactLocation: 'Việt Nam · Làm việc từ xa',
  footerTagline: 'Bạn đang cần website chuyên nghiệp hoặc muốn cải thiện SEO? Hãy liên hệ để cùng trao đổi hướng phù hợp.',
};

const loadSiteContent = () => {
  const saved = loadContent<Partial<typeof defaultSiteContent> & { aboutFontSize?: number; aboutFontSizeCm?: number }>('hoang-profile-site-content', {});
  const savedSkills = ((saved.skills ?? defaultSiteContent.skills) as Array<{ title: string; description: string; items?: string[]; detail?: string }>)
    .filter(skill => ['Thiết kế Website', 'SEO Marketing'].includes(skill.title))
    .map(skill => {
      const items = skill.items ?? (skill.detail ? skill.detail.split('·').map(item => item.trim()) : []);
      if (skill.title === 'Thiết kế Website' && (skill.description === 'Website chuyên nghiệp, tối ưu chuyển đổi, thân thiện trên di động, tải nhanh và bảo mật.' || items.includes('Bảo mật website'))) return skills[0];
      if (skill.title === 'SEO Marketing' && (skill.description === 'Tối ưu khả năng hiển thị trên Google và thu hút khách hàng tiềm năng qua tìm kiếm.' || items.includes('Theo dõi và báo cáo hiệu quả'))) return skills[1];
      return { title: skill.title, description: skill.description, items };
    });
  return {
    ...defaultSiteContent,
    ...saved,
    skillsTitle: /marketing đa kênh|marketing và thương hiệu|thiết kế website\s*&\s*seo marketing/i.test(saved.skillsTitle ?? '') ? defaultSiteContent.skillsTitle : saved.skillsTitle ?? defaultSiteContent.skillsTitle,
    projectsTitle: ['Một số dự án tiêu biểu', 'Website và SEO tiêu biểu'].includes(saved.projectsTitle ?? '') ? defaultSiteContent.projectsTitle : saved.projectsTitle ?? defaultSiteContent.projectsTitle,
    blogTitle: ['Chủ đề mình chia sẻ', 'Chia sẻ về Website & SEO'].includes(saved.blogTitle ?? '') ? defaultSiteContent.blogTitle : saved.blogTitle ?? defaultSiteContent.blogTitle,
    aboutFontSizePt: saved.aboutFontSizePt && saved.aboutFontSizePt > 10 && saved.aboutFontSizePt <= 24 ? saved.aboutFontSizePt : (saved.aboutFontSizeCm ? defaultSiteContent.aboutFontSizePt : saved.aboutFontSize ? Math.min(24, Math.max(8, Math.round(saved.aboutFontSize * 0.75))) : defaultSiteContent.aboutFontSizePt),
    skills: savedSkills.length ? savedSkills : skills,
    about: defaultSiteContent.about,
    aboutPoints: defaultSiteContent.aboutPoints,
    blogIntro: !saved.blogIntro || saved.blogIntro === 'Chia sẻ kiến thức thực tế về thiết kế website, trải nghiệm người dùng và tối ưu SEO.' || /xây dựng thương hiệu|nội dung số/i.test(saved.blogIntro) ? defaultSiteContent.blogIntro : saved.blogIntro,
    footerTagline: /marketing thực tế|phát triển bền vững|thiết kế website chỉn chu/i.test(saved.footerTagline ?? '') ? defaultSiteContent.footerTagline : saved.footerTagline ?? defaultSiteContent.footerTagline,
  };
};

function App() {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [articles, setArticles] = useState<Article[]>(loadArticles);
  const [siteContent, setSiteContent] = useState(loadSiteContent);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem('portfolio-theme') === 'dark',
  );

  useEffect(() => {
    const syncPortfolioContent = (event: StorageEvent) => {
      if (event.key === 'hoang-profile-projects' || event.key === 'hoang-profile-articles' || event.key === 'hoang-profile-site-content') {
        window.location.reload();
      }
    };
    window.addEventListener('storage', syncPortfolioContent);
    return () => window.removeEventListener('storage', syncPortfolioContent);
  }, []);

  const adminPath = window.location.pathname.replace(/\/$/, '') || '/';
  if (adminPath === '/social-profile' || (import.meta.env.PROD && adminPath === '/')) return <SocialProfile />;
  if (adminPath.startsWith('/admin')) {
    const adminSection = adminPath.split('/')[2] || 'dashboard';
    return <Admin initialTab={adminSection} projects={projects} articles={articles} siteContent={siteContent} onSave={(nextProjects, nextArticles, nextSiteContent) => {
      setProjects(nextProjects);
      setArticles(nextArticles);
      window.localStorage.setItem('hoang-profile-projects', JSON.stringify(nextProjects));
      window.localStorage.setItem('hoang-profile-articles', JSON.stringify(nextArticles));
      setSiteContent(current => ({ ...current, ...nextSiteContent }));
      window.localStorage.setItem('hoang-profile-site-content', JSON.stringify(nextSiteContent));
    }} />;
  }

  const closeMenu = () => setMenuOpen(false);
  const navigateTo = (section: string) => {
    setActiveSection(section);
    closeMenu();
  };

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 12);
      setShowBackToTop(window.scrollY > 420);
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);

      const activationPoint = window.innerHeight * 0.36;
      const sectionIds = ['home', 'about', 'projects', 'blog', 'contact'];
      const currentSection = sectionIds
        .map((id) => document.getElementById(id))
        .find((section) => {
          if (!section) return false;
          const bounds = section.getBoundingClientRect();
          return bounds.top <= activationPoint && bounds.bottom > activationPoint;
        });
      if (currentSection) setActiveSection(currentSection.id);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.scroll-reveal, .blog-reveal, .fade-reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app" data-theme={isDark ? 'dark' : 'light'}>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-wrapper">
          <a href="#home" className="brand" onClick={closeMenu}>
            <BrandMark />
            <span className="brand-name">Huy Hoàng</span>
          </a>

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            <a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={() => navigateTo('home')}>
              Trang chủ
            </a>
            <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={() => navigateTo('about')}>
              Giới thiệu
            </a>
            <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={() => navigateTo('projects')}>
              Dự án
            </a>
            <a href="#blog" className={activeSection === 'blog' ? 'active' : ''} onClick={() => navigateTo('blog')}>
              Blog
            </a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={() => navigateTo('contact')}>
              Liên hệ
            </a>
          </nav>

          <div className="nav-actions">
            <button
              className="icon-button"
              aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              aria-pressed={isDark}
              onClick={() => setIsDark((current) => !current)}
            >
              {isDark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.7} />}
            </button>
            <a href="#contact" className="header-contact">
              Liên hệ
              <ArrowUpRight size={14} />
            </a>
            <button
              className="mobile-menu-button"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-floating-shapes" aria-hidden="true">
            <span className="floating-shape floating-ring" />
            <span className="floating-shape floating-orbit" />
            <span className="floating-shape floating-square" />
            <span className="floating-shape floating-dot" />
            <span className="floating-shape floating-line" />
          </div>
          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow hero-text-reveal hero-delay-1">
                THIẾT KẾ WEBSITE & SEO <span>✦</span>
              </p>

              <h1 className="hero-text-reveal hero-delay-2">
                Tôi là <span>Huy Hoàng</span>
              </h1>

              <h2 className="hero-text-reveal hero-delay-3">Giúp khách hàng tìm thấy bạn qua Website & Google</h2>

              <p className="hero-description hero-text-reveal hero-delay-4">
                Website chuyên nghiệp, thân thiện trên di động và được tối ưu SEO để khách hàng dễ tìm hiểu dịch vụ, liên hệ với bạn.
              </p>

              <div className="hero-actions hero-text-reveal hero-delay-5">
                <a href="#projects" className="button button-primary">
                  Xem dự án
                  <ArrowRight size={17} />
                </a>

                <a href="#contact" className="button button-outline">
                  Liên hệ
                  <ArrowUpRight size={16} />
                </a>
              </div>

            </div>

            <div
              className="hero-visual"
              onMouseMove={(event) => {
                if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                event.currentTarget.style.setProperty('--parallax-x', `${x * -8}px`);
                event.currentTarget.style.setProperty('--parallax-y', `${y * -8}px`);
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.removeProperty('--parallax-x');
                event.currentTarget.style.removeProperty('--parallax-y');
              }}
            >
              <div className="hero-photo-wrapper">
                <img
                  src="/images/hoang-avatar.jpg"
                  alt="Phạm Nguyễn Huy Hoàng - Thiết kế Website và SEO"
                  className="hero-photo"
                />

                <div className="hero-photo-overlay">
                  <span>Website</span>
                  <span>SEO</span>
                  <span>Responsive</span>
                </div>

              </div>
            </div>
          </div>

          <div className="hero-scroll">
            <ChevronDown size={16} />
          </div>
        </section>

        <div className="container">
          <div className="top-sections">
            <section id="about" className="content-card about-card scroll-reveal">
              <SectionHeader title={siteContent.aboutTitle} headingStyle={siteContent.headingStyles.about} isDark={isDark} />

              <div className="about-content">
                <div className="about-text">
                  <p style={{ fontFamily: siteContent.aboutFont, fontSize: `${siteContent.aboutFontSizePt}pt` }}>
                    {siteContent.about}
                  </p>

                  <ul className="check-list">
                    {siteContent.aboutPoints.map((point, index) => <li key={`${index}-${point.text}`} style={{ fontFamily: point.font, fontSize: `${point.sizePt}pt` }}><CheckCircle2 size={14} />{point.text}</li>)}
                  </ul>

                </div>

                <div className="profile-illustration">
                  <img
                    src="/images/huyhoang.jpg"
                    alt="Ảnh đại diện của Hoàng"
                    className="about-photo"
                  />

                </div>
              </div>
            </section>

          </div>

          <div className="bottom-sections">
            <section id="projects" className="content-card projects-card scroll-reveal">
              <SectionHeader
                title={siteContent.projectsTitle}
                headingStyle={siteContent.headingStyles.projects}
                isDark={isDark}
                action="Trao đổi dự án"
                href="#contact"
              />

              <div className="projects-grid">
                {projects.map((project) => (
                  <article className="project-card scroll-reveal" key={project.title}>
                    <div className={`project-image ${project.imageClass}`}>
                      {project.image ? <img className="project-thumbnail" src={project.image} alt={`Ảnh đại diện dự án ${project.title}`} loading="lazy" onError={event => {
                        const image = event.currentTarget;
                        if (project.previewFallback && image.src !== project.previewFallback) image.src = project.previewFallback;
                        else image.style.display = 'none';
                      }} /> : <>
                        <div className="mock-window">
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="mock-content">
                          <div className="mock-content-line" />
                          <div className="mock-content-line short" />
                          <div className="mock-content-blocks"><span /><span /><span /></div>
                        </div>
                      </>}
                      <div className="project-image-overlay" aria-hidden="true">
                        <span>{project.category}</span>
                        <strong>{project.title}</strong>
                      </div>
                    </div>

                    <div className="project-body">
                      <span className="project-category">{project.category}</span>
                      <h3>{project.title}</h3>
                      
                      {project.url && <a className="project-visit-link" href={project.url} target="_blank" rel="noopener noreferrer">Xem dự án <ArrowUpRight size={14} /></a>}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="blog" className="content-card blog-card scroll-reveal">
              <SectionHeader
                title={siteContent.blogTitle}
                headingStyle={siteContent.headingStyles.blog}
                isDark={isDark}
              />

              <p className="blog-intro">
                {siteContent.blogIntro}
              </p>

              <div className="article-list">
                {articles.map((article) => (
                  <article className="article-item blog-reveal" key={article.title}>
                    <div className={`article-thumb article-thumb-${article.id} ${article.imageClass ?? ''}`}>
                      <PenTool size={14} />
                    </div>
                    <div className="article-info">
                      <h3>{article.title}</h3>
                      <span>{article.category}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer id="contact" className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand fade-reveal">
            <a href="#home" className="brand">
              <BrandMark />
              <span className="brand-name">Huy Hoàng</span>
            </a>
            <p>{siteContent.footerTagline}</p>
          </div>

          <div className="footer-link-column fade-reveal">
            <h3>Dịch vụ</h3>
            <a href="#projects">Thiết kế Website</a>
            <a href="#projects">SEO Marketing</a>
          </div>

          <div className="footer-link-column fade-reveal">
            <h3>Khám phá</h3>
            <a href="#about">Giới thiệu</a>
            <a href="#projects">Dự án</a>
            <a href="#blog">Bài viết</a>
          </div>

          <div className="footer-link-column footer-contact-column fade-reveal">
            <h3 style={{ fontFamily: siteContent.headingStyles.contact.font, color: isDark ? '#f1f6ff' : siteContent.headingStyles.contact.color, fontSize: `${siteContent.headingStyles.contact.sizePt}pt`, fontWeight: siteContent.headingStyles.contact.bold ? 700 : 400, fontStyle: siteContent.headingStyles.contact.italic ? 'italic' : 'normal' }}>{siteContent.contactTitle}</h3>
            <a href={`tel:${siteContent.contactPhone.replace(/\s/g, '')}`}><Phone size={14} />{siteContent.contactPhone}</a>
            <a href={`mailto:${siteContent.contactEmail}`}><Mail size={14} />{siteContent.contactEmail}</a>
            <p><MapPin size={14} />{siteContent.contactLocation}</p>
          </div>
        </div>

        <div className="container footer-bottom fade-reveal">
          <p>© 2026 Phạm Nguyễn Huy Hoàng. All rights reserved.</p>
        </div>
      </footer>
      <a
        href="#home"
        className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        aria-label="Cuộn lên đầu trang"
        tabIndex={showBackToTop ? 0 : -1}
      >
        <ArrowUp size={19} />
      </a>
    </div>
  );
}

function SectionHeader({
  title,
  headingStyle,
  isDark,
  action,
  href,
}: {
  title: string;
  headingStyle: { font: string; color: string; sizePt: number; bold: boolean; italic: boolean };
  isDark: boolean;
  action?: string;
  href?: string;
}) {
  return (
    <div className="section-header">
      <div>
        <h2 style={{ fontFamily: headingStyle.font, color: isDark ? '#f1f6ff' : headingStyle.color, fontSize: `${headingStyle.sizePt}pt`, fontWeight: headingStyle.bold ? 700 : 400, fontStyle: headingStyle.italic ? 'italic' : 'normal' }}>{title}</h2>
      </div>

      {action && href && (
        <a href={href} className="section-action">
          {action}
          <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  );
}

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path className="brand-hex" d="M24 2.8 42.2 13.3v21.4L24 45.2 5.8 34.7V13.3L24 2.8Z" />
      <path className="brand-circuit-outer" d="m6 15 5 2.8m31-2.8L37 17.8M6 33l5-2.8m31 2.8L37 30.2" />
      <path className="brand-circuit" d="M24 5.5v7h-7l-3 3m10-3h7l3 3M24 42.5v-7h-7l-3-3m10 3h7l3-3" />
      <path
        className="brand-monogram"
        d="M12 18v13m0-6.5h8m0-6.5v13m8-13v13m0-6.5h8m0-6.5v13M24 15v18"
      />
      <circle className="brand-node" cx="24" cy="4" r="1.8" />
      <circle className="brand-node" cx="24" cy="44" r="1.8" />
      <circle className="brand-node" cx="14" cy="15.5" r="1.5" />
      <circle className="brand-node" cx="34" cy="15.5" r="1.5" />
      <circle className="brand-node" cx="14" cy="32.5" r="1.5" />
      <circle className="brand-node" cx="34" cy="32.5" r="1.5" />
      <circle className="brand-terminal" cx="5.5" cy="15" r="1" />
      <circle className="brand-terminal" cx="42.5" cy="15" r="1" />
      <circle className="brand-terminal" cx="5.5" cy="33" r="1" />
      <circle className="brand-terminal" cx="42.5" cy="33" r="1" />
    </svg>
  );
}

export default App;
