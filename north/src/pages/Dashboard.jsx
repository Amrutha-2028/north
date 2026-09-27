
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

        {/* QUICK ACTIONS */}
        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <p className="section-label">
                QUICK ACTIONS
              </p>

              <h2>
                What are you working on?
              </h2>
            </div>

          </div>

          <div className="quick-actions">

            <Link to="/courses" className="quick-card">
              <span className="quick-number">01</span>

              <div>
                <h3>Explore Courses</h3>
                <p>
                  Browse courses and plan what comes next.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/schedule" className="quick-card">
              <span className="quick-number">02</span>

              <div>
                <h3>Plan Your Schedule</h3>
                <p>
                  Build a balanced schedule for your year.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/ap-classes" className="quick-card">
              <span className="quick-number">03</span>

              <div>
                <h3>Explore AP Classes</h3>
                <p>
                  Compare AP courses and prepare ahead.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/gpa" className="quick-card">
              <span className="quick-number">04</span>

              <div>
                <h3>Check Your GPA</h3>
                <p>
                  Calculate and track your academic progress.
                </p>
              </div>

              <span className="quick-arrow">↗</span>
            </Link>

          </div>

        </section>

        {/* YOUR NORTH */}
        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <p className="section-label">
                YOUR NORTH
              </p>

              <h2>
                Keep building your path.
              </h2>
            </div>

          </div>

          <div className="dashboard-grid">

            <div className="dashboard-card">

              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">
                  ◇
                </span>

                <span className="dashboard-card-status">
                  START HERE
                </span>
              </div>

              <h3>
                Courses
              </h3>

              <p>
                Your courses and academic plans will live here.
              </p>

              <Link to="/courses">
                Explore courses →
              </Link>

            </div>

            <div className="dashboard-card">

              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">
                  +
                </span>

                <span className="dashboard-card-status">
                  PLANNING
                </span>
              </div>

              <h3>
                Schedule
              </h3>

              <p>
                Build your schedule and keep track of your plans.
              </p>

              <Link to="/schedule">
                Plan your schedule →
              </Link>

            </div>

            <div className="dashboard-card">

              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">
                  ◎
                </span>

                <span className="dashboard-card-status">
                  GOALS
                </span>
              </div>

              <h3>
                Your Goals
              </h3>

              <p>
                <p>
                  Set priorities, track deadlines, and keep moving toward what matters.
                </p>
              </p>

              <Link to="/goals">
                View your goals →
              </Link>

            </div>

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
