import React, { useState } from 'react';
import API from '../api'; // axios instance pointing to /auth
import '../assets/css/losign.css';

export default function AdminSignup() {
  const [name, setName] = useState(''); // must match backend field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call backend API
      {/*const res = await API.post('/signup', {
        name,      // backend expects 'name'
        email,
        password,
      });*/}

      const res = await API.post('/admin/signup', { name, email, password }); // <--- only /signup now

      alert(res.data.message || 'Admin registered successfully!');

      // Reset form
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <main>
      <div className="wrapper">
        <span className="big-animate2"></span>
        <div className="aform">
          <div className="form-box Register">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="name">Name</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Email</label>
                <i className="bx bxs-envelope"></i>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className="d-btn">
                <button type="button" onClick={handleReset} className="btn">
                  Reset
                </button>
                <button type="submit" name="Admin_signup" className="btn">
                  Sign-up
                </button>
              </div>

              <div className="logreg-link">
                <p>
                  Already registered?{' '}
                  <a href="/admin/login" className="signup-link">
                    Log In
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="info-text register">
            <h2>Sign-Up</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
