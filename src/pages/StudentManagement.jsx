import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/css/admin.css';
import '../assets/css/ind.css';
import '../assets/css/adminhome.css';
import '../assets/css/student-management.css';

export default function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    password: 'default123' // Add default password
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/students');
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = students.filter(student =>
        Object.values(student).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredStudents(filtered);
    setCurrentPage(1);
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

  const sortedStudents = React.useMemo(() => {
    if (!sortConfig.key) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredStudents, sortConfig]);

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAddModal = () => {
    setModalType('add');
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      nationality: '',
      password: 'default123' // Include password in add modal
    });
    setModalVisible(true);
  };

  const openEditModal = (student) => {
    setModalType('edit');
    setSelectedStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone,
      date_of_birth: student.date_of_birth,
      gender: student.gender,
      nationality: student.nationality,
      password: '' // Leave empty for edit (don't change password unless specified)
    });
    setModalVisible(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setViewModalVisible(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setViewModalVisible(false);
    setDeleteModalVisible(false);
    setSelectedStudent(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting student data:', formData);
      
      let response;
      if (modalType === 'add') {
        response = await API.post('/api/students', formData);
        console.log('Add student response:', response.data);
      } else {
        // For edit, only send password if it's not empty
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Remove password if empty to keep current one
        }
        response = await API.put(`/api/students/${selectedStudent.student_id}`, updateData);
        console.log('Edit student response:', response.data);
      }
      
      fetchStudents();
      closeModal();
    } catch (err) {
      console.error('Error saving student:', err);
      console.error('Error response data:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/api/students/${selectedStudent.student_id}`);
      fetchStudents();
      closeModal();
    } catch (err) {
      setError('Failed to delete student');
      console.error('Error deleting student:', err);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(currentStudents.map(student => student.student_id));
    } else {
      setSelectedStudents([]);
    }
  };

  const exportStudents = () => {
    const data = selectedStudents.length > 0 
      ? students.filter(student => selectedStudents.includes(student.student_id))
      : students;
    
    const csv = convertToCSV(data);
    downloadCSV(csv, 'students.csv');
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Nationality', 'Date of Birth'];
    const rows = data.map(student => [
      student.student_id,
      student.first_name,
      student.last_name,
      student.email,
      student.phone,
      student.gender,
      student.nationality,
      student.date_of_birth
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading students...</div>
      </div>
    );
  }

  

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Student Management</h2>
        <button className="btn-back" onClick={() => {
  console.log('Navigate function:', navigate);
  console.log('Attempting to navigate to Admin Dashboard');
  navigate('/admin/dashboard');
}}>
  ← Back to Dashboard
</button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={openAddModal}>
            Add Student
          </button>
          <button 
            className="btn-secondary" 
            onClick={exportStudents}
            disabled={students.length === 0}
          >
            Export CSV
          </button>
          {selectedStudents.length > 0 && (
            <span className="selected-count">
              {selectedStudents.length} selected
            </span>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{students.length}</p>
        </div>
        <div className="stat-card">
          <h3>Male Students</h3>
          <p className="stat-number">
            {students.filter(s => s.gender === 'Male').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Female Students</h3>
          <p className="stat-number">
            {students.filter(s => s.gender === 'Female').length}
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedStudents.length === currentStudents.length && currentStudents.length > 0}
                />
              </th>
              <th onClick={() => handleSort('student_id')} className="sortable">
                ID {sortConfig.key === 'student_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('first_name')} className="sortable">
                First Name {sortConfig.key === 'first_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('last_name')} className="sortable">
                Last Name {sortConfig.key === 'last_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('gender')} className="sortable">
                Gender {sortConfig.key === 'gender' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.student_id} className={selectedStudents.includes(student.student_id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.student_id)}
                      onChange={() => handleSelectStudent(student.student_id)}
                    />
                  </td>
                  <td>{student.student_id}</td>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className={`gender-badge ${student.gender.toLowerCase()}`}>
                      {student.gender}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => openViewModal(student)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => openEditModal(student)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => openDeleteModal(student)}
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
                <td colSpan="7" className="no-data">
                  No students found
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
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalVisible && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalType === 'add' ? 'Add New Student' : 'Edit Student'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Nationality *</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Password Field - Required for Add, Optional for Edit */}
                <div className="form-group full-width">
                  <label>Password {modalType === 'add' ? '*' : ''}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalType === 'add'}
                    placeholder={modalType === 'add' ? "Enter password for student" : "Leave blank to keep current password"}
                  />
                  {modalType === 'edit' && (
                    <small style={{color: '#666', fontSize: '0.8rem'}}>
                      Leave blank if you don't want to change the password
                    </small>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {modalType === 'add' ? 'Add Student' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalVisible && selectedStudent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Student Details</h3>
            <div className="student-details">
              <div className="detail-row">
                <span className="detail-label">Student ID:</span>
                <span className="detail-value">{selectedStudent.student_id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedStudent.first_name} {selectedStudent.last_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedStudent.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedStudent.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{selectedStudent.gender}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nationality:</span>
                <span className="detail-value">{selectedStudent.nationality}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">{selectedStudent.date_of_birth}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Registered:</span>
                <span className="detail-value">
                  {new Date(selectedStudent.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && selectedStudent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete student <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleDelete} className="btn-danger">
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}