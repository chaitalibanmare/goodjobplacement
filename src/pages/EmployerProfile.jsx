import React, { useState, useEffect } from "react";
import "../employer/EmployerProfile.css";


export default function EmployerProfile() {

  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);

  const [logo, setLogo] = useState(null);
  const [companyImage, setCompanyImage] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [years, setYears] = useState("");
  const [address, setAddress] = useState("");

  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ================= LOAD PROFILE =================
  async function loadProfile() {
    const token = localStorage.getItem("gjp_token");

    const res = await fetch(base + "/api/employer/profile", {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (data.profile) {
      setProfile(data.profile);

      setCompanyName(data.profile.company_name || data.profile.companyName || "");
      setEmail(data.profile.email || "");
      setContact(data.profile.contact || "");
      setYears(data.profile.years_completed || data.profile.yearsCompleted || "");
      setAddress(data.profile.address || "");
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  // ================= SAVE PROFILE =================
  async function saveProfile(e) {
    e.preventDefault();

    const token = localStorage.getItem("gjp_token");

    const formData = new FormData();

    formData.append("companyName", companyName);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("yearsCompleted", years);
    formData.append("address", address);

    if (logo) formData.append("logo", logo);
    if (companyImage) formData.append("companyImage", companyImage);

    const res = await fetch(base + "/api/employer/profile", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });

    if (res.ok) {
      alert("Profile updated");
      setEdit(false);
      loadProfile();
    } else {
      const data = await res.json();
      console.error("Backend Error Response:", data);
      alert("Failed to update profile: " + JSON.stringify(data.fullError || data.details || data.message || "Server error"));
    }
  }

  // ================= UI =================
  return (
  <div className="profile-page">

    <div className="company-profile-card">

      {/* ================= VIEW MODE ================= */}
      {!edit && (
        <div className="profile-view">

          <h2 className="profile-title">Company Profile</h2>

          <img
            src={profile?.logo ? base + "/uploads/" + profile.logo : "/company.png"}
            className="company-logo"
            alt="Company Logo"
          />

          <h3 className="company-name">
            {profile?.company_name || profile?.companyName || "Company Name"}
          </h3>

          <div className="company-info">
            <p><b>Email:</b> {profile?.email || "-"}</p>
            <p><b>Phone:</b> {profile?.contact || "-"}</p>
            <p><b>Years Completed:</b> {profile?.years_completed || profile?.yearsCompleted || "-"}</p>
            <p><b>Address:</b> {profile?.address || "-"}</p>
          </div>

          {(profile?.company_image || profile?.companyImage) && (
            <img
              src={base + "/uploads/" + (profile.company_image || profile.companyImage)}
              className="company-image"
              alt="Company"
            />
          )}

          <button
            className="btn primary"
            onClick={() => setEdit(true)}
          >
            Edit Profile
          </button>

        </div>
      )}

      {/* ================= EDIT MODE ================= */}
      {edit && (
        <form className="form-wrapper profile-form" onSubmit={saveProfile}>

          <h2 className="form-title">Edit Company Profile</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact</label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Years Completed</label>
              <input
                value={years}
                onChange={(e) => setYears(e.target.value)}
                required
              />
            </div>

            <div className="form-group full">
              <label>Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Company Logo</label>
              <input
                type="file"
                onChange={(e) => setLogo(e.target.files[0])}
              />
            </div>

            <div className="form-group">
              <label>Company Image</label>
              <input
                type="file"
                onChange={(e) => setCompanyImage(e.target.files[0])}
              />
            </div>

          </div>

          <button className="submit-btn">
            Update Profile
          </button>

          <button
            type="button"
            className="close-btn"
            onClick={() => setEdit(false)}
            style={{ marginTop: "10px", width: "100%" }}
          >
            Cancel
          </button>

        </form>
      )}

    </div>

  </div>
);
}