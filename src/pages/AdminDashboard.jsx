import React, { useState, useEffect } from 'react';
import '../assets/css/ind.css';
import '../assets/css/admin.css';
import '../assets/css/adminhome.css';
import { Link } from "react-router-dom";
import { 
  Users, 
  Home, 
  BookOpen, 
  Settings,
  BarChart3 
} from "lucide-react";

import API from '../api';
import { useNavigate } from 'react-router-dom'; // Add this import

export default function AdminDashboard() {
    const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [facultiesCount, setFacultiesCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Institution");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    address: "",
    contact: "",
    email: "",
    password: "",
  });

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const adminData = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setFilteredInstitutions(institutions);
  }, [institutions]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setModalTitle("Add New Institution");
    setFormData({
      id: "",
      name: "",
      type: "",
      address: "",
      contact: "",
      email: "",
      password: "",
    });
    setModalVisible(true);
  };

  const openEditModal = (inst) => {
    setModalTitle("Edit Institution");
    setFormData({
      id: inst.institute_id,
      name: inst.name,
      type: inst.type,
      address: inst.address,
      contact: inst.contact,
      email: inst.email,
      password: "", // Don't pre-fill password for security
    });
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = { ...formData };

      // Remove empty password field if not updating
      if (!payload.password) {
        delete payload.password;
      }

      if (formData.id) {
        // Update existing institute
        await API.put(`/api/institutions/${formData.id}`, payload);
        alert('Institution updated successfully!');
      } else {
        // Create new institute
        await API.post("/api/institutions", payload);
        alert('Institution added successfully!');
      }

      fetchDashboardData();
      closeModal();
    } catch (err) {
      console.error('Error saving institution:', err);
      alert(err.response?.data?.message || "Error saving institution");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this institution?")) {
      return;
    }

    try {
      await API.delete(`/api/institutions/${id}`);
      alert('Institution deleted successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting institution:', err);
      alert(err.response?.data?.message || "Failed to delete institution");
    }
  };

  const filterTable = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFilteredInstitutions(institutions);
      return;
    };
    
    const filtered = institutions.filter((inst) =>
      Object.values(inst).some((v) =>
        String(v).toLowerCase().includes(value)
      )
    );
    setFilteredInstitutions(filtered);
  };

  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError('');
    console.log('Fetching dashboard data...');

    // Fetch institutions
    const instRes = await API.get("/api/institutions");
    if (instRes.data.success) {
      setInstitutions(instRes.data.data || []);
    }

    // Fetch students
    try {
      const stuRes = await API.get("/api/students");
      if (stuRes.data.success) {
        setStudents(stuRes.data.data || []);
        setStudentsCount(stuRes.data.data?.length || 0);
      }
    } catch (stuErr) {
      console.warn('Could not fetch students:', stuErr);
      setStudentsCount(0);
    }

    // Fetch faculties
    try {
      const facRes = await API.get("/api/faculties");
      if (facRes.data.success) {
        setFacultiesCount(facRes.data.data?.length || 0);
      }
    } catch (facErr) {
      console.warn('Could not fetch faculties:', facErr);
      setFacultiesCount(0);
    }

    // Fetch courses
    try {
      const courseRes = await API.get("/api/courses");
      if (courseRes.data.success) {
        setCoursesCount(courseRes.data.data?.length || 0);
      }
    } catch (courseErr) {
      console.warn('Could not fetch courses:', courseErr);
      setCoursesCount(0);
    }

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    setError(`Failed to load dashboard data: ${err.response?.data?.message || err.message}`);
    
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
  } finally {
    setLoading(false);
  }
};

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    console.log('Token:', localStorage.getItem('token'));
    console.log('Admin data:', localStorage.getItem('admin'));
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '18px'
        }}>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="headerTittle">Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Debug button - remove in production */}
          <button 
            onClick={debugLocalStorage}
            style={{ background: '#666', fontSize: '12px', padding: '5px' }}
          >
            Debug
          </button>
          <button
            className="profilebtn"
            onClick={openProfileModal}
          >
            Profile
          </button>
        </div>
      </header>

      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '1rem', 
          margin: '1rem',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
          <button 
            onClick={fetchDashboardData}
            style={{ marginLeft: '1rem', background: '#c62828', color: 'white' }}
          >
            Retry
          </button>
        </div>
      )}

      <section className="institutions-section">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search institutions..." 
            onChange={filterTable} 
          />
        </div>

        <div className="dashboard-nav">
          <button className="studentbtn">Students</button>
          <button className="coursebtn">Courses</button>
          <button className="facultybtn">Faculties</button>
          <button className="institutebtn">Institutions</button>
        </div>

        <div className="dashboard-cards">
          <div className="card1">
              <h3>Total Institutions</h3>
              <p>{institutions.length}</p>
              <button onClick={() => {
                  const institutionsSection = document.querySelector('.institutions-section');
                  if (institutionsSection) {
                    institutionsSection.scrollIntoView({ behavior: 'smooth' });
                    // Add temporary highlight
                    institutionsSection.style.transition = 'all 0.3s ease';
                    institutionsSection.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
                    setTimeout(() => {
                      institutionsSection.style.boxShadow = 'none';
                    }, 2000);
                  }
                }}>Manage Institutions
              </button>
            </div>
          <div className="card2">
              <h3>Total Faculties</h3>
              <p>{facultiesCount}</p>
              <button onClick={() => navigate('/admin/faculties')}>Manage Faculties</button>
            </div>
          <div className="card3">
            <h3>Total Students</h3>
            <p>{studentsCount}</p>
            <button onClick={() => window.location.href = '/admin/students'}>Manage Students</button>
          </div>
          <div className="card5">
              <h3>Total Courses</h3>
              <p>{coursesCount}</p>
              <button onClick={() => navigate('/admin/courses')}>Manage Courses</button>
            </div>
        </div>

        <div className="table-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Institutions ({institutions.length})</h3>
            <button className="btn-primary" onClick={openAddModal}>
              Add New Institution
            </button>
          </div>

          <Link 
        to="/admin/applications" 
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Users className="w-5 h-5 mr-3" />
        Applications
      </Link>

          <table className="institutions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutions.length > 0 ? (
                filteredInstitutions.map((inst) => (
                  <tr key={inst.institute_id}>
                    <td>{inst.institute_id}</td>
                    <td>{inst.name}</td>
                    <td>{inst.type}</td>
                    <td>{inst.address}</td>
                    <td>{inst.contact}</td>
                    <td>{inst.email}</td>
                    <td>{new Date(inst.createdAt).toLocaleDateString()}</td>
                    <td style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button 
                        className="btn-edit"
                        onClick={() => openEditModal(inst)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(inst.institute_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                    {institutions.length === 0 ? 'No institutions found. Click "Add New Institution" to create one.' : 'No institutions match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add/Edit Institution Modal */}
      {modalVisible && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>{modalTitle}</h3>
            <form className="form-container" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Type --</option>
                  <option value="University">University</option>
                  <option value="College">College</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address:</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact:</label>
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={formData.id ? "Leave blank to keep current password" : "Enter password"}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {formData.id ? "Update" : "Add"} Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileModalVisible && (
        <div className="modal-overlay" onClick={closeProfileModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Admin Profile</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" disabled value={adminData?.name || "Admin"} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" disabled value={adminData?.email || "N/A"} />
            </div>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
              <button className="btn-secondary" onClick={closeProfileModal}>
                Close
              </button>
              <button className="btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}