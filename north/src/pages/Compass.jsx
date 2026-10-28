
import { useState } from "react";
import Navbar from "../components/Navbar";
import FocusTimer from "../components/FocusTimer";
import ConstellationCollection from "../components/ConstellationCollection";
import "./Compass.css";

const destinations = [
  {
    id: "mercury",
    name: "Mercury",
    category: "Quick Wins",
    environment: "THE FIRST LIGHT",
    description: "Short assignments, quick reviews, and small tasks you can finish in one focused sitting.",
    video: "/videos/mercury.mp4",
    accent: "#c2ad95",
    minutes: 20,
  },
  {
    id: "venus",
    name: "Venus",
    category: "Creative Work",
    environment: "THE GOLDEN CLOUDS",
    description: "Creative experiments, writing, design, and ideas that deserve room to take shape.",
    video: "/videos/venus.mp4",
    accent: "#e7a76f",
    minutes: 25,
  },
  {
    id: "earth",
    name: "Earth",
    category: "Everyday Study",
    environment: "THE GREENLANDS",
    description: "Homework, classes, notes, assignments, and everything happening at school.",
    video: "/videos/earth.mp4",
    accent: "#73b9ff",
    minutes: 30,
  },
  {
    id: "mars",
    name: "Mars",
    category: "Deep Focus",
    environment: "THE RED FRONTIER",
    description: "Difficult assignments, intensive studying, and work that needs your full attention.",
    video: "/videos/mars-night.mp4",
    accent: "#e16c4d",
    minutes: 40,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    category: "Big Projects",
    environment: "THE GIANT",
    description: "Research, coding, competitions, and ambitious projects that take time to build.",
    video: "/videos/jupiter.mp4",
    accent: "#d9a36b",
    minutes: 45,
  },
  {
    id: "saturn",
    name: "Saturn",
    category: "Planning & Routines",
    environment: "THE RINGED WORLD",
    description: "Map out your week, build steady routines, and keep long-term plans in orbit.",
    video: "/videos/saturn.mp4",
    accent: "#d9b982",
    minutes: 50,
  },
  {
    id: "uranus",
    name: "Uranus",
    category: "Try Something New",
    environment: "THE TILTED ORBIT",
    description: "Explore an unfamiliar subject, test a new approach, or follow an unexpected idea.",
    video: "/videos/uranus.mp4",
    accent: "#80cbd0",
    minutes: 60,
  },
  {
    id: "neptune",
    name: "Neptune",
    category: "Reflect & Reset",
    environment: "THE DEEP BLUE",
    description: "Reflection, reading, and quiet work when you need a little more space to think.",
    video: "/videos/neptune.mp4",
    accent: "#668ce8",
    minutes: 75,
  },
];

function PlanetVideo({ planet, center = false }) {
  return (
    <span
      className={[
        "planet-video",
        center ? "planet-video-center" : "",
        planet.id === "uranus" ? "planet-video-uranus" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <video
        className={planet.id === "uranus" ? "planet-footage planet-footage-uranus" : "planet-footage"}
        src={planet.video}
        autoPlay
        muted
        loop
        playsInline
        preload={center ? "auto" : "metadata"}
        aria-hidden="true"
      />
      <span className="planet-shade" />
      <span className="planet-rim" />
    </span>
  );
}

export default function Compass() {
  const [screen, setScreen] = useState("intro");
  const [selected, setSelected] = useState(destinations[2]);
  const [activePlanet, setActivePlanet] = useState(null);
  const [showDuration, setShowDuration] = useState(false);
  const [launching, setLaunching] = useState(false);

  const enter = () => setScreen("orbit");

  const selectPlanet = (planet) => {
    if (launching) return;
    setSelected(planet);
    setShowDuration(false);
  };

  const start = () => {
    if (launching) return;

    setActivePlanet(selected);
    setLaunching(true);

    window.setTimeout(() => {
      setScreen("focus");
      setLaunching(false);
    }, 850);
  };

  const close = () => {
    setActivePlanet(null);
    setShowDuration(false);
    setScreen("orbit");
  };

  return (
    <div
      className={`compass-page${launching ? " is-launching" : ""}`}
      style={{ "--accent": selected.accent }}
    >
      <Navbar />

      {screen === "intro" && (
        <main className="compass-viewport intro-viewport">
          <video
            className="galaxy-video"
            src="/videos/galaxy.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="galaxy-overlay" />
          <div className="galaxy-edge-shade" />

          <div className="intro-copy">
            <span className="compass-eyebrow">NORTH · COMPASS</span>
            <h1>
              Find your
              <strong>orbit.</strong>
            </h1>
            <p>Your high school journey has more than one direction.</p>
            <button
              className="enter-compass-button"
              onClick={enter}
              type="button"
            >
              Enter Compass <span>→</span>
            </button>
          </div>

          <div className="intro-corner-note">
            <span />
            YOUR SPACE TO FOCUS
          </div>
        </main>
      )}

      {screen === "orbit" && (
        <main className="compass-viewport orbit-viewport">
          <div className="orbit-stars" aria-hidden="true" />

          <header className="orbit-header">
            <div>
              <span className="compass-eyebrow">
                YOUR NORTH · DESTINATIONS
              </span>
              <h1>
                Choose your <strong>orbit.</strong>
              </h1>

            </div>

            <span className="world-count">
              <i /> 8 WORLDS
            </span>
          </header>

          <section className="orbit-stage" aria-label="Planet selection">
            <div className="orbit-track outer" />
            <div className="orbit-track middle" />
            <div className="orbit-track inner" />

            {destinations.map((planet) => (
              <button
                key={planet.id}
                type="button"
                className={`orbit-planet orbit-${planet.id}${selected.id === planet.id ? " is-selected" : ""
                  }`}
                style={{ "--planet-accent": planet.accent }}
                onClick={() => selectPlanet(planet)}
                aria-pressed={selected.id === planet.id}
                aria-label={`Select ${planet.name}`}
                disabled={launching}
              >
                <PlanetVideo planet={planet} />
                <span className="orbit-planet-duration">{planet.minutes} min</span>

              </button>
            ))}

            <div className="orbit-center">
              <div className="center-glow" />

              <button
                className="center-planet-trigger"
                type="button"
                onClick={() => setShowDuration((current) => !current)}
                aria-label={`Reveal focus duration for ${selected.name}`}
                aria-expanded={showDuration}
                disabled={launching}
              >
                <PlanetVideo planet={selected} center />
              </button>

              <div className="center-details">
                <div className="center-title-row">
                  <h2>{selected.name}</h2>
                  <button
                    className="focus-here-button"
                    type="button"
                    onClick={start}
                    disabled={launching}
                  >
                    {launching ? "Entering orbit" : "Focus here"}
                    <span>{launching ? "✦" : "↗"}</span>
                  </button>
                </div>

                <div
                  className={`center-duration${showDuration ? " is-visible" : ""}`}
                  aria-live="polite"
                >
                  {showDuration && (
                    <>
                      <span className="duration-number">
                        {selected.minutes}
                      </span>
                      <span className="duration-unit">MINUTES OF FOCUS</span>
                    </>
                  )}
                </div>

              </div>
            </div>
          </section>

          <footer className="orbit-footer">
            <span>✦ Choose a world. Settle in. Begin.</span>

          </footer>
          <ConstellationCollection />
        </main>
      )}

      {screen === "focus" && activePlanet && (
        <main className="compass-viewport focus-viewport">
          <FocusTimer
            key={activePlanet.id}
            planet={activePlanet.name}
            initialMinutes={activePlanet.minutes}
            planetVideo={activePlanet.video}
            constellationVideo="/videos/constellation.mp4"
            accent={activePlanet.accent}
            onClose={close}
          />
        </main>
      )}
    </div>
  );
}
