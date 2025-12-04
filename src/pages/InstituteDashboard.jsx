import React, { useState, useEffect } from 'react';
import "../assets/css/InstituteDashboard.css";
import "../assets/css/ind.css";
import { useNavigate } from "react-router-dom";
// Import images from the assets folder
import NUL1 from "../assets/images/nul 1.jpg";
import Limkokwing from "../assets/images/limkokwing-malaysia.jpg";
import NULAdmin from "../assets/images/National_University_of_Lesotho_Administration_Block.jpg";
import NUL2 from "../assets/images/nul_logo.jpg";
import botho from "../assets/images/Blogo1.png";
import LUCT2 from "../assets/images/llogo.jpg";
import LPImage from "../assets/images/Fokothi-Logo.png"; // example – replace with your real LP image

//extra slides
import LUCT from "../assets/images/l9.jpg";
import LUCT3 from "../assets/images/limkos1.jpg";
import LUCT4 from "../assets/images/l15.jpg";
import LUCT6 from "../assets/images/l5.jpg";
import LUCT5 from "../assets/images/l12.jpg";

import LUCT7 from "../assets/images/N6.JPG";
import LUCT8 from "../assets/images/N2.JPG";
import LUCT9 from "../assets/images/N.jpg";
import LUCT10 from "../assets/images/u11.jpg";
import LUCT11 from "../assets/images/b5.jpg";



export default function InstituteDashboard() {

  const [searchQuery, setSearchQuery] = useState("");
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const navigate = useNavigate();
  const goToApplicationsManagement = () => {
  navigate("/applications-management");
};

   const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("institute");
    window.location.href = "/institute/login";
  };

  const universities = [
    {
  name: "National University of Lesotho",
  location: "Roma, Lesotho",
  courses: ["Computer Science", "Law", "Agriculture", "Education"],
  rating: 5,
  activities: ["Debate Club", "Science Society", "Sports Teams"],
  performance: "Top Academic Research Institution",
  successRate: "94% Graduate Employment",
  description: "A leading academic institution offering diverse academic programs and strong research initiatives.",
  requirements: "LGCSE with 5 credits including English & Maths",
  video: "https://videos.pexels.com/video-files/3183101/3183101-hd_1920_1080_24fps.mp4",

  // 👇 NEW FIELD
  image: NUL2
}
,
    {
      name: "Limkokwing University of Creative Technology",
      location: "Maseru, Lesotho",
      courses: ["Graphic Design", "Multimedia", "IT", "Broadcasting"],
      rating: 5,
      activities: ["Fashion Shows", "Music Studio", "Startup Hub"],
      performance: "Top Ranked Creative Innovation Hub",
      successRate: "91% Creative Industry Placement",
      description: "A global creative university empowering innovators and professionals.",
      requirements: "Portfolio may be required for creative programs",
      video: "https://videos.pexels.com/video-files/2703651/2703651-hd_1920_1080_24fps.mp4",
      image:LUCT2,
    },
    {
  name: "Lerotholi Polytechnic",
  location: "Maseru, Lesotho",
  courses: ["Engineering", "Building Construction", "Automotive Technology"],
  rating: 4,
  activities: ["Technical Clubs", "Engineering Competitions"],
  performance: "Strong Technical & Engineering Programs",
  successRate: "87% Technical Placement",
  description: "Well-known for producing top-tier technicians and engineers.",
  requirements: "Maths & Science at Credit Level",
  video: "https://videos.pexels.com/video-files/4220882/4220882-hd_1920_1080_25fps.mp4",

  // 👇 NEW FIELD FOR THE IMAGE
  image: LPImage
}
,
    {
      name: "Botho University",
      location: "Maseru, Lesotho",
      courses: ["Business", "IT", "Education", "Hospitality"],
      rating: 4,
      activities: ["Business Clubs", "Events Organizing Teams"],
      performance: "Leading ICT & Business Institution",
      successRate: "89% Job Placement",
      description: "A modern, student-focused university with international standards.",
      requirements: "At least 4 credits including English",
      video: "https://videos.pexels.com/video-files/3199756/3199756-hd_1920_1080_24fps.mp4",
      image: botho
    }
  ];

  const filteredUniversities = universities.filter((uni) =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add to compare list
  const toggleCompare = (uni) => {
    if (compareList.some(item => item.name === uni.name)) {
      setCompareList(compareList.filter(item => item.name !== uni.name));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, uni]);
      }
    }
  };

  

  const goToUniversityPage = (uni) => {
  if (uni.name === "National University of Lesotho") {
    navigate("/NUL");
  } 
  else if (uni.name === "Limkokwing University of Creative Technology") {
    navigate("/LUCT");
  }
  else if (uni.name === "Lerotholi Polytechnic") {
    navigate("/LP");
  }
  else if (uni.name === "Botho University") {
    navigate("/BU");
  }
};

const goToAllInstitutions = () => {
  navigate("/all-institutions");
};





  return (
    <div className="dashboard-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 class="site-title">
  Explore Our <span class="top-highlight">Top</span> Institutes:
</h1>

      <button className="apply-btn" onClick={goToApplicationsManagement}>
        PUBLISH ADMISSIONS
      </button>  
          </nav>

          <button
            className="profilebtn"
            onClick={openProfileModal}
          >
            Profile
          </button>

      {/* TOP IMAGE SLIDER */}
<div className="top-slider">
  <div className="slide-track">
    <img src={NUL1} alt="NUL" className="slide-image" />
    <img src={Limkokwing} alt="Limkokwing" className="slide-image" />
    <img src={NULAdmin} alt="NUL Admin" className="slide-image" />
    <img src={NUL2} alt="NUL 2" className="slide-image" />

    {/* Duplicate for seamless loop */}
    <img src={LUCT} alt="NUL" className="slide-image" />
    <img src={LUCT3} alt="Limkokwing" className="slide-image" />
    <img src={LUCT4} alt="NUL Admin" className="slide-image" />
    <img src={LUCT5} alt="NUL 2" className="slide-image" />
    <img src={LUCT6} alt="NUL" className="slide-image" />
    <img src={LUCT7} alt="Limkokwing" className="slide-image" />
    <img src={LUCT8} alt="NUL Admin" className="slide-image" />
    <img src={LUCT9} alt="NUL 2" className="slide-image" />
    <img src={LUCT10} alt="NUL Admin" className="slide-image" />
    <img src={LUCT11} alt="NUL 2" className="slide-image" />
  </div>
</div>


      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search institutions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* UNIVERSITIES LIST */}
      <div className="universities-grid">
        {filteredUniversities.map((uni, index) => (
          <div key={index} className="university-card fade-in">
             
             

            {/* TOP IMAGE WITH TITLE OVERLAY */}
              {uni.image && (
                <div className="uni-image-wrapper">
                  <img
                    src={uni.image}
                    alt={uni.name}
                    className="uni-top-image"
                  />

                  <div className="uni-image-overlay">
                    <h2>{uni.name}</h2>
                  </div>
                </div>
              )}





            {/* VIDEO BANNER */}
            <video
              className="video-banner"
              autoPlay
              muted
              loop
              playsInline
              src={uni.video}
            />

            

            <div className="university-content">
              <h2 className="uni-title">{uni.name}</h2>
              <p className="location">📍 {uni.location}</p>
              <p className="rating">{"⭐".repeat(uni.rating)}</p>

              <p><strong>Top Courses:</strong> {uni.courses.slice(0,3).join(", ")}...</p>
              <p><strong>Success Rate:</strong> {uni.successRate}</p>
              <p className="description">{uni.description}</p>

              <div className="actions">
                <button 
                  className="btn-details"
                  onClick={() => goToUniversityPage(uni)}
                >
                  View More
                </button>

                <button className="btn-apply">Publish</button>
                <button
                  className={`btn-compare ${compareList.some(item => item.name === uni.name) ? "active" : ""}`}
                  onClick={() => toggleCompare(uni)}
                >
                  Compare
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMPARE MODAL */}
      {showCompareModal && (
        <div className="compare-modal">
          <div className="modal-content slide-up">
            <h2>Compare Institutions</h2>
            <button className="close-btn" onClick={() => setShowCompareModal(false)}>×</button>

            <div className="compare-grid">
              {compareList.map((uni, index) => (
                <div key={index} className="compare-card">
                  <h3>{uni.name}</h3>
                  <p><strong>Location:</strong> {uni.location}</p>
                  <p><strong>Courses:</strong> {uni.courses.length}</p>
                  <p><strong>Rating:</strong> {"⭐".repeat(uni.rating)}</p>
                  <p><strong>Success:</strong> {uni.successRate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OPEN COMPARE BUTTON */}
      {compareList.length > 0 && (
        <button className="open-compare-btn" onClick={() => setShowCompareModal(true)}>
          Compare ({compareList.length})
        </button>
      )}

        <nav>
  <button 
    className="btn-view" 
    onClick={goToAllInstitutions}
    style={{
      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    }}
  >
    OTHER ADDED INSTITUTIONS <span style={{ fontSize: '20px' }}>⋙</span>
  </button>
</nav>



    </div>
  );
}
