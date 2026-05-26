import React, { useState } from "react";
import AdminLogin from "./AdminLogin";
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

export default function AdminOverlayContent({ user, setUser }) {
  // Start with 'landing' view if not logged in
  const [view, setView] = useState(user?.role === 'admin' ? 'dashboard' : 'landing');
  const [selectedId, setSelectedId] = useState(null);

  const navigateTo = (newView, id = null) => {
    setView(newView);
    if (id) setSelectedId(id);
  };

  if (view === 'landing') {
    return (
      <div className="admin-landing">
        <div className="admin-badge">Admin</div>
        <h3 className="admin-panel-title">Admin Panel</h3>
        <p className="admin-panel-desc">
          Manage job vacancies, verify employers, and track student placements in real-time.
        </p>
        <button className="admin-login-btn" onClick={() => setView('login')}>
          Admin Login &rarr;
        </button>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="admin-login-container" style={{ paddingTop: '20px' }}>
         <button onClick={() => setView('landing')} style={{ background:'none', border:'none', color:'#a78bfa', cursor:'pointer', marginBottom:'10px', fontSize:'12px', fontWeight:'600' }}>&larr; Back</button>
         <AdminLogin setUser={setUser} onLoginSuccess={() => setView('dashboard')} />
      </div>
    );
  }

  // If already admin, App.jsx handles the full-screen swap, 
  // but we keep this here for internal navigation consistency
  switch (view) {
    case 'dashboard': return <Dashboard navigateTo={navigateTo} />;
    case 'users': return <Users navigateTo={navigateTo} />;
    case 'employers': return <ViewEmployers navigateTo={navigateTo} />;
    case 'courses': return <ManageCourses navigateTo={navigateTo} />;
    case 'vacancies': return <ManageVacancies navigateTo={navigateTo} />;
    case 'activity': return <PlacementActivity navigateTo={navigateTo} />;
    case 'staff': return <StaffList navigateTo={navigateTo} />;
    case 'community': return <ManageCommunities navigateTo={navigateTo} />;
    case 'payments': return <ManagePayments navigateTo={navigateTo} />;
    case 'userProfile': return <UserProfile id={selectedId} navigateTo={navigateTo} />;
    default: return <Dashboard navigateTo={navigateTo} />;
  }
}
