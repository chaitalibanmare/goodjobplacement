import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserCommunity() {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ GET LOGGED USER
  const user = JSON.parse(localStorage.getItem("gjp_user"));
  const userId = user?._id; // keep as string

  // ================= FETCH =================
  const fetchData = () => {
    fetch("http://localhost:5000/api/community/approved")
      .then((res) => res.json())
      .then((data) => setCommunities(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
  fetchData();
}, [location.pathname]);

  // ================= JOIN =================
  const handleJoin = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/community/join/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await res.json();

    // ✅ FORCE FULL REFRESH DATA
    fetchData();

    navigate(`/user/community/${id}`);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1100px", margin: "auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2>Communities</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "25px",
        }}
      >
        {communities.map((c) => {
          // ✅ SAFE JOIN CHECK (NO CRASH)
          const isJoined =
  Array.isArray(c.members) &&
  userId &&
  c.members
    .filter(m => m) // ✅ remove null
    .map(m => m.toString())
    .includes(userId);

          return (
            <div
              key={c._id}
              style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            >
              {/* IMAGE */}
              <img
                src={
                  c.image
                    ? `http://localhost:5000${c.image}`
                    : `https://source.unsplash.com/400x200/?${c.name}`
                }
                alt="community"
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                }}
              />

              {/* CONTENT */}
              <div style={{ padding: "15px", textAlign: "center" }}>
                <h3>{c.name}</h3>

                <p style={{ fontSize: "13px", color: "#777" }}>
  👥 {(c.members || []).filter(m => m).length} Members
</p>

                <button
                  onClick={() =>
                    isJoined
                      ? navigate(`/user/community/${c._id}`)
                      : handleJoin(c._id)
                  }
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "25px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #7c3aed, #9333ea)",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {isJoined ? "Open Community" : "Join Community"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}