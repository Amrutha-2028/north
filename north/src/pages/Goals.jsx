import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Sparkles from "../components/Sparkles";
import "./Goals.css";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [goalType, setGoalType] = useState("long-term");
  const [color, setColor] = useState("#8FC7F2");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [draggedGoal, setDraggedGoal] = useState(null);

  const goalColors = [
    "#8FC7F2",
    "#7DD3A8",
    "#F5C76A",
    "#F29B9B",
    "#B69CF2",
    "#F2A7D5",
    "#6ED7D0",
    "#AAB7C4",
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("priority", { ascending: true });

    if (error) {
      console.error("Goal loading error:", error);
    } else {
      setGoals(data || []);
    }

    setLoading(false);
  };

  const addGoal = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError("Please enter a goal.");
      return;
    }

    setSaving(true);
    setFormError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFormError("You must be signed in to create a goal.");
      setSaving(false);
      return;
    }

    const newGoal = {
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
      goal_type: goalType,
      color,
      priority: goals.length,
      completed: false,
    };

    const { data, error } = await supabase
      .from("goals")
      .insert(newGoal)
      .select()
      .single();

    if (error) {
      console.error("Goal save error:", error);
      setFormError(error.message);
      setSaving(false);
      return;
    }

    setGoals((currentGoals) => [...currentGoals, data]);

    setTitle("");
    setDescription("");
    setDueDate("");
    setGoalType("long-term");
    setColor("#8FC7F2");
    setFormError("");
    setSaving(false);
    setShowForm(false);
  };

  const toggleComplete = async (goal) => {
    const newCompleted = !goal.completed;

    setGoals((currentGoals) =>
      currentGoals.map((item) =>
        item.id === goal.id
          ? { ...item, completed: newCompleted }
          : item
      )
    );

    const { error } = await supabase
      .from("goals")
      .update({ completed: newCompleted })
      .eq("id", goal.id);

    if (error) {
      console.error("Goal update error:", error);

      setGoals((currentGoals) =>
        currentGoals.map((item) =>
          item.id === goal.id
            ? { ...item, completed: goal.completed }
            : item
        )
      );
    }
  };

  const deleteGoal = async (id) => {
    const previousGoals = goals;

    setGoals((currentGoals) =>
      currentGoals.filter((goal) => goal.id !== id)
    );

    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Goal delete error:", error);
      setGoals(previousGoals);
    }
  };

  const handleDragStart = (goal) => {
    setDraggedGoal(goal);
  };

  const handleDrop = async (targetGoal) => {
    if (!draggedGoal || draggedGoal.id === targetGoal.id) {
      setDraggedGoal(null);
      return;
    }

    const reordered = [...goals];

    const draggedIndex = reordered.findIndex(
      (goal) => goal.id === draggedGoal.id
    );

    const targetIndex = reordered.findIndex(
      (goal) => goal.id === targetGoal.id
    );

    const [removed] = reordered.splice(draggedIndex, 1);

    const newTargetIndex =
      draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;

    reordered.splice(newTargetIndex, 0, removed);

    const updatedGoals = reordered.map((goal, index) => ({
      ...goal,
      priority: index,
    }));

    setGoals(updatedGoals);
    setDraggedGoal(null);

    for (const goal of updatedGoals) {
      const { error } = await supabase
        .from("goals")
        .update({ priority: goal.priority })
        .eq("id", goal.id);

      if (error) {
        console.error("Priority update error:", error);
      }
    }
  };

  const shortTermGoals = goals.filter(
    (goal) => goal.goal_type === "short-term"
  );

  const longTermGoals = goals.filter(
    (goal) => goal.goal_type === "long-term"
  );

  if (loading) {
    return (
      <div className="goals-page">
        <Navbar />

        <div className="goals-loading">
          <div className="goals-loader"></div>
          <p>Finding your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goals-page">
      <Navbar />

      <div className="goals-background">
        <Sparkles />
        <div className="goals-glow"></div>
      </div>

      <main className="goals-container">

        {/* HEADER */}
        <section className="goals-header">
          <div>
            <p className="section-label">
              YOUR NORTH
            </p>

            <h1>
              Your <span>Goals.</span>
            </h1>

            <p>
              Turn what you want into what you're working toward.
            </p>
          </div>

          <button
            className="add-goal-button"
            onClick={() => {
              setShowForm(!showForm);
              setFormError("");
            }}
          >
            <span>+</span>
            Add Goal
          </button>
        </section>

        {/* ADD GOAL FORM */}
        {showForm && (
          <section className="goal-form-card">

            <div className="goal-form-header">
              <div>
                <p className="section-label">
                  NEW GOAL
                </p>

                <h2>
                  What are you working toward?
                </h2>
              </div>

              <button
                type="button"
                className="close-form"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={addGoal}>

              <label>
                Goal

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Finish my research paper"
                  required
                />
              </label>

              <label>
                Description

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a little more detail..."
                  rows="3"
                />
              </label>

              <div className="goal-form-row">

                <label>
                  Due Date

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </label>

                <label>
                  Type

                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                  >
                    <option value="short-term">
                      Short Term
                    </option>

                    <option value="long-term">
                      Long Term
                    </option>
                  </select>
                </label>

                <label>
                  Color

                  <div className="goal-color-options">
                    {goalColors.map((goalColor) => (
                      <button
                        key={goalColor}
                        type="button"
                        className={`goal-color-circle ${
                          color === goalColor ? "selected" : ""
                        }`}
                        style={{
                          backgroundColor: goalColor,
                        }}
                        onClick={() => setColor(goalColor)}
                        aria-label={`Choose ${goalColor}`}
                      />
                    ))}
                  </div>
                </label>

              </div>

              {formError && (
                <p className="goal-form-error">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="save-goal-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Add Goal →"}
              </button>

            </form>

          </section>
        )}

        {/* MAIN GRID */}
        <div className="goals-layout">

          {/* PRIORITY BOARD */}
          <section className="priority-section">

            <div className="goals-section-heading">

              <div>
                <p className="section-label">
                  01 — PRIORITY
                </p>

                <h2>
                  What matters most?
                </h2>
              </div>

              <span className="drag-hint">
                Drag to reorder
              </span>

            </div>

            <div className="priority-list">

              {goals.length === 0 ? (
                <div className="empty-goals">
                  <span>◇</span>

                  <h3>
                    No goals yet.
                  </h3>

                  <p>
                    Add your first goal and start building your path.
                  </p>
                </div>
              ) : (
                goals.map((goal, index) => (
                  <div
                    key={goal.id}
                    className={`priority-card ${
                      goal.completed ? "completed" : ""
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(goal)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(goal)}
                    style={{
                      "--goal-color": goal.color,
                    }}
                  >

                    <div className="priority-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="drag-handle">
                      ⋮⋮
                    </div>

                    <button
                      type="button"
                      className={`goal-checkbox ${
                        goal.completed ? "checked" : ""
                      }`}
                      onClick={() => toggleComplete(goal)}
                      aria-label="Complete goal"
                    >
                      {goal.completed ? "✓" : ""}
                    </button>

                    <div className="priority-content">

                      <div className="goal-title-row">

                        <h3>
                          {goal.title}
                        </h3>

                        <span className="goal-type">
                          {goal.goal_type === "short-term"
                            ? "SHORT"
                            : "LONG"}
                        </span>

                      </div>

                      {goal.description && (
                        <p>
                          {goal.description}
                        </p>
                      )}

                      {goal.due_date && (
                        <span className="due-date">
                          Due{" "}
                          {new Date(
                            `${goal.due_date}T00:00:00`
                          ).toLocaleDateString()}
                        </span>
                      )}

                    </div>

                    <button
                      type="button"
                      className="delete-goal"
                      onClick={() => deleteGoal(goal.id)}
                      aria-label="Delete goal"
                    >
                      ×
                    </button>

                  </div>
                ))
              )}

            </div>

          </section>

          {/* TODO */}
          <aside className="todo-section">

            <div className="goals-section-heading">

              <div>
                <p className="section-label">
                  02 — TO-DO
                </p>

                <h2>
                  Keep moving.
                </h2>
              </div>

            </div>

            {/* SHORT TERM */}
            <div className="todo-group">

              <div className="todo-group-header">
                <h3>
                  Short Term
                </h3>

                <span>
                  {
                    shortTermGoals.filter(
                      (goal) => !goal.completed
                    ).length
                  }
                </span>
              </div>

              <div className="todo-list">

                {shortTermGoals.length === 0 ? (
                  <p className="empty-todo">
                    No short-term goals yet.
                  </p>
                ) : (
                  shortTermGoals.map((goal) => (
                    <button
                      type="button"
                      key={goal.id}
                      className={`todo-item ${
                        goal.completed ? "completed" : ""
                      }`}
                      onClick={() => toggleComplete(goal)}
                    >

                      <span
                        className={`todo-check ${
                          goal.completed ? "checked" : ""
                        }`}
                        style={{
                          "--goal-color": goal.color,
                        }}
                      >
                        {goal.completed ? "✓" : ""}
                      </span>

                      <span className="todo-text">
                        {goal.title}
                      </span>

                    </button>
                  ))
                )}

              </div>

            </div>

            {/* LONG TERM */}
            <div className="todo-group">

              <div className="todo-group-header">

                <h3>
                  Long Term
                </h3>

                <span>
                  {
                    longTermGoals.filter(
                      (goal) => !goal.completed
                    ).length
                  }
                </span>

              </div>

              <div className="todo-list">

                {longTermGoals.length === 0 ? (
                  <p className="empty-todo">
                    No long-term goals yet.
                  </p>
                ) : (
                  longTermGoals.map((goal) => (
                    <button
                      type="button"
                      key={goal.id}
                      className={`todo-item ${
                        goal.completed ? "completed" : ""
                      }`}
                      onClick={() => toggleComplete(goal)}
                    >

                      <span
                        className={`todo-check ${
                          goal.completed ? "checked" : ""
                        }`}
                        style={{
                          "--goal-color": goal.color,
                        }}
                      >
                        {goal.completed ? "✓" : ""}
                      </span>

                      <span className="todo-text">
                        {goal.title}
                      </span>

                    </button>
                  ))
                )}

              </div>

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
}

export default Goals;