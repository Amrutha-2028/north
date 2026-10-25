
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import "./ConstellationCollection.css";

function ConstellationArt({
  stars = [],
  connections = [],
  starsLit = 0,
  name = "Constellation",
}) {
  const validStars = Array.isArray(stars) ? stars : [];
  const validConnections = Array.isArray(connections) ? connections : [];

  return (
    <svg
      className="constellation-art"
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${name}: ${starsLit} of ${validStars.length} stars illuminated`}
    >
      <defs>
        <radialGradient id="constellation-nebula">
          <stop offset="0%" stopColor="#7897e8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7897e8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        cx="50"
        cy="50"
        rx="48"
        ry="48"
        fill="url(#constellation-nebula)"
      />

      {validConnections.map((connection, index) => {
        const [fromValue, toValue] = Array.isArray(connection)
          ? connection
          : [connection?.from ?? connection?.start, connection?.to ?? connection?.end];
        const findStar = (value) => {
          if (Number.isInteger(Number(value)) && String(value).trim() !== "") {
            return { star: validStars[Number(value)], index: Number(value) };
          }
          const index = validStars.findIndex((star) => star.name === value || star.id === value);
          return { star: validStars[index], index };
        };
        const first = findStar(fromValue);
        const second = findStar(toValue);

        if (!first.star || !second.star) return null;

        const lit = first.index < starsLit && second.index < starsLit;

        return (
          <line
            key={`line-${index}`}
            x1={first.star.x}
            y1={first.star.y}
            x2={second.star.x}
            y2={second.star.y}
            className={`constellation-line ${lit ? "lit" : ""}`}
          />
        );
      })}

      {validStars.map((star, index) => {
        const lit = index < starsLit;

        return (
          <g key={`${star.name || "star"}-${index}`}>
            {lit && (
              <circle
                cx={star.x}
                cy={star.y}
                r="4"
                className="constellation-star-halo"
              />
            )}

            <circle
              cx={star.x}
              cy={star.y}
              r={lit ? 1.8 : 1.25}
              className={`constellation-star ${lit ? "lit" : ""}`}
            >
              <title>
                {star.name || `Star ${index + 1}`}
                {lit ? " · Illuminated" : " · Not yet illuminated"}
              </title>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function ConstellationVisual({ item, featured = false }) {
  const stars = Array.isArray(item.stars) ? item.stars : [];
  const totalStars = Number(item.total_stars) || stars.length || 1;
  const starsLit = Math.min(totalStars, item.starsLit);
  const progress = Math.min(100, (starsLit / totalStars) * 100);

  return (
    <div
      className={`constellation-visual ${
        featured ? "constellation-visual-featured" : ""
      }`}
    >
      <div className="constellation-art-wrap">
        <ConstellationArt
          name={item.name}
          stars={stars}
          connections={item.connections}
          starsLit={starsLit}
        />

        <span className="constellation-art-count">
          {starsLit}/{totalStars} stars
        </span>

        {item.unlocked && (
          <span className="constellation-formed-tag">FULLY FORMED</span>
        )}
      </div>

      <div className="constellation-progress-track">
        <div
          className="constellation-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ConstellationCard({ item }) {
  return (
    <article
      className={`constellation-card ${
        item.unlocked ? "is-unlocked" : "is-forming"
      }`}
    >
      <ConstellationVisual item={item} />

      <div className="constellation-card-info">
        <div className="constellation-card-title-row">
          <h3>{item.name}</h3>
          {item.unlocked && (
            <span className="constellation-check" aria-label="Completed">
              ✓
            </span>
          )}
        </div>

        <p>{item.description}</p>

        <span className="constellation-status">
          {item.unlocked
            ? "Part of your night sky"
            : item.starsLit === 0
              ? `${item.total_stars} stars to discover`
              : `${item.total_stars - item.starsLit} more ${
                  item.total_stars - item.starsLit === 1 ? "star" : "stars"
                } to complete`}
        </span>
      </div>
    </article>
  );
}

export default function ConstellationCollection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadConstellations() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (!cancelled) {
          setError("Sign in to view your constellation collection.");
          setLoading(false);
        }
        return;
      }

      const [catalog, progress] = await Promise.all([
        supabase
          .from("constellations")
          .select(
            "id, name, description, sort_order, total_stars, stars, connections"
          )
          .order("sort_order"),

        supabase
          .from("user_constellation_progress")
          .select("constellation_id, stars_lit, unlocked_at")
          .eq("user_id", user.id),
      ]);

      if (catalog.error || progress.error) {
        if (!cancelled) {
          setError(
            catalog.error?.message ||
              progress.error?.message ||
              "Your night sky couldn't be loaded."
          );
          setLoading(false);
        }
        return;
      }

      const savedProgress = new Map(
        (progress.data || []).map((entry) => [
          entry.constellation_id,
          entry,
        ])
      );

      const result = (catalog.data || []).map((constellation) => {
        const stars = Array.isArray(constellation.stars)
          ? constellation.stars
          : [];
        const totalStars =
          Number(constellation.total_stars) || stars.length || 1;
        const saved = savedProgress.get(constellation.id);
        const starsLit = Math.min(
          totalStars,
          Math.max(0, Number(saved?.stars_lit) || 0)
        );

        return {
          ...constellation,
          stars,
          connections: Array.isArray(constellation.connections)
            ? constellation.connections
            : [],
          total_stars: totalStars,
          starsLit,
          unlocked: starsLit >= totalStars,
          unlockedAt: saved?.unlocked_at ?? null,
        };
      });

      if (!cancelled) {
        setItems(result);
        setLoading(false);
      }
    }

    loadConstellations();

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    const totalStars = items.reduce(
      (sum, item) => sum + item.total_stars,
      0
    );
    const starsLit = items.reduce(
      (sum, item) => sum + item.starsLit,
      0
    );
    const formed = items.filter((item) => item.unlocked).length;

    return { totalStars, starsLit, formed };
  }, [items]);

  if (loading) {
    return (
      <section className="constellation-collection">
        <p className="constellation-message">Mapping your night sky...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="constellation-collection">
        <p className="constellation-message">{error}</p>
      </section>
    );
  }

  const featured =
    items.find((item) => !item.unlocked) || items[0] || null;

  const remaining = featured
    ? items.filter((item) => item.id !== featured.id)
    : [];

  return (
    <section className="constellation-collection">
      <header className="constellation-header">
        <div className="constellation-heading-copy">
          <p className="constellation-eyebrow">YOUR NORTH JOURNEY</p>
          <h2>Your night sky<span>.</span></h2>
          <p className="constellation-description">
            Every star marks time you chose to focus. Keep going, and the
            patterns will emerge.
          </p>
        </div>

        <div className="constellation-count">
          <strong>{summary.formed}/{items.length}</strong>
          <span>constellations formed</span>
        </div>
      </header>

      <div className="constellation-overview" aria-label="Collection progress">
        <div className="constellation-overview-copy">
          <span>STARS ILLUMINATED</span>
          <strong>
            {summary.starsLit}
            <span> / {summary.totalStars}</span>
          </strong>
        </div>

        <div
          className="constellation-overview-track"
          role="progressbar"
          aria-label="Total constellation progress"
          aria-valuemin={0}
          aria-valuemax={summary.totalStars}
          aria-valuenow={summary.starsLit}
        >
          <div
            className="constellation-overview-fill"
            style={{
              width: `${
                summary.totalStars
                  ? (summary.starsLit / summary.totalStars) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="constellation-message">
          Your night sky is waiting for its first constellation.
        </p>
      ) : (
        <>
          {featured && (
            <section className="constellation-featured">
              <div className="constellation-featured-heading">
                <div>
                  <p className="constellation-eyebrow">
                    {featured.unlocked ? "A PART OF YOUR SKY" : "YOUR NEXT CONSTELLATION"}
                  </p>
                  <h3>{featured.name}</h3>
                </div>
                <span className="constellation-featured-progress">
                  {featured.starsLit}/{featured.total_stars}
                </span>
              </div>

              <div className="constellation-featured-content">
                <div className="constellation-featured-art">
                  <ConstellationArt
                    name={featured.name}
                    stars={featured.stars}
                    connections={featured.connections}
                    starsLit={featured.starsLit}
                  />
                </div>

                <div className="constellation-featured-details">
                  <p>{featured.description}</p>

                  <div className="constellation-progress-track">
                    <div
                      className="constellation-progress-fill"
                      style={{
                        width: `${
                          (featured.starsLit / featured.total_stars) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <span className="constellation-status">
                    {featured.unlocked
                      ? "Constellation complete. It's yours."
                      : featured.starsLit === 0
                        ? `Complete focus sessions to illuminate its ${featured.total_stars} stars.`
                        : `${
                            featured.total_stars - featured.starsLit
                          } more ${
                            featured.total_stars - featured.starsLit === 1
                              ? "star"
                              : "stars"
                          } to complete this pattern.`}
                  </span>
                </div>
              </div>
            </section>
          )}

          {remaining.length > 0 && (
            <section className="constellation-rest">
              <div className="constellation-rest-heading">
                <h3>The collection</h3>
                <span>{remaining.length} more</span>
              </div>

              <div className="constellation-grid">
                {remaining.map((item) => (
                  <ConstellationCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </section>
  );
}