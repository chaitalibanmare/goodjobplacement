import React, { useEffect, useState } from "react";

export default function EmployerVacancies() {

  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchVacancies();
  }, []);

  async function fetchVacancies() {
    try {
      const token = localStorage.getItem("gjp_token");

      const res = await fetch("http://localhost:5000/api/vacancy/employer", {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();
      setVacancies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setVacancies([]);
    }
  }

  async function deleteVacancy(id) {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) return;

    try {
      const token = localStorage.getItem("gjp_token");

      const res = await fetch(`http://localhost:5000/api/vacancy/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });

      if (res.ok) {
        alert("Vacancy deleted successfully.");
        fetchVacancies();
      } else {
        alert("Failed to delete vacancy.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting vacancy.");
    }
  }

  function viewVacancy(v) {
    setSelectedVacancy(v);
    setEditMode(false);
  }

  function editVacancy(v) {
    setSelectedVacancy(v);
    setEditMode(true);
  }

  async function handleUpdate() {
    try {
      const token = localStorage.getItem("gjp_token");

      const res = await fetch(`http://localhost:5000/api/vacancy/${selectedVacancy.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(selectedVacancy)
      });

      if (res.ok) {
        alert("Vacancy updated successfully.");
        setSelectedVacancy(null);
        fetchVacancies();
      } else {
        const errorData = await res.json();
        alert("Failed to update vacancy: " + (errorData.error || JSON.stringify(errorData)));
      }
    } catch (err) {
      console.error(err);
      alert("Error updating vacancy.");
    }
  }

  function formatDate(date) {
    return date ? new Date(date).toLocaleDateString("en-IN") : "-";
  }

  const totalPages = Math.ceil(vacancies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = vacancies.slice(startIndex, startIndex + itemsPerPage);

  return (


    <div className="page-container">

      <h2>Posted Vacancies</h2>
      <p>Total Vacancies: {vacancies.length}</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Location</th>
              <th>Field</th>
              <th>Total</th>
              <th>Type</th>
              <th>Posted</th>
              <th>Last Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No vacancies posted yet.
                </td>
              </tr>
            ) : (
              currentData.map((v) => (
                <tr key={v.id}>
                  <td>{v.company_name || v.companyName || "-"}</td>
                  <td>{v.location || "-"}</td>
                  <td>{v.field || "-"}</td>
                  <td>{v.total_vacancies || v.totalVacancies || "-"}</td>
                  <td>{v.time_type || v.timeType || "-"}</td>
                  <td>{formatDate(v.posted_on || v.postedOn)}</td>
                  <td>{formatDate(v.last_date || v.lastDate)}</td>

                  <td>
                    <button className="view" onClick={() => viewVacancy(v)}>
                      👁 View
                    </button>

                    <button className="edit" onClick={() => editVacancy(v)}>
                      ✏ Edit
                    </button>

                    <button className="delete" onClick={() => deleteVacancy(v.id)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {totalPages > 1 && (
          <>
            <button disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </>
        )}
      </div>


      {/* MODAL */}
      {selectedVacancy && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3>{editMode ? "Edit Vacancy" : "Vacancy Details"}</h3>

            {editMode ? (
              <>
                <div className="modal-form">

                  <div className="field">
                    <label>Company</label>
                    <input
                      value={selectedVacancy.company_name || selectedVacancy.companyName || ""}
                      onChange={(e) =>
                        setSelectedVacancy({ ...selectedVacancy, company_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Location</label>
                    <input
                      value={selectedVacancy.location || ""}
                      onChange={(e) =>
                        setSelectedVacancy({ ...selectedVacancy, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Field</label>
                    <input
                      value={selectedVacancy.field || ""}
                      onChange={(e) =>
                        setSelectedVacancy({ ...selectedVacancy, field: e.target.value })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Total Vacancies</label>
                    <input
                      value={selectedVacancy.total_vacancies || selectedVacancy.totalVacancies || ""}
                      onChange={(e) =>
                        setSelectedVacancy({ ...selectedVacancy, total_vacancies: e.target.value })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Posted On</label>
                    <input
                      type="date"
                      value={(selectedVacancy.posted_on || selectedVacancy.postedOn)?.substring(0, 10) || ""}
                      onChange={(e) =>
                        setSelectedVacancy({ ...selectedVacancy, posted_on: e.target.value })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Last Date</label>
                    <input
                      type="date"
                      value={(selectedVacancy.last_date || selectedVacancy.lastDate)?.substring(0, 10) || ""}
                      onChange={(e) =>
                        setSelectedVacancy({ ...selectedVacancy, last_date: e.target.value })
                      }
                    />
                  </div>

                  <div className="field full">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={selectedVacancy.description || ""}
                      onChange={(e) =>
                        setSelectedVacancy({ ...selectedVacancy, description: e.target.value })
                      }
                    />
                  </div>

                </div>

                <div className="modal-actions">
                  <button className="save-btn" onClick={handleUpdate}>
                    Update
                  </button>
                  <button className="close-btn" onClick={() => setSelectedVacancy(null)}>
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="view-details">
                  <p><b>Company:</b> {selectedVacancy.company_name || selectedVacancy.companyName}</p>
                  <p><b>Field:</b> {selectedVacancy.field}</p>
                  <p><b>Location:</b> {selectedVacancy.location}</p>
                  <p><b>Vacancies:</b> {selectedVacancy.total_vacancies || selectedVacancy.totalVacancies}</p>
                  <p><b>Type:</b> {selectedVacancy.time_type || selectedVacancy.timeType}</p>
                  <p><b>Posted:</b> {formatDate(selectedVacancy.posted_on || selectedVacancy.postedOn)}</p>
                  <p><b>Last Date:</b> {formatDate(selectedVacancy.last_date || selectedVacancy.lastDate)}</p>
                  <p><b>Description:</b> {selectedVacancy.description}</p>
                </div>

                <div className="modal-actions">
                  <button className="close-btn" onClick={() => setSelectedVacancy(null)}>
                    Close
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}