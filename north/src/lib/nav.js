/* Site navigation, shared by the navbar and footer. */
export const navGroups = [
  {
    label: "Plan",
    items: [
      { to: "/courses", label: "Courses", desc: "Typical classes by subject" },
      { to: "/schedule", label: "Schedule", desc: "Build a four-year plan" },
      { to: "/ap-classes", label: "AP Classes", desc: "What each AP covers" },
    ],
  },
  {
    label: "Track",
    items: [
      { to: "/gpa", label: "GPA", desc: "Weighted and unweighted, saved" },
      { to: "/goals", label: "Goals", desc: "Priorities and to-dos" },
      { to: "/resume-maker", label: "Resume", desc: "Build it once, keep editing" },
    ],
  },
  {
    label: "Prepare",
    items: [
      { to: "/test-prep", label: "Test Prep", desc: "ACT, PSAT and SAT strategy" },
      { to: "/opportunities", label: "Extracurriculars", desc: "Internships, research, summers" },
      { to: "/compass", label: "Compass", desc: "Focus timer and constellations" },
    ],
  },
];
