import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function PlacementActivity() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({});
  const [toast, setToast] = useState(null);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [userApplications, setUserApplications] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("gjp_token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Initialize user from localStorage on component mount
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    try {
      const userData = JSON.parse(localStorage.getItem('gjp_user') || 'null');
      setUser(userData);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Check localStorage when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        try {
          const userData = JSON.parse(localStorage.getItem('gjp_user') || 'null');
          setUser(userData);
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    };

    // Listen for storage changes
    const handleStorageChange = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('gjp_user') || 'null');
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Scroll to top when user state changes
    window.scrollTo(0, 0);

    if (user?.role === "admin") {
      fetchAdminActivity();
    } else if (user?.role === "user") {
      fetchUserActivity();
    } else {
      setLoading(false);
    }
  }, [user]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchUserActivity = async () => {
    setLoading(true);
    try {
      const [appRes, vacRes] = await Promise.all([
        axios.get(`${baseUrl}/api/user/applications`, { headers: authHeaders }),
        axios.get(`${baseUrl}/api/vacancy/all`)
      ]);

      const applications = appRes.data.applications || [];
      const vacancies = vacRes.data.vacancies || [];

      const userStats = appRes.data.stats || {
        applied: applications.length,
        shortlisted: applications.filter(a => a.status === "shortlisted").length,
        rejected: applications.filter(a => a.status === "rejected").length,
        hired: applications.filter(a => a.status === "hired").length
      };

      setUserApplications(applications);
      setJobs(vacancies);
      setStats(userStats);
    } catch (err) {
      showToast("Failed to load your application activity", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminActivity = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/admin/users-applications`, { headers: authHeaders });
      const data = res.data.data || [];
      const totalApplications = data.reduce((sum, item) => sum + (item.applicationCount || 0), 0);
      const totalPlacements = data.reduce((sum, item) => sum + (item.placements?.length || 0), 0);
      setAdminUsers(data);
      setStats({
        totalUsers: data.length,
        totalApplications,
        totalPlacements
      });
    } catch (err) {
      showToast("Failed to load admin activity", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/vacancy/all`);
      const vacancies = res.data.vacancies || [];
      setJobs(vacancies);

      const counts = {};
      await Promise.all(
        vacancies.map(async (vacancy) => {
          try {
            const appRes = await axios.get(`http://localhost:5000/api/vacancy/${vacancy.id}/applicants`);
            counts[vacancy.id] = appRes.data.applicants?.length || 0;
          } catch (err) {
            counts[vacancy.id] = 0;
          }
        })
      );
      setApplicantCounts(counts);
    } catch (err) {
      showToast("Failed to fetch jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [vacRes, placRes] = await Promise.all([
        axios.get("http://localhost:5000/api/vacancy/all"),
        axios.get("http://localhost:5000/api/placement/all")
      ]);
      setStats({
        totalVacancies: vacRes.data.vacancies?.length || 0,
        totalPlacements: placRes.data.placements?.length || 0,
        pendingPlacements: placRes.data.placements?.filter(p => p.status === "pending")?.length || 0
      });
    } catch (err) {
      showToast("Failed to fetch stats", "error");
    } finally {
      setLoading(false);
    }
  };

  const actionMessage = (action) => {
    const messages = {
      approve: "Placement approved successfully!",
      reject: "Placement rejected.",
      delete: "Placement deleted."
    };
    return messages[action] || "Action completed!";
  };

  const approveJob = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/placement/${id}`, { status: "approved" });
      showToast(actionMessage("approve"));
      fetchJobs();
      fetchStats();
    } catch (err) {
      showToast("Failed to approve", "error");
    }
  };

  const rejectJob = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/placement/${id}`, { status: "rejected" });
      showToast(actionMessage("reject"));
      fetchJobs();
      fetchStats();
    } catch (err) {
      showToast("Failed to reject", "error");
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/placement/${id}`);
      showToast(actionMessage("delete"));
      fetchJobs();
      fetchStats();
    } catch (err) {
      showToast("Failed to delete", "error");
    }
  };

  const statsCards = user?.role === "admin"
    ? [
      { label: "Users", value: stats.totalUsers ?? 0, color: "var(--accent)" },
      { label: "Applications", value: stats.totalApplications ?? 0, color: "#8b5cf6" },
      { label: "Placements", value: stats.totalPlacements ?? 0, color: "#f59e0b" }
    ]
    : user?.role === "user"
      ? [
        { label: "Applied", value: stats.applied ?? 0, color: "var(--accent)" },
        { label: "Interviews", value: stats.shortlisted ?? 0, color: "#8b5cf6" },
        { label: "Rejected", value: stats.rejected ?? 0, color: "#f59e0b" },
        { label: "Hired", value: stats.hired ?? 0, color: "#10b981" }
      ]
      : [
        { label: "Total Jobs", value: stats.totalVacancies ?? 0, color: "var(--accent)" },
        { label: "Total Placements", value: stats.totalPlacements ?? 0, color: "#8b5cf6" },
        { label: "Pending", value: stats.pendingPlacements ?? 0, color: "#f59e0b" }
      ];

  const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const buttonStyles = {
    approve: {
      bg: isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#d1fae5",
      color: isDarkMode ? "#86efac" : "#065f46",
      bgHover: isDarkMode ? "rgba(16, 185, 129, 0.25)" : "#a7f3d0"
    },
    reject: {
      bg: isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
      color: isDarkMode ? "#fca5a5" : "#7f1d1d",
      bgHover: isDarkMode ? "rgba(239, 68, 68, 0.25)" : "#fecaca"
    },
    delete: {
      bg: isDarkMode ? "rgba(107, 114, 128, 0.15)" : "#f3f4f6",
      color: isDarkMode ? "#d1d5db" : "#374151",
      bgHover: isDarkMode ? "rgba(107, 114, 128, 0.25)" : "#e5e7eb"
    }
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      pending: {
        bg: isDarkMode ? "rgba(59, 130, 246, 0.15)" : "#dbeafe",
        color: isDarkMode ? "#93c5fd" : "#1e40af"
      },
      approved: {
        bg: isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#d1fae5",
        color: isDarkMode ? "#86efac" : "#065f46"
      },
      rejected: {
        bg: isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
        color: isDarkMode ? "#fca5a5" : "#7f1d1d"
      }
    };
    return styles[status] || styles.pending;
  };

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const renderUserOpportunities = () => {
    // Calculate time difference
    const getTimeAgo = (date) => {
      const now = new Date();
      const diffMs = now - new Date(date);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      return "Just now";
    };

    return (
      <>
        {userApplications.length === 0 ? (
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎯</div>
            <p style={{ color: "var(--muted)", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No applications yet</p>
            <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "20px" }}>Start exploring opportunities to build your career path</p>
            <a href="/vacancies" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}>
              Explore opportunities →
            </a>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", color: "var(--text)" }}>Your Applied Opportunities</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {userApplications.map((application, idx) => {
                const companyInitial = (application.vacancyId?.companyName || 'C')[0].toUpperCase();
                return (
                  <div
                    key={idx}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "10px",
                      padding: "16px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--border-light)";
                    }}
                  >
                    {/* Company Logo + Info */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        minWidth: "48px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "white"
                      }}>
                        {companyInitial}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "700", color: "var(--text)", lineHeight: "1.4" }}>
                          {application.vacancyId?.position || 'Position'}
                        </h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", fontWeight: "500" }}>
                          {application.vacancyId?.companyName || 'Company'}
                        </p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
                          {getTimeAgo(application.appliedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Location & Job Type */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", fontSize: "12px", color: "var(--muted)" }}>
                      {application.vacancyId?.location && (
                        <span>📍 {application.vacancyId.location}</span>
                      )}
                      {application.vacancyId?.timeType && (
                        <span>⏱️ {application.vacancyId.timeType}</span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          application.status === "applied" ? "rgba(59, 130, 246, 0.1)" :
                            application.status === "shortlisted" ? "rgba(168, 85, 247, 0.1)" :
                              application.status === "rejected" ? "rgba(239, 68, 68, 0.1)" :
                                application.status === "hired" ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        color:
                          application.status === "applied" ? "#3b82f6" :
                            application.status === "shortlisted" ? "#a855f7" :
                              application.status === "rejected" ? "#ef4444" :
                                application.status === "hired" ? "#10b981" : "#6b7280"
                      }}>
                        {application.status === "applied" && "⏳ Applied"}
                        {application.status === "shortlisted" && "✨ Shortlisted"}
                        {application.status === "rejected" && "❌ Rejected"}
                        {application.status === "hired" && "🎉 Hired"}
                      </span>
                      <span style={{
                        fontSize: "12px",
                        color: "var(--muted)"
                      }}>
                        {application.status === "applied" && "Under Review"}
                        {application.status === "shortlisted" && "Interview Round"}
                        {application.status === "rejected" && "Not Selected"}
                        {application.status === "hired" && "Congratulations!"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </>
    );
  };

  const getAppliedVacancyIds = () => {
    return userApplications.map(app => app.vacancyId?.id).filter(Boolean);
  };

  const renderAvailableVacancies = () => {
    const appliedIds = getAppliedVacancyIds();
    const unappliedJobs = jobs.filter(job => !appliedIds.includes(job.id));

    // Group jobs by company
    const jobsByCompany = {};
    unappliedJobs.forEach(job => {
      const company = job.companyName || 'Unknown Company';
      if (!jobsByCompany[company]) {
        jobsByCompany[company] = [];
      }
      jobsByCompany[company].push(job);
    });

    const companies = Object.keys(jobsByCompany);

    return (
      <>
        {unappliedJobs.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", marginTop: "40px", borderRadius: "8px", background: "var(--card)", color: "var(--muted)" }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>You've explored all opportunities!</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>Check back later for more job openings</p>
          </div>
        ) : (
          <>
            {/* Company Showcase Section */}
            <div style={{ marginTop: "40px", marginBottom: "40px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "24px", color: "var(--text)" }}>
                Explore jobs by top companies
              </h2>
              <div style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "12px",
                scrollBehavior: "smooth"
              }}>
                {companies.map((company, idx) => {
                  const companyInitial = (company || 'C')[0].toUpperCase();
                  const jobCount = jobsByCompany[company].length;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border-light)",
                        borderRadius: "12px",
                        padding: "20px",
                        minWidth: "240px",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "var(--border-light)";
                      }}
                    >
                      <div style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "white",
                        margin: "0 auto 12px"
                      }}>
                        {companyInitial}
                      </div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700", color: "var(--text)", lineHeight: "1.4" }}>
                        {company}
                      </h3>
                      <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", fontWeight: "500" }}>
                        {jobCount} {jobCount === 1 ? 'opening' : 'openings'}
                      </p>
                      <button
                        onClick={() => {
                          const element = document.getElementById(`company-${idx}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        style={{
                          marginTop: "10px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--accent)",
                          background: "transparent",
                          color: "var(--accent)",
                          fontWeight: "600",
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "var(--accent)";
                          e.target.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = "var(--accent)";
                        }}
                      >
                        View jobs
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Jobs Section */}
            <div style={{ marginTop: "40px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "24px", color: "var(--text)" }}>
                Recommended jobs for you
              </h2>

              {companies.map((company, companyIdx) => (
                <div key={companyIdx} id={`company-${companyIdx}`} style={{ marginBottom: "40px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--text)", paddingBottom: "8px", borderBottom: "2px solid var(--accent)" }}>
                    {company}
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                    {jobsByCompany[company].map((job, idx) => {
                      const companyInitial = (company || 'C')[0].toUpperCase();
                      return (
                        <div
                          key={idx}
                          style={{
                            background: "var(--card)",
                            border: "1px solid var(--border-light)",
                            borderRadius: "10px",
                            padding: "16px",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            display: "flex",
                            flexDirection: "column"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.borderColor = "var(--accent)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "var(--border-light)";
                          }}
                        >
                          {/* Company Logo + Info */}
                          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                            <div style={{
                              width: "48px",
                              height: "48px",
                              minWidth: "48px",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "20px",
                              fontWeight: "700",
                              color: "white"
                            }}>
                              {companyInitial}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "700", color: "var(--text)", lineHeight: "1.4" }}>
                                {job.position || job.field || 'Position'}
                              </h3>
                              <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", fontWeight: "500" }}>
                                {job.companyName || 'Company'}
                              </p>
                            </div>
                          </div>

                          {/* Location & Job Type */}
                          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", fontSize: "12px", color: "var(--muted)" }}>
                            {job.location && (
                              <span>📍 {job.location}</span>
                            )}
                            {job.timeType && (
                              <span>⏱️ {job.timeType}</span>
                            )}
                          </div>

                          {/* Description Preview */}
                          {job.description && (
                            <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {job.description}
                            </p>
                          )}

                          {/* Apply Button */}
                          <button
                            onClick={() => applyToJob(job.id)}
                            style={{
                              marginTop: "auto",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "none",
                              background: "var(--accent)",
                              color: "white",
                              fontWeight: "600",
                              fontSize: "13px",
                              cursor: "pointer",
                              transition: "all 0.2s ease"
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
                            onMouseLeave={(e) => e.target.style.opacity = "1"}
                          >
                            Apply Now
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  const applyToJob = async (vacancyId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/user/apply/${vacancyId}`,
        {},
        { headers: authHeaders }
      );
      showToast("Applied successfully!", "success");
      // Refresh user applications to update the UI
      fetchUserActivity();
    } catch (err) {
      if (err.response?.status === 400) {
        showToast("You have already applied to this job", "error");
      } else {
        showToast("Failed to apply to job", "error");
      }
      console.error(err);
    }
  };

  return (
    <div className="home-wrapper">
      <div style={{
        minHeight: "100vh",
        padding: "40px 20px",
        transition: "background-color 0.3s ease"
      }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "42px", fontWeight: "800", background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Explore Opportunities</h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "16px", fontWeight: "500" }}>
            {user?.role === "admin" ? "Track student applications and placements" : user?.role === "user" ? "Your applied opportunities and progress" : "Discover amazing job opportunities from top companies"}
          </p>
        </div>

        {toast && (
          <div style={{
            marginBottom: "24px",
            padding: "14px 18px",
            borderRadius: "8px",
            background: toast.type === "success" ? "rgba(16, 185, 129, 0.1)" : toast.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)",
            border: `1px solid ${toast.type === "success" ? "var(--accent)" : toast.type === "error" ? "#ef4444" : "#3b82f6"}`,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: toast.type === "success" ? "var(--accent)" : toast.type === "error" ? "#ef4444" : "#3b82f6"
          }}>
            <span style={{ fontSize: "18px" }}>{toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}</span>
            <span>{toast.message}</span>
          </div>
        )}

        {user && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}>
            {statsCards.map((card, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card)",
                  borderRadius: "12px",
                  padding: "28px",
                  border: "1px solid var(--border-light)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = card.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border-light)";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  fontSize: "80px",
                  opacity: "0.08",
                  pointerEvents: "none"
                }}>
                  {card.label === "Applied" && "📝"}
                  {card.label === "Interviews" && "🎤"}
                  {card.label === "Rejected" && "❌"}
                  {card.label === "Hired" && "🎉"}
                  {card.label === "Users" && "👥"}
                  {card.label === "Applications" && "📊"}
                  {card.label === "Placements" && "🏆"}
                </div>
                <div style={{ fontSize: "40px", marginBottom: "12px", display: "inline-block" }}>
                  {card.label === "Applied" && "📝"}
                  {card.label === "Interviews" && "🎤"}
                  {card.label === "Rejected" && "❌"}
                  {card.label === "Hired" && "🎉"}
                  {card.label === "Users" && "👥"}
                  {card.label === "Applications" && "📊"}
                  {card.label === "Placements" && "🏆"}
                </div>
                <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "10px" }}>
                  {card.label}
                </div>
                <div style={{ fontSize: "42px", fontWeight: "800", color: card.color, lineHeight: "1" }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>⏳ Loading opportunities...</div>
          </div>
        )}

        {!loading && user?.role === "user" && (
          <>
            {renderUserOpportunities()}
            {renderAvailableVacancies()}
          </>
        )}

        {!loading && user?.role === "admin" && (
          <>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", color: "var(--text)" }}>Student Placements Overview</h2>
            {adminUsers.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", borderRadius: "8px", background: "var(--card)", color: "var(--muted)" }}>
                No student data available
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {adminUsers.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "8px",
                      padding: "20px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "var(--text)" }}>
                      👤 {item.user.name || 'Unknown'}
                    </h3>
                    <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ color: "var(--text)" }}>Applications:</strong> {item.applicationCount}
                      </div>
                      {item.applications.length > 0 && (
                        <div style={{ marginBottom: "8px" }}>
                          <strong style={{ color: "var(--text)" }}>Applied to:</strong>
                          <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                            {item.applications.map(a => a.company).join(", ")}
                          </div>
                        </div>
                      )}
                      {item.placements.length > 0 && (
                        <div style={{ padding: "12px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.1)", borderLeft: "3px solid var(--accent)" }}>
                          <strong style={{ color: "var(--accent)" }}>✅ Placed at:</strong>
                          <div style={{ fontSize: "13px", color: "var(--text)", marginTop: "4px", whiteSpace: "pre-wrap" }}>
                            {item.placements.map(p => `${p.company} (${p.position})`).join("\n")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !user && (
          <div style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "40px"
          }}>
            <div style={{
              maxWidth: "600px",
              textAlign: "center",
              padding: "60px 40px",
              background: "var(--card)",
              borderRadius: "16px",
              border: "1px solid var(--border-light)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              animation: "fadeIn 0.6s ease-in"
            }}>
              <div style={{
                fontSize: "72px",
                marginBottom: "24px",
                animation: "bounce 2s infinite"
              }}>🔐</div>
              <h2 style={{
                margin: "0 0 12px 0",
                fontSize: "32px",
                fontWeight: "800",
                color: "var(--text)",
                background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Sign in to explore opportunities</h2>
              <p style={{
                margin: "12px 0 32px 0",
                fontSize: "16px",
                color: "var(--muted)",
                lineHeight: "1.6"
              }}>Register or login to view job opportunities, apply to companies, and track your career progress</p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => window.location.href = "/login"}
                  style={{
                    padding: "14px 36px",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
                    minWidth: "140px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 16px rgba(139, 92, 246, 0.3)";
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = "/login"}
                  style={{
                    padding: "14px 36px",
                    borderRadius: "8px",
                    border: "2px solid var(--accent)",
                    background: "transparent",
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    minWidth: "140px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--accent)";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--accent)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Register / Sign Up
                </button>
              </div>

              <div style={{
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid var(--border-light)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "16px"
              }}>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--accent)", marginBottom: "4px" }}>500+</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Openings</div>
                </div>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--accent)", marginBottom: "4px" }}>100+</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Companies</div>
                </div>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--accent)", marginBottom: "4px" }}>1K+</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Placements</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>⏳ Loading opportunities...</div>
          </div>
        )}

        {!loading && user && !["admin", "user"].includes(user.role) && (
          <div style={{ padding: "40px", textAlign: "center", borderRadius: "8px", background: "var(--card)", color: "var(--muted)" }}>
            Your account does not have access to this section
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default PlacementActivity;
