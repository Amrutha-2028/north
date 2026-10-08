import { useState } from "react";
import { supabase } from "../lib/supabase";

function SubmitInfo() {
    const [type, setType] = useState("idea");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setError("");

        const { error } = await supabase
            .from("submissions")
            .insert([
                {
                    type,
                    title,
                    message,
                    email: email || null,
                },
            ]);

        if (error) {
            console.error("Submission error:", error);
            setError("Something went wrong. Please try again.");
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <main className="submit-page">
            <div className="submit-stars" />

            <div className="submit-orbit submit-orbit-one" />
            <div className="submit-orbit submit-orbit-two" />

            <section className="submit-card">
                <div className="submit-icon">✦</div>

                <p className="submit-label">NORTH / TRANSMISSION</p>

                <h1>
                    Help shape <span>North.</span>
                </h1>

                <p className="submit-description">
                    Found a bug? Have an idea? Tell us what you think North should become.
                </p>

                {submitted ? (
                    <div className="submit-success">
                        <div className="success-star">✦</div>

                        <h2>Transmission received.</h2>

                        <p>
                            Your message has been added to the North signal.
                        </p>

                        <button
                            className="submit-again"
                            onClick={() => {
                                setSubmitted(false);
                                setTitle("");
                                setMessage("");
                                setEmail("");
                            }}
                        >
                            Send another
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="submit-form">
                        <div className="submit-field">
                            <label>WHAT ARE YOU SENDING?</label>

                            <div className="submit-options">
                                <button
                                    type="button"
                                    className={type === "idea" ? "active" : ""}
                                    onClick={() => setType("idea")}
                                >
                                    ✦ Idea
                                </button>

                                <button
                                    type="button"
                                    className={type === "bug" ? "active" : ""}
                                    onClick={() => setType("bug")}
                                >
                                    ◇ Bug
                                </button>

                                <button
                                    type="button"
                                    className={type === "feedback" ? "active" : ""}
                                    onClick={() => setType("feedback")}
                                >
                                    ○ Feedback
                                </button>
                            </div>
                        </div>

                        <div className="submit-field">
                            <label htmlFor="subject">TITLE</label>

                            <input
                                id="subject"
                                type="text"
                                placeholder={
                                    type === "idea"
                                        ? "What should North have?"
                                        : type === "bug"
                                            ? "What went wrong?"
                                            : "What do you think?"
                                }
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="submit-field">
                            <label htmlFor="message">MESSAGE</label>

                            <textarea
                                id="message"
                                rows="6"
                                placeholder="Tell us more..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <div className="submit-field">
                            <label htmlFor="email">
                                EMAIL <span>OPTIONAL</span>
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="submit-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={submitting}
                        >
                            {submitting ? "Transmitting..." : "Send transmission"}
                            <span>→</span>
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}

export default SubmitInfo;