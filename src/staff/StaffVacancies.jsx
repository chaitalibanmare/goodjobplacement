import React, { useEffect, useState } from "react";

export default function StaffVacancies() {

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 7;

  useEffect(() => {
    fetch("http://localhost:5000/api/application/all")
      .then(res => res.json())
      .then(data => {
        console.log("APPLICATIONS:", data);
        setApplications(data);
      })
      .catch(err => console.log(err));
  }, []);

  // ✅ SEARCH
  const filtered = applications.filter(app =>
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ PAGINATION
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentData = filtered.slice(start, start + perPage);

  return (
    <div style={{ padding: "20px" }}>

      <h2>Applied Students</h2>

      {/* 🔍 SEARCH + COUNT */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
      }}>
        <input
          type="text"
          placeholder="Search by company..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <div style={{
          background: "#081a32",
          color: "white",
          padding: "8px 15px",
          borderRadius: "6px"
        }}>
          Total Students: {filtered.length}
        </div>
      </div>

      {/* 📋 TABLE */}
      <table style={{
        width: "100%",           // ✅ reduced
        margin: "0 auto",       // ✅ center align
        borderCollapse: "collapse",
        background: "white"
      }}>

        <thead>
          <tr>
            <th style={thStyle}>Photo</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Company</th>
            <th style={thStyle}>Position</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map(app => (
            <tr key={app.id}>

              <td style={{ ...tdStyle, padding: "6px" }}>
                <img
                  src={app.photo ? `http://localhost:5000/uploads/${app.photo.replace(/^\/uploads\//, '')}` : "https://i.pravatar.cc/50"}
                  alt="user"
                  onError={(e) => {
                    e.target.src = "https://i.pravatar.cc/50";
                  }}
                  style={{
                    width: "40px",          // ✅ reduced size
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #081a32",
                    display: "block",       // ✅ helps centering
                    margin: "0 auto"        // ✅ center align
                  }}
                />
              </td>

              <td style={tdStyle}>{app.user_name || app.userName}</td>
              <td style={tdStyle}>{app.company}</td>
              <td style={tdStyle}>{app.position}</td>

            </tr>
          ))}
        </tbody>

      </table>

      {/* 📄 PAGINATION */}
      <div style={{
        marginTop: "15px",
        display: "flex",
        justifyContent: "center",
        gap: "15px"
      }}>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          style={btnStyle}
        >
          Prev
        </button>

        <span>Page {currentPage} / {totalPages || 1}</span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={btnStyle}
        >
          Next
        </button>

      </div>

    </div>
  );
}

// ✅ STYLES
const thStyle = {
  background: "#081a32",
  color: "white",
  padding: "10px",        // ⬅️ reduced from 12
  textAlign: "center",
  borderRight: "1px solid #ccc",
  fontSize: "14px"        // ✅ smaller text
};

const tdStyle = {
  padding: "8px",         // ⬅️ reduced
  borderBottom: "1px solid #ddd",
  borderRight: "1px solid #ddd",
  verticalAlign: "middle",
  textAlign: "center",
  fontSize: "14px"        // ✅ smaller text
};

const btnStyle = {
  padding: "6px 12px",
  border: "none",
  background: "#081a32",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer"
};