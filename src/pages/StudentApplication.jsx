// frontend/src/pages/StudentApplication.jsx
import React, { useState, useEffect } from "react";
import "../assets/css/application.css";

export default function StudentApplication() {
  const [institutes, setInstitutes] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState({
    institutes: true,
    faculties: false,
    courses: false
  });

  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    highSchoolName: "",
    highestQualification: "",
    finalResultsFile: null,
    passportPhoto: null,
    birthCertificate: null,
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianOccupation: "",
  });

  // Fetch institutes from API
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        setDataLoading(prev => ({ ...prev, institutes: true }));
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/institutions`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Raw institutions data:", data);
        
        // Handle different response formats
        let institutionsArray = [];
        
        if (Array.isArray(data)) {
          institutionsArray = data;
        }
        else if (data && data.success && Array.isArray(data.data)) {
          institutionsArray = data.data;
        }
        else if (data && Array.isArray(data.institutions)) {
          institutionsArray = data.institutions;
        }
        else if (data && Array.isArray(data.results)) {
          institutionsArray = data.results;
        }
        else {
          console.error("Unexpected institutions data format:", data);
          institutionsArray = [];
        }
        
        console.log("Processed institutions:", institutionsArray);
        setInstitutes(institutionsArray);
        
      } catch (error) {
        console.error('Error fetching institutions:', error);
        alert('Failed to load institutions. Please refresh the page.');
        setInstitutes([]);
      } finally {
        setDataLoading(prev => ({ ...prev, institutes: false }));
      }
    };
    
    fetchInstitutes();
  }, []);

  // Fetch faculties based on selected institute
  useEffect(() => {
    const fetchFaculties = async () => {
      if (!selectedInstitute) {
        setFaculties([]);
        return;
      }

      try {
        setDataLoading(prev => ({ ...prev, faculties: true }));
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/faculties`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Raw faculties data:", data);
        
        // Handle different response formats
        let facultiesArray = [];
        
        if (Array.isArray(data)) {
          facultiesArray = data;
        }
        else if (data && data.success && Array.isArray(data.data)) {
          facultiesArray = data.data;
        }
        else if (data && Array.isArray(data.faculties)) {
          facultiesArray = data.faculties;
        }
        else if (data && Array.isArray(data.results)) {
          facultiesArray = data.results;
        }
        else {
          console.error("Unexpected faculties data format:", data);
          facultiesArray = [];
        }

        // Filter faculties by selected institute
        const filteredFaculties = facultiesArray.filter(faculty => 
          faculty.institute_id == selectedInstitute
        );
        
        console.log("Filtered faculties for institute:", selectedInstitute, filteredFaculties);
        setFaculties(filteredFaculties);
        
      } catch (error) {
        console.error('Error fetching faculties:', error);
        alert('Failed to load faculties.');
        setFaculties([]);
      } finally {
        setDataLoading(prev => ({ ...prev, faculties: false }));
      }
    };

    fetchFaculties();
  }, [selectedInstitute]);

  // Fetch courses based on selected faculty
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedFaculty) {
        setCourses([]);
        return;
      }

      try {
        setDataLoading(prev => ({ ...prev, courses: true }));
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Raw courses data:", data);
        
        // Handle different response formats
        let coursesArray = [];
        
        if (Array.isArray(data)) {
          coursesArray = data;
        }
        else if (data && data.success && Array.isArray(data.data)) {
          coursesArray = data.data;
        }
        else if (data && Array.isArray(data.courses)) {
          coursesArray = data.courses;
        }
        else if (data && Array.isArray(data.results)) {
          coursesArray = data.results;
        }
        else {
          console.error("Unexpected courses data format:", data);
          coursesArray = [];
        }

        // Filter courses by selected faculty
        const filteredCourses = coursesArray.filter(course => 
          course.faculty_id == selectedFaculty
        );
        
        console.log("Filtered courses for faculty:", selectedFaculty, filteredCourses);
        setCourses(filteredCourses);
        
      } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Failed to load courses.');
        setCourses([]);
      } finally {
        setDataLoading(prev => ({ ...prev, courses: false }));
      }
    };

    fetchCourses();
  }, [selectedFaculty]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a JSON object instead of FormData
    const applicationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      nationality: formData.nationality,
      email: formData.email,
      phone: formData.phone,
      highSchoolName: formData.highSchoolName,
      highestQualification: formData.highestQualification,
      guardianName: formData.guardianName,
      guardianRelationship: formData.guardianRelationship,
      guardianPhone: formData.guardianPhone,
      guardianOccupation: formData.guardianOccupation,
      institution_id: parseInt(selectedInstitute),
      faculty_id: parseInt(selectedFaculty),
      course_id: parseInt(selectedCourse)
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student-applications`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert("Application submitted successfully!");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
          nationality: "",
          email: "",
          phone: "",
          highSchoolName: "",
          highestQualification: "",
          finalResultsFile: null,
          passportPhoto: null,
          birthCertificate: null,
          guardianName: "",
          guardianRelationship: "",
          guardianPhone: "",
          guardianOccupation: "",
        });
        setSelectedInstitute("");
        setSelectedFaculty("");
        setSelectedCourse("");
      } else {
        alert("Failed to submit application: " + (result.message || result.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Failed to submit application. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.dateOfBirth &&
      formData.gender &&
      formData.nationality &&
      formData.email &&
      formData.phone &&
      formData.highSchoolName &&
      formData.highestQualification &&
      formData.guardianName &&
      formData.guardianRelationship &&
      formData.guardianPhone &&
      selectedInstitute &&
      selectedFaculty &&
      selectedCourse
    );
  };

  // Loading component for dropdowns
  const LoadingOption = ({ text = "Loading..." }) => (
    <option value="" disabled>
      {text}
    </option>
  );

  // Helper function to get display name for entities
  const getDisplayName = (item) => {
    return item.faculty_name || item.name || item.course_name || 'Unnamed';
  };

  // Helper function to get ID for entities
  const getId = (item) => {
    return item.faculty_id || item.institute_id || item.id || item.course_id;
  };

  return (
    <div className="application-container">
      <h1 className="form-title">
        <span>Student</span> Application Form
      </h1>
      <p className="form-sub">
        Apply to your preferred institute by filling in all the required information below.
      </p>

      <form className="application-form" onSubmit={handleSubmit}>
        {/* INSTITUTE SELECTION */}
        <section className="form-section">
          <h2>Institute Selection</h2>
          
          {/* Institution Selection */}
          <div className="input-group">
            <label>Select Institution</label>
            <select
              value={selectedInstitute}
              onChange={(e) => {
                setSelectedInstitute(e.target.value);
                setSelectedFaculty("");
                setSelectedCourse("");
              }}
              required
              disabled={loading || dataLoading.institutes}
            >
              <option value="">Choose Institute</option>
              {dataLoading.institutes ? (
                <LoadingOption text="Loading institutions..." />
              ) : institutes.length > 0 ? (
                institutes.map((institute) => (
                  <option key={getId(institute)} value={getId(institute)}>
                    {getDisplayName(institute)}
                  </option>
                ))
              ) : (
                <option value="" disabled>No institutions available</option>
              )}
            </select>
            {dataLoading.institutes && (
              <small style={{color: '#666', fontSize: '12px'}}>Loading institutions...</small>
            )}
            {!dataLoading.institutes && institutes.length === 0 && (
              <small style={{color: 'red', fontSize: '12px'}}>No institutions found in database</small>
            )}
            {!dataLoading.institutes && institutes.length > 0 && (
              <small style={{color: 'green', fontSize: '12px'}}>Found {institutes.length} institutions</small>
            )}
          </div>

          {/* Faculty Selection */}
          {selectedInstitute && (
            <div className="input-group">
              <label>Select Faculty</label>
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  setSelectedCourse("");
                }}
                required
                disabled={loading || dataLoading.faculties}
              >
                <option value="">Choose Faculty</option>
                {dataLoading.faculties ? (
                  <LoadingOption text="Loading faculties..." />
                ) : faculties.length > 0 ? (
                  faculties.map((faculty) => (
                    <option key={getId(faculty)} value={getId(faculty)}>
                      {getDisplayName(faculty)} - {faculty.department || 'No Department'}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No faculties available for this institution</option>
                )}
              </select>
              {dataLoading.faculties && (
                <small style={{color: '#666', fontSize: '12px'}}>Loading faculties...</small>
              )}
              {!dataLoading.faculties && faculties.length > 0 && (
                <small style={{color: 'green', fontSize: '12px'}}>Found {faculties.length} faculties</small>
              )}
              {!dataLoading.faculties && faculties.length === 0 && selectedInstitute && (
                <small style={{color: 'orange', fontSize: '12px'}}>No faculties found for selected institution</small>
              )}
            </div>
          )}

          {/* Course Selection */}
          {selectedFaculty && (
            <div className="input-group">
              <label>Select Course</label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)} 
                required
                disabled={loading || dataLoading.courses}
              >
                <option value="">Choose Course</option>
                {dataLoading.courses ? (
                  <LoadingOption text="Loading courses..." />
                ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <option key={getId(course)} value={getId(course)}>
                      {getDisplayName(course)} - {course.duration || 'No Duration'}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No courses available for this faculty</option>
                )}
              </select>
              {dataLoading.courses && (
                <small style={{color: '#666', fontSize: '12px'}}>Loading courses...</small>
              )}
              {!dataLoading.courses && courses.length > 0 && (
                <small style={{color: 'green', fontSize: '12px'}}>Found {courses.length} courses</small>
              )}
              {!dataLoading.courses && courses.length === 0 && selectedFaculty && (
                <small style={{color: 'orange', fontSize: '12px'}}>No courses found for selected faculty</small>
              )}
            </div>
          )}
        </section>

        {/* REST OF YOUR FORM SECTIONS - Keep them exactly as they were */}
        {/* PERSONAL INFORMATION */}
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="grid-2">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="input-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Gender</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                required
                disabled={loading}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="input-group">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                placeholder="Lesotho"
                value={formData.nationality}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+266 50000000"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* ACADEMIC INFORMATION */}
        <section className="form-section">
          <h2>Academic Information</h2>
          <div className="input-group">
            <label>High School Name</label>
            <input
              type="text"
              name="highSchoolName"
              placeholder="St. Mary's High School"
              value={formData.highSchoolName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Highest Qualification</label>
              <select
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Qualification</option>
                <option value="JC">JC</option>
                <option value="IGCSE/LGCSE">IGCSE/LGCSE</option>
                <option value="A-Level">A-Level</option>
              </select>
            </div>

            <div className="input-group">
              <label>Final Results (PDF)</label>
              <input
                type="file"
                name="finalResultsFile"
                onChange={handleChange}
                accept="application/pdf"
                disabled={loading}
              />
              <small style={{color: '#666', fontSize: '12px'}}>Optional for now</small>
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Passport Photo</label>
              <input 
                type="file" 
                name="passportPhoto" 
                onChange={handleChange} 
                accept="image/*" 
                disabled={loading}
              />
              <small style={{color: '#666', fontSize: '12px'}}>Optional for now</small>
            </div>

            <div className="input-group">
              <label>Birth Certificate</label>
              <input 
                type="file" 
                name="birthCertificate" 
                onChange={handleChange} 
                accept="application/pdf,image/*" 
                disabled={loading}
              />
              <small style={{color: '#666', fontSize: '12px'}}>Optional for now</small>
            </div>
          </div>
        </section>

        {/* GUARDIAN INFORMATION */}
        <section className="form-section">
          <h2>Parent / Guardian Information</h2>
          <div className="grid-2">
            <div className="input-group">
              <label>Guardian Full Name</label>
              <input
                type="text"
                name="guardianName"
                placeholder="Jane Doe"
                value={formData.guardianName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Relationship</label>
              <input
                type="text"
                name="guardianRelationship"
                placeholder="Mother, Father"
                value={formData.guardianRelationship}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Guardian Phone</label>
              <input
                type="tel"
                name="guardianPhone"
                placeholder="+266 50000000"
                value={formData.guardianPhone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Guardian Occupation</label>
              <input
                type="text"
                name="guardianOccupation"
                placeholder="Teacher"
                value={formData.guardianOccupation}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
        </section>

        <button 
          className="submit-btn" 
          type="submit"
          disabled={loading || !isFormValid()}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}