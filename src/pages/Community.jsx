import React, { useState } from "react";

import MernIcon from "../assets/icon-community-mern.svg";
import MakeupIcon from "../assets/icon-community-makeup.svg";
import DataIcon from "../assets/icon-community-data.svg";

const SAMPLE = [
  {
    name: "MERN Stack Community",
    description: "React, Node, Express and MongoDB projects and help.",
    image: null,
    icon: MernIcon,
  },
  {
    name: "Makeup Artist Circle",
    description: "Portfolio building, clients and workshops.",
    image: null,
    icon: MakeupIcon,
  },
  {
    name: "Data Science Builders",
    description: "Kaggle projects, mentorship and study groups.",
    image: null,
    icon: DataIcon,
  },
];

export default function Community() {
  const [communities, setCommunities] = useState([]); // ✅ State for real data
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("gjp_token");

  // FETCH DATA
  React.useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/community/approved")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCommunities(data);
          } else {
            console.error("Backend error:", data);
            setCommunities([]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  // VIEW CLICK
  function handleView(c) {
    setSelected(c);
    setViewOpen(true);
  }

  // JOIN CLICK
  function handleJoin(c) {
    if (!token) {
      alert("Please login to join the community");
    } else {
      alert(`You joined ${c.name}`);
    }
  }

  // Choose what to display
  const displayData = token ? communities : SAMPLE;

  return (
    <div className="home-wrapper" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <section className="home-section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <h2>Community</h2>
          <p style={{ color: "var(--muted)" }}>
            Join topic-based communities to collaborate, learn and find opportunities.
          </p>

          {/* CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px", marginTop: "30px" }}>
            {displayData.length === 0 ? (
              <p>No communities available yet.</p>
            ) : (
              displayData.map((c, index) => (
                <div key={index} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img
                    src={c.image ? `http://localhost:5000${c.image}` : `https://picsum.photos/seed/${c.name.length + index}/400/200`}
                    alt="community"
                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                  />

                  <div style={{ padding: "20px", textAlign: "center" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#111" }}>{c.name}</h3>
                    <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
                      {c.description}
                    </p>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleJoin(c)}
                        style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
                      >
                        Join
                      </button>
                      <button
                        onClick={() => handleView(c)}
                        style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "1px solid #ddd", background: "#fff", color: "#333", fontWeight: "bold", cursor: "pointer" }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ================= MODAL (LIKE COURSE UI) ================= */}
          {viewOpen && selected && (
            <div className="modal-backdrop" onClick={() => setViewOpen(false)}>

              <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "480px",        // 👈 SAME SIZE STYLE
                  padding: "24px",
                  borderRadius: "14px"
                }}
              >
                {/* TITLE */}
                <h3 style={{ marginBottom: 10 }}>
                  {selected.name}
                </h3>

                {/* DESCRIPTION */}
                <p style={{ color: "#555", lineHeight: "1.5" }}>
                  {selected.description}
                </p>

                {/* DETAILS */}
                <div style={{ marginTop: 15 }}>
                  <p>👥 120 Members</p>
                  <p>📅 Active daily discussions</p>
                  <p>💡 Beginner friendly</p>
                </div>

                {/* SAMPLE */}
                <div style={{ marginTop: 15 }}>
                  <p><b>Sample Topics:</b></p>
                  <p>• Interview preparation</p>
                  <p>• Project help</p>
                  <p>• Resume building</p>
                </div>

                {/* BUTTON */}
                <button
                  className="btn primary"
                  style={{ marginTop: 20, width: "100%" }}
                  onClick={() => setViewOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
