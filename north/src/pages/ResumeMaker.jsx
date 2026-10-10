
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sparkles from "../components/Sparkles";
import "./ResumeMaker.css";

const makeEntry = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: "",
  organization: "",
  dates: "",
  details: "",
});

const makeSection = (title) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title,
  entries: [makeEntry()],
});

const initialSections = () => [
  makeSection("EDUCATION & PROGRAMS"),
  makeSection("TECHNICAL SKILLS"),
  makeSection("PROFESSIONAL & TECHNICAL EXPERIENCE"),
  makeSection("LEADERSHIP & COMMUNITY SERVICE"),
  makeSection("AWARDS & HONORS"),
];

const blankResume = () => ({
  name: "",
  graduationYear: "",
  gpa: "",
  email: "",
  phone: "",
  location: "",
  sections: initialSections(),
});

const exampleResume = {
  name: "Amrutha Sree Murahari",
  graduationYear: "2028",
  gpa: "Weighted GPA: 4.56",
  email: "",
  phone: "",
  location: "",
  sections: [
    {
      id: "example-education",
      title: "EDUCATION & PROGRAMS",
      entries: [
        {
          id: "example-code2college",
          title: "Code2College Participant",
          organization: "",
          dates: "2026–Present",
          details: "",
        },
      ],
    },
    {
      id: "example-skills",
      title: "TECHNICAL SKILLS",
      entries: [
        {
          id: "example-programs",
          title: "Computer Programs",
          organization: "",
          dates: "",
          details: "OnShape, Canva, Google Docs, Google Slides, Google Sheets",
        },
        {
          id: "example-languages",
          title: "Programming Languages",
          organization: "",
          dates: "",
          details: "Java, JavaScript, HTML, CSS, Python",
        },
        {
          id: "example-spoken",
          title: "Spoken Languages",
          organization: "",
          dates: "",
          details: "English (Proficient), Telugu (Proficient), French (Conversational)",
        },
      ],
    },
    {
      id: "example-experience",
      title: "PROFESSIONAL & TECHNICAL EXPERIENCE",
      entries: [
        {
          id: "example-dance",
          title: "Dance Teacher and Choreographer",
          organization: "City of Franklin",
          dates: "2023–Present",
          details:
            "Taught dance choreography and techniques to students preparing for performances.\nOrganized rehearsals and assisted with performance coordination.",
        },
        {
          id: "example-webmaster",
          title: "Team Captain & Web Developer",
          organization: "TSA Webmaster & Engineering Projects",
          dates: "2024–Present",
          details:
            "Led teams in TSA Webmaster and Software Development at regional and state-level conferences.\nDeveloped competition websites using HTML, CSS, and JavaScript in collaboration with teammates.",
        },
        {
          id: "example-c2c",
          title: "Software Development Essentials",
          organization: "Code2College",
          dates: "2026–Present",
          details:
            "Completed a nine-week web programming course covering basic and advanced Python concepts.\nDeveloped technical projects in Python using intermediate concepts.\nAttended professional development workshops focused on time management, professional skills, and technical portfolio development.",
        },
      ],
    },
    {
      id: "example-leadership",
      title: "LEADERSHIP & COMMUNITY SERVICE",
      entries: [
        {
          id: "example-tsa",
          title: "Team Captain",
          organization: "Technology Student Association",
          dates: "2024–Present",
          details:
            "Led teams to regional and state-level placements through project development and collaboration.\nOrganized meetings and schedules to help teams complete tasks on time.",
        },
        {
          id: "example-library",
          title: "Library Volunteer and Workshop Leader",
          organization: "John P. Holt Brentwood Library",
          dates: "2024–Present",
          details:
            "Helped organize teen and community events, library events, and book fairs, and assisted with shelving books.\nLed calligraphy, mandala art, and other creative workshops for adults and teens.",
        },
        {
          id: "example-badminton",
          title: "Vice President and Co-Founder",
          organization: "Badminton Club",
          dates: "",
          details:
            "Helped organize tournaments, meetings, and club activities.\nManage communication and scheduling for members and events.",
        },
        {
          id: "example-cr3w",
          title: "CR3W Volunteer",
          organization: "Adventure Science Center & iCode at Franklin",
          dates: "2024–Present",
          details:
            "Supported summer camps and educational enrichment programs.\nAssisted younger students with robotics, STEM, and game development activities.",
        },
      ],
    },
    {
      id: "example-awards",
      title: "AWARDS & HONORS",
      entries: [
        {
          id: "example-award1",
          title: "1st Place, State Webmaster",
          organization: "Tennessee TSA",
          dates: "2025",
          details: "",
        },
        {
          id: "example-award2",
          title: "2nd Place, State Software Development",
          organization: "Tennessee TSA",
          dates: "2026",
          details: "",
        },
        {
          id: "example-award3",
          title: "1st Place, State Robot Tour",
          organization: "Science Olympiad",
          dates: "2026",
          details: "",
        },
        {
          id: "example-award4",
          title: "2nd Place, State Engineering CAD",
          organization: "Science Olympiad",
          dates: "2026",
          details: "",
        },
        {
          id: "example-award5",
          title: "Silver Achievement Award",
          organization: "TSA",
          dates: "2026",
          details: "",
        },
        {
          id: "example-award6",
          title: "Teacher Choice Award",
          organization: "AP Computer Science Principles",
          dates: "2026",
          details: "",
        },
      ],
    },
  ],
};

function hasEntryContent(entry) {
  return [entry.title, entry.organization, entry.dates, entry.details]
    .some((value) => value?.trim());
}

function ResumeSection({ section }) {
  const entries = section.entries.filter(hasEntryContent);
  if (!entries.length) return null;

  return (
    <section className="rm-paper-section">
      <h3>{section.title}</h3>

      {entries.map((entry) => (
        <div className="rm-paper-entry" key={entry.id}>
          <div className="rm-paper-entry-heading">
            <strong>{entry.title}</strong>
            {entry.dates && <span>{entry.dates}</span>}
          </div>

          {entry.organization && (
            <div className="rm-paper-organization">
              {entry.organization}
            </div>
          )}

          {entry.details && (
            <ul className="rm-paper-bullets">
              {entry.details
                .split("\n")
                .map((line) => line.replace(/^[\s•*-]+/, "").trim())
                .filter(Boolean)
                .map((line, index) => <li key={index}>{line}</li>)}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

export default function ResumeMaker() {
  const [resume, setResume] = useState(blankResume);
  const [showExample, setShowExample] = useState(false);

  const updateResume = (field, value) => {
    setResume((current) => ({ ...current, [field]: value }));
  };

  const updateSection = (sectionId, updater) => {
    setResume((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? updater(section) : section
      ),
    }));
  };

  const updateEntry = (sectionId, entryId, field, value) => {
    updateSection(sectionId, (section) => ({
      ...section,
      entries: section.entries.map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const addEntry = (sectionId) => {
    updateSection(sectionId, (section) => ({
      ...section,
      entries: [...section.entries, makeEntry()],
    }));
  };

  const removeEntry = (sectionId, entryId) => {
    updateSection(sectionId, (section) => ({
      ...section,
      entries: section.entries.filter((entry) => entry.id !== entryId),
    }));
  };

  const addSection = () => {
    const title = window.prompt(
      "What should this section be called?\nExamples: Research, Certifications, Publications"
    );

    if (!title?.trim()) return;

    setResume((current) => ({
      ...current,
      sections: [...current.sections, makeSection(title.trim().toUpperCase())],
    }));
  };

  const removeSection = (sectionId) => {
    setResume((current) => ({
      ...current,
      sections: current.sections.filter((section) => section.id !== sectionId),
    }));
  };

  const loadExample = () => {
    setResume({
      ...exampleResume,
      sections: exampleResume.sections.map((section) => ({
        ...section,
        entries: section.entries.map((entry) => ({ ...entry })),
      })),
    });
    setShowExample(true);
  };

  const startBlank = () => {
    setResume(blankResume());
    setShowExample(false);
  };

  return (
    <div className="rm-page">
      <Sparkles />
      <Navbar />

      <main className="rm-main">
        <header className="rm-header">
          <div className="rm-eyebrow">NORTH CAREER TOOLKIT</div>
          <h1>
            Your experience.
            <br />
            <span>Your next opportunity.</span>
          </h1>
          <p>
            Build a resume that reflects what you have learned, created, and
            contributed. Start with an example or make your own from scratch.
          </p>

          <div className="rm-header-actions">
            <button className="rm-primary-button" onClick={loadExample} type="button">
              View example resume
            </button>
            <button className="rm-secondary-button" onClick={startBlank} type="button">
              Start from scratch
            </button>
          </div>
          {showExample && (
            <p className="rm-example-note">
              Example loaded. Edit any field to make this resume your own.
            </p>
          )}
        </header>

        <div className="rm-workspace">
          <div className="rm-editor">
            <div className="rm-panel-heading">
              <div>
                <span className="rm-step-label">STEP 01</span>
                <h2>Build your resume</h2>
              </div>
              <span className="rm-live-indicator"><span /> Live preview</span>
            </div>

            <section className="rm-form-section">
              <h3>Header & contact</h3>
              <p className="rm-help">
                Keep your heading simple. A city and state are usually enough;
                you do not need to include your full home address.
              </p>

              <label className="rm-field">
                Full name
                <input
                  value={resume.name}
                  onChange={(e) => updateResume("name", e.target.value)}
                  placeholder="Your full name"
                />
              </label>

              <div className="rm-field-grid">
                <label className="rm-field">
                  Graduation year
                  <input
                    value={resume.graduationYear}
                    onChange={(e) => updateResume("graduationYear", e.target.value)}
                    placeholder="2028"
                  />
                </label>
                <label className="rm-field">
                  GPA or academic note
                  <input
                    value={resume.gpa}
                    onChange={(e) => updateResume("gpa", e.target.value)}
                    placeholder="Weighted GPA: 4.56"
                  />
                </label>
              </div>

              <div className="rm-field-grid">
                <label className="rm-field">
                  Email
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => updateResume("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="rm-field">
                  Phone (optional)
                  <input
                    type="tel"
                    value={resume.phone}
                    onChange={(e) => updateResume("phone", e.target.value)}
                    placeholder="Your phone number"
                  />
                </label>
              </div>

              <label className="rm-field">
                City, State (optional)
                <input
                  value={resume.location}
                  onChange={(e) => updateResume("location", e.target.value)}
                  placeholder="City, State"
                />
              </label>
            </section>

            {resume.sections.map((section, sectionIndex) => (
              <section className="rm-form-section" key={section.id}>
                <div className="rm-section-editor-heading">
                  <div>
                    <span className="rm-section-number">
                      {String(sectionIndex + 1).padStart(2, "0")}
                    </span>
                    <h3>{section.title}</h3>
                  </div>
                  <button
                    type="button"
                    className="rm-text-button rm-remove-section"
                    onClick={() => removeSection(section.id)}
                    aria-label={`Remove ${section.title} section`}
                  >
                    Remove section
                  </button>
                </div>

                {section.entries.map((entry, entryIndex) => (
                  <div className="rm-activity-card" key={entry.id}>
                    <div className="rm-activity-top">
                      <span>ACTIVITY {entryIndex + 1}</span>
                      <button
                        type="button"
                        className="rm-text-button"
                        onClick={() => removeEntry(section.id, entry.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <label className="rm-field">
                      Role, award, school, or skill category
                      <input
                        value={entry.title}
                        onChange={(e) =>
                          updateEntry(section.id, entry.id, "title", e.target.value)
                        }
                        placeholder="e.g. Team Captain"
                      />
                    </label>

                    <div className="rm-field-grid">
                      <label className="rm-field">
                        Organization (optional)
                        <input
                          value={entry.organization}
                          onChange={(e) =>
                            updateEntry(
                              section.id,
                              entry.id,
                              "organization",
                              e.target.value
                            )
                          }
                          placeholder="Club, school, or organization"
                        />
                      </label>
                      <label className="rm-field">
                        Dates (optional)
                        <input
                          value={entry.dates}
                          onChange={(e) =>
                            updateEntry(section.id, entry.id, "dates", e.target.value)
                          }
                          placeholder="2025–Present"
                        />
                      </label>
                    </div>

                    <label className="rm-field">
                      Details or accomplishments
                      <textarea
                        rows={3}
                        value={entry.details}
                        onChange={(e) =>
                          updateEntry(section.id, entry.id, "details", e.target.value)
                        }
                        placeholder={"Describe what you did.\nUse a new line for each accomplishment."}
                      />
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  className="rm-add-button"
                  onClick={() => addEntry(section.id)}
                >
                  <span>+</span> Add activity
                </button>
              </section>
            ))}

            <button type="button" className="rm-add-section-button" onClick={addSection}>
              <span>+</span>
              Add a whole new section
            </button>

            <div className="rm-editor-actions">
              <button type="button" className="rm-secondary-button" onClick={startBlank}>
                Clear resume
              </button>
              <button
                type="button"
                className="rm-primary-button"
                onClick={() => window.print()}
              >
                Print / Save PDF ↗
              </button>
            </div>

            <p className="rm-privacy-note">
              Your resume is edited in this page and is not sent to an AI service.
              Save a PDF before refreshing, because this version does not save entries.
            </p>
          </div>

          <aside className="rm-preview-panel">
            <div className="rm-preview-heading">
              <div>
                <span className="rm-step-label">STEP 02</span>
                <h2>Your resume</h2>
              </div>
              <span className="rm-preview-tag">LIVE</span>
            </div>

            <div className="rm-paper" id="resume-paper">
              <header className="rm-paper-header">
                <h1>{resume.name || "Your Name"}</h1>
                {resume.graduationYear && (
                  <div className="rm-paper-class">
                    HIGH SCHOOL STUDENT · CLASS OF {resume.graduationYear}
                  </div>
                )}
                {(resume.gpa || resume.email || resume.phone || resume.location) && (
                  <div className="rm-paper-contact">
                    {[resume.gpa, resume.email, resume.phone, resume.location]
                      .filter(Boolean)
                      .join("  |  ")}
                  </div>
                )}
              </header>

              {resume.sections.map((section) => (
                <ResumeSection section={section} key={section.id} />
              ))}

              {!resume.name &&
                !resume.gpa &&
                !resume.email &&
                !resume.phone &&
                !resume.location &&
                !resume.sections.some((section) =>
                  section.entries.some(hasEntryContent)
                ) && (
                  <div className="rm-empty-preview">
                    <span>✦</span>
                    <p>Your resume will take shape here.</p>
                    <small>
                      Add your education, projects, activities, skills, or awards.
                      Work experience is only one way to show what you can do.
                    </small>
                  </div>
                )}
            </div>

            <p className="rm-preview-caption">
              Check the PDF before submitting it. Keep entries accurate and
              tailor your resume to each opportunity.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
