
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sparkles from "../components/Sparkles";

function Landing() {
  return (
    <div className="app">

      <Navbar />

      {/* HERO */}
      <section className="hero">

        <div className="hero-grid"></div>

        <Sparkles />

        <div className="hero-glow"></div>

        {/* Animated compass */}
        <div className="hero-compass" aria-hidden="true">
          <div className="compass-orbit orbit-one"></div>
          <div className="compass-orbit orbit-two"></div>

          <div className="hero-compass-ring">
            <div className="hero-compass-cross horizontal"></div>
            <div className="hero-compass-cross vertical"></div>

            <div className="hero-compass-needle"></div>
            <div className="hero-compass-center"></div>
          </div>

          <span className="compass-label compass-n">N</span>
          <span className="compass-label compass-e">E</span>
          <span className="compass-label compass-s">S</span>
          <span className="compass-label compass-w">W</span>
        </div>

        <div className="hero-content">

          <p className="hero-eyebrow">
            YOUR HIGH SCHOOL COMPASS
          </p>

          <h1 className="small-hero-title">
            FIND YOUR
          </h1>

          <h1 className="hero-title">
            <span>NORTH</span>
          </h1>

          <p className="hero-subtitle">
            Your path. Your plans. Your direction.
          </p>

          <p className="hero-description">
            NORTH brings your high school journey into one place.
            Plan courses, build your schedule, track your progress,
            explore opportunities, and work toward the future you want.
          </p>

          <div className="hero-actions">

            <a href="/signup" className="primary-button">
              Create Your North
              <span>→</span>
            </a>

            <a href="#explore" className="secondary-button">
              Explore North
            </a>

          </div>

          <p className="hero-note">
            Create an account to save your plans and make NORTH yours.
          </p>

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
            High school is a lot.
            <br />
            <span>Your plan shouldn't be.</span>
          </h2>

          <p>
            From choosing the right classes to finding opportunities
            outside the classroom, there is a lot to keep track of.
            NORTH brings the pieces together so you can spend less
            time searching and more time building your path.
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
            Build a balanced schedule that challenges you while leaving
            room for the activities and interests you care about.
          </p>

          <span className="feature-arrow">↗</span>
        </a>

        <a href="/ap-classes" className="feature-card">
          <span className="feature-number">03</span>

          <h3>AP Preparation</h3>

          <p>
            Explore AP classes, understand what they involve, and
            prepare for the work ahead with useful resources.
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

      {/* PERSONALIZATION */}
      <section className="why-section">

        <p className="section-label">
          02 — MAKE IT YOURS
        </p>

        <div className="why-content">

          <h2>
            Your information.
            <br />
            <span>Your direction.</span>
          </h2>

          <p>
            Create your NORTH account to save your academic information,
            courses, plans, GPA, and goals. Instead of starting over
            every time you visit, NORTH grows with you.
          </p>

          <a href="/signup" className="text-link">
            Create your account <span>→</span>
          </a>

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

      {/* FINAL CTA */}
      <section className="home-cta">

        <p className="section-label">
          03 — START HERE
        </p>

        <h2>
          Ready to find
          <br />
          <span>your North?</span>
        </h2>

        <p>
          Create your account and start building your path.
        </p>

        <a href="/signup" className="primary-button">
          Create Your North
          <span>→</span>
        </a>

      </section>

      <Footer />

    </div>
  );
}

export default Landing;

