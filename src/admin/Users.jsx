import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users({ navigateTo }) {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resumeToView, setResumeToView] = useState(null);

  const usersPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {

      const res = await fetch("http://localhost:5000/api/user/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("gjp_token")
        }
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ The server returns an array directly: res.json(data)
        const usersArray = Array.isArray(data) ? data : (data.users || []);

        const onlyUsers = usersArray.filter(
          (u) => u.role === "user"
        );

        setUsers(onlyUsers);
      }

    } catch (err) {
      console.error(err);
    }
  }

  async function deleteUser(id) {

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {

      const res = await fetch(`http://localhost:5000/api/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("gjp_token")
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert(data.error || "Delete failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  /* ---------- SEARCH ---------- */

  const filteredUsers = users.filter((u, index) => {

    const serialId = (index + 1).toString();

    return (
      serialId.includes(search) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  });

  /* ---------- PAGINATION ---------- */

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <section style={{ padding: "40px 20px" }}>
      <div className="container">

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >

          <div>
            <h2 style={{ margin: "0 0 5px 0" }}>Users</h2>

            <p style={{ color: "var(--muted)", margin: 0 }}>
              Manage registered users
            </p>
          </div>

          <div
            style={{
              background: "var(--card)",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)",
              fontWeight: "600"
            }}
          >
            Total Users:
            <span style={{ color: "var(--accent)", marginLeft: "6px" }}>
              {users.length}
            </span>
          </div>

        </div>

        {/* SEARCH BAR */}

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "10px",
              width: "260px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        {/* USERS TABLE */}

        <div
          style={{
            background: "var(--card)",
            padding: "25px",
            borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(2,6,23,0.55)",
            border: "1px solid rgba(255,255,255,0.04)"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed"
            }}
          >

            <thead>
              <tr style={{ color: "var(--muted)", textAlign: "left" }}>
                <th style={{ padding: "12px", width: "5%" }}>#</th>
                <th style={{ padding: "12px", width: "10%" }}>Photo</th>
                <th style={{ padding: "12px", width: "20%" }}>Name</th>
                <th style={{ padding: "12px", width: "25%" }}>Email</th>
                <th style={{ padding: "12px", width: "15%" }}>Phone</th>
                <th style={{ padding: "12px", width: "10%" }}>Resume</th>
                <th style={{ padding: "12px", width: "15%" }}>Action</th>
              </tr>
            </thead>

            <tbody>

              {currentUsers.map((u, index) => (

                <tr key={u.id}>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <img
                      src={u.photo ? `http://localhost:5000/uploads/${u.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="profile"
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--accent)" }}
                    />
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {u.full_name || u.name}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {u.email}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {u.phone || "-"}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {u.resume ? (
                      <button
                        onClick={() => setResumeToView(u.resume)}
                        style={{ background: "rgba(124, 58, 237, 0.1)", color: "var(--accent)", border: "1px solid var(--accent)", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                      >
                        📄 View
                      </button>
                    ) : "-"}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>

                    <button
                      onClick={() => setSelectedUser(u)}
                      style={{
                        background: "var(--accent)",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginRight: "8px"
                      }}
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "var(--muted)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

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
                color: currentPage === i + 1 ? "white" : "black",
                cursor: "pointer"
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

        {/* USER DETAIL MODAL */}
        {selectedUser && (
          <div className="modal-backdrop" onClick={() => setSelectedUser(null)} style={{ backdropFilter: "blur(10px)" }}>
            <div
              className="modal"
              onClick={e => e.stopPropagation()}
              style={{
                width: "480px",
                maxWidth: "90%",
                padding: "40px",
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                borderRadius: "28px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                color: "white"
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={selectedUser.photo ? `http://localhost:5000/uploads/${selectedUser.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="profile"
                    style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--accent)", padding: "4px", background: "rgba(124, 58, 237, 0.1)" }}
                  />
                  <div style={{ position: "absolute", bottom: "5px", right: "5px", width: "24px", height: "24px", background: "#10b981", borderRadius: "50%", border: "3px solid #0f172a" }}></div>
                </div>
                <h2 style={{ margin: "15px 0 5px 0", fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}>{selectedUser.full_name || selectedUser.name}</h2>
                <p style={{ color: "var(--accent)", fontSize: "15px", fontWeight: "600", margin: 0 }}>{selectedUser.email}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--muted)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Phone Number</label>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>{selectedUser.phone || "Not provided"}</p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--muted)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Qualifications</label>
                  <div style={{ fontSize: "16px", lineHeight: "1.7", fontWeight: "500", color: "rgba(255,255,255,0.8)", whiteSpace: "pre-wrap" }}>
                    {selectedUser.qualifications || "No qualifications listed"}
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--muted)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Experience</label>
                  <div style={{ fontSize: "16px", lineHeight: "1.7", fontWeight: "500", color: "rgba(255,255,255,0.8)", whiteSpace: "pre-wrap" }}>
                    {selectedUser.experience || "No experience listed"}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "40px" }}>
                <button
                  className="btn primary"
                  onClick={() => setSelectedUser(null)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "16px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, var(--accent), #4f46e5)",
                    boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)"
                  }}
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESUME PREVIEW MODAL */}
        {resumeToView && (
          <div className="modal-backdrop" onClick={() => setResumeToView(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ width: "90%", height: "90%", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0 }}>Resume Preview</h3>
                <button onClick={() => setResumeToView(null)} style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: "24px", cursor: "pointer" }}>&times;</button>
              </div>
              <iframe
                src={`http://localhost:5000/resume/${resumeToView}`}
                style={{ flex: 1, width: "100%", border: "none", borderRadius: "10px" }}
                title="Resume Preview"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}