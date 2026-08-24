import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sparkles from "../components/Sparkles";

function Home() {
  return (
    <div className="app">

      <Navbar />

      {/* HERO */}
      <section className="hero">

        <div className="hero-grid"></div>

        <Sparkles />

        <div className="hero-glow"></div>

        <div className="hero-content">

          <p className="hero-eyebrow">
            YOUR HIGH SCHOOL COMPASS
          </p>

          <h1 className="hero-title">
            NORTH
          </h1>

          <p className="hero-subtitle">
            Navigate your future.
          </p>

          <p className="hero-description">
            Plan your high school journey with confidence.
            Explore courses, build your schedule, prepare for AP exams,
            discover opportunities, and create a path toward your goals.
          </p>

          <div className="hero-actions">

            <a href="#explore" className="primary-button">
              Start Exploring
              <span>→</span>
            </a>

            <a href="#mission" className="secondary-button">
              Our Mission
            </a>

          </div>

        </div>

        <div className="scroll-indicator">
          <span></span>
          Scroll to explore
          <span></span>
        </div>

      </section>


      {/* INTRO */}
      <section className="intro" id="mission">

        <p className="section-label">
          01 — THE NORTH APPROACH
        </p>

        <div className="intro-content">

          <h2>
            Find your direction.
            <br />
            <span>Build your path.</span>
          </h2>

          <p>
            High school can feel overwhelming. NORTH brings the pieces
            together in one place — from choosing courses and planning
            your schedule to exploring extracurriculars, preparing for
            AP exams, and finding opportunities that matter to you.
          </p>

        </div>

      </section>


      {/* FEATURES */}
      <section className="features" id="explore">

        <a href="/courses" className="feature-card">

          <span className="feature-number">01</span>

          <h3>Courses</h3>

          <p>
            Explore courses and understand how your choices can shape
            your high school experience and future opportunities.
          </p>

          <span className="feature-arrow">↗</span>

        </a>


        <a href="/schedule" className="feature-card">

          <span className="feature-number">02</span>

          <h3>Schedule</h3>

          <p>
            Plan a balanced schedule that challenges you while leaving
            room for the activities and interests you care about.
          </p>

          <span className="feature-arrow">↗</span>

        </a>


        <a href="/ap-classes" className="feature-card">

          <span className="feature-number">03</span>

          <h3>AP Preparation</h3>

          <p>
            Prepare for AP classes and exams with study strategies,
            resources, and practical guidance.
          </p>

          <span className="feature-arrow">↗</span>

        </a>


        <div className="feature-card">

          <span className="feature-number">04</span>

          <h3>Activities</h3>

          <p>
            Discover extracurricular opportunities that connect with
            your interests and help you build meaningful experiences.
          </p>

          <span className="feature-arrow">↗</span>

        </div>


        <div className="feature-card">

          <span className="feature-number">05</span>

          <h3>Scholarships</h3>

          <p>
            Find scholarship opportunities that align with your
            interests, achievements, and goals.
          </p>

          <span className="feature-arrow">↗</span>

        </div>


        <div className="feature-card">

          <span className="feature-number">06</span>

          <h3>Study</h3>

          <p>
            Build better study habits with resources designed to help
            you learn efficiently and prepare with confidence.
          </p>

          <span className="feature-arrow">↗</span>

        </div>

      </section>


      {/* WHY NORTH */}
      <section className="why-section">

        <p className="section-label">
          02 — WHY NORTH
        </p>

        <div className="why-content">

          <h2>
            Everything you need.
            <br />
            <span>One direction.</span>
          </h2>

          <p>
            Instead of jumping between different websites for course
            planning, AP preparation, extracurricular ideas, and
            scholarships, NORTH brings these resources together into
            one platform.
          </p>

        </div>

      </section>


      {/* STATS */}
      <section className="stats">

        <div className="stat">
          <strong>90%</strong>
          <p>of colleges consider course rigor in admissions</p>
        </div>

        <div className="stat">
          <strong>$4B</strong>
          <p>in scholarships go unclaimed annually</p>
        </div>

        <div className="stat">
          <strong>400+</strong>
          <p>extracurricular opportunities students can explore</p>
        </div>

        <div className="stat">
          <strong>38</strong>
          <p>AP courses offered by College Board</p>
        </div>

      </section>


      <Footer />

    </div>
  );
}

export default Home;