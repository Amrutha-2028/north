/*
  Cursor spotlight for cards (inspired by animated card galleries):
  sets --mx / --my on the hovered card so CSS can paint a soft glow under the
  pointer. Cards marked .tilt also lean slightly toward the cursor.
*/
const SELECTOR = [
  ".feature-card",
  ".sch-card",
  ".course-card",
  ".me-card",
  ".mistake-card",
  ".ap-info-card",
  ".recommendation-card",
  ".comparison-card",
  ".tp-principle-card",
  ".tp-plan-card",
  ".tp-advice-card",
  ".op-principle-item",
  ".op-break-step",
  ".gpa-info-card",
  ".spot",
  ".tilt",
].join(",");

let tilted = null;

function resetTilt() {
  if (tilted) {
    tilted.style.removeProperty("--rx");
    tilted.style.removeProperty("--ry");
    tilted = null;
  }
}

export function initSpotlight() {
  if (typeof window === "undefined") return;
  if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;

  document.addEventListener(
    "pointermove",
    (event) => {
      const card = event.target instanceof Element ? event.target.closest(SELECTOR) : null;
      if (!card) {
        resetTilt();
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);

      if (card.classList.contains("feature-card") || card.classList.contains("tilt")) {
        if (tilted && tilted !== card) resetTilt();
        tilted = card;
        card.style.setProperty("--rx", `${((y / rect.height) - 0.5) * -6}deg`);
        card.style.setProperty("--ry", `${((x / rect.width) - 0.5) * 8}deg`);
      } else {
        resetTilt();
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", resetTilt);
}
