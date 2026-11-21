/** Infinite kinetic text band. Leans with scroll speed (see --scroll-v). */
function Marquee({ items, reverse = false, outline = false, small = false }) {
  const row = [...items, ...items];
  const classes = ["marquee", reverse && "reverse", outline && "outline", small && "small"].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {row.map((item, index) => (
              <span key={`${copy}-${index}`}>
                {item}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
