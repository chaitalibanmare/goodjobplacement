import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffCommunity() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });

  const userId = "staff123"; // later replace with logged user

  useEffect(() => {
    fetch(`http://localhost:5000/api/community/stats/${userId}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="courses-dashboard">
      <h2>Communities</h2>

      {/* ===== STATS ===== */}
      <div className="course-stats">

        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Communities</p>
        </div>

        <div className="stat-card approved">
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </div>

        <div className="stat-card pending">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>

      </div>

      {/* ===== ACTIONS ===== */}
      <div className="course-actions">

        <div
          className="action-card"
          onClick={() => navigate("/staff/community/create")}
        >
          <h3>➕ Create Community</h3>
          <p>Create a new community</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/staff/community/view")}
        >
          <h3>👁️ View Communities</h3>
          <p>Manage all communities</p>
        </div>

      </div>
    </div>
  );
}