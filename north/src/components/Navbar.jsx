import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        NORTH
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/schedule">Planning a Schedule</Link>
        <Link to="/ap-classes">AP Classes</Link>
        <Link to="/gpa">GPA Calculator</Link>
      </div>

      <Link to="/courses" className="nav-button">
        Explore
      </Link>

    </nav>
  );
}

export default Navbar;