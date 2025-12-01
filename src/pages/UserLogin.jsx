import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../assets/css/losign.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let endpoint = "";
      switch (formData.role) {
        case "student":
          endpoint = "/auth/students/login";
          break;
        case "institute":
          endpoint = "/auth/institutes/login";
          break;
        case "admin":
          endpoint = "/auth/admin/login";
          break;
        default:
          throw new Error("Unknown role");
      }

      console.log('Making login request to:', endpoint);

      const res = await API.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      console.log('Login response:', res.data);

      // Save token & user info in localStorage
      localStorage.setItem("token", res.data.token);
      
      // Handle different response formats
      const userData = res.data.user || res.data.student || res.data.institute || res.data.admin;
      localStorage.setItem("user", JSON.stringify(userData));
      
      setSuccess("Login successful!");

      // Redirect based on role
      if (formData.role === "student") navigate("/student");
      else if (formData.role === "institute") navigate("/institute");
      else if (formData.role === "admin") navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="wrapper">
        <span className="big-animate"></span>
        <div className="aform">
          <div className="form-box login">
            <h2 className="animation">Log In</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
              </div>

              <div className="input-box animation">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
              </div>

              <div className="input-box animation">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="institute">Institute</option>
                  <option value="admin">Admin</option>
                </select>
                <label>Role</label>
              </div>

              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}

              <button type="submit" disabled={loading} className="btn animation">
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="logreg-link animation">
                <p>
                  Don't have an account?{" "}
                  <span className="signup-dropdown">
                    <Link to="/StudentRegistration">Student</Link> |{" "}
                    <Link to="/InstituteRegistor">Institute</Link>
                  </span>
                </p>
              </div>
            </form>
          </div>

          <div className="info-text login">
            <h2>Welcome Back!</h2>
          </div>
        </div>
      </div>
    </main>
  );
}