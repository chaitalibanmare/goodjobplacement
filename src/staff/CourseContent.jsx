import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const CourseContent = () => {
const location = useLocation();
const course = location.state;

const base = "http://localhost:5000";

if (!course) return <h3>No Course Data Found</h3>;

// ✅ Extract YouTube Video ID
const getVideoId = (url) => {
  if (!url) return "";

  try {
    const urlObj = new URL(url);

    // youtu.be/abc123
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.split("/")[1]; // clean ID
    }

    // youtube.com/watch?v=abc123
    if (urlObj.searchParams.get("v")) {
      return urlObj.searchParams.get("v");
    }

    // youtube.com/embed/abc123
    if (urlObj.pathname.includes("/embed/")) {
      return urlObj.pathname.split("/embed/")[1];
    }

    return "";
  } catch {
    return "";
  }
};

// ✅ Current playing video
const [currentVideo, setCurrentVideo] = useState(
  course.youtubeLinks?.find(link => link && link.trim() !== "")
);

return (
<div style={{ padding: "20px" }}>
<h2 style={{ marginBottom: "20px" }}>
{course.name} - Content </h2>

  {/* 🔥 MAIN LAYOUT */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px"
    }}
  >

    {/* ================= VIDEO SIDE ================= */}
    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}
    >
      <h3>🎥 Video Lecture</h3>

      {currentVideo ? (
        <iframe
          width="100%"
          height="350"
          src={`https://www.youtube.com/embed/${getVideoId(currentVideo)}`}
          title="YouTube video"
          allowFullScreen
          style={{
            border: "none",
            borderRadius: "10px",
            marginTop: "10px"
          }}
        ></iframe>
      ) : (
        <p>No video available</p>
      )}

      {/* 🎬 VIDEO LIST */}
      <div style={{ marginTop: "20px" }}>
        <h4>📺 Course Videos</h4>

        {course.youtubeLinks && course.youtubeLinks.length > 0 ? (
          course.youtubeLinks.map((link, index) => (
            <div
              key={index}
              onClick={() => setCurrentVideo(link)}
              style={{
                padding: "10px",
                marginBottom: "8px",
                background:
                  link === currentVideo ? "#6a0dad" : "#eee",
                color: link === currentVideo ? "#fff" : "#000",
                cursor: "pointer",
                borderRadius: "5px"
              }}
            >
              ▶ Lecture {index + 1}
            </div>
          ))
        ) : (
          <p>No videos available</p>
        )}
      </div>
    </div>

    {/* ================= NOTES SIDE ================= */}
    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}
    >
      <h3>📄 Notes</h3>

      {course.notes && course.notes.length > 0 ? (
        course.notes.map((file, index) => (
          <a
            key={index}
            href={`${base}/uploads/${file}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              marginBottom: "10px",
              background: "#6a0dad",
              color: "#fff",
              padding: "10px",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center"
            }}
          >
             View Note {index + 1}
          </a>
        ))
      ) : (
        <p>No notes available</p>
      )}
    </div>
  </div>
</div>

);
};

export default CourseContent;
