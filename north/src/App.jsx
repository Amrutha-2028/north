import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";
import APClasses from "./pages/APClasses";
import GPA from "./pages/GPA";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Goals from "./pages/Goals";
import Compass from "./pages/Compass";
import SubmitInfo from "./pages/SubmitInfo";

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/compass" element={<Compass />} />
        <Route path="/submit-info" element={<SubmitInfo />} />
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

    </BrowserRouter>
  );
}

export default App;