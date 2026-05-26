import React, { useEffect, useState } from "react";

export default function ManageCourses() {

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 6;

  useEffect(() => {
    fetchCourses();
  }, []);

  /* FETCH COURSES */

  async function fetchCourses() {
    try {
      const res = await fetch("http://localhost:5000/api/admin/courses");
      const data = await res.json();

      if (res.ok) {
        setCourses(data || []);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /* TOGGLE */

  async function toggleStatus(id) {
    try {
      await fetch(`http://localhost:5000/api/admin/course/${id}/toggle`, {
        method: "PUT",
      });
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  }

  /* SEARCH */

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase()) ||
    c.mode.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */

  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;

  const currentCourses = filteredCourses.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (

    <section style={{ padding: "0px 20px" }}>

      <div className="container">

        <h2 style={{ marginBottom: "10px" }}>Manage Courses</h2>

        <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
          Total Courses: {courses.length}
        </p>

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search course, instructor, mode..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "20px"
          }}
        />

        {/* CARD */}

        <div style={{
          background: "var(--card)",
          padding: "30px",
          borderRadius: "14px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
          overflowX: "auto"
        }}>

          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 12px"
          }}>

            {/* HEADER */}

            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Instructor</th>
                <th>Duration</th>
                <th>Mode</th>
                <th>Fees</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Admin</th>
              </tr>
            </thead>

            {/* BODY */}

            <tbody>

              {currentCourses.map((c) => (

                <tr key={c.id} style={{
                  background: "white",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
                }}>

                  {/* IMAGE */}
                  <td>
                    <img
                      src={`http://localhost:5000/uploads/${c.image}`}
                      alt={c.name}
                      style={{
                        width: "60px",
                        height: "45px",
                        objectFit: "cover",
                        borderRadius: "6px"
                      }}
                    />
                  </td>

                  <td>{c.name}</td>
                  <td>{c.instructor}</td>
                  <td>{c.duration}</td>
                  <td>{c.mode}</td>
                  <td>₹{c.fees}</td>

                  <td>
                    {c.start_date ? new Date(c.start_date).toLocaleDateString() : "N/A"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span style={{
                      background: c.is_approved ? "#dcfce7" : "#fef3c7",
                      color: c.is_approved ? "#166534" : "#92400e",
                      padding: "5px 10px",
                      borderRadius: "8px"
                    }}>
                      {c.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  {/* ADMIN */}
                  <td>
                    <button
                      onClick={() => toggleStatus(c.id)}
                      style={{
                        background: c.is_approved ? "#ef4444" : "#10b981",
                        color: "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      {c.is_approved ? "Disable" : "Enable"}
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* PAGINATION */}

          <div style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "10px"
          }}>

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (

              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  background: currentPage === i + 1 ? "#7c3aed" : "#e5e7eb",
                  color: currentPage === i + 1 ? "white" : "black",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px"
                }}
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

      </div>

    </section>
  );
}