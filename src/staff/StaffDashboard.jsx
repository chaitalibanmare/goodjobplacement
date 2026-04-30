import React from "react";
import { useNavigate } from "react-router-dom";
import "./staff.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="grid">

        {/* COURSES */}
        <div className="card">
          <h3>Courses</h3>
          <p className="muted">Manage all courses</p>
          <button
            className="btn primary"
            onClick={() => navigate("/staff/courses")}
          >
            Manage Courses
          </button>
        </div>

        {/* VACANCIES */}
        <div className="card">
          <h3>Vacancies</h3>
          <p className="muted">View & manage jobs</p>
          <button
            className="btn primary"
            onClick={() => navigate("/staff/vacancies")}
          >
            Manage Vacancies
          </button>
        </div>

        {/* PLACEMENT */}
        <div className="card">
          <h3>Placement</h3>
          <p className="muted">Track placements</p>
          <button
            className="btn primary"
            onClick={() => navigate("/staff/placement")}
          >
            View Placement
          </button>
        </div>

        {/* ✅ COMMUNITY (NEW) */}
        <div className="card">
          <h3>Community</h3>
          <p className="muted">Create and manage communities</p>
          <button
            className="btn primary"
            onClick={() => navigate("/staff/community/create")}
          >
            Manage Communities
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;