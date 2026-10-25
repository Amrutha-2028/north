import { useState } from "react";

function Sparkles() {
  const [stars] = useState(() =>
    Array.from({ length: 90 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }))
  );

  return (
    <div className="sparkle-layer">
      {stars.map((star) => (
        <span
          key={star.id}
          className="sparkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default Sparkles;