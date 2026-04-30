import React, { useEffect, useState } from 'react'
import JobIcon from '../assets/icon-job.svg'

/* COMMON VACANCIES (for non-logged users) */

const commonVacancies = [
{
title:'Software Developer',
company:'TechCorp',
location:'Remote',
tag:'Full-time',
count:12,
desc:'Work on backend systems, APIs and integrations.'
},

{
title:'Frontend Developer',
company:'Designify',
location:'On-site',
tag:'Contract',
count:6,
desc:'Build responsive UI with modern frameworks.'
},

{
title:'Data Analyst',
company:'InsightCo',
location:'Remote',
tag:'Part-time',
count:8,
desc:'Analyze datasets and create dashboards.'
},

{
title:'UI/UX Designer',
company:'PixelStudio',
location:'Hybrid',
tag:'Full-time',
count:4,
desc:'Design modern UI/UX for web and mobile applications.'
},

{
title:'Java Developer',
company:'TCS',
location:'Pune',
tag:'Full-time',
count:7,
desc:'Develop enterprise applications using Java and Spring Boot.'
},

{
title:'Python Developer',
company:'Capgemini',
location:'Bangalore',
tag:'Full-time',
count:5,
desc:'Build scalable backend systems using Python and Django.'
},

{
title:'Cloud Engineer',
company:'Accenture',
location:'Hyderabad',
tag:'Full-time',
count:3,
desc:'Work with AWS cloud infrastructure and DevOps pipelines.'
},

{
title:'Cyber Security Analyst',
company:'SecureTech',
location:'Mumbai',
tag:'Full-time',
count:2,
desc:'Monitor security threats and protect enterprise systems.'
}
]

export default function Vacancies(){

  const [vacancies,setVacancies] = useState([])
  const [selected,setSelected] = useState(null)

  /* CHECK LOGIN */

  const isLoggedIn = localStorage.getItem("token")

  useEffect(()=>{

    /* IF USER LOGGED IN -> FETCH APPROVED VACANCIES */

    if(isLoggedIn){

      fetch("http://localhost:5000/api/vacancy/approved")
      .then(res=>res.json())
      .then(data=>{

        if(data.vacancies){

          const formatted = data.vacancies.map(v=>({

            title: v.field,
            company: v.companyName,
            location: v.location,
            tag: v.timeType,
            count: v.totalVacancies,
            desc: v.description

          }))

          setVacancies(formatted)

        }

      })
      .catch(err=>console.log(err))

    }

    /* IF NOT LOGGED IN -> SHOW COMMON VACANCIES */

    else{

      setVacancies(commonVacancies)

    }

  },[])

  return (

    <section className="section">

      <div className="container">

        <h2>Vacancies</h2>

        <p className="muted">
          Available opportunities
        </p>

      <div className="public-vacancies-grid">
          {vacancies.map((v,i)=>(

            <article key={i} className="public-vacancy-card car">

              <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>

                <img src={JobIcon} alt="job" style={{width:48,height:48}} />

                <div style={{flex:1}}>

                  <h3 style={{margin:0}}>
                    {v.title}
                    <span className="vacancy-count"> {v.count}</span>
                  </h3>

                  <div className="muted">
                    {v.company} · {v.location} · {v.tag}
                  </div>

                </div>

              </div>

              <p className="muted">{v.desc}</p>

              <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}>

                <button
                  className="btn ghost"
                  onClick={()=>setSelected(v)}
                >
                  View Details
                </button>

                {isLoggedIn ? (

                  <button className="btn primary">
                    Apply
                  </button>

                ) : (

                  <button
                    className="btn primary"
                    onClick={()=>alert("Please login to apply")}
                  >
                    Login to Apply
                  </button>

                )}

              </div>

            </article>

          ))}

        </div>

        {selected && (

          <div className="modal-backdrop" onClick={()=>setSelected(null)}>

            <div className="modal" onClick={e=>e.stopPropagation()}>

              <h3>{selected.title}</h3>

              <p className="muted">
                {selected.company} · {selected.location}
              </p>

              <p className="muted">{selected.desc}</p>

              <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>

                <button
                  className="btn ghost"
                  onClick={()=>setSelected(null)}
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </section>

  )

}