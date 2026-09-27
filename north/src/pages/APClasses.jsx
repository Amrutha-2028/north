import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "./APClasses.css";

function APClasses() {

  const apCourses = {
    "English": [
      "AP Language and Composition",
      "AP Literature and Composition",
      "AP Seminar",
      "AP Research"
    ],

    "Mathematics": [
      "AP Pre-Calculus",
      "AP Calculus AB",
      "AP Calculus BC",
      "AP Statistics"
    ],

    "Career Focused": [
      "AP Computer Science Principles",
      "AP Computer Science A",
      "AP Cybersecurity",
      "AP Business with Personal Finance"
    ],

    "Science": [
      "AP Biology",
      "AP Chemistry",
      "AP Physics 1",
      "AP Physics 2",
      "AP Physics C: Electricity and Magnetism",
      "AP Physics C: Mechanics",
      "AP Environmental Science"
    ],

    "Arts": [
      "AP Music Theory",
      "AP 2-D Art and Design",
      "AP 3-D Art and Design",
      "AP Drawing",
      "AP Art History"
    ],

    "History & Social Sciences": [
      "AP World History: Modern",
      "AP United States History",
      "AP European History",
      "AP Psychology",
      "AP United States Government and Politics",
      "AP African American Studies",
      "AP Human Geography",
      "AP Comparative Government and Politics",
      "AP Macroeconomics",
      "AP Microeconomics"
    ],

    "Languages": [
      "AP Spanish Language and Culture",
      "AP Spanish Literature and Culture",
      "AP French Language and Culture",
      "AP German Language and Culture",
      "AP Italian Language and Culture",
      "AP Japanese Language and Culture",
      "AP Chinese Language and Culture",
      "AP Latin"
    ]
  };

  const timeline = {
    "Freshman Year": [
      "AP Human Geography",
      "AP Computer Science Principles",
      "AP European History"
    ],

    "Sophomore Year": [
      "AP World History",
      "AP Computer Science Principles",
      "AP Biology",
      "AP Physics 1",
      "AP Chemistry",
      "AP Computer Science A",
      "AP Pre-Calculus"
    ],

    "Junior Year": [
      "AP World History",
      "AP Computer Science A",
      "AP Biology",
      "AP Physics 1",
      "AP Chemistry",
      "AP Physics C",
      "AP United States History",
      "AP English Language and Composition",
      "AP Calculus AB",
      "AP Calculus BC"
    ],

    "Senior Year": [
      "AP Computer Science A",
      "AP Chemistry",
      "AP Physics C",
      "AP English Literature and Composition",
      "AP Calculus AB",
      "AP Calculus BC",
      "AP Art History",
      "AP Government",
      "AP Economics",
      "AP Psychology",
      "AP Statistics"
    ]
  };

  return (
    <div className="app">

      <Navbar />

      <PageHeader
        number="AP PREPARATION"
        title="AP Classes Guide"
        subtitle="Explore advanced courses. Prepare with purpose."
      />

      <main className="guide-page">

        {/* INTRO */}

        <section className="guide-intro">

          <p className="section-label">
            UNDERSTANDING AP
          </p>

          <h2>
            Challenge yourself.
            <br />
            <span>Know your options.</span>
          </h2>

          <p>
            Explore the AP classes offered by College Board and learn
            how to effectively utilize them.
          </p>

        </section>


        {/* HOW AP WORKS */}

        <section className="ap-info-grid">

          <div className="ap-info-card">

            <span className="ap-card-number">01</span>

            <h3>How APs Work</h3>

            <p>
              AP courses are college-level classes offered in high
              school. Students take an AP Exam at the end of the year,
              with scores ranging from 1–5.
            </p>

          </div>


          <div className="ap-info-card">

            <span className="ap-card-number">02</span>

            <h3>Potential College Credit</h3>

            <p>
              Strong AP exam scores can potentially earn college
              credit, helping students save time and money in college.
            </p>

          </div>


          <div className="ap-info-card">

            <span className="ap-card-number">03</span>

            <h3>Academic Rigor</h3>

            <p>
              AP classes cover college-level material and generally
              require more time, analysis, and preparation than
              standard courses.
            </p>

          </div>

        </section>


        {/* TIMELINE */}

        <section className="ap-timeline">

          <p className="section-label">
            PLANNING AHEAD
          </p>

          <h2>Usually Taken AP Classes</h2>

          <div className="timeline-grid">

            {Object.entries(timeline).map(([year, courses]) => (

              <div className="timeline-column" key={year}>

                <h3>{year}</h3>

                <div className="timeline-courses">

                  {courses.map((course) => (
                    <div key={course}>
                      {course}
                    </div>
                  ))}

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ALL AP COURSES */}

        <section className="all-ap">

          <p className="section-label">
            COLLEGE BOARD
          </p>

          <h2>AP Courses Offered</h2>

          <div className="ap-category-grid">

            {Object.entries(apCourses).map(([category, courses]) => (

              <div className="ap-category" key={category}>

                <h3>{category}</h3>

                <ul>

                  {courses.map((course) => (
                    <li key={course}>{course}</li>
                  ))}

                </ul>

              </div>

            ))}

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}

export default APClasses;