import React, { useEffect, useState } from 'react'
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

  // ✅ DEMO (NOT LOGGED IN) - Using placeholder images to match Home design
  const tech = [
    { title: 'Fullstack Development', desc: 'Modern web apps with React and Node.', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80', tag: 'WEB DEV', rating: '4.8' },
    { title: 'Data Science', desc: 'Python, ML pipelines and visualization.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', tag: 'DATA', rating: '4.9' },
    { title: 'DevOps', desc: 'CI/CD, containers and infra as code.', image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80', tag: 'INFRA', rating: '4.7' },
  ]

  const nonTech = [
    { title: 'Communication Skills', desc: 'Presentation and storytelling.', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80', tag: 'SOFT SKILLS', rating: '4.6' },
    { title: 'Career Coaching', desc: 'Resume and interview prep.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80', tag: 'CAREER', rating: '4.9' },
    { title: 'Digital Marketing', desc: 'SEO and marketing campaigns.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', tag: 'MARKETING', rating: '4.7' },
  ]

  function viewCourse(c) {
    setSelectedCourse(c)
  }

  return (
    <div className="home-wrapper" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <section className="home-section" style={{ paddingTop: '40px' }}>
      <div className="container" style={{ padding: 0 }}>
        
        <div className="section-header" style={{ marginBottom: '30px' }}>
          <h2 className="section-title">Courses</h2>
        </div>

        {/* 🔓 NOT LOGGED IN */}
        {!user ? (
          <>
            <h3 style={{ marginBottom: '20px', color: 'var(--text)' }}>Tech Courses</h3>
            <div className="courses-grid">
              {tech.map(c => (
                <div key={c.title} className="course-card">
                  <div className="course-image">
                    <img src={c.image} alt={c.title} />
                  </div>
                  <div className="course-content">
                    <div className="course-meta">{c.tag}</div>
                    <h3 className="course-title">{c.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{c.desc}</p>
                    <div className="course-footer" style={{ borderTop: 'none', paddingTop: 0, paddingBottom: '16px' }}>
                      <div className="course-rating">⭐ {c.rating}</div>
                    </div>
                    <button
                      className="btn primary"
                      style={{ width: '100%' }}
                      onClick={() => alert("Please login to enroll")}
                    >
                      Login to Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--text)' }}>Non-Tech Courses</h3>
            <div className="courses-grid">
              {nonTech.map(c => (
                <div key={c.title} className="course-card">
                  <div className="course-image">
                    <img src={c.image} alt={c.title} />
                  </div>
                  <div className="course-content">
                    <div className="course-meta">{c.tag}</div>
                    <h3 className="course-title">{c.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{c.desc}</p>
                    <div className="course-footer" style={{ borderTop: 'none', paddingTop: 0, paddingBottom: '16px' }}>
                      <div className="course-rating">⭐ {c.rating}</div>
                    </div>
                    <button
                      className="btn primary"
                      style={{ width: '100%' }}
                      onClick={() => alert("Please login to enroll")}
                    >
                      Login to Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 style={{ marginBottom: '20px', color: 'var(--text)' }}>Available Courses</h3>
            <div className="courses-grid">
              {courses.map(c => (
                <div key={c.id} className="course-card">
                  <div className="course-image">
                    <img
                      src={`http://localhost:5000/uploads/images/${c.image}`}
                      alt={c.title}
                      onError={(e) => e.target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"}
                    />
                  </div>
                  <div className="course-content">
                    <div className="course-meta">COURSE</div>
                    <h3 className="course-title">{c.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>
                    <div className="course-footer">
                      <div className="course-rating" style={{ fontSize: '13px' }}>⏱ {c.duration}</div>
                      <div className="course-price" style={{ fontSize: '14px', color: '#64748b' }}>💻 {c.mode}</div>
                    </div>
                    <button
                      className="btn primary"
                      style={{ width: '100%', marginTop: '16px' }}
                      onClick={() => viewCourse(c)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ✅ MODAL */}
        {selectedCourse && (
          <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{selectedCourse.title}</h3>
              <p>{selectedCourse.description}</p>
              <div style={{ marginTop: 12 }}>
                <div><strong>Duration:</strong> {selectedCourse.duration}</div>
                <div><strong>Fees:</strong> ₹{selectedCourse.fees}</div>
              </div>
              <button className="btn primary" style={{ marginTop: 16 }}>
                Enroll
              </button>
            </div>
          </div>
        )}

      </div>
      </section>
    </div>
  )
}