import React, {useState} from 'react'

import MernIcon from '../assets/icon-community-mern.svg'
import MakeupIcon from '../assets/icon-community-makeup.svg'
import DataIcon from '../assets/icon-community-data.svg'

const SAMPLE = [
  {name: 'MERN Stack Community', desc: 'React, Node, Express and MongoDB projects and help.', icon: MernIcon},
  {name: 'Makeup Artist Circle', desc: 'Portfolio building, clients and workshops.', icon: MakeupIcon},
  {name: 'Data Science Builders', desc: 'Kaggle projects, mentorship and study groups.', icon: DataIcon},
]

export default function Community(){
  const [joinMsg, setJoinMsg] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [teamSize, setTeamSize] = useState(1)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState(null)

  function join(name){
    setSelectedCommunity(name)
    setConfirmOpen(true)
  }

  function confirmJoin(){
    setConfirmOpen(false)
    setJoinMsg(`Request sent to join ${selectedCommunity} (demo)`)
    setSelectedCommunity(null)
    setTimeout(()=>setJoinMsg(''),3000)
  }

  function tryCreate(){
    if(teamSize >= 11){
      setJoinMsg('Community created successfully (demo).')
      setCreateOpen(false)
      setTimeout(()=>setJoinMsg(''),3000)
    } else {
      setJoinMsg('To create a community you need at least 11 team members.')
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Community</h2>
        <p style={{color:'var(--muted)'}}>Join topic-based communities to collaborate, learn and find opportunities.</p>

        <div className="community-list" style={{marginTop:16}}>
          {SAMPLE.map(c => (
            <div key={c.name} className="card community-card">
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <img src={c.icon} alt="" style={{width:44,height:44,borderRadius:8}} />
                <div>
                  <h4 style={{margin:0}}>{c.name}</h4>
                  <p className="muted" style={{margin:'6px 0 0'}}>{c.desc}</p>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <button className="btn primary" onClick={()=>join(c.name)}>Join</button>
                <button className="btn ghost" onClick={()=>alert('Opened community (demo)')}>View</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:20,display:'flex',gap:12,alignItems:'center'}}>
          <button className="btn primary" onClick={()=>setCreateOpen(true)}>Create Community</button>
          <div style={{color:'var(--muted)'}}>Note: creation requires a team of 11 members.</div>
        </div>

        {joinMsg && <div style={{marginTop:12,color: 'var(--accent)'}}>{joinMsg}</div>}

        {createOpen && (
          <div className="modal-backdrop" onClick={()=>setCreateOpen(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>Create Community</h3>
              <div className="form">
                <label>Team size</label>
                <input type="number" value={teamSize} onChange={e=>setTeamSize(Number(e.target.value))} min={1} />
                <label>Community name</label>
                <input type="text" placeholder="e.g. AI Enthusiasts" />
                <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                  <button className="btn ghost" onClick={()=>setCreateOpen(false)}>Cancel</button>
                  <button className="btn primary" onClick={tryCreate}>Create</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {confirmOpen && (
          <div className="modal-backdrop" onClick={()=>setConfirmOpen(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>Join {selectedCommunity}</h3>
              <p className="muted">Are you sure you want to send a join request to this community?</p>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
                <button className="btn ghost" onClick={()=>setConfirmOpen(false)}>Cancel</button>
                <button className="btn primary" onClick={confirmJoin}>Confirm</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
