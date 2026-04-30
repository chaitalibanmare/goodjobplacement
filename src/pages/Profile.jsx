import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ setUser }) {

  const [loading, setLoading] = useState(true)
  const [localUser, setLocalUser] = useState(null)

  const [editMode, setEditMode] = useState(false)

  const [fullName, setFullName] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [experience, setExperience] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)

  const [showResume, setShowResume] = useState(false)

  const navigate = useNavigate()

  // ✅ MODAL STYLES (UPDATED)
  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000
    },
    content: {
      background: "#fff",
      width: "85%",
      height: "85%",
      borderRadius: "14px",
      padding: "15px",
      position: "relative",
      boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
    },
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
      borderRadius: "10px"
    },
    close: {
      position: "absolute",
      top: "12px",
      right: "15px",
      fontSize: "20px",
      cursor: "pointer",
      color: "#555"
    }
  }

  // ✅ INPUT STYLE (UPDATED)
  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s"
  }

  // ✅ BUTTONS (UPDATED)
  const primaryBtn = {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #6C3EF4, #7C3AED)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500"
  }

  const secondaryBtn = {
    padding: "10px 18px",
    background: "#f1f1f1",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }

  useEffect(() => {
    const token = localStorage.getItem('gjp_token')
    if (!token) { setLoading(false); return }

    ;(async () => {
      const base = "http://localhost:5000"

      const res = await fetch(base + '/api/user/me', {
        headers: { Authorization: 'Bearer ' + token }
      })

      const data = await res.json()

      if (data.user) {
        setLocalUser(data.user)

        const p = data.user.profile || {}
        setFullName(p.fullName || data.user.name || '')
        setQualifications(p.qualifications || '')
        setExperience(p.experience || '')
        setPhotoPreview(p.photo ? base + p.photo : null)
      }

      setLoading(false)
    })()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    const token = localStorage.getItem('gjp_token')
    const fd = new FormData()

    fd.append('fullName', fullName)
    fd.append('qualifications', qualifications)
    fd.append('experience', experience)

    if (photoFile) fd.append('photo', photoFile)
    if (resumeFile) fd.append('resume', resumeFile)

    const res = await fetch("http://localhost:5000/api/user/me", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: fd
    })

    const data = await res.json()

    alert("Profile Updated ✅")

    setLocalUser(data.user)
    localStorage.setItem("gjp_user", JSON.stringify(data.user))

    setEditMode(false)
    window.location.reload()
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>

  return (
    <section style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>

        {localUser && (
          <div style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "14px",
            width: "400px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
            textAlign: "center"
          }}>

            <h3 style={{ marginBottom: "15px" }}>Profile</h3>

            <img
              src={
                localUser?.profile?.photo
                  ? `http://localhost:5000${localUser.profile.photo}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #6C3EF4",
                marginBottom: "15px"
              }}
            />

            <p><b>Name:</b> {fullName}</p>
            <p><b>Email:</b> {localUser.email}</p>
            <p><b>Phone:</b> {localUser.phone}</p>
            <p><b>Qualification:</b> {qualifications}</p>
            <p><b>Experience:</b> {experience}</p>

            {localUser.profile?.resume && (
              <button
                onClick={() => setShowResume(true)}
                style={{ ...primaryBtn, marginTop: "10px" }}
              >
                📄 View Resume
              </button>
            )}

            <br />

            <button
              onClick={() => setEditMode(true)}
              style={{ ...secondaryBtn, marginTop: "15px" }}
            >
              Edit Profile
            </button>

          </div>
        )}
      </div>

      {/* 🔥 EDIT MODAL */}
      {editMode && (
        <div style={modalStyles.overlay}>
          <div style={{
            background: "#fff",
            width: "420px",
            borderRadius: "14px",
            padding: "30px",
            position: "relative",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
          }}>

            <span style={modalStyles.close} onClick={() => setEditMode(false)}>✖</span>

            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Profile</h3>

            <form onSubmit={handleSubmit} style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>

              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full Name"
                style={inputStyle}
              />

              <textarea
                value={qualifications}
                onChange={e => setQualifications(e.target.value)}
                placeholder="Qualifications"
                style={inputStyle}
              />

              <textarea
                value={experience}
                onChange={e => setExperience(e.target.value)}
                placeholder="Experience"
                style={inputStyle}
              />

              {/* PHOTO UPLOAD */}
<div style={{ textAlign: "left" }}>
  <label style={{ fontSize: "13px", fontWeight: "500" }}>
    Upload Profile Photo
  </label>
  <input 
    type="file" 
    accept="image/*"
    onChange={e => setPhotoFile(e.target.files[0])}
    style={{ marginTop: "5px" }}
  />
</div>

{/* RESUME UPLOAD */}
<div style={{ textAlign: "left" }}>
  <label style={{ fontSize: "13px", fontWeight: "500" }}>
    Upload Resume (PDF only)
  </label>
  <input 
    type="file" 
    accept=".pdf"
    onChange={e => setResumeFile(e.target.files[0])}
    style={{ marginTop: "5px" }}
  />
</div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "10px"
              }}>
                <button type="submit" style={primaryBtn}>Save</button>
                <button type="button" onClick={() => setEditMode(false)} style={secondaryBtn}>Cancel</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 🔥 RESUME MODAL */}
      {showResume && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>

            <span style={modalStyles.close} onClick={() => setShowResume(false)}>✖</span>

            <iframe
              src={`http://localhost:5000/api/user/resume/${localUser.profile.resume.split("/").pop()}`}
              style={modalStyles.iframe}
              title="Resume"
            />

          </div>
        </div>
      )}

    </section>
  )
}