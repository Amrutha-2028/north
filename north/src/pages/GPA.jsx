import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { KEYS, usePersistentState } from "../lib/storage";
import {
  computeGpa,
  countCourses,
  createGpaState,
  defaultScale,
  formatGpa,
  gradeOrder,
  levelLabels,
  levels,
  yearLabels,
  yearOrder,
} from "../lib/gpa";
import "./GPA.css";

function GPA() {
  const [state, setState] = usePersistentState(KEYS.gpa, createGpaState);
  const [showCustomize, setShowCustomize] = useState(false);
  const scale = state.scale || defaultScale;

  const updateCourseCount = (year, level, grade, amount) => {
    setState((prev) => ({
      ...prev,
      years: {
        ...prev.years,
        [year]: {
          ...prev.years[year],
          [level]: {
            ...prev.years[year][level],
            [grade]: Math.max(0, prev.years[year][level][grade] + amount),
          },
        },
      },
    }));
  };

  const updateScale = (grade, level, value) => {
    setState((prev) => ({
      ...prev,
      scale: {
        ...prev.scale,
        [grade]: { ...prev.scale[grade], [level]: value === "" ? "" : Number(value) },
      },
    }));
  };

  const resetAll = () => {
    if (window.confirm("Clear every grade you've entered? This can't be undone.")) {
      setState(createGpaState());
    }
  };

  const totalCourses = countCourses(state);
  const unweighted = computeGpa(state, false);
  const weighted = computeGpa(state, true);

  return (
    <div className="app">
      <Navbar />

      <PageHeader
        number="Track / GPA"
        title="GPA Calculator"
        subtitle="Count your grades by year and course level. Everything saves on this device as you go, and shows up in My North."
      />

      <main className="gpa-page">
        <section className="gpa-results" aria-live="polite">
          <div className="result-card">
            <span>Unweighted</span>
            <strong>{formatGpa(unweighted)}</strong>
            <p>4.0 scale</p>
          </div>
          <div className="result-card featured">
            <span>Weighted</span>
            <strong>{formatGpa(weighted)}</strong>
            <p>Your scale below</p>
          </div>
          <div className="result-card">
            <span>Courses</span>
            <strong>{totalCourses}</strong>
            <p>entered so far</p>
          </div>
          <div className="result-actions">
            <span className="saved-pill">
              <span aria-hidden="true" /> Saved on this device
            </span>
            <button type="button" className="btn btn-sm" onClick={resetAll}>
              Clear all grades
            </button>
          </div>
        </section>

        <div className="years-container">
          {yearOrder.map((year) => (
            <GpaYear
              key={year}
              title={yearLabels[year]}
              year={year}
              data={state.years[year]}
              unweighted={computeGpa(state, false, [year])}
              weighted={computeGpa(state, true, [year])}
              updateCourseCount={updateCourseCount}
            />
          ))}
        </div>

        <section className="scale-card">
          <div className="scale-header">
            <div>
              <p className="section-label">Grading scale</p>
              <h2>Weighted scale</h2>
              <p className="scale-note">Match this to your school's scale. Official GPAs can be calculated differently.</p>
            </div>
            <div className="scale-buttons">
              {showCustomize && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setState((prev) => ({ ...prev, scale: defaultScale }))}
                >
                  Reset to default
                </button>
              )}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setShowCustomize(!showCustomize)}
              >
                {showCustomize ? "Done editing" : "Customize scale"}
              </button>
            </div>
          </div>

          <div className="scale-table" role="table" aria-label="Weighted grading scale">
            <div className="scale-row scale-title" role="row">
              <span role="columnheader">Grade</span>
              {levels.map((level) => (
                <span role="columnheader" key={level}>{levelLabels[level]}</span>
              ))}
            </div>

            {gradeOrder.map((grade) => (
              <div className="scale-row" role="row" key={grade}>
                <strong role="cell">{grade}</strong>
                {levels.map((level) =>
                  showCustomize ? (
                    <span role="cell" key={level}>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="6"
                      aria-label={`${grade} in ${levelLabels[level]}`}
                      value={scale[grade][level]}
                      onChange={(e) => updateScale(grade, level, e.target.value)}
                    />
                    </span>
                  ) : (
                    <span role="cell" key={level}>{Number(scale[grade][level]).toFixed(1)}</span>
                  )
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="gpa-info">
          <div className="gpa-info-card">
            <h3>Unweighted GPA</h3>
            <p>Your grades on a 4.0 scale, with no extra points for course difficulty.</p>
          </div>
          <div className="gpa-info-card">
            <h3>Weighted GPA</h3>
            <p>Adds points for Honors and AP courses, depending on your school's grading system.</p>
          </div>
          <div className="gpa-info-card">
            <h3>Why it matters</h3>
            <p>GPA is one part of your profile. Colleges also look at rigor, trends, activities and essays.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function GpaYear({ title, year, data, unweighted, weighted, updateCourseCount }) {
  return (
    <section className="gpa-year">
      <div className="year-heading">
        <h3>{title}</h3>
        <div className="year-gpa">
          <span>UW {formatGpa(unweighted)}</span>
          <span>W {formatGpa(weighted)}</span>
        </div>
      </div>

      <div className="grade-grid">
        <div className="grade-header" aria-hidden="true">
          <span />
          {gradeOrder.map((grade) => (
            <span key={grade}>{grade}</span>
          ))}
        </div>

        {levels.map((level) => (
          <div className="grade-row" key={level}>
            <strong>{levelLabels[level]}</strong>
            {gradeOrder.map((grade) => {
              const count = data[level][grade];
              const label = `${title} ${levelLabels[level]} ${grade}`;
              return (
                <div className={`counter${count > 0 ? " has-value" : ""}`} key={grade}>
                  <button
                    type="button"
                    aria-label={`Remove one ${label}`}
                    onClick={() => updateCourseCount(year, level, grade, -1)}
                  >
                    −
                  </button>
                  <span aria-label={`${label} count`}>{count}</span>
                  <button
                    type="button"
                    aria-label={`Add one ${label}`}
                    onClick={() => updateCourseCount(year, level, grade, 1)}
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export default GPA;
