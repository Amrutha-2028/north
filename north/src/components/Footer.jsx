import { Link } from "react-router-dom";
import { navGroups } from "../lib/nav";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span aria-hidden="true">✦</span> north
          </Link>
          <p>
            Plan high school, track your progress and find money for college.
            Everything you enter stays on your device.
          </p>
          <Link to="/me" className="btn btn-sm">
            Open My North <span className="arrow">→</span>
          </Link>
        </div>

        {navGroups.map((group) => (
          <div className="footer-column" key={group.label}>
            <h4>{group.label}</h4>
            {group.items.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="footer-column">
          <h4>North</h4>
          <Link to="/scholarships">Scholarships</Link>
          <Link to="/submit-info">Send a signal</Link>
          <a href="https://github.com/Amrutha-2028/north" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 North. Built for students, by students.</span>
        <span className="footer-local">
          <span className="footer-dot" aria-hidden="true" /> Your data is saved on this device only
        </span>
      </div>
    </footer>
  );
}

export default Footer;
