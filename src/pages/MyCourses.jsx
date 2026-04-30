import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("gjp_token");

    if (!token) {
      alert("Please login first");
      navigate("/");
      return;
    }

    fetch("http://localhost:5000/api/courses/my-courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
      })
      .catch(err => {
        console.error(err);
        setCourses([]);
      });
  }, [navigate]);

  return (
    <div className="container">
      <h2 className="title">My Courses</h2>

      {courses.length === 0 && <p>No enrolled courses</p>}

      <div className="grid">
        {courses
          .filter(course => course !== null)
          .map(course => (
            <div key={course._id} className="card">

              <img
                src={`http://localhost:5000/uploads/${course.image}`}
                alt=""
                className="course-img"
              />

              <h3>{course.name}</h3>

              <p className="info">⏱ {course.duration}</p>
              <p className="info">👨‍🏫 {course.instructor}</p>

              <div className="btn-group">
                <button
                  className="start-btn"
                  onClick={() => navigate("/course-content", { state: course })}
                >
                  📘 Start Learning
                </button>
              </div>

            </div>
          ))}
      </div>

      <style>{`
        .container {
          padding: 20px;
        }

        .title {
          margin-bottom: 20px;
        }

        /* ✅ ONLY 3 CARDS PER ROW */
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 280px);
          gap: 30px;
          justify-content: center;
          margin-top: 20px;
        }

        .card {
          width: 280px;
          background: #fff;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          text-align: center;
        }

        .course-img {
          width: 100%;
          height: 140px;
          object-fit: contain;
          background: #f3f4f6;
          border-radius: 10px;
          padding: 10px;
        }

        .info {
          font-size: 14px;
          margin: 4px 0;
        }

        .btn-group {
          margin-top: 12px;
          display: flex;
        }

        .start-btn {
          width: 100%;
          padding: 10px;
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* 🔥 OPTIONAL RESPONSIVE */
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: repeat(2, 280px);
          }
        }

        @media (max-width: 600px) {
          .grid {
            grid-template-columns: repeat(1, 280px);
          }
        }
      `}</style>
    </div>
  );
}