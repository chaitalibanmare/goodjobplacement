import React, { useEffect, useState } from "react";
import JobIcon from "../../assets/icon-job.svg";

export default function UserVacancies() {

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // ✅ FETCH VACANCIES
  useEffect(() => {
    async function fetchVacancies() {
      try {
        const res = await fetch("http://localhost:5000/api/vacancy/approved");
        const data = await res.json();

        if (res.ok) {
          setVacancies(data.vacancies || []);
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
          const userId = userData.user._id;

          const res = await fetch(`http://localhost:5000/api/application/user/${userId}`);
          const data = await res.json();

          const ids = data.map(app => app.vacancyId);
          setAppliedJobs(ids);
        })
        .catch(err => console.log(err));
    }
  }, []);

  // ✅ APPLY FUNCTION (FINAL FIXED)
  async function applyJob(job) {
    try {
      const token = localStorage.getItem("gjp_token");

      if (!token) {
        alert("Please login first");
        return;
      }

      // 🔥 GET USER FROM BACKEND
      const resUser = await fetch("http://localhost:5000/api/user/me", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const dataUser = await resUser.json();
      const user = dataUser.user;

      const res = await fetch("http://localhost:5000/api/application/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          userName: user.name,
          vacancyId: job._id,
          employerId: job.employerId,
          company: job.companyName,
          position: job.field,
          photo: user.profile?.photo || ""
        })
      });

      const data = await res.json();

      if (data.message === "Already Applied") {
        alert("You already applied!");
      } else {
        alert("Applied Successfully");

        // ✅ IMPORTANT FIX → update UI instantly
        setAppliedJobs(prev => [...prev, job._id]);
      }

    } catch (err) {
      console.log(err);
      alert("Apply failed");
    }
  }

  return (
    <section className="section">
      <div className="container">

        <h2>Available Vacancies</h2>

        {loading && <p>Loading vacancies...</p>}

        {!loading && vacancies.length === 0 && (
          <p style={{ marginTop: "20px" }}>
            No vacancies available yet.
          </p>
        )}

        <div className="user-vacancies-grid">

          {vacancies.map(v => (

            <article key={v._id} className="user-vacancy-card">

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <img src={JobIcon} alt="job" style={{ width: 48, height: 48 }} />

                <div>
                  <h3>
                    {v.field}
                    <span className="vacancy-count"> {v.totalVacancies}</span>
                  </h3>

                  <div className="muted">
                    {v.companyName} · {v.location} · {v.timeType}
                  </div>
                </div>
              </div>

              <p className="muted">{v.description}</p>

              {/* ✅ APPLY BUTTON FINAL */}
              <button
                className="btn primary"
                disabled={appliedJobs.includes(v._id)}
                onClick={() => applyJob(v)}
                style={{
                  background: appliedJobs.includes(v._id) ? "gray" : "",
                  cursor: appliedJobs.includes(v._id) ? "not-allowed" : "pointer"
                }}
              >
                {appliedJobs.includes(v._id) ? "Applied" : "Apply"}
              </button>

            </article>

          ))}

        </div>

      </div>
    </section>
  );
}