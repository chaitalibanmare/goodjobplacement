import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("gjp_user"));

  return (
    <main>
      <section className="section">
        <div className="container">

          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
  <h2>
    Your career journey starts here,{" "}
    <span style={{ color: "#6C3EF4" }}>{user?.name}</span> 🚀
  </h2>
</div>

          {/* GRID SAME AS ADMIN */}
          <div className="grid">

            {/* VACANCIES */}
            <div className="card">
              <h3>Vacancies</h3>
              <p className="muted">Discover jobs tailored for you</p>
              <button
                className="btn primary"
                onClick={() => navigate("/user/vacancies")}
              >
                Vacancies
              </button>
            </div>

            {/* COURSES */}
            <div className="card">
              <h3>Courses</h3>
              <p className="muted">Upgrade your skills with top courses</p>
              <button
                className="btn primary"
                onClick={() => navigate("/courses")}
              >
                Courses
              </button>
            </div>

            {/* PLACEMENT */}
            <div className="card">
              <h3>Placement Activity</h3>
              <p className="muted">Track your applications and offers</p>
              <button
                className="btn primary"
                onClick={() => navigate("/placement-activity")}
              >
                Placement Activity
              </button>
            </div>

            {/* COMMUNITY */}
            <div className="card">
              <h3>Community</h3>
              <p className="muted">Connect with like-minded learners</p>
              <button
                className="btn primary"
                onClick={() => navigate("/community")}
              >
                Community
              </button>
            </div>

            {/* MY COURSES */}
            <div className="card">
              <h3>My Courses</h3>
              <p className="muted">Continue your learning journey</p>
              <button
                className="btn primary"
                onClick={() => navigate("/my-courses")}
              >
                My Courses
              </button>
            </div>

            

          </div>

        </div>
      </section>
    </main>
  );
}