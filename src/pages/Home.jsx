import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InternIcon from '../assets/icon-internship.svg'
import SoftIcon from '../assets/icon-softskills.svg'
import MgmtIcon from '../assets/icon-management.svg'
import IeltsIcon from '../assets/icon-ielts.svg'

import slider1 from '../assets/image1.jpeg'
import slider2 from '../assets/image2.jpeg'
import slider3 from '../assets/image3.jpeg'
import slider4 from '../assets/image4.jpeg'

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

export default function Home({ onOpenLogin }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    slider1,
    slider2,
    slider3,
    slider4
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-wrapper">
      {/* 1. Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-badge">💼 Empowering Future Leaders</div>
          <h1 className="home-hero-title">
            Find the Right Job,<br /><span className="home-hero-highlight">Right Now.</span>
          </h1>
          <p className="home-hero-subtitle">
            GoodJobPlacement is your all-in-one career acceleration platform. Master in-demand skills, track your placement activity, and get hired by world-class organizations.
          </p>

          <div className="home-hero-search">
            <div className="search-input">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Job title, skill, or keyword" />
            </div>
            <div className="search-divider"></div>
            <div className="search-input">
              <span className="search-icon">📍</span>
              <input type="text" placeholder="Remote or City" />
            </div>
            <button className="btn primary search-btn" onClick={() => navigate('/vacancies')}>Find Now</button>
          </div>
        </div>
        <div className="home-hero-visual">
          <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            {sliderImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Slide ${idx + 1}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: currentSlide === idx ? 1 : 0,
                  transition: 'opacity 1s ease-in-out'
                }}
                onError={(e) => {
                  const fallbacks = [
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  ];
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbacks[idx];
                }}
              />
            ))}
          </div>
          <div className="hero-stat-card">
            <div className="stat-icon-up">↗</div>
            <div>
              <div className="stat-label">Skill Growth</div>
              <div className="stat-value">+124% this month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Removed Brands Section as per user request */}

      {/* 3. Core Pillars */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Opportunities</h2>
            <p className="section-subtitle">Strategic directions curated for the current global market.</p>
          </div>
          <a href="#" className="explore-all" onClick={(e) => { e.preventDefault(); navigate('/vacancies'); }}>Explore All Vacancies →</a>
        </div>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">💼</div>
            <h3>Vacancies</h3>
            <p>Explore thousands of open roles, from entry-level to executive leadership positions.</p>
            <a href="#" className="pillar-link" onClick={(e) => { e.preventDefault(); navigate('/vacancies'); }}>2.4k+ Open Roles ↗</a>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">🎓</div>
            <h3>Courses</h3>
            <p>Master new skills with expert-led courses designed for digital products and tech.</p>
            <a href="#" className="pillar-link" onClick={(e) => { e.preventDefault(); navigate('/courses'); }}>1.8k+ Open Courses ↗</a>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">📈</div>
            <h3>Placement</h3>
            <p>Performance tracking, mentorship, and analytics-driven growth for your career.</p>
            <a href="#" className="pillar-link" onClick={(e) => { e.preventDefault(); navigate('/placement-activity'); }}>View Activities ↗</a>
          </div>
        </div>
      </section>

      {/* 4. Stats Banner */}
      <section className="home-stats">
        <div className="stat-box">
          <div className="stat-number">50K+</div>
          <div className="stat-desc">Active Learners</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">1.2K+</div>
          <div className="stat-desc">Global Partners</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">95%</div>
          <div className="stat-desc">Success Rate</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">$85k</div>
          <div className="stat-desc">Avg. Salary Jump</div>
        </div>
      </section>

      {/* 5. Featured Courses */}
      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">Featured Learning Tracks</h2>
          <a href="#" className="explore-all" onClick={(e) => { e.preventDefault(); navigate('/courses'); }}>See all courses</a>
        </div>
        <div className="courses-grid">
          <div className="course-card">
            <div className="course-image">
              <span className="course-badge">Best Seller</span>
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Design Systems" />
            </div>
            <div className="course-content">
              <div className="course-meta">DESIGN • 12 Modules</div>
              <h3 className="course-title">Mastering Design Systems for SaaS</h3>
              <div className="course-footer">
                <div className="course-rating">⭐ 4.9 <span className="text-muted">(1.2k)</span></div>
                <div className="course-price">$199</div>
              </div>
            </div>
          </div>
          <div className="course-card">
            <div className="course-image">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Data Science" />
            </div>
            <div className="course-content">
              <div className="course-meta">DATA SCIENCE • 15 Modules</div>
              <h3 className="course-title">Advanced Data Visualization with Python</h3>
              <div className="course-footer">
                <div className="course-rating">⭐ 4.8 <span className="text-muted">(950)</span></div>
                <div className="course-price">$249</div>
              </div>
            </div>
          </div>
          <div className="course-card">
            <div className="course-image">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Marketing" />
            </div>
            <div className="course-content">
              <div className="course-meta">MARKETING • 8 Modules</div>
              <h3 className="course-title">Growth Hacking Strategies for 2024</h3>
              <div className="course-footer">
                <div className="course-rating">⭐ 4.7 <span className="text-muted">(2.1k)</span></div>
                <div className="course-price">$149</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Top Vacancies */}
      <section className="home-section top-hiring-section">
        <div className="section-header">
          <h2 className="section-title">Top Hiring Positions</h2>
          <a href="#" className="explore-all" onClick={(e) => { e.preventDefault(); navigate('/vacancies'); }}>Explore all jobs</a>
        </div>
        <div className="jobs-list">
          <div className="job-row">
            <div className="job-icon">🚀</div>
            <div className="job-info">
              <h3>Senior Frontend Engineer</h3>
              <p>TechNova Global • Remote</p>
            </div>
            <div className="job-tags">
              <span className="job-tag">Full-time</span>
              <span className="job-tag highlight">$120k - $150k</span>
            </div>
            <button className="btn job-btn" onClick={() => navigate('/vacancies')}>Apply</button>
          </div>
          <div className="job-row">
            <div className="job-icon">📊</div>
            <div className="job-info">
              <h3>Lead Product Manager</h3>
              <p>FinEdge Solutions • Hybrid (London)</p>
            </div>
            <div className="job-tags">
              <span className="job-tag">Full-time</span>
              <span className="job-tag highlight">$130k - $160k</span>
            </div>
            <button className="btn job-btn" onClick={() => navigate('/vacancies')}>Apply</button>
          </div>
        </div>
      </section>

      {/* 7. Features (Replacing CTA) */}
      <section className="home-section" style={{ backgroundColor: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="section-header">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">A focused set of offerings to boost employability and career growth.</p>
        </div>
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ flexShrink: 0, width: '48px', height: '48px', backgroundColor: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <img src={f.icon} alt="" style={{ width: '24px', height: '24px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#111', fontWeight: '600' }}>{f.title}</h4>
                <p style={{ margin: 0, fontSize: '15px', color: '#64748b', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
              <button
                className="btn ghost"
                style={{ padding: '8px 16px', fontSize: '13px', alignSelf: 'center', flexShrink: 0 }}
                onClick={() => navigate('/features')}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
