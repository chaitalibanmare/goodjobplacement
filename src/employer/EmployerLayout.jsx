import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./employer.css";

export default function EmployerLayout({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("gjp_token");
      localStorage.removeItem("gjp_user");
      navigate("/");
    }
  }

  return (
    <div className={`employer-page ${
  location.pathname.includes("profile") ? "profile-page" :
  location.pathname.includes("vacancies") ? "vacancies-page" :
  location.pathname.includes("post-vacancy") ? "form-page" :
  location.pathname.includes("applied-students") ? "applied-students-page" :
  "dashboard-page"
}`}>
      
      {/* Sidebar */}
      <div className="employer-sidebar">
        <h2>GoodJobPlacement.com</h2>

        <div className="sidebar-links">
          <Link
            to="/employer"
            className={location.pathname === "/employer" ? "active" : ""}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Dashboard
          </Link>

          <Link
            to="/employer/profile"
            className={location.pathname === "/employer/profile" ? "active" : ""}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Profile
          </Link>

          <Link
            to="/employer/post-vacancy"
            className={location.pathname === "/employer/post-vacancy" ? "active" : ""}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Post Vacancy
          </Link>

          <Link
            to="/employer/vacancies"
            className={location.pathname === "/employer/vacancies" ? "active" : ""}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            My Vacancies
          </Link>

          <Link
            to="/employer/applied-students"
            className={location.pathname === "/employer/applied-students" ? "active" : ""}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Applied Students
          </Link>
        </div>

        <button className="logout-btn" onClick={logout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="employer-main">
        <Outlet />   {/* 🔥 IMPORTANT */}
      </div>
    </div>
  );
}