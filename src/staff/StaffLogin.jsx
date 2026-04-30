import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./staff.css";

const StaffLogin = () => {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
  setEmail("");
  setPassword("");
  setName("");
}, []);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/staff/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.message === "Login successful") {
      alert("Login Success");
      navigate("/staff/dashboard");
    } else {
      alert(data.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/staff/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    alert(data.message);

    if (data.message === "Registered successfully") {
      setTab("login");
    }
  };

  return (
    <div className="staff-login-container">

      <div className="staff-login-box">

        <div className="staff-tabs">
          <button
            onClick={() => setTab("login")}
            className={`staff-tab ${tab === "login" ? "active" : ""}`}
          >
            Login
          </button>

          <button
            onClick={() => setTab("register")}
            className={`staff-tab ${tab === "register" ? "active" : ""}`}
          >
            Register
          </button>
        </div>

        {tab === "login" && (
          <form onSubmit={handleLogin} autoComplete="off">
            <input type="email" autoComplete="off"placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="staff-input" />
            <input type="password" autoComplete="new-password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="staff-input" />
            <button className="staff-btn">Login</button>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={handleRegister} autoComplete="off">
            <input type="text" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} className="staff-input" />
            <input type="email" placeholder="Email" autoComplete="off" value={email} onChange={(e)=>setEmail(e.target.value)} className="staff-input" />
            <input type="password" autoComplete="new-password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="staff-input" />
            <input type="password" autoComplete="new-password" placeholder="Confirm Password" className="staff-input" />
            <button className="staff-btn">Register</button>
          </form>
        )}

      </div>
    </div>
  );
};

export default StaffLogin;