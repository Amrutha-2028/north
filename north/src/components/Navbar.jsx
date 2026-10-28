
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { to: "/", label: "Home", icon: "⌂" },
  { to: "/compass", label: "Compass", icon: "✧" },
  { to: "/courses", label: "Courses", icon: "▤" },
  { to: "/schedule", label: "Planning", icon: "▦" },
  { to: "/ap-classes", label: "AP Classes", icon: "◇" },
  { to: "/gpa", label: "GPA", icon: "∿" },
  { to: "/test-prep", label: "Test Prep", icon: "◎" },
  { to: "/opportunities", label: "Extracurriculars", icon: "✦" },
  { to: "/resume-maker", label: "Resume Maker", icon: "✎" },
];

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path ||
      location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" aria-label="North home">
        NORTH<span className="logo-star">✦</span>
      </Link>

      <div className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-icon-link ${
              isActive(item.to) ? "active" : ""
            }`}
            aria-label={item.label}
            aria-current={isActive(item.to) ? "page" : undefined}
            title={item.label}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="nav-tooltip">{item.label}</span>
          </Link>
        ))}

      </div>

      <div className="nav-actions" aria-hidden="true" />
    </nav>
  );
}

export default Navbar;