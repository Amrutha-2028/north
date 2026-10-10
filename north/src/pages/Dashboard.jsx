
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Sparkles from "../components/Sparkles";
import "./Home.css";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />

        <div className="dashboard-loading">
          <div className="dashboard-loader"></div>
          <p>Finding your North...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <Navbar />

      <div className="dashboard-background">
        <Sparkles />
        <div className="dashboard-glow"></div>
      </div>

      <main className="dashboard">

        {/* WELCOME */}
        <section className="dashboard-welcome">

          <div>
            <p className="section-label">
              MY NORTH
            </p>

            <h1>
              Welcome back
              <br />
              <span>
                {profile?.name || "Student"}.
              </span>
            </h1>

            <p className="dashboard-subtitle">
              Your path, all in one place.
            </p>
          </div>

          <Link to="/profile" className="profile-button">
            Edit Profile
            <span>↗</span>
          </Link>

        </section>

        {/* STUDENT OVERVIEW */}
        <section className="dashboard-overview">

          <div className="dashboard-info">

            <p className="section-label">
              STUDENT
            </p>

            <h2>
              {profile?.school || "Your School"}
            </h2>

            <p>
              {profile?.grade
                ? `${profile.grade}th Grade`
                : "Grade not set"}
              {" · "}
              Class of {profile?.graduation_year || "----"}
            </p>

          </div>

          <div className="dashboard-gpa">

            <p className="section-label">
              GPA
            </p>

            <strong>
              {profile?.gpa || "—"}
            </strong>

            <span>
              Current GPA
            </span>

          </div>

        </section>

        {/* COMPASS */}
        <section className="dashboard-compass">

          <div className="dashboard-compass-content">

            <div>
              <p className="section-label">
                YOUR JOURNEY
              </p>

              <h2>
                Where are you
                <br />
                <span>headed next?</span>
              </h2>

              <p>
                Choose a destination and keep building your path through
                high school.
              </p>

              <Link to="/compass" className="dashboard-compass-button">
                Open Compass
                <span>→</span>
              </Link>
            </div>

            <div className="dashboard-compass-visual">

              <div className="dashboard-mini-orbit orbit-a"></div>
              <div className="dashboard-mini-orbit orbit-b"></div>

              <div className="dashboard-mini-planet">
                <video
                  className="dashboard-earth-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Earth rotating in space"
                >
                  <source
                    src="https://svs.gsfc.nasa.gov/vis/a000000/a002700/a002709/a002709.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>

              <div className="dashboard-destination">
                <small>NEXT DESTINATION</small>
                <strong>Earth</strong>
                <span>Everyday Study</span>
              </div>

            </div>

          </div>

        </section>

        {/* YOUR NORTH */}
        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <p className="section-label">
                EXPLORE NORTH
              </p>

              <h2>
                Everything you need,
                <br />
                right here.
              </h2>
            </div>

          </div>

          <div className="quick-actions">

            <Link to="/courses" className="quick-card">
              <div>
                <h3>School</h3>
                <p>
                  Courses, schedules, APs, and academic planning.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/goals" className="quick-card">
              <div>
                <h3>Goals</h3>
                <p>
                  Decide what you want to accomplish next.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/progress" className="quick-card">
              <div>
                <h3>Progress</h3>
                <p>
                  See how your academic journey is developing.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/profile" className="quick-card">
              <div>
                <h3>Your Profile</h3>
                <p>
                  Keep your North personalized to you.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

          </div>

        </section>

        {/* NEXT STEPS */}
        <section className="dashboard-next">

          <div>

            <p className="section-label">
              NEXT
            </p>

            <h2>
              Your North is just getting started.
            </h2>

            <p>
              Add your academic information and start building
              your personalized student dashboard.
            </p>

          </div>

          <Link
            to="/profile"
            className="dashboard-primary-button"
          >
            Complete Your Profile
            <span>→</span>
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
