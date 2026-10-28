const STORAGE_KEY = "north-constellation-progress";

export const constellationCatalog = [
  {
    id: "little-dipper",
    name: "Little Dipper",
    description: "Small steps become a steady direction.",
    stars: [
      { x: 25, y: 30 }, { x: 42, y: 22 }, { x: 58, y: 34 },
      { x: 70, y: 48 }, { x: 56, y: 62 }, { x: 38, y: 68 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    id: "north-star",
    name: "North Star",
    description: "Keep returning to what matters most.",
    stars: [
      { x: 50, y: 16 }, { x: 50, y: 39 }, { x: 30, y: 55 },
      { x: 70, y: 55 }, { x: 50, y: 84 },
    ],
    connections: [[0, 1], [1, 2], [1, 3], [1, 4]],
  },
  {
    id: "wayfinder",
    name: "Wayfinder",
    description: "Your focus makes a path through the unknown.",
    stars: [
      { x: 22, y: 70 }, { x: 34, y: 42 }, { x: 50, y: 24 },
      { x: 66, y: 42 }, { x: 80, y: 70 }, { x: 50, y: 64 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [3, 5]],
  },
];

function readProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getConstellationProgress() {
  const saved = readProgress();
  return constellationCatalog.map((constellation) => ({
    ...constellation,
    starsLit: Math.min(
      constellation.stars.length,
      Math.max(0, Number(saved[constellation.id]) || 0)
    ),
  }));
}

export function awardConstellationStars(starsEarned) {
  const progress = readProgress();
  let remaining = Math.max(0, Math.floor(starsEarned));
  const newlyUnlocked = [];

  for (const constellation of constellationCatalog) {
    const current = Math.min(
      constellation.stars.length,
      Math.max(0, Number(progress[constellation.id]) || 0)
    );
    const next = Math.min(constellation.stars.length, current + remaining);
    progress[constellation.id] = next;
    remaining -= next - current;

    if (current < constellation.stars.length && next === constellation.stars.length) {
      newlyUnlocked.push(constellation);
    }
    if (remaining === 0) break;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("north-constellations-updated"));
  return { newlyUnlocked };
}
