import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);

  const navigate = useNavigate();

  const isCourseFree = (fees) => {
    if (!fees) return true;
    const f = String(fees).trim().toLowerCase();
    return f === "0" || f === "free" || f === "-" || f === "0.00";
  };

  const handleFreeEnrollment = async (course) => {
    const token = localStorage.getItem("gjp_token");
    if (!token) {
      alert("Please login to enroll.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/payment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: course.id,
          utrNumber: "FREE-" + Date.now(),
          amount: 0,
        }),
      });

      if (res.ok) {
        alert("Successfully enrolled in free course!");
        navigate("/my-courses");
      } else {
        const data = await res.json();
        alert(data.error || "Enrollment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error enrolling in course");
    }
  };

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
          const ids = data.map(c => c.id);
          setEnrolledIds(ids);
        });
    }
  }, []);

  const renderCourseCard = (course) => (
    <div
      key={course.id}
      style={{
        width: "320px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <img
        src={`http://localhost:5000/uploads/${course.image}`}
        alt=""
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover"
        }}
      />
      
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <h4 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "700", flex: 1, paddingRight: "10px", lineHeight: "1.3" }}>
            {course.name}
          </h4>
          <span style={{ 
            background: "#3b82f6", 
            color: "#fff", 
            padding: "6px 14px", 
            borderRadius: "20px", 
            fontSize: "15px", 
            fontWeight: "bold",
            whiteSpace: "nowrap"
          }}>
            {isCourseFree(course.fees) ? "Free" : `₹${course.fees}`}
          </span>
        </div>

        <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 15px 0", lineHeight: "1.5", minHeight: "42px" }}>
          {course.description.length > 80 ? course.description.slice(0, 80) + "..." : course.description}
        </p>

        <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "#94a3b8", marginBottom: "20px", marginTop: "auto" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            ⏱ {course.duration}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            👨‍🏫 {course.instructor}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setSelectedCourse(course)}
            style={{
              background: "#f1f5f9",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              padding: "10px 16px"
            }}
          >
            Details
          </button>

          {enrolledIds.includes(course.id) ? (
            <button
              style={{
                background: "#6d28d9",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px"
              }}
              onClick={() => navigate("/my-courses")}
            >
              Continue
            </button>
          ) : isCourseFree(course.fees) ? (
            <button
              style={{
                background: "#6d28d9",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px"
              }}
              onClick={() => handleFreeEnrollment(course)}
            >
              Enroll Now
            </button>
          ) : (
            <button
              style={{
                background: "#6d28d9",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px"
              }}
              onClick={() =>
                navigate(`/payment/${course.id}`, {
                  state: course,
                })
              }
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="section">
      <div className="container" style={{ padding: "40px 0" }}>
        <h2 style={{ fontSize: "28px", color: "#1e293b", margin: "0 0 8px 0" }}>Explore Courses</h2>
        <p style={{ fontSize: "16px", color: "#64748b", margin: "0 0 40px 0" }}>Upgrade your skills with our professionally curated courses.</p>

        {/*  TECH COURSES */}
        {courses.filter(c => c.category === "IT").length > 0 && (
          <>
            <h3 style={{ marginBottom: "20px", color: "#334155" }}> Tech Courses</h3>
            <div
              className="grid"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px",
                marginBottom: "40px"
              }}
            >
              {courses.filter(c => c.category === "IT").map(renderCourseCard)}
            </div>
          </>
        )}

        {/* NON-TECH COURSES */}
        {courses.filter(c => c.category === "NON-IT").length > 0 && (
          <>
            <h3 style={{ marginBottom: "20px", color: "#334155" }}> Non-Tech Courses</h3>
            <div
              className="grid"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px",
              }}
            >
              {courses.filter(c => c.category === "NON-IT").map(renderCourseCard)}
            </div>
          </>
        )}

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
                background: "#fff",
                position: "relative"
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

              {enrolledIds.includes(selectedCourse.id) ? (
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
              ) : isCourseFree(selectedCourse.fees) ? (
                <button
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "10px",
                    background: "#8b5cf6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleFreeEnrollment(selectedCourse)}
                >
                  Enroll Now (Free) 
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
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    navigate(`/payment/${selectedCourse.id}`, {
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