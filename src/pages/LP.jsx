import React, { useState, useEffect } from "react";
import "../assets/css/NULPage.css";
import "../assets/css/uni-pages.css";

// Image imports
import LP1 from "../assets/images/fk1.jpg";
import LP2 from "../assets/images/Fokothi-Logo.png";
import LP3 from "../assets/images/lp2.jpg";
import LP4 from "../assets/images/lp.jpg";

export default function LPPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeFaculty, setActiveFaculty] = useState("Engineering & Tech");
  const [scrollPosition, setScrollPosition] = useState(0);

  const faculties = {
    "Engineering & Tech": ["Civil Engineering", "Mechanical", "Automotive Technology"],
    Business: ["Accounting", "Marketing", "HR Management"],
    "Hospitality & Tourism": ["Hotel Management", "Tourism Studies"],
    ICT: ["Computer Networking", "Software Development", "Database Admin"]
  };

  // Scroll listener for animations & sticky CTA
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper for staggered fade-in
  const fadeDelay = (index) => ({ animationDelay: `${0.2 + index * 0.15}s` });

  return (
    <main className="nul-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <img src={LP1} alt="Lerotholi Polytechnic" className="hero-image" />
          <div className="hero-overlay">
            <h1 className="hero-title">
              Explore <span className="top-highlight">Lerotholi Polytechnic</span>
            </h1>
            <p className="hero-sub">
              Technical excellence and practical skills training in Maseru.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary sticky-cta" onClick={() => setShowApplyModal(true)}>
                Apply Now
              </button>
              <a href="#campus-facts" className="btn btn-outline">View Facts</a>
            </div>
          </div>
        </div>

        {/* Hero Gallery with staggered fade-in */}
        <div className="hero-gallery">
          {[LP2, LP3, LP4].map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Campus gallery ${idx + 1}`}
              style={fadeDelay(idx)}
              className="fade-slide-up"
            />
          ))}
        </div>
      </section>

      {/* QUICK FACTS */}
      <section id="campus-facts" className="quick-facts fade-slide-up">
        <h2 className="section-title">Quick Facts</h2>
        <div className="facts-grid">
          <div className="fact-card hover-zoom">
            <h3>Location</h3>
            <p>Maseru, Lesotho</p>
          </div>
          <div className="fact-card hover-zoom">
            <h3>Established</h3>
            <p>1905</p>
          </div>
          <div className="fact-card hover-zoom">
            <h3>Students</h3>
            <p>5,000+</p>
          </div>
          <div className="fact-card hover-zoom">
            <h3>Graduate Employment</h3>
            <p>~87% within 6 months</p>
          </div>
        </div>
      </section>

      {/* FACULTIES & COURSES */}
      <section className="faculties fade-slide-up">
        <h2 className="section-title">Featured Faculties</h2>
        <div className="faculty-controls">
          {Object.keys(faculties).map((f) => (
            <button
              key={f}
              className={`faculty-btn ${activeFaculty === f ? "active" : ""}`}
              onClick={() => setActiveFaculty(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="faculty-content">
          <div className="faculty-list hover-zoom">
            <h3>{activeFaculty}</h3>
            <ul>
              {faculties[activeFaculty].map((c) => <li key={c}>• {c}</li>)}
            </ul>
            <p className="faculty-note">
              Admissions criteria vary by program — check program pages for details.
            </p>
          </div>

          <div className="faculty-features hover-zoom">
            <h4>Why study here?</h4>
            <ul>
              <li>Hands-on labs & practical workshops</li>
              <li>Industry partnerships & internships</li>
              <li>Modern lecture halls & online resources</li>
            </ul>
            <button className="btn btn-secondary" onClick={() => setShowApplyModal(true)}>
              Start Application
            </button>
          </div>
        </div>
      </section>

      {/* STUDENT LIFE */}
      <section className="student-life fade-slide-up">
        <h2 className="section-title">Student Life & Activities</h2>
        <div className="life-grid">
          <article className="hover-zoom">
            <h4>Clubs & Societies</h4>
            <p>Engineering clubs, Debate, Robotics, Entrepreneurship, Sports teams.</p>
          </article>
          <article className="hover-zoom">
            <h4>Sports</h4>
            <p>Football, basketball, athletics, intramurals, and competitions.</p>
          </article>
          <article className="hover-zoom">
            <h4>Events</h4>
            <p>Career fairs, tech expos, cultural festivals, and competitions.</p>
          </article>
          <article className="hover-zoom">
            <h4>Support</h4>
            <p>Career services, counselling, and student housing guidance.</p>
          </article>
        </div>
      </section>

      {/* ADMISSIONS */}
      <section className="admissions fade-slide-up">
        <h2 className="section-title">Admissions & Entry Requirements</h2>
        <div className="admissions-grid">
          <div className="admissions-card hover-zoom">
            <h3>Undergraduate</h3>
            <ul>
              <li>Maths & Science at credit level for most technical programs</li>
              <li>Program-specific requirements</li>
              <li>International applicants: certified transcripts + proof of English</li>
            </ul>
          </div>
          <div className="admissions-card hover-zoom">
            <h3>Fees & Scholarships</h3>
            <p>Local and international tuition tiers apply. Merit-based scholarships available.</p>
            <p className="muted">Contact admissions for the latest fee schedule.</p>
          </div>
          <div className="admissions-card hover-zoom">
            <h3>Intakes</h3>
            <p>Main intakes: January & August. Some programs have additional intakes.</p>
          </div>
        </div>
      </section>

      {/* CONTACT & CTA */}
      <section className="contact-cta fade-slide-up">
        <div className="contact-card hover-zoom">
          <h3>Contact Admissions</h3>
          <p>Email: <a href="mailto:admissions@lp.ac.ls">admissions@lp.ac.ls</a></p>
          <p>Phone: +266 XXX XXX</p>
          <p>Address: Maseru Campus, Lesotho</p>
        </div>

        <div className="cta-card hover-zoom">
          <h3>Ready to join LP?</h3>
          <p>Get personalized guidance and start your application today.</p>
          <div className="cta-actions">
            <button className="btn btn-primary sticky-cta" onClick={() => setShowApplyModal(true)}>Apply Now</button>
            <a href="#campus-facts" className="btn btn-outline">Request Info</a>
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section className="purpose fade-slide-up">
        <h3>Purpose of this page</h3>
        <p>
          This page showcases Lerotholi Polytechnic’s programs, student life, and admissions info 
          with a modern interactive experience for prospective students.
        </p>
      </section>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <div className="modal-backdrop" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowApplyModal(false)}>×</button>
            <h3>Apply — Quick Start</h3>
            <p>We'll send you the application link and requirements.</p>
            <form className="apply-form" onSubmit={(e) => { e.preventDefault(); alert("Application request sent!"); setShowApplyModal(false); }}>
              <label>
                Full name
                <input required type="text" name="name" />
              </label>
              <label>
                Email
                <input required type="email" name="email" />
              </label>
              <label>
                Interested program
                <input type="text" name="program" />
              </label>
              <div className="modal-actions">
                <button className="btn btn-primary" type="submit">Request Link</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowApplyModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
