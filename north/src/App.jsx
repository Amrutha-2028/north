import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";
import APClasses from "./pages/APClasses";
import GPA from "./pages/GPA";
import Goals from "./pages/Goals";
import Compass from "./pages/Compass";
import SubmitInfo from "./pages/SubmitInfo";
import TestPrep from "./pages/TestPrep";
import Opportunities from "./pages/Opportunities";
import ResumeMaker from "./pages/ResumeMaker";
import Scholarships from "./pages/Scholarships";
import MyNorth from "./pages/MyNorth";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SignalButton() {
  const { pathname } = useLocation();
  if (pathname === "/submit-info" || pathname === "/compass") return null;

  return (
    <Link to="/submit-info" className="north-signal" aria-label="Send a signal: share feedback">
      <span className="north-signal-icon" aria-hidden="true">✦</span>
      <span className="north-signal-text">send a signal →</span>
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/me" element={<MyNorth />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/ap-classes" element={<APClasses />} />
        <Route path="/gpa" element={<GPA />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/compass" element={<Compass />} />
        <Route path="/submit-info" element={<SubmitInfo />} />
        <Route path="/test-prep" element={<TestPrep />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/resume-maker" element={<ResumeMaker />} />
        <Route path="/scholarships" element={<Scholarships />} />
      </Routes>
      <SignalButton />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
