import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/*
  Site-wide motion, mounted once in App:
  - a gold scroll-progress bar under the navbar
  - cards and panels rise in as they scroll into view (staggered)
  - buttons lean toward the pointer ("magnetic")
  - --scroll-v: a decaying scroll-speed value marquees and headlines react to
*/

const REVEAL_SELECTOR = [
  ".feature-card",
  ".sch-card",
  ".course-card",
  ".me-card",
  ".mistake-card",
  ".ap-info-card",
  ".ap-category",
  ".timeline-column",
  ".recommendation-card",
  ".comparison-card",
  ".requirement-card",
  ".career-track",
  ".tp-principle-card",
  ".tp-plan-card",
  ".tp-advice-card",
  ".tp-review-step",
  ".tp-merit-step",
  ".op-principle-item",
  ".op-comparison-panel",
  ".op-break-step",
  ".op-break-mini-card",
  ".gpa-year",
  ".gpa-info-card",
  ".priority-section",
  ".todo-section",
  ".rm-form-section",
].join(",");

const MAGNETIC_SELECTOR = ".btn-primary, .btn-lg, .magnetic, .nav-me, .rm-primary-button, .tp-button--primary";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function MotionLayer() {
  const { pathname } = useLocation();
  const barRef = useRef(null);

  // Scroll progress + scroll velocity.
  useEffect(() => {
    let lastY = window.scrollY;
    let velocity = 0;
    let frame = 0;
    const root = document.documentElement;

    const loop = () => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
      velocity = velocity * 0.88 + (y - lastY) * 0.12;
      lastY = y;
      root.style.setProperty("--scroll-v", velocity.toFixed(2));
      frame = requestAnimationFrame(loop);
    };

    if (prefersReducedMotion()) {
      const onScroll = () => {
        const max = root.scrollHeight - window.innerHeight;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Rise-in for cards, re-run on each page.
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    const timer = window.setTimeout(() => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (element.hasAttribute("data-reveal")) return;
        const rect = element.getBoundingClientRect();
        // Things already on screen stay put; only content below the fold animates.
        if (rect.top < window.innerHeight * 0.92) return;
        const siblings = element.parentElement ? [...element.parentElement.children] : [element];
        element.style.setProperty("--i", String(siblings.indexOf(element) % 6));
        element.setAttribute("data-reveal", "");
        observer.observe(element);
      });
    }, 60);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((element) => element.classList.add("in"));
    };
  }, [pathname]);

  // Magnetic buttons.
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }
    let current = null;

    const release = () => {
      if (current) {
        current.style.removeProperty("--tx");
        current.style.removeProperty("--ty");
        current = null;
      }
    };

    const onMove = (event) => {
      const target = event.target instanceof Element ? event.target.closest(MAGNETIC_SELECTOR) : null;
      if (target !== current) release();
      if (!target) return;
      current = target;
      const rect = target.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      target.style.setProperty("--tx", `${x * 0.25}px`);
      target.style.setProperty("--ty", `${y * 0.35}px`);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
      release();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}

export default MotionLayer;
