import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./style.css";

const AddCourse = () => {
const location = useLocation();
const editData = location.state;
const navigate = useNavigate();
// ❌ DELETE YOUTUBE FIELD
const removeYoutubeField = (index) => {
  const updatedLinks = form.youtubeLinks.filter((_, i) => i !== index);
  setForm({ ...form, youtubeLinks: updatedLinks });
};

const [form, setForm] = useState({
name: "",
image: null,
description: "",
fees: "",
duration: "",
mode: "Online",
category: "",
instructor: "",
startDate: "",
youtubeLinks: [""],
notes: [null]
});

const base = "http://localhost:5000";

// PREFILL FORM FOR EDIT
useEffect(() => {
if (editData) {
setForm({
name: editData.name || "",
image: null,
description: editData.description || "",
fees: editData.fees || "",
duration: editData.duration || "",
mode: editData.mode || "Online",
category: editData.category || "",
instructor: editData.instructor || "",
startDate: editData.startDate?.substring(0, 10) || "",
youtubeLinks: editData.youtubeLinks || [""],
notes: editData.notes?.length ? [] : [null]
});
}
}, [editData]);

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleFileChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.files[0] });
};

// 🎥 YouTube Links
const handleYoutubeChange = (index, value) => {
const updatedLinks = [...form.youtubeLinks];
updatedLinks[index] = value;
setForm({ ...form, youtubeLinks: updatedLinks });
};

const addYoutubeField = () => {
setForm({ ...form, youtubeLinks: [...form.youtubeLinks, ""] });
};

// 📄 Notes
const handleNoteChange = (index, file) => {
  const updatedNotes = [...form.notes];
  updatedNotes[index] = file;
  setForm({ ...form, notes: updatedNotes });
};

const addNoteField = () => {
  setForm({ ...form, notes: [...form.notes, null] });
};

const removeNoteField = (index) => {
  const updatedNotes = form.notes.filter((_, i) => i !== index);
  setForm({ ...form, notes: updatedNotes });
};

const handleSubmit = async (e) => {
e.preventDefault();

const formData = new FormData();

// Normal fields
Object.keys(form).forEach((key) => {
  if (key !== "youtubeLinks" && key !== "notes") {
    if (form[key] !== null && form[key] !== "") {
      formData.append(key, form[key]);
    }
  }
});

// YouTube links
const filteredLinks = form.youtubeLinks.filter(link => link.trim() !== "");

if (filteredLinks.length === 0) {
  alert("At least one YouTube link is required");
  return;
}

formData.append("youtubeLinks", JSON.stringify(filteredLinks));

// Notes PDFs
// ✅ Notes validation (MANDATORY)
const validNotes = form.notes.filter(note => note !== null);

if (validNotes.length === 0) {
  alert("At least one note is required");
  return;
}

// ✅ Send only valid notes
validNotes.forEach(note => {
  formData.append("notes", note);
});

try {
  const url = editData
    ? `${base}/api/courses/${editData._id}`
    : `${base}/api/courses/add`;

  const method = editData ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    body: formData
  });

  await res.json();

  alert(editData ? "Course Updated Successfully" : "Course Added");
  navigate("/staff/courses/view");

  // RESET FORM
  setForm({
    name: "",
    image: null,
    description: "",
    fees: "",
    duration: "",
    mode: "Online",
    category: "",
    instructor: "",
    startDate: "",
    youtubeLinks: [""],
    notes: []
  });

} catch (err) {
  console.error(err);
  alert("Error saving course");
}

};

return (
<> <h2>{editData ? "Edit Course" : "Add Course"}</h2>

  <div className="course-form-container">
    <form className="course-form" onSubmit={handleSubmit}>

      <div className="form-row">
        <label>Course Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <label>Image</label>
        <input type="file" name="image" onChange={handleFileChange} />
      </div>

      <div className="form-row">
        <label>Description</label>
        <input name="description" value={form.description} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <label>Fees</label>
        <input name="fees" value={form.fees} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <label>Duration</label>
        <input name="duration" value={form.duration} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <label>Mode</label>
        <input value="Online" disabled />
        <input type="hidden" name="mode" value="Online" />
      </div>

      <div className="form-row">
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select</option>
          <option value="IT">IT</option>
          <option value="NON-IT">NON-IT</option>
        </select>
      </div>

      <div className="form-row">
        <label>Instructor</label>
        <input name="instructor" value={form.instructor} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Start Date</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
      </div>

      <div className="form-row">
  <label>YouTube Links</label>

  {form.youtubeLinks.map((link, index) => (
    <div key={index} className="youtube-group">

      <input
        value={link}
        onChange={(e) => handleYoutubeChange(index, e.target.value)}
        placeholder="Enter YouTube link"
      />

      {form.youtubeLinks.length > 1 && (
        <button
          type="button"
          className="delete-btn-box"
          onClick={() => removeYoutubeField(index)}
        >
          ❌
        </button>
      )}

    </div>
  ))}

  <button type="button" onClick={addYoutubeField}>
    + Add More
  </button>
</div>

      {/* 📄 Notes Upload */}
     <div className="form-row">
  <label>Lecture Notes</label>

  {form.notes.map((note, index) => (
    <div key={index} className="youtube-group">

      <input
        type="file"
        onChange={(e) => handleNoteChange(index, e.target.files[0])}
      />

      {form.notes.length > 1 && (
        <button
          type="button"
          className="delete-btn-box"
          onClick={() => removeNoteField(index)}
        >
          ❌
        </button>
      )}

    </div>
  ))}

  <button type="button" onClick={addNoteField}>
    + Add More Notes
  </button>
</div>

      <button className="submit-btn">
        {editData ? "Update Course" : "Add Course"}
      </button>

    </form>
  </div>
</>

);
};

export default AddCourse;
