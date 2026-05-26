import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateCommunity() {
  const { id } = useParams(); // EDIT MODE
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // GET REAL STAFF ID
  const staff = JSON.parse(localStorage.getItem("staff") || "{}");
  const userId = staff.id;

  // ================= LOAD DATA (EDIT MODE) =================
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/community/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
          });

          if (data.image) {
            setPreview(`http://localhost:5000${data.image}`);
          }
        });
    }
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= IMAGE SELECT =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setShowPreview(false); // reset preview

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("userId", userId);

    if (image) {
      formData.append("image", image);
    }

    try {
      const url = id
        ? `http://localhost:5000/api/community/update/${id}`
        : "http://localhost:5000/api/community/create";

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
  method,
  body: formData,
});

const data = await res.json();
console.log("UPDATE RESPONSE:", data);

if (!res.ok) {
  alert("Update failed");
  return;
}

      alert(id ? "Community Updated" : "Community Created");

      navigate("/staff/community/view");
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <>
      <h2>{id ? "Edit Community" : "Create Community"}</h2>

      <div className="community-container">
        <form className="community-form" onSubmit={handleSubmit}>
          
          {/* NAME */}
          <div className="form-row">
            <label>Community Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="form-row">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Placement">Placement</option>
              <option value="Course">Course</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* IMAGE INPUT */}
          <div className="form-row">
            <label>Upload Image</label>
            <input type="file" onChange={handleImageChange} />
          </div>

          {/* PREVIEW BUTTON */}
          {preview && (
            <div style={{ marginBottom: "10px" }}>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  padding: "8px 15px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#7c3aed",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {showPreview ? "Hide Image" : "Preview Image"}
              </button>
            </div>
          )}

          {/* IMAGE PREVIEW (ONLY WHEN CLICKED) */}
          {showPreview && preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "250px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
          )}

          {/* SUBMIT */}
          <button type="submit" className="community-submit-btn">
            {id ? "Update Community" : "Create Community"}
          </button>

        </form>
      </div>
    </>
  );
}