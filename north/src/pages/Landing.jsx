import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sparkles from "../components/Sparkles";
import BackgroundPaths from "../components/BackgroundPaths";
import CountUp from "../components/CountUp";
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
    link: { to: "/resume-maker", label: "Open the Resume Maker" },
  },
];

const fullRides = scholarships.filter((s) => s.fullRide).length;

/** Fade sections in as they scroll into view. */
function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  useReveal();

  return (
    <div className="app">
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <Sparkles />
        <div className="hero-glow" aria-hidden="true" />

        {/* Animated compass */}
        <div className="hero-compass" aria-hidden="true">
          <div className="compass-orbit orbit-one" />
          <div className="compass-orbit orbit-two" />

          <div className="hero-compass-ring">
            <div className="hero-compass-cross horizontal" />
            <div className="hero-compass-cross vertical" />
            <div className="hero-compass-needle" />
            <div className="hero-compass-center" />
          </div>

          <span className="compass-label compass-n">N</span>
          <span className="compass-label compass-e">E</span>
          <span className="compass-label compass-s">S</span>
          <span className="compass-label compass-w">W</span>
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">YOUR HIGH SCHOOL COMPASS</p>

          <h1 className="small-hero-title">FIND YOUR</h1>
          <h1 className="hero-title">
            <span>NORTH</span>
          </h1>

          <p className="hero-subtitle">Your path. Your plans. Your direction.</p>

          <p className="hero-description">
            NORTH brings your high school journey into one place.
            Plan courses, build your schedule, track your progress,
            explore opportunities, and work toward the future you want.
          </p>

          <div className="hero-actions">
            <Link to="/me" className="btn btn-primary btn-lg">
              Open My North <span className="arrow">→</span>
            </Link>
            <a href="#explore" className="btn btn-lg secondary-button">
              Explore North
            </a>
          </div>

          <Link to="/scholarships" className="hero-badge">
            <span>New</span>
            {scholarships.length} scholarships, sorted six ways
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <span />
          Scroll to explore
          <span />
        </div>
      </section>

      {/* INTRO */}
      <section className="intro reveal" id="mission">
        <div className="intro-content">
          <p className="section-label">THE NORTH APPROACH</p>
          <h2>
            High school is a lot.
            <br />
            <span>Your plan <em>shouldn't</em> be.</span>
          </h2>
        </div>
        <p className="intro-text">
          From choosing the right classes to finding opportunities
          outside the classroom, there is a lot to keep track of.
          NORTH brings the pieces together so you can spend less
          time searching and more time building your path.
        </p>
      </section>

      {/* STATS */}
      <section className="stats reveal" aria-label="North at a glance">
        <div className="stat">
          <strong><CountUp value={scholarships.length} /></strong>
          <span>Scholarships researched</span>
        </div>
        <div className="stat">
          <strong><CountUp value={fullRides} /></strong>
          <span>Full rides or full cost</span>
        </div>
        <div className="stat">
          <strong>0</strong>
          <span>Accounts needed</span>
        </div>
        <div className="stat">
          <strong><CountUp value={100} suffix="%" /></strong>
          <span>Saved on your device</span>
        </div>
      </section>

      {/* COMPASS */}
      <section className="landing-compass reveal">
        <div className="landing-compass-copy">
          <p className="section-label">YOUR JOURNEY</p>
          <h2>
            Don't just plan
            <br />
            <span>where you're <em>going.</em></span>
          </h2>
          <p>
            Your high school experience is a journey. NORTH gives you
            a place to explore it. Choose a destination, discover
            opportunities, and keep moving toward the future you want.
          </p>
          <Link to="/compass" className="btn btn-primary compass-landing-button">
            Explore Compass <span className="arrow">→</span>
          </Link>
        </div>

        <div className="landing-planet-preview">
          <div className="landing-stars" aria-hidden="true" />
          <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
          <div className="landing-orbit landing-orbit-two" aria-hidden="true" />
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
            <span>YOUR NEXT DESTINATION</span>
            <strong>Earth</strong>
          </div>
        </div>
      </section>

      {/* FOUR PILLARS */}
      <section className="features reveal" id="explore">
        <div className="pillars-heading">
          <p className="section-label">FOUR PILLARS</p>
          <h2>Find your <em>next</em> step.</h2>
        </div>

        <div className="feature-grid">
          <Link to="/schedule" className="feature-card">
            <span className="pillar-number">01 / PLAN</span>
            <h3>Plan</h3>
            <p>Explore courses and shape a balanced high school schedule around your goals.</p>
            <span className="feature-arrow" aria-hidden="true">&#8599;</span>
          </Link>
          <Link to="/opportunities" className="feature-card">
            <span className="pillar-number">02 / PURSUE</span>
            <h3>Pursue</h3>
            <p>Find ideas for projects, service, competitions, research, and summer plans.</p>
            <span className="feature-arrow" aria-hidden="true">&#8599;</span>
          </Link>
          <Link to="/resume-maker" className="feature-card">
            <span className="pillar-number">03 / PRESENT</span>
            <h3>Present</h3>
            <p>Describe your work clearly with a resume that reflects what you actually did.</p>
            <span className="feature-arrow" aria-hidden="true">&#8599;</span>
          </Link>
          <Link to="/test-prep" className="feature-card">
            <span className="pillar-number">04 / PREPARE</span>
            <h3>Prepare</h3>
            <p>Build study habits and get ready for the tests and classes ahead.</p>
            <span className="feature-arrow" aria-hidden="true">&#8599;</span>
          </Link>
        </div>
      </section>

      {/* MAKE IT YOURS */}
      <section className="why-section reveal">
        <div className="why-content">
          <p className="section-label">MAKE IT YOURS</p>
          <h2>
            Your information.
            <br />
            <span>Your <em>direction.</em></span>
          </h2>
          <p>
            Save your GPA, resume, goals and scholarship list in My North.
            Everything stays on your device. No account, no sign-up.
          </p>
          <Link to="/me" className="btn btn-primary">
            Open My North <span className="arrow">→</span>
          </Link>
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
              <b>NORTH ✦</b>
              <i className="on">My North</i>
              <i>GPA</i>
              <i>Resume Maker</i>
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
                  <div className="preview-goal done"><i className="g" />Ask for a recommendation letter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how reveal">
        <div className="how-copy">
          <p className="section-label">HOW IT WORKS</p>
          <h2>
            Less searching.
            <br />
            <span>More <em>building.</em></span>
          </h2>
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

      {/* FINAL CTA */}
      <section className="home-cta reveal">
        <BackgroundPaths />
        <p className="section-label">START HERE</p>
        <h2>
          Ready to find
          <br />
          <span>your <em>North?</em></span>
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
