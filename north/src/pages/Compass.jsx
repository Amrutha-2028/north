import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sparkles from "../components/Sparkles";
import FocusTimer from "../components/FocusTimer";
import "./Compass.css";

const destinations = [
  {
    id: "mercury",
    name: "Mercury",
    category: "Quick Wins",
    environment: "THE FIRST LIGHT",
    description: "A place for short assignments, quick reviews, and small tasks you can finish in one focused sitting.",
    video: "/videos/mercury.mp4",
    accent: "#c2ad95",
  },
  {
    id: "venus",
    name: "Venus",
    category: "Creative Work",
    environment: "THE GOLDEN CLOUDS",
    description: "For creative experiments, writing, design, and ideas that deserve room to take shape.",
    video: "/videos/venus.mp4",
    accent: "#e7a76f",
  },
  {
    id: "earth",
    name: "Earth",
    category: "Everyday Study",
    environment: "THE GREENLANDS",
    description:
      "Start with the everyday. Homework, classes, notes, assignments, and everything happening at school.",
    video: "/videos/earth.mp4",
    accent: "#73b9ff",
  },

  {
    id: "mars",
    name: "Mars",
    category: "Deep Focus",
    environment: "THE RED FRONTIER",
    description:
      "A destination for difficult assignments, intense study sessions, and work that needs your full attention.",
    video: "/videos/mars-night.mp4",
    accent: "#e16c4d",
  },

  {
    id: "jupiter",
    name: "Jupiter",
    category: "Big Projects",
    environment: "THE GIANT",
    description:
      "For research, coding, competitions, creative projects, and ideas that take time to build.",
    video: "/videos/jupiter.mp4",
    accent: "#d9a36b",
  },
  {
    id: "saturn",
    name: "Saturn",
    category: "Planning & Routines",
    environment: "THE RINGED WORLD",
    description: "For mapping out a week, building steady routines, and keeping long-term plans in orbit.",
    video: "/videos/saturn.mp4",
    accent: "#d9b982",
  },
  {
    id: "uranus",
    name: "Uranus",
    category: "Try Something New",
    environment: "THE TILTED ORBIT",
    description: "For exploring an unfamiliar subject, testing a new approach, or following an unexpected idea.",
    video: "/videos/uranus.mp4",
    accent: "#80cbd0",
  },
  {
    id: "neptune",
    name: "Neptune",
    category: "Reflect & Reset",
    environment: "THE DEEP BLUE",
    description: "For reflection, reading, and quiet work when you need a little more space to think.",
    video: "/videos/neptune.mp4",
    accent: "#668ce8",
  },
];

function Compass() {
  const galaxyRef = useRef(null);

  const [selected, setSelected] = useState(destinations[0]);
  const [activePlanet, setActivePlanet] = useState(null);
  const [isDiving, setIsDiving] = useState(false);

  const [showGalaxy, setShowGalaxy] = useState(true);

  const [galaxySpeed, setGalaxySpeed] = useState(0.55);

  /*
   * When Compass opens, the galaxy slowly moves.
   */
  useEffect(() => {
    if (!galaxyRef.current) return;

    galaxyRef.current.playbackRate = galaxySpeed;
  }, [galaxySpeed]);

  /*
   * User chooses a destination.
   *
   * The galaxy speeds up first.
   * Then the new destination appears.
   */
  const chooseDestination = (destination) => {
    if (destination.id === selected.id || isDiving) {
      return;
    }

    setIsDiving(true);

    setGalaxySpeed(3.2);

    setTimeout(() => {
      setSelected(destination);
    }, 500);

    setTimeout(() => {
      setGalaxySpeed(0.55);
      setIsDiving(false);
    }, 1250);
  };

  /*
   * Enter Compass from the initial galaxy screen.
   */
  const enterCompass = () => {
    setGalaxySpeed(2.5);

    setTimeout(() => {
      setShowGalaxy(false);
      setGalaxySpeed(0.55);
    }, 900);
  };

  return (
    <div
      className={`compass-page destination-${selected.id} ${isDiving ? "is-diving" : ""
        }`}
      style={{
        "--accent": selected.accent,
      }}
    >
      <Navbar />

      <main>

        {/* =====================================================
            GALAXY INTRO
        ===================================================== */}

        <section
          className={`galaxy-intro ${showGalaxy ? "galaxy-visible" : "galaxy-hidden"
            }`}
        >

          <video
            ref={galaxyRef}
            className="galaxy-video"
            src="/videos/galaxy.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="galaxy-dark"></div>

          <div className="galaxy-vignette"></div>

          <div className="galaxy-content">

            <span className="compass-eyebrow">
              NORTH • COMPASS
            </span>

            <h1>
              Find your
              <strong>orbit.</strong>
            </h1>

            <p>
              Your high school journey has more than one direction.
            </p>

            <button
              className="enter-compass-button"
              onClick={enterCompass}
              type="button"
            >
              Enter Compass
              <span>→</span>
            </button>

          </div>

          <div className="galaxy-scroll">
            <span></span>
            Explore your destinations
          </div>

        </section>


        {/* =====================================================
            MAIN COMPASS
        ===================================================== */}

        <section className="compass-main">

          <div className="compass-main-background"></div>
          <Sparkles />

          <div className="compass-title">

            <span className="compass-eyebrow">
              YOUR NORTH • DESTINATIONS
            </span>

            <h2>
              Where do you want
              <strong>to go?</strong>
            </h2>

            <p>
              Pick a destination and begin your journey.
            </p>

          </div>


          {/* ===================================================
              ORBIT
          =================================================== */}

          <div className="orbit-system">

            <div className="orbit-line orbit-line-one"></div>

            <div className="orbit-line orbit-line-two"></div>

            <div className="orbit-line orbit-line-three"></div>


            {/* SMALL DESTINATIONS */}

            {destinations.map((destination, index) => {

              if (destination.id === selected.id) {
                return null;
              }

              return (
                <button
                  key={destination.id}
                  className={`orbit-destination orbit-destination-${index}`}
                  type="button"
                  onClick={() => chooseDestination(destination)}
                  aria-label={`Select ${destination.name}`}
                >

                  <VideoPlanet
                    destination={destination}
                    small
                  />

                  <span>
                    {destination.name}
                  </span>

                </button>
              );
            })}


            {/* CENTER WORLD */}


            <div className="center-destination">
              <div className="center-glow"></div>

              <button
                type="button"
                className="center-planet-button"
                onClick={() => setActivePlanet(selected)}
                aria-label={`Start a focus session on ${selected.name}`}
              >
                <VideoPlanet destination={selected} />
              </button>

              <div className="center-label">
                <small>CURRENT DESTINATION</small>
                <h3>{selected.name}</h3>
                <span>{selected.environment}</span>

                <button
                  type="button"
                  className="planet-focus-button"
                  onClick={() => setActivePlanet(selected)}
                >
                  Focus here →
                </button>
              </div>
            </div>

          </div>

        </section>


        {/* =====================================================
            DESTINATION CARDS
        ===================================================== */}

        <section className="destination-section">

          <Sparkles />

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                CHOOSE YOUR DESTINATION
              </span>

              <h2>
                Pick a world.
              </h2>

            </div>

            <p>
              Each destination represents a different kind of work
              and a different part of your North.
            </p>

          </div>


          <div className="destination-grid">

            {destinations.map((destination) => (

              <button
                key={destination.id}
                type="button"
                className={`destination-card ${selected.id === destination.id
                  ? "selected"
                  : ""
                  }`}
                onClick={() => chooseDestination(destination)}
              >

                <div className="card-video">

                  <div className="card-video-overlay"></div>

                  {destination.video ? (
                    <video
                      src={destination.video}
                      autoPlay
                      preload="auto"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className={`planet-art planet-art-${destination.id}`} aria-hidden="true" />
                  )}

                  <div className="card-planet-glow"></div>

                </div>


                <div className="card-content">

                  <span className="card-category">
                    {destination.category}
                  </span>

                  <h3>
                    {destination.name}
                  </h3>

                  <p>
                    {destination.description}
                  </p>

                  <div className="card-footer">

                    <small>
                      {destination.environment}
                    </small>

                    <span>
                      →
                    </span>

                  </div>

                </div>


                {selected.id === destination.id && (
                  <div className="selected-indicator">
                    <span>✓</span>
                  </div>
                )}

              </button>

            ))}

          </div>

        </section>


        {/* =====================================================
            SELECTED WORLD
        ===================================================== */}

        <section className="world-section">

          <div className="world-information">

            <span className="section-eyebrow">
              YOUR DESTINATION
            </span>

            <h2>
              Welcome to
              <strong>
                {selected.environment}
              </strong>
            </h2>

            <p>
              {selected.description}
            </p>


            <div className="world-tags">

              <span>
                {selected.name}
              </span>

              <span>
                {selected.category}
              </span>

              <span>
                NORTH COMPASS
              </span>

            </div>


            <button
              className="begin-journey"
              type="button"
            >
              Begin Journey
              <span>→</span>
            </button>

          </div>


          <div className="world-video-container">

            <video
              key={selected.video}
              className="world-video"
              src={selected.video}
              autoPlay
              muted
              loop
              playsInline
            />

            <div className="world-video-overlay"></div>

            <div className="world-video-glow"></div>


            <div className="world-caption">

              <small>
                CURRENT ENVIRONMENT
              </small>

              <strong>
                {selected.environment}
              </strong>

            </div>

          </div>

        </section>


        {/* =====================================================
            JOURNEY
        ===================================================== */}

        <section className="journey-section">

          <Sparkles />

          <div className="journey-heading">

            <span className="section-eyebrow">
              THE NORTH JOURNEY
            </span>

            <h2>
              You're going somewhere.
            </h2>

            <p>
              North isn't just a collection of tools.
              It's a journey through high school.
            </p>

          </div>


          <div className="journey-path">

            <JourneyStage
              number="01"
              title="The Forest"
              subtitle="BEGIN"
              description="Discover your interests and figure out where you want to go."
              active
            />

            <JourneyStage
              number="02"
              title="The Mountains"
              subtitle="EXPLORE"
              description="Build your skills, activities, and experiences."
              active
            />

            <JourneyStage
              number="03"
              title="The City"
              subtitle="BUILD"
              description="Turn your interests into real opportunities."
            />

            <JourneyStage
              number="04"
              title="The Stars"
              subtitle="LAUNCH"
              description="Take everything you've built into your future."
            />

          </div>

        </section>

      </main>


      <Footer />

      {activePlanet && (
        <div
          className="focus-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActivePlanet(null);
            }
          }}
        >
          <FocusTimer
            planet={activePlanet.name}
            onClose={() => setActivePlanet(null)}
          />
        </div>
      )}

    </div>
  );
}


/* ============================================================
   VIDEO PLANET
============================================================ */

function VideoPlanet({ destination, small = false }) {

  return (
    <div
      className={`video-planet ${small ? "video-planet-small" : ""
        }`}
    >

      <div className="video-planet-glow"></div>

      {destination.video ? (
        <video
          src={destination.video}
          autoPlay
          preload="auto"
          muted
          loop
          playsInline
        />
      ) : (
        <div className={`planet-art planet-art-${destination.id}`} aria-hidden="true" />
      )}

      <div className="video-planet-shine"></div>

    </div>
  );
}


/* ============================================================
   JOURNEY STAGE
============================================================ */

function JourneyStage({
  number,
  title,
  subtitle,
  description,
  active = false,
}) {

  return (
    <div
      className={`journey-stage ${active ? "journey-active" : ""
        }`}
    >

      <div className="journey-number">
        {number}
      </div>

      <div>

        <span className="journey-subtitle">
          {subtitle}
        </span>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}


export default Compass;
