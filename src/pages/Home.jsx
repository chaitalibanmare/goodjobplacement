import React from 'react'

const HERO_IMG = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'

export default function Home({onOpenLogin}){
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1>Find the <span className="accent">best opportunities</span>. Fast.</h1>
          <p>GoodJobPlacement connects learners to top companies, tracks placement activity and offers curated courses to launch careers.</p>
          <div className="hero-cta">
            <button className="btn primary" onClick={() => onOpenLogin && onOpenLogin('user')}>Get Started</button>
            <button className="btn ghost">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <img src={HERO_IMG} alt="Hero" className="illustration" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Highlights</h2>
          <div className="grid">
              <div className="card highlight-card">
                <div className="highlight-icon">💼</div>
                <h3 style={{margin:'6px 0'}}>Curated job matches</h3>
                <p className="muted">Get matched with roles that fit your profile and goals.</p>
              </div>
              <div className="card highlight-card">
                <div className="highlight-icon">📈</div>
                <h3 style={{margin:'6px 0'}}>Live placement tracker</h3>
                <p className="muted">Track applications and offers in a single dashboard.</p>
              </div>
              <div className="card highlight-card">
                <div className="highlight-icon">🤝</div>
                <h3 style={{margin:'6px 0'}}>Mentorship & mock interviews</h3>
                <p className="muted">1:1 mocks and mentor feedback to help you convert interviews.</p>
              </div>
          </div>
        </div>
      </section>
    </>
  )
}
