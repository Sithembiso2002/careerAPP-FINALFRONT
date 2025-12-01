import React, { useState } from "react";
import API from "../api";
import "../assets/css/losign.css"; 
import { Link, useNavigate } from "react-router-dom";

export default function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    address: "",
    contact: "",
    email: "",
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
      const res = await API.post("/auth/institutes/signup", formData);

      setSuccess(res.data.message || "Institute registered successfully!");

      // Reset form
      setFormData({
        id: "",
        name: "",
        type: "",
        address: "",
        contact: "",
        email: "",
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
      name: "",
      type: "",
      address: "",
      contact: "",
      email: "",
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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label>Name</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Technical">Technical</option>
                </select>
                <label>Type</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                <label>Address</label>
                <i className="bx bxs-map"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
                <label>Contact</label>
                <i className="bx bxs-phone"></i>
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
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
                <i className="bx bxs-lock"></i>
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
            <h2>Intitution</h2>
          </div>
        </div>
      </div>
    </main>
  );
}