import React, { useState } from "react";

import MernIcon from "../assets/icon-community-mern.svg";
import MakeupIcon from "../assets/icon-community-makeup.svg";
import DataIcon from "../assets/icon-community-data.svg";

const SAMPLE = [
  {
    name: "MERN Stack Community",
    desc: "React, Node, Express and MongoDB projects and help.",
    icon: MernIcon,
  },
  {
    name: "Makeup Artist Circle",
    desc: "Portfolio building, clients and workshops.",
    icon: MakeupIcon,
  },
  {
    name: "Data Science Builders",
    desc: "Kaggle projects, mentorship and study groups.",
    icon: DataIcon,
  },
];

export default function Community() {
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("gjp_token");

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

  return (
    <section className="section">
      <div className="container">
        <h2>Community</h2>
        <p style={{ color: "var(--muted)" }}>
          Join topic-based communities to collaborate, learn and find opportunities.
        </p>

        {/* CARDS */}
        <div className="community-list" style={{ marginTop: 16 }}>
          {SAMPLE.map((c) => (
            <div key={c.name} className="card community-card">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={c.icon} alt="" style={{ width: 44, height: 44, borderRadius: 8 }} />
                <div>
                  <h4 style={{ margin: 0 }}>{c.name}</h4>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    {c.desc}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn primary" onClick={() => handleJoin(c)}>
                  Join
                </button>

                <button className="btn ghost" onClick={() => handleView(c)}>
                  View
                </button>
              </div>
            </div>
          ))}
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
                {selected.desc}
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
  );
}