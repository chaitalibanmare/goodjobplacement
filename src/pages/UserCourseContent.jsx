import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function UserCourseContent() {
  const [course, setCourse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const location = useLocation();
  const courseData = location.state;

  useEffect(() => {
    if (courseData) {
      setCourse(courseData);

      // load progress
      const saved = localStorage.getItem(`progress_${courseData._id}`);
      setCurrentIndex(saved ? Number(saved) : 0);
    }
  }, [courseData]);

  if (!course) return <h2>No Course Found</h2>;

  const getVideoId = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.split("/")[1];
      }
      return u.searchParams.get("v");
    } catch {
      return "";
    }
  };

  const totalLectures = course.youtubeLinks?.length || 0;
  const progress = Math.round(((currentIndex + 1) / totalLectures) * 100);

  const changeLecture = (index) => {
    setCurrentIndex(index);
    localStorage.setItem(`progress_${course._id}`, index);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📘 {course.name}</h2>

      <div className="layout">

        {/* LEFT SIDE */}
        <div>

          {/* VIDEO */}
          <div className="video-card">
            <h3>🎥 Lecture {currentIndex + 1}</h3>

            <iframe
              width="100%"
              height="360"
              src={`https://www.youtube.com/embed/${getVideoId(
                course.youtubeLinks[currentIndex]
              )}`}
              allowFullScreen
            />

            {/* PROGRESS */}
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p>{progress}% Completed</p>

            {/* NAV BUTTONS */}
            <div className="nav-btns">
              <button
                disabled={currentIndex === 0}
                onClick={() => changeLecture(currentIndex - 1)}
              >
                ⬅ Previous
              </button>

              <button
                disabled={currentIndex === totalLectures - 1}
                onClick={() => changeLecture(currentIndex + 1)}
              >
                Next ➡
              </button>
            </div>
          </div>

          {/* NOTES */}
          <div className="notes-card">
            <h3>📄 Notes</h3>

            {course.notes?.length > 0 ? (
              course.notes.map((file, i) => (
                <a
                  key={i}
                  href={`http://localhost:5000/uploads/${file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="note-btn"
                >
                  📄 Download Note {i + 1}
                </a>
              ))
            ) : (
              <p>No notes available</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="sidebar">
          <h3>📚 Course Content</h3>

          {course.youtubeLinks?.map((link, i) => (
            <div
              key={i}
              onClick={() => changeLecture(i)}
              className={`lecture ${
                i === currentIndex ? "active" : ""
              }`}
            >
              {i < currentIndex ? "✔" : "▶"} Lecture {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        .video-card {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .progress {
          height: 8px;
          background: #eee;
          border-radius: 10px;
          margin: 10px 0;
        }

        .progress-bar {
          height: 100%;
          background: #6a0dad;
          border-radius: 10px;
        }

        .nav-btns {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .nav-btns button {
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          background: #6a0dad;
          color: white;
          cursor: pointer;
        }

        .notes-card {
          margin-top: 20px;
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .note-btn {
          display: block;
          background: #6a0dad;
          color: #fff;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 10px;
          text-align: center;
          text-decoration: none;
        }

        .sidebar {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          max-height: 500px;
          overflow-y: auto;
        }

        .lecture {
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 6px;
          background: #eee;
          cursor: pointer;
        }

        .lecture.active {
          background: #6a0dad;
          color: white;
        }

        @media (max-width: 768px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}