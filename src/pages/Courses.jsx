import React from 'react'
import iconFullstack from '../assets/icon-fullstack.svg'
import iconData from '../assets/icon-data.svg'
import iconDevops from '../assets/icon-devops.svg'
import iconCloud from '../assets/icon-cloud.svg'
import iconComm from '../assets/icon-communication.svg'
import iconCareer from '../assets/icon-career.svg'
import iconPM from '../assets/icon-pm.svg'
import iconDesign from '../assets/icon-design.svg'
import iconMakeup from '../assets/icon-makeup.svg'
import iconInterior from '../assets/icon-interior.svg'
import iconDM from '../assets/icon-digital-marketing.svg'
import iconLang from '../assets/icon-language.svg'
import iconTally from '../assets/icon-tally.svg'
import iconPhoto from '../assets/icon-photography.svg'
import iconBaking from '../assets/icon-baking.svg'
import iconFashion from '../assets/icon-fashion.svg'

export default function Courses(){
  const tech = [
    {title: 'Fullstack Development', desc: 'Modern web apps with React and Node.', icon: iconFullstack, description: 'Build production-ready single page applications and backend services using React, Node.js, Express and relational/non-relational databases. Includes authentication, testing and deployment with CI/CD pipelines. 3 hands-on projects and interview prep.', duration: '12 weeks', fees: '₹25,000'},
    {title: 'Data Science', desc: 'Python, ML pipelines and visualization.', icon: iconData, description: 'End-to-end data workflows: acquisition, cleaning, feature engineering, model selection and evaluation. Practical ML with scikit-learn, intro to deep learning and data visualization with matplotlib/seaborn.', duration: '10 weeks', fees: '₹22,000'},
    {title: 'DevOps', desc: 'CI/CD, containers and infra as code.', icon: iconDevops, description: 'Learn containers with Docker, orchestration basics, CI/CD with GitHub Actions, infrastructure-as-code using Terraform and observability fundamentals for production systems.', duration: '8 weeks', fees: '₹18,000'},
    {title: 'Cloud Engineering', desc: 'AWS/GCP fundamentals and projects.', icon: iconCloud, description: 'Cloud fundamentals, compute, storage, networking and managed services on AWS and GCP. Secure architecture patterns and a capstone deployment project.', duration: '10 weeks', fees: '₹20,000'},
  ]

  const nonTech = [
    {title: 'Communication Skills', desc: 'Presentation, writing and storytelling.', icon: iconComm, description: 'Practical sessions on presentation structure, public speaking techniques, persuasive writing, and storytelling for interviews and workplace communication.', duration: '6 weeks', fees: '₹8,000'},
    {title: 'Career Coaching', desc: 'Resume, interview prep and negotiation.', icon: iconCareer, description: 'Personalized resume review, mock interviews with feedback, job-search strategy and salary negotiation tactics.', duration: '4 weeks', fees: '₹6,000'},
    {title: 'Product Management', desc: 'Roadmaps, stakeholders and metrics.', icon: iconPM, description: 'Product discovery, user research, roadmaps, prioritization frameworks and working effectively with design & engineering teams.', duration: '8 weeks', fees: '₹12,000'},
    {title: 'Design Thinking', desc: 'User research and prototyping.', icon: iconDesign, description: 'Hands-on user research, ideation, rapid prototyping and usability testing to create user-centered products.', duration: '6 weeks', fees: '₹9,000'},
    {title: 'Makeup Artistry', desc: 'Beauty, bridal and editorial makeup.', icon: iconMakeup, description: 'Techniques for day, evening and bridal makeup, color theory, skin prep and hygiene, and portfolio building with live models.', duration: '6 weeks', fees: '₹10,000'},
    {title: 'Interior Designing', desc: 'Fundamentals of interior design.', icon: iconInterior, description: 'Space planning, color & material selection, basic CAD/layouts, and creating design concepts for residential and small commercial spaces.', duration: '10 weeks', fees: '₹15,000'},
    {title: 'Digital Marketing', desc: 'SEO, ads, content and analytics.', icon: iconDM, description: 'SEO fundamentals, paid ads (Google/Facebook), content strategy, email marketing and analytics to run measurable campaigns.', duration: '8 weeks', fees: '₹12,000'},
    {title: 'Foreign Language (Spanish)', desc: 'Conversational Spanish for work.', icon: iconLang, description: 'Beginner-to-intermediate Spanish focusing on workplace conversation, reading job-related materials and practical exercises.', duration: '12 weeks', fees: '₹9,000'},
    {title: 'Tally (Accounting)', desc: 'Tally ERP basics for accounts.', icon: iconTally, description: 'Accounting fundamentals using Tally ERP: vouchers, ledgers, GST-ready invoicing and basic financial reports.', duration: '6 weeks', fees: '₹7,000'},
    {title: 'Photography', desc: 'Digital photography and editing.', icon: iconPhoto, description: 'Camera fundamentals, composition, lighting, and post-processing basics using Lightroom/Photoshop.', duration: '6 weeks', fees: '₹11,000'},
    {title: 'Baking & Pastry', desc: 'Foundations of baking.', icon: iconBaking, description: 'Bread, cakes and pastries fundamentals, recipes, techniques and food safety with hands-on kitchen practice.', duration: '8 weeks', fees: '₹12,000'},
    {title: 'Fashion Design', desc: 'Basics of apparel design and draping.', icon: iconFashion, description: 'Sketching, pattern making, basic sewing and portfolio development for fashion beginners.', duration: '10 weeks', fees: '₹14,000'},
  ]

  const [selectedCourse, setSelectedCourse] = React.useState(null)

  function viewCourse(c){
    setSelectedCourse(c)
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Courses</h2>

        <h3>Tech Courses</h3>
        <div className="grid">
          {tech.map(c => (
            <div key={c.title} className="card course">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                {c.icon && <img src={c.icon} alt="" style={{width:48,height:48,borderRadius:8}} />}
                <div>
                  <h3 style={{margin:0}}>{c.title}</h3>
                  <p style={{margin:4,fontSize:13,color:'var(--muted)'}}>{c.desc}</p>
                </div>
              </div>
              <div style={{marginTop:8,display:'flex',justifyContent:'flex-end'}}>
                <button className="btn ghost" onClick={()=>viewCourse(c)}>View Course</button>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{marginTop:24}}>Non‑Tech Courses</h3>
        <div className="grid">
          {nonTech.map(c => (
            <div key={c.title} className="card course">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                {c.icon && <img src={c.icon} alt="" style={{width:48,height:48,borderRadius:8}} />}
                <div>
                  <h3 style={{margin:0}}>{c.title}</h3>
                  <p style={{margin:4,fontSize:13,color:'var(--muted)'}}>{c.desc}</p>
                </div>
              </div>
              <div style={{marginTop:8,display:'flex',justifyContent:'flex-end'}}>
                <button className="btn ghost" onClick={()=>viewCourse(c)}>View Course</button>
              </div>
            </div>
          ))}
        </div>
        {selectedCourse && (
          <div className="modal-backdrop" onClick={()=>setSelectedCourse(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>{selectedCourse.title}</h3>
              <p style={{marginTop:8}}>{selectedCourse.description}</p>
              <div style={{display:'flex',gap:12,marginTop:12}}>
                <div><strong>Duration:</strong> {selectedCourse.duration}</div>
                <div><strong>Fees:</strong> {selectedCourse.fees}</div>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16}}>
                <button className="btn ghost" onClick={()=>setSelectedCourse(null)}>Close</button>
                <button className="btn primary" onClick={()=>{alert('Enrolment requested (demo)'); setSelectedCourse(null)}}>Enrol</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
