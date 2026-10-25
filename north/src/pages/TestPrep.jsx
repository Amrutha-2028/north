import { useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sparkles from "../components/Sparkles";
import "./TestPrep.css";

const ACT_SECTIONS = [
  { key: "english", label: "English", total: 50, description: "Grammar, punctuation, and rhetoric" },
  { key: "math", label: "Math", total: 45, description: "Algebra, geometry, and advanced math" },
  { key: "reading", label: "Reading", total: 36, description: "Comprehension and evidence" },
  { key: "science", label: "Science", total: 40, description: "Data interpretation and scientific reasoning" },
];

const PSAT_SECTIONS = [
  { key: "rw", label: "Reading and Writing", total: 54 },
  { key: "math", label: "Math", total: 44 },
];

const ACT_ADVICE = [
  {
    title: "English",
    subtitle: "Learn the rules, then recognize the patterns.",
    tips: [
      "Build a personal grammar guide from your prep book. Include punctuation, sentence boundaries, subject-verb agreement, verb tense, pronouns, and modifiers.",
      "After each practice set, write down the exact rule behind every mistake. Do not settle for remembering the answer.",
      "Practice the same grammar concept repeatedly until you can recognize it quickly in a new sentence.",
      "Pay attention to transitions and rhetorical questions. The grammatically correct answer is not always the choice that best fits the paragraph.",
    ],
  },
  {
    title: "Math",
    subtitle: "Understand the concept before racing the clock.",
    tips: [
      "Review a concept and work through examples before doing a large set of questions.",
      "Keep an error log for topics such as functions, geometry, trigonometry, probability, and advanced algebra.",
      "If the earlier questions feel comfortable, spend more practice time on the harder problems you tend to miss.",
      "When you review a wrong answer, solve it again without looking at the solution. Then explain why your method works.",
    ],
  },
  {
    title: "Reading",
    subtitle: "Choose what the passage supports, not what sounds reasonable.",
    tips: [
      "Find direct evidence for your answer in the passage. A choice can sound sensible in real life and still be wrong for this question.",
      "Practice identifying the main idea, the author's purpose, the function of a detail, and the meaning of a word in context.",
      "If two answers seem possible, compare them against the exact wording of the passage.",
      "Review your timing after practice. Test different passage-reading approaches and keep the one that helps you stay accurate.",
    ],
  },
  {
    title: "Science",
    subtitle: "Read the evidence carefully.",
    tips: [
      "Read graph titles, axis labels, units, legends, and table headings before interpreting the data.",
      "Look at what the question asks, then find the relevant figure or passage information. You do not always need to read every sentence first.",
      "Practice describing trends precisely: increases, decreases, stays constant, or changes only under certain conditions.",
      "For conflicting viewpoints, identify each researcher's claim and how the viewpoints differ.",
      "Science is reported separately and does not count toward the ACT Composite, but it may still matter for your STEM score or other goals.",
    ],
  },
];

const PSAT_ADVICE = [
  {
    title: "Reading and Writing",
    tips: [
      "Practice vocabulary in context, transitions, rhetorical synthesis, central ideas, and evidence questions.",
      "For grammar, learn the rule behind the answer instead of memorizing individual questions.",
      "For transitions, identify the logical relationship between the sentences before choosing a word.",
      "For evidence questions, use what the passage actually supports rather than what you already know about the topic.",
    ],
  },
  {
    title: "Math",
    tips: [
      "Prioritize your weakest topics. Algebra, advanced math, problem-solving and data analysis, and geometry and trigonometry all matter.",
      "Review the concept first, then solve similar questions without help.",
      "When you get a question wrong, identify whether the issue was the concept, setup, calculation, or time pressure.",
      "Practice with the built-in tools in Bluebook so using the digital testing interface feels familiar.",
    ],
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// These are deliberately approximate estimates, not official score conversions.
// Actual ACT raw-to-scaled conversions depend on the test form.
function estimateActScore(correct, total) {
  const ratio = clamp(correct / total, 0, 1);
  return Math.round(1 + 35 * Math.pow(ratio, 0.9));
}

// A simple rough estimate for the digital PSAT/NMSQT.
// The official raw-to-scaled conversion is not a fixed percentage formula.
function estimatePsatScore(correct, total) {
  const ratio = clamp(correct / total, 0, 1);
  return clamp(Math.round((160 + ratio * 600) / 10) * 10, 160, 760);
}

function SectionSlider({
  label,
  description,
  total,
  value,
  onChange,
  accent = "blue",
  showPercent = true,
}) {
  const percentage = Math.round((value / total) * 100);

  return (
    <div className={`tp-slider-card tp-slider-card--${accent}`}>
      <div className="tp-slider-heading">
        <div>
          <h4>{label}</h4>
          {description && <p>{description}</p>}
        </div>

        <div className="tp-slider-count">
          <strong>{value}</strong>
          <span>/ {total}</span>
        </div>
      </div>

      <input
        className="tp-range"
        type="range"
        min="0"
        max={total}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${label}: number correct`}
      />

      <div className="tp-slider-footer">
        <span>0 correct</span>
        {showPercent && <span>{percentage}% correct</span>}
        <span>{total} correct</span>
      </div>
    </div>
  );
}

function ScoreTile({ label, score, caption, highlight = false }) {
  return (
    <div className={`tp-score-tile ${highlight ? "tp-score-tile--highlight" : ""}`}>
      <span className="tp-score-label">{label}</span>
      <strong className="tp-score-number">{score}</strong>
      {caption && <span className="tp-score-caption">{caption}</span>}
    </div>
  );
}

function AdviceCard({ number, title, subtitle, tips }) {
  return (
    <article className="tp-advice-card">
      {number && <span className="tp-card-number">{number}</span>}
      <h3>{title}</h3>
      {subtitle && <p className="tp-card-subtitle">{subtitle}</p>}
      <ul>
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </article>
  );
}

export default function TestPrep() {
  const calculatorRef = useRef(null);

  const [activeTab, setActiveTab] = useState("act");

  const [actCorrect, setActCorrect] = useState({
    english: 35,
    math: 30,
    reading: 27,
    science: 29,
  });

  const [psatCorrect, setPsatCorrect] = useState({
    rw: 43,
    math: 33,
  });

  const [indexScores, setIndexScores] = useState({
    rw: 700,
    math: 700,
  });

  const actScores = useMemo(() => {
    return Object.fromEntries(
      ACT_SECTIONS.map((section) => [
        section.key,
        estimateActScore(actCorrect[section.key], section.total),
      ])
    );
  }, [actCorrect]);

  const actComposite = Math.round(
    (actScores.english + actScores.math + actScores.reading) / 3
  );

  const psatScores = useMemo(() => {
    return Object.fromEntries(
      PSAT_SECTIONS.map((section) => [
        section.key,
        estimatePsatScore(psatCorrect[section.key], section.total),
      ])
    );
  }, [psatCorrect]);

  const estimatedPsatTotal = psatScores.rw + psatScores.math;

  const selectionIndex = Math.round(
    (2 * indexScores.rw + indexScores.math) / 10
  );

  const scrollToCalculator = () => {
    setActiveTab("act");
    calculatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const updateAct = (key, value) => {
    setActCorrect((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updatePsat = (key, value) => {
    setPsatCorrect((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateIndexScore = (key, value) => {
    setIndexScores((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="testprep-page">
      <div className="tp-background" aria-hidden="true">
        <div className="tp-background-glow tp-background-glow--one" />
        <div className="tp-background-glow tp-background-glow--two" />
        <div className="tp-sparkles">
          <Sparkles />
        </div>
      </div>

      <Navbar />

      <main className="tp-main">
        <section className="tp-hero">
          <div className="tp-eyebrow">
            <span className="tp-eyebrow-dot" />
            ACT AND PSAT TEST PREP
          </div>

          <h1>ACT and PSAT Test Prep</h1>

          <p className="tp-hero-description">
            Standardized tests can feel like a maze when nobody has shown you
            the map. Find strategies that actually help, learn from every
            mistake, and build a plan that works for you.
          </p>

          <div className="tp-hero-actions">
            <button
              className="tp-button tp-button--primary"
              onClick={scrollToCalculator}
              type="button"
            >
              Try the score calculators
              <span aria-hidden="true">↓</span>
            </button>

            <a className="tp-text-link" href="#tp-start">
              Explore the guide <span aria-hidden="true">↘</span>
            </a>
          </div>

          <div className="tp-hero-note">
            <span className="tp-note-icon" aria-hidden="true">
              ✦
            </span>
            <p>
              You don't need to study every hour of every day. You need to
              understand what you're missing and know what to do next.
            </p>
          </div>
        </section>

        <section className="tp-section tp-start-section" id="tp-start">
          <div className="tp-section-heading">
            <span className="tp-kicker">START HERE</span>
            <h2>Study smarter, not just longer.</h2>
            <p>
              A practice test is not a verdict. It is information. The goal is
              to turn that information into your next move.
            </p>
          </div>

          <div className="tp-principle-grid">
            <article className="tp-principle-card">
              <span className="tp-principle-icon" aria-hidden="true">
                ◉
              </span>
              <h3>Find the pattern</h3>
              <p>
                Look for the concept behind a mistake. Missing three questions
                about transitions tells you more than simply knowing you got
                three questions wrong.
              </p>
            </article>

            <article className="tp-principle-card">
              <span className="tp-principle-icon" aria-hidden="true">
                ↗
              </span>
              <h3>Practice with a purpose</h3>
              <p>
                Choose practice that targets a real weakness. Repeating
                questions you already understand may feel productive without
                improving your score much.
              </p>
            </article>

            <article className="tp-principle-card">
              <span className="tp-principle-icon" aria-hidden="true">
                ✧
              </span>
              <h3>Learn from every test</h3>
              <p>
                Review the questions you missed, guessed on, or solved slowly.
                Those questions can reveal what to practice next.
              </p>
            </article>
          </div>
        </section>

        <section className="tp-section">
          <div className="tp-section-heading">
            <span className="tp-kicker">THE RED-GREEN-PENCIL METHOD</span>
            <h2>Make every mistake useful.</h2>
            <p>
              Use three colors when reviewing a practice test. The point isn't
              to make pretty notes. It is to make the next question easier.
            </p>
          </div>

          <div className="tp-review-method">
            <article className="tp-review-step tp-review-step--red">
              <span className="tp-review-letter">R</span>
              <div>
                <h3>Red: What went wrong?</h3>
                <p>
                  Mark the question you missed or guessed on. Write down what
                  you originally thought and why it seemed reasonable.
                </p>
              </div>
            </article>

            <article className="tp-review-step tp-review-step--green">
              <span className="tp-review-letter">G</span>
              <div>
                <h3>Green: What is the correct reasoning?</h3>
                <p>
                  Work through the solution. Identify the rule, concept, or
                  evidence that makes the correct answer work.
                </p>
              </div>
            </article>

            <article className="tp-review-step tp-review-step--pencil">
              <span className="tp-review-letter">P</span>
              <div>
                <h3>Pencil: What will I do next time?</h3>
                <p>
                  Write one short reminder, such as “check whether the
                  transition shows contrast” or “read the graph's units first.”
                </p>
              </div>
            </article>
          </div>

          <div className="tp-callout">
            <span aria-hidden="true">✦</span>
            <p>
              <strong>Don't skip the review.</strong> Taking another practice
              test can help, but reviewing the last one is what tells you how
              to improve.
            </p>
          </div>
        </section>

        <section className="tp-section">
          <div className="tp-section-heading">
            <span className="tp-kicker">ACT PREP</span>
            <h2>Train for each section.</h2>
            <p>
              Work on the skill behind the question, then practice applying it
              under realistic timing.
            </p>
          </div>

          <div className="tp-advice-grid">
            {ACT_ADVICE.map((section) => (
              <AdviceCard key={section.key || section.title} {...section} />
            ))}
          </div>

          <div className="tp-info-panel">
            <div>
              <span className="tp-kicker">KNOW YOUR COMPOSITE</span>
              <h3>Science is separate from the Composite.</h3>
            </div>
            <p>
              The ACT Composite is calculated from English, Math, and Reading.
              Science is reported separately. It can still be relevant to your
              STEM score and to colleges or programs that consider it.
            </p>
          </div>

          <div className="tp-info-panel tp-info-panel--secondary">
            <div>
              <span className="tp-kicker">WHAT IS A SUPERSCORE?</span>
              <h3>Your best section scores can come from different tests.</h3>
            </div>
            <p>
              If a college accepts ACT superscores, it may combine your
              highest eligible English, Math, and Reading scores from separate
              test dates to calculate a new Composite. For example, your best
              English score might come from your first test, while your best
              Math score comes from your second. Policies vary, so check each
              college's rules.
            </p>
          </div>
        </section>

        <section className="tp-section">
          <div className="tp-section-heading">
            <span className="tp-kicker">PSAT / SAT PREP</span>
            <h2>Use your practice results as a map.</h2>
            <p>
              The digital PSAT has Reading and Writing and Math sections.
              Practice by skill, not just by how many questions you can finish.
            </p>
          </div>

          <div className="tp-advice-grid tp-advice-grid--two">
            {PSAT_ADVICE.map((section) => (
              <AdviceCard key={section.title} {...section} />
            ))}
          </div>

          <div className="tp-info-panel">
            <div>
              <span className="tp-kicker">PRACTICE RESOURCES</span>
              <h3>Use real practice, then study the gaps.</h3>
            </div>
            <div className="tp-resource-links">
              <a
                href="https://bluebook.collegeboard.org/"
                target="_blank"
                rel="noreferrer"
              >
                Bluebook practice tests <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://satsuitequestionbank.collegeboard.org/"
                target="_blank"
                rel="noreferrer"
              >
                SAT Suite Question Bank <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.khanacademy.org/test-prep/sat"
                target="_blank"
                rel="noreferrer"
              >
                Khan Academy SAT practice <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html"
                target="_blank"
                rel="noreferrer"
              >
                Official ACT prep resources <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="tp-section tp-national-merit">
          <div className="tp-section-heading">
            <span className="tp-kicker">NATIONAL MERIT</span>
            <h2>What does the PSAT Selection Index mean?</h2>
            <p>
              For eligible students, the PSAT/NMSQT can be the entry point to
              the National Merit Scholarship Program. The Selection Index is
              used to identify high-scoring students for recognition.
            </p>
          </div>

          <div className="tp-merit-flow">
            <article className="tp-merit-step">

              <h3>Take the PSAT/NMSQT</h3>
              <p>
                National Merit consideration is tied to the PSAT/NMSQT and
                program eligibility requirements. Other PSAT versions do not
                serve as the qualifying test for the competition.
              </p>
            </article>

            <article className="tp-merit-step">

              <h3>Calculate your Selection Index</h3>
              <p>
                The formula doubles your Reading and Writing section score,
                adds your Math section score, and divides the result by 10.
                The index is not the same as your total PSAT score.
              </p>
              <div className="tp-formula">
                (2 × Reading and Writing + Math) ÷ 10
              </div>
            </article>

            <article className="tp-merit-step">

              <h3>Semifinalist selection</h3>
              <p>
                National Merit allocates Semifinalist places across states and
                other selection units. Cutoffs differ by state and can change
                from year to year. A previous cutoff is a reference point, not
                a guarantee for a future class.
              </p>
            </article>

            <article className="tp-merit-step">

              <h3>Complete the Finalist requirements</h3>
              <p>
                Semifinalists who want to advance must complete the official
                application through their school. Requirements include an
                academic record, school endorsement and recommendation,
                student information and an essay, plus SAT score confirmation
                and other eligibility requirements specified by National
                Merit. Meeting the cutoff alone does not automatically make
                someone a Finalist.
              </p>
            </article>
          </div>

          <div className="tp-merit-note">
            <strong>Important:</strong> Use the Selection Index to understand
            your standing, not as a promise of Semifinalist status. Always
            check the official instructions for your graduating class and
            confirm deadlines with your school counselor.
            <a
              href="https://www.nationalmerit.org/"
              target="_blank"
              rel="noreferrer"
            >
              Visit National Merit Scholarship Corporation ↗
            </a>
          </div>
        </section>

        <section className="tp-section tp-planning-section">
          <div className="tp-section-heading">
            <span className="tp-kicker">BUILD A ROUTINE</span>
            <h2>A starting plan, not another obligation.</h2>
            <p>
              Adjust this example around school, activities, sleep, and the
              amount of time you actually have. It is a menu, not a checklist
              you have to complete perfectly.
            </p>
          </div>

          <div className="tp-plan-grid">
            <article className="tp-plan-card">
              <span>BASELINE</span>
              <h3>Take a practice test</h3>
              <p>
                Start with one timed test or a full section. Record your score
                and note the topics that felt hardest.
              </p>
            </article>

            <article className="tp-plan-card">
              <span>REVIEW</span>
              <h3>Find the patterns</h3>
              <p>
                Review wrong, guessed, and slow questions. Group mistakes by
                concept instead of treating each one as unrelated.
              </p>
            </article>

            <article className="tp-plan-card">
              <span>PRACTICE</span>
              <h3>Target your weak spots</h3>
              <p>
                Do focused practice for the skills that need attention. Ask for
                an explanation when you do not understand why an answer works.
              </p>
            </article>

            <article className="tp-plan-card">
              <span>RECHECK</span>
              <h3>Try another timed set</h3>
              <p>
                Check whether the same mistakes are happening. Change your
                approach based on what the new results show.
              </p>
            </article>
          </div>
        </section>

        <section
          className="tp-section tp-calculators-section"
          id="tp-calculators"
          ref={calculatorRef}
        >
          <div className="tp-section-heading">
            <span className="tp-kicker">SCORE CALCULATORS</span>
            <h2>Let's see where you are.</h2>
            <p>
              Move the sliders to match your practice test. Your estimates
              update automatically. For the most accurate result, use the
              conversion table provided with your specific test.
            </p>
          </div>

          <div className="tp-calculator-tabs" role="tablist" aria-label="Score calculators">
            <button
              className={`tp-tab ${activeTab === "act" ? "tp-tab--active" : ""}`}
              onClick={() => setActiveTab("act")}
              type="button"
              role="tab"
              aria-selected={activeTab === "act"}
            >
              ACT calculator
            </button>

            <button
              className={`tp-tab ${activeTab === "psat" ? "tp-tab--active" : ""}`}
              onClick={() => setActiveTab("psat")}
              type="button"
              role="tab"
              aria-selected={activeTab === "psat"}
            >
              PSAT calculator
            </button>

            <button
              className={`tp-tab ${activeTab === "index" ? "tp-tab--active" : ""}`}
              onClick={() => setActiveTab("index")}
              type="button"
              role="tab"
              aria-selected={activeTab === "index"}
            >
              Selection Index
            </button>
          </div>

          {activeTab === "act" && (
            <div className="tp-calculator-panel" role="tabpanel">
              <div className="tp-calculator-intro">
                <div>
                  <span className="tp-kicker">ACT</span>
                  <h3>How many did you get right?</h3>
                  <p>
                    Drag each slider to your number correct. The section scores
                    below are estimates, not official ACT conversions.
                  </p>
                </div>
                <span className="tp-calculator-icon" aria-hidden="true">
                  ↗
                </span>
              </div>

              <div className="tp-slider-list">
                {ACT_SECTIONS.map((section) => (
                  <SectionSlider
                    key={section.key}
                    label={section.label}
                    description={section.description}
                    total={section.total}
                    value={actCorrect[section.key]}
                    onChange={(value) => updateAct(section.key, value)}
                  />
                ))}
              </div>

              <div className="tp-results-panel">
                <div className="tp-results-heading">
                  <span className="tp-kicker">YOUR ESTIMATED SCORES</span>
                  <p>Updated as you move the sliders.</p>
                </div>

                <div className="tp-score-grid tp-score-grid--act">
                  {ACT_SECTIONS.map((section) => (
                    <ScoreTile
                      key={section.key}
                      label={section.label}
                      score={actScores[section.key]}
                      caption="Estimated / 36"
                    />
                  ))}
                  <ScoreTile
                    label="ACT Composite"
                    score={actComposite}
                    caption="English + Math + Reading"
                    highlight
                  />
                </div>

                <p className="tp-estimate-disclaimer">
                  Science is displayed separately and is not included in the
                  Composite. Actual ACT score conversions vary by test form.
                </p>
              </div>
            </div>
          )}

          {activeTab === "psat" && (
            <div className="tp-calculator-panel" role="tabpanel">
              <div className="tp-calculator-intro">
                <div>
                  <span className="tp-kicker">PSAT/NMSQT</span>
                  <h3>Estimate your PSAT score.</h3>
                  <p>
                    Enter the number correct in each section. This calculator
                    gives a rough estimate on the 160–760 section scale.
                  </p>
                </div>
                <span className="tp-calculator-icon" aria-hidden="true">
                  ✧
                </span>
              </div>

              <div className="tp-slider-list">
                {PSAT_SECTIONS.map((section) => (
                  <SectionSlider
                    key={section.key}
                    label={section.label}
                    total={section.total}
                    value={psatCorrect[section.key]}
                    onChange={(value) => updatePsat(section.key, value)}
                    accent="ice"
                  />
                ))}
              </div>

              <div className="tp-results-panel">
                <div className="tp-results-heading">
                  <span className="tp-kicker">YOUR ESTIMATED SCORES</span>
                  <p>PSAT/NMSQT score range: 320–1520 total.</p>
                </div>

                <div className="tp-score-grid tp-score-grid--two">
                  <ScoreTile
                    label="Reading and Writing"
                    score={psatScores.rw}
                    caption="Estimated / 760"
                  />
                  <ScoreTile
                    label="Math"
                    score={psatScores.math}
                    caption="Estimated / 760"
                  />
                </div>

                <div className="tp-composite-result">
                  <div>
                    <span>Estimated Total Score</span>
                    <p>Reading and Writing + Math</p>
                  </div>
                  <strong>{estimatedPsatTotal}</strong>
                </div>

                <p className="tp-estimate-disclaimer">
                  The digital PSAT is adaptive, and raw-to-scaled conversion is
                  not a fixed percentage formula. Treat this as a rough
                  estimate, not an official score prediction.
                </p>
              </div>
            </div>
          )}

          {activeTab === "index" && (
            <div className="tp-calculator-panel" role="tabpanel">
              <div className="tp-calculator-intro">
                <div>
                  <span className="tp-kicker">NATIONAL MERIT</span>
                  <h3>Calculate your Selection Index.</h3>
                  <p>
                    Use your official PSAT/NMSQT section scores, not the
                    number of questions you got right.
                  </p>
                </div>
                <span className="tp-calculator-icon" aria-hidden="true">
                  ✦
                </span>
              </div>

              <div className="tp-index-inputs">
                <div className="tp-index-slider">
                  <div className="tp-slider-heading">
                    <div>
                      <h4>Reading and Writing score</h4>
                      <p>Section score from 160 to 760</p>
                    </div>
                    <strong>{indexScores.rw}</strong>
                  </div>

                  <input
                    className="tp-range"
                    type="range"
                    min="160"
                    max="760"
                    step="10"
                    value={indexScores.rw}
                    onChange={(event) =>
                      updateIndexScore("rw", Number(event.target.value))
                    }
                    aria-label="PSAT Reading and Writing section score"
                  />

                  <div className="tp-slider-footer">
                    <span>160</span>
                    <span>760</span>
                  </div>
                </div>

                <div className="tp-index-slider">
                  <div className="tp-slider-heading">
                    <div>
                      <h4>Math score</h4>
                      <p>Section score from 160 to 760</p>
                    </div>
                    <strong>{indexScores.math}</strong>
                  </div>

                  <input
                    className="tp-range"
                    type="range"
                    min="160"
                    max="760"
                    step="10"
                    value={indexScores.math}
                    onChange={(event) =>
                      updateIndexScore("math", Number(event.target.value))
                    }
                    aria-label="PSAT Math section score"
                  />

                  <div className="tp-slider-footer">
                    <span>160</span>
                    <span>760</span>
                  </div>
                </div>
              </div>

              <div className="tp-index-formula">
                <span>THE FORMULA</span>
                <strong>(2 × {indexScores.rw} + {indexScores.math}) ÷ 10</strong>
              </div>

              <div className="tp-index-result">
                <span>Your Selection Index</span>
                <strong>{selectionIndex}</strong>
                <p>
                  This is the index calculation only. It does not predict
                  Semifinalist status by itself.
                </p>
              </div>

              <div className="tp-cutoff-explainer">
                <h4>How do Semifinalist cutoffs work?</h4>
                <p>
                  National Merit sets Semifinalist allocations across states
                  and other selection units. The qualifying Selection Index
                  varies by state and year, so there is no single cutoff that
                  guarantees Semifinalist status everywhere.
                </p>

                <h4>What happens after Semifinalist selection?</h4>
                <p>
                  Students who qualify and want to advance must complete the
                  official Finalist application through their school. It
                  includes academic information, a school endorsement and
                  recommendation, an essay, and SAT score confirmation, along
                  with other program requirements. Follow the official
                  instructions and deadlines for your class.
                </p>

                <a
                  href="https://www.nationalmerit.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="tp-inline-link"
                >
                  Check official National Merit information ↗
                </a>
              </div>
            </div>
          )}

          <p className="tp-final-note">
            Scores are tools, not your identity. Use the results to decide what
            to practice next, and always use the official score report or
            conversion chart when accuracy matters.
          </p>
        </section>

        <footer className="tp-footer">
          <div className="tp-footer-star" aria-hidden="true">
            ✧
          </div>
          <h2>One question at a time.</h2>
          <p>
            You do not need to know everything today. You just need a useful
            next step.
          </p>
          <a href="#tp-start" className="tp-footer-link">
            Back to the beginning ↑
          </a>
        </footer>
      </main>

      <button
        className="tp-floating-calculator"
        type="button"
        onClick={scrollToCalculator}
        aria-label="Scroll to the score calculators"
      >
        <span className="tp-floating-icon" aria-hidden="true">
          ↗
        </span>
        <span>Want to calculate?</span>
      </button>
    </div>
  );
}
