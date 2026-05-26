import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./staff.css";

const StaffLogin = () => {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

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
      localStorage.setItem("staff", JSON.stringify(data.staff)); // ✅ Save staff info
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input type={showLoginPass ? "text" : "password"} autoComplete="new-password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="staff-input" style={{ width: '100%', marginBottom: 0, paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', display: 'flex' }} tabIndex="-1">
                {showLoginPass ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
            <button className="staff-btn">Login</button>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={handleRegister} autoComplete="off">
            <input type="text" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} className="staff-input" />
            <input type="email" placeholder="Email" autoComplete="off" value={email} onChange={(e)=>setEmail(e.target.value)} className="staff-input" />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input type={showRegPass ? "text" : "password"} autoComplete="new-password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="staff-input" style={{ width: '100%', marginBottom: 0, paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowRegPass(!showRegPass)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', display: 'flex' }} tabIndex="-1">
                {showRegPass ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input type={showRegConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Confirm Password" className="staff-input" style={{ width: '100%', marginBottom: 0, paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowRegConfirm(!showRegConfirm)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', display: 'flex' }} tabIndex="-1">
                {showRegConfirm ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
            <button className="staff-btn">Register</button>
          </form>
        )}

      </div>
    </div>
  );
};

export default StaffLogin;