import { useEffect, useRef } from 'react';

export type LightningTrigger = { x: number; y: number; kind: 'move' | 'click'; id: number };

type Point = { x: number; y: number };
type Bolt = { paths: Point[][]; born: number; life: number; width: number; strength: number };

function LightningCanvas() {
  const interactionRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interactionCanvas = interactionRef.current;
    const interactionContext = interactionCanvas?.getContext('2d', { alpha: true });
    if (!interactionCanvas || !interactionContext) return;

    let frame = 0;
    let disposed = false;
    const interactionBolts: Bolt[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      interactionCanvas.width = Math.round(window.innerWidth * ratio);
      interactionCanvas.height = Math.round(window.innerHeight * ratio);
      interactionCanvas.style.width = `${window.innerWidth}px`;
      interactionCanvas.style.height = `${window.innerHeight}px`;
      interactionContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const makePath = (start: Point, end: Point, steps: number, spread: number) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const normal = { x: -dy / length, y: dx / length };
      const points: Point[] = [start];
      for (let index = 1; index < steps; index += 1) {
        const t = index / steps;
        const jitter = (Math.random() - .5) * spread * (.35 + Math.sin(Math.PI * t));
        points.push({ x: start.x + dx * t + normal.x * jitter, y: start.y + dy * t + normal.y * jitter });
      }
      points.push(end);
      return points;
    };

    const drawPath = (ctx: CanvasRenderingContext2D, path: Point[], color: string, width: number, alpha: number) => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let index = 1; index < path.length; index += 1) ctx.lineTo(path[index].x, path[index].y);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 0;
      ctx.stroke();
    };

    const addBolt = (x: number, y: number, angle: number, length: number, strength: number, life: number) => {
      const end = { x: x + Math.cos(angle) * length, y: y + Math.sin(angle) * length };
      const main = makePath({ x, y }, end, Math.max(9, Math.min(60, Math.round(length / 11))), length * .085);
      const paths = [main];
      const forkCount = strength > .8 ? 6 : 4;
      for (let fork = 0; fork < forkCount; fork += 1) {
        const index = 2 + Math.floor(Math.random() * Math.max(1, main.length - 4));
        const anchor = main[index];
        const direction = Math.atan2(main[index + 1].y - main[index - 1].y, main[index + 1].x - main[index - 1].x);
        const branchAngle = direction + (Math.random() < .5 ? -1 : 1) * (.58 + Math.random() * .78);
        const branchLength = length * (.16 + Math.random() * .24);
        const branchEnd = { x: anchor.x + Math.cos(branchAngle) * branchLength, y: anchor.y + Math.sin(branchAngle) * branchLength };
        const branch = makePath(anchor, branchEnd, 5, branchLength * .15);
        paths.push(branch);
        if (Math.random() > .42) {
          const joint = branch[branch.length - 2];
          const sideAngle = branchAngle + (Math.random() < .5 ? -1 : 1) * (.65 + Math.random() * .6);
          const side = { x: joint.x + Math.cos(sideAngle) * branchLength * .3, y: joint.y + Math.sin(sideAngle) * branchLength * .3 };
          paths.push(makePath(joint, side, 3, branchLength * .1));
        }
      }
      interactionBolts.push({ paths, born: performance.now(), life, width: strength > .8 ? 3.6 : 2.6, strength });
      if (interactionBolts.length > 22) interactionBolts.splice(0, interactionBolts.length - 22);
    };

    const drawBolts = (ctx: CanvasRenderingContext2D, layerBolts: Bolt[], now: number) => {
      ctx.globalCompositeOperation = 'lighter';
      for (let boltIndex = layerBolts.length - 1; boltIndex >= 0; boltIndex -= 1) {
        const bolt = layerBolts[boltIndex];
        const progress = (now - bolt.born) / bolt.life;
        if (progress >= 1) { layerBolts.splice(boltIndex, 1); continue; }
        const pulse = progress < .16 ? progress / .16
          : progress < .38 ? 1
            : progress < .48 ? .12
              : progress < .68 ? .82
                : Math.max(0, (1 - progress) / .32);
        const alpha = pulse * bolt.strength;
        for (let pathIndex = 0; pathIndex < bolt.paths.length; pathIndex += 1) {
          const branch = pathIndex > 0;
          const width = branch ? 1.15 : bolt.width;
          const opacity = branch ? .78 : 1;
          // Draw the blue aura as actual strokes, with no canvas blur to leave a ghost trail.
          drawPath(ctx, bolt.paths[pathIndex], '#087cff', width * 2.1, alpha * opacity * .48);
          drawPath(ctx, bolt.paths[pathIndex], '#35c9ff', width * 1.25, alpha * opacity * .86);
          drawPath(ctx, bolt.paths[pathIndex], '#f2fdff', branch ? .62 : 1.12, alpha * (branch ? .72 : .94));
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const draw = (now: number) => {
      frame = 0;
      if (disposed) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      interactionContext.clearRect(0, 0, width, height);

      drawBolts(interactionContext, interactionBolts, now);
      if (interactionBolts.length) frame = window.requestAnimationFrame(draw);
    };

    const wake = () => {
      if (!frame && !disposed) frame = window.requestAnimationFrame(draw);
    };

    const spawn = (x: number, y: number, kind: LightningTrigger['kind']) => {
      const scale = Math.max(100, Math.min(window.innerWidth, window.innerHeight) * .5);
      const count = kind === 'click' ? 4 : 1;
      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const length = scale * (kind === 'click' ? .25 + Math.random() * .2 : .12 + Math.random() * .16);
        addBolt(x, y, angle, length, kind === 'click' ? 1 : .82, kind === 'click' ? 330 + Math.random() * 90 : 165);
      }
      wake();
    };

    const onStrike = (event: Event) => {
      const detail = (event as CustomEvent<LightningTrigger>).detail;
      if (detail) spawn(detail.x, detail.y, detail.kind);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('profile-lightning', onStrike);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('profile-lightning', onStrike);
    };
  }, []);

  return <>
    <canvas ref={interactionRef} className="lightning-canvas lightning-interaction" aria-hidden="true" />
  </>;
}

export default LightningCanvas;
