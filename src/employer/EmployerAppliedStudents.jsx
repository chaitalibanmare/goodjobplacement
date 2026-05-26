import React, { useEffect, useState } from "react";

export default function EmployerAppliedStudents() {
  const [applicants, setApplicants] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchApplicants();
  }, []);

  async function fetchApplicants() {
    try {
      const token = localStorage.getItem("gjp_token");
      const res = await fetch("http://localhost:5000/api/application/employer", {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      setApplicants(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  // Pagination logic
  const totalItems = applicants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplicants = applicants.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="dashboard-content" style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '24px', margin: '20px', minHeight: 'calc(100vh - 40px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px', display: 'inline-block' }}>
          APPLICANTS
        </div>
        <div style={{ backgroundColor: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
          Total Students: <span style={{ color: '#4f46e5' }}>{totalItems}</span>
        </div>
      </div>

      <h1 style={{ fontSize: '32px', color: '#111', marginBottom: '16px', lineHeight: '1.3' }}>
        Applied Students
      </h1>
      
      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.5' }}>
        Review the students who have applied to your active job postings.
      </p>

      {applicants.length === 0 ? (
        <div style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '32px', textAlign: 'center', color: '#64748b', marginBottom: '40px' }}>
          No students have applied to your vacancies yet.
        </div>
      ) : (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Position</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Contact</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Applied Date</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#475569', fontWeight: '600', textAlign: 'center' }}>Resume</th>
                </tr>
              </thead>
              <tbody>
                {currentApplicants.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#111', fontWeight: '500' }}>{app.user_name}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6366f1', fontWeight: '500' }}>{app.position}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{app.users?.email || 'N/A'}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{app.users?.phone || 'N/A'}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {app.users?.resume ? (
                        <button 
                          onClick={() => setResumeUrl(`http://localhost:5000/resume/${app.users.resume}`)}
                          style={{ display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          View Resume
                        </button>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>No Resume</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} applicants
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={goToPrevPage} 
                  disabled={currentPage === 1}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff',
                    color: currentPage === 1 ? '#94a3b8' : '#111',
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  Previous
                </button>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#fff',
                    color: currentPage === totalPages ? '#94a3b8' : '#111',
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {resumeUrl && (
        <div className="modal-backdrop" onClick={() => setResumeUrl(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '800px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Resume Preview</h3>
              <button className="btn ghost" onClick={() => setResumeUrl(null)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '24px', lineHeight: 1 }}>&times;</button>
            </div>
            <iframe src={resumeUrl} style={{ width: '100%', flexGrow: 1, border: '1px solid #e2e8f0', borderRadius: '8px' }} title="Resume Preview"></iframe>
          </div>
        </div>
      )}

    </div>
  );
}
