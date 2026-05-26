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
    <div className="home-wrapper" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <section className="home-section" style={{ paddingTop: '40px' }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="section-header" style={{ marginBottom: '30px' }}>
            <h2 className="section-title">Features</h2>
            <p className="section-subtitle">A focused set of offerings to boost employability and career growth.</p>
          </div>

        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ flexShrink: 0, width: '48px', height: '48px', backgroundColor: '#fafbfc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                <img src={f.icon} alt="" style={{ width: '24px', height: '24px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#111', fontWeight: '600' }}>{f.title}</h4>
                <p style={{ margin: 0, fontSize: '15px', color: '#64748b', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'center', flexShrink: 0 }}>
                <button className="btn primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setSelected(f)}>Enroll</button>
                <button className="btn ghost" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setSelected(f)}>Learn More</button>
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
    </div>
  )
}
