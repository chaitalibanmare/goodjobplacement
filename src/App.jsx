import React, { useState } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import Users from './admin/Users'
import UserProfile from './admin/UserProfile'
import EmployerVacancyForm from './pages/EmployerVacancyForm'
import ManageVacancies from './admin/ManageVacancies'
import ViewEmployers from './admin/ViewEmployers'
import Home from './pages/Home'
import Vacancies from './pages/Vacancies'
import Courses from "./pages/Courses";              // public
import UserCourses from "./pages/user/UserCourses"; // logged-in
import Features from './pages/Features'
import PlacementActivity from './pages/PlacementActivity'
import Community from './pages/Community'
import Profile from './pages/Profile'
import UserVacancies from './pages/user/UserVacancies'
import EmployerProfile from './pages/EmployerProfile'
import EmployerLayout from './employer/EmployerLayout'
import EmployerHome from './employer/EmployerHome'
import EmployerAppliedStudents from './employer/EmployerAppliedStudents'
import StaffLogin from './staff/StaffLogin'
import StaffLayout from './staff/StaffLayout'
import StaffDashboard from './staff/StaffDashboard'
import StaffVacancies from './staff/StaffVacancies'
import StaffCourses from './staff/Courses'
import AddCourse from './staff/AddCourse'
import ViewCourses from './staff/ViewCourses'
import StaffPlacement from './staff/StaffPlacement'
import ManageCourses from './admin/ManageCourses'
import Payment from './pages/Payment'
import MyCourses from './pages/MyCourses'
import CourseContent from './staff/CourseContent'
import UserCourseContent from './pages/UserCourseContent'
import UserDashboard from './pages/user/UserDashboard'
import UserNavbar from './pages/user/UserNavbar'
import EmployerVacancies from './employer/EmployerVacancies'
import StaffList from './admin/StaffList'
import StaffCommunity from './staff/StaffCommunity';
import CreateCommunity from './staff/CreateCommunity';
import ViewCommunity from './staff/ViewCommunity';
import CommunityDetails from './staff/CommunityDetails';
import ManageCommunities from './admin/ManageCommunities';
import UserCommunity from "./pages/user/UserCommunity";
import UserCommunityDetails from "./pages/user/UserCommunityDetails";
import AdminOverlayContent from './admin/AdminOverlayContent';
import StaffOverlayContent from './staff/StaffOverlayContent';
import UserLayout from './pages/user/UserLayout';

const navItems = [
  { to: '/', label: 'Home' },
  { to: 'vacancies', label: 'Vacancies' },
  { to: '/courses', label: 'Courses' },
  { to: '/features', label: 'Features' },
  { to: '/placement-activity', label: 'Placement Activity' },
  { to: '/community', label: 'Community' },
]

function Navbar({ onOpenLogin, onOpenSettings, user, onLogout }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const go = (to) => {
    setOpen(false)
    navigate(to)
  }

  const getProfilePhotoUrl = () => {
    if (user && user.photo) {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      return `${base}/uploads/${user.photo}`
    }
    return null
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">GoodJobPlacement.com</div>
        <nav className={`links ${open ? 'open' : ''}`}>
          {navItems.map(item => {
            let path = item.to
            if (item.label === "Vacancies") {
              path = user ? "/user/vacancies" : "/vacancies"
            }
            return (
              <NavLink
                key={item.label}
                to={path}
                className={({ isActive }) => isActive ? 'link active' : 'link'}
                onClick={() => go(path)}
              >
                {item.label}
              </NavLink>
            )
          })}

          {user && (
            <NavLink
              to="/my-courses"
              className="link"
              onClick={() => go("/my-courses")}
            >
              My Courses 🎓
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin/dashboard"
              className="link"
              onClick={() => go("/admin/dashboard")}
            >
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        <div className="actions">
          {user ? (
            <>
              <button className="btn-icon" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ marginRight: 0, fontSize: '14px', fontWeight: '500' }}>Hi, {user.name}</span>
                {getProfilePhotoUrl() && (
                  <img
                    src={getProfilePhotoUrl()}
                    alt={user.name}
                    onClick={() => navigate('/profile')}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0044cc', cursor: 'pointer' }}
                    title="View profile"
                  />
                )}
              </div>
              <button className="btn ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-icon" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </button>
              <button className="btn primary nav-login-btn" onClick={() => onOpenLogin && onOpenLogin('user')}>Sign in</button>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setOpen(v => !v)} aria-label="menu">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </header>
  )
}

function LoginModal({ type, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  if (!type) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{type === 'admin' ? 'Admin' : 'User'} Login</h3>
        <form className="form" onSubmit={(e) => { e.preventDefault(); alert(`${type} logged in (demo)`); onClose() }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div className="modal-actions">
            <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
            <button className="btn primary" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AuthModal({ initialType, onClose, setUser }) {
  const [tab, setTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)
  const navigate = useNavigate()
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setLoginEmail("");
    setLoginPass("");
  }, []);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('user')
  const [showRegPass, setShowRegPass] = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)

  React.useEffect(() => {
    if (initialType === 'register') setTab('register')
  }, [initialType])

  async function submitLogin(e) {
    e.preventDefault()

    try {
      const base = "http://localhost:5000"

      const res = await fetch(base + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPass
        })
      })

      const data = await res.json()

      console.log("LOGIN RESPONSE:", data) // 🔥 DEBUG

      if (!res.ok) {
        alert(data.error || "Login failed")
        return
      }

      // ✅ SAVE TOKEN
      if (data.token) {
        localStorage.setItem("gjp_token", data.token)
      } else {
        console.log("❌ Token missing in response")
      }

      // ✅ SAVE USER
      if (data.user) {
        localStorage.setItem("gjp_user", JSON.stringify(data.user))
        setUser(data.user)
      } else {
        console.log("❌ User missing in response")
      }
      onClose()

      // redirect
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "employer") {
        navigate("/employer");
      } else {
        navigate("/user/dashboard"); // ✅ FIXED
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err)
      alert("Login error")
    }
  }

  function validateForm() {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Required";
    if (!email.trim()) newErrors.email = "Required";
    if (!phone.trim()) newErrors.phone = "Required";
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = "No must be 10 digit";

    if (!password) newErrors.password = "Required";
    if (!confirm) newErrors.confirm = "Required";
    else if (password !== confirm) newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submitRegister(e) {
    e.preventDefault();

    if (!validateForm()) return;

    // ✅ VALIDATION
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirm) {
      alert("All fields are mandatory")
      return
    }

    // ✅ PHONE VALIDATION (ONLY 10 DIGITS)
    if (!/^\d{10}$/.test(phone)) {
      alert("No must be 10 digit")
      return
    }

    // ✅ PASSWORD MATCH
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }

    try {
      const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000')

      const res = await fetch(base + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role })
      })

      const text = await res.text()
      let data = {}

      try {
        data = text ? JSON.parse(text) : {}
      } catch (e) {
        data = {}
      }

      if (!res.ok) {
        alert(data.error || ('Register failed' + (text ? (': ' + text) : '')))
        return
      }

      if (data.token) localStorage.setItem('gjp_token', data.token)
      if (typeof setUser === 'function' && data.user) setUser(data.user)

      onClose()

      if (role === "employer") {
        navigate("/employer/profile")
      } else {
        navigate("/profile")
      }

    } catch (err) {
      console.error(err)
      alert('Register error')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
        </div>

        {tab === 'login' ? (
          <form
            className="form"
            onSubmit={submitLogin}
            autoComplete="off"
            name="random_login_form_123"
          >

            {/* 🔥 Chrome autofill trap */}
            <input type="text" name="fake_email" style={{ display: "none" }} />
            <input type="password" name="fake_password" style={{ display: "none" }} />

            <label>Email</label>
            <input
              type="email"
              name="real_email_123"
              autoComplete="off"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showLoginPass ? "text" : "password"}
                name="real_password_123"
                autoComplete="new-password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowLoginPass(!showLoginPass)} 
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', display: 'flex' }}
                tabIndex="-1"
              >
                {showLoginPass ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>

            <div className="modal-actions">
              <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
              <button className="btn primary" type="submit">Login</button>
            </div>

          </form>
        ) : (
          <form className="form" onSubmit={submitRegister} autoComplete="off">

            {/* 🔥 Chrome autofill trap */}
            <input type="text" name="fake_name" style={{ display: "none" }} />
            <input type="password" name="fake_password" style={{ display: "none" }} />

            <label>
              Full name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="real_name_123"
              autoComplete="off"
              value={name}
              onChange={e => setName(e.target.value)}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}

            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="real_email_123"
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <label>
              Phone <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="real_phone_123"
              autoComplete="off"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                if (value.length <= 10) {
                  setPhone(value)
                }
              }}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}

            <label>
              Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showRegPass ? "text" : "password"}
                name="real_password_123"
                autoComplete="new-password"   // 🔥 important
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={errors.password ? "input-error" : ""}
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowRegPass(!showRegPass)} 
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', display: 'flex' }}
                tabIndex="-1"
              >
                {showRegPass ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}

            <label>
              Confirm Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showRegConfirm ? "text" : "password"}
                name="real_confirm_123"
                autoComplete="new-password"   // 🔥 important
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className={errors.confirm ? "input-error" : ""}
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowRegConfirm(!showRegConfirm)} 
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', display: 'flex' }}
                tabIndex="-1"
              >
                {showRegConfirm ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
            {errors.confirm && <p className="error-text">{errors.confirm}</p>}

            <label>
              Register As <span className="required">*</span>
            </label>
            <select
              name="real_role_123"
              value={role}
              onChange={e => setRole(e.target.value)}
              className={errors.role ? "input-error" : ""}
            >
              <option value="user">User</option>
              <option value="employer">Employer</option>
            </select>

            <div className="modal-actions">
              <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
              <button className="btn primary" type="submit">Register</button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [loginType, setLoginType] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('gjp_theme') || 'dark')
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('gjp_fontSize') || 'medium')
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gjp_user') || 'null') } catch (e) { return null }
  })
  const [showAdminOverlay, setShowAdminOverlay] = useState(false)
  const [showStaffOverlay, setShowStaffOverlay] = useState(false)

  // Keyboard shortcut Ctrl + Shift + A
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setShowAdminOverlay(prev => !prev)
        setShowStaffOverlay(false) // Close staff if admin opens
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault()
        setShowStaffOverlay(prev => !prev)
        setShowAdminOverlay(false) // Close admin if staff opens
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openLogin = (t) => setLoginType(t)
  const closeLogin = () => setLoginType(null)

  const navigate = useNavigate()
  const location = useLocation()

  const isAdminPage = location.pathname.startsWith("/admin")
  const isEmployerPage = location.pathname.startsWith("/employer");
  const isStaffPage = location.pathname.startsWith("/staff")
  const isCourseContentPage = location.pathname === "/course-content"

  // Fetch latest user profile on app load if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('gjp_token')
    if (token && user) {
      (async () => {
        try {
          const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
          const res = await fetch(base + '/api/user/me', { headers: { 'Authorization': 'Bearer ' + token } })
          if (res.ok) {
            const data = await res.json()
            if (data.user) {
              setUser(data.user)
              localStorage.setItem('gjp_user', JSON.stringify(data.user))
            }
          }
        } catch (err) { console.error('Failed to fetch user profile:', err) }
      })()
    }
  }, [])

  function logout() {
    localStorage.removeItem('gjp_token')
    localStorage.removeItem('gjp_user')
    sessionStorage.clear();
    setUser(null)
    navigate('/')
  }

  const openSettings = () => setSettingsOpen(true)
  const closeSettings = () => setSettingsOpen(false)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const map = { small: '14px', medium: '16px', large: '18px' }
    document.documentElement.style.setProperty('--base-font-size', map[fontSize])
    localStorage.setItem('gjp_theme', theme)
    localStorage.setItem('gjp_fontSize', fontSize)
  }, [theme, fontSize])

  function SettingsModal({ open, onClose }) {
    const [settingsTab, setSettingsTab] = React.useState('appearance')
    if (!open) return null
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: 16 }}>
            <button
              onClick={() => setSettingsTab('appearance')}
              style={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: settingsTab === 'appearance' ? '2px solid #4CAF50' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: settingsTab === 'appearance' ? 'bold' : 'normal',
                color: settingsTab === 'appearance' ? '#4CAF50' : '#666'
              }}
            >
              Appearance
            </button>
            <button
              onClick={() => setSettingsTab('profile')}
              style={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: settingsTab === 'profile' ? '2px solid #4CAF50' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: settingsTab === 'profile' ? 'bold' : 'normal',
                color: settingsTab === 'profile' ? '#4CAF50' : '#666'
              }}
            >
              Profile
            </button>
          </div>

          {settingsTab === 'appearance' && (
            <div className="form">
              <label>Theme</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => { setTheme('dark'); localStorage.setItem('gjp_theme', 'dark') }} /> Dark
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="radio" name="theme" checked={theme === 'light'} onChange={() => { setTheme('light'); localStorage.setItem('gjp_theme', 'light') }} /> Light
                </label>
              </div>

              <label>Font size</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button className={`btn ${fontSize === 'small' ? 'primary' : 'ghost'}`} onClick={() => { setFontSize('small'); localStorage.setItem('gjp_fontSize', 'small') }}>A-</button>
                <button className={`btn ${fontSize === 'medium' ? 'primary' : 'ghost'}`} onClick={() => { setFontSize('medium'); localStorage.setItem('gjp_fontSize', 'medium') }}>A</button>
                <button className={`btn ${fontSize === 'large' ? 'primary' : 'ghost'}`} onClick={() => { setFontSize('large'); localStorage.setItem('gjp_fontSize', 'large') }}>A+</button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="btn ghost" onClick={onClose}>Close</button>
              </div>
            </div>
          )}

          {settingsTab === 'profile' && (
            <div className="form">
              {user ? (
                <>
                  <label>Name</label>
                  <div style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 16 }}>
                    {user.name}
                  </div>

                  <label>Email</label>
                  <div style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 16 }}>
                    {user.email}
                  </div>

                  {user.phone && (
                    <>
                      <label>Phone</label>
                      <div style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 16 }}>
                        {user.phone}
                      </div>
                    </>
                  )}

                  <label>Role</label>
                  <div style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 16 }}>
                    {user.role || 'User'}
                  </div>

                  <div style={{ backgroundColor: '#e3f2fd', padding: 12, borderRadius: 6, marginBottom: 16 }}>
                    <small style={{ color: '#1565c0' }}>
                      To update your profile information (name, email, phone), please contact the administrator.
                      <br />
                      You can manage your profile photo and qualifications on the <strong>Profile</strong> page.
                    </small>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn ghost" onClick={onClose}>Close</button>
                    <button className="btn primary" onClick={() => { navigate('/profile'); onClose() }}>Go to Profile</button>
                  </div>
                </>
              ) : (
                <div>Please login to view profile settings.</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (user?.role === 'admin') {
    return (
      <div className="app admin-mode">
        <AdminLayout />
      </div>
    );
  }

  return (
    <div className="app">

      {/* ✅ SHOW ONLY ONE NAVBAR */}

      {!isAdminPage && !isStaffPage && !isEmployerPage && (
        user ? (
          <UserNavbar user={user} setUser={setUser} />
        ) : (
          <Navbar
            onOpenLogin={openLogin}
            onOpenSettings={openSettings}
            user={user}
            onLogout={logout}
          />
        )
      )}

      {/* MAIN */}
      <main>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home onOpenLogin={openLogin} />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/courses" element={user ? <UserLayout><UserCourses /></UserLayout> : <Courses />} />
          <Route path="/features" element={<Features />} />
          <Route path="/placement-activity" element={user ? <UserLayout><PlacementActivity /></UserLayout> : <PlacementActivity />} />
          <Route
            path="/community"
            element={
              user
                ? <UserLayout><UserCommunity /></UserLayout>
                : <Community />
            }
          />

          {/* ================= USER ================= */}
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/vacancies" element={<UserVacancies />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/course-content" element={<UserCourseContent />} />
            <Route path="/payment/:courseId" element={<Payment />} />

            <Route
              path="/profile"
              element={
                <Profile
                  setUser={(u) => {
                    setUser(u);
                    localStorage.setItem("gjp_user", JSON.stringify(u));
                  }}
                />
              }
            />
            <Route path="/user/community" element={<UserCommunity />} />
            <Route path="/user/community/:id" element={<UserCommunityDetails />} />
          </Route>

          <Route path="/employer/*" element={<EmployerLayout onLogout={logout} />}>
            <Route index element={<EmployerHome />} />
            <Route path="dashboard" element={<EmployerHome />} />
            <Route path="profile" element={<EmployerProfile />} />
            <Route path="post-vacancy" element={<EmployerVacancyForm />} />
            <Route path="vacancies" element={<EmployerVacancies />} />
            <Route path="applied-students" element={<EmployerAppliedStudents />} />
          </Route>

          {/* ================= STAFF ================= */}
          <Route path="/staff" element={<StaffLogin />} />
          <Route path="/staff/*" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="vacancies" element={<StaffVacancies />} />
            <Route path="placement" element={<StaffPlacement />} />
            <Route path="courses" element={<StaffCourses />} />
            <Route path="courses/add" element={<AddCourse />} />
            <Route path="courses/view" element={<ViewCourses />} />
            <Route path="course-content" element={<CourseContent />} />
            <Route path="community" element={<StaffCommunity />} />
            <Route path="community/create" element={<CreateCommunity />} />
            <Route path="community/create/:id" element={<CreateCommunity />} />
            <Route path="community/view" element={<ViewCommunity />} />
            <Route path="community/:id" element={<CommunityDetails />} />
          </Route>

          {/* ADMIN routes removed to prevent URL access. Accessible only via shortcut overlay. */}

        </Routes>

        {/* FOOTER */}
        {!user && !isAdminPage && !isEmployerPage && !isStaffPage && !isCourseContentPage && (
          <footer className="footer">
            <div className="container footer-inner">
              <div>
                <h4>Contact</h4>
                <p>Phone: 022-58585890</p>
                <p>Email: hr@goodjobplacement.com</p>
                <p>Address: FC road, ShivajiNagar, Pune- 411016</p>
              </div>

              <div>
                <h4>Quick Links</h4>
                <p>Vacancies · Courses · Features · Placement Activity · Community</p>
              </div>

              <div>
                <h4>Follow</h4>
                <p>Twitter · LinkedIn · Facebook</p>
              </div>
            </div>

            <div className="copyright">
              © {new Date().getFullYear()} GoodJobPlacement.com
            </div>
          </footer>
        )}
      </main>

      {/* MODALS */}
      {loginType && (
        <AuthModal
          initialType={loginType}
          onClose={closeLogin}
          setUser={(u) => {
            setUser(u);
            localStorage.setItem("gjp_user", JSON.stringify(u));
          }}
        />
      )}

      <SettingsModal open={settingsOpen} onClose={closeSettings} />

      {/* HIDDEN ADMIN OVERLAY */}
      {showAdminOverlay && (
        <div className="admin-overlay-panel">
          <button className="admin-overlay-close" onClick={() => setShowAdminOverlay(false)}>×</button>
          <div className="admin-overlay-content">
            <AdminOverlayContent user={user} setUser={setUser} />
          </div>
        </div>
      )}

      {/* HIDDEN STAFF OVERLAY */}
      {showStaffOverlay && (
        <div className="admin-overlay-panel staff-overlay">
          <button className="admin-overlay-close" onClick={() => setShowStaffOverlay(false)}>×</button>
          <div className="admin-overlay-content">
            <StaffOverlayContent onClose={() => setShowStaffOverlay(false)} />
          </div>
        </div>
      )}

    </div>
  );
}