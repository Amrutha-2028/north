import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../lib/storage";
import { navGroups } from "../lib/nav";
import "./Navbar.css";

const directLinks = [{ to: "/scholarships", label: "Scholarships" }];

function Navbar() {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile] = useProfile();
  const navRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    if (!openGroup) return undefined;

    const handlePointer = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenGroup(null);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpenGroup(null);
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openGroup]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenGroup(null);
    setMobileOpen(false);
  };

  const initial = profile.name?.trim()?.[0]?.toUpperCase();

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <Link to="/" className="logo" aria-label="North home" onClick={closeAll}>
          NORTH<span className="logo-star" aria-hidden="true">✦</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navGroups.map((group) => {
            const groupActive = group.items.some((item) => isActive(item.to));
            const open = openGroup === group.label;

            return (
              <div className="nav-group" key={group.label}>
                <button
                  type="button"
                  className={`nav-link nav-trigger${groupActive ? " active" : ""}`}
                  aria-expanded={open}
                  onClick={() => setOpenGroup(open ? null : group.label)}
                >
                  {group.label}
                  <span className="nav-caret" aria-hidden="true" />
                </button>

                {open && (
                  <div className="nav-menu">
                    {group.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`nav-menu-item${isActive(item.to) ? " active" : ""}`}
                        aria-current={isActive(item.to) ? "page" : undefined}
                        onClick={closeAll}
                      >
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {directLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link${isActive(item.to) ? " active" : ""}`}
              aria-current={isActive(item.to) ? "page" : undefined}
              onClick={closeAll}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link
            to="/me"
            className={`nav-me${isActive("/me") ? " active" : ""}`}
            onClick={closeAll}
          >
            <span className="nav-avatar" aria-hidden="true">
              {initial || "✦"}
            </span>
            My North
          </Link>

          <button
            type="button"
            className="nav-burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-sheet">
          <Link to="/me" className="nav-sheet-me" onClick={closeAll}>
            <span className="nav-avatar" aria-hidden="true">{initial || "✦"}</span>
            <span>
              <strong>My North</strong>
              <small>Profile, GPA, resume and saved scholarships</small>
            </span>
          </Link>

          {navGroups.map((group) => (
            <div className="nav-sheet-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={isActive(item.to) ? "active" : ""}
                  onClick={closeAll}
                >
                  {item.label}
                  <span>{item.desc}</span>
                </Link>
              ))}
            </div>
          ))}

          <div className="nav-sheet-group">
            <p>Money</p>
            <Link to="/scholarships" onClick={closeAll}>
              Scholarships
              <span>Filter by amount, merit, location, citizenship</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
