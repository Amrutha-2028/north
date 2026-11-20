import { useEffect, useRef, useState } from "react";

/** Counts up from 0 to `value` the first time it scrolls into view. */
function CountUp({ value, suffix = "", duration = 1400 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  // Skip the animation when motion is reduced or the browser can't observe.
  const [instant] = useState(
    () =>
      typeof window === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || instant || value === 0) return undefined;

    let frame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setShown(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, instant]);

  return (
    <span ref={ref}>
      {instant || value === 0 ? value : shown}
      {suffix}
    </span>
  );
}

export default CountUp;
