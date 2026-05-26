import React, { useEffect, useState } from 'react'
import "../styles.css";

/* COMMON VACANCIES (for non-logged users) */

const commonVacancies = [
  {
    title: 'Software engineer',
    company: 'TCS',
    location: 'Pune',
    tag: 'Full Time',
    count: 5,
    desc: 'Looking for skilled developer...',
    logo: 'https://logo.clearbit.com/tcs.com',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&q=80'
  },
  {
    title: 'Frontend Developer',
    company: 'Designify',
    location: 'On-site',
    tag: 'Full Time',
    count: 6,
    desc: 'Build responsive UI with modern frameworks.',
    logo: 'https://logo.clearbit.com/designify.com',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80'
  },
  {
    title: 'Data Analyst',
    company: 'InsightCo',
    location: 'Remote',
    tag: 'Part Time',
    count: 8,
    desc: 'Analyze datasets and create dashboards.',
    logo: 'https://logo.clearbit.com/insight.com',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80'
  },
  {
    title: 'UI/UX Designer',
    company: 'PixelStudio',
    location: 'Hybrid',
    tag: 'Full Time',
    count: 4,
    desc: 'Design modern UI/UX for web and mobile applications.',
    logo: 'https://logo.clearbit.com/pixel.com',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=80'
  },
  {
    title: 'Java Developer',
    company: 'TCS',
    location: 'Pune',
    tag: 'Full Time',
    count: 7,
    desc: 'Develop enterprise applications using Java and spring Boot.',
    logo: 'https://logo.clearbit.com/tcs.com',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'
  },
  {
    title: 'Python Developer',
    company: 'Capgemini',
    location: 'Bangalore',
    tag: 'Full Time',
    count: 5,
    desc: 'Build scalable backend systems using Python and Django.',
    logo: 'https://logo.clearbit.com/capgemini.com',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80'
  }
]

export default function Vacancies() {

  const [vacancies, setVacancies] = useState([])
  const [selected, setSelected] = useState(null)

  /* CHECK LOGIN */
  const userStr = localStorage.getItem("gjp_user") || localStorage.getItem("user");
  let validUser = false;
  try {
    if (userStr && userStr !== "undefined" && userStr !== "null") {
      const parsed = JSON.parse(userStr);
      if (parsed && parsed.id) {
        validUser = true;
      }
    }
  } catch (e) {
    // ignore
  }

  const isLoggedIn = validUser;

  useEffect(() => {
    /* IF USER LOGGED IN -> FETCH APPROVED VACANCIES */
    if (isLoggedIn) {
      fetch("http://localhost:5000/api/vacancy/approved")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((v, i) => ({
              id: v.id,
              employer_id: v.employer_id,
              title: v.field,
              company: v.company_name,
              location: v.location,
              tag: v.time_type,
              count: v.total_vacancies,
              desc: v.description,
              logo: `https://logo.clearbit.com/${(v.company_name || 'company').replace(/\s+/g, '').toLowerCase()}.com`,
              image: commonVacancies[i % commonVacancies.length].image // Assigning an image for UI consistency
            }))
            // Show ONLY real employer vacancies to logged-in students
            setVacancies(formatted)
          } else {
            // IF DB IS EMPTY, SHOW COMMON VACANCIES AS DUMMY DATA
            setVacancies(commonVacancies)
          }
        })
        .catch(err => {
          console.log(err)
          setVacancies(commonVacancies)
        })
    }
    /* IF NOT LOGGED IN -> SHOW COMMON VACANCIES */
    else {
      setVacancies(commonVacancies)
    }
  }, [isLoggedIn])

  const handleApply = async (v) => {
    if (!isLoggedIn) {
      alert("Please login to apply")
      return
    }

    if (!v.id) {
      alert("This is a dummy vacancy. Cannot apply.")
      return
    }

    const userStr = localStorage.getItem("gjp_user") || localStorage.getItem("user")
    if (!userStr) {
      alert("User details not found. Please login again.")
      return
    }

    const user = JSON.parse(userStr)

    try {
      const res = await fetch("http://localhost:5000/api/application/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name || user.username || user.email || "Unknown User",
          vacancyId: v.id,
          employerId: v.employer_id,
          company: v.company,
          position: v.title,
          photo: user.profilePhoto || user.photo || ""
        })
      })

      const responseData = await res.json()
      if (res.ok) {
        alert("Application submitted successfully!")
      } else {
        alert(responseData.error || "Failed to apply")
      }
    } catch (err) {
      console.log(err)
      alert("Error applying. Please try again.")
    }
  }

  return (
    <div className="home-wrapper" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <section className="home-section" style={{ paddingTop: '40px' }}>
        <div className="container" style={{ padding: 0 }}>
          
          <div className="section-header" style={{ marginBottom: '30px' }}>
            <div>
              <h2 className="section-title">Vacancies</h2>
              <p className="section-subtitle">Explore available opportunities and start your career journey.</p>
            </div>
          </div>

          <div className="courses-grid">
            {vacancies.map((v, i) => (
              <div key={i} style={{ padding: '24px', backgroundColor: '#e0f2fe', borderRadius: '24px', border: 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer', minHeight: '300px' }} 
                   onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                
                {/* Top Row: Vacancy Count Pill & Bookmark */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#fff', color: '#333', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                    {v.count} Vacancies
                  </div>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                </div>

                {/* Company text */}
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>{v.company}</div>

                {/* Title */}
                <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: '800', color: '#111' }}>{v.title}</h3>
                
                {/* Description */}
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#555', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {v.desc}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.6)', color: '#333', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.8)' }}>{v.tag}</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.6)', color: '#333', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.8)' }}>{v.location}</span>
                </div>

                {/* Bottom Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#111' }}>{v.location}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>{v.company}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn ghost" 
                      style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', backgroundColor: '#fff', border: '1px solid #ccc', color: '#333', cursor: 'pointer' }} 
                      onClick={() => setSelected(v)}
                    >
                      Details
                    </button>
                    <button 
                      className="btn primary" 
                      style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', backgroundColor: '#111', color: '#fff', border: 'none', cursor: 'pointer' }} 
                      onClick={() => handleApply(v)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {selected && (
            <div className="modal-backdrop" onClick={() => setSelected(null)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '500px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', backgroundColor: '#fff' }}>
                    <img 
                      src={selected.logo} 
                      alt={selected.company} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} 
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${selected.company}&background=eff6ff&color=1e40af&bold=true` }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '22px', color: '#111' }}>{selected.title}</h3>
                    <div style={{ color: '#666', marginTop: '6px', fontSize: '15px' }}>{selected.company} · {selected.location}</div>
                  </div>
                </div>
                <p style={{ color: '#444', lineHeight: '1.6', fontSize: '15px', marginBottom: '32px' }}>{selected.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn primary"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}