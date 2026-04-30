import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${base}/api/courses/staff`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const total = courses.length;
  const approved = courses.filter(c => c.isApproved).length;
  const pending = courses.filter(c => !c.isApproved).length;

  return (
    <div className="courses-dashboard">

      <h2>Courses</h2>

      {/* ===== STATS ===== */}
      <div className="course-stats">

        <div className="stat-card">
          <h3>{total}</h3>
          <p>Total Courses</p>
        </div>

        <div className="stat-card approved">
          <h3>{approved}</h3>
          <p>Approved</p>
        </div>

        <div className="stat-card pending">
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>

      </div>

      {/* ===== ACTIONS ===== */}
      <div className="course-actions">

        <div className="action-card" onClick={() => navigate("/staff/courses/add")}>
          <h3>➕ Add Course</h3>
          <p>Create a new course</p>
        </div>

        <div className="action-card" onClick={() => navigate("/staff/courses/view")}>
          <h3>👁 View Courses</h3>
          <p>Manage all courses</p>
        </div>

      </div>

    </div>
  );
};

export default Courses;