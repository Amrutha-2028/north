import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "./GPA.css";
import { useState } from "react";

const defaultScale = {
  A: { standard: 4.0, honors: 4.5, ap: 5.0 },
  B: { standard: 3.0, honors: 3.5, ap: 4.0 },
  C: { standard: 2.0, honors: 2.5, ap: 3.0 },
  D: { standard: 1.0, honors: 1.5, ap: 2.0 },
  F: { standard: 0.0, honors: 0.0, ap: 0.0 },
};

const gradeOrder = ["A", "B", "C", "D", "F"];
const levels = ["standard", "honors", "ap"];

const createYear = () => ({
  standard: { A: 0, B: 0, C: 0, D: 0, F: 0 },
  honors: { A: 0, B: 0, C: 0, D: 0, F: 0 },
  ap: { A: 0, B: 0, C: 0, D: 0, F: 0 },
});

function GPA() {
  const [scale, setScale] = useState(defaultScale);
  const [showCustomize, setShowCustomize] = useState(false);

  const [years, setYears] = useState({
    freshman: createYear(),
    sophomore: createYear(),
    junior: createYear(),
    senior: createYear(),
  });

  const updateCourseCount = (year, level, grade, amount) => {
    setYears((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        [level]: {
          ...prev[year][level],
          [grade]: Math.max(
            0,
            prev[year][level][grade] + amount
          ),
        },
      },
    }));
  };

  const updateScale = (grade, level, value) => {
    setScale((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [level]: value === "" ? "" : Number(value),
      },
    }));
  };

  const calculateGPA = (weighted) => {
    let totalPoints = 0;
    let totalCourses = 0;

    Object.values(years).forEach((year) => {
      Object.entries(year).forEach(([level, grades]) => {
        Object.entries(grades).forEach(([grade, count]) => {
          totalCourses += count;

          if (weighted) {
            totalPoints +=
              count * Number(scale[grade][level]);
          } else {
            const unweightedPoints = {
              A: 4,
              B: 3,
              C: 2,
              D: 1,
              F: 0,
            };

            totalPoints +=
              count * unweightedPoints[grade];
          }
        });
      });
    });

    if (totalCourses === 0) return "0.00";

    return (totalPoints / totalCourses).toFixed(2);
  };

  const totalCourses = Object.values(years).reduce(
    (total, year) =>
      total +
      Object.values(year).reduce(
        (yearTotal, level) =>
          yearTotal +
          Object.values(level).reduce(
            (sum, count) => sum + count,
            0
          ),
        0
      ),
    0
  );

  return (
    <div className="app">
      <Navbar />

      <PageHeader
        number="GPA PLANNING"
        title="GPA Calculator"
        subtitle="Understand your grades. See your progress. Plan ahead."
      />

      <main className="gpa-page">

        {/* QUICK INTRO */}

        <section className="gpa-intro">

          <p className="section-label">WHAT IS GPA?</p>

          <h2>
            Your grades,
            <br />
            <span>in one number.</span>
          </h2>

          <p>
            GPA stands for Grade Point Average. It is a numerical
            summary of your academic performance, making it easier
            to understand your grades without looking through an
            entire transcript.
          </p>

        </section>


        {/* CALCULATOR */}

        <section className="calculator-section">

          <div className="calculator-heading">

            <div>
              <p className="section-label">CALCULATE</p>

              <h2>
                Build your <span>GPA.</span>
              </h2>
            </div>

            <div className="course-total">
              <strong>{totalCourses}</strong>
              <span>courses entered</span>
            </div>

          </div>


          {/* RESULTS — MOVED TO TOP */}

          <section className="gpa-results">

            <p className="section-label">YOUR RESULTS</p>

            <div className="results-grid">

              <div className="result-card">

                <span>Unweighted GPA</span>

                <strong>
                  {calculateGPA(false)}
                </strong>

                <p>4.0 scale</p>

              </div>

              <div className="result-card featured">

                <span>Weighted GPA</span>

                <strong>
                  {calculateGPA(true)}
                </strong>

                <p>Using your selected scale</p>

              </div>

            </div>

          </section>


          {/* YEARS */}

          <div className="years-container">

            <GpaYear
              title="Freshman"
              number="01"
              year="freshman"
              data={years.freshman}
              updateCourseCount={updateCourseCount}
            />

            <GpaYear
              title="Sophomore"
              number="02"
              year="sophomore"
              data={years.sophomore}
              updateCourseCount={updateCourseCount}
            />

            <GpaYear
              title="Junior"
              number="03"
              year="junior"
              data={years.junior}
              updateCourseCount={updateCourseCount}
            />

            <GpaYear
              title="Senior"
              number="04"
              year="senior"
              data={years.senior}
              updateCourseCount={updateCourseCount}
            />

          </div>


          {/* SCALE — MOVED BELOW */}

          <div className="scale-card">

            <div className="scale-header">

              <div>
                <p className="section-label">
                  GPA SCALE
                </p>

                <h3>NORTH GPA Scale</h3>
              </div>

              <button
                className="customize-button"
                onClick={() =>
                  setShowCustomize(!showCustomize)
                }
              >
                {showCustomize
                  ? "Hide Customization"
                  : "Customize My Scale"}
              </button>

            </div>


            <div className="scale-table">

              <div className="scale-row scale-title">
                <span>Grade</span>
                <span>Standard</span>
                <span>Honors</span>
                <span>AP</span>
              </div>

              {gradeOrder.map((grade) => (
                <div
                  className="scale-row"
                  key={grade}
                >
                  <strong>{grade}</strong>

                  <span>
                    {scale[grade].standard}
                  </span>

                  <span>
                    {scale[grade].honors}
                  </span>

                  <span>
                    {scale[grade].ap}
                  </span>
                </div>
              ))}

            </div>


            {showCustomize && (
              <div className="custom-scale">

                <div className="custom-scale-heading">

                  <h3>Customize Your Scale</h3>

                  <button
                    onClick={() =>
                      setScale(defaultScale)
                    }
                    className="reset-button"
                  >
                    Reset to Default
                  </button>

                </div>

                <p>
                  Adjust the values to match your school's
                  official grading system.
                </p>

                <div className="custom-table">

                  <div className="custom-row custom-title">
                    <span>Grade</span>
                    <span>Standard</span>
                    <span>Honors</span>
                    <span>AP</span>
                  </div>

                  {gradeOrder.map((grade) => (
                    <div
                      className="custom-row"
                      key={grade}
                    >

                      <strong>{grade}</strong>

                      {levels.map((level) => (
                        <input
                          key={level}
                          type="number"
                          step="0.1"
                          min="0"
                          max="6"
                          value={scale[grade][level]}
                          onChange={(e) =>
                            updateScale(
                              grade,
                              level,
                              e.target.value
                            )
                          }
                        />
                      ))}

                    </div>
                  ))}

                </div>

              </div>
            )}

            <p className="scale-note">
              Your school's official GPA calculation may
              be different.
            </p>

          </div>


          {/* INFO */}

          <section className="gpa-info">

            <div className="gpa-info-card">
              <span>01</span>

              <h3>Unweighted GPA</h3>

              <p>
                Measures your grades on a standard 4.0 scale
                without giving additional points for course
                difficulty.
              </p>
            </div>

            <div className="gpa-info-card">
              <span>02</span>

              <h3>Weighted GPA</h3>

              <p>
                Gives additional points to courses such as
                Honors and AP, depending on your school's
                grading system.
              </p>
            </div>

            <div className="gpa-info-card">
              <span>03</span>

              <h3>Why It Matters</h3>

              <p>
                GPA is one part of your academic profile.
                Colleges may also consider course rigor,
                grades, activities, essays, and more.
              </p>
            </div>

          </section>

        </section>

      </main>

      <Footer />

    </div>
  );
}


function GpaYear({
  title,
  number,
  year,
  data,
  updateCourseCount,
}) {
  return (
    <section className="gpa-year">

      <div className="year-heading">

        <div>
          <p className="year-label">{number}</p>
          <h3>{title}</h3>
        </div>

      </div>

      <div className="grade-grid">

        <div className="grade-header">
          <span>Course</span>
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span>D</span>
          <span>F</span>
        </div>

        {levels.map((level) => (

          <div
            className="grade-row"
            key={level}
          >

            <strong>
              {level === "standard"
                ? "Standard"
                : level === "honors"
                ? "Honors"
                : "AP"}
            </strong>

            {gradeOrder.map((grade) => (

              <div
                className="counter"
                key={grade}
              >

                <button
                  type="button"
                  onClick={() =>
                    updateCourseCount(
                      year,
                      level,
                      grade,
                      -1
                    )
                  }
                >
                  −
                </button>

                <span>
                  {data[level][grade]}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updateCourseCount(
                      year,
                      level,
                      grade,
                      1
                    )
                  }
                >
                  +
                </button>

              </div>

            ))}

          </div>

        ))}

      </div>

    </section>
  );
}

export default GPA;