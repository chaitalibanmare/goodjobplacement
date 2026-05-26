import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import JobIcon from "../../assets/icon-job.svg";

export default function UserVacancies() {

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJobData, setApplyJobData] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  useEffect(() => {
    async function fetchVacancies() {
      try {
        const res = await fetch("http://localhost:5000/api/vacancy/approved");
        const data = await res.json();

        if (res.ok) {
          setVacancies(Array.isArray(data) ? data : (data.vacancies || []));
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }

    fetchVacancies();
  }, []);

  // ✅ FETCH APPLIED JOBS
  useEffect(() => {
    const token = localStorage.getItem("gjp_token");

    if (token) {
      fetch("http://localhost:5000/api/user/me", {
        headers: {
          Authorization: "Bearer " + token
        }
      })
        .then(res => res.json())
        .then(async (userData) => {
          const userId = userData.user.id;

          const res = await fetch(`http://localhost:5000/api/application/user/${userId}`);
          const data = await res.json();

          const ids = data.map(app => app.vacancy_id || app.vacancyId);
          setAppliedJobs(ids);
        })
        .catch(err => console.log(err));
    }
  }, []);

  // ✅ OPEN APPLY MODAL
  function applyJob(job) {
    const token = localStorage.getItem("gjp_token");
    if (!token) {
      alert("Please login first");
      return;
    }
    setApplyJobData(job);
  }

  // ✅ SUBMIT APPLICATION FORM
  async function handleApplySubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("gjp_token");
      if (!token) return;

      const resUser = await fetch("http://localhost:5000/api/user/me", {
        headers: { Authorization: "Bearer " + token }
      });
      const dataUser = await resUser.json();
      const user = dataUser.user;

      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("userName", e.target.name.value);
      formData.append("contact", e.target.contact.value);
      formData.append("email", e.target.email.value);
      formData.append("vacancyId", applyJobData.id);
      formData.append("employerId", applyJobData.employer_id || applyJobData.employerId);
      formData.append("company", applyJobData.company_name || applyJobData.companyName);
      formData.append("position", applyJobData.field);
      
      const fileInput = e.target.resume.files[0];
      if (fileInput) {
        formData.append("resume", fileInput);
      }

      const res = await fetch("http://localhost:5000/api/application/apply_with_details", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.message === "Already Applied") {
        alert("You already applied!");
      } else if (res.ok) {
        alert("Applied Successfully");
        setAppliedJobs(prev => [...prev, applyJobData.id]);
        setApplyJobData(null);
      } else {
        alert("Apply failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.log(err);
      alert("Apply failed");
    }
  }

  const filteredVacancies = vacancies.filter(v => {
    if (!searchQuery) return true;
    const title = (v.field || "").toLowerCase();
    const company = (v.company_name || v.companyName || "").toLowerCase();
    const desc = (v.description || "").toLowerCase();
    return title.includes(searchQuery) || company.includes(searchQuery) || desc.includes(searchQuery);
  });

  return (
    <section className="section">
      <div className="container">

        <h2>Available Vacancies</h2>
        {searchQuery && <p className="muted" style={{marginBottom: 20}}>Search results for: "{searchQuery}"</p>}

        {loading && <p>Loading vacancies...</p>}

        {!loading && filteredVacancies.length === 0 && (
          <p style={{ marginTop: "20px" }}>
            No vacancies found.
          </p>
        )}

        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginTop: '30px' }}>
          {filteredVacancies.map((v, i) => (
            <div key={v.id} style={{ padding: '24px', backgroundColor: '#e0f2fe', borderRadius: '24px', border: 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer', minHeight: '300px' }} 
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {/* Top Row: Vacancy Count Pill & Bookmark */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#fff', color: '#333', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                  {v.total_vacancies || v.totalVacancies || 1} Vacancies
                </div>
                <div style={{ width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </div>
              </div>

              {/* Company Logo and Title */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={JobIcon} alt="job" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800', color: '#111' }}>{v.field}</h3>
                  <div style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>{v.company_name || v.companyName}</div>
                </div>
              </div>
              
              {/* Description */}
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#555', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {v.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.6)', color: '#333', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.8)' }}>{v.time_type || v.timeType || 'Full Time'}</span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.6)', color: '#333', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.8)' }}>{v.location}</span>
              </div>

              {/* Bottom Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#111' }}>{v.location}</div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>{v.company_name || v.companyName}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn ghost" 
                    style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', backgroundColor: '#fff', border: '1px solid #ccc', color: '#333', cursor: 'pointer' }} 
                    onClick={() => setSelectedJob(v)}
                  >
                    View
                  </button>
                  <button 
                    className="btn primary" 
                    disabled={appliedJobs.includes(v.id)}
                    onClick={() => applyJob(v)}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      backgroundColor: appliedJobs.includes(v.id) ? 'gray' : '#111', 
                      color: '#fff', 
                      border: 'none', 
                      cursor: appliedJobs.includes(v.id) ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    {appliedJobs.includes(v.id) ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* View Details Modal */}
      {selectedJob && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '500px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', backgroundColor: '#fff' }}>
                <img 
                  src={`https://logo.clearbit.com/${(selectedJob.company_name || selectedJob.companyName || 'company').replace(/\s+/g, '').toLowerCase()}.com`} 
                  alt={selectedJob.company_name} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} 
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${selectedJob.company_name}&background=eff6ff&color=1e40af&bold=true` }}
                />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '22px', color: '#111' }}>{selectedJob.field}</h3>
                <div style={{ color: '#666', marginTop: '6px', fontSize: '15px' }}>{selectedJob.company_name} · {selectedJob.location}</div>
              </div>
            </div>
            <p style={{ color: '#444', lineHeight: '1.6', fontSize: '15px', marginBottom: '32px' }}>{selectedJob.description}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary" onClick={() => setSelectedJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {applyJobData && (
        <div className="modal-backdrop" onClick={() => setApplyJobData(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '500px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '22px', color: '#111' }}>Apply for {applyJobData.field}</h3>
            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Full Name</label>
                <input type="text" name="name" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Contact Number</label>
                <input type="text" name="contact" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Email Address</label>
                <input type="email" name="email" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Upload Resume (PDF)</label>
                <input type="file" name="resume" accept=".pdf,.doc,.docx" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn ghost" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }} onClick={() => setApplyJobData(null)}>Cancel</button>
                <button type="submit" className="btn primary" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#111', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}