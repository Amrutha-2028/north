
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sparkles from "../components/Sparkles";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate("/");
    } else {
      setError(
        "Account created! Check your email to verify your account, then sign in."
      );
    }

    setLoading(false);
  };

  return (
    <div className="signup-page">

      {/* Background effects */}
      <div className="signup-sparkles">
        <Sparkles />
      </div>

      <div className="signup-glow"></div>

      <div className="signup-card">

        <div className="signup-top">
          <Link to="/" className="signup-logo">
            NORTH
          </Link>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>

        <p className="section-label">CREATE YOUR ACCOUNT</p>

        <h1>
          Welcome to <span>North.</span>
        </h1>

        <p className="signup-subtitle">
          Create your account and start building your academic path.
        </p>

        <form onSubmit={handleSignUp} className="signup-form">

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              minLength={6}
              required
            />
          </label>

          {error && (
            <p className="signup-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="signup-login">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default SignUp;

