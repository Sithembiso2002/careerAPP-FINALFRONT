import React, { useState } from "react";
import "../assets/css/NULPage.css";
import "../assets/css/uni-pages.css";


/* Image imports — update paths if needed */
import NUL1 from "../assets/images/nul 1.jpg";
import NULAdmin from "../assets/images/National_University_of_Lesotho_Administration_Block.jpg";
import NUL2 from "../assets/images/nul2.jpg";

export default function NULPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeFaculty, setActiveFaculty] = useState("Science & Tech");

  const faculties = {
    "Science & Tech": [
      "Computer Science",
      "Mathematics",
      "Physics",
      "Biotechnology"
    ],
    Law: ["LLB (Law)", "Diploma in Law"],
    Agriculture: ["Crop Science", "Animal Science", "Agri Economics"],
    Education: ["Primary Education", "Secondary Teaching"]
  };

  return (
    <main className="nul-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <img src={NUL1} alt="NUL campus" className="hero-image" />
          <div className="hero-overlay">
            <h1 className="hero-title">
              Explore <span className="top-highlight">National University</span> of Lesotho
            </h1>
            <p className="hero-sub">
              Academic excellence, research leadership, and vibrant student life in Roma.
            </p>

            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
                Apply Now
              </button>
              <a href="#campus-facts" className="btn btn-outline">View Facts</a>
            </div>
          </div>
        </div>

        <div className="hero-gallery">
          <img src={NULAdmin} alt="Administration" />
          <img src={NUL2} alt="Lecture hall" />
        </div>
      </section>

      {/* QUICK FACTS */}
      <section id="campus-facts" className="quick-facts">
        <h2 className="section-title">Quick Facts</h2>
        <div className="facts-grid">
          <div className="fact-card">
            <h3>Location</h3>
            <p>Roma, Maseru District</p>
          </div>
          <div className="fact-card">
            <h3>Established</h3>
            <p>1945</p>
          </div>
          <div className="fact-card">
            <h3>Students</h3>
            <p>10,000+ (All campuses)</p>
          </div>
          <div className="fact-card">
            <h3>Graduate Employment</h3>
            <p>~94% within 6 months</p>
          </div>
        </div>
      </section>

      {/* FACULTIES & COURSES */}
      <section className="faculties">
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
          <div className="faculty-list">
            <h3>{activeFaculty}</h3>
            <ul>
              {faculties[activeFaculty].map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
            <p className="faculty-note">
              Admissions criteria vary by program — check program pages for details.
            </p>
          </div>

          <div className="faculty-features">
            <h4>Why study here?</h4>
            <ul>
              <li>Hands-on labs & research projects</li>
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
      <section className="student-life">
        <h2 className="section-title">Student Life & Activities</h2>
        <div className="life-grid">
          <article>
            <h4>Clubs & Societies</h4>
            <p>Debate, Science Society, Drama, Entrepreneurship, Sports teams.</p>
          </article>
          <article>
            <h4>Sports</h4>
            <p>Football, basketball, netball, athletics and intramural competitions.</p>
          </article>
          <article>
            <h4>Events</h4>
            <p>Career fairs, research symposia, cultural festivals and hackathons.</p>
          </article>
          <article>
            <h4>Support</h4>
            <p>Career services, counselling, disability support & student housing guidance.</p>
          </article>
        </div>
      </section>

      {/* ADMISSIONS */}
      <section className="admissions">
        <h2 className="section-title">Admissions & Entry Requirements</h2>

        <div className="admissions-grid">
          <div className="admissions-card">
            <h3>Undergraduate</h3>
            <ul>
              <li>LGCSE with 5 credits (including English & Maths for most programs)</li>
              <li>Program-specific requirements (e.g., portfolio for creative courses)</li>
              <li>International applicants: certified transcripts + proof of English</li>
            </ul>
          </div>

          <div className="admissions-card">
            <h3>Fees & Scholarships</h3>
            <p>Local and international tuition tiers apply. Merit-based scholarships available.</p>
            <p className="muted">Contact admissions for the latest fee schedule.</p>
          </div>

          <div className="admissions-card">
            <h3>Intakes</h3>
            <p>Main intakes: January & August. Some programs have additional intakes.</p>
          </div>
        </div>
      </section>

      {/* CONTACT & CTA */}
      <section className="contact-cta">
        <div className="contact-card">
          <h3>Contact Admissions</h3>
          <p>Email: <a href="mailto:admissions@nul.ls">admissions@nul.ls</a></p>
          <p>Phone: +266 XXX XXX</p>
          <p>Address: Roma Campus, Maseru District</p>
        </div>

        <div className="cta-card">
          <h3>Ready to join NUL?</h3>
          <p>Get personalized guidance and start your application today.</p>
          <div className="cta-actions">
            <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>Apply Now</button>
            <a href="#campus-facts" className="btn btn-outline">Request Info</a>
          </div>
        </div>
      </section>

      {/* PURPOSE SECTION */}
      <section className="purpose">
        <h3>Purpose of this page</h3>
        <p>
          This page is designed for high-school students exploring higher-education options.
          It visualizes campus life, highlights programs and requirements, and gives clear calls-to-action
          so prospective students can compare options and start the application process.
        </p>
      </section>

      {/* SIMPLE APPLY MODAL */}
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
