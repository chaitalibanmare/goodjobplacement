import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("gjp_token");

    // ALL COURSES
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data));

    // ENROLLED COURSES
    if (token) {
      fetch("http://localhost:5000/api/courses/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          const ids = data.map(c => c._id);
          setEnrolledIds(ids);
        });
    }
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h2>Courses</h2>

        {/* 💻 TECH COURSES */}
        <h3 style={{ marginBottom: "10px" }}>💻 Tech Courses</h3>

        <div
          className="grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {courses
            .filter(c => c.category === "IT")
            .map(course => (
              <div
                key={course._id}
                className="card course"
                style={{
                  width: "260px",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  background: "#fff"
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${course.image}`}
                  alt=""
                  style={{
                    width: "100%",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />

                <h4 style={{ margin: "10px 0 5px" }}>{course.name}</h4>

                <p style={{ fontSize: "13px", color: "#555" }}>
                  {course.description.slice(0, 50)}...
                </p>

                <button
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    fontSize: "13px",
                    background: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    width: "100%",
                    cursor: "pointer"
                  }}
                >
                  View Course
                </button>

                {enrolledIds.includes(course._id) && (
                  <button
                    style={{
                      marginTop: "6px",
                      background: "#16a34a",
                      color: "#fff",
                      padding: "8px",
                      fontSize: "13px",
                      border: "none",
                      borderRadius: "6px",
                      width: "100%",
                      cursor: "pointer"
                    }}
                    onClick={() => navigate("/my-courses")}
                  >
                    ▶ Continue
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* 🎨 NON-TECH COURSES */}
        <h3 style={{ margin: "30px 0 10px" }}>🎨 Non-Tech Courses</h3>

        <div
          className="grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {courses
            .filter(c => c.category === "NON-IT")
            .map(course => (
              <div
                key={course._id}
                className="card course"
                style={{
                  width: "260px",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  background: "#fff"
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${course.image}`}
                  alt=""
                  style={{
                    width: "100%",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />

                <h4 style={{ margin: "10px 0 5px" }}>{course.name}</h4>

                <p style={{ fontSize: "13px", color: "#555" }}>
                  {course.description.slice(0, 50)}...
                </p>

                <button
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    fontSize: "13px",
                    background: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    width: "100%",
                    cursor: "pointer"
                  }}
                >
                  View Course
                </button>

                {enrolledIds.includes(course._id) && (
                  <button
                    style={{
                      marginTop: "6px",
                      background: "#16a34a",
                      color: "#fff",
                      padding: "8px",
                      fontSize: "13px",
                      border: "none",
                      borderRadius: "6px",
                      width: "100%",
                      cursor: "pointer"
                    }}
                    onClick={() => navigate("/my-courses")}
                  >
                    ▶ Continue
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* 📦 MODAL */}
        {selectedCourse && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedCourse(null)}
          >
            <div
              className="modal"
              onClick={e => e.stopPropagation()}
              style={{
                width: "500px",
                maxWidth: "90%",
                padding: "25px",
                borderRadius: "12px",
                background: "#fff"
              }}
            >
              <button
                onClick={() => setSelectedCourse(null)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
              >
                ❌
              </button>

              <h2>{selectedCourse.name}</h2>

              <p style={{ margin: "10px 0", color: "#555" }}>
                {selectedCourse.description}
              </p>

              <p>👨‍🏫 {selectedCourse.instructor}</p>
              <p>📅 {selectedCourse.startDate}</p>
              <p>⏱ {selectedCourse.duration}</p>
              <p>📍 {selectedCourse.mode}</p>
              <p>💰 ₹{selectedCourse.fees}</p>

              {enrolledIds.includes(selectedCourse._id) ? (
                <button
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "10px",
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px"
                  }}
                  onClick={() => navigate("/my-courses")}
                >
                  ▶ Continue Learning
                </button>
              ) : (
                <button
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "10px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px"
                  }}
                  onClick={() =>
                    navigate(`/payment/${selectedCourse._id}`, {
                      state: selectedCourse,
                    })
                  }
                >
                  Proceed to Payment 💳
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}