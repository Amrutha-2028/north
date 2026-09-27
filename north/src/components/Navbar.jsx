import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check whether someone is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for sign in / sign out
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

        {user && <Link to="/profile">Profile</Link>}
      </div>

      <div className="nav-actions">
        {user ? (
          <button
            className="nav-logout"
            onClick={handleLogout}
          >
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