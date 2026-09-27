import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "./Schedule.css";

function Schedule() {
    return (
        <div className="app">

            <Navbar />

            <PageHeader
                number="SCHEDULE PLANNING"
                title="Schedule Guide"
                subtitle="Build a schedule that works for you."
            />

            <main className="guide-page">

                <section className="guide-intro">

                    <p className="section-label">
                        HOW TO PLAN
                    </p>

                    <h2>
                        Build your schedule.
                        <br />
                        <span>Build your direction.</span>
                    </h2>

                    <p>
                        Learn how to balance rigor, interests, extracurriculars,
                        and future goals to build a schedule that works for you.
                    </p>

                </section>


                <ScheduleStep
                    number="01"
                    title="Start with your Graduation Requirements"
                    description="Use the requirements given by your school to ensure you are meeting all necessary criteria."
                >

                    <h3>Typical Graduation Requirements</h3>

                    <div className="requirement-grid">

                        {[
                            "4 years of English",
                            "3–4 years of Math",
                            "3–4 years of Science",
                            "3 years of Social Studies",
                            "2 years of Foreign Language",
                            "1 semester of Physical Education",
                            "1 year of Wellness",
                            "1 year of Visual Arts",
                            "1 year of Computer Science",
                            "1 semester of Government",
                            "1 semester of Economics",
                            "1 semester of Personal Finance"
                        ].map((item) => (
                            <div key={item} className="requirement-card">
                                {item}
                            </div>
                        ))}

                    </div>

                    <a
                        href="/scheduletemplate.xlsx"
                        download="NORTH-Schedule-Template.xlsx"
                        className="guide-button"
                    >
                        Download Schedule Template →
                    </a>

                </ScheduleStep>


                <ScheduleStep
                    number="02"
                    title="Build Around Your Career Interests"
                    description="Choose advanced courses and electives that connect with the areas you want to explore."
                >

                    <CareerTrack
                        title="Computer Science"
                        courses={[
                            "AP Computer Science A",
                            "AP Computer Science Principles",
                            "AP Calculus AB / BC",
                            "AP Statistics",
                            "AP Physics C",
                            "AP Cybersecurity",
                            "AP Physics 1",
                            "Coding Classes",
                            "Engineering Classes"
                        ]}
                    />

                    <CareerTrack
                        title="Healthcare"
                        courses={[
                            "AP Biology",
                            "AP Chemistry",
                            "AP Physics 1",
                            "AP Physics 2",
                            "AP Psychology",
                            "AP Statistics",
                            "Health / Biomedical Classes",
                            "Anatomy and Physiology"
                        ]}
                    />

                    <CareerTrack
                        title="Business"
                        courses={[
                            "AP Computer Science Principles",
                            "AP Business with Personal Finance",
                            "AP Economics",
                            "AP Statistics",
                            "AP Psychology",
                            "Accounting",
                            "Entrepreneurship"
                        ]}
                    />

                    <CareerTrack
                        title="Art & Design"
                        courses={[
                            "AP Art Courses",
                            "AP Design Courses",
                            "Digital Design",
                            "Graphic Design",
                            "Photography"
                        ]}
                    />

                    <CareerTrack
                        title="Humanities"
                        courses={[
                            "AP Language and Composition",
                            "AP Literature and Composition",
                            "AP History",
                            "AP Government and Politics",
                            "AP Psychology"
                        ]}
                    />

                </ScheduleStep>


                <ScheduleStep
                    number="03"
                    title="Avoid Common Mistakes"
                    description="A strong schedule isn't about taking every difficult class available."
                >

                    <div className="mistakes-grid">

                        <Mistake
                            title="Taking APs because friends are"
                            text="Don't choose an AP simply because your friends are taking it. Choose courses that fit your goals and interests."
                        />

                        <Mistake
                            title="Taking APs because why not?"
                            text="Don't take APs just for the sake of it. Make sure they align with your interests and future goals."
                        />

                        <Mistake
                            title="Overloading your schedule"
                            text="You need time for your social life, family, interests, and rest. A balanced schedule is more sustainable."
                        />

                    </div>

                </ScheduleStep>

            </main>

            <Footer />

        </div>
    );
}


function ScheduleStep({ number, title, description, children }) {
    return (
        <section className="schedule-step">

            <div className="step-number">
                {number}
            </div>

            <div className="step-content">

                <h2>{title}</h2>

                <p className="step-description">
                    {description}
                </p>

                {children}

            </div>

        </section>
    );
}


function CareerTrack({ title, courses }) {
    return (
        <div className="career-track">

            <h3>{title}</h3>

            <div className="career-courses">

                {courses.map((course) => (
                    <span key={course}>
                        {course}
                    </span>
                ))}

            </div>

        </div>
    );
}


function Mistake({ title, text }) {
    return (
        <div className="mistake-card">

            <span>!</span>

            <h3>{title}</h3>

            <p>{text}</p>

        </div>
    );
}

export default Schedule;