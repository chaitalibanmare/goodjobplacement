import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("gjp_token");
    localStorage.removeItem("gjp_user");
    navigate("/");
  }

  return (
    <main>
      <section className="section">
        <div className="container">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}
          >
            <h2>Admin Dashboard</h2>

            
          </div>

          <div className="grid">

            <div className="card">
              <h3>Users</h3>
              <p className="muted">Manage registered users</p>
              <button
                className="btn primary"
                onClick={() => navigate("/admin/users")}
              >
                View Users
              </button>
            </div>

            <div className="card">
              <h3>Staff</h3>
              <p>View and manage staff members</p>
               <button
                 className="btn primary"
                 onClick={() => navigate("/admin/staff")}
            >
                Manage Staff
              </button>
          </div>

          <div className="grid">
            <div className="card">
              <h3>Employers</h3>
              <p>View registered employers</p>
              <button 
              className="btn primary"
              onClick={() => navigate("/admin/employers")}
              >
                View Employers
               </button>
              </div>
            </div>


            <div className="card">
              <h3>Vacancies</h3>
              <p className="muted">Add or manage job vacancies</p>
              <button
                className="btn primary"
                onClick={() => navigate("/admin/vacancies")}
              >
                Manage Jobs
              </button>
            </div>

            <div className="card">
              <h3>Courses</h3>
              <p className="muted">Add or edit courses</p>
              <button
                className="btn primary"
                onClick={() => navigate("/admin/courses")}
              >
                Manage Courses
              </button>
            </div>

            <div className="card">
              <h3>Placement Activity</h3>
              <p className="muted">Track placements and offers</p>
              <button
                className="btn primary"
                onClick={() => navigate("/admin/activity")}
              >
                View Activity
              </button>
            </div>

            <div className="card">
              <h3>Communities</h3>
              <p className="muted">Manage communities</p>
              <button
                className="btn primary"
                onClick={() => navigate("/admin/community")}
              >
                Manage Communities
              </button>
            </div>
                        

          </div>

        </div>
      </section>
    </main>
  );
}