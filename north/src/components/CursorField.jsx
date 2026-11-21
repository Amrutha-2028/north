import { useEffect, useRef } from "react";

/*
  CursorField: a full-screen canvas on every page.
  - A soft blue/gold gradient glow rises wherever the pointer is.
  - Tiny shaded spheres drift around the page. Near the pointer they get
    pulled in and swirl around it in a loose cluster.
  - Clicking sends a pop of gold sparks and scatters the cluster.
  It draws with `mix-blend-mode: screen`, so it only ever adds light.
*/

const COLORS = [
  { rgb: [99, 174, 245], weight: 5 }, // North blue
  { rgb: [217, 239, 255], weight: 3 }, // starlight
  { rgb: [243, 216, 155], weight: 2 }, // gold
];

function makeSprite([r, g, b]) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  // A small shaded sphere: bright highlight top-left, soft halo outside.
  const halo = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  halo.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
  halo.addColorStop(0.35, `rgba(${r},${g},${b},0.55)`);
  halo.addColorStop(0.6, `rgba(${r},${g},${b},0.12)`);
  halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);
  const shine = ctx.createRadialGradient(26, 26, 0, 26, 26, 10);
  shine.addColorStop(0, "rgba(255,255,255,0.95)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.arc(28, 28, 12, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

function pickColor() {
  const total = COLORS.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < COLORS.length; i += 1) {
    roll -= COLORS[i].weight;
    if (roll <= 0) return i;
  }
  return 0;
}

function CursorField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    const ctx = canvas.getContext("2d");
    const sprites = COLORS.map((c) => makeSprite(c.rgb));
    const finePointer = window.matchMedia?.("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let sparks = [];
    let frame = 0;
    let running = true;

    const pointer = { x: -9999, y: -9999, gx: -9999, gy: -9999, active: false, lastMove: 0 };

    const spawn = (count) =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.1 + Math.random() * 2.4,
        c: pickColor(),
        orbit: 16 + (i % 9) * 9 + Math.random() * 8,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.5),
        twinkle: Math.random() * Math.PI * 2,
      }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(finePointer ? 170 : 70, (width * height) / 8500));
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
      // Scatter nearby spheres outward.
      particles.forEach((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 240) {
          const force = (1 - dist / 240) * 7;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
      // A pop of gold and blue sparks.
      for (let i = 0; i < 16; i += 1) {
        const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
        const speed = 2 + Math.random() * 3.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          c: i % 3 === 0 ? 0 : 2,
          r: 1.4 + Math.random() * 2,
        });
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

      const idle = now - pointer.lastMove > 4000;
      const engaged = pointer.active && !idle;
      pointer.gx += (pointer.x - pointer.gx) * 0.12;
      pointer.gy += (pointer.y - pointer.gy) * 0.12;

      // Gradient glow that rises where the pointer is.
      if (engaged) {
        const glow = ctx.createRadialGradient(pointer.gx, pointer.gy, 0, pointer.gx, pointer.gy, 360);
        glow.addColorStop(0, "rgba(70, 150, 230, 0.28)");
        glow.addColorStop(0.35, "rgba(52, 127, 196, 0.12)");
        glow.addColorStop(1, "rgba(52, 127, 196, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(pointer.gx - 360, pointer.gy - 360, 720, 720);

        const core = ctx.createRadialGradient(pointer.gx, pointer.gy, 0, pointer.gx, pointer.gy, 90);
        core.addColorStop(0, "rgba(243, 216, 155, 0.10)");
        core.addColorStop(1, "rgba(243, 216, 155, 0)");
        ctx.fillStyle = core;
        ctx.fillRect(pointer.gx - 90, pointer.gy - 90, 180, 180);
      }

      const reach = 260;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        if (engaged) {
          const dx = pointer.gx - p.x;
          const dy = pointer.gy - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < reach) {
            const pull = 1 - dist / reach;
            const nx = dx / dist;
            const ny = dy / dist;
            // Pull toward a ring around the pointer, then swirl along it.
            const radial = (dist - p.orbit) * 0.018 * pull;
            p.vx += nx * radial - ny * p.spin * 0.26 * pull;
            p.vy += ny * radial + nx * p.spin * 0.26 * pull;
          }
        }

        // Gentle wander so idle spheres keep drifting.
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02 - 0.002;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.twinkle += 0.03;
        // Spheres near the pointer glow brighter and a little bigger.
        let near = 0;
        if (engaged) {
          const d = Math.hypot(pointer.gx - p.x, pointer.gy - p.y);
          near = Math.max(0, 1 - d / reach);
        }
        const alpha = 0.28 + Math.sin(p.twinkle) * 0.16 + near * 0.55;
        const size = p.r * (4 + near * 2.2);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[p.c], p.x - size / 2, p.y - size / 2, size, size);
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.93;
        s.vy *= 0.93;
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const size = s.r * 5 * s.life + 2;
        ctx.globalAlpha = s.life;
        ctx.drawImage(sprites[s.c], s.x - size / 2, s.y - size / 2, size, size);
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
