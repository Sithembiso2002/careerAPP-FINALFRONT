import React, { useState } from "react";
import "../assets/css/NULPage.css";
import "../assets/css/uni-pages.css";

/* Image imports — update paths if needed */
import LUCTMain from "../assets/images/l9.jpg"; // main hero image
import LUCTGallery1 from "../assets/images/l15.jpg";
import LUCTGallery2 from "../assets/images/l12.jpg";
import LUCTLogo from "../assets/images/llogo.jpg";

export default function LUCT() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeFaculty, setActiveFaculty] = useState("Creative Arts");

  const faculties = {
    "Creative Arts": ["Graphic Design", "Multimedia", "Animation", "Fashion Design"],
    IT: ["Software Dev", "Networking", "Cyber Security", "AI & Robotics"],
    Business: ["Entrepreneurship", "Marketing", "Finance & Accounting"],
    Communication: ["Broadcasting", "Journalism", "Public Relations"]
  };

  return (
    <main className="nul-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-media fade-slide-up">
          <img src={LUCTMain} alt="LUCT campus" className="hero-image" />
          <div className="hero-overlay fade-slide-up fade-slide-up-delay">
            <h1 className="hero-title">
              Explore <span className="top-highlight">Limkokwing University</span> of Creative Technology
            </h1>
            <p className="hero-sub">
              Innovation, creativity, and global connections — study at the forefront of creative education.
            </p>

            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
                Apply Now
              </button>
              <a href="#campus-facts" className="btn btn-outline">View Facts</a>
            </div>
          </div>
        </div>

        <div className="hero-gallery fade-slide-up fade-slide-up-delay">
          <img src={LUCTGallery1} alt="Campus gallery 1" />
          <img src={LUCTGallery2} alt="Campus gallery 2" />
          <img src={LUCTLogo} alt="Campus gallery 3" />
        </div>
      </section>

      {/* QUICK FACTS */}
      <section id="campus-facts" className="quick-facts">
        <h2 className="section-title">Quick Facts</h2>
        <div className="facts-grid">
          <div className="fact-card">
            <h3>Location</h3>
            <p>Maseru, Lesotho</p>
          </div>
          <div className="fact-card">
            <h3>Founded</h3>
            <p>1991</p>
          </div>
          <div className="fact-card">
            <h3>Students</h3>
            <p>6,000+ (all campuses)</p>
          </div>
          <div className="fact-card">
            <h3>Creative Placement</h3>
            <p>~91% in industry projects & internships</p>
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
              <li>State-of-the-art creative studios</li>
              <li>Global collaborations & industry mentors</li>
              <li>Workshops, labs, and innovation hubs</li>
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
            <p>Music, Drama, Fashion, Entrepreneurship, Tech & Design communities.</p>
          </article>
          <article>
            <h4>Sports</h4>
            <p>Football, basketball, athletics, and recreational competitions.</p>
          </article>
          <article>
            <h4>Events</h4>
            <p>Innovation expos, fashion shows, design competitions, and hackathons.</p>
          </article>
          <article>
            <h4>Support</h4>
            <p>Career mentorship, counselling, creative portfolio guidance & housing services.</p>
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
              <li>Portfolio & LGCSE/IGCSE with 5 credits (including English & Maths)</li>
              <li>Program-specific requirements for creative courses</li>
              <li>International applicants: certified transcripts & proof of English</li>
            </ul>
          </div>

          <div className="admissions-card">
            <h3>Fees & Scholarships</h3>
            <p>Local and international tuition tiers apply. Merit & creativity-based scholarships available.</p>
            <p className="muted">Contact admissions for current fee schedule.</p>
          </div>

          <div className="admissions-card">
            <h3>Intakes</h3>
            <p>Main intakes: January & July. Some programs have additional intakes.</p>
          </div>
        </div>
      </section>

      {/* CONTACT & CTA */}
      <section className="contact-cta">
        <div className="contact-card">
          <h3>Contact Admissions</h3>
          <p>Email: <a href="mailto:admissions@luct.ls">admissions@luct.ls</a></p>
          <p>Phone: +266 XXX XXX</p>
          <p>Address: Maseru Campus, Lesotho</p>
        </div>

        <div className="cta-card">
          <h3>Ready to join LUCT?</h3>
          <p>Get personalized guidance and start your application today.</p>
          <div className="cta-actions">
            <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>Apply Now</button>
            <a href="#campus-facts" className="btn btn-outline">Request Info</a>
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section className="purpose">
        <h3>Purpose of this page</h3>
        <p>
          This page is for high-school students exploring creative higher-education options.
          It visualizes campus life, highlights programs and requirements, and provides clear CTAs
          to start the application process.
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
