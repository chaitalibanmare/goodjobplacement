import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const base = "http://localhost:5000";

  const fetchCourses = () => {
    fetch(`${base}/api/courses/staff`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${base}/api/courses/${id}`, {
        method: "DELETE"
      });

      await res.json();
      alert("Deleted Successfully");
      fetchCourses();

    } catch (err) {
      console.error("DELETE ERROR:", err);
    }

  };

  // EDIT
  const handleEdit = (course) => {
    navigate("/staff/courses/add", { state: course });
  };

  // 👁️ VIEW CONTENT
  const handleViewContent = (course) => {
    navigate("/staff/course-content/", { state: course });
  };

  return (
    <> <h3>View Courses</h3>

      <div className="table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Mode</th>
              <th>Fees</th>
              <th>Videos</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(courses) ? courses.map((c) => (
              <tr key={c.id}>

                <td>
                  <img
                    src={`${base}/uploads/${c.image}`}
                    className="table-img"
                    alt=""
                  />
                </td>

                <td>{c.name}</td>
                <td>{c.category || "—"}</td>
                <td>{c.duration}</td>
                <td>{c.mode}</td>
                <td>₹ {c.fees}</td>

                {/* ✅ SHOW COUNT */}
                <td>{c.youtubeLinks ? c.youtubeLinks.length : 0}</td>
                <td>{c.notes ? c.notes.length : 0}</td>

                <td>
                  <button className="edit-btn" onClick={() => handleEdit(c)}>
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>

                  {/* 👁️ VIEW CONTENT */}
                  <button className="view-btn" onClick={() => handleViewContent(c)}>
                    View
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8">No courses found or error loading data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>

  );
};

export default ViewCourses;
