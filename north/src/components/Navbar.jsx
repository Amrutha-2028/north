
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Navbar.css";

const navItems = [
  { to: "/", label: "Home", icon: "⌂" },
  { to: "/compass", label: "Compass", icon: "✧" },
  { to: "/courses", label: "Courses", icon: "▤" },
  { to: "/schedule", label: "Planning", icon: "▦" },
  { to: "/ap-classes", label: "AP Classes", icon: "◇" },
  { to: "/gpa", label: "GPA", icon: "∿" },
  { to: "/test-prep", label: "Test Prep", icon: "◎" },
  { to: "/opportunities", label: "Opportunities", icon: "✦" },
  { to: "/resume-maker", label: "Resume Maker", icon: "✎" },
];

function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

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

        {user && (
          <Link
            to="/profile"
            className={`nav-icon-link ${
              isActive("/profile") ? "active" : ""
            }`}
            aria-label="Profile"
            aria-current={isActive("/profile") ? "page" : undefined}
            title="Profile"
          >
            <span className="nav-icon" aria-hidden="true">◉</span>
            <span className="nav-tooltip">Profile</span>
          </Link>
        )}
      </div>

      <div className="nav-actions">
        {user ? (
          <button className="nav-logout" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <Link to="/login" className="nav-button">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;