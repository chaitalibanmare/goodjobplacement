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

      const res = await fetch("http://localhost:5000/api/vacancies/employer", {
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
    <div className="dashboard">

      <h1 className="dashboard-title">
        Welcome to GoodJobPlacement.com
      </h1>

      <p className="dashboard-welcome">
        Hello <b>{user?.name}</b>, welcome to your employer dashboard.
      </p>

      <div className="dashboard-cards">

        {/* Company Profile */}
        <div className="dashboard-card">
          <h3>Company Profile</h3>
          <p>
            Update your company information, logo and details so candidates can learn about your company.
          </p>
          <a href="/employer/profile" className="dashboard-btn">
            View Profile
          </a>
        </div>

        {/* Post Vacancy */}
        <div className="dashboard-card">
          <h3>Post Vacancy</h3>
          <p>
            Create new job opportunities and start receiving applications from candidates.
          </p>
          <a href="/employer/post-vacancy" className="dashboard-btn">
            Post Job
          </a>
        </div>

        {/* Manage Applicants */}
        <div className="dashboard-card">
          <h3>Manage Applicants</h3>
          <p>
            View all the jobs you posted and manage applicants easily.
          </p>
          <a href="/employer/vacancies" className="dashboard-btn">
            Manage Applicants
          </a>
        </div>

        

      </div>

    </div>
  );
}