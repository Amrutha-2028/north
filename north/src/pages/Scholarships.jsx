import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { KEYS, useProfile, usePersistentState } from "../lib/storage";
import {
  AMOUNT_BUCKETS,
  BASIS_LABELS,
  CITIZENSHIP_LABELS,
  STATE_NAMES,
  TRACK_STATUSES,
  gradeLabel,
  isMerit,
  isSeniorsOnly,
  locationLabel,
  matchScholarship,
  monthsUntil,
  noCitizenshipRequired,
  requiresCitizenshipOrPR,
  scholarships,
} from "../lib/scholarships";
import "./Scholarships.css";

const TABS = [
  { id: "all", label: "All" },
  { id: "amount", label: "By amount" },
  { id: "merit", label: "Merit" },
  { id: "location", label: "Location" },
  { id: "seniors", label: "Seniors only" },
  { id: "citizenship", label: "Citizenship" },
  { id: "mine", label: "My list" },
];

const TAB_INTROS = {
  all: "Every scholarship in North, biggest awards first.",
  amount: "Grouped by how much money you could get. Full rides cover most or all of college.",
  merit: "Merit awards look at grades, achievements or talent. The rest are based on financial need or are random drawings.",
  location: "Nationwide awards anyone can apply for, then awards limited to one state or region.",
  seniors: "Most big awards are senior-year only, but some open earlier. Juniors: these are worth planning for now.",
  citizenship: "Whether you need US citizenship or a green card (permanent residency) to apply.",
  mine: "Scholarships you've saved, grouped by where you are in the process.",
};

const CITIZENSHIP_CHIP = {
  citizen: "chip-red",
  "citizen-pr": "chip-yellow",
  daca: "chip-blue",
  open: "chip-green",
  undocumented: "chip-violet",
  check: "",
};

function groupScholarships(tab, list, profile, tracked) {
  switch (tab) {
    case "amount":
      return AMOUNT_BUCKETS.map((bucket) => ({
        title: bucket.label,
        items: list.filter(bucket.test),
      }));
    case "merit":
      return [
        {
          title: "Merit-based",
          note: "Selected on grades, achievements, research or talent. Some also weigh need.",
          items: list.filter(isMerit),
        },
        {
          title: "No merit requirement",
          note: "Based on financial need, or open drawings. You don't need top grades.",
          items: list.filter((s) => !isMerit(s)),
        },
      ];
    case "location": {
      const groups = [];
      const stateCodes = [...new Set(list.flatMap((s) => s.states))].sort();
      if (profile.state && stateCodes.includes(profile.state)) {
        groups.push({
          title: `Your state: ${STATE_NAMES[profile.state]}`,
          items: list.filter((s) => s.states.includes(profile.state)),
        });
      }
      groups.push({
        title: "Nationwide",
        note: "Open to students anywhere in the US (some need you to apply to a specific college).",
        items: list.filter((s) => s.states.length === 0),
      });
      stateCodes
        .filter((code) => code !== profile.state)
        .forEach((code) =>
          groups.push({
            title: STATE_NAMES[code] || code,
            note: "State residents only.",
            items: list.filter((s) => s.states.includes(code)),
          })
        );
      return groups;
    }
    case "seniors":
      return [
        { title: "Seniors only", items: list.filter(isSeniorsOnly) },
        {
          title: "Open before senior year",
          note: "Juniors and underclassmen can apply now.",
          items: list.filter((s) => !isSeniorsOnly(s)),
        },
      ];
    case "citizenship":
      return [
        {
          title: "No US citizenship or green card required",
          note: "Open to DACA, undocumented or international students. Some are only for undocumented students.",
          items: list.filter(noCitizenshipRequired),
        },
        {
          title: "Requires US citizenship or permanent residency",
          items: list.filter(requiresCitizenshipOrPR),
        },
        {
          title: "Unclear: check the official rules",
          note: "Sources disagree or don't say. Ask the program before you apply.",
          items: list.filter((s) => s.citizenship === "check"),
        },
      ];
    case "mine":
      return TRACK_STATUSES.map((status) => ({
        title: status.label,
        items: list.filter((s) => tracked[s.id]?.status === status.id),
      }));
    default:
      return [{ title: null, items: list }];
  }
}

function Scholarships() {
  const [profile] = useProfile();
  const [storedTracked, setTracked] = usePersistentState(KEYS.scholarships, {});
  const tracked = storedTracked && typeof storedTracked === "object" ? storedTracked : {};

  const hasProfileFilters = Boolean(profile.grade || profile.state || profile.citizenship);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("amount");
  const [matchOnly, setMatchOnly] = useState(true);

  const trackedCount = Object.values(tracked).filter((item) => item?.status).length;

  const { visible, hiddenCount } = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = scholarships.filter(
      (s) =>
        !q ||
        [s.name, s.org, s.summary, s.audience, s.region, locationLabel(s)]
          .filter(Boolean)
          .some((text) => text.toLowerCase().includes(q))
    );

    let hidden = 0;
    if (matchOnly && hasProfileFilters && tab !== "mine") {
      const before = list.length;
      list = list.filter((s) => matchScholarship(s, profile).ok);
      hidden = before - list.length;
    }

    list = [...list].sort((a, b) => {
      if (sort === "deadline") {
        const am = monthsUntil(a);
        const bm = monthsUntil(b);
        return (am ?? 99) - (bm ?? 99) || b.value - a.value;
      }
      return b.value - a.value;
    });

    return { visible: list, hiddenCount: hidden };
  }, [query, matchOnly, hasProfileFilters, profile, sort, tab]);

  const groups = groupScholarships(tab, visible, profile, tracked).filter(
    (group) => group.items.length > 0
  );

  const setStatus = (id, status) => {
    setTracked((current) => {
      const next = { ...(current || {}) };
      if (!status) delete next[id];
      else next[id] = { ...(next[id] || {}), status, updatedAt: new Date().toISOString() };
      return next;
    });
  };

  return (
    <div className="app">
      <Navbar />

      <PageHeader
        glyph="$"
        marquee={["FULL RIDES", "MERIT", "NEED-BASED", "STATE AWARDS", "SENIORS", "NO CITIZENSHIP REQUIRED"]}
        number="FUND YOUR FUTURE"
        title={<>Scholarships worth your <em>time</em></>}
        subtitle="Sort them by amount, merit, location, grade and citizenship. Save the ones you want and track them from here to your inbox."
      />

      <main className="sch-page">
        <div className="sch-toolbar">
          <div className="tabs" role="tablist" aria-label="Organize scholarships">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
              >
                {item.label}
                {item.id === "mine" && trackedCount > 0 && (
                  <span className="sch-tab-count">{trackedCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="sch-controls">
            <label className="sch-search">
              <span className="sr-only">Search scholarships</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5 14 14" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, state, major…"
              />
            </label>

            <label className="sch-select">
              <span className="sr-only">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="amount">Biggest first</option>
                <option value="deadline">Next deadline</option>
              </select>
            </label>

            {hasProfileFilters ? (
              <button
                type="button"
                className={`sch-match${matchOnly ? " on" : ""}`}
                aria-pressed={matchOnly}
                onClick={() => setMatchOnly(!matchOnly)}
              >
                <span className="sch-switch" aria-hidden="true" />
                Match my profile
              </button>
            ) : (
              <Link to="/me" className="sch-match-link">
                Add your grade, state and citizenship to filter →
              </Link>
            )}
          </div>
        </div>

        <div className="sch-meta" role="tabpanel">
          <p>{TAB_INTROS[tab]}</p>
          <p className="sch-meta-right">
            {visible.length} shown
            {hiddenCount > 0 && (
              <>
                {" · "}
                <button type="button" className="sch-inline" onClick={() => setMatchOnly(false)}>
                  {hiddenCount} hidden by your profile
                </button>
              </>
            )}
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="sch-empty">
            {tab === "mine" ? (
              <>
                <h3>Nothing saved yet</h3>
                <p>Tap Save on any scholarship to track it here and in My North.</p>
                <button type="button" className="btn btn-sm" onClick={() => setTab("all")}>
                  Browse all scholarships
                </button>
              </>
            ) : (
              <>
                <h3>No matches</h3>
                <p>Try a different search, or turn off profile matching.</p>
              </>
            )}
          </div>
        ) : (
          groups.map((group) => (
            <section className="sch-group" key={group.title || "all"}>
              {group.title && (
                <header className="sch-group-head">
                  <h2>
                    {group.title} <span>{group.items.length}</span>
                  </h2>
                  {group.note && <p>{group.note}</p>}
                </header>
              )}

              <div className="sch-grid">
                {group.items.map((s) => (
                  <ScholarshipCard
                    key={s.id}
                    s={s}
                    status={tracked[s.id]?.status || ""}
                    onStatus={(status) => setStatus(s.id, status)}
                    match={hasProfileFilters ? matchScholarship(s, profile) : null}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        <aside className="sch-disclaimer">
          <strong>Before you apply</strong>
          <p>
            We researched these in November 2026. Amounts, deadlines and rules change
            every year, and sources sometimes disagree, so always confirm on the official
            site. Never pay to apply for a scholarship. Also file the FAFSA (or your
            state's Dream Act application). Many awards and most state aid require it.
          </p>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function ScholarshipCard({ s, status, onStatus, match }) {
  const months = monthsUntil(s);
  const dueSoon = months !== null && months <= 1;

  return (
    <article className={`sch-card${status ? " is-tracked" : ""}`}>
      <div className="sch-card-top">
        <div className="sch-amount">
          <strong>{s.amount}</strong>
          {s.renewable && <span>Renewable</span>}
        </div>
        <button
          type="button"
          className={`sch-save${status ? " saved" : ""}`}
          aria-pressed={Boolean(status)}
          aria-label={status ? `Remove ${s.name} from my list` : `Save ${s.name}`}
          onClick={() => onStatus(status ? "" : "saved")}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 2.5h8v11l-4-2.6-4 2.6z" />
          </svg>
          {status ? "Saved" : "Save"}
        </button>
      </div>

      <h3>{s.name}</h3>
      <p className="sch-org">{s.org}</p>
      <p className="sch-summary">{s.summary}</p>

      <div className="sch-chips">
        <span className={`chip ${isMerit(s) ? "chip-accent" : ""}`}>{BASIS_LABELS[s.basis]}</span>
        <span className="chip">{gradeLabel(s)}</span>
        <span className="chip">{locationLabel(s)}</span>
        <span className={`chip ${CITIZENSHIP_CHIP[s.citizenship]}`}>{CITIZENSHIP_LABELS[s.citizenship]}</span>
        {s.audience && <span className="chip">{s.audience}</span>}
      </div>

      <details className="sch-details">
        <summary>Eligibility</summary>
        <ul>
          {s.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
          {s.region && <li>{s.region}</li>}
        </ul>
        {s.citizenshipNote && <p>{s.citizenshipNote}</p>}
      </details>

      {match && !match.ok && <p className="sch-mismatch">{match.reasons.join(" · ")}</p>}

      <div className="sch-card-foot">
        <span className={`sch-deadline${dueSoon ? " soon" : ""}`}>
          {dueSoon && <span className="sch-dot" aria-hidden="true" />}
          {s.deadline}
        </span>

        <div className="sch-actions">
          {status && (
            <label className="sch-status">
              <span className="sr-only">Status for {s.name}</span>
              <select value={status} onChange={(e) => onStatus(e.target.value)}>
                {TRACK_STATUSES.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
                <option value="">Remove</option>
              </select>
            </label>
          )}
          <a href={s.url} target="_blank" rel="noreferrer" className="sch-link">
            Official site <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default Scholarships;
