import React from "react";
import { useNavigate } from "react-router-dom";

export default function StaffOverlayContent({ onClose }) {
  const navigate = useNavigate();

  const handleStaffLogin = () => {
    onClose();
    navigate("/staff");
  };

  return (
    <div className="admin-landing">
      <div className="staff-badge">Staff</div>
      <h3 className="admin-panel-title">Staff Panel</h3>
      <p className="admin-panel-desc">
        Manage courses, community posts, and track student interactions.
      </p>
      <button className="staff-login-btn" onClick={handleStaffLogin}>
        Staff Login &rarr;
      </button>
    </div>
  );
}
