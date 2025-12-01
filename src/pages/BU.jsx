import React, { useState, useEffect } from "react";
import "../assets/css/NULPage.css";
import "../assets/css/uni-pages.css";
import "../assets/css/bu.css";


// Image imports
import BU1 from "../assets/images/OIP-728991345.jpg";
import BU2 from "../assets/images/Blogo.png";
import BU3 from "../assets/images/b5.jpg";
import BU4 from "../assets/images/F2.JPG";

export default function BUPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeFaculty, setActiveFaculty] = useState("Business & ICT");
  const [scrollPosition, setScrollPosition] = useState(0);

  const faculties = {
    "Business & ICT": ["Accounting", "IT Management", "Marketing", "Software Dev"],
    Education: ["Early Childhood", "Primary", "Secondary Teaching"],
    Hospitality: ["Hotel Management", "Tourism", "Culinary Arts"],
    Engineering: ["Civil Engineering", "Electrical Engineering"]
  };

  // Scroll listener for animations & sticky CTA
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeDelay = (index) => ({ animationDelay: `${0.2 + index * 0.15}s` });

  return (
    <main className="nul-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <img src={BU1} alt="Botho University" className="hero-image" />
          <div className="hero-overlay">
            <h1 className="hero-title">
              Explore <span className="top-highlight">Botho University</span>
            </h1>
            <p className="hero-sub">
              Empowering students with industry-ready skills in Maseru.
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
          {[BU2, BU3, BU4].map((img, idx) => (
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
            <p>1997</p>
          </div>
          <div className="fact-card hover-zoom">
            <h3>Students</h3>
            <p>6,000+</p>
          </div>
          <div className="fact-card hover-zoom">
            <h3>Graduate Employment</h3>
            <p>~89% within 6 months</p>
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
              <li>Hands-on labs & workshops</li>
              <li>Industry placements & internships</li>
              <li>Modern lecture halls & e-learning facilities</li>
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
            <p>Debate, ICT Clubs, Entrepreneurship, Sports teams, Cultural clubs.</p>
          </article>
          <article className="hover-zoom">
            <h4>Sports</h4>
            <p>Football, basketball, athletics, netball competitions.</p>
          </article>
          <article className="hover-zoom">
            <h4>Events</h4>
            <p>Career fairs, hackathons, cultural festivals, expos.</p>
          </article>
          <article className="hover-zoom">
            <h4>Support</h4>
            <p>Career guidance, counseling, housing & disability support.</p>
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
              <li>At least 4 credits including English and Maths</li>
              <li>Program-specific requirements</li>
              <li>International applicants: certified transcripts + proof of English</li>
            </ul>
          </div>
          <div className="admissions-card hover-zoom">
            <h3>Fees & Scholarships</h3>
            <p>Tuition fees apply for local & international students. Merit-based scholarships available.</p>
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
          <p>Email: <a href="mailto:admissions@botho.ac.ls">admissions@botho.ac.ls</a></p>
          <p>Phone: +266 XXX XXX</p>
          <p>Address: Maseru Campus, Lesotho</p>
        </div>

        <div className="cta-card hover-zoom">
          <h3>Ready to join Botho University?</h3>
          <p>Start your application and explore career pathways.</p>
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
          This page is designed to help prospective students explore Botho University’s programs,
          campus life, and admissions process with a modern interactive experience.
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
