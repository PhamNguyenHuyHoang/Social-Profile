import { useState, type FormEvent } from 'react';
import { FileText, FolderKanban, Plus, Save, Trash2, Mail, LayoutDashboard, ExternalLink, PencilLine } from 'lucide-react';
import type { Project } from '../data/projects';
import type { Article } from '../data/articles';
import '../admin.css';

type TextStyle = { text: string; font: string; sizePt: number };
type HeadingStyle = { font: string; color: string; sizePt: number; bold: boolean; italic: boolean };
type SiteContent = { aboutTitle: string; skillsTitle: string; projectsTitle: string; blogTitle: string; contactTitle: string; headingStyles: Record<'about' | 'skills' | 'projects' | 'blog' | 'contact', HeadingStyle>; about: string; aboutFont: string; aboutFontSizePt: number; aboutPoints: TextStyle[]; skills: { title: string; description: string; items: string[] }[]; blogIntro: string; contactPhone: string; contactEmail: string; contactLocation: string; footerTagline: string };
type Section = 'dashboard' | 'projects' | 'articles' | 'contact';
type Props = { initialTab: string; projects: Project[]; articles: Article[]; siteContent: SiteContent; onSave: (projects: Project[], articles: Article[], siteContent: SiteContent) => void };
const sections: { id: Section; label: string; icon: typeof FileText }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'projects', label: 'Dự án', icon: FolderKanban },
  { id: 'articles', label: 'Bài viết', icon: FileText },
  { id: 'contact', label: 'Liên hệ', icon: Mail },
];
const wordSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
const fontFamilies = [
  'Inter', 'Arial', 'Arial Black', 'Arial Narrow', 'Bahnschrift', 'Book Antiqua', 'Bookman Old Style', 'Calibri',
  'Calibri Light', 'Cambria', 'Candara', 'Century', 'Century Gothic', 'Comic Sans MS', 'Consolas', 'Constantia',
  'Corbel', 'Courier New', 'Dubai', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Garamond',
  'Georgia', 'Helvetica', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee', 'Leelawadee UI', 'Lucida Console',
  'Lucida Sans Unicode', 'Malgun Gothic', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue',
  'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei',
  'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'Monotype Corsiva', 'MS Gothic', 'MS Reference Sans Serif',
  'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI',
  'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Tahoma',
  'Times New Roman', 'Trebuchet MS', 'Verdana', 'Yu Gothic', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
];
const fontOptions = fontFamilies.map(font => <option key={font} value={font}>{font}</option>);

export default function Admin({ initialTab, projects: initialProjects, articles: initialArticles, siteContent: initialContent, onSave }: Props) {
  const section: Section = sections.some(item => item.id === initialTab) ? initialTab as Section : 'dashboard';
  const [projects, setProjects] = useState(initialProjects);
  const [articles, setArticles] = useState(initialArticles);
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);
  const [fetchingProject, setFetchingProject] = useState<number | null>(null);
  const [projectFetchMessage, setProjectFetchMessage] = useState<Record<number, string>>({});
  const updateContent = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setContent(current => ({ ...current, [key]: value }));
  const updateProject = (id: number, field: keyof Project, value: string) => setProjects(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  const fetchProjectMetadata = async (project: Project) => {
    let url: URL;
    try {
      url = new URL(project.url ?? '');
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      setProjectFetchMessage(current => ({ ...current, [project.id]: 'Vui lòng nhập URL hợp lệ bắt đầu bằng http:// hoặc https://.' }));
      return;
    }
    setFetchingProject(project.id);
    setProjectFetchMessage(current => ({ ...current, [project.id]: '' }));
    try {
      const params = new URLSearchParams({
        url: url.toString(),
        screenshot: 'true',
        'data.galleryImage.selector': '[id*="gallery" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [class*="gallery" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [id*="album" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [class*="album" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [id*="library" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [class*="library" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [id*="portfolio" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [class*="portfolio" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [id*="project" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [class*="project" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [id*="media" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [class*="media" i] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i])',
        'data.galleryImage.attr': 'src',
        'data.galleryImage.type': 'image',
        'data.introImage.selector': '#about img:not([alt*="logo" i]):not([src*="logo" i]), #gioi-thieu img:not([alt*="logo" i]):not([src*="logo" i]), [id*="about"] img:not([alt*="logo" i]):not([src*="logo" i]), [id*="gioi-thieu"] img:not([alt*="logo" i]):not([src*="logo" i]), [id*="intro"] img:not([alt*="logo" i]):not([src*="logo" i]), [class*="about"] img:not([alt*="logo" i]):not([src*="logo" i]), [class*="gioi-thieu"] img:not([alt*="logo" i]):not([src*="logo" i]), [class*="intro"] img:not([alt*="logo" i]):not([src*="logo" i])',
        'data.introImage.attr': 'src',
        'data.introImage.type': 'image',
        'data.contentImage.selector': 'main img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), [role="main"] img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i]), article img:not([alt*="logo" i]):not([src*="logo" i]):not([class*="logo" i])',
        'data.contentImage.attr': 'src',
        'data.contentImage.type': 'image',
      });
      const response = await fetch(`https://api.microlink.io/?${params.toString()}`);
      const result = await response.json().catch(() => null) as {
        status?: string;
        code?: string;
        message?: string;
        data?: { title?: string; screenshot?: { url?: string }; galleryImage?: string | { url?: string }; introImage?: string | { url?: string }; contentImage?: string | { url?: string } };
      } | null;
      if (!response.ok || result?.status !== 'success' || !result.data) {
        const apiMessage = result?.message;
        if (result?.code === 'ERATE' || response.status === 429) {
          throw new Error('Dịch vụ lấy link đã hết lượt miễn phí hôm nay. Vui lòng thử lại sau khi lượt được làm mới.');
        }
        if (result?.code === 'EINVALDATA') {
          throw new Error('Dịch vụ từ chối tham số lấy ảnh (EINVALDATA). Vui lòng thử lại; nếu lỗi còn, nhập ảnh thủ công.');
        }
        if (result?.code === 'EFATALCLIENT' || !response.status) {
          throw new Error('Trình duyệt không kết nối được tới Microlink. Hãy kiểm tra mạng hoặc thử lại sau.');
        }
        throw new Error(apiMessage ? `Microlink báo lỗi ${result?.code ?? response.status}: ${apiMessage}` : `Microlink phản hồi HTTP ${response.status || 'không xác định'}. Hãy thử lại sau.`);
      }
      const galleryImageUrl = typeof result.data.galleryImage === 'string' ? result.data.galleryImage : result.data.galleryImage?.url;
      const introImageUrl = typeof result.data.introImage === 'string' ? result.data.introImage : result.data.introImage?.url;
      const contentImageUrl = typeof result.data.contentImage === 'string' ? result.data.contentImage : result.data.contentImage?.url;
      const resolveImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return '';
        try {
          const resolved = new URL(imageUrl, url);
          return ['http:', 'https:'].includes(resolved.protocol) ? resolved.href : '';
        } catch { return ''; }
      };
      const projectImage = resolveImageUrl(galleryImageUrl) || resolveImageUrl(introImageUrl) || resolveImageUrl(contentImageUrl) || result.data.screenshot?.url || '';
      setProjects(items => items.map(item => item.id === project.id ? {
        ...item,
        title: result.data?.title?.trim() || item.title,
        image: projectImage,
        previewFallback: result.data?.screenshot?.url || '',
        url: url.toString(),
      } : item));
      setProjectFetchMessage(current => ({ ...current, [project.id]: galleryImageUrl ? 'Đã lấy ảnh từ album, thư viện hoặc khu vực dự án của website.' : introImageUrl ? 'Không tìm thấy ảnh album; đã lấy ảnh trong phần Giới thiệu.' : contentImageUrl ? 'Đã lấy ảnh nội dung chính và bỏ qua logo.' : result.data?.screenshot?.url ? 'Không tìm thấy ảnh nội dung phù hợp; đã tạo ảnh chụp website làm ảnh dự án.' : 'Không tìm thấy ảnh phù hợp. Hãy nhập URL ảnh chính thủ công.' }));
    } catch (error) {
      setProjectFetchMessage(current => ({ ...current, [project.id]: error instanceof Error ? error.message : 'Không lấy được thông tin dự án.' }));
    } finally {
      setFetchingProject(null);
    }
  };
  const updateArticle = (id: number, field: keyof Article, value: string) => setArticles(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  const submit = (event: FormEvent) => { event.preventDefault(); onSave(projects, articles, content); setSaved(true); window.setTimeout(() => window.location.reload(), 150); };
  const field = (label: string, value: string, onChange: (value: string) => void, wide = false) => <label className={wide ? 'wide' : ''}>{label}<input value={value} onChange={event => onChange(event.target.value)}/></label>;
  const headingEditor = (key: keyof SiteContent['headingStyles']) => {
    const style = content.headingStyles[key];
    const update = (changes: Partial<HeadingStyle>) => updateContent('headingStyles', { ...content.headingStyles, [key]: { ...style, ...changes } });
    return <div className="heading-style-panel"><div className="heading-style-caption">ĐỊNH DẠNG TIÊU ĐỀ</div><div className="admin-fields heading-style-fields"><label>Font chữ<select value={style.font} onChange={e => update({ font: e.target.value })}>{fontOptions}</select></label><label>Màu sắc<input type="color" value={style.color} onChange={e => update({ color: e.target.value })}/></label><label>Cỡ chữ<select value={style.sizePt} onChange={e => update({ sizePt: Number(e.target.value) })}>{wordSizes.map(size => <option key={size} value={size}>{size} pt</option>)}</select></label><label className="admin-check"><input type="checkbox" checked={style.bold} onChange={e => update({ bold: e.target.checked })}/> In đậm</label><label className="admin-check"><input type="checkbox" checked={style.italic} onChange={e => update({ italic: e.target.checked })}/> Chữ nghiêng</label></div></div>;
  };
  const heading = sections.find(item => item.id === section)?.label;
  const description = section === 'dashboard'
    ? 'Tổng quan nội dung và truy cập nhanh các khu vực quản lý.'
    : `Chỉnh sửa riêng phần ${heading?.toLocaleLowerCase('vi')} trên portfolio của bạn.`;
  return <div className="admin-shell">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin"><span className="admin-brand-mark">H</span><span>hoang<span className="admin-brand-accent">profile</span><small>QUẢN TRỊ PORTFOLIO</small></span></a>
      <div className="admin-side-label">QUẢN LÝ NỘI DUNG</div>
      {sections.map(item => { const Icon = item.icon; const href = item.id === 'dashboard' ? '/admin' : `/admin/${item.id}`; return <a key={item.id} className={`admin-nav ${section === item.id ? 'selected' : ''}`} href={href} aria-current={section === item.id ? 'page' : undefined}><Icon size={17}/>{item.label}{item.id === 'projects' && <span>{projects.length}</span>}{item.id === 'articles' && <span>{articles.length}</span>}</a>; })}
      <div className="admin-sidebar-bottom"><span className="admin-status-dot"/> Đã lưu trên thiết bị này</div>
    </aside>
    <main className="admin-main"><header className="admin-topbar"><span>hoang-profile <b>/</b> {heading}</span><a href="/" className="admin-view-site"><ExternalLink size={15}/> Xem portfolio</a></header>
      <form className="admin-content" onSubmit={submit}><div className="admin-heading"><div><div className="admin-overline">QUẢN TRỊ WEBSITE</div><h1>{heading}</h1><p>{description}</p></div>{section !== 'dashboard' && <button className="admin-save" type="submit"><Save size={16}/>{saved ? 'Đã lưu' : 'Lưu thay đổi'}</button>}</div>
        {section === 'dashboard' && <>
          <div className="admin-dashboard-stats">
            <a className="admin-stat-card" href="/admin/projects"><span>DỰ ÁN</span><strong>{projects.length}</strong><small>Dự án trong portfolio</small></a>
            <a className="admin-stat-card" href="/admin/articles"><span>BÀI VIẾT</span><strong>{articles.length}</strong><small>Bài viết đang hiển thị</small></a>
            <a className="admin-stat-card" href="/admin/contact"><span>LIÊN HỆ</span><strong><Mail size={20}/></strong><small>{content.contactEmail}</small></a>
          </div>
          <section className="admin-dashboard-panel">
            <div className="admin-dashboard-panel-head"><div><h2>Quản lý nội dung</h2><p>Chọn khu vực bạn muốn cập nhật.</p></div></div>
            <div className="admin-dashboard-links">
              <a href="/admin/projects"><span className="admin-dashboard-icon"><FolderKanban size={19}/></span><span><strong>Dự án nổi bật</strong><small>Tiêu đề, mô tả, danh mục và ảnh</small></span><PencilLine size={16}/></a>
              <a href="/admin/articles"><span className="admin-dashboard-icon"><FileText size={19}/></span><span><strong>Blog / Bài viết</strong><small>Tiêu đề, danh mục và đường dẫn ảnh</small></span><PencilLine size={16}/></a>
              <a href="/admin/contact"><span className="admin-dashboard-icon"><Mail size={19}/></span><span><strong>Thông tin liên hệ</strong><small>Email, điện thoại và chân trang</small></span><PencilLine size={16}/></a>
            </div>
          </section>
          <div className="admin-dashboard-note"><span className="admin-status-dot"/> Nội dung được lưu trên thiết bị này và cập nhật lên portfolio sau khi lưu.</div>
        </>}
        {section === 'projects' && <><section className="admin-item"><div className="admin-item-head"><div className="admin-item-index">00</div><span>TIÊU ĐỀ MỤC</span></div><div className="admin-fields"><label>Tiêu đề chính<input value={content.projectsTitle} onChange={e => updateContent('projectsTitle', e.target.value)}/></label>{headingEditor('projects')}</div></section><div className="admin-toolbar"><div><strong>{projects.length}</strong> dự án</div><button type="button" className="admin-add" onClick={() => setProjects(items => [...items, { id: Date.now(), category: 'Thiết kế Website', title: 'Dự án mới', description: '', tags: [], image: '', url: '' }])}><Plus size={16}/> Thêm dự án</button></div><div className="admin-items">{projects.map((item, index) => <section className="admin-item" key={item.id}><div className="admin-item-head"><div className="admin-item-index">{String(index + 1).padStart(2, '0')}</div><span>DỰ ÁN</span><button type="button" className="admin-delete" aria-label="Xóa dự án" onClick={() => setProjects(items => items.filter(project => project.id !== item.id))}><Trash2 size={16}/></button></div><div className="admin-fields">{field('Link website dự án', item.url ?? '', value => updateProject(item.id, 'url', value), true)}<button type="button" className="admin-add project-fetch-button" disabled={fetchingProject === item.id} onClick={() => void fetchProjectMetadata(item)}>{fetchingProject === item.id ? 'Đang lấy thông tin…' : 'Lấy thông tin từ link'}</button>{projectFetchMessage[item.id] && <p className="project-fetch-message wide" role="status">{projectFetchMessage[item.id]}</p>}{field('Tên dự án', item.title, value => updateProject(item.id, 'title', value))}{field('Danh mục', item.category, value => updateProject(item.id, 'category', value))}{field('Đường dẫn ảnh', item.image, value => updateProject(item.id, 'image', value))}</div></section>)}</div></>}
        {section === 'articles' && <><section className="admin-item"><div className="admin-item-head"><div className="admin-item-index">00</div><span>TIÊU ĐỀ MỤC</span></div><div className="admin-fields"><label>Tiêu đề chính<input value={content.blogTitle} onChange={e => updateContent('blogTitle', e.target.value)}/></label>{headingEditor('blog')}</div></section><div className="admin-items"><section className="admin-item"><div className="admin-item-head"><div className="admin-item-index">01</div><span>GIỚI THIỆU BLOG</span></div><div className="admin-fields"><label className="wide">Mô tả phần Blog<textarea rows={3} value={content.blogIntro} onChange={e => updateContent('blogIntro', e.target.value)}/></label></div></section></div><div className="admin-toolbar"><div><strong>{articles.length}</strong> bài viết</div><button type="button" className="admin-add" onClick={() => setArticles(items => [...items, { id: Date.now(), title: 'Bài viết mới', category: 'Website & SEO', image: '' }])}><Plus size={16}/> Thêm bài viết</button></div><div className="admin-items">{articles.map((item, index) => <section className="admin-item" key={item.id}><div className="admin-item-head"><div className="admin-item-index">{String(index + 1).padStart(2, '0')}</div><span>BÀI VIẾT</span><button type="button" className="admin-delete" aria-label="Xóa bài viết" onClick={() => setArticles(items => items.filter(article => article.id !== item.id))}><Trash2 size={16}/></button></div><div className="admin-fields">{field('Tiêu đề', item.title, value => updateArticle(item.id, 'title', value), true)}{field('Danh mục', item.category, value => updateArticle(item.id, 'category', value))}{field('Đường dẫn ảnh', item.image, value => updateArticle(item.id, 'image', value))}</div></section>)}</div></>}
        {section === 'contact' && <div className="admin-items"><section className="admin-item"><div className="admin-item-head"><div className="admin-item-index">01</div><span>THÔNG TIN LIÊN HỆ VÀ CHÂN TRANG</span></div><div className="admin-fields">{field('Tiêu đề liên hệ', content.contactTitle, value => updateContent('contactTitle', value), true)}{headingEditor('contact')}{field('Số điện thoại', content.contactPhone, value => updateContent('contactPhone', value))}{field('Email', content.contactEmail, value => updateContent('contactEmail', value))}{field('Địa điểm / hình thức làm việc', content.contactLocation, value => updateContent('contactLocation', value), true)}{field('Mô tả ngắn chân trang', content.footerTagline, value => updateContent('footerTagline', value), true)}</div></section></div>}
        <div className="admin-footnote">Thay đổi được lưu trên trình duyệt này và xuất hiện trên trang portfolio sau khi lưu.</div>
      </form>
    </main>
  </div>;
}
