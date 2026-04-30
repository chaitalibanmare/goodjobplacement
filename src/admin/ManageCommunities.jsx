import React, { useEffect, useState } from "react";

export default function ManageCommunities() {

  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const communitiesPerPage = 6;

  useEffect(() => {
    fetchCommunities();
  }, []);

  /* FETCH */

  async function fetchCommunities() {
    try {
      const res = await fetch("http://localhost:5000/api/community/all");
      const data = await res.json();

      if (res.ok) {
        // oldest first → latest below
        const sorted = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setCommunities(sorted);
      }

    } catch (err) {
      console.log(err);
    }
  }

  /* TOGGLE */

  async function toggleStatus(id) {
    try {
      await fetch(`http://localhost:5000/api/community/approve/${id}`, {
        method: "PUT",
      });
      fetchCommunities();
    } catch (err) {
      console.log(err);
    }
  }

  /* SEARCH */

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */

  const indexOfLast = currentPage * communitiesPerPage;
  const indexOfFirst = indexOfLast - communitiesPerPage;

  const currentCommunities = filteredCommunities.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredCommunities.length / communitiesPerPage);

  return (

    <section style={{ padding: "0px 20px" }}>

      <div className="container">

        <h2 style={{ marginBottom: "10px" }}>Manage Communities</h2>

        <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
          Total Communities: {communities.length}
        </p>

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search community name or description..."
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
                <th>Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Admin</th>
              </tr>
            </thead>

            {/* BODY */}

            <tbody>

              {currentCommunities.length === 0 ? (

                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No communities found
                  </td>
                </tr>

              ) : (

                currentCommunities.map((c) => (

                  <tr key={c._id} style={{
  background: "white",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
}}>

  <td style={{ padding: "10px 15px" }}>{c.name}</td>

  <td style={{
    padding: "10px 15px",
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }}>
    {c.description}
  </td>

  <td style={{ padding: "10px 15px" }}>
    {c.members?.length || 0}
  </td>

  <td style={{ padding: "10px 15px" }}>
    {c.createdAt
      ? new Date(c.createdAt).toLocaleDateString()
      : "N/A"}
  </td>

  <td style={{ padding: "10px 15px" }}>
    <span style={{
      background: c.isApproved ? "#dcfce7" : "#fef3c7",
      color: c.isApproved ? "#166534" : "#92400e",
      padding: "5px 10px",
      borderRadius: "8px"
    }}>
      {c.isApproved ? "Approved" : "Pending"}
    </span>
  </td>

  <td style={{ padding: "10px 15px" }}>
    <button
      onClick={() => toggleStatus(c._id)}
      style={{
        background: c.isApproved ? "#ef4444" : "#10b981",
        color: "white",
        border: "none",
        padding: "6px 14px",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      {c.isApproved ? "Disable" : "Enable"}
    </button>
  </td>

</tr>

                ))

              )}

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