import React, { useEffect, useState } from "react";

export default function ViewEmployers() {

  const [employers, setEmployers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const perPage = 5;

  useEffect(() => {
    fetchEmployers();
  }, []);

  // ✅ separate log (correct way)
  useEffect(() => {
    console.log("EMPLOYERS:", employers);
  }, [employers]);

  async function fetchEmployers() {
    try {

      const token = localStorage.getItem("gjp_token");

      const res = await fetch("http://localhost:5000/api/user/employers", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();

      if (res.ok) {
        setEmployers(data.employers || []);
        setTotal(data.total || 0);
      }

    } catch (err) {
      console.error(err);
    }
  }

  /* ---------- PAGINATION ---------- */

  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;

  const currentData = employers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(total / perPage); // ✅ FIXED

  return (
    <section style={{ padding: "40px 20px" }}>
      <div className="container">

        {/* HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h2>Employers</h2>
          <p style={{ color: "var(--muted)" }}>
            View registered employers
          </p>
        </div>

        {/* TOTAL COUNT */}
        <div
          style={{
            background: "var(--card)",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
            fontWeight: "600",
            display: "inline-block",
            marginBottom: "15px"
          }}
        >
          Total Employers:
          <span style={{ color: "var(--accent)", marginLeft: "6px" }}>
            {total}
          </span>
        </div>

        {/* MAIN CARD */}
        <div
          style={{
            background: "var(--card)",
            padding: "25px",
            borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(2,6,23,0.55)",
            border: "1px solid rgba(255,255,255,0.04)"
          }}
        >

          <table style={{ width: "100%", borderCollapse: "collapse" }}>

            <thead>
              <tr style={{ color: "var(--muted)", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>#</th>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Company</th>
                <th style={{ padding: "12px" }}>Phone</th>
              </tr>
            </thead>

            <tbody>

              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>
                    No employers found
                  </td>
                </tr>
              ) : (

                currentData.map((emp, index) => (

                  <tr key={emp._id}>

                    <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {(currentPage - 1) * perPage + index + 1}
                    </td>

                    <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {emp.name}
                    </td>

                    <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {emp.email}
                    </td>

                    <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {emp.companyName || "Not Provided"}
                    </td>

                    <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {emp.phone || "-"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "0 5px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: currentPage === i + 1 ? "#7c3aed" : "white",
                color: currentPage === i + 1 ? "white" : "black"
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
    </section>
  );
}