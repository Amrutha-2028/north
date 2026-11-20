/*
  Flowing light paths behind headers and CTAs. Each path draws a short
  dash that travels along a curve; durations vary so the lines never sync up.
*/
const PATH_COUNT = 24;

function buildPaths(position) {
  return Array.from({ length: PATH_COUNT }, (_, i) => ({
    id: `${position}-${i}`,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    opacity: 0.08 + i * 0.012,
    duration: 14 + ((i * 7) % 11),
    delay: -((i * 3.7) % 14),
    gold: i % 6 === 3,
  }));
}

const groups = [buildPaths(1), buildPaths(-1)];

function BackgroundPaths({ className = "" }) {
  return (
    <div className={`bg-paths ${className}`.trim()} aria-hidden="true">
      {groups.map((paths, index) => (
        <svg key={index} viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
          {paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              pathLength="1"
              className={path.gold ? "bg-path gold" : "bg-path"}
              strokeWidth={path.width}
              style={{
                "--path-opacity": path.opacity,
                animationDuration: `${path.duration}s`,
                animationDelay: `${path.delay}s`,
              }}
            />
          ))}
        </svg>
      ))}
    </div>
  );
}

export default BackgroundPaths;
