import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Added import
import "../assets/css/ind.css";
import "../assets/css/styles.css";

// Import images from the assets folder
import NUL1 from "../assets/images/nul 1.jpg";
import Limkokwing from "../assets/images/limkokwing-malaysia.jpg";
import NULAdmin from "../assets/images/National_University_of_Lesotho_Administration_Block.jpg";
import NUL2 from "../assets/images/nul2.jpg";

const HomePage = () => {
  const imageFiles = [NUL1, Limkokwing, NULAdmin, NUL2];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageFiles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Function to get route based on index
  const getRoute = (index) => {
    switch(index) {
      case 0: return "/NUL";
      case 1: return "/LUCT";
      case 2: return "/LP";
      case 3: return "/BU";
      default: return "/";
    }
  };

  // Function to get institution name based on index
  const getInstitutionName = (index) => {
    switch(index) {
      case 0: return "National University of Lesotho";
      case 1: return "Limkokwing University of Creative Technology";
      case 2: return "Lerotholi Polytechnic";
      case 3: return "Botho University";
      default: return "";
    }
  };

  return (
    <div>
      <main>
        <h1 className="fon">
          Welcome to the Career Guidance Web Application
        </h1>

        {/* Slider */}
        <div className="slie">
          <img
            src={imageFiles[currentSlide]}
            alt="Institution Slide"
            style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
          />
          <h3>
            <p className="adv">Institutional Education</p>
          </h3>
        </div>

        <div className="Content">
          <h1>
            Student Plartform & <br />
            <span>Learning Exploration</span> <br />
            Center
          </h1>
        </div>

        <div className="Content">
          <p className="Par">
            Students are supposed to specify their details on the
            <br />
            platform to be able to track their process regarding the admission
            application.
            <br />
            your are adviced to create the login details after you have
            registered on a particular <br />
            university and verify all your details when ever possible.
          </p>
        </div>

        <div className="Content">
          <button className="Reg">
            <a href="/student-application">Apply Now</a>
          </button>
        </div>

        <h3 className="fon2">
          <strong>Find your carrer path to higher education!</strong>
        </h3>
        <p className="par">Click One below to see more...</p>

        <div className="conta">
          {imageFiles.map((img, idx) => (
            <div key={idx} className="box">
              <Link to={getRoute(idx)}>
                <img 
                  src={img} 
                  height="200" 
                  width="250" 
                  alt={getInstitutionName(idx)} 
                />
                <p className="para">
                  {getInstitutionName(idx)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;