import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  speed: number;
  star: boolean;
  life?: number;
  maxLife?: number;
};
type BoltPath = { points: Point[]; delay: number; branch: boolean };
type LightningStrike = { paths: BoltPath[]; born: number; life: number; strength: number };

const random = (min: number, max: number) => min + Math.random() * (max - min);

function ElectricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    let frame = 0;
    let frameTimer: number | null = null;
    let lastFrame = 0;
    let disposed = false;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let previousPointer: { x: number; y: number; time: number } | null = null;
    let lastPointerBurst = 0;
    const strikes: LightningStrike[] = [];
    let nextStrike = performance.now() + 220;

    // Midpoint displacement gives the bolt a sharp, irregular path at several scales.
    const jaggedPath = (start: Point, end: Point, spread: number) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const normalX = -dy / length;
      const normalY = dx / length;
      const depth = Math.max(4, Math.min(7, Math.ceil(Math.log2(length / 7))));
      const split = (from: Point, to: Point, roughness: number, level: number): Point[] => {
        if (level <= 0) return [from, to];
        const displacement = (Math.random() - .5) * roughness;
        const middle = {
          x: (from.x + to.x) / 2 + normalX * displacement,
          y: (from.y + to.y) / 2 + normalY * displacement,
        };
        const left = split(from, middle, roughness * .55, level - 1);
        const right = split(middle, to, roughness * .55, level - 1);
        return [...left.slice(0, -1), ...right];
      };
      return split(start, end, spread, depth);
    };

    const createStrike = (now: number) => {
      const paths: BoltPath[] = [];
      const trunkCount = Math.random() > .62 ? 3 : 2;
      const firstSide = Math.floor(Math.random() * 4);
      for (let boltIndex = 0; boltIndex < trunkCount; boltIndex += 1) {
        const side = (firstSide + boltIndex) % 4;
        const insetX = width * random(.4, .66);
        const insetY = height * random(.4, .66);
        let origin: Point;
        let end: Point;
        // Each burst can send long bolts from different edges across the scene.
        if (side === 0) {
          origin = { x: random(-12, 0), y: random(height * .08, height * .92) };
          end = { x: insetX, y: origin.y + random(-height * .32, height * .32) };
        } else if (side === 1) {
          origin = { x: width + random(0, 12), y: random(height * .08, height * .92) };
          end = { x: width - insetX, y: origin.y + random(-height * .32, height * .32) };
        } else if (side === 2) {
          origin = { x: random(width * .06, width * .94), y: -10 };
          end = { x: origin.x + random(-width * .36, width * .36), y: insetY };
        } else {
          origin = { x: random(width * .06, width * .94), y: height + 10 };
          end = { x: origin.x + random(-width * .36, width * .36), y: height - insetY };
        }
        end.x = Math.max(width * .04, Math.min(width * .96, end.x));
        end.y = Math.max(height * .04, Math.min(height * .96, end.y));
        const length = Math.hypot(end.x - origin.x, end.y - origin.y);
        const trunk = jaggedPath(origin, end, Math.min(68, length * .085));
        paths.push({ points: trunk, delay: boltIndex * random(12, 34), branch: false });

        // Side forks split off from every trunk and taper into smaller forks.
        const branchCount = Math.round(random(6, 9));
        for (let i = 0; i < branchCount; i += 1) {
          const anchorIndex = 3 + Math.floor(Math.random() * Math.max(1, trunk.length - 6));
          const anchor = trunk[anchorIndex];
          const next = trunk[Math.min(trunk.length - 1, anchorIndex + 1)];
          const angle = Math.atan2(next.y - anchor.y, next.x - anchor.x)
            + (Math.random() < .5 ? -1 : 1) * random(.72, 1.22);
          const branchLength = length * random(.055, .17);
          const tip = { x: anchor.x + Math.cos(angle) * branchLength, y: anchor.y + Math.sin(angle) * branchLength };
          const branch = jaggedPath(anchor, tip, branchLength * .24);
          paths.push({ points: branch, delay: random(24, 86), branch: true });

          if (Math.random() > .62 && branch.length > 4) {
            const joint = branch[Math.max(2, branch.length - 3)];
            const forkAngle = angle + (Math.random() < .5 ? -1 : 1) * random(.58, 1.05);
            const forkLength = branchLength * random(.3, .55);
            const forkTip = { x: joint.x + Math.cos(forkAngle) * forkLength, y: joint.y + Math.sin(forkAngle) * forkLength };
            paths.push({ points: jaggedPath(joint, forkTip, forkLength * .23), delay: random(55, 125), branch: true });
          }
        }
      }

      strikes.push({ paths, born: now, life: random(540, 720), strength: random(.92, 1) });
      if (strikes.length > 5) strikes.splice(0, strikes.length - 5);
      nextStrike = now + random(420, 920);
      // A real strike often has a close secondary return stroke.
      if (Math.random() > .57) nextStrike = now + random(95, 180);
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1 : 1.15);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const amount = Math.min(1350, Math.max(520, Math.round(width * height / 850)));
      particles = Array.from({ length: amount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: random(-2.2, 2.2),
        vy: random(-3.4, -.45),
        radius: random(.45, 1.45),
        phase: random(0, Math.PI * 2),
        speed: random(.5, 1.7),
        star: Math.random() > .93,
      }));
    };

    const addCursorStars = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const now = performance.now();
      const previous = previousPointer;
      previousPointer = { x: event.clientX, y: event.clientY, time: now };
      if (!previous || now - previous.time > 180 || now - lastPointerBurst < 30) return;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 2) return;
      const directionX = dx / distance;
      const directionY = dy / distance;
      const burst = Math.min(6, Math.max(3, Math.round(distance / 9)));
      lastPointerBurst = now;
      for (let i = 0; i < burst; i += 1) {
        const speed = random(55, 135);
        particles.push({
          x: event.clientX + random(-6, 6), y: event.clientY + random(-6, 6),
          vx: directionX * speed + random(-55, 55), vy: directionY * speed + random(-55, 55),
          radius: random(.85, 1.9), phase: random(0, Math.PI * 2), speed: random(1, 2.8),
          star: Math.random() > .35, life: random(.65, 1.25), maxLife: 1.25,
        });
      }
      if (particles.length > 1800) particles.splice(0, particles.length - 1800);
    };

    const drawStar = (particle: Particle, alpha: number) => {
      const size = particle.radius * 4.1;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#f1fbff';
      ctx.shadowColor = '#40baff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, -size); ctx.lineTo(size * .2, -size * .2); ctx.lineTo(size, 0);
      ctx.lineTo(size * .2, size * .2); ctx.lineTo(0, size); ctx.lineTo(-size * .2, size * .2);
      ctx.lineTo(-size, 0); ctx.lineTo(-size * .2, -size * .2); ctx.closePath(); ctx.fill();
      ctx.restore();
    };

    const drawBoltPath = (path: BoltPath, elapsed: number, alpha: number) => {
      const points = path.points;
      const growth = Math.max(0, Math.min(1, (elapsed - path.delay) / (path.branch ? 68 : 104)));
      if (growth <= 0 || points.length < 2) return;
      const visibleSegments = Math.max(1, Math.floor((points.length - 1) * growth));
      const drawLine = (color: string, lineWidth: number, opacity: number, blur: number) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i <= visibleSegments; i += 1) ctx.lineTo(points[i].x, points[i].y);
        if (visibleSegments < points.length - 1) {
          const fraction = (points.length - 1) * growth - visibleSegments;
          const from = points[visibleSegments];
          const to = points[visibleSegments + 1];
          ctx.lineTo(from.x + (to.x - from.x) * fraction, from.y + (to.y - from.y) * fraction);
        }
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#168cff';
        ctx.shadowBlur = blur;
        ctx.stroke();
        ctx.restore();
      };
      const widthScale = path.branch ? .52 : 1;
      drawLine('#168dff', 7.4 * widthScale, alpha * .62, path.branch ? 0 : 8);
      drawLine('#58baff', 3.6 * widthScale, alpha * .82, path.branch ? 0 : 3);
      drawLine('#f4fbff', 1.8 * widthScale, alpha, 0);
    };

    const scheduleNextFrame = () => {
      if (disposed || document.hidden || frameTimer !== null || frame) return;
      frameTimer = window.setTimeout(() => {
        frameTimer = null;
        frame = window.requestAnimationFrame(draw);
      }, 33);
    };

    const draw = (now: number) => {
      frame = 0;
      if (disposed || document.hidden) { frame = 0; return; }
      const delta = lastFrame ? Math.min(.05, (now - lastFrame) / 1000) : 1 / 30;
      lastFrame = now;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        if (particle.life !== undefined) {
          particle.life -= delta;
          if (particle.life <= 0) { particles.splice(i, 1); continue; }
        }
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        if (particle.life === undefined) {
          if (particle.x < -4) particle.x = width + 4;
          if (particle.x > width + 4) particle.x = -4;
          if (particle.y < -5) particle.y = height + 5;
          if (particle.y > height + 5) particle.y = -5;
        }
        const twinkle = .2 + (Math.sin(now * .001 * particle.speed + particle.phase) + 1) * .3;
        const fade = particle.life === undefined ? 1 : Math.min(1, particle.life / ((particle.maxLife ?? 1) * .35));
        if (particle.star) drawStar(particle, twinkle * fade);
        else {
          ctx.save();
          ctx.beginPath();
          ctx.globalAlpha = twinkle * .74 * fade;
          ctx.fillStyle = particle.radius > 1.2 ? '#bdeaff' : '#5ebaff';
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (now >= nextStrike) createStrike(now);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = strikes.length - 1; i >= 0; i -= 1) {
        const strike = strikes[i];
        const elapsed = now - strike.born;
        const progress = elapsed / strike.life;
        if (progress >= 1) { strikes.splice(i, 1); continue; }
        // Brief return strokes create a lightning flicker; alpha reaches zero before removal.
        const flicker = progress < .2 ? 1 : progress < .31 ? .16 : progress < .55 ? .92 : progress < .7 ? .2 : Math.max(0, (1 - progress) / .3);
        for (const path of strike.paths) drawBoltPath(path, elapsed, flicker * strike.strength);
      }
      ctx.restore();
      scheduleNextFrame();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        if (frameTimer !== null) window.clearTimeout(frameTimer);
        frameTimer = null;
        frame = 0;
      } else if (!frame && !disposed) {
        lastFrame = 0;
        frame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', addCursorStars, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    frame = window.requestAnimationFrame(draw);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      if (frameTimer !== null) window.clearTimeout(frameTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', addCursorStars);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="electric-background-canvas" aria-hidden="true" />;
}

export default ElectricBackground;
