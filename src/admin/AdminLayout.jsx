import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import sub-components for internal navigation
import Dashboard from "./Dashboard";
import Users from "./Users";
import ViewEmployers from "./ViewEmployers";
import ManageCourses from "./ManageCourses";
import ManageVacancies from "./ManageVacancies";
import PlacementActivity from "../pages/PlacementActivity";
import UserProfile from "./UserProfile";
import StaffList from "./StaffList";
import ManageCommunities from "./ManageCommunities";
import ManagePayments from "./ManagePayments";

export default function AdminLayout() {
  const [view, setView] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("gjp_token");
    const user = JSON.parse(localStorage.getItem("gjp_user") || "{}");
    if (!token || user.role !== "admin") {
      // If session is lost or not admin, go back to home
      window.location.href = "/";
    }
  }, []);

  function logout() {
    localStorage.removeItem("gjp_token");
    localStorage.removeItem("gjp_user");
    window.location.href = "/";
  }

  const navigateTo = (newView, id = null) => {
    setView(newView);
    if (id) setSelectedId(id);
  };

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard navigateTo={navigateTo} />;
      case "users":
        return <Users navigateTo={navigateTo} />;
      case "employers":
        return <ViewEmployers navigateTo={navigateTo} />;
      case "courses":
        return <ManageCourses navigateTo={navigateTo} />;
      case "vacancies":
        return <ManageVacancies navigateTo={navigateTo} />;
      case "activity":
        return <PlacementActivity navigateTo={navigateTo} />;
      case "staff":
        return <StaffList navigateTo={navigateTo} />;
      case "community":
        return <ManageCommunities navigateTo={navigateTo} />;
      case "payments":
        return <ManagePayments navigateTo={navigateTo} />;
      case "userProfile":
        return <UserProfile id={selectedId} navigateTo={navigateTo} />;
      default:
        return <Dashboard navigateTo={navigateTo} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, zIndex: 2000, background: "#f8fafc" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "270px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          height: "100%"
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
          GoodJobPlacement<span style={{ color: "#7c3aed" }}>.com</span>
        </h2>

        <button onClick={() => setView("dashboard")} style={view === "dashboard" ? activeLinkStyle : linkStyle}>
          Dashboard
        </button>

        <button onClick={() => setView("users")} style={view === "users" ? activeLinkStyle : linkStyle}>
          Manage Users
        </button>

        <button onClick={() => setView("staff")} style={view === "staff" ? activeLinkStyle : linkStyle}>
          Manage Staff
        </button>

        <button onClick={() => setView("employers")} style={view === "employers" ? activeLinkStyle : linkStyle}>
          View Employer
        </button>

        <button onClick={() => setView("vacancies")} style={view === "vacancies" ? activeLinkStyle : linkStyle}>
          Manage Vacancies
        </button>

        <button onClick={() => setView("courses")} style={view === "courses" ? activeLinkStyle : linkStyle}>
          Manage Courses
        </button>

        <button onClick={() => setView("activity")} style={view === "activity" ? activeLinkStyle : linkStyle}>
          Placement Activity
        </button>

        <button onClick={() => setView("community")} style={view === "community" ? activeLinkStyle : linkStyle}>
          Manage Communities
        </button>

        <button onClick={() => setView("payments")} style={view === "payments" ? activeLinkStyle : linkStyle}>
          Course Enrollments
        </button>

        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "12px",
            border: "none",
            background: "#ef4444",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>

      {/* PAGE CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#f8fafc",
          overflowY: "auto",
          height: "100%"
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#94a3b8",
  padding: "12px",
  borderRadius: "8px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s"
};

const activeLinkStyle = {
  ...linkStyle,
  color: "white",
  background: "#1e293b",
  fontWeight: "bold"
};