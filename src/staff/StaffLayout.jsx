import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./staff.css";

const StaffLayout = () => {
const navigate = useNavigate();

const logout = () => {
localStorage.removeItem("staff");
sessionStorage.clear();
navigate("/");
};

return ( <div className="staff-container">

```
  <div className="staff-sidebar">

    {/* 🔥 TOP SECTION */}
    <div>
      <h2 className="staff-title">Staff Panel</h2>

      <Link to="/staff/dashboard" className="staff-link">Dashboard</Link>

      <div className="staff-group">
        <Link to="/staff/courses" className="staff-link">Courses</Link>

        <div className="staff-sublinks">
          <Link to="/staff/courses/add" className="staff-sublink">Add</Link>
          <Link to="/staff/courses/view" className="staff-sublink">View</Link>
        </div>
      </div>

      <Link to="/staff/vacancies" className="staff-link">Vacancies</Link>
      <Link to="/staff/placement" className="staff-link">Placement</Link>
    </div>

    {/* COMMUNITY */}
  <div className="staff-group">
    <Link to="/staff/community" className="staff-link">Community</Link>

    <div className="staff-sublinks">
      <Link to="/staff/community/create" className="staff-sublink">Create</Link>
      <Link to="/staff/community/view" className="staff-sublink">View</Link>
    </div>
  </div>

    {/* 🔥 BOTTOM SECTION */}
    <button onClick={logout} className="staff-logout">Logout</button>

  </div>

  <div className="staff-content">
    <Outlet />
  </div>

</div>

);
};

export default StaffLayout;