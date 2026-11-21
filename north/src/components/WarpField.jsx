import { useEffect, useRef } from "react";

/*
  WarpField: a full-screen jump to light speed. Stars stream out from the
  center and stretch into streaks while `active` is true, then fade away.
*/
function WarpField({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = width / 2;
    const cy = height / 2;
    const stars = Array.from({ length: 420 }, () => ({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * width,
      gold: Math.random() < 0.18,
    }));

    let speed = 4;
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const t = (now - start) / 1000;
      speed = Math.min(80, 4 + t * t * 140);
      ctx.fillStyle = `rgba(3, 9, 22, ${Math.min(0.55, 0.2 + t * 0.4)})`;
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        const px = cx + (star.x / star.z) * width * 0.5;
        const py = cy + (star.y / star.z) * height * 0.5;
        star.z -= speed;
        if (star.z <= 1) {
          star.x = (Math.random() - 0.5) * width;
          star.y = (Math.random() - 0.5) * height;
          star.z = width;
          continue;
        }
        const nx = cx + (star.x / star.z) * width * 0.5;
        const ny = cy + (star.y / star.z) * height * 0.5;
        const alpha = Math.min(1, (1 - star.z / width) * 1.6);
        ctx.strokeStyle = star.gold ? `rgba(243, 216, 155, ${alpha})` : `rgba(200, 228, 255, ${alpha})`;
        ctx.lineWidth = Math.max(0.6, (1 - star.z / width) * 2.6);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }

      // Bright core flash as we hit full speed.
      const flash = Math.max(0, t - 0.45) * 1.4;
      if (flash > 0) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.6);
        glow.addColorStop(0, `rgba(217, 239, 255, ${Math.min(0.5, flash)})`);
        glow.addColorStop(1, "rgba(217, 239, 255, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      frame = requestAnimationFrame(tick);
    };

    ctx.clearRect(0, 0, width, height);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return <canvas ref={canvasRef} className={`warp-field${active ? " is-active" : ""}`} aria-hidden="true" />;
}

export default WarpField;
