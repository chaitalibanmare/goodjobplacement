import React, { useState } from "react";

export default function EmployerVacancyForm() {

  const [form, setForm] = useState({
    companyName: "",
    location: "",
    field: "",
    totalVacancies: "",
    timeType: "Full Time",
    postedOn: "",
    lastDate: "",
    description: ""
  });

  function handleChange(e){
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submitForm(e){

  e.preventDefault();

  console.log("Submitting form:", form);

  try{

    const token = localStorage.getItem("gjp_token"); // 🔥 ADD THIS

    const res = await fetch("http://localhost:5000/api/vacancy/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization: "Bearer " + token   // 🔥 ADD THIS LINE
      },
      body:JSON.stringify(form)
    });

    const data = await res.json();

    if(res.ok){
      alert("Vacancy submitted successfully");
    }else{
      alert(data.error || "Submission failed");
    }

  }catch(err){
    console.log(err);
    alert("Server error");
  }

}
return(
  <section style={{ padding: "20px 20px" }}>
    
    <div className="page-container">  {/* ✅ wrapper */}

      <div className="vacancy-wrapper">

        <h2 className="form-title">Post Vacancy</h2>

        <form onSubmit={submitForm} className="vacancy-form">

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter job location"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Field</label>
            <input
              type="text"
              name="field"
              placeholder="Example: Software Developer"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Vacancies</label>
            <input
              type="number"
              name="totalVacancies"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Time Type</label>
            <select name="timeType" onChange={handleChange}>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>
          </div>

          <div className="form-group">
            <label>Posted On</label>
            <input type="date" name="postedOn" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Last Date to Apply</label>
            <input type="date" name="lastDate" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Write short job description"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Vacancy
          </button>

        </form>

      </div>

    </div>  {/* ✅ THIS WAS MISSING */}

  </section>
);
}