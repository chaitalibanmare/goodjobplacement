import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function CommunityDetails() {
  const { id } = useParams();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ EDIT STATE
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState(null);

  // GET REAL STAFF ID
  const staff = JSON.parse(localStorage.getItem("staff") || "{}");
  const userId = staff.id;

  // ===== LOAD DATA =====
  useEffect(() => {
    fetch(`http://localhost:5000/api/community/${id}`)
      .then((res) => res.json())
      .then((data) => setCommunity(data))
      .catch((err) => console.error(err));

    fetchPosts();
  }, [id]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/community/${id}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== CREATE POST =====
  const handlePost = async () => {
    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append("communityId", id);
    formData.append("userId", userId);
    formData.append("text", text);

    if (image) {
      formData.append("image", image);
    }

    try {
      await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        body: formData,
      });

      setText("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // ===== DELETE POST =====
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/posts/delete/${postId}`, {
        method: "DELETE",
      });

      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // ===== EDIT POST =====
  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditText(post.text);
  };

  const handleUpdate = async (postId) => {
    if (!editText.trim()) return;

    try {
      await fetch(`http://localhost:5000/api/posts/update/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText }),
      });

      setEditingPostId(null);
      setEditText("");
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="community-detail-container">

      {/* ===== COMMUNITY HEADER ===== */}
      <h2>{community?.name}</h2>

      {/* ===== POST INPUT ===== */}
      <div className="post-box">
        <textarea
          placeholder="Share something with your community..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button onClick={handlePost}>Post</button>
      </div>

      {/* ===== POSTS ===== */}
      <div className="posts-container">
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="post-card">

              {/* ===== EDIT MODE ===== */}
              {editingPostId === p.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      resize: "vertical"
                    }}
                  />

                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => handleUpdate(p.id)}>
                      Save
                    </button>

                    <button
                      onClick={() => setEditingPostId(null)}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="post-text">{p.text}</p>

                  {/* IMAGE */}
                  {p.image && (
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt="post"
                      className="post-img"
                    />
                  )}

                  {/* ===== ACTION BUTTONS ===== */}
                  {p.user_id === userId && (
                    <div style={{ marginTop: "10px" }}>

                      {/* ✅ TEXT EXISTS → EDIT + DELETE */}
                      {p.text && p.text.trim() !== "" ? (
                        <>
                          <button onClick={() => handleEdit(p)}>
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(p.id)}
                            style={{ marginLeft: "10px", color: "red" }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        /* ✅ IMAGE ONLY → DELETE */
                        <button
                          onClick={() => handleDelete(p.id)}
                          style={{ color: "red" }}
                        >
                          Delete
                        </button>
                      )}

                    </div>
                  )}
                </>
              )}
              <span className="post-time">
                {new Date(p.created_at).toLocaleString()}
              </span>

            </div>
          ))
        )}
      </div>
    </div>
  );
}