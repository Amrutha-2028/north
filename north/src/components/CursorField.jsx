import { useEffect, useRef } from "react";

/*
  CursorField: the living starfield behind every page.
  - Small star points drift across the background.
  - Near the pointer they slowly cluster together, like a constellation
    forming, and drift apart again when the pointer leaves.
  - A soft blue glow rises behind the content where the pointer is.
  - Clicking sends a small ripple of gold sparks.
  The canvas sits behind all page content, so it never covers text.
*/

const COLORS = [
  [217, 239, 255], // starlight
  [143, 199, 242], // North blue
  [243, 216, 155], // gold
];

function makeSprite([r, g, b]) {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
  gradient.addColorStop(0.25, `rgba(${r},${g},${b},0.85)`);
  gradient.addColorStop(0.55, `rgba(${r},${g},${b},0.18)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function pickColor() {
  const roll = Math.random();
  if (roll < 0.55) return 0;
  if (roll < 0.85) return 1;
  return 2;
}

function CursorField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    const ctx = canvas.getContext("2d");
    const sprites = COLORS.map(makeSprite);
    const finePointer = window.matchMedia?.("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let sparks = [];
    let frame = 0;
    let running = true;

    const pointer = { x: -9999, y: -9999, gx: -9999, gy: -9999, active: false, lastMove: 0 };

    const spawn = (count) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 0.5 + Math.random() * 1.1,
        c: pickColor(),
        // Each star settles at its own distance, so the cluster stays loose.
        orbit: 14 + Math.random() * 110,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.03,
      }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(finePointer ? 220 : 90, (width * height) / 6000));
      if (particles.length < target) particles = particles.concat(spawn(target - particles.length));
      else particles = particles.slice(0, target);
    };

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!pointer.active) {
        pointer.gx = pointer.x;
        pointer.gy = pointer.y;
      }
      pointer.active = true;
      pointer.lastMove = performance.now();
    };

    const onLeave = () => {
      pointer.active = false;
    };

    const onDown = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      particles.forEach((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 200) {
          const force = (1 - dist / 200) * 3.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
      for (let i = 0; i < 10; i += 1) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
        const speed = 1.5 + Math.random() * 2;
        sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
      }
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) frame = requestAnimationFrame(tick);
      else cancelAnimationFrame(frame);
    };

    function tick(now) {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      const engaged = pointer.active && now - pointer.lastMove < 5000;
      pointer.gx += (pointer.x - pointer.gx) * 0.08;
      pointer.gy += (pointer.y - pointer.gy) * 0.08;

      // Soft glow behind the content where the pointer is.
      if (engaged) {
        const glow = ctx.createRadialGradient(pointer.gx, pointer.gy, 0, pointer.gx, pointer.gy, 420);
        glow.addColorStop(0, "rgba(70, 150, 230, 0.20)");
        glow.addColorStop(0.4, "rgba(52, 127, 196, 0.08)");
        glow.addColorStop(1, "rgba(52, 127, 196, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(pointer.gx - 420, pointer.gy - 420, 840, 840);
      }

      const reach = 320;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        let near = 0;

        if (engaged) {
          const dx = pointer.gx - p.x;
          const dy = pointer.gy - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < reach) {
            near = 1 - dist / reach;
            const nx = dx / dist;
            const ny = dy / dist;
            // Ease toward the cluster, with only a slow drift around it.
            const pull = (dist - p.orbit) * 0.0035 * near;
            p.vx += nx * pull - ny * 0.03 * near;
            p.vy += ny * pull + nx * 0.03 * near;
          }
        }

        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        p.twinkle += p.speed;
        const alpha = 0.35 + Math.sin(p.twinkle) * 0.25 + near * 0.3;
        const size = p.r * 5;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(sprites[p.c], p.x - size / 2, p.y - size / 2, size, size);
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.life -= 0.03;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const size = 7 * s.life + 2;
        ctx.globalAlpha = s.life;
        ctx.drawImage(sprites[2], s.x - size / 2, s.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-field" aria-hidden="true" />;
}

export default CursorField;
