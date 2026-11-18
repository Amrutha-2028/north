export const defaultScale = {
  A: { standard: 4.0, honors: 4.5, ap: 5.0 },
  B: { standard: 3.0, honors: 3.5, ap: 4.0 },
  C: { standard: 2.0, honors: 2.5, ap: 3.0 },
  D: { standard: 1.0, honors: 1.5, ap: 2.0 },
  F: { standard: 0.0, honors: 0.0, ap: 0.0 },
};

export const gradeOrder = ["A", "B", "C", "D", "F"];
export const levels = ["standard", "honors", "ap"];
export const levelLabels = { standard: "Standard", honors: "Honors", ap: "AP" };
export const yearOrder = ["freshman", "sophomore", "junior", "senior"];
export const yearLabels = {
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
};

const unweightedPoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };

export const createYear = () => ({
  standard: { A: 0, B: 0, C: 0, D: 0, F: 0 },
  honors: { A: 0, B: 0, C: 0, D: 0, F: 0 },
  ap: { A: 0, B: 0, C: 0, D: 0, F: 0 },
});

export const createGpaState = () => ({
  scale: defaultScale,
  years: Object.fromEntries(yearOrder.map((year) => [year, createYear()])),
});

function tally(yearsList, scale, weighted) {
  let points = 0;
  let courses = 0;

  yearsList.forEach((year) => {
    if (!year) return;
    levels.forEach((level) => {
      gradeOrder.forEach((grade) => {
        const count = Number(year[level]?.[grade]) || 0;
        courses += count;
        points += count * (weighted ? Number(scale?.[grade]?.[level]) || 0 : unweightedPoints[grade]);
      });
    });
  });

  return { points, courses };
}

/** GPA for the given years (all years by default). Returns null when no courses. */
export function computeGpa(state, weighted, onlyYears = yearOrder) {
  const { points, courses } = tally(
    onlyYears.map((year) => state?.years?.[year]),
    state?.scale || defaultScale,
    weighted
  );
  return courses === 0 ? null : points / courses;
}

export function countCourses(state, onlyYears = yearOrder) {
  return tally(onlyYears.map((year) => state?.years?.[year]), defaultScale, false).courses;
}

export const formatGpa = (value) => (value === null || value === undefined ? "—" : value.toFixed(2));
