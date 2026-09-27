import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import "./Profile.css";

const defaultProfile = {
  name: "",
  grade: "",
  graduationYear: "",
  school: "",
  gpa: "",
};

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the signed-in student's profile
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be signed in to view your profile.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (data) {
        setProfile({
          name: data.name || "",
          grade: data.grade || "",
          graduationYear: data.graduation_year || "",
          school: data.school || "",
          gpa: data.gpa || "",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    setSaved(false);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to save your profile.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name: profile.name,
        grade: profile.grade,
        graduation_year: profile.graduationYear
          ? Number(profile.graduationYear)
          : null,
        school: profile.school,
        gpa: profile.gpa ? Number(profile.gpa) : null,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setError(error.message);
      return;
    }

    setSaved(true);
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <main className="profile-page">
          <section className="profile-header">
            <p className="section-label">MY NORTH</p>
            <h1>
              Loading <span>Profile.</span>
            </h1>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="profile-page">
        <section className="profile-header">
          <p className="section-label">MY NORTH</p>

          <h1>
            Your <span>Profile.</span>
          </h1>

          <p>
            Keep your academic information in one place and let North build
            around you.
          </p>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <p className="section-label">STUDENT INFORMATION</p>
              <h2>About You</h2>
            </div>
          </div>

          <div className="profile-form">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </label>

            <label>
              Grade
              <select
                name="grade"
                value={profile.grade}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select grade
                </option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
              </select>
            </label>

            <label>
              Graduation Year
              <input
                type="number"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleChange}
                placeholder="2027"
              />
            </label>

            <label>
              School
              <input
                type="text"
                name="school"
                value={profile.school}
                onChange={handleChange}
                placeholder="Your school"
              />
            </label>

            <label>
              GPA
              <input
                type="number"
                name="gpa"
                value={profile.gpa}
                onChange={handleChange}
                step="0.01"
                placeholder="4.00"
              />
            </label>
          </div>

          {error && <p className="profile-error">{error}</p>}

          <button
            className="save-profile-button"
            onClick={handleSave}
          >
            {saved ? "Profile Saved ✓" : "Save Profile"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default Profile;