import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./employer.css";

export default function EmployerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("gjp_token");
    localStorage.removeItem("gjp_user");
    navigate("/");
  }

  return (
    <div className={`employer-page ${
  location.pathname.includes("profile") ? "profile-page" :
  location.pathname.includes("vacancies") ? "vacancies-page" :
  location.pathname.includes("post-vacancy") ? "form-page" :
  "dashboard-page"
}`}>
      
      {/* Sidebar */}
      <div className="employer-sidebar">
        <h2>GoodJobPlacement.com</h2>

        <Link
          to="/employer"
          className={location.pathname === "/employer" ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/employer/profile"
          className={location.pathname === "/employer/profile" ? "active" : ""}
        >
          Profile
        </Link>

        <Link
          to="/employer/post-vacancy"
          className={location.pathname === "/employer/post-vacancy" ? "active" : ""}
        >
          Post Vacancy
        </Link>

        <Link
          to="/employer/vacancies"
          className={location.pathname === "/employer/vacancies" ? "active" : ""}
        >
          My Vacancies
        </Link>

        <button onClick={logout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="employer-main">
        <Outlet />   {/* 🔥 IMPORTANT */}
      </div>
    </div>
  );
}