import PageHeader from "../components/PageHeader";
import "./Courses.css";

function Courses() {
  return (
    <div className="page">

      <PageHeader
        number="01 — COURSE PLANNING"
        title="Choose With Purpose."
        subtitle="Explore your options. Build your foundation. Plan with intention."
      />

      {/* COURSE INTRO */}
      <section className="course-intro">
        <div className="course-intro-content">
          <h2>
            Your courses shape
            <br />
            <span>your direction.</span>
          </h2>

          <p>
            Choosing the right courses in high school is about more than
            checking boxes. Challenge yourself, explore subjects that
            interest you, and build a schedule that supports where you
            want to go.
          </p>
        </div>

        <a className="course-intro-button" href="/schedule">
          Plan Your Schedule
        </a>
      </section>

      {/* LEGEND */}
      <section className="course-legend">
        <p className="section-label">COURSE LEGEND</p>

        <div className="legend-items">
          <div>
            <span className="legend-dot graduation"></span>
            Graduation Requirement
          </div>

          <div>
            <span className="legend-dot honors"></span>
            Honors Available
          </div>

          <div>
            <span className="legend-dot ap"></span>
            AP Available
          </div>

          <div>
            <span className="legend-dot elective"></span>
            Elective
          </div>
        </div>
      </section>

      {/* ENGLISH */}
      <CourseSection
        number="01"
        title="English"
        courses={[
          {
            title: "English 1",
            grade: "Grade 9",
            description: "Focuses on reading, writing, and literary analysis.",
            skills: ["Reading comprehension", "Writing skills", "Literary analysis"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "English 2",
            grade: "Grade 10",
            description: "Builds foundational skills with more complex texts and writing.",
            skills: ["Advanced reading", "Essay writing", "Research skills"],
            tags: ["Requirement", "Honors", "AP"],
          },
          {
            title: "English 3",
            grade: "Grade 11",
            description: "Develops critical thinking and advanced writing.",
            skills: ["Critical analysis", "Argumentative writing", "Oral communication"],
            tags: ["Requirement", "Honors", "AP"],
          },
          {
            title: "English 4",
            grade: "Grade 12",
            description: "Continues advanced reading, writing, research, and discussion.",
            skills: ["Research skills", "Academic discussions", "Advanced writing"],
            tags: ["Requirement", "Honors", "AP"],
          },
          {
            title: "AP Language & Composition",
            grade: "Grades 11–12",
            description: "College-level study of rhetoric, argumentation, and nonfiction.",
            skills: ["Rhetorical analysis", "Argumentation", "Nonfiction writing"],
            tags: ["AP"],
          },
          {
            title: "AP Literature & Composition",
            grade: "Grades 11–12",
            description: "Explores literature through close reading and analytical writing.",
            skills: ["Literary analysis", "Close reading", "Analytical writing"],
            tags: ["AP"],
          },
          {
            title: "AP Seminar",
            grade: "Grades 10–12",
            description: "Develops research, collaboration, presentation, and argumentation.",
            skills: ["Research", "Presentations", "Argumentation"],
            tags: ["AP"],
          },
          {
            title: "AP Research",
            grade: "Grades 11–12",
            description: "Students conduct an independent research project.",
            skills: ["Independent research", "Data analysis", "Academic writing"],
            tags: ["AP"],
          },
        ]}
      />

      {/* MATHEMATICS */}
      <CourseSection
        number="02"
        title="Mathematics"
        courses={[
          {
            title: "Algebra 1",
            grade: "Grade 9",
            description: "Introduces algebraic concepts, equations, functions, and problem-solving.",
            skills: ["Equation solving", "Algebraic manipulation", "Graphing"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "Geometry",
            grade: "Grade 10",
            description: "Explores geometry, proofs, spatial reasoning, and coordinate geometry.",
            skills: ["Geometric reasoning", "Proof writing", "Coordinate geometry"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "Algebra 2",
            grade: "Grade 11",
            description: "Builds advanced algebraic understanding through functions and modeling.",
            skills: ["Quadratics", "Functions", "Equation solving"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "Pre-Calculus",
            grade: "Grade 12",
            description: "Prepares students for calculus through advanced functions and trigonometry.",
            skills: ["Function analysis", "Trigonometry", "Limits and continuity"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "AP Precalculus",
            grade: "Grades 10–12",
            description: "Prepares students for calculus through functions, modeling, and trigonometry.",
            skills: ["Function modeling", "Trigonometry", "Mathematical reasoning"],
            tags: ["AP"],
          },
          {
            title: "AP Calculus AB",
            grade: "Grades 11–12",
            description: "Introduces differential and integral calculus and their applications.",
            skills: ["Derivatives", "Integrals", "Applications"],
            tags: ["AP"],
          },
          {
            title: "AP Calculus BC",
            grade: "Grades 11–12",
            description: "A broader study of calculus with additional advanced topics.",
            skills: ["Advanced calculus", "Series", "Parametric equations"],
            tags: ["AP"],
          },
          {
            title: "AP Statistics",
            grade: "Grades 10–12",
            description: "Explores data analysis, probability, and statistical inference.",
            skills: ["Data analysis", "Probability", "Statistical inference"],
            tags: ["AP"],
          },
        ]}
      />

      {/* SCIENCE */}
      <CourseSection
        number="03"
        title="Science"
        courses={[
          {
            title: "Biology",
            grade: "Grades 9–10",
            description: "Introduces living systems, genetics, evolution, ecology, and cells.",
            skills: ["Scientific reasoning", "Genetics", "Ecology"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "Chemistry",
            grade: "Grades 10–11",
            description: "Explores matter, chemical reactions, atomic structure, and chemistry.",
            skills: ["Chemical reactions", "Atomic structure", "Problem solving"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "Physics",
            grade: "Grades 11–12",
            description: "Studies motion, forces, energy, waves, and physical principles.",
            skills: ["Mechanics", "Energy", "Problem solving"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "AP Biology",
            grade: "Grades 10–12",
            description: "College-level study of biological systems, genetics, and evolution.",
            skills: ["Cell biology", "Genetics", "Evolution"],
            tags: ["AP"],
          },
          {
            title: "AP Chemistry",
            grade: "Grades 10–12",
            description: "Advanced study of chemical principles, reactions, and thermodynamics.",
            skills: ["Chemical equilibrium", "Thermodynamics", "Quantitative analysis"],
            tags: ["AP"],
          },
          {
            title: "AP Physics 1",
            grade: "Grades 10–12",
            description: "Algebra-based physics with an emphasis on mechanics.",
            skills: ["Mechanics", "Energy", "Scientific modeling"],
            tags: ["AP"],
          },
          {
            title: "AP Physics 2",
            grade: "Grades 11–12",
            description: "Continues algebra-based physics through electricity, fluids, and optics.",
            skills: ["Electricity", "Thermodynamics", "Optics"],
            tags: ["AP"],
          },
          {
            title: "AP Physics C",
            grade: "Grades 11–12",
            description: "Calculus-based physics focused on mechanics and electricity.",
            skills: ["Calculus-based physics", "Mechanics", "Electricity & magnetism"],
            tags: ["AP"],
          },
          {
            title: "AP Environmental Science",
            grade: "Grades 10–12",
            description: "Examines environmental systems, ecosystems, and sustainability.",
            skills: ["Environmental systems", "Ecosystems", "Sustainability"],
            tags: ["AP"],
          },
        ]}
      />

      {/* SOCIAL STUDIES */}
      <CourseSection
        number="04"
        title="Social Studies"
        courses={[
          {
            title: "World History",
            grade: "Grades 9–10",
            description: "Explores major civilizations, events, movements, and developments.",
            skills: ["Historical analysis", "Research", "Contextualization"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "United States History",
            grade: "Grades 10–11",
            description: "Studies major events, people, movements, and developments in American history.",
            skills: ["Historical analysis", "Source evaluation", "Argumentation"],
            tags: ["Requirement", "Honors"],
          },
          {
            title: "Government",
            grade: "Grades 11–12",
            description: "Introduces government structures, civic participation, and policy.",
            skills: ["Civic reasoning", "Government systems", "Policy analysis"],
            tags: ["Requirement"],
          },
          {
            title: "Economics",
            grade: "Grades 11–12",
            description: "Explores markets, economic systems, incentives, and financial decisions.",
            skills: ["Economic reasoning", "Markets", "Financial literacy"],
            tags: ["Requirement"],
          },
          {
            title: "AP World History",
            grade: "Grades 9–12",
            description: "College-level study of global history and historical developments.",
            skills: ["Historical reasoning", "Comparison", "Contextualization"],
            tags: ["AP"],
          },
          {
            title: "AP United States History",
            grade: "Grades 10–12",
            description: "Advanced study of American history through primary sources.",
            skills: ["Primary sources", "Historical argument", "Analysis"],
            tags: ["AP"],
          },
          {
            title: "AP Government & Politics",
            grade: "Grades 11–12",
            description: "Examines American political institutions, behavior, and policy.",
            skills: ["Political analysis", "Government", "Public policy"],
            tags: ["AP"],
          },
          {
            title: "AP Psychology",
            grade: "Grades 10–12",
            description: "Introduces the scientific study of behavior and cognition.",
            skills: ["Research methods", "Human behavior", "Data analysis"],
            tags: ["AP"],
          },
          {
            title: "AP Economics",
            grade: "Grades 11–12",
            description: "Explores markets, policy, national economies, and decision-making.",
            skills: ["Economic models", "Markets", "Policy analysis"],
            tags: ["AP"],
          },
        ]}
      />

      {/* AP VS HONORS */}
      <section className="comparison-section">
        <p className="section-label">05 — COURSE LEVELS</p>

        <h2>
          AP vs. Honors
          <br />
          <span>Know the difference.</span>
        </h2>

        <div className="comparison-grid">
          <div className="comparison-card">
            <h3>Honors Courses</h3>

            <ComparisonItem
              title="Difficulty"
              text="More challenging than standard courses, with deeper exploration of the subject."
            />

            <ComparisonItem
              title="College Credit"
              text="Typically does not provide college credit, but can demonstrate academic rigor."
            />

            <ComparisonItem
              title="Workload"
              text="Increased workload compared with standard courses, but generally less than AP."
            />

            <ComparisonItem
              title="GPA"
              text="Often weighted higher than standard courses."
            />
          </div>

          <div className="comparison-card">
            <h3>AP Courses</h3>

            <ComparisonItem
              title="Difficulty"
              text="College-level material with a significant time commitment."
            />

            <ComparisonItem
              title="College Credit"
              text="A strong AP exam score may earn college credit, depending on the institution."
            />

            <ComparisonItem
              title="Workload"
              text="Heavier workload with more in-depth assignments, analysis, and projects."
            />

            <ComparisonItem
              title="GPA"
              text="Often weighted higher than honors and standard courses."
            />
          </div>
        </div>
      </section>

      {/* COLLEGE RECOMMENDATIONS */}
      <section className="recommendations-section">
        <p className="section-label">06 — COLLEGE PREPARATION</p>

        <div className="recommendations-heading">
          <h2>
            Typical College
            <br />
            <span>Recommendations.</span>
          </h2>

          <p>
            Requirements vary by institution, but most colleges look for
            a strong foundation across core academic subjects.
          </p>
        </div>

        <div className="recommendation-grid">
          <Recommendation title="English" years="4 Years">
            Most colleges expect four years of English.
          </Recommendation>

          <Recommendation title="Mathematics" years="4 Years">
            Four years can demonstrate continued quantitative preparation.
          </Recommendation>

          <Recommendation title="Science" years="3–4 Years">
            Three years is common, while selective colleges often recommend four.
          </Recommendation>

          <Recommendation title="Social Studies" years="3–4 Years">
            Three years is common, while selective colleges often recommend four.
          </Recommendation>

          <Recommendation title="Foreign Language" years="2–4 Years">
            Continuing a language for additional years can strengthen preparation.
          </Recommendation>

          <Recommendation title="Electives" years="Varies">
            Choose electives that explore your interests and support your goals.
          </Recommendation>
        </div>
      </section>

      {/* CTA */}
      <section className="course-cta">
        <p className="section-label">07 — NEXT STEP</p>

        <h2>
          Ready to plan
          <br />
          <span>your future?</span>
        </h2>

        <p>
          Understanding your options is only the first step.
          Build a four-year plan that matches your goals and interests.
        </p>

        <a href="/schedule">
          Visit Schedule Planning
        </a>
      </section>

    </div>
  );
}

function CourseSection({ number, title, courses }) {
  return (
    <section className="course-section">
      <div className="course-section-header">
        <div>
          <p className="section-label">{number}</p>
          <h2>{title}</h2>
        </div>

        <div className="carousel-hint">
          Drag to explore
        </div>
      </div>

      <div className="course-carousel">
        {courses.map((course) => (
          <article className="course-card" key={course.title}>
            <div className="course-card-top">
              <span className="course-grade">
                {course.grade}
              </span>

              <div className="course-tags">
                {course.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <h3>{course.title}</h3>

            <p className="course-description">
              {course.description}
            </p>

            <div className="course-skills">
              <p>Skills</p>

              <ul>
                {course.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComparisonItem({ title, text }) {
  return (
    <div className="comparison-item">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function Recommendation({ title, years, children }) {
  return (
    <article className="recommendation-card">
      <div className="recommendation-top">
        <h3>{title}</h3>
        <span>{years}</span>
      </div>

      <p>{children}</p>
    </article>
  );
}

export default Courses;