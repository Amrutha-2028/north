
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { awardConstellationStars } from "../lib/constellationRewards";
import "./FocusTimer.css";

const STAR_INTERVAL = 10 * 60;

function FocusTimer({ planet = "Home Planet", onClose }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [savedStars, setSavedStars] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [constellationReward, setConstellationReward] = useState(null);

  useEffect(() => {
    if (!running || startedAt === null) return;

    const updateTimer = () => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [running, startedAt]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const startTimer = () => {
    setStartedAt(Date.now() - elapsed * 1000);
    setRunning(true);
    setStatus("focusing");
    setError("");
  };

  const pauseTimer = () => {
    // Capture the latest elapsed time before pausing.
    if (startedAt !== null) {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }

    setRunning(false);
    setStartedAt(null);
    setStatus("paused");
  };

  const finishSession = async () => {
    if (status === "saving" || status === "complete") return;

    // Capture elapsed time accurately at the moment of finishing.
    const finalElapsed =
      running && startedAt !== null
        ? Math.floor((Date.now() - startedAt) / 1000)
        : elapsed;

    setElapsed(finalElapsed);
    setRunning(false);
    setStartedAt(null);
    setError("");
    setConstellationReward(null);

    if (finalElapsed === 0) {
      setStatus("idle");
      return;
    }

    setStatus("saving");

    const stars = Math.floor(finalElapsed / STAR_INTERVAL);
    const completedMinutes = Math.floor(finalElapsed / 60);

    // Save the focus session first.
    const { error: saveError } = await supabase
      .from("focus_sessions")
      .insert({
        planet,
        duration_seconds: finalElapsed,
        stars_earned: stars,
      });

    if (saveError) {
      console.error("Could not save focus session:", saveError);
      setError(
        "Your session couldn't be saved. Please try again."
      );
      setStatus("paused");
      return;
    }

    setSavedStars(stars);

    // Only award constellation progress for completed 10-minute intervals.
    if (stars > 0) {
      try {
        const reward = await awardConstellationStars(completedMinutes);

        setConstellationReward({
          starsEarned: reward.stars_earned,
          newlyUnlocked: reward.newly_unlocked ?? [],
        });
      } catch (rewardError) {
        console.error(
          "Session saved, but constellation rewards failed:",
          rewardError
        );

        setError(
          "Your session was saved, but your constellation progress couldn't update. Please check your connection before trying again."
        );
      }
    }

    // The session is saved, even if the separate reward call failed.
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

  const starsThisSession = Math.floor(elapsed / STAR_INTERVAL);
  const progress = ((elapsed % STAR_INTERVAL) / STAR_INTERVAL) * 100;

  return (
    <section className="focus-timer">
      <button
        className="focus-close"
        onClick={onClose}
        aria-label="Close focus timer"
      >
        ×
      </button>

      <p className="focus-eyebrow">NORTH / FOCUS ORBIT</p>

      <div className="focus-planet" aria-hidden="true">
        <span>✦</span>
      </div>

      <h2>{planet}</h2>

      <p className="focus-subtitle">
        Every ten minutes brings a new star.
      </p>

      <div className="focus-clock" aria-live="off">
        {formatTime(elapsed)}
      </div>

      <div className="focus-progress">
        <div
          className="focus-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="focus-stats">
        <div>
          <strong>{starsThisSession}</strong>
          <span>Stars earned</span>
        </div>

        <div>
          <strong>
            {Math.floor(elapsed / STAR_INTERVAL) * 10}
            <span className="focus-unit"> min</span>
          </strong>
          <span>Completed focus</span>
        </div>
      </div>

      {status === "complete" ? (
        <div className="focus-complete">
          <div className="focus-complete-star">✦</div>
          <h3>Orbit complete.</h3>

          <p>
            You earned {savedStars}{" "}
            {savedStars === 1 ? "star" : "stars"} this session.
          </p>

          {constellationReward?.newlyUnlocked?.length > 0 ? (
            <div className="focus-new-constellation">
              <p className="focus-eyebrow">
                NEW CONSTELLATION FORMED
              </p>

              {constellationReward.newlyUnlocked.map((item) => (
                <h3 key={item.id}>{item.name}</h3>
              ))}

              <p>
                Your new constellation is waiting in
                Profile → Constellations.
              </p>
            </div>
          ) : constellationReward ? (
            <p>
              Your stars have been added to your constellation
              collection. Visit your profile to see your progress.
            </p>
          ) : savedStars === 0 ? (
            <p>
              Keep going in your next session to earn your first star.
            </p>
          ) : (
            <p>
              Your session was saved. Check your connection if your
              constellation progress hasn't updated.
            </p>
          )}

          <button
            className="focus-primary"
            onClick={resetTimer}
          >
            Start another session
          </button>
        </div>
      ) : (
        <div className="focus-actions">
          {!running ? (
            <button
              className="focus-primary"
              onClick={startTimer}
              disabled={status === "saving"}
            >
              {status === "paused" ? "Resume focus" : "Begin focus"}
            </button>
          ) : (
            <button
              className="focus-primary"
              onClick={pauseTimer}
            >
              Pause session
            </button>
          )}

          {(elapsed > 0 || status === "paused") && (
            <button
              className="focus-secondary"
              onClick={finishSession}
              disabled={status === "saving"}
            >
              {status === "saving"
                ? "Saving session..."
                : "Finish & save"}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="focus-error" role="alert">
          {error}
        </p>
      )}

      <p className="focus-footnote">
        One star per completed 10 minutes. Paused time doesn't count.
      </p>
    </section>
  );
}

export default FocusTimer;