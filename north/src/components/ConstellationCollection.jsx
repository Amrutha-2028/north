import { useEffect, useState } from "react";
import {
  constellationCatalog,
  getConstellationProgress,
} from "../lib/constellationRewards";
import "./ConstellationCollection.css";

function ConstellationArt({ item }) {
  return (
    <svg viewBox="0 0 100 100" className="constellation-art" role="img"
      aria-label={`${item.name}: ${item.starsLit} of ${item.stars.length} stars lit`}>
      {item.connections.map(([from, to], index) => (
        <line
          key={index}
          x1={item.stars[from].x}
          y1={item.stars[from].y}
          x2={item.stars[to].x}
          y2={item.stars[to].y}
          className={from < item.starsLit && to < item.starsLit ? "lit" : ""}
        />
      ))}
      {item.stars.map((star, index) => (
        <circle
          key={index}
          cx={star.x}
          cy={star.y}
          r={index < item.starsLit ? 2 : 1.3}
          className={index < item.starsLit ? "lit" : ""}
        />
      ))}
    </svg>
  );
}

export default function ConstellationCollection() {
  const [items, setItems] = useState(getConstellationProgress);

  useEffect(() => {
    const refresh = () => setItems(getConstellationProgress());
    window.addEventListener("north-constellations-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("north-constellations-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const totalLit = items.reduce((sum, item) => sum + item.starsLit, 0);
  const totalStars = constellationCatalog.reduce(
    (sum, item) => sum + item.stars.length,
    0
  );

  return (
    <section className="constellation-collection" aria-labelledby="constellation-title">
      <div className="constellation-heading">
        <div>
          <span className="compass-eyebrow">YOUR NIGHT SKY</span>
          <h2 id="constellation-title">Light your constellations.</h2>
        </div>
        <span className="constellation-total">✦ {totalLit}/{totalStars}</span>
      </div>
      <p className="constellation-intro">
        Every {10} minutes of focus lights another star. Your progress stays on this device.
      </p>
      <div className="constellation-grid">
        {items.map((item) => (
          <article className="constellation-card" key={item.id}>
            <ConstellationArt item={item} />
            <div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span>{item.starsLit}/{item.stars.length} stars lit</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
