import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./userDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("gjp_user"));

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({ applied: 0, interviews: 0, offers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gjp_token");
    if (!token || !user?.id) {
      setLoading(false);
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchDashboardData = async () => {
      try {
        // Fetch courses
        const coursesRes = await fetch(`${baseUrl}/api/courses/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          if (Array.isArray(coursesData)) {
            setEnrolledCourses(coursesData);
          }
        }

        // Fetch applications
        const appsRes = await fetch(`${baseUrl}/api/application/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          if (Array.isArray(appsData)) {
            const applied = appsData.length;
            const interviews = appsData.filter(a => a.status === "shortlisted").length;
            const offers = appsData.filter(a => a.status === "hired").length;
            setStats({ applied, interviews, offers });
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  return (
    <main className="user-dashboard">
      <div className="container" style={{ maxWidth: "1200px", margin: "0" }}>
        
        {/* HEADER */}
        <div className="dashboard-header">
          <div className="status-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            CAREER PATH ACTIVE
          </div>
          <h2 className="dashboard-title">
            Your career journey starts here, <span>{user?.name}</span> 🚀
          </h2>
          <p className="dashboard-subtitle">
            Manage your skill-building, discover tailored vacancies, and track your professional growth in one central hub.
          </p>
        </div>

        {/* QUICK ACCESS */}
        <div className="quick-access-header">
          <h3>Quick Access</h3>
          <Link to="#" className="view-insights">
            View all insights 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        {/* GRID */}
        <div className="dashboard-grid">

          {/* VACANCIES */}
          <div className="dashboard-card card-vacancies">
            <div className="card-icon icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h4>Vacancies</h4>
            <p className="desc">Explore 240+ job openings curated specifically for your skill profile.</p>
            <div className="card-footer">
              <button className="btn-primary" onClick={() => navigate("/user/vacancies")}>
                Discover Jobs
              </button>
              <span className="card-footer-text">12 New today</span>
            </div>
          </div>

          {/* COURSES */}
          <div className="dashboard-card card-courses">
            <div className="card-icon icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <h4>Courses</h4>
            <p className="desc">Bridge your skill gaps with industry-recognized certificates.</p>
            <div className="card-footer" style={{ marginTop: "auto" }}>
              <button className="btn-secondary" onClick={() => navigate("/courses")}>
                Explore Library
              </button>
            </div>
          </div>

          {/* MY COURSES */}
          <div className="dashboard-card card-mycourses">
            <div className="card-icon icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h4>My Courses</h4>
            {loading ? (
              <p className="desc">Loading course details...</p>
            ) : enrolledCourses.length > 0 ? (
              <>
                <p className="desc">Resume your "{enrolledCourses[0].name}" course where you left off.</p>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrolledCourses[0].progress || 0}%` }}></div>
                  </div>
                  <span className="progress-text">{enrolledCourses[0].progress || 0}% Completed</span>
                </div>
                <button className="btn-outline btn-full" onClick={() => navigate("/my-courses")}>
                  Continue
                </button>
              </>
            ) : (
              <>
                <p className="desc" style={{ marginBottom: "auto" }}>You haven't enrolled in any courses yet. Explore our library to start learning.</p>
                <button className="btn-outline btn-full" style={{ marginTop: "16px" }} onClick={() => navigate("/courses")}>
                  Explore Library
                </button>
              </>
            )}
          </div>

          {/* COMMUNITY */}
          <div className="dashboard-card card-community">
            <div className="card-header-flex">
              <div className="card-icon icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="avatars">
                <div className="avatar" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64')" }}></div>
                <div className="avatar" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64')" }}></div>
                <div className="avatar" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64')" }}></div>
              </div>
            </div>
            <h4>Community</h4>
            <p className="desc">Collaborate with 15,000+ peers and get feedback on your portfolio.</p>
            <button className="btn-primary btn-full" onClick={() => navigate("/community")}>
              Join Discussion
            </button>
          </div>

          {/* PLACEMENT ACTIVITY */}
          <div className="dashboard-card card-placement">
            <div className="card-icon icon-red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h4>Placement Activity</h4>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">{loading ? "..." : stats.applied}</div>
                <div className="stat-label">Applied</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{loading ? "..." : stats.interviews}</div>
                <div className="stat-label">Interviews</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{loading ? "..." : stats.offers}</div>
                <div className="stat-label">Offers</div>
              </div>
            </div>
            <button className="btn-secondary btn-full" style={{ background: "#E6F0FF", color: "#3b82f6" }} onClick={() => navigate("/placement-activity")}>
              Track Status
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}