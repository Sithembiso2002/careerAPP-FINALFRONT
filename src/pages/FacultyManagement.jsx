import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/css/admin.css';
import '../assets/css/ind.css';
import '../assets/css/adminhome.css';
import '../assets/css/faculty-management.css';

export default function FacultyManagement() {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [facultiesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [modalType, setModalType] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    faculty_name: '',
    faculty_code: '',
    department: '',
    email: '',
    phone: '',
    office_location: '',
    specialization: '',
    status: 'Active',
    institute_id: '' // ADDED: Institution field
  });

  const [formErrors, setFormErrors] = useState({});

  // Define filterFaculties first using useCallback
  const filterFaculties = useCallback(() => {
    let filtered = faculties;
    
    if (searchTerm.trim()) {
      filtered = faculties.filter(faculty =>
        Object.values(faculty).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredFaculties(filtered);
    setCurrentPage(1);
  }, [faculties, searchTerm]);

  // Fetch institutions
  const fetchInstitutions = async () => {
    try {
      //const response = await API.get('/api/institutions');
      const response = await API.get('/api/institutions');
      if (response.data.success) {
        setInstitutions(response.data.data);
      } else {
        console.error('Failed to fetch institutions:', response.data.message);
      }
    } catch (err) {
      console.error('Error fetching institutions:', err);
    }
  };

  

  // Then use it in useEffect
  useEffect(() => {
    fetchFaculties();
    fetchInstitutions(); // ADDED: Fetch institutions on component mount
  }, []);

  useEffect(() => {
    filterFaculties();
  }, [faculties, searchTerm, filterFaculties]);

  // Fetch faculties from API
  const fetchFaculties = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching faculties from API...');
      const response = await API.get('/api/faculties');
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setFaculties(response.data.data);
        console.log(`Successfully loaded ${response.data.data.length} faculties`);
      } else {
        throw new Error(response.data.message || 'Failed to fetch faculties');
      }
    } catch (err) {
      console.error('Error fetching faculties:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch faculties';
      setError(errorMessage);
      
      // If it's a network error, show specific message
      if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please check if the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ADDED: Get institution name by ID
  const getInstitutionName = (instituteId) => {
  const institution = institutions.find(inst => inst.institute_id == instituteId);
  return institution ? institution.name : 'Not assigned';
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFaculties = React.useMemo(() => {
    if (!sortConfig.key) return filteredFaculties;

    return [...filteredFaculties].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredFaculties, sortConfig]);

  // Pagination
  const indexOfLastFaculty = currentPage * facultiesPerPage;
  const indexOfFirstFaculty = indexOfLastFaculty - facultiesPerPage;
  const currentFaculties = sortedFaculties.slice(indexOfFirstFaculty, indexOfLastFaculty);
  const totalPages = Math.ceil(sortedFaculties.length / facultiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.faculty_name.trim()) {
      errors.faculty_name = 'Faculty name is required';
    }
    
    if (!formData.faculty_code.trim()) {
      errors.faculty_code = 'Faculty code is required';
    }
    
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    // ADDED: Institution validation
    if (!formData.institute_id) {
      errors.institute_id = 'Institution is required';
    }
    
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setModalType('add');
    setFormData({
      faculty_name: '',
      faculty_code: '',
      department: '',
      email: '',
      phone: '',
      office_location: '',
      specialization: '',
      status: 'Active',
      institute_id: '' // ADDED: Reset institution field
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const openEditModal = (faculty) => {
    setModalType('edit');
    setSelectedFaculty(faculty);
    setFormData({
      faculty_name: faculty.faculty_name,
      faculty_code: faculty.faculty_code,
      department: faculty.department,
      email: faculty.email,
      phone: faculty.phone,
      office_location: faculty.office_location,
      specialization: faculty.specialization,
      status: faculty.status,
      institute_id: faculty.institute_id || '' // ADDED: Include institution
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const openViewModal = (faculty) => {
    setSelectedFaculty(faculty);
    setViewModalVisible(true);
  };

  const openDeleteModal = (faculty) => {
    setSelectedFaculty(faculty);
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setViewModalVisible(false);
    setDeleteModalVisible(false);
    setSelectedFaculty(null);
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Submit faculty data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (modalType === 'add') {
        const response = await API.post('/api/faculties', formData);
        
        if (response.data.success) {
          // Refresh the faculties list to get the latest data
          await fetchFaculties();
          closeModal();
        } else {
          throw new Error(response.data.message || 'Failed to create faculty');
        }
      } else {
        const response = await API.put(`/api/faculties/${selectedFaculty.faculty_id}`, formData);
        
        if (response.data.success) {
          // Refresh the faculties list to get the latest data
          await fetchFaculties();
          closeModal();
        } else {
          throw new Error(response.data.message || 'Failed to update faculty');
        }
      }
    } catch (err) {
      console.error('Error saving faculty:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save faculty';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete faculty via API
  const handleDelete = async () => {
    try {
      const response = await API.delete(`/api/faculties/${selectedFaculty.faculty_id}`);
      
      if (response.data.success) {
        // Refresh the faculties list to get the latest data
        await fetchFaculties();
        setSelectedFaculties(prev => prev.filter(id => id !== selectedFaculty.faculty_id));
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to delete faculty');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete faculty';
      setError(errorMessage);
      console.error('Error deleting faculty:', err);
    }
  };

  const handleSelectFaculty = (facultyId) => {
    setSelectedFaculties(prev =>
      prev.includes(facultyId)
        ? prev.filter(id => id !== facultyId)
        : [...prev, facultyId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFaculties(currentFaculties.map(faculty => faculty.faculty_id));
    } else {
      setSelectedFaculties([]);
    }
  };

  const exportFaculties = () => {
    const data = selectedFaculties.length > 0 
      ? faculties.filter(faculty => selectedFaculties.includes(faculty.faculty_id))
      : faculties;
    
    if (data.length === 0) {
      setError('No data to export');
      return;
    }
    
    const csv = convertToCSV(data);
    downloadCSV(csv, `faculties_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Faculty Name', 'Faculty Code', 'Department', 'Email', 'Phone', 'Office Location', 'Specialization', 'Status', 'Institution', 'Created Date'];
    const rows = data.map(faculty => [
      faculty.faculty_id,
      `"${faculty.faculty_name}"`,
      faculty.faculty_code,
      `"${faculty.department}"`,
      faculty.email,
      faculty.phone,
      `"${faculty.office_location}"`,
      `"${faculty.specialization}"`,
      faculty.status,
      `"${getInstitutionName(faculty.institute_id)}"`, // ADDED: Institution name
      faculty.createdAt
    ]);
    const fetchInstitutions = async () => {
  try {
    const response = await API.get('/api/institutions');
    console.log('Institutions API response:', response.data); // ADD THIS LINE
    if (response.data.success) {
      setInstitutions(response.data.data);
    } else {
      console.error('Failed to fetch institutions:', response.data.message);
    }
  } catch (err) {
    console.error('Error fetching institutions:', err);
  }
};
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearError = () => {
    setError('');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading faculties...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Faculty Management</h2>
        <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search faculties..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={openAddModal}>
            + Add Faculty
          </button>
          <button 
            className="btn-secondary" 
            onClick={exportFaculties}
            disabled={faculties.length === 0}
          >
            📊 Export CSV
          </button>
          {selectedFaculties.length > 0 && (
            <span className="selected-count">
              {selectedFaculties.length} selected
            </span>
          )}
        </div>
      </div>

      {/* Statistics Cards - UPDATED: Added institution count */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Faculties</h3>
          <p className="stat-number">{faculties.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Faculties</h3>
          <p className="stat-number">
            {faculties.filter(f => f.status === 'Active').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Departments</h3>
          <p className="stat-number">
            {new Set(faculties.map(f => f.department)).size}
          </p>
        </div>
        <div className="stat-card">
          <h3>Institutions</h3>
          <p className="stat-number">
            {new Set(faculties.map(f => f.institute_id).filter(id => id)).size}
          </p>
        </div>
      </div>

      {/* Faculties Table - UPDATED: Added Institution column */}
      <div className="table-container">
        <table className="faculties-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={currentFaculties.length > 0 && selectedFaculties.length === currentFaculties.length}
                  disabled={currentFaculties.length === 0}
                />
              </th>
              <th onClick={() => handleSort('faculty_code')} className="sortable">
                Code {sortConfig.key === 'faculty_code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('faculty_name')} className="sortable">
                Faculty Name {sortConfig.key === 'faculty_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('department')} className="sortable">
                Department {sortConfig.key === 'department' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Institution</th> {/* ADDED: Institution column */}
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFaculties.length > 0 ? (
              currentFaculties.map((faculty) => (
                <tr key={faculty.faculty_id} className={selectedFaculties.includes(faculty.faculty_id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedFaculties.includes(faculty.faculty_id)}
                      onChange={() => handleSelectFaculty(faculty.faculty_id)}
                    />
                  </td>
                  <td>
                    <span className="faculty-code">{faculty.faculty_code}</span>
                  </td>
                  <td>
                    <div className="faculty-info">
                      <strong>{faculty.faculty_name}</strong>
                      <small>{faculty.specialization}</small>
                    </div>
                  </td>
                  <td>{faculty.department}</td>
                  <td>
                    <span className="institution-badge">
                      {getInstitutionName(faculty.institute_id)}
                    </span>
                  </td>
                  <td>
                    <a href={`mailto:${faculty.email}`} className="email-link">
                      {faculty.email}
                    </a>
                  </td>
                  <td>
                    <span className={`status-badge ${faculty.status.toLowerCase()}`}>
                      {faculty.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => openViewModal(faculty)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => openEditModal(faculty)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => openDeleteModal(faculty)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data"> {/* UPDATED: colSpan from 7 to 8 */}
                  {searchTerm ? 'No faculties match your search' : 'No faculties found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Add/Edit Modal - UPDATED: Added Institution field */}
      {modalVisible && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Add New Faculty' : 'Edit Faculty'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Faculty Name *</label>
                  <input
                    type="text"
                    name="faculty_name"
                    value={formData.faculty_name}
                    onChange={handleInputChange}
                    required
                    className={formErrors.faculty_name ? 'error' : ''}
                  />
                  {formErrors.faculty_name && (
                    <span className="error-text">{formErrors.faculty_name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Faculty Code *</label>
                  <input
                    type="text"
                    name="faculty_code"
                    value={formData.faculty_code}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., CS, BA, ME"
                    className={formErrors.faculty_code ? 'error' : ''}
                  />
                  {formErrors.faculty_code && (
                    <span className="error-text">{formErrors.faculty_code}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className={formErrors.department ? 'error' : ''}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Law">Law</option>
                  </select>
                  {formErrors.department && (
                    <span className="error-text">{formErrors.department}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && (
                    <span className="error-text">{formErrors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && (
                    <span className="error-text">{formErrors.phone}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Office Location</label>
                  <input
                    type="text"
                    name="office_location"
                    value={formData.office_location}
                    onChange={handleInputChange}
                    placeholder="Building, Room Number"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Artificial Intelligence, Marketing, Robotics"
                  />
                </div>
                {/* ADDED: Institution field */}
                <div className="form-group">
                  <label>Institution *</label>
                  <select
                    name="institute_id"
                    value={formData.institute_id}
                    onChange={handleInputChange}
                    required
                    className={formErrors.institute_id ? 'error' : ''}
                  >
                    <option value="">Select Institution</option>
                    {institutions.map((institution) => (
                        <option key={institution.institute_id} value={institution.institute_id}>
                            {institution.name}
                        </option>
                        ))}
                  </select>
                  {formErrors.institute_id && (
                    <span className="error-text">{formErrors.institute_id}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (modalType === 'add' ? 'Add Faculty' : 'Update Faculty')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal - UPDATED: Added Institution in details */}
      {viewModalVisible && selectedFaculty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Faculty Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="faculty-details">
              <div className="detail-header">
                <h4>{selectedFaculty.faculty_name} ({selectedFaculty.faculty_code})</h4>
                <span className={`status-badge large ${selectedFaculty.status.toLowerCase()}`}>
                  {selectedFaculty.status}
                </span>
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedFaculty.department}</span>
                </div>
                {/* ADDED: Institution detail */}
                <div className="detail-item">
                  <span className="detail-label">Institution:</span>
                  <span className="detail-value">{getInstitutionName(selectedFaculty.institute_id)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <a href={`mailto:${selectedFaculty.email}`} className="detail-value email-link">
                    {selectedFaculty.email}
                  </a>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedFaculty.phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Office Location:</span>
                  <span className="detail-value">{selectedFaculty.office_location || 'N/A'}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Specialization:</span>
                  <span className="detail-value">{selectedFaculty.specialization || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{new Date(selectedFaculty.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && selectedFaculty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <p>Are you sure you want to delete faculty <strong>{selectedFaculty.faculty_name}</strong>?</p>
            <p className="warning-text">This action cannot be undone and may affect associated courses and students.</p>
            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleDelete} className="btn-danger">
                Delete Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}const response = await API.get('/api/institutions');