/**
 * A slowly spinning gyroscope of rings with the page's symbol glowing in the
 * middle. Sits on the right side of page headers.
 */
function HeaderEmblem({ glyph }) {
  return (
    <div className="header-emblem" aria-hidden="true">
      <div className="emblem-ring ring-x" />
      <div className="emblem-ring ring-y" />
      <div className="emblem-ring ring-z" />
      <div className="emblem-orbit">
        <span />
      </div>
      <div className="emblem-glyph">{glyph}</div>
    </div>
  );
}

export default HeaderEmblem;
