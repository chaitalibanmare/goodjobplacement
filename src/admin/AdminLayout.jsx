import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("gjp_token");

    if (!token) {
      navigate("/admin");
    }
  }, []);

  function logout() {
    localStorage.removeItem("gjp_token");
    localStorage.removeItem("gjp_user");

    navigate("/admin", { replace: true });
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "270px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ fontSize: "20px" }}>
          GoodJobPlacement<span style={{ color: "#7c3aed" }}>.com</span>
        </h2>

        <NavLink to="/admin/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" style={linkStyle}>
          Manage Users
        </NavLink>

        <NavLink to="/admin/staff" style={linkStyle}>
          Manage Staff
        </NavLink>

        <NavLink to="/admin/employers" style={linkStyle}>
        View Employer
        </NavLink>

        <NavLink to="/admin/vacancies" style={linkStyle}>
          Manage Vacancies
        </NavLink>

        <NavLink to="/admin/courses" style={linkStyle}>
          Manage Courses
        </NavLink>

        <NavLink to="/admin/activity" style={linkStyle}>
          Placement Activity
        </NavLink>

        <NavLink to="/admin/community" style={linkStyle}>
          Manage Communities
        </NavLink>

        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "10px",
            border: "none",
            background: "#ef4444",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* PAGE CONTENT */}
      <div
  style={{
    flex: 1,
    padding: "5px 10px",
    background: "#f8fafc",
    overflowY: "auto"
  }}
>
  <Outlet />
</div>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "white",
  padding: "10px",
  borderRadius: "6px",
  background: "#1e293b",
};