import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewCommunity() {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  // GET REAL STAFF ID
  const staff = JSON.parse(localStorage.getItem("staff") || "{}");
  const userId = staff.id; 

  const fetchData = () => {
    if (!userId) return; // Wait for ID
    fetch(`http://localhost:5000/api/community/my/${userId}`)
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this community?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/community/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("DELETE RESPONSE:", data);

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      alert("Deleted successfully");
      fetchData();

    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Error deleting");
    }
  };
  return (
    <div className="community-list-container">
      <h2>Your Communities</h2>

      {communities.length === 0 ? (
        <p>No communities yet</p>
      ) : (
        <div className="community-grid">
          {communities.map((c) => (
            <div key={c.id} className="community-card">
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>

                {/* IMAGE */}
                {c.image && (
                  <img
                    src={`http://localhost:5000${c.image}`}
                    alt="community"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* TEXT */}
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                </div>

              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                {/* OPEN */}
                <button
                  className="open-btn"
                  onClick={() => navigate(`/staff/community/${c.id}`)}
                >
                  Open →
                </button>

                {/* EDIT */}
                <button
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#f59e0b",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/staff/community/create/${c.id}`)}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}