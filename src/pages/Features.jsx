import React from 'react'

import InternIcon from '../assets/icon-internship.svg'
import SoftIcon from '../assets/icon-softskills.svg'
import MgmtIcon from '../assets/icon-management.svg'
import IeltsIcon from '../assets/icon-ielts.svg'

const features = [
  {
    icon: InternIcon,
    title: '3–6 Month Internships',
    desc: 'Structured internships with partner companies to gain real-world experience and convert to full-time roles.'
  },
  {
    icon: SoftIcon,
    title: 'Soft Skills Training',
    desc: 'Communication, presentation and interview readiness workshops to improve workplace impact.'
  },
  {
    icon: MgmtIcon,
    title: 'Management Skills',
    desc: 'Leadership, stakeholder communication and product-thinking modules for early managers.'
  },
  {
    icon: IeltsIcon,
    title: 'IELTS Prep + Welcome Kit',
    desc: 'IELTS coaching and a free welcome kit included with any paid course enrollment.'
  },
]

export default function Features(){
  const [selected, setSelected] = React.useState(null)

  return (
    <section className="section">
      <div className="container">
        <h2>Features</h2>

        <p style={{color:'var(--muted)',marginTop:8,marginBottom:18}}>A focused set of offerings to boost employability and career growth.</p>

        <div className="feature-list">
          {features.map(f => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon"><img src={f.icon} alt="" style={{width:28,height:28}}/></div>
              <div className="feature-body">
                <h4>{f.title}</h4>
                <p className="muted">{f.desc}</p>
                <div style={{marginTop:12,display:'flex',gap:8}}>
                  <button className="btn primary" onClick={()=>setSelected(f)}>Enroll</button>
                  <button className="btn ghost" onClick={()=>setSelected(f)}>Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="modal-backdrop" onClick={()=>setSelected(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>{selected.title}</h3>
              <p className="muted">{selected.desc}</p>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
                <button className="btn ghost" onClick={()=>setSelected(null)}>Close</button>
                <button className="btn primary" onClick={()=>{alert('Enrolled (demo)'); setSelected(null)}}>Confirm Enroll</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
