import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScheduleTemplateDownload from "../components/ScheduleTemplateDownload";
import { scholarships } from "../lib/scholarships";

const steps = [
  {
    title: "Set up your profile",
    text: "Add your grade, school, state and what you're interested in. It takes a minute and never leaves your device.",
    link: { to: "/me", label: "Open My North" },
  },
  {
    title: "Track as you go",
    text: "Log grades each semester, add every club, award and project to your resume, and keep your goals in order.",
    link: { to: "/gpa", label: "Start with GPA" },
  },
  {
    title: "Find the money",
    text: "Filter scholarships by amount, merit, state, grade and citizenship. Save the ones that fit and track each one to submitted.",
    link: { to: "/scholarships", label: "Browse scholarships" },
  },
  {
    title: "Apply ready",
    text: "When applications open, your resume, GPA and activity list are already done. Print to PDF and send.",
    link: { to: "/resume-maker", label: "Open the resume maker" },
  },
];

const fullRides = scholarships.filter((s) => s.fullRide).length;

function Landing() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="app">
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-dots" aria-hidden="true" />

        <div className="hero-content">
          <Link to="/scholarships" className="hero-badge">
            <span>New</span>
            {scholarships.length} scholarships, sorted six ways
            <span className="arrow" aria-hidden="true">→</span>
          </Link>

          <h1 className="hero-title">
            High school, planned.
            <br />
            <span>All in one place.</span>
          </h1>

          <p className="hero-description">
            North keeps your GPA, resume, goals and scholarship list together, saved
            right on your device. Plus guides for courses, APs, test prep and everything
            outside the classroom.
          </p>

          <div className="hero-actions">
            <Link to="/me" className="btn btn-primary btn-lg">
              Open My North <span className="arrow">→</span>
            </Link>
            <a href="#explore" className="btn btn-lg secondary-button">
              Explore the guides
            </a>
          </div>

          <p className="hero-note">
            <span className="hero-note-dot" aria-hidden="true" /> No account. No sign-up. Your data stays on this device.
          </p>
        </div>

        {/* Product preview */}
        <div className="preview" aria-hidden="true">
          <div className="preview-bar">
            <span />
            <span />
            <span />
            <p>north / my-north</p>
          </div>
          <div className="preview-body">
            <aside className="preview-side">
              <b>✦ north</b>
              <i className="on">My North</i>
              <i>GPA</i>
              <i>Resume</i>
              <i>Goals</i>
              <i>Scholarships</i>
              <i>Test Prep</i>
            </aside>
            <div className="preview-main">
              <p className="preview-hi">Hi, Maya.</p>
              <div className="preview-grid">
                <div className="preview-card">
                  <small>Weighted GPA</small>
                  <strong className="accent">4.21</strong>
                  <div className="preview-bars">
                    <span style={{ height: "62%" }} />
                    <span style={{ height: "74%" }} />
                    <span style={{ height: "86%" }} />
                    <span style={{ height: "20%" }} className="dim" />
                  </div>
                </div>
                <div className="preview-card">
                  <small>Scholarships</small>
                  <div className="preview-pipe">
                    <span><b>6</b>Saved</span>
                    <span><b>3</b>Applying</span>
                    <span><b>2</b>Sent</span>
                  </div>
                  <div className="preview-row">
                    <em>Coolidge Scholarship</em>
                    <u>Full ride</u>
                  </div>
                  <div className="preview-row">
                    <em>Davidson Fellows</em>
                    <u>$25K+</u>
                  </div>
                </div>
                <div className="preview-card wide">
                  <small>Goals</small>
                  <div className="preview-goal"><i />Finish robotics season portfolio</div>
                  <div className="preview-goal"><i className="b" />Raise ACT math to a 30</div>
                  <div className="preview-goal done"><i className="g" />Ask Ms. Patel for a rec letter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats" aria-label="North at a glance">
        <div className="stat">
          <strong>{scholarships.length}</strong>
          <span>Scholarships researched</span>
        </div>
        <div className="stat">
          <strong>{fullRides}</strong>
          <span>Full rides or full cost</span>
        </div>
        <div className="stat">
          <strong>0</strong>
          <span>Accounts needed</span>
        </div>
        <div className="stat">
          <strong>100%</strong>
          <span>Saved on your device</span>
        </div>
      </section>

      {/* PILLARS */}
      <section className="features" id="explore">
        <div className="pillars-heading">
          <p className="section-label">Four pillars</p>
          <h2>
            Find your next step.
            <br />
            <span>Then the one after that.</span>
          </h2>
        </div>

        <div className="feature-grid">
          <Link to="/schedule" className="feature-card">
            <span className="pillar-number">01 / Plan</span>
            <h3>Plan</h3>
            <p>Explore courses and shape a balanced four-year schedule around your goals.</p>
            <span className="feature-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link to="/opportunities" className="feature-card">
            <span className="pillar-number">02 / Pursue</span>
            <h3>Pursue</h3>
            <p>Find projects, service, competitions, research and summer plans that aren't widely advertised.</p>
            <span className="feature-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link to="/resume-maker" className="feature-card">
            <span className="pillar-number">03 / Present</span>
            <h3>Present</h3>
            <p>Keep a resume that grows with you, then print it the day you need it.</p>
            <span className="feature-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link to="/test-prep" className="feature-card">
            <span className="pillar-number">04 / Prepare</span>
            <h3>Prepare</h3>
            <p>Build study habits, estimate scores and get ready for the ACT, PSAT and SAT.</p>
            <span className="feature-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="how-copy">
          <p className="section-label">How it works</p>
          <h2>
            Less searching.
            <br />
            <span>More building.</span>
          </h2>
          <p>
            North works more like a notebook than a website: open it every week and
            pick up where you left off.
          </p>
        </div>

        <ol className="how-steps">
          {steps.map((step, index) => (
            <li key={step.title} className={activeStep === index ? "open" : ""}>
              <button
                type="button"
                aria-expanded={activeStep === index}
                onClick={() => setActiveStep(index)}
              >
                <span className="how-num">{index + 1}.</span>
                {step.title}
              </button>
              {activeStep === index && (
                <div className="how-body">
                  <p>{step.text}</p>
                  <Link to={step.link.to} className="btn btn-sm">
                    {step.link.label} <span className="arrow">→</span>
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* COMPASS */}
      <section className="landing-compass">
        <div className="landing-compass-copy">
          <p className="section-label">Focus mode</p>
          <h2>
            Pick a planet.
            <br />
            <span>Light up the sky.</span>
          </h2>
          <p>
            Compass is a focus timer with ambient space music. Every session earns
            stars that unlock constellations, so you can see your study time add up.
          </p>
          <Link to="/compass" className="btn compass-landing-button">
            Enter Compass <span className="arrow">→</span>
          </Link>
        </div>

        <div className="landing-planet-preview">
          <div className="landing-orbit" aria-hidden="true" />
          <div className="landing-planet">
            <video
              className="landing-earth-video"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Earth rotating in space"
            >
              <source
                src="https://svs.gsfc.nasa.gov/vis/a000000/a002700/a002709/a002709.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="landing-planet-label">
            <span>Next destination</span>
            <strong>Earth · 25 min</strong>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="why-section">
        <div className="why-content">
          <p className="section-label">Private by default</p>
          <h2>
            Your information.
            <br />
            <span>Your device.</span>
          </h2>
        </div>
        <ul className="why-list">
          <li>
            <strong>Nothing to sign up for</strong>
            <span>Open the site and start. No email, no password.</span>
          </li>
          <li>
            <strong>Saved in your browser</strong>
            <span>Grades, resume and goals stay on this device, not a server.</span>
          </li>
          <li>
            <strong>Works offline</strong>
            <span>Install North to your home screen and use it like an app.</span>
          </li>
          <li>
            <strong>Yours to move</strong>
            <span>Download a backup file anytime and restore it on another device.</span>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>
          Ready to find
          <br />
          <span>your North?</span>
        </h2>
        <div className="home-cta-actions">
          <Link to="/me" className="btn btn-primary btn-lg">
            Open My North <span className="arrow">→</span>
          </Link>
          <ScheduleTemplateDownload className="btn btn-lg" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
