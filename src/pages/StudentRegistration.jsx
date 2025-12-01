import React, { useState } from 'react';
import API from '../api';
import "../assets/css/StudentRegistor.css";
import "../assets/css/losign.css"; 
import { Link, useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    password: "",
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailVerified(regex.test(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailVerified) {
      alert("Please enter a valid email!");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/students/register", formData);

      setSuccess(res.data.message || "Student registered successfully!");
      
      // Reset form
      setFormData({
        id: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        nationality: "",
        email: "",
        phone: "",
        password: "",
      });
      setEmailVerified(false);

      setTimeout(() => navigate("/user-login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      id: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      nationality: "",
      email: "",
      phone: "",
      password: "",
    });
    setEmailVerified(false);
    setError("");
    setSuccess("");
  };

  return (
    <main>
      <div className="wrapper">
        <span className="big-animate2"></span>

        <div className="aform">
          <div className="form-box Register">
            <h2>REGISTRATION</h2>

            <form onSubmit={handleSubmit}>
              
              <div className="input-box">
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />
                <label>ID</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <label>First Name</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                <label>Last Name</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
                <label>Date of Birth</label>
                <i className="bx bxs-calendar"></i>
              </div>

              <div className="input-box">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <label>Gender</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                />
                <label>Nationality</label>
                <i className="bx bxs-flag"></i>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
                <i className="bx bxs-envelope"></i>
              </div>

              <div className="input-box">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <label>Phone Number</label>
                <i className="bx bxs-phone"></i>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
                <i className="bx bxs-lock-alt"></i>
              </div>

              
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}

              
              <div className="d-btn">
                <button type="reset" name="reset" className="btn" onClick={handleReset}>
                  Reset
                </button>
                <button type="submit" name="signup" className="btn" disabled={loading}>
                  {loading ? "Registering..." : "REGISTOR"}
                </button>
              </div>

              <div className="logreg-link">
                <p>
                  Already registered??{" "}
                  <Link to="/user-login" className="signup-link">
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="info-text register">
            <h2>Student</h2>
          </div>
        </div>
      </div>
    </main>
  );
}