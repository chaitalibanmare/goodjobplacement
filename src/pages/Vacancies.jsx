import React from 'react'
import JobIcon from '../assets/icon-job.svg'

const vacancies = [
  {
    title: 'Software Developer',
    company: 'TechCorp',
    location: 'Remote',
    tag: 'Full-time',
    count: 12,
    desc: 'Work on backend systems, APIs and integrations.',
    skills: ['JavaScript', 'Node.js', 'SQL', 'REST APIs'],
    experience: '0-3 years (Freshers welcome and experienced).'
  },
  {
    title: 'Frontend Developer',
    company: 'Designify',
    location: 'On-site',
    tag: 'Contract',
    count: 6,
    desc: 'Build responsive UI with modern frameworks.',
    skills: ['HTML', 'CSS', 'React', 'TypeScript'],
    experience: '1-4 years (Open to freshers with strong projects).'
  },
  {
    title: 'Data Analyst',
    company: 'InsightCo',
    location: 'Remote',
    tag: 'Part-time',
    count: 8,
    desc: 'Analyze datasets and create dashboards.',
    skills: ['Python', 'Pandas', 'SQL', 'Tableau'],
    experience: '0-2 years (Freshers can apply).'
  },
  {
    title: 'Full Stack Engineer',
    company: 'StackWorks',
    location: 'Hybrid',
    tag: 'Full-time',
    count: 5,
    desc: 'Deliver end-to-end features from DB to UI.',
    skills: ['React', 'Node.js', 'Postgres', 'Docker'],
    experience: '2-5 years (Experienced preferred).'
  },
  {
    title: 'Solutions Architect',
    company: 'EnterpriseX',
    location: 'On-site',
    tag: 'Full-time',
    count: 2,
    desc: 'Design scalable systems and mentor engineering teams.',
    skills: ['Systems Design', 'Cloud (AWS/GCP)', 'Microservices'],
    experience: '5+ years (Senior role).'
  },
  {
    title: 'Interior Designer',
    company: 'CreativeSpaces',
    location: 'On-site',
    tag: 'Contract',
    count: 4,
    desc: 'Design residential and commercial interiors.',
    skills: ['AutoCAD', 'SketchUp', 'Client Communication'],
    experience: '0-4 years (Freshers with portfolio welcome).'
  },
  // more roles can be added here
]

export default function Vacancies(){
  const [selected, setSelected] = React.useState(null)
  const [applyFor, setApplyFor] = React.useState(null)

  function handleApply(job){
    setApplyFor(job)
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Vacancies</h2>
        <p className="muted">Open roles across domains — counts show available openings per role.</p>

        <div className="grid">
          {vacancies.map((v, i)=> (
            <article key={i} className="vacancy card">
              <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>
                <img src={JobIcon} alt="job" style={{width:48,height:48}} />
                <div style={{flex:1}}>
                  <h3 style={{margin:0}}>{v.title} <span className="vacancy-count">{v.count}</span></h3>
                  <div className="muted">{v.company} · {v.location} · {v.tag}</div>
                </div>
              </div>
              <p style={{marginTop:8}} className="muted">{v.desc}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn ghost" onClick={()=>setSelected(v)}>View Details</button>
                </div>
                <button className="btn primary" onClick={()=>handleApply(v)}>Apply</button>
              </div>
            </article>
          ))}
        </div>

        {selected && (
          <div className="modal-backdrop" onClick={()=>setSelected(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>{selected.title} — {selected.company}</h3>
              <p className="muted">{selected.location} · {selected.tag} · Openings: {selected.count}</p>
              <h4 style={{marginTop:12}}>Description</h4>
              <p className="muted">{selected.desc}</p>
              <h4>Skills Required</h4>
              <ul>
                {selected.skills.map(s => <li key={s} className="muted">{s}</li>)}
              </ul>
              <h4>Experience</h4>
              <p className="muted">{selected.experience}</p>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
                <button className="btn ghost" onClick={()=>setSelected(null)}>Close</button>
                <button className="btn primary">Apply Now</button>
              </div>
            </div>
          </div>
        )}

        {applyFor && (
          <div className="modal-backdrop" onClick={()=>setApplyFor(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>Apply for: {applyFor.title}</h3>
              <form className="form apply-form" onSubmit={(e)=>{e.preventDefault(); alert('Application submitted (demo)'); setApplyFor(null)}}>
                <label>Full name</label>
                <input required placeholder="Your full name" />
                <label>Email</label>
                <input type="email" required placeholder="you@example.com" />
                <label>Phone</label>
                <input type="tel" placeholder="Optional" />
                <label>Resume</label>
                <input type="file" accept=".pdf,.doc,.docx" />
                <label>Cover letter</label>
                <textarea placeholder="A short note about your fit" rows={4} />
                <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
                  <button className="btn ghost" type="button" onClick={()=>setApplyFor(null)}>Cancel</button>
                  <button className="btn primary" type="submit">Send Application</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
