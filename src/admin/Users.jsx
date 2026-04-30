import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

        // ✅ FILTER ONLY USERS (REMOVE EMPLOYERS & ADMIN)
        const onlyUsers = (data.users || []).filter(
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
                <th style={{ padding: "12px", width: "8%" }}>#</th>
                <th style={{ padding: "12px", width: "25%" }}>Name</th>
                <th style={{ padding: "12px", width: "35%" }}>Email</th>
                <th style={{ padding: "12px", width: "20%" }}>Phone</th>
                <th style={{ padding: "12px", width: "20%" }}>Action</th>
              </tr>
            </thead>

            <tbody>

              {currentUsers.map((u, index) => (

                <tr key={u._id}>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {u.name}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {u.email}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {u.phone || "-"}
                  </td>

                  <td style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>

                    <button
                      onClick={() => navigate(`/admin/userProfile/${u._id}`)}
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
                      onClick={() => deleteUser(u._id)}
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

      </div>
    </section>
  );
}