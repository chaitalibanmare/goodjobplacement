import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserCommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const user = JSON.parse(localStorage.getItem("gjp_user"));
  const userId = user?._id;

  // ================= TIME FORMAT =================
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= DATE HELPERS =================
  const isToday = (date) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const isYesterday = (date) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return new Date(date).toDateString() === y.toDateString();
  };

  const formatDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return new Date(date).toLocaleDateString();
  };

  // ================= FETCH DATA =================
 useEffect(() => {
  const fetchCommunity = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/details/${id}/${userId}`
      );

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();
      console.log("COMMUNITY DATA:", data); // 🔥 DEBUG

      setCommunity(data.community);
    } catch (err) {
      console.error("ERROR FETCHING COMMUNITY:", err);
    }
  };

  fetchCommunity();

  fetch(`http://localhost:5000/api/posts/${id}`)
    .then((res) => res.json())
    .then((data) => setPosts(data));
}, [id]);
  // ================= FETCH MEMBERS =================
  const fetchMembers = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/members/${id}`
      );
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EXIT =================
  const handleExit = async () => {
  const confirmExit = window.confirm("Leave this community?");
  if (!confirmExit) return;

  try {
    await fetch(`http://localhost:5000/api/community/leave/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    // ✅ FORCE CLEAN NAVIGATION + REFRESH
    navigate("/user/community");
    
    // optional but powerful
    window.location.reload();

  } catch (err) {
    console.error(err);
  }
};
  // ================= REACTION =================
  const handleReaction = async (postId, emoji) => {
  setPosts((prev) =>
    prev.map((p) => {
      if (p._id !== postId) return p;

      let newReactions = { ...p.reactions };

      let alreadyReacted = false;

      // 🔥 REMOVE user from all emojis
      Object.keys(newReactions).forEach((key) => {
        if (newReactions[key]?.includes(userId)) {
          if (key === emoji) {
            alreadyReacted = true; // same emoji clicked
          }
          newReactions[key] = newReactions[key].filter(
            (id) => id !== userId
          );
        }
      });

      // ✅ ADD only if NOT same emoji
      if (!alreadyReacted) {
        newReactions[emoji] = [
          ...(newReactions[emoji] || []),
          userId,
        ];
      }

      return {
        ...p,
        reactions: newReactions,
      };
    })
  );

  // API call
  try {
    await fetch(`http://localhost:5000/api/posts/react/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, emoji }),
    });
  } catch (err) {
    console.error(err);
  }
};

  // ================= GROUP POSTS =================
  const sortedPosts = [...posts].reverse();

const groupedPosts = [];
sortedPosts.forEach((p, index) => {
  const current = formatDateLabel(p.createdAt);

  const prev =
    index > 0
      ? formatDateLabel(sortedPosts[index - 1].createdAt)
      : null;

  if (current !== prev) {
    groupedPosts.push({ type: "date", label: current });
  }

  groupedPosts.push({ type: "post", data: p });
});

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh", padding: "30px 0" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            padding: "15px",
            background: "#7c3aed",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        onClick={() => {
          setShowMembers(prev => !prev);
          fetchMembers();
        }}
        >
          <div>
            <h3 style={{ margin: 0 }}>{community?.name}</h3>
            <small>
              {(community?.members || []).filter(m => m).length} members
            </small>
          </div>

          {/* EXIT BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExit();
            }}
            style={{
              background: "#ef4444",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Exit
          </button>
        </div>

        {/* ================= MEMBERS ================= */}
        {showMembers && (
          <div
            style={{
              background: "#fff",
              padding: "15px",
              margin: "10px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h4>Members</h4>

            {members.length === 0 ? (
              <p>No members</p>
            ) : (
              members.map((m) => (
                <div key={m._id}>
                  👤 {m.name} ({m.email})
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= POSTS ================= */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            background: "#f9fafb",
          }}
        >
          {groupedPosts.map((item, index) => {
            if (item.type === "date") {
              return (
                <div
                  key={index}
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#666",
                    background: "#e5e7eb",
                    padding: "5px 12px",
                    borderRadius: "12px",
                    width: "fit-content",
                    margin: "10px auto",
                  }}
                >
                  {item.label}
                </div>
              );
            }

            const p = item.data;
            const userReaction = Object.keys(p.reactions || {}).find(
              (emoji) => p.reactions[emoji]?.includes(userId)
            );

            return (
              <div
                key={p._id}
                style={{
                   position: "relative",
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                <p style={{ marginBottom: "10px" }}>{p.text}</p>

                {p.image && (
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    alt=""
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                {/* ✅ PUT HERE */}
{userReaction && (
  <div
    style={{
      position: "absolute",
      bottom: "8px",
      right: "10px",
      background: "#fff",
      borderRadius: "20px",
      padding: "2px 6px",
      fontSize: "14px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    }}
  >
    {userReaction}
  </div>
)}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <small style={{ fontSize: "11px", color: "#666" }}>
                    {formatTime(p.createdAt)}
                  </small>
                </div>

                {/* EMOJIS */}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "12px",
                    fontSize: "18px",
                  }}
                >
                  {["👍", "❤️", "😂", "😮", "😢"].map((emoji) => {
                    const count = p.reactions?.[emoji]?.length || 0;
                    const users = p.reactions?.[emoji] || [];
                    const reacted = users.includes(userId);

                    return (
                      <span
                        key={emoji}
                        onClick={() => handleReaction(p._id, emoji)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          background: reacted ? "#bbf7d0" : "#f3f4f6",
                        }}
                      >
                        {emoji} {count}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}