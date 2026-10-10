import { useState } from "react";
import Navbar from "../components/Navbar";
import Sparkles from "../components/Sparkles";
import "./Opportunities.css";

const guides = [
  {
    id: "internships",
    title: "Finding internships & research",
    subtitle: "Learn how to find opportunities that aren't advertised everywhere.",
    intro:
      "Finding an internship, especially as a high school student, can be genuinely difficult. Many opportunities aren't listed on public websites. You may need to research organizations yourself, introduce yourself to professionals, and keep trying even when you don't receive a response.",
    sections: [
      {
        title: "Start with opportunity databases",
        text:
          "Search Google for high school internship databases, summer research programs, university pre-college research opportunities, and local internship listings. Try different search terms and look beyond the first few results. Check eligibility, deadlines, costs, location, and whether the opportunity is actually open to high school students. Verify information on the organization's official website before applying.",
      },
      {
        title: "Contact small businesses",
        text:
          "Small businesses may have projects or tasks where a student can contribute, even if they don't advertise formal internships. Think about local businesses, technology companies, design studios, community organizations, or clinics where appropriate. Ask whether they offer supervised student internships, job shadowing, or suitable volunteer projects. Explain what you can contribute rather than simply asking for a position.",
      },
      {
        title: "Expect outreach to take time",
        text:
          "You may contact many organizations before finding one that can help. Some won't reply, some won't have openings, and some may have rules that prevent them from accepting high school students. That is normal. There is no magic number of emails that guarantees success. Focus on thoughtful, relevant outreach instead of sending hundreds of identical messages.",
      },
      {
        title: "Research opportunities work similarly",
        text:
          "Find university departments, laboratories, and researchers whose work genuinely interests you. Read about their projects before contacting them. For summer research, begin exploring opportunities several months ahead. Some formal programs have deadlines in winter, while individual researchers may have different schedules, so check each opportunity early.",
      },
      {
        title: "Keep a contact tracker",
        text:
          "Create a spreadsheet to keep track of every organization or researcher you contact. Record the name, organization, contact information, date contacted, opportunity, response, follow-up date, and next step. This prevents you from losing track of conversations and helps you follow up professionally.",
      },
    ],
    tip:
      "Ask permission before assuming you can work in a business, clinic, or laboratory. Student participation may require supervision, parental consent, safety training, or other approvals. Never exaggerate your skills or promise more time than you can realistically give.",
  },
  {
    id: "cold-emailing",
    title: "Cold emailing & finding mentors",
    subtitle: "Introduce yourself before asking someone to invest their time in you.",
    intro:
      "Cold emailing means reaching out to someone you don't already know. It can feel intimidating, but a thoughtful email gives a professional a chance to learn who you are and what you're interested in. Your goal is to start a genuine conversation, not demand an opportunity.",
    sections: [
      {
        title: "Research the person first",
        text:
          "Read their biography, explore their work, and identify a specific project, article, or idea that interests you. LinkedIn, university department pages, professional organization websites, and company websites can help you find people working in a field you want to explore.",
      },
      {
        title: "Explain who you are",
        text:
          "Briefly introduce yourself, mention your current interests, and describe relevant skills or projects. A résumé can be helpful when appropriate, but it should support your introduction rather than replace it. Be honest about your experience. You don't need to pretend to be an expert to show curiosity and initiative.",
      },
      {
        title: "Make a small, specific request",
        text:
          "Instead of immediately asking someone to take you on as a researcher or intern, ask whether they might have five to ten minutes to share advice about their field, or whether they can suggest a good way for a high school student to learn more. If you're contacting someone about a specific opening, you can ask directly about that opening and follow its application instructions.",
      },
      {
        title: "Follow up respectfully",
        text:
          "If you don't receive a reply, you can send one polite follow-up after a reasonable interval, often around one to two weeks unless the opportunity specifies otherwise. If they still don't respond, move on. Professionals are busy, and silence doesn't tell you everything about your potential.",
      },
    ],
    tip:
      "Be specific about why you contacted this person. A genuine sentence about their work is much more meaningful than generic praise copied into hundreds of emails.",
  },
  {
    id: "competitions",
    title: "Competitions & challenges",
    subtitle: "Demonstrate what you can do, not just what you say you enjoy.",
    intro:
      "Competitions can give you a reason to build skills, solve unfamiliar problems, work with a team, and receive feedback. Awards can be meaningful evidence of achievement, but learning and improvement matter too. You do not need a national trophy before you are allowed to call yourself interested in something.",
    sections: [
      {
        title: "Search beyond the obvious",
        text:
          "Try searching for high school STEM competitions, coding competitions, robotics events, research challenges, hackathons, engineering contests, and subject-specific Olympiads. Check school clubs, universities, professional associations, and official competition websites for deadlines and eligibility.",
      },
      {
        title: "Use competitions to develop skills",
        text:
          "Choose events that challenge you to learn something new. Prepare consistently, review feedback, identify weak areas, and try again. Regional, state, and national events can offer different levels of experience, but the best starting point is one you can realistically participate in.",
      },
      {
        title: "Connect competitions to projects",
        text:
          "If you enjoy robotics, you could enter a robotics competition, build a related project, and share what you learn with a school club. If you enjoy coding, you could compete in a programming challenge and then create a useful application. Each activity gives you experience that can support the others.",
      },
    ],
    tip:
      "Don't choose a competition solely because it sounds prestigious. Pick one that fits your interests, time, eligibility, and willingness to learn. Explore unfamiliar fields, too. Being a beginner is allowed.",
  },
  {
    id: "clubs",
    title: "Clubs & volunteering",
    subtitle: "Consistency and contribution matter more than collecting memberships.",
    intro:
      "Joining a club or volunteering can help you develop skills and contribute to your community. But being listed as a member is only the beginning. Think about what you learn, what you contribute, and whether you care enough about the activity to stay involved.",
    sections: [
      {
        title: "Choose meaningful commitments",
        text:
          "Rather than spreading yourself across many organizations that you barely have time for, consider a smaller number of activities you genuinely value. Regular participation can help you build relationships, take on responsibility, and understand how an organization works.",
      },
      {
        title: "Volunteer where you care",
        text:
          "You could tutor students at a library, assist with an arts program, support a food bank, help an environmental organization, or contribute to a community technology initiative. Choose opportunities that fit your interests, schedule, transportation, and age requirements.",
      },
      {
        title: "Measure your contribution honestly",
        text:
          "Keep track of hours, responsibilities, skills, and outcomes. Ask yourself what changed because you were involved. Did you help students understand a difficult subject? Organize an event? Create a resource people use? Hours provide context, but the work behind them matters too.",
      },
      {
        title: "Explore service recognition",
        text:
          "Programs such as The Congressional Award offer structured ways to set and work toward personal development, physical fitness, voluntary public service, and expedition or exploration goals. Visit the official Congressional Award website to learn about current requirements, levels, deadlines, and eligibility before planning around an award.",
      },
    ],
    tip:
      "You do not need hundreds of hours or a prestigious organization to make a difference. Choose a commitment you can sustain and make sure your volunteering genuinely benefits the people or community involved.",
  },
  {
    id: "projects",
    title: "Personal projects",
    subtitle: "Turn a question, curiosity, or everyday problem into something real.",
    intro:
      "Personal projects are a way to explore an interest beyond assignments and club meetings. You don't need permission to begin learning, experimenting, or creating. Start with something manageable, build a first version, test it, and improve it based on what you discover.",
    sections: [
      {
        title: "Start with a question or problem",
        text:
          "What do you wonder about? What is frustrating you? What would you like to make easier for other people? Your starting point could be a simple habit tracker, a website, an educational resource, a research investigation, an art collection, or a small tool that solves a genuine problem.",
      },
      {
        title: "Build the smallest useful version",
        text:
          "You don't need to launch a massive platform on day one. Choose one clear goal, make a basic version, test it, and improve it. Document what worked, what failed, what you learned, and what you want to change next.",
      },
      {
        title: "Keep it alive",
        text:
          "Starting a project is exciting. Maintaining it takes planning and repeated effort. If you create a website or community initiative, think about who will use it, how you will update it, and how it can remain useful. A smaller project that continues to improve can teach you more than an ambitious project abandoned after a week.",
      },
      {
        title: "Let your interests guide you",
        text:
          "You can build an AI tool, investigate neural networks, develop an educational game, create a baking journal, design an art workshop, or explore a completely different idea. Not every hobby needs to become a résumé item. Some interests can simply be yours.",
      },
    ],
    tip:
      "Don't create a nonprofit or claim to solve a major problem just because it sounds impressive. Understand the need, start responsibly, work with people who know the community, and make sure you can maintain whatever you promise.",
  },
  {
    id: "leadership",
    title: "Leadership & taking initiative",
    subtitle: "Leadership starts before someone gives you a title.",
    intro:
      "Leadership can mean noticing what needs to be done, helping a team stay organized, following through on responsibilities, or finding a way to improve something. Formal officer positions can be valuable, but they aren't the only evidence of leadership.",
    sections: [
      {
        title: "Start where you already are",
        text:
          "In class, contribute ideas, help your team plan its work, communicate clearly, and complete your responsibilities. In a club, volunteer to organize a task or help new members. Small, consistent actions can build trust with classmates, teachers, and other adults.",
      },
      {
        title: "Look for opportunities to contribute",
        text:
          "Ask a club adviser what needs improvement. Offer to help an existing nonprofit with a project. Contact an organization to learn whether it accepts student volunteers. If you notice an unmet need, investigate it before starting a new initiative.",
      },
      {
        title: "Build relationships through your work",
        text:
          "People who see you contribute consistently may be able to recommend opportunities, suggest next steps, or introduce you to others. This is not guaranteed, and you shouldn't treat relationships as transactions. Focus on being reliable, respectful, and genuinely helpful.",
      },
      {
        title: "Know when to start something new",
        text:
          "Starting a club, project, or local initiative can be worthwhile if there is a real need and you are ready to sustain it. Before creating something new, look for existing groups that might benefit from your help or collaborate with you.",
      },
    ],
    tip:
      "You do not have to be the loudest person in the room. Listening, organizing, helping others succeed, and reliably doing what you promised are all meaningful leadership skills.",
  },
  {
    id: "tracking",
    title: "Your extracurricular journal & résumé",
    subtitle: "Record the little things now so you don't forget them later.",
    intro:
      "Keeping track of your activities might sound tedious, but it saves time when you apply for internships, scholarships, programs, and leadership positions. You don't need an elaborate system. A notebook or simple spreadsheet is enough to begin.",
    sections: [
      {
        title: "Write a little, consistently",
        text:
          "Record the date, activity, time spent, what you worked on, and what you learned. For a project, note new features, tests, feedback, setbacks, and next steps. For volunteering, record your responsibilities and the impact of your work.",
      },
      {
        title: "Track outcomes, not just tasks",
        text:
          "Instead of only writing 'worked on website,' record what you built, who tested it, what changed after feedback, and what you plan to improve. These details help you remember the process and explain your contribution accurately later.",
      },
      {
        title: "Maintain a master résumé",
        text:
          "Keep one document with your education, activities, leadership, projects, work experience, awards, skills, and relevant dates. Update it when something changes. Later, select and tailor the most relevant information for each application rather than starting from scratch.",
      },
    ],
    tip:
      "Keep personal records secure. Don't put passwords, sensitive personal information, or other people's private contact details into a public portfolio.",
  },
  {
    id: "breaks",
    title: "Making the most of summer & winter break",
    subtitle: "Use longer breaks to make progress without scheduling every minute.",
    intro:
      "Summer and winter breaks give you more flexibility to explore interests that are difficult to pursue during a busy school term. They can be useful for projects, applications, research, volunteering, competitions, and standardized-test preparation. Rest and time with family matter, too.",
    sections: [
      {
        title: "Plan before the break begins",
        text:
          "Research deadlines early. Some summer programs open applications months in advance, and some research opportunities have winter deadlines. Make a short list of possibilities, check eligibility, and prioritize applications that fit your interests and circumstances.",
      },
      {
        title: "Choose a few priorities",
        text:
          "Pick one main project or skill to develop and a small number of supporting goals. You might work on a website, volunteer regularly, prepare for an upcoming test, or explore a research topic. Leave room for unexpected opportunities and downtime.",
      },
      {
        title: "Set a realistic weekly rhythm",
        text:
          "Decide when you will work on your goals, but don't fill every hour. A few focused sessions each week can produce real progress. Review what worked at the end of the week and adjust your plan if school, family commitments, travel, or rest needs change.",
      },
      {
        title: "Finish with evidence of progress",
        text:
          "At the end of the break, record what you learned, what you completed, what didn't work, and what you want to continue. Progress could mean a working prototype, a new skill, a completed application, a research summary, or a stronger volunteering commitment.",
      },
    ],
    tip:
      "Your break does not have to be packed with achievements to be worthwhile. Sustainable progress is better than burning out trying to do everything at once.",
  },
];

const emailTemplate = `Subject: High School Student Interested in [Research Area / Opportunity]

Dear [Dr./Mr./Ms. Last Name],

My name is [Your Name], and I am a high school student interested in [specific field or topic].

I came across your work on [specific project, article, or research topic], and I was especially interested in [specific detail and why it caught your attention].

I have been exploring this area through [relevant class, project, skill, or experience], and I would love to learn more about how I can continue developing my knowledge.

If you have time, would you be available for a brief 5–10 minute conversation, or could you recommend a suitable way for a high school student to learn more about this work? If you have an appropriate student opportunity available, I would also appreciate learning about it.

I understand you have a busy schedule, and I appreciate your time and consideration.

Best regards,
[Your Name]
[School, if appropriate]
[Relevant project or portfolio link, if available]`;

const trackerColumns = [
  "Organization / person",
  "Opportunity",
  "Contact date",
  "Contact method",
  "Response",
  "Follow-up date",
  "Next step",
];

function GuideCard({ guide, index, expanded, onToggle }) {
  return (
    <article
      className={`op-guide-card ${expanded ? "op-guide-card-open" : ""}`}
      style={{ "--op-card-index": index }}
    >
      <button
        className="op-guide-toggle"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`op-guide-content-${guide.id}`}
      >

        <span className="op-guide-heading">
          <span className="op-guide-title">{guide.title}</span>
          <span className="op-guide-subtitle">{guide.subtitle}</span>
        </span>
        <span className="op-guide-chevron" aria-hidden="true">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div
          className="op-guide-content"
          id={`op-guide-content-${guide.id}`}
        >
          <p className="op-guide-intro">{guide.intro}</p>

          {guide.sections.map((section) => (
            <section className="op-guide-section" key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </section>
          ))}

          <div className="op-guide-tip">
            <span className="op-tip-symbol">✦</span>
            <p>{guide.tip}</p>
          </div>
        </div>
      )}
    </article>
  );
}

function Opportunities() {
  const [expandedGuide, setExpandedGuide] = useState("internships");
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [trackerCopied, setTrackerCopied] = useState(false);

  const copyText = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const trackerText = trackerColumns.join("\t");

  return (
    <div className="op-page">
      <Sparkles />
      <Navbar />

      <main className="op-main">
        <header className="op-page-heading"><h1>Extracurriculars</h1></header>

        <section className="op-principle" aria-labelledby="op-principle-title">
          <div className="op-section-label">BEFORE YOU BEGIN</div>
          <h2 id="op-principle-title">
            Your activities should tell <span>a story.</span>
          </h2>
          <p>
            The point isn't to collect as many titles, clubs, and awards as
            possible. It's to explore what matters to you, develop real skills,
            contribute to something meaningful, and keep learning.
          </p>

          <div className="op-principle-grid">
            <div className="op-principle-item">
              <span className="op-principle-icon" aria-hidden="true">✦</span>
              <h3>Find your interests</h3>
              <p>Explore questions and subjects that genuinely excite you.</p>
            </div>
            <div className="op-principle-item">
              <span className="op-principle-icon" aria-hidden="true">✦</span>
              <h3>Take action</h3>
              <p>Build, investigate, compete, volunteer, or contribute.</p>
            </div>
            <div className="op-principle-item">
              <span className="op-principle-icon" aria-hidden="true">✦</span>
              <h3>Keep growing</h3>
              <p>Reflect, improve your skills, and follow through.</p>
            </div>
          </div>
        </section>

        <section className="op-connection" aria-labelledby="op-connection-title">
          <div className="op-section-label">WHAT DOES THIS LOOK LIKE?</div>
          <h2 id="op-connection-title">
            Connected interests, <span>real initiative.</span>
          </h2>

          <div className="op-comparison">
            <div className="op-comparison-panel">
              <span className="op-comparison-label">EXAMPLE A</span>
              <h3>A collection of titles</h3>
              <ul>
                <li>English honor society president</li>
                <li>Math honor society treasurer</li>
                <li>Science Olympiad secretary</li>
                <li>Art club president</li>
              </ul>
              <p>
                These activities can all be valuable. However, titles alone
                don't explain what connects them or what the student has
                accomplished.
              </p>
            </div>

            <div className="op-comparison-panel op-comparison-featured">
              <span className="op-comparison-label">EXAMPLE B</span>
              <h3>A developing area of interest</h3>
              <ul>
                <li>Participates in robotics and STEM competitions</li>
                <li>Builds a technology club with other students</li>
                <li>Creates an AI-powered product that solves a problem</li>
                <li>Explores neural networks through independent research</li>
                <li>Helps others learn technology skills</li>
              </ul>
              <p>
                Together, these experiences can demonstrate curiosity,
                initiative, skill development, and a sustained interest in
                technology.
              </p>
            </div>
          </div>

          <div className="op-side-note">
            <span>✦</span>
            <p>
              You can have more than one interest. A student who loves both
              computer science and baking doesn't have to turn baking into a
              technology project. Your individuality is a strength, not a
              distraction.
            </p>
          </div>
        </section>

        <section className="op-guides" id="op-guides">
          <div className="op-section-label">THE FIELD GUIDE</div>
          <h2>
            Where do you <span>start?</span>
          </h2>
          <p className="op-section-description">
            Choose a topic to explore. Each guide explains how to get started,
            what to look for, and how to take your next step.
          </p>

          <div className="op-guide-list">
            {guides.map((guide, index) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                index={index}
                expanded={expandedGuide === guide.id}
                onToggle={() =>
                  setExpandedGuide((current) =>
                    current === guide.id ? null : guide.id
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="op-email-tool" aria-labelledby="op-email-title">
          <div className="op-section-label">A TOOL YOU CAN USE TODAY</div>
          <h2 id="op-email-title">
            Your first <span>cold email.</span>
          </h2>
          <p>
            Use this as a starting point when contacting a researcher,
            professional, or organization. Personalize every message and
            follow any instructions listed for the opportunity.
          </p>

          <div className="op-email-preview">
            <div className="op-email-topbar">
              <div className="op-window-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="op-email-label">EMAIL STARTER</span>
            </div>
            <pre className="op-email-template">{emailTemplate}</pre>
            <button
              className="op-copy-button"
              onClick={() => copyText(emailTemplate, setCopiedTemplate)}
            >
              {copiedTemplate ? "Copied!" : "Copy email template"}
              <span aria-hidden="true">{copiedTemplate ? "✓" : "↗"}</span>
            </button>
          </div>

          <p className="op-small-note">
            Tip: Mention a specific piece of their work and explain why it
            interests you. A personalized email is more useful than a generic
            message sent to everyone.
          </p>
        </section>

        <section className="op-tracker" aria-labelledby="op-tracker-title">
          <div className="op-section-label">STAY ORGANIZED</div>
          <h2 id="op-tracker-title">
            Make a little <span>system.</span>
          </h2>
          <p>
            When you're contacting multiple organizations, it's easy to forget
            who you emailed or when to follow up. Create a spreadsheet and
            update it whenever you reach out.
          </p>

          <div className="op-tracker-preview">
            <div className="op-tracker-row op-tracker-header">
              {trackerColumns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
            <div className="op-tracker-row">
              <span>Example University</span>
              <span>Summer research</span>
              <span>Mar 12</span>
              <span>Email</span>
              <span>Awaiting reply</span>
              <span>Mar 24</span>
              <span>Follow up once</span>
            </div>
            <div className="op-tracker-row">
              {trackerColumns.map((column) => (
                <span key={column}>Your entry</span>
              ))}
            </div>
          </div>

          <button
            className="op-copy-button op-tracker-copy"
            onClick={() => copyText(trackerText, setTrackerCopied)}
          >
            {trackerCopied ? "Headers copied!" : "Copy spreadsheet headers"}
            <span aria-hidden="true">{trackerCopied ? "✓" : "↗"}</span>
          </button>
          <p className="op-small-note">
            Paste the copied headers into the first row of a spreadsheet.
            The example dates above are illustrative, not a recommended
            schedule for every opportunity.
          </p>
        </section>

              {/* SUMMER & WINTER BREAK ROADMAP */}
      <section className="op-breaks" id="break-roadmap">
        <div className="op-section-label">MAKE YOUR BREAK COUNT</div>

        <h2>
          Your break is a chance to <span>build.</span>
        </h2>

        <p className="op-breaks-intro">
          Summer and winter break give you more room to explore your interests,
          work on a project, find mentors, or pursue opportunities without
          balancing every step around your usual school schedule. You don't
          need a packed calendar. You need a plan you can actually follow.
        </p>

        <div className="op-break-feature">
          <div className="op-break-feature-icon">✦</div>
          <div>
            <span className="op-break-feature-label">THE MAIN IDEA</span>
            <h3>Choose depth over a dozen commitments.</h3>
            <p>
              Pick one main project or goal, then add a few complementary
              activities if you have the time. A project you consistently
              develop is more meaningful than a long list of things you barely
              have time to pursue.
            </p>
          </div>
        </div>

        <div className="op-break-timeline">
          <article className="op-break-step">

            <div>
              <span className="op-break-phase">BEFORE THE BREAK</span>
              <h3>Explore & prepare</h3>
              <p>
                Research internships, summer programs, competitions, volunteering,
                and mentors related to your interests. Start contacting people
                early when opportunities have early deadlines. Make a shortlist
                and keep track of applications and responses.
              </p>
            </div>
          </article>

          <article className="op-break-step">

            <div>
              <span className="op-break-phase">EARLY BREAK</span>
              <h3>Choose your focus</h3>
              <p>
                Decide what you want to learn, create, or contribute. Set one
                main goal and a few manageable milestones. Leave room for rest,
                family, friends, and unexpected plans.
              </p>
            </div>
          </article>

          <article className="op-break-step">

            <div>
              <span className="op-break-phase">DURING THE BREAK</span>
              <h3>Build & follow through</h3>
              <p>
                Work consistently on your project, internship, research,
                competition preparation, or volunteering. Keep notes about
                what you tried, what you learned, what went wrong, and how
                you improved it.
              </p>
            </div>
          </article>

          <article className="op-break-step">

            <div>
              <span className="op-break-phase">BEFORE SCHOOL RETURNS</span>
              <h3>Reflect & document</h3>
              <p>
                Record your progress, update your résumé, save examples of
                your work, and write down measurable results. Decide what
                you want to continue during the school year and what can wait.
              </p>
            </div>
          </article>
        </div>

        <div className="op-break-bottom-grid">
          <div className="op-break-mini-card">
            <span className="op-break-mini-icon">☀</span>
            <h3>Summer break</h3>
            <p>
              Use the longer stretch of time to develop a substantial project,
              pursue research or internships, or commit to a meaningful
              volunteering role.
            </p>
          </div>

          <div className="op-break-mini-card">
            <span className="op-break-mini-icon">☾</span>
            <h3>Winter break</h3>
            <p>
              Revisit your goals, make progress on a project, prepare for
              upcoming applications, explore competitions, or learn a skill
              you've been putting off.
            </p>
          </div>
        </div>

        <div className="op-break-reminder">
          <span className="op-break-reminder-star">✧</span>
          <p>
            <strong>Remember:</strong> Breaks are opportunities, not deadlines
            to become a completely different person. Make progress on something
            you genuinely care about, and give yourself time to recharge too.
          </p>
        </div>
      </section>

        <section className="op-ending">
          <span className="op-ending-star">✦</span>
          <h2>You don't need the whole map.</h2>
          <p>
            You just need a place to begin. Pick one thing that interests you,
            take the first step, and give yourself room to grow.
          </p>
          <a href="#op-guides" className="op-primary-link">
            Find your starting point <span aria-hidden="true">↑</span>
          </a>
        </section>
      </main>
    </div>
  );
}

export default Opportunities;