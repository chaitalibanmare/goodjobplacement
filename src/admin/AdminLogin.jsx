import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminLogin({ onLoginSuccess, setUser }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.user && data.user.role === "admin") {
        localStorage.setItem("gjp_token", data.token)
        localStorage.setItem("gjp_user", JSON.stringify(data.user))
        
        if (setUser) setUser(data.user); // Trigger full-screen swap
        
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate("/admin/dashboard")
        }
      } else {
        alert("You are not an admin")
      }

    } catch (err) {
      console.error(err)
      alert("Login error")
    }
  }

  return (
    <section className="section">
      <div className="container">

        <div className="card" style={{ maxWidth: "420px", margin: "auto" }}>

          <h2>Admin Login</h2>

          <form className="form" onSubmit={handleLogin}>

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="modal-actions">

              <button
                type="button"
                className="btn ghost"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn primary"
              >
                Login
              </button>

            </div>

          </form>

        </div>

      </div>
    </section>
  )
}