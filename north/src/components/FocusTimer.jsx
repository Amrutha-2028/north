
import { useEffect, useRef, useState } from "react";
import { awardConstellationStars } from "../lib/constellationRewards";
import "./FocusTimer.css";

const STAR_INTERVAL = 10 * 60;

const musicTracks = [
  {
    id: "nebula",
    name: "Nebula Drift",
    description: "Soft, floating ambience",
    src: "/music/nebula-drift.mp3",
  },
  {
    id: "starlight",
    name: "Starlight",
    description: "Dreamy cosmic atmosphere",
    src: "/music/starlight.mp3",
  },
  {
    id: "deep-space",
    name: "Deep Space",
    description: "Quiet, spacious ambience",
    src: "/music/deep-space.mp3",
  },
];

export default function FocusTimer({
  planet = "Home Planet",
  initialMinutes = 25,
  planetVideo = "/videos/earth.mp4",
  planetPoster,
  planetThumb,
  planetImage,
  ringed = false,
  constellationVideo = "/videos/constellation.mp4",
  constellationPoster,
  accent = "#73b9ff",
  onClose,
}) {
  const goalSeconds = Math.max(1, initialMinutes) * 60;

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [savedStars, setSavedStars] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [constellationReward, setConstellationReward] = useState(null);

  const [selectedMusic, setSelectedMusic] = useState("nebula");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");

  const [backgroundMode, setBackgroundMode] = useState("planet");

  const backgroundVideoRef = useRef(null);
  const audioRef = useRef(null);

  const activeTrack =
    musicTracks.find((track) => track.id === selectedMusic) ?? musicTracks[0];

  const backgroundSrc =
    backgroundMode === "planet" ? planetVideo : constellationVideo;

  // Play the selected space background.
  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video) return;

    video.playbackRate = 0.65;

    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => { });
    }
  }, [backgroundSrc]);

  // Switch soundtrack when a different track is selected.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setMusicError("");

    if (musicPlaying) {
      audio.play().catch(() => {
        setMusicPlaying(false);
        setMusicError("Couldn't play this track. Check that its file exists.");
      });
    }
  }, [selectedMusic, musicPlaying]);

  // Play or pause the soundtrack.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      audio.play().catch(() => {
        setMusicPlaying(false);
        setMusicError("Couldn't play this track. Check that its file exists.");
      });
    } else {
      audio.pause();
    }
  }, [musicPlaying]);

  // Keep the timer accurate, including after a pause and resume.
  useEffect(() => {
    if (!running || startedAt === null) return;

    const update = () => {
      const next = Math.min(
        Math.floor((Date.now() - startedAt) / 1000),
        goalSeconds
      );

      setElapsed(next);

      if (next >= goalSeconds) {
        setRunning(false);
        setStartedAt(null);
        setStatus("goal-reached");
      }
    };

    update();

    const interval = setInterval(update, 250);
    return () => clearInterval(interval);
  }, [running, startedAt, goalSeconds]);

  const formatTime = (seconds) => {
    const safe = Math.max(0, seconds);
    const minutes = Math.floor(safe / 60);
    const secs = safe % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const startTimer = () => {
    const startElapsed = elapsed >= goalSeconds ? 0 : elapsed;

    if (elapsed >= goalSeconds) {
      setElapsed(0);
      setSavedStars(0);
    }

    setStartedAt(Date.now() - startElapsed * 1000);
    setRunning(true);
    setStatus("focusing");
    setError("");
  };

  const pauseTimer = () => {
    if (startedAt !== null) {
      setElapsed(
        Math.min(Math.floor((Date.now() - startedAt) / 1000), goalSeconds)
      );
    }

    setRunning(false);
    setStartedAt(null);
    setStatus("paused");
  };

  const finishSession = async () => {
    if (status === "saving" || status === "complete") return;

    const finalElapsed = Math.min(
      running && startedAt !== null
        ? Math.floor((Date.now() - startedAt) / 1000)
        : elapsed,
      goalSeconds
    );

    setElapsed(finalElapsed);
    setRunning(false);
    setStartedAt(null);
    setError("");

    if (finalElapsed === 0) {
      setStatus("idle");
      return;
    }

    setStatus("saving");

    const stars = Math.floor(finalElapsed / STAR_INTERVAL);

    setSavedStars(stars);
    const reward = awardConstellationStars(stars);
    setConstellationReward(reward);

    setStatus("complete");
  };

  const resetTimer = () => {
    setElapsed(0);
    setRunning(false);
    setStartedAt(null);
    setSavedStars(0);
    setStatus("idle");
    setError("");
    setConstellationReward(null);
  };

  const toggleMusic = () => {
    setMusicError("");
    setMusicPlaying((current) => !current);
  };

  const remaining = Math.max(goalSeconds - elapsed, 0);
  const progress = Math.min((elapsed / goalSeconds) * 100, 100);
  const goalReached = elapsed >= goalSeconds || status === "goal-reached";
  const stars = Math.floor(elapsed / STAR_INTERVAL);

  const starSlots = Math.max(1, Math.floor(initialMinutes / 10));
  const ringRadius = 46;

  return (
    <section
      className={`focus-timer mode-${backgroundMode}${running ? " is-running" : ""}${status === "complete" ? " is-complete" : ""}`}
      style={{ "--focus-accent": accent, "--progress": progress / 100 }}
    >
      {/* Background: the planet's own footage, softened, or the constellation sky */}
      <div className="focus-background" aria-hidden="true">
        <video
          ref={backgroundVideoRef}
          key={backgroundSrc}
          className="focus-background-video"
          src={backgroundSrc}
          poster={backgroundMode === "planet" ? planetPoster : constellationPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="focus-background-tint" />
      </div>

      <div className="focus-topbar">
        {/* Scene switcher */}
        <div className="focus-scene-menu" role="group" aria-label="Background">
          <button
            type="button"
            className={`focus-scene-option ${backgroundMode === "planet" ? "active" : ""}`}
            onClick={() => setBackgroundMode("planet")}
            aria-pressed={backgroundMode === "planet"}
          >
            <span className="focus-scene-emoji" aria-hidden="true">🪐</span>
            <span className="focus-scene-label">Planet</span>
          </button>
          <button
            type="button"
            className={`focus-scene-option ${backgroundMode === "constellation" ? "active" : ""}`}
            onClick={() => setBackgroundMode("constellation")}
            aria-pressed={backgroundMode === "constellation"}
          >
            <span className="focus-scene-emoji" aria-hidden="true">✨</span>
            <span className="focus-scene-label">Constellation</span>
          </button>
        </div>

        <button className="focus-close" onClick={onClose} aria-label="Close focus timer" type="button">
          ×
        </button>
      </div>

      <div className="focus-layout">
        {/* Timer */}
        <div className="focus-main">
          <span className="focus-planet-name">{planet}</span>

          <div className="focus-clock-panel">
            <div className="focus-clock" aria-live="off">
              {formatTime(remaining)}
            </div>

            <p className="focus-progress-caption">
              {Math.min(Math.floor(elapsed / 60), initialMinutes)} of {initialMinutes} minutes completed
            </p>

            <div
              className="focus-progress"
              role="progressbar"
              aria-label="Focus goal progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <div className="focus-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="focus-timer-footer">
              <span className="focus-star-count">✦ {stars} {stars === 1 ? "star" : "stars"}</span>
              <span className="focus-goal-label">{goalReached ? "Goal reached" : `${initialMinutes} min goal`}</span>
            </div>

            {status === "complete" ? (
              <div className="focus-result">
                <h3>Session complete</h3>
                <p>
                  You earned {savedStars} {savedStars === 1 ? "star" : "stars"}.
                </p>
                {constellationReward?.newlyUnlocked.map((item) => (
                  <p key={item.id}>✦ {item.name} formed in your night sky.</p>
                ))}
                <div className="focus-actions">
                  <button className="focus-primary" onClick={resetTimer} type="button">
                    Start again
                  </button>
                  <button className="focus-secondary" onClick={onClose} type="button">
                    Exit focus
                  </button>
                </div>
              </div>
            ) : (
              <div className="focus-actions">
                {!running ? (
                  <button
                    className="focus-primary"
                    onClick={startTimer}
                    disabled={status === "saving"}
                    type="button"
                  >
                    {status === "paused" ? "Resume" : status === "goal-reached" ? "Start again" : "Begin focus"}
                  </button>
                ) : (
                  <button className="focus-primary" onClick={pauseTimer} type="button">
                    Pause
                  </button>
                )}

                {(elapsed > 0 || status === "paused" || goalReached) && (
                  <button
                    className="focus-secondary"
                    onClick={finishSession}
                    disabled={status === "saving"}
                    type="button"
                  >
                    {status === "saving" ? "Saving..." : "Finish"}
                  </button>
                )}
              </div>
            )}

            {error && (
              <p className="focus-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <p className="focus-breathe" aria-hidden="true">
            {running ? "Breathe in as the ring glows. Breathe out as it fades." : "Every 10 minutes lights a star in your sky."}
          </p>
        </div>

        {/* The planet, wrapped in an orbit that fills as you focus */}
        <div className="focus-world" aria-hidden="true">
          <div className="focus-halo" />
          <div className="focus-orbit-spin" />
          <div className={`focus-planet${ringed ? " is-ringed" : ""}`}>
            {planetImage && <img src={planetImage} alt="" />}
            {planetThumb && (
              <video src={planetThumb} poster={planetImage} autoPlay muted loop playsInline preload="auto" />
            )}
          </div>

          <svg className="focus-ring" viewBox="0 0 100 100">
            <circle className="focus-ring-track" cx="50" cy="50" r={ringRadius} />
            <circle
              className="focus-ring-fill"
              cx="50"
              cy="50"
              r={ringRadius}
              pathLength="100"
              strokeDasharray={`${progress} 100`}
            />
            {Array.from({ length: starSlots }, (_, index) => {
              const angle = (((index + 1) * 10) / initialMinutes) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const lit = stars > index;
              return (
                <text
                  key={index}
                  x={50 + Math.cos(rad) * ringRadius}
                  y={50 + Math.sin(rad) * ringRadius}
                  className={`focus-ring-star${lit ? " lit" : ""}`}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  ✦
                </text>
              );
            })}
          </svg>

          <div className="focus-satellite" style={{ transform: `rotate(${progress * 3.6}deg)` }}>
            <span />
          </div>

          {status === "complete" && (
            <div className="focus-burst">
              {Array.from({ length: 14 }, (_, index) => (
                <span key={index} style={{ "--b": index }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Music */}
      <section className="focus-music" aria-label="Focus music player">
        <div className="focus-music-bar">
          <span className={`focus-music-icon${musicPlaying ? " playing" : ""}`} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>

          <div className="focus-music-now">
            <strong>{activeTrack.name}</strong>
            <span>{musicPlaying ? "Now playing" : "Space soundtrack"}</span>
          </div>

          <button
            className="focus-music-toggle"
            onClick={toggleMusic}
            type="button"
            aria-label={musicPlaying ? "Pause music" : "Play music"}
            aria-pressed={musicPlaying}
          >
            {musicPlaying ? "Ⅱ" : "▶"}
          </button>
        </div>

        <div className="focus-music-expanded">
          <span className="focus-music-kicker">CHOOSE YOUR SOUNDTRACK</span>
          {musicTracks.map((track) => (
            <button
              key={track.id}
              type="button"
              className={`focus-track-option ${selectedMusic === track.id ? "active" : ""}`}
              onClick={() => setSelectedMusic(track.id)}
            >
              <span className="focus-track-symbol">{selectedMusic === track.id ? "◉" : "○"}</span>
              <span className="focus-track-copy">
                <strong>{track.name}</strong>
                <small>{track.description}</small>
              </span>
            </button>
          ))}
        </div>

        <audio
          ref={audioRef}
          src={activeTrack.src}
          loop
          preload="none"
          onError={() => {
            if (musicPlaying) {
              setMusicPlaying(false);
              setMusicError("Music file not found. Add the matching MP3 to public/music.");
            }
          }}
        />

        {musicError && (
          <p className="focus-music-error" role="status">
            {musicError}
          </p>
        )}
      </section>
    </section>
  );
}
