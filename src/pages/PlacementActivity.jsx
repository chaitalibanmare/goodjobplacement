import React from 'react'

const items = [
  {title: '10 Placement Calls', desc: 'Each candidate receives up to 10 interview calls with partner companies.'},
  {title: 'Paid Internships', desc: 'Stipend-backed internships with clear mentorship and milestones.'},
  {title: 'Part-time Jobs', desc: 'Flexible part-time opportunities that fit around your learning schedule.'},
  {title: 'Freelancing Work', desc: 'Short-term freelancing projects to build portfolio and income.'},
  {title: 'Entrepreneurship Support', desc: 'Guidance, mentor hours and pitch help for founders.'},
]

export default function PlacementActivity(){
  return (
    <section className="section">
      <div className="container">
        <h2>Placement Activity</h2>
        <p style={{color:'var(--muted)',marginTop:8}}>Our placement program helps learners secure interviews, internships and real work.</p>

        <div className="activity-list" style={{marginTop:16}}>
          {items.map(it => (
            <div key={it.title} className="card activity-item">
              <div className="activity-left">
                <div className="activity-dot" />
              </div>
              <div className="activity-body">
                <h4 style={{margin:0}}>{it.title}</h4>
                <p className="muted" style={{margin:'6px 0 0'}}>{it.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
