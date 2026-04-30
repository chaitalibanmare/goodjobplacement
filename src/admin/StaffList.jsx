import React, { useEffect, useState } from "react";
import "./admin.css";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");

  // 👉 pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    fetch("http://localhost:5000/api/staff/all")
      .then(res => res.json())
      .then(data => setStaff(data));
  }, []);

  // 👉 filter
  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  // 👉 pagination logic
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentData = filtered.slice(start, start + perPage);

  return (
    <div className="staff-page">

      {/* HEADER */}
      <div className="staff-header">
        <div>
          <h2>Staff</h2>
          <p>Manage staff members</p>
        </div>

        <div className="staff-count">
          Total Staff: <span>{filtered.length}</span>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="staff-search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset page
        }}
      />

      {/* TABLE */}
      <div className="staff-card">
        <table className="staff-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((s, index) => (
              <tr key={index}>
                <td>{start + index + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="staff-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}