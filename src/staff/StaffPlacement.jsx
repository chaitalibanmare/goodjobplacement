import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StaffPlacement() {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Resume Modal State
  const [resumeUrl, setResumeUrl] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, appsRes, placementsRes] = await Promise.all([
        axios.get(`${baseUrl}/api/staff/students`),
        axios.get(`${baseUrl}/api/application/all`),
        axios.get(`${baseUrl}/api/placement/all`)
      ]);
      setStudents(studentsRes.data || []);
      setApplications(appsRes.data || []);
      setPlacements(placementsRes.data || []);
    } catch (err) {
      console.error("Error loading staff placement data:", err);
      showToast("Error loading placement records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update application status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await axios.patch(`${baseUrl}/api/application/status/${appId}`, {
        status: newStatus
      });
      if (res.status === 200) {
        showToast("Application status updated successfully");
        // Reload all data so that placements table sync updates the local state
        loadData();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    }
  };

  // Delete Placement Record
  const handleDeletePlacement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this placement record?")) return;
    try {
      const res = await axios.delete(`${baseUrl}/api/placement/${id}`);
      if (res.status === 200) {
        showToast("Placement record deleted");
        // Reload all data
        loadData();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete placement record", "error");
    }
  };

  // Stats calculation
  const totalStudentsCount = students.length;
  const totalApplicationsCount = applications.length;
  const totalShortlistedCount = applications.filter(a => a.status === "shortlisted").length;
  const totalPlacedCount = placements.length;

  // Filter students based on overview tab search
  const filteredStudents = students.filter(student => {
    const name = (student.name || student.full_name || "").toLowerCase();
    const email = (student.email || "").toLowerCase();
    const phone = (student.phone || "").toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  // Filter applications based on log tab search
  const filteredApplications = applications.filter(app => {
    const studentName = (app.user_name || "").toLowerCase();
    const companyName = (app.company || "").toLowerCase();
    const position = (app.position || "").toLowerCase();
    const query = search.toLowerCase();
    return studentName.includes(query) || companyName.includes(query) || position.includes(query);
  });

  // Filter placements based on placement activity tab search
  const filteredPlacements = placements.filter(p => {
    const studentName = (p.users?.name || "").toLowerCase();
    const companyName = (p.company_name || "").toLowerCase();
    const jobRole = (p.job_role || "").toLowerCase();
    const query = search.toLowerCase();
    return studentName.includes(query) || companyName.includes(query) || jobRole.includes(query);
  });

  // Print placement report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="staff-placement-module">
      {/* Toast */}
      {toast && (
        <div className={`toast-alert toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="module-header no-print">
        <div>
          <h1>Placement Management</h1>
          <p className="subtitle">Track applications, update statuses, and monitor student placements.</p>
        </div>
        <button className="btn print-btn" onClick={handlePrint}>
          🖨️ Print placement report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-dashboard grid no-print">
        <div className="stat-card total-students">
          <div className="icon">👥</div>
          <div className="details">
            <h3>{totalStudentsCount}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card total-applications">
          <div className="icon">📊</div>
          <div className="details">
            <h3>{totalApplicationsCount}</h3>
            <p>Applications Sent</p>
          </div>
        </div>
        <div className="stat-card shortlisted">
          <div className="icon">🎤</div>
          <div className="details">
            <h3>{totalShortlistedCount}</h3>
            <p>Interviews Scheduled</p>
          </div>
        </div>
        <div className="stat-card placed">
          <div className="icon">🏆</div>
          <div className="details">
            <h3>{totalPlacedCount}</h3>
            <p>Students Placed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-menu no-print">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("overview");
            setSearch("");
          }}
        >
          Student Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("applications");
            setSearch("");
          }}
        >
          Manage Application Statuses
        </button>
        <button
          className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("activity");
            setSearch("");
          }}
        >
          Placement Activity Log
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="search-bar no-print">
        <input
          type="text"
          placeholder={
            activeTab === "overview"
              ? "Search by student name, email, or phone..."
              : activeTab === "applications"
              ? "Search by student, company, or position..."
              : "Search by student name, company, or role..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="count-badge">
          Total results:{" "}
          {activeTab === "overview"
            ? filteredStudents.length
            : activeTab === "applications"
            ? filteredApplications.length
            : filteredPlacements.length}
        </span>
      </div>

      {loading ? (
        <div className="loader-block">
          <div className="spinner" />
          <p>Loading placement records...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: STUDENT OVERVIEW */}
          {activeTab === "overview" && (
            <div className="table-wrapper">
              <table className="placement-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Applied Companies</th>
                    <th style={{ textAlign: "center" }}>App Count</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => {
                      const userApps = applications.filter(a => a.user_id === student.id);
                      const appliedCompanies = userApps.map(a => a.company).filter(Boolean);
                      
                      const studentPlacement = placements.find(p => p.user_id === student.id);
                      const isPlaced = !!studentPlacement;
                      const companyPlaced = studentPlacement ? studentPlacement.company_name : "";

                      return (
                        <tr key={student.id}>
                          <td className="font-bold">{student.name || student.full_name || "Student"}</td>
                          <td>{student.email}</td>
                          <td>{student.phone || <span className="text-muted">-</span>}</td>
                          <td>
                            {appliedCompanies.length > 0 ? (
                              <div className="pill-container">
                                {Array.from(new Set(appliedCompanies)).map((company, index) => (
                                  <span key={index} className="company-pill">
                                    {company}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>{userApps.length}</td>
                          <td>
                            <span className={`status-badge ${isPlaced ? "badge-placed" : "badge-progress"}`}>
                              {isPlaced ? `Placed at ${companyPlaced}` : "In Progress"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {student.resume ? (
                              <button
                                className="resume-btn"
                                onClick={() => setResumeUrl(`${baseUrl}/resume/${student.resume}`)}
                              >
                                View Resume
                              </button>
                            ) : (
                              <span className="text-muted" style={{ fontSize: "12px" }}>No Resume</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-row">No students matched your search query.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: DETAILED APPLICATION LOG */}
          {activeTab === "applications" && (
            <div className="table-wrapper">
              <table className="placement-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Applied Date</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: "center" }}>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map(app => (
                      <tr key={app.id}>
                        <td className="font-bold">{app.user_name || "Student"}</td>
                        <td>{app.company}</td>
                        <td className="text-accent font-medium">{app.position}</td>
                        <td>{new Date(app.created_at).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              app.status === "hired"
                                ? "badge-placed"
                                : app.status === "shortlisted"
                                ? "badge-interview"
                                : app.status === "rejected"
                                ? "badge-rejected"
                                : "badge-pending"
                            }`}
                          >
                            {app.status === "hired"
                              ? "🏆 Placed"
                              : app.status === "shortlisted"
                              ? "🎤 Interview"
                              : app.status === "rejected"
                              ? "❌ Rejected"
                              : "⏳ Pending"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <select
                            value={app.status || "applied"}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                            className="status-selector"
                          >
                            <option value="applied">⏳ Pending</option>
                            <option value="shortlisted">🎤 Interview</option>
                            <option value="hired">🏆 Placed</option>
                            <option value="rejected">❌ Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-row">No applications found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: PLACEMENT ACTIVITY LOG */}
          {activeTab === "activity" && (
            <div className="table-wrapper">
              <table className="placement-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Placed Company</th>
                    <th>Job Role</th>
                    <th>Placement Date</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlacements.length > 0 ? (
                    filteredPlacements.map(p => (
                      <tr key={p.id}>
                        <td className="font-bold">{p.users?.name || "Student"}</td>
                        <td>{p.users?.email || "-"}</td>
                        <td>{p.users?.phone || <span className="text-muted">-</span>}</td>
                        <td className="font-medium text-accent">{p.company_name}</td>
                        <td>{p.job_role}</td>
                        <td>{new Date(p.placement_date || p.created_at).toLocaleDateString()}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="delete-btn-box"
                            onClick={() => handleDeletePlacement(p.id)}
                            style={{ padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                          >
                            Remove Record
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-row">No placement records logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Printable Report View (Visible only during window.print()) */}
      <div className="print-report-container">
        <h1 style={{ textAlign: "center", marginBottom: "5px" }}>GoodJobPlacement.com</h1>
        <h2 style={{ textAlign: "center", margin: "0 0 20px 0", color: "#4f46e5" }}>Placement Tracking Report</h2>
        <p style={{ textAlign: "right", margin: "0 0 30px 0", fontStyle: "italic" }}>
          Date: {new Date().toLocaleDateString()}
        </p>

        <div style={{ display: "flex", justifyBaground: "#f1f5f9", justifyContent: "space-between", marginBottom: "40px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          <div><strong>Total Students:</strong> {totalStudentsCount}</div>
          <div><strong>Total Applications:</strong> {totalApplicationsCount}</div>
          <div><strong>Interviews Scheduled:</strong> {totalShortlistedCount}</div>
          <div><strong>Placed Students:</strong> {totalPlacedCount}</div>
          <div><strong>Placement Rate:</strong> {totalStudentsCount > 0 ? ((totalPlacedCount / totalStudentsCount) * 100).toFixed(1) : 0}%</div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
          <thead>
            <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "10px" }}>Student Name</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Email</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Placed Company</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Job Role</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Placement Date</th>
            </tr>
          </thead>
          <tbody>
            {placements.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{p.users?.name || "Student"}</td>
                <td style={{ padding: "10px" }}>{p.users?.email || "-"}</td>
                <td style={{ padding: "10px" }}>{p.company_name}</td>
                <td style={{ padding: "10px" }}>{p.job_role}</td>
                <td style={{ padding: "10px" }}>{new Date(p.placement_date || p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resume Preview Modal */}
      {resumeUrl && (
        <div className="resume-modal-backdrop" onClick={() => setResumeUrl(null)}>
          <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Resume Preview</h3>
              <button className="close-btn" onClick={() => setResumeUrl(null)}>
                &times;
              </button>
            </div>
            <iframe src={resumeUrl} title="Resume Preview" className="resume-iframe" />
          </div>
        </div>
      )}

      {/* Inline styles for StaffPlacement page */}
      <style dangerouslySetInnerHTML={{ __html: `
        .staff-placement-module {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1e293b;
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .module-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .module-header .subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
        }

        .print-btn {
          background: #fff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .print-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        /* Stats Cards */
        .stats-dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 35px;
        }

        .stat-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .stat-card .icon {
          font-size: 28px;
          background: #f1f5f9;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .stat-card h3 {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }

        .stat-card p {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0 0 0;
          font-weight: 500;
        }

        .stat-card.placed {
          border-left: 5px solid #10b981;
        }
        .stat-card.placed .icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .stat-card.shortlisted {
          border-left: 5px solid #a855f7;
        }
        .stat-card.shortlisted .icon {
          background: rgba(168, 85, 247, 0.1);
          color: #a855f7;
        }

        /* Tabs */
        .tab-menu {
          display: flex;
          gap: 10px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 25px;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 12px 20px;
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #3b82f6;
        }

        .tab-btn.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        /* Search bar */
        .search-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 20px;
        }

        .search-bar input {
          flex: 1;
          max-width: 400px;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          background: #fff;
          color: #0f172a;
        }

        .count-badge {
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        /* Table wrapper & Table */
        .table-wrapper {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
        }

        .placement-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .placement-table th {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 18px;
          font-weight: 700;
          color: #475569;
          font-size: 14px;
        }

        .placement-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          color: #334155;
        }

        .placement-table tr:hover {
          background: #f8fafc;
        }

        .font-bold {
          font-weight: 700;
          color: #0f172a !important;
        }

        .font-medium {
          font-weight: 600;
        }

        .text-accent {
          color: #3b82f6;
        }

        .text-muted {
          color: #94a3b8;
        }

        .pill-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .company-pill {
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
        }

        /* Status badges */
        .status-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .badge-placed {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .badge-progress {
          background: #f1f5f9;
          color: #64748b;
        }

        .badge-interview {
          background: rgba(168, 85, 247, 0.1);
          color: #a855f7;
        }

        .badge-rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .badge-pending {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        /* Buttons inside table */
        .resume-btn {
          background: #0f172a;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .resume-btn:hover {
          background: #1e293b;
        }

        .status-selector {
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
          background: #fff;
          color: #334155;
          cursor: pointer;
        }

        .empty-row {
          padding: 30px !important;
          text-align: center;
          color: #64748b;
          font-weight: 500;
        }

        .delete-btn-box {
          background: red;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .delete-btn-box:hover {
          opacity: 0.9;
        }

        /* Toast Alert */
        .toast-alert {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 10000;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 14px;
          animation: slideIn 0.3s ease-out;
        }

        .toast-success {
          background: #d1fae5;
          border: 1px solid #10b981;
          color: #065f46;
        }

        .toast-error {
          background: #fee2e2;
          border: 1px solid #ef4444;
          color: #7f1d1d;
        }

        /* Resume Preview Modal */
        .resume-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .resume-modal {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          width: 90%;
          max-width: 850px;
          height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .resume-modal .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .resume-modal .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .resume-modal .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
        }

        .resume-iframe {
          width: 100%;
          flex-grow: 1;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .loader-block {
          padding: 60px;
          text-align: center;
          color: #64748b;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          margin: 0 auto 12px auto;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Printable area styles */
        .print-report-container {
          display: none;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .print-report-container, .print-report-container * {
            visibility: visible;
          }
          .print-report-container {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
