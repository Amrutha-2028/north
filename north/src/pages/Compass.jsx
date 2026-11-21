import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import FocusTimer from "../components/FocusTimer";
import ConstellationCollection from "../components/ConstellationCollection";
import WarpField from "../components/WarpField";
import "./Compass.css";

/*
  Compass: pick a planet, then focus there.
  Each planet has a small looping clip + picture for the orbit (fast to load)
  and a full video + poster for the focus scene.
*/
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
    poster: "/posters/mars-night.jpg",
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
    ringed: true,
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
].map((planet) => ({
  ...planet,
  thumb: `/planets/${planet.id}.mp4`,
  image: `/planets/${planet.id}.jpg`,
  poster: planet.poster || `/posters/${planet.video.split("/").pop().replace(".mp4", ".jpg")}`,
}));

const TAU = Math.PI * 2;
const STEP = TAU / destinations.length;

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** A planet that shows its picture instantly, then plays its loop on top. */
function PlanetMedia({ planet, className = "" }) {
  return (
    <span className={`planet-media${planet.ringed ? " is-ringed" : ""} ${className}`.trim()}>
      <img src={planet.image} alt="" draggable="false" />
      <video
        src={planet.thumb}
        poster={planet.image}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </span>
  );
}

/** Watches an element's size. Returns a callback ref and the size. */
function useSize() {
  const [node, setNode] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return [setNode, size];
}

/**
 * Planets circling the intro title. Positions are computed each frame so
 * far planets shrink and fade behind, and near ones grow and brighten.
 */
function IntroOrbit() {
  const refs = useRef([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    let frame;
    let angle = 0;
    let last = performance.now();
    const still = reduceMotion();

    const place = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      const rx = Math.min(width * 0.46, 620);
      const ry = Math.min(height * 0.2, rx * 0.26);
      const cx = width / 2;
      const cy = height * 0.52;

      refs.current.forEach((node, index) => {
        if (!node) return;
        const a = angle + (index / destinations.length) * TAU;
        const depth = Math.sin(a);
        const t = (depth + 1) / 2;
        const scale = 0.45 + t * 0.75;
        node.style.transform = `translate(${cx + Math.cos(a) * rx}px, ${cy + depth * ry}px) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = String(0.25 + t * 0.75);
        node.style.zIndex = String(Math.round(t * 10));
        node.style.filter = `blur(${((1 - t) * 1.5).toFixed(2)}px)`;
      });
    };

    const tick = (now) => {
      angle += ((now - last) / 1000) * 0.12;
      last = now;
      place();
      frame = requestAnimationFrame(tick);
    };

    place();
    if (!still) frame = requestAnimationFrame(tick);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <div className="intro-orbit" ref={wrapRef} aria-hidden="true">
      <div className="intro-orbit-ring" />
      {destinations.map((planet, index) => (
        <div
          className={`intro-orbit-body${planet.ringed ? " is-ringed" : ""}${index % 2 ? " small" : ""}`}
          key={planet.id}
          ref={(node) => {
            refs.current[index] = node;
          }}
        >
          <img src={planet.image} alt="" />
        </div>
      ))}
    </div>
  );
}

/** Eases a numeric value toward a target with requestAnimationFrame. */
function useTween(target, duration = 900) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const valueRef = useRef(target);

  useEffect(() => {
    if (reduceMotion()) {
      const frame = requestAnimationFrame(() => {
        valueRef.current = target;
        setValue(target);
      });
      return () => cancelAnimationFrame(frame);
    }
    fromRef.current = valueRef.current;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const next = fromRef.current + (target - fromRef.current) * eased;
      valueRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function Compass() {
  const [screen, setScreen] = useState("intro");
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [rotation, setRotation] = useState(2);
  const [activePlanet, setActivePlanet] = useState(null);
  const [showDuration, setShowDuration] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [warp, setWarp] = useState(false);

  const pageRef = useRef(null);
  const [stageRef, stage] = useSize();
  const animatedRotation = useTween(rotation, 1000);

  const selected = destinations[selectedIndex];

  // Mouse parallax for the starfield and scenery.
  const onPointerMove = (event) => {
    if (reduceMotion() || !pageRef.current) return;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    pageRef.current.style.setProperty("--mx", x.toFixed(3));
    pageRef.current.style.setProperty("--my", y.toFixed(3));
  };

  const enter = () => {
    if (warp) return;
    if (reduceMotion()) {
      setScreen("orbit");
      return;
    }
    setWarp(true);
    window.setTimeout(() => {
      setScreen("orbit");
      window.setTimeout(() => setWarp(false), 350);
    }, 700);
  };

  const selectPlanet = (index) => {
    if (launching) return;
    const count = destinations.length;
    // Rotate the shortest way around the ring.
    let delta = (index - selectedIndex) % count;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setRotation((current) => current + delta);
    setSelectedIndex(index);
    setShowDuration(false);
  };

  const step = (direction) =>
    selectPlanet((selectedIndex + direction + destinations.length) % destinations.length);

  const start = () => {
    if (launching) return;
    setActivePlanet(selected);
    setLaunching(true);
    if (!reduceMotion()) setWarp(true);

    window.setTimeout(() => {
      setScreen("focus");
      setLaunching(false);
      window.setTimeout(() => setWarp(false), 350);
    }, reduceMotion() ? 50 : 900);
  };

  const close = () => {
    setActivePlanet(null);
    setShowDuration(false);
    setScreen("orbit");
  };

  // Keyboard: arrow keys move around the ring on the orbit screen.
  useEffect(() => {
    if (screen !== "orbit") return undefined;
    const onKey = (event) => {
      if (event.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Planet positions on a tilted ellipse. The selected one sits at the front.
  const layout = useMemo(() => {
    const width = stage.width || 800;
    const height = stage.height || 500;
    const cx = width / 2;
    const cy = height * 0.46;
    const rx = Math.min(width * 0.44, 560);
    const ry = Math.min(height * 0.3, rx * 0.34);
    const base = Math.max(54, Math.min(width * 0.12, height * 0.2, 118));
    const ellipse = { cx, cy, rx, ry };

    const planets = destinations.map((planet, index) => {
      const angle = Math.PI / 2 + (index - animatedRotation) * STEP;
      const depth = Math.sin(angle); // 1 = front, -1 = back
      const t = (depth + 1) / 2;
      const scale = 0.5 + t * 0.62;
      return {
        planet,
        index,
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
        size: base * scale * (index === selectedIndex ? 1.25 : 1),
        z: Math.round(200 + depth * 100),
        opacity: 0.45 + t * 0.55,
        blur: (1 - t) * 1.6,
        front: depth > 0.35,
      };
    });

    return { planets, ellipse };
  }, [stage.width, stage.height, animatedRotation, selectedIndex]);

  return (
    <div
      ref={pageRef}
      className={`compass-page screen-${screen}${launching ? " is-launching" : ""}`}
      style={{ "--accent": (activePlanet || selected).accent }}
      onPointerMove={onPointerMove}
    >
      <Navbar />

      {/* Shared space backdrop: parallax star layers, nebula and shooting stars */}
      <div className="space" aria-hidden="true">
        <div className="space-nebula" />
        <div className="space-stars layer-1" />
        <div className="space-stars layer-2" />
        <div className="space-stars layer-3" />
        <span className="shooting-star s1" />
        <span className="shooting-star s2" />
        <span className="shooting-star s3" />
      </div>

      <WarpField active={warp} />

      {screen === "intro" && (
        <main className="compass-viewport intro-viewport">
          <video
            className="galaxy-video"
            src="/videos/galaxy.mp4"
            poster="/posters/galaxy.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="galaxy-overlay" />

          {/* Planets orbit the title */}
          <IntroOrbit />

          <div className="intro-copy">
            <span className="compass-eyebrow">NORTH · COMPASS</span>
            <h1>
              <span className="intro-line">Find your</span>
              <strong>orbit.</strong>
            </h1>
            <p>Your high school journey has more than one direction.</p>
            <button className="enter-compass-button" onClick={enter} type="button">
              <span className="enter-ring" aria-hidden="true" />
              Enter Compass <span aria-hidden="true">→</span>
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
          <div className="orbit-layout">
            {/* Selected planet details */}
            <aside className="orbit-panel" key={selected.id}>
              <span className="compass-eyebrow">YOUR NORTH · DESTINATIONS</span>
              <h1>
                Choose your <strong>orbit.</strong>
              </h1>

              <div className="panel-planet">
                <button
                  className="center-planet-trigger"
                  type="button"
                  onClick={() => setShowDuration((current) => !current)}
                  aria-label={`Reveal focus duration for ${selected.name}`}
                  aria-expanded={showDuration}
                  disabled={launching}
                >
                  <PlanetMedia planet={selected} />
                  <span className="trigger-hint" aria-hidden="true">
                    {showDuration ? "" : "Tap"}
                  </span>
                </button>

                <div className="panel-copy">
                  <span className="panel-env">{selected.environment}</span>
                  <h2>{selected.name}</h2>
                  <span className="panel-category">{selected.category}</span>
                </div>
              </div>

              <p className="panel-description">{selected.description}</p>

              <div className={`center-duration${showDuration ? " is-visible" : ""}`} aria-live="polite">
                {showDuration ? (
                  <>
                    <span className="duration-number">{selected.minutes}</span>
                    <span className="duration-unit">MINUTES OF FOCUS</span>
                  </>
                ) : (
                  <span className="duration-hint">Tap the planet to see how long you'll focus.</span>
                )}
              </div>

              <div className="panel-actions">
                <button
                  className="focus-here-button"
                  type="button"
                  onClick={start}
                  disabled={launching}
                >
                  {launching ? "Entering orbit" : "Focus here"}
                  <span aria-hidden="true">{launching ? "✦" : "↗"}</span>
                </button>
                <div className="panel-arrows">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous planet" disabled={launching}>
                    ←
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next planet" disabled={launching}>
                    →
                  </button>
                </div>
              </div>
            </aside>

            {/* The solar system */}
            <section className="orbit-stage" ref={stageRef} aria-label="Planet selection">
              <span className="world-count">
                <i /> 8 WORLDS
              </span>

              {/* Orbit lines drawn exactly on the planets' path, with comets */}
              <svg className="orbit-svg" aria-hidden="true">
                <ellipse className="orbit-path" cx={layout.ellipse.cx} cy={layout.ellipse.cy} rx={layout.ellipse.rx} ry={layout.ellipse.ry} />
                <ellipse className="orbit-comet" pathLength="100" cx={layout.ellipse.cx} cy={layout.ellipse.cy} rx={layout.ellipse.rx} ry={layout.ellipse.ry} />
                <ellipse className="orbit-path inner" cx={layout.ellipse.cx} cy={layout.ellipse.cy} rx={layout.ellipse.rx * 0.56} ry={layout.ellipse.ry * 0.56} />
                <ellipse className="orbit-comet inner" pathLength="100" cx={layout.ellipse.cx} cy={layout.ellipse.cy} rx={layout.ellipse.rx * 0.56} ry={layout.ellipse.ry * 0.56} />
              </svg>

              <div className="orbit-sun" aria-hidden="true">
                <span className="sun-corona" />
                <span className="sun-core" />
                <span className="sun-ring" />
              </div>

              {layout.planets.map(({ planet, index, x, y, size, z, opacity, blur, front }) => (
                <button
                  key={planet.id}
                  type="button"
                  className={`orbit-planet${index === selectedIndex ? " is-selected" : ""}${front ? " is-front" : ""}`}
                  style={{
                    "--planet-accent": planet.accent,
                    transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
                    width: size,
                    height: size,
                    zIndex: z,
                    opacity,
                    filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : "none",
                  }}
                  onClick={() => selectPlanet(index)}
                  aria-pressed={index === selectedIndex}
                  aria-label={`Select ${planet.name}`}
                  disabled={launching}
                >
                  <PlanetMedia planet={planet} />
                  <span className="orbit-planet-label">
                    <strong>{planet.name}</strong>
                    <small>{planet.minutes} min</small>
                  </span>
                </button>
              ))}
            </section>
          </div>

          <footer className="orbit-footer">
            <span>✦ Choose a world. Settle in. Begin.</span>
            <span className="orbit-keys">Use ← → to travel</span>
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
            planetPoster={activePlanet.poster}
            planetThumb={activePlanet.thumb}
            planetImage={activePlanet.image}
            ringed={activePlanet.ringed}
            constellationVideo="/videos/constellation.mp4"
            constellationPoster="/posters/constellation.jpg"
            accent={activePlanet.accent}
            onClose={close}
          />
        </main>
      )}
    </div>
  );
}
