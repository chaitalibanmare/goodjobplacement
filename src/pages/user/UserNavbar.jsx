import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userNavbar.css";

export default function UserNavbar({ user, setUser }){

  const navigate = useNavigate();

  function handleLogout() {
  localStorage.removeItem("gjp_token");
  localStorage.removeItem("gjp_user");

  setUser(null);   // 🔥 THIS IS THE REAL FIX
  navigate("/");
}
  return (
    <div className="navbar">

      
      {/* LOGO */}
<Link to="/user/dashboard" className="navbar-logo">
  GoodJobPlacement <span>.com</span>
</Link>
        

      {/* LINKS */}
      <div className="nav-links">
        <Link to="/user/dashboard">Home</Link>
        <Link to="/user/vacancies">Vacancies</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/placement-activity">Placement</Link>
        <Link to="/community">Community</Link>
        <Link to="/my-courses">My Courses</Link>
        {/* ❌ Profile removed */}
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        

        {/* USER INFO (CLICK → PROFILE PAGE) */}
        <div
          className="user-box"
          onClick={() => navigate("/profile")}
        >
          <img
            src={
              user?.profile?.photo
                ? `http://localhost:5000${user.profile.photo}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="user"
            className="user-avatar"
          />
          <span className="user-name">Hi, {user?.name}</span>
        </div>

{/* LOGOUT (LEFT SIDE OF USER NAME) */}
        <span className="logout-text" onClick={handleLogout}>
          Logout
        </span>

      </div>

    </div>
  );
}