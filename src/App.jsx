import React, {useState} from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Vacancies from './pages/Vacancies'
import Courses from './pages/Courses'
import Features from './pages/Features'
import PlacementActivity from './pages/PlacementActivity'
import Community from './pages/Community'

const navItems = [
  {to: '/', label: 'Home'},
  {to: '/vacancies', label: 'Vacancies'},
  {to: '/courses', label: 'Courses'},
  {to: '/features', label: 'Features'},
  {to: '/placement-activity', label: 'Placement Activity'},
  {to: '/community', label: 'Community'},
]

function Navbar({onOpenLogin, onOpenSettings}){
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const go = (to) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">GoodJobPlacement<span className="dot">.com</span></div>
        <nav className={`links ${open ? 'open' : ''}`}>
          {navItems.map(item => (
            <NavLink key={item.label} to={item.to} className={({isActive})=> isActive? 'link active' : 'link'} onClick={() => go(item.to)}>{item.label}</NavLink>
          ))}
        </nav>
        <div className="actions">
          <button className="btn ghost" onClick={() => onOpenLogin && onOpenLogin('user')}>Login</button>
          <button className="btn ghost" onClick={() => onOpenSettings && onOpenSettings()}>⚙️</button>
        </div>
        <button className="hamburger" onClick={() => setOpen(v=>!v)} aria-label="menu">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </header>
  )
}

function LoginModal({type, onClose}){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  if(!type) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{type === 'admin' ? 'Admin' : 'User'} Login</h3>
        <form className="form" onSubmit={(e)=>{e.preventDefault(); alert(`${type} logged in (demo)`); onClose()}}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <div className="modal-actions">
            <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
            <button className="btn primary" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}
function AuthModal({initialType, onClose}){
  const [tab, setTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('user')

  React.useEffect(()=>{
    if(initialType === 'register') setTab('register')
  },[initialType])

  function submitLogin(e){
    e.preventDefault()
    alert(`Logged in (demo): ${loginEmail}`)
    onClose()
  }

  function submitRegister(e){
    e.preventDefault()
    if(password !== confirm){
      alert('Passwords do not match')
      return
    }
    if(!name || !email) { alert('Please fill required fields'); return }
    alert(`Registered (demo): ${name} — role: ${role}`)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab==='login'? 'active':''}`} onClick={()=>setTab('login')}>Login</button>
          <button className={`auth-tab ${tab==='register'? 'active':''}`} onClick={()=>setTab('register')}>Register</button>
        </div>

        {tab === 'login' ? (
          <form className="form" onSubmit={submitLogin}>
            <label>Email</label>
            <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} required />
            <div className="modal-actions">
              <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
              <button className="btn primary" type="submit">Login</button>
            </div>
          </form>
        ) : (
          <form className="form" onSubmit={submitRegister}>
            <label>Full name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <label>Phone</label>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} />
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
            <label>Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
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

export default function App(){
  const [loginType, setLoginType] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('gjp_theme') || 'dark')
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('gjp_fontSize') || 'medium')

  const openLogin = (t)=> setLoginType(t)
  const closeLogin = ()=> setLoginType(null)

  const openSettings = ()=> setSettingsOpen(true)
  const closeSettings = ()=> setSettingsOpen(false)

  React.useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    const map = {small: '14px', medium: '16px', large: '18px'}
    document.documentElement.style.setProperty('--base-font-size', map[fontSize])
    localStorage.setItem('gjp_theme', theme)
    localStorage.setItem('gjp_fontSize', fontSize)
  },[theme,fontSize])

  function SettingsModal({open, onClose}){
    if(!open) return null
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h3>Appearance</h3>
          <div className="form">
            <label>Theme</label>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                <input type="radio" name="theme" checked={theme==='dark'} onChange={()=>setTheme('dark')} /> Dark
              </label>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                <input type="radio" name="theme" checked={theme==='light'} onChange={()=>setTheme('light')} /> Light
              </label>
              
            </div>

            <label>Font size</label>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <button className={`btn ${fontSize==='small' ? 'primary' : 'ghost'}`} onClick={()=>setFontSize('small')}>A-</button>
              <button className={`btn ${fontSize==='medium' ? 'primary' : 'ghost'}`} onClick={()=>setFontSize('medium')}>A</button>
              <button className={`btn ${fontSize==='large' ? 'primary' : 'ghost'}`} onClick={()=>setFontSize('large')}>A+</button>
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
              <button className="btn ghost" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar onOpenLogin={openLogin} onOpenSettings={openSettings} />
      <main>
        <Routes>
          <Route path="/" element={<Home onOpenLogin={openLogin} />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/features" element={<Features />} />
          <Route path="/placement-activity" element={<PlacementActivity />} />
          <Route path="/community" element={<Community />} />
        </Routes>

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
          <div className="copyright">© {new Date().getFullYear()} GoodJobPlacement.com</div>
        </footer>
      </main>
      {loginType && <AuthModal initialType={loginType} onClose={closeLogin} />}
      <SettingsModal open={settingsOpen} onClose={closeSettings} />
    </div>
  )
}
