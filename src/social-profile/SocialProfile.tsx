import { useRef } from 'react';
import { Music2 } from 'lucide-react';
import avatar from '../../social-profile/assets/huy-hoang-avatar.png';
import ElectricBackground from './ElectricBackground';
import LightningCanvas, { type LightningTrigger } from './LightningCanvas';
import './social-profile.css';

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/huyhoang2801/', mark: <span className="facebook-mark">f</span>, handle: '@huyhoang2801', kind: 'facebook' },
  { name: 'Instagram', href: 'https://www.instagram.com/huyhoang2801/', mark: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3.3" y="3.3" width="17.4" height="17.4" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.7" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>, handle: '@huyhoang2801', kind: 'instagram' },
  { name: 'Discord', href: 'https://discord.com/users/566281278987567121', mark: <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true"><path d="M19.55 5.15A18 18 0 0 0 15.1 3.8l-.58 1.18a16.6 16.6 0 0 0-5.04 0L8.9 3.8a18 18 0 0 0-4.45 1.35C1.64 9.31.88 13.4 1.26 17.43a18 18 0 0 0 5.45 2.76l1.18-1.92-1.86-.9.45-.34a12.9 12.9 0 0 0 11.04 0l.45.34-1.86.9 1.18 1.92a18 18 0 0 0 5.45-2.76c.46-4.66-.79-8.7-3.19-12.28ZM8.55 14.8c-1 0-1.82-.9-1.82-2s.8-2 1.82-2 1.84.9 1.82 2c0 1.1-.8 2-1.82 2Zm6.9 0c-1 0-1.82-.9-1.82-2s.8-2 1.82-2 1.83.9 1.82 2c0 1.1-.8 2-1.82 2Z"/></svg>, handle: 'Hồ sơ Discord', kind: 'discord' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@huyhoang_2801', mark: <Music2 size={20} strokeWidth={2} />, handle: '@huyhoang_2801', kind: 'tiktok' },
];

function SocialProfile() {
  const triggerId = useRef(0);

  const strike = (x: number, y: number, kind: LightningTrigger['kind']) => {
    triggerId.current += 1;
    window.dispatchEvent(new CustomEvent<LightningTrigger>('profile-lightning', {
      detail: { x, y, kind, id: triggerId.current },
    }));
  };

  return (
    <main className="social-page" onPointerDown={(event) => strike(event.clientX, event.clientY, 'click')}>
      <div className="social-grain" aria-hidden="true" />
      <div className="synth-background" aria-hidden="true" />
      <ElectricBackground />
      <LightningCanvas />

      <section className="social-card" aria-labelledby="social-title">
        <div className="social-avatar-frame">
          <img src={avatar} alt="Ảnh đại diện của Huy Hoàng" />
        </div>
        <h1 id="social-title">Huy Hoàng</h1>

        <nav className="social-links" aria-label="Các nền tảng mạng xã hội">
          {socialLinks.map((link) => (
            <a className="social-link" href={link.href} target="_blank" rel="noreferrer" key={link.name} aria-label={`Mở ${link.name}: ${link.handle}`} title={link.name}>
              <span className={`social-icon ${link.kind}`} aria-hidden="true">{link.mark}</span>
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}

export default SocialProfile;
