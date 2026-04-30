import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ setUser }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
  setEmail("");
  setPassword("");
}, []);


  async function submit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
      const res = await fetch(base + '/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
      const text = await res.text()
      let data = {}
      try{ data = text ? JSON.parse(text) : {} }catch(err){ data = {} }
      if(!res.ok){ alert(data.error || ('Login failed' + (text ? (': '+text) : ''))); setLoading(false); return }
      if(data.token) localStorage.setItem('gjp_token', data.token)
      if(data.user) localStorage.setItem('gjp_user', JSON.stringify(data.user))
      if(typeof setUser === 'function' && data.user) setUser(data.user)
      if(data.user && data.user.role === "employer"){
  navigate("/employer/post-vacancy")
}else{
  navigate("/profile")
}
    }catch(err){ console.error(err); alert('Network error'); }
    setLoading(false)
  }

  return (
    <section className="section">
      <div className="container" style={{maxWidth:520}}>
        <h2>Login</h2>
        <form className="form" onSubmit={submit} autoComplete="off">
          <label>Email</label>
          <input type="email" autoComplete="off" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button className="btn ghost" type="button" onClick={()=>{ setEmail(''); setPassword('') }}>Reset</button>
            <button className="btn primary" type="submit" disabled={loading}>{loading? 'Signing in...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}