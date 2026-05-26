import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserCommunity() {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ GET LOGGED USER
  const user = JSON.parse(localStorage.getItem("gjp_user"));
  const userId = user?.id; // keep as string

  // Get base URL for images
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getProfilePhotoUrl = () => {
    if (user && user.photo) {
      return `${baseUrl}/uploads/${user.photo}`;
    }
    return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
  };

  // ================= FETCH =================
  const fetchData = () => {
    fetch(`${baseUrl}/api/community/approved`)
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
  }, [location.pathname]);

  // ================= JOIN =================
  const handleJoin = async (id) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/community/join/${id}`,
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
    <section className="section">
      <div className="container">
        <h2>Communities</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "30px",
            marginTop: "30px",
          }}
        >
          {communities.map((c) => {
            const isJoined =
              Array.isArray(c.community_members) &&
              userId &&
              c.community_members.some(m => m.user_id === userId);

            const memberCount = (c.community_members || []).length;

            // Format members string
            const formatMembers = (count) => {
              if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
              return count;
            };

            return (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* IMAGE */}
                <div style={{ position: "relative", height: "180px", width: "100%" }}>
                  <img
                    src={
                      c.image
                        ? `${baseUrl}${c.image}`
                        : `https://source.unsplash.com/400x200/?${c.name.split(' ')[0]}`
                    }
                    alt="community"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Member Count Overlay */}
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(4px)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    {formatMembers(memberCount)} Members
                  </div>
                </div>

                {/* CONTENT */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                    {memberCount > 5 && (
                      <span style={{
                        background: "#fdf2f8",
                        color: "#db2777",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "800",
                        letterSpacing: "0.5px"
                      }}>
                        TRENDING
                      </span>
                    )}
                    <span style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "800",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase"
                    }}>
                      {c.category || "General"}
                    </span>
                  </div>

                  <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#111827" }}>{c.name}</h3>

                  <p style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0 0 20px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: "1.5"
                  }}>
                    {c.description || "Join this community to connect with others, share knowledge, and grow your career."}
                  </p>

                  {/* Bottom Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>

                    {/* Avatars */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {(c.community_members || []).slice(0, 3).map((member, i) => (
                        <img
                          key={member.user_id || i}
                          src={member.users?.photo ? `${baseUrl}/uploads/${member.users.photo}` : `https://ui-avatars.com/api/?name=${member.users?.name || 'User'}&background=random`}
                          alt={member.users?.name || 'member'}
                          title={member.users?.name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "2px solid #fff",
                            marginLeft: i === 0 ? "0" : "-12px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            objectFit: "cover"
                          }}
                        />
                      ))}
                      {memberCount > 3 && (
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: "2px solid #fff",
                          marginLeft: "-12px",
                          backgroundColor: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: "#4b5563",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          zIndex: 1
                        }}>
                          +{memberCount - 3}
                        </div>
                      )}
                    </div>

                    {/* Join Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isJoined ? navigate(`/user/community/${c.id}`) : handleJoin(c.id);
                      }}
                      style={{
                        padding: "8px 20px",
                        borderRadius: "20px",
                        border: "none",
                        background: "linear-gradient(135deg, #9333ea, #7c3aed)",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px -1px rgba(147, 51, 234, 0.3)",
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = "0.9"}
                      onMouseLeave={(e) => e.target.style.opacity = "1"}
                    >
                      {isJoined ? "Open Community" : "Join Community"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}