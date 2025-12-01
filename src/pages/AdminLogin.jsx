// frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import '../assets/css/losign.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call backend login API
      //const res = await API.post('/admin/login', { email, password });
      const res = await API.post('/admin/login', { email, password }); // <--- only /login now


      // Save token to localStorage
      localStorage.setItem('token', res.data.token);

      // Save admin info to localStorage
      localStorage.setItem('admin', JSON.stringify(res.data.admin));

      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (error) {
      // Show backend message if available
      alert(error.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <main>
      <div className="wrapper">
        <span className="big-animate"></span>
        <div className="aform">
          <div className="form-box login">
            <h2 className="animation">LogIn</h2>
            <form onSubmit={handleLogin}>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box animation">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <i className="bx bxs-lock-alt"></i>
              </div>

              <button type="submit" className="btn animation">
                Login
              </button>

              <div className="logreg-link animation">
                <p>
                  Don't have an account?{' '}
                  <Link to="/admin/signup" className="signup-link">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="info-text login">
            <h2>LogIn</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
