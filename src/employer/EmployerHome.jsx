import React, { useEffect, useState } from "react";

export default function EmployerHome() {

  const user = JSON.parse(localStorage.getItem("gjp_user") || "null");
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    fetchVacancies();
  }, []);

  async function fetchVacancies() {
    try {
      const token = localStorage.getItem("gjp_token");

      const res = await fetch("http://localhost:5000/api/vacancy/employer", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();
      setVacancies(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="dashboard-content" style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '24px', margin: '20px', minHeight: 'calc(100vh - 40px)' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px', display: 'inline-block' }}>
          EMPLOYER DASHBOARD
        </div>
      </div>

      <h1 style={{ fontSize: '32px', color: '#111', marginBottom: '16px', lineHeight: '1.3' }}>
        Hello {user?.name || "Ayushant Khandekar"}, <span style={{ color: '#6d28d9' }}>here's what's happening</span> with<br/>your recruitment today. 🚀
      </h1>

      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.5' }}>
        Review your latest applicants, manage open vacancies, and grow your team from one central hub.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Quick Access</h3>
        
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>

        {/* Vacancies */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Post Vacancies</h4>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5', flexGrow: 1 }}>
            Manage your active job postings and create new opportunities.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/employer/post-vacancy" style={{ backgroundColor: '#111', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              Post a Job
            </a>
            <span style={{ fontSize: '13px', color: '#64748b' }}>3 New today</span>
          </div>
        </div>

        {/* Applicants */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6d28d9', marginBottom: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>My Vacancies</h4>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5', flexGrow: 1 }}>
            Review total vacancies posted by you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/employer/vacancies" style={{ backgroundColor: '#6d28d9', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              Review All
            </a>
            <span style={{ fontSize: '13px', color: '#4f46e5', fontWeight: '600' }}>{vacancies.length} Total</span>
          </div>
        </div>

        {/* Company Profile */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', marginBottom: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
          </div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Company Profile</h4>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5', flexGrow: 1 }}>
            Update your brand identity and company details to attract talent.
          </p>
          <div>
            <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginBottom: '8px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#22c55e' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>85% Complete</span>
              <a href="/employer/profile" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Edit Profile</a>
            </div>
          </div>
        </div>

      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 20px 0' }}>Weekly Reach</h3>
      
      <div style={{ backgroundColor: '#0f172a', borderRadius: '20px', padding: '32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Vacancies Posted This Week</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{vacancies.length}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '16px' }}>+12%</div>
            <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.5px' }}>VS LAST WEEK</div>
          </div>
        </div>

        {/* Dynamic Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '100px' }}>
          {[...Array(7)].map((_, i) => {
            // Count vacancies for each of the last 7 days
            const dayCount = vacancies.filter(v => {
              const created = new Date(v.created_at || v.date || Date.now());
              const diffTime = Math.abs(new Date() - created);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              return diffDays === (6 - i);
            }).length;
            
            // Calculate height percentage (min 10% for visibility)
            const maxCount = Math.max(...[...Array(7)].map((_, j) => vacancies.filter(v => Math.floor(Math.abs(new Date() - new Date(v.created_at || v.date || Date.now())) / (1000 * 60 * 60 * 24)) === (6 - j)).length), 1);
            const heightPct = Math.max(10, (dayCount / maxCount) * 100);
            const isToday = i === 6;

            return (
              <div key={i} style={{ flex: 1, backgroundColor: isToday ? '#6d28d9' : 'rgba(255,255,255,0.1)', height: `${heightPct}%`, borderRadius: '4px', transition: 'height 0.3s' }} title={`${dayCount} vacancies`}></div>
            );
          })}
        </div>
      </div>

    </div>
  );
}