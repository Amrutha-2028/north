import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";
import APClasses from "./pages/APClasses";
import GPA from "./pages/GPA";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;