import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  KEYS,
  clearAll,
  exportAll,
  importAll,
  storageSizeKb,
  useProfile,
  usePersistentState,
} from "../lib/storage";
import { computeGpa, countCourses, createGpaState, formatGpa, yearLabels, yearOrder } from "../lib/gpa";
import {
  STATE_NAMES,
  TRACK_STATUSES,
  matchScholarship,
  monthsUntil,
  scholarships,
} from "../lib/scholarships";
import { getConstellationProgress } from "../lib/constellationRewards";
import { useInstall } from "../lib/install";
import "./MyNorth.css";

const CITIZENSHIP_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "citizen", label: "US citizen or national" },
  { value: "permanent-resident", label: "Permanent resident (green card)" },
  { value: "daca", label: "DACA recipient" },
  { value: "undocumented", label: "Undocumented or TPS" },
  { value: "international", label: "International student (visa)" },
];

const PROFILE_FIELDS = ["name", "school", "grade", "gradYear", "state", "citizenship", "intendedMajor", "interests"];

function MyNorth() {
  const [profile, updateProfile] = useProfile();
  const [gpaState] = usePersistentState(KEYS.gpa, createGpaState);
  const [resume] = usePersistentState(KEYS.resume, null);
  const [goals] = usePersistentState(KEYS.goals, []);
  const [tracked] = usePersistentState(KEYS.scholarships, {});
  const [constellations, setConstellations] = useState(getConstellationProgress);
  const [dataMessage, setDataMessage] = useState("");
  const fileInput = useRef(null);
  const install = useInstall();

  useEffect(() => {
    const refresh = () => setConstellations(getConstellationProgress());
    window.addEventListener("north-constellations-updated", refresh);
    return () => window.removeEventListener("north-constellations-updated", refresh);
  }, []);

  const field = (key) => ({
    value: profile[key] ?? "",
    onChange: (e) => updateProfile({ [key]: e.target.value }),
  });

  const filled = PROFILE_FIELDS.filter((key) => String(profile[key] || "").trim()).length;
  const completeness = Math.round((filled / PROFILE_FIELDS.length) * 100);

  // GPA
  const unweighted = computeGpa(gpaState, false);
  const weighted = computeGpa(gpaState, true);
  const courses = countCourses(gpaState);

  // Scholarships
  const trackedMap = tracked && typeof tracked === "object" ? tracked : {};
  const trackedList = scholarships
    .filter((s) => trackedMap[s.id]?.status)
    .sort((a, b) => (monthsUntil(a) ?? 99) - (monthsUntil(b) ?? 99));
  const matchCount = scholarships.filter((s) => matchScholarship(s, profile).ok).length;
  const hasMatchInfo = Boolean(profile.grade || profile.state || profile.citizenship);

  // Resume
  const resumeSections = Array.isArray(resume?.sections) ? resume.sections : [];
  const resumeEntries = resumeSections.reduce(
    (total, section) =>
      total + (section.entries || []).filter((entry) => entry.title || entry.details).length,
    0
  );
  const resumeStarted = Boolean(resume?.name || resumeEntries);

  // Goals
  const goalList = Array.isArray(goals) ? goals : [];
  const openGoals = goalList.filter((goal) => !goal.completed);
  const doneGoals = goalList.length - openGoals.length;

  // Focus
  const starsLit = constellations.reduce((total, c) => total + c.starsLit, 0);
  const starsTotal = constellations.reduce((total, c) => total + c.stars.length, 0);

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `north-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDataMessage("Backup downloaded. Keep it somewhere safe, like Google Drive or iCloud.");
  };

  const restoreBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const count = importAll(JSON.parse(await file.text()));
      setConstellations(getConstellationProgress());
      setDataMessage(`Restored ${count} saved item${count === 1 ? "" : "s"} from your backup.`);
    } catch (error) {
      setDataMessage(error.message || "That file couldn't be read.");
    }
  };

  const deleteEverything = () => {
    if (window.confirm("Delete your profile, GPA, resume, goals and saved scholarships from this device?")) {
      clearAll();
      setConstellations(getConstellationProgress());
      setDataMessage("Everything North saved on this device was deleted.");
    }
  };

  const firstName = profile.name.trim().split(/\s+/)[0];

  return (
    <div className="app">
      <Navbar />

      <main className="me-page">
        <header className="me-header">
          <div>
            <p className="section-label">My North</p>
            <h1>{firstName ? `Hi, ${firstName}.` : "Your North, in one place."}</h1>
            <p>
              Your profile, GPA, resume, goals and scholarships. Saved on this device
              only. No account, nothing uploaded.
            </p>
          </div>

          <div className="me-header-actions">
            {!install.installed && install.canPrompt && (
              <button type="button" className="btn btn-accent" onClick={install.promptInstall}>
                Install app
              </button>
            )}
            <button type="button" className="btn" onClick={downloadBackup}>
              Back up data
            </button>
          </div>
        </header>

        <div className="me-grid">
          {/* PROFILE */}
          <section className="me-card me-profile">
            <div className="me-card-head">
              <div>
                <h2>Profile</h2>
                <p>Used to fill your resume and match scholarships.</p>
              </div>
              <div className="me-progress" aria-label={`Profile ${completeness}% complete`}>
                <svg viewBox="0 0 36 36" aria-hidden="true">
                  <circle cx="18" cy="18" r="15" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    className="me-progress-fill"
                    style={{ strokeDashoffset: 94.25 - (94.25 * completeness) / 100 }}
                  />
                </svg>
                <span>{completeness}%</span>
              </div>
            </div>

            <div className="me-form">
              <label className="field me-span-2">
                Full name
                <input {...field("name")} placeholder="Your name" autoComplete="name" />
              </label>
              <label className="field me-span-2">
                School
                <input {...field("school")} placeholder="Your high school" />
              </label>
              <label className="field">
                Grade
                <select {...field("grade")}>
                  <option value="">Choose</option>
                  <option value="9">9th (Freshman)</option>
                  <option value="10">10th (Sophomore)</option>
                  <option value="11">11th (Junior)</option>
                  <option value="12">12th (Senior)</option>
                </select>
              </label>
              <label className="field">
                Class of
                <input {...field("gradYear")} inputMode="numeric" placeholder="2028" maxLength={4} />
              </label>
              <label className="field">
                State
                <select {...field("state")}>
                  <option value="">Choose</option>
                  {Object.entries(STATE_NAMES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Citizenship status
                <select {...field("citizenship")}>
                  {CITIZENSHIP_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field me-span-2">
                Intended major or field
                <input {...field("intendedMajor")} placeholder="e.g. Computer science, nursing, undecided" />
              </label>
              <label className="field me-span-2">
                Interests
                <input {...field("interests")} placeholder="e.g. robotics, debate, volunteering" />
              </label>
              <label className="field me-span-2">
                Email for your resume (optional)
                <input {...field("email")} type="email" placeholder="you@example.com" autoComplete="email" />
              </label>
            </div>

            <p className="me-fine">
              Citizenship and state only filter scholarships on this device. They are never sent anywhere.
            </p>
          </section>

          {/* GPA */}
          <section className="me-card me-gpa">
            <div className="me-card-head">
              <h2>GPA</h2>
              <Link to="/gpa" className="me-open">Edit →</Link>
            </div>
            <div className="me-stats">
              <div>
                <strong>{formatGpa(unweighted)}</strong>
                <span>Unweighted</span>
              </div>
              <div>
                <strong className="accent">{formatGpa(weighted)}</strong>
                <span>Weighted</span>
              </div>
            </div>
            {courses > 0 ? (
              <div className="me-years">
                {yearOrder.map((year) => {
                  const value = computeGpa(gpaState, true, [year]);
                  const height = value ? Math.min(100, (value / 5) * 100) : 4;
                  return (
                    <div className="me-year" key={year}>
                      <div className="me-bar">
                        <span style={{ height: `${height}%` }} className={value ? "" : "empty"} />
                      </div>
                      <small>{yearLabels[year].slice(0, 2)}</small>
                      <em>{formatGpa(value)}</em>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="me-empty">Add your grades to see your GPA by year.</p>
            )}
            <p className="me-fine">{courses} course{courses === 1 ? "" : "s"} entered</p>
          </section>

          {/* SCHOLARSHIPS */}
          <section className="me-card me-sch">
            <div className="me-card-head">
              <h2>Scholarships</h2>
              <Link to="/scholarships" className="me-open">Browse →</Link>
            </div>

            <div className="me-pipeline">
              {TRACK_STATUSES.map((status) => (
                <div key={status.id}>
                  <strong>{trackedList.filter((s) => trackedMap[s.id].status === status.id).length}</strong>
                  <span>{status.label}</span>
                </div>
              ))}
            </div>

            {trackedList.length > 0 ? (
              <ul className="me-list">
                {trackedList.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      <span>
                        <strong>{s.name}</strong>
                        <small>{s.deadline}</small>
                      </span>
                      <em>{s.amount}</em>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="me-empty">
                {hasMatchInfo
                  ? `${matchCount} scholarships fit your profile. Save some to track them here.`
                  : "Add your grade, state and citizenship to see which scholarships fit you."}
              </p>
            )}
          </section>

          {/* RESUME */}
          <section className="me-card">
            <div className="me-card-head">
              <h2>Resume</h2>
              <Link to="/resume-maker" className="me-open">{resumeStarted ? "Edit →" : "Start →"}</Link>
            </div>
            <div className="me-stats">
              <div>
                <strong>{resumeEntries}</strong>
                <span>Entries</span>
              </div>
              <div>
                <strong>{resumeSections.length}</strong>
                <span>Sections</span>
              </div>
            </div>
            <p className="me-empty">
              {resumeStarted
                ? "Add to it every time you join a club, win something or finish a project."
                : "Start now and add to it all through high school. It'll be ready when applications are."}
            </p>
          </section>

          {/* GOALS */}
          <section className="me-card">
            <div className="me-card-head">
              <h2>Goals</h2>
              <Link to="/goals" className="me-open">Open →</Link>
            </div>
            <div className="me-stats">
              <div>
                <strong>{openGoals.length}</strong>
                <span>In progress</span>
              </div>
              <div>
                <strong>{doneGoals}</strong>
                <span>Done</span>
              </div>
            </div>
            {openGoals.length > 0 ? (
              <ol className="me-goals">
                {openGoals.slice(0, 3).map((goal) => (
                  <li key={goal.id} style={{ "--goal-color": goal.color }}>
                    {goal.title}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="me-empty">No open goals. Add one and it'll show up here.</p>
            )}
          </section>

          {/* FOCUS */}
          <section className="me-card">
            <div className="me-card-head">
              <h2>Focus</h2>
              <Link to="/compass" className="me-open">Compass →</Link>
            </div>
            <div className="me-stats">
              <div>
                <strong>
                  {starsLit}
                  <small>/{starsTotal}</small>
                </strong>
                <span>Stars lit</span>
              </div>
              <div>
                <strong>{constellations.filter((c) => c.starsLit === c.stars.length).length}</strong>
                <span>Constellations</span>
              </div>
            </div>
            <div className="me-stars" aria-hidden="true">
              {Array.from({ length: starsTotal }, (_, index) => (
                <span key={index} className={index < starsLit ? "lit" : ""} />
              ))}
            </div>
          </section>

          {/* DATA + INSTALL */}
          <section className="me-card me-data">
            <div className="me-card-head">
              <div>
                <h2>Your data</h2>
                <p>Stored in this browser ({storageSizeKb()} KB). Clearing site data or switching devices removes it, so back up now and then.</p>
              </div>
            </div>

            <div className="me-data-actions">
              <button type="button" className="btn btn-sm" onClick={downloadBackup}>
                Download backup
              </button>
              <button type="button" className="btn btn-sm" onClick={() => fileInput.current?.click()}>
                Restore from file
              </button>
              <button type="button" className="btn btn-sm me-danger" onClick={deleteEverything}>
                Delete everything
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={restoreBackup}
              />
            </div>
            {dataMessage && <p className="me-message" role="status">{dataMessage}</p>}

            <div className="me-install">
              <strong>{install.installed ? "Installed on this device" : "Use North like an app"}</strong>
              <p>
                {install.installed
                  ? "You're running North from your home screen. It works offline too."
                  : install.isIOS
                    ? "In Safari, tap Share, then Add to Home Screen. North opens full-screen and works offline."
                    : install.canPrompt
                      ? "Install North to open it from your home screen or dock. It works offline."
                      : "Use your browser menu's Install or Add to Home Screen option to open North like an app."}
              </p>
            </div>
          </section>
        </div>

        {completeness < 100 && (
          <p className="me-footnote">
            Tip: fill in your profile, then use <Link to="/resume-maker">Fill from My North</Link> in the resume maker.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyNorth;
