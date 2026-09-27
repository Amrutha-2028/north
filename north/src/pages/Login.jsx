
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sparkles from "../components/Sparkles";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return (
    <div className="login-page">

      {/* Background effects */}
      <div className="login-sparkles">
        <Sparkles />
      </div>

      <div className="login-glow"></div>

      <div className="login-card">

        <div className="login-top">
          <Link to="/" className="login-logo">
            NORTH
          </Link>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>

        <p className="section-label">WELCOME BACK</p>

        <h1>
          Sign <span>In.</span>
        </h1>

        <p className="login-subtitle">
          Pick up where you left off and keep building your path.
        </p>

        <form onSubmit={handleLogin} className="login-form">

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
              placeholder="Your password"
              required
            />
          </label>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="login-signup">
          Don't have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;

