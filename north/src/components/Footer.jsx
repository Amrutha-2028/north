import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-main">

        <div className="footer-brand">
          <div className="footer-logo">NORTH</div>

          <p>
            Your guide to planning high school,
            preparing for college, and achieving your goals.
          </p>
        </div>


        <div className="footer-column">
          <h4>Explore</h4>

          <Link to="/courses">Courses</Link>
          <Link to="/schedule">Schedule Planning</Link>
          <Link to="/ap-classes">AP Classes</Link>
          <Link to="/gpa">GPA Calculator</Link>
        </div>


        <div className="footer-column">
          <h4>North</h4>

          <Link to="/">Home</Link>
          <Link to="/courses">Resources</Link>
          <Link to="/gpa">Tools</Link>
        </div>


        <div className="footer-column">
          <h4>Contact</h4>

          <p>help@north.com</p>
          <p>Questions? We'd love to hear from you.</p>
        </div>

      </div>


      <div className="footer-bottom">
        <span>© 2026 NORTH</span>
        <span>Built for students, by students.</span>
      </div>

    </footer>
  );
}

export default Footer;
