
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sparkles from "../components/Sparkles";
import { Link } from "react-router-dom";
import ScheduleTemplateDownload from "../components/ScheduleTemplateDownload";

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

            

            <a href="#explore" className="secondary-button">
              Explore North
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
          THE NORTH APPROACH
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
      {/* COMPASS */}
      <section className="landing-compass">

        <div className="landing-compass-copy">

          <p className="section-label">
            YOUR JOURNEY
          </p>

          <h2>
            Don't just plan
            <br />
            <span>where you're going.</span>
          </h2>

          <p>
            Your high school experience is a journey. NORTH gives you
            a place to explore it. Choose a destination, discover
            opportunities, and keep moving toward the future you want.
          </p>

          <Link to="/compass" className="compass-landing-button">
            Explore Compass
            <span>→</span>
          </Link>

        </div>

        <div className="landing-planet-preview">

          <div className="landing-stars"></div>

          <div className="landing-orbit landing-orbit-one"></div>
          <div className="landing-orbit landing-orbit-two"></div>

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
      <section className="features" id="explore">
        <div className="pillars-heading">
          <p className="section-label">FOUR PILLARS</p>
          <h2>Find your next step.</h2>
        </div>
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
      </section>

      {/* PERSONALIZATION */}
      <section className="why-section">

        <p className="section-label">
          MAKE IT YOURS
        </p>

        <div className="why-content">

          <h2>
            Your information.
            <br />
            <span>Your direction.</span>
          </h2>

          

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="home-cta">

        <p className="section-label">
          START HERE
        </p>

        <h2>
          Ready to find
          <br />
          <span>your North?</span>
        </h2>

       

        <ScheduleTemplateDownload />

      </section>

      <Footer />

    </div>
  );
}

export default Landing;
