import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.svg";

export default function UserProfile() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const res = await fetch(`http://localhost:5000/api/user/view/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("gjp_token")
        }
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        setError(data.error || "Failed to load user");
      }

    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "40px", color: "red" }}>{error}</p>;
  if (!user) return <p style={{ padding: "40px" }}>No user data</p>;

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px"
      }}
    >

      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "var(--card)",
          padding: "35px",
          borderRadius: "14px",
          boxShadow: "0 12px 40px rgba(2,6,23,0.55)",
          border: "1px solid rgba(255,255,255,0.03)",
          textAlign: "center",
          color: "var(--text)"
        }}
      >

        <h2 style={{ marginBottom: "20px" }}>User Profile</h2>

        <img
          src={
            user.profile?.photo
              ? `http://localhost:5000${user.profile.photo}`
              : defaultAvatar
          }
          alt="profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
            border: "3px solid var(--accent)"
          }}
        />

        <div
          style={{
            textAlign: "left",
            lineHeight: "1.8",
            color: "var(--muted)"
          }}
        >

          <p><b style={{ color: "var(--text)" }}>Name:</b> {user.name}</p>
          <p><b style={{ color: "var(--text)" }}>Email:</b> {user.email}</p>
          <p><b style={{ color: "var(--text)" }}>Phone:</b> {user.phone || "-"}</p>

          <p>
            <b style={{ color: "var(--text)" }}>Qualifications:</b>{" "}
            {user.profile?.qualifications || "-"}
          </p>

          <p>
            <b style={{ color: "var(--text)" }}>Experience:</b>{" "}
            {user.profile?.experience || "-"}
          </p>

          {/* ✅ RESUME BUTTON */}
          <p>
            <b style={{ color: "var(--text)" }}>Resume:</b>{" "}
            {user.profile?.resume ? (
              <button
                onClick={() => setShowResume(true)}
                style={{
                  marginLeft: "10px",
                  padding: "6px 12px",
                  background: "#1a0260",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                View
              </button>
            ) : (
              "-"
            )}
          </p>

        </div>
      </div>

      {/* ✅ RESUME MODAL */}
      {showResume && (
        <div style={{
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
        }}>
          <div style={{
            background: "#fff",
            width: "85%",
            height: "85%",
            borderRadius: "14px",
            padding: "15px",
            position: "relative"
          }}>

            {/* CLOSE */}
            <span
              onClick={() => setShowResume(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ✖
            </span>

            {/* PDF VIEW */}
            <iframe
              src={`http://localhost:5000/api/user/resume/${user.profile.resume.split("/").pop()}`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "10px"
              }}
              title="Resume"
            />

          </div>
        </div>
      )}

    </section>
  );
}