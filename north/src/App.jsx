import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import { Analytics } from "@vercel/analytics/next"

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
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
      </Routes>

      {/* Floating utility available across North */}
      <a href="/submit-info" className="north-signal">
        <span className="north-signal-text">
          send a signal →
        </span>

        <span className="north-signal-icon">
          ✦
        </span>
      </a>

      <Analytics />
    </BrowserRouter>
  );
}

export default App;