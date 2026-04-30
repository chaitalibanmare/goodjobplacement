import React, { useEffect, useState } from 'react'
import iconFullstack from '../assets/icon-fullstack.svg'
import iconData from '../assets/icon-data.svg'
import iconDevops from '../assets/icon-devops.svg'
import iconComm from '../assets/icon-communication.svg'
import iconCareer from '../assets/icon-career.svg'
import iconDM from '../assets/icon-digital-marketing.svg'
import "../styles.css";

export default function Courses({ user }) {

  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    if (user) {
      fetchCourses()
    }
  }, [user])

  async function fetchCourses() {
    try {
      const res = await fetch("http://localhost:5000/api/courses")
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      console.log(err)
    }
  }

  // ✅ DEMO (NOT LOGGED IN)
  const tech = [
    { title:'Fullstack Development',desc:'Modern web apps with React and Node.',icon:iconFullstack },
    { title:'Data Science',desc:'Python, ML pipelines and visualization.',icon:iconData },
    { title:'DevOps',desc:'CI/CD, containers and infra as code.',icon:iconDevops },
  ]

  const nonTech = [
    { title:'Communication Skills',desc:'Presentation and storytelling.',icon:iconComm },
    { title:'Career Coaching',desc:'Resume and interview prep.',icon:iconCareer },
    { title:'Digital Marketing',desc:'SEO and marketing campaigns.',icon:iconDM },
  ]

  function viewCourse(c) {
    setSelectedCourse(c)
  }

  return (
    <section className="section">
      <div className="container">

        <h2>Courses</h2>

        {/* 🔓 NOT LOGGED IN */}
        {!user ? (
          <>
            <h3>Tech Courses</h3>

            <div className="grid">
              {tech.map(c => (
                <div key={c.title} className="card course">

                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <img src={c.icon} alt="" style={{width:50,height:50}}/>
                    <div>
                      <h3>{c.title}</h3>
                      <p>{c.desc}</p>
                    </div>
                  </div>

                  <button
                    className="btn primary"
                    onClick={() => alert("Please login to enroll")}
                  >
                    Login to Enroll
                  </button>

                </div>
              ))}
            </div>

            <h3 style={{marginTop:24}}>Non-Tech Courses</h3>

            <div className="grid">
              {nonTech.map(c => (
                <div key={c.title} className="card course">

                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <img src={c.icon} alt="" style={{width:50,height:50}}/>
                    <div>
                      <h3>{c.title}</h3>
                      <p>{c.desc}</p>
                    </div>
                  </div>

                  <button
                    className="btn primary"
                    onClick={() => alert("Please login to enroll")}
                  >
                    Login to Enroll
                  </button>

                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3>Available Courses</h3>

            <div className="grid">
              {courses.map(c => (
                <div key={c._id} className="card course">

                  <img 
                    src={`http://localhost:5000/uploads/images/${c.image}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "10px"
                    }}
                    onError={(e)=> e.target.src="https://via.placeholder.com/300x160"}
                  />

                  <h3>{c.title}</h3>

                  <p>{c.description}</p>

                  <div style={{display:'flex',gap:10}}>
                    <span>⏱ {c.duration}</span>
                    <span>💻 {c.mode}</span>
                  </div>

                  <button
                    className="btn primary"
                    onClick={()=>viewCourse(c)}
                  >
                    View Details
                  </button>

                </div>
              ))}
            </div>
          </>
        )}

        {/* ✅ MODAL */}
        {selectedCourse && (
          <div className="modal-backdrop" onClick={()=>setSelectedCourse(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>

              <h3>{selectedCourse.title}</h3>

              <p>{selectedCourse.description}</p>

              <div style={{marginTop:12}}>
                <div><strong>Duration:</strong> {selectedCourse.duration}</div>
                <div><strong>Fees:</strong> ₹{selectedCourse.fees}</div>
              </div>

              <button className="btn primary" style={{marginTop:16}}>
                Enroll
              </button>

            </div>
          </div>
        )}

      </div>
    </section>
  )
}